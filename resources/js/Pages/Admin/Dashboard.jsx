import React, { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { navItems } from './navItems';
import DashboardHome from './pages/DashboardHome';
import VendorManagement from './pages/VendorManagement';
import UserManagement from './pages/UserManagement';
import ReviewModeration from './pages/ReviewModeration';
import StaticContentManagement from './pages/StaticContentManagement';
import RoleEditor from './pages/RoleEditor';
import PaymentSettings from './pages/PaymentSettings';
import PaymentConfirmation from './pages/PaymentConfirmation';

import { fetchVendors, fetchReviews, fetchUsers, fetchStaticContent, fetchPaymentRequests,
         updateVendorStatus, deleteVendor, updateReviewStatus, deleteReview, updateUserStatus, deleteUser,
         updatePaymentRequestStatus, deletePaymentRequest, saveStaticContent, updateVendorRole } from './data/api';

import showPopup from './components/Popup';
import { PRIMARY_COLOR, ACCENT_COLOR } from './data/constants';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Views and state
  const [vendorView, setVendorView] = useState('Pending');
  const [userView, setUserView] = useState('Active');
  const [reviewView, setReviewView] = useState('Pending');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [vendors, setVendors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [staticContent, setStaticContent] = useState({});
  const [paymentRequests, setPaymentRequests] = useState([]);

  // static content editor states
  const [editingContent, setEditingContent] = useState(null);
  const [editorValue, setEditorValue] = useState('');

  // payment & role
  const [paymentSettings, setPaymentSettings] = useState({ bankAccount: '1234567890 - Bank Contoh', qrisImage: null });
  const [roleEdits, setRoleEdits] = useState({});
  const [isPaymentEditOpen, setIsPaymentEditOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ bankAccount: '', qrisImage: null });

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [v, r, u, c, p] = await Promise.all([fetchVendors(), fetchReviews(), fetchUsers(), fetchStaticContent(), fetchPaymentRequests()]);
        setVendors(v);
        setReviews(r);
        setUsers(u);
        setStaticContent(c);
        setPaymentRequests(p);
      } catch (e) {
        console.error('Error loading data', e);
        setError('Gagal memuat data. Mohon periksa koneksi atau API.');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // Handlers (re-using api mock functions)
  const handleVendorAction = async (id, status) => {
    const actionName = status === 'delete' ? 'menghapus' : status === 'Approved' ? 'menyetujui' : 'menolak';
    if (!window.confirm(`Apakah Anda yakin ingin ${actionName} vendor ID: ${id}?`)) return;
    try {
      if (status === 'delete') {
        await deleteVendor(id);
        setVendors(prev => prev.filter(x => x.id !== id));
      } else {
        await updateVendorStatus(id, status);
        setVendors(prev => prev.map(v => v.id === id ? { ...v, status } : v));
      }
    } catch (e) {
      console.error(e);
      setError('Aksi vendor gagal.');
    }
  };

  const handleReviewAction = async (id, status) => {
    const actionName = status === 'delete' ? 'menghapus' : status === 'Approved' ? 'menyetujui' : 'menolak';
    if (!window.confirm(`Apakah Anda yakin ingin ${actionName} ulasan ID: ${id}?`)) return;
    try {
      if (status === 'delete') {
        await deleteReview(id);
        setReviews(prev => prev.filter(r => r.id !== id));
      } else {
        await updateReviewStatus(id, status);
        setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      }
    } catch (e) {
      console.error(e);
      setError('Aksi ulasan gagal.');
    }
  };

  const handleUserAction = async (id, action) => {
    const actionName = action === 'delete' ? 'menghapus' : action === 'Suspended' ? 'menangguhkan' : 'mengaktifkan';
    if (!window.confirm(`Apakah Anda yakin ingin ${actionName} pengguna ID: ${id}?`)) return;
    try {
      if (action === 'delete') {
        await deleteUser(id);
        setUsers(prev => prev.filter(u => u.id !== id));
      } else {
        await updateUserStatus(id, action);
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: action } : u));
      }
    } catch (e) {
      console.error(e);
      setError('Aksi pengguna gagal.');
    }
  };

  const handlePaymentAction = async (id, action) => {
    const actionName = action === 'delete' ? 'menghapus' : action === 'Confirmed' ? 'mengonfirmasi' : 'menolak';
    if (!window.confirm(`Apakah Anda yakin ingin ${actionName} permintaan pembayaran ID: ${id}?`)) return;
    try {
      if (action === 'delete') {
        await deletePaymentRequest(id);
        setPaymentRequests(prev => prev.filter(p => p.id !== id));
        showPopup('Permintaan pembayaran dihapus.');
      } else {
        await updatePaymentRequestStatus(id, action);
        setPaymentRequests(prev => prev.map(p => p.id === id ? { ...p, status: action } : p));
        showPopup('Status permintaan pembayaran diperbarui.');
      }
    } catch (e) {
      console.error(e);
      setError('Aksi pembayaran gagal.');
    }
  };

  const handleStaticContentSave = async () => {
    if (!editingContent) return;
    if (!window.confirm(`Simpan perubahan untuk ${editingContent}?`)) return;
    try {
      await saveStaticContent(editingContent, editorValue);
      setStaticContent(prev => ({ ...prev, [editingContent]: editorValue }));
      setEditingContent(null);
      showPopup('Konten statis diperbarui.');
    } catch (e) {
      console.error(e);
      setError('Gagal menyimpan konten statis.');
    }
  };

  const handleSaveRoles = async () => {
    const entries = Object.entries(roleEdits);
    if (entries.length === 0) { showPopup('Tidak ada perubahan role yang disimpan.'); return; }
    if (!window.confirm('Simpan perubahan role untuk vendor yang dipilih?')) return;
    try {
      for (const [id, role] of entries) {
        await updateVendorRole(id, role);
        setVendors(prev => prev.map(v => v.id === id ? { ...v, role } : v));
      }
      setRoleEdits({});
      showPopup('Perubahan role berhasil disimpan.');
    } catch (e) {
      console.error(e);
      setError('Gagal menyimpan role.');
    }
  };

  const handleSavePayment = async () => {
    if (!window.confirm('Simpan perubahan pembayaran (rekening / QRIS)?')) return;
    try {
      // simulation
      showPopup('Pengaturan pembayaran disimpan.');
    } catch (e) {
      console.error(e);
      setError('Gagal menyimpan payment settings.');
    }
  };

  const handleQrisUpload = (file, setter = setPaymentSettings) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setter(prev => ({ ...prev, qrisImage: e.target.result }));
    reader.readAsDataURL(file);
  };

  const handlePaymentFormQrisUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setPaymentForm(prev => ({ ...prev, qrisImage: e.target.result }));
    reader.readAsDataURL(file);
  };

  const openPaymentEdit = () => {
    const parts = (paymentSettings.bankAccount || '').split(' - ');
    const bankNumber = parts[0] || '';
    const bankName = parts.slice(1).join(' - ') || '';
    setPaymentForm({ bankAccount: paymentSettings.bankAccount, qrisImage: paymentSettings.qrisImage, bankNumber, bankName });
    setIsPaymentEditOpen(true);
  };

  const savePaymentForm = () => {
    const combined = (paymentForm.bankNumber && paymentForm.bankName) ? `${paymentForm.bankNumber} - ${paymentForm.bankName}` : (paymentForm.bankAccount || '');
    setPaymentSettings({ bankAccount: combined, qrisImage: paymentForm.qrisImage });
    setIsPaymentEditOpen(false);
    showPopup('Perubahan payment berhasil disimpan (preview).');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="border-4 border-solid border-gray-200 h-12 w-12 rounded-full animate-spin"></div>
      <p className="ml-4 text-gray-600">Memuat Admin Dashboard...</p>
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center h-screen bg-red-50 p-8">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200">
        <h1 className="text-xl font-bold text-red-600 mb-4">Kesalahan Fatal</h1>
        <p className="text-gray-700">{error}</p>
        <p className="text-sm mt-4 text-gray-500">Jika ini API, pastikan server berjalan.</p>
      </div>
    </div>
  );

  // derived counts
  const pendingVendors = vendors.filter(v => v.status === 'Pending').length;
  const approvedVendors = vendors.filter(v => v.status === 'Approved').length;
  const pendingReviews = reviews.filter(r => r.status === 'Pending').length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const pendingPayments = paymentRequests.filter(p => p.status === 'Pending').length;

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardHome vendors={vendors} users={users} reviews={reviews} />;
      case 'Vendor': return <VendorManagement vendors={vendors} vendorView={vendorView} setVendorView={setVendorView} handleVendorAction={handleVendorAction} pendingVendors={pendingVendors} approvedVendors={approvedVendors} />;
      case 'Users': return <UserManagement users={users} userView={userView} setUserView={setUserView} handleUserAction={handleUserAction} />;
      case 'Reviews': return <ReviewModeration reviews={reviews} reviewView={reviewView} setReviewView={setReviewView} handleReviewAction={handleReviewAction} />;
      case 'StaticContent': return <StaticContentManagement staticContent={staticContent} setEditingContent={setEditingContent} setEditorValue={setEditorValue} editingContent={editingContent} />;
      case 'EditRole': return <RoleEditor vendors={vendors} roleEdits={roleEdits} setRoleEdits={setRoleEdits} handleSaveRoles={handleSaveRoles} />;
      case 'Payment': return <PaymentSettings paymentSettings={paymentSettings} openPaymentEdit={openPaymentEdit} setPaymentSettings={setPaymentSettings} handleQrisUpload={handleQrisUpload} handleSavePayment={handleSavePayment} isPaymentEditOpen={isPaymentEditOpen} paymentForm={paymentForm} handlePaymentFormQrisUpload={handlePaymentFormQrisUpload} setIsPaymentEditOpen={setIsPaymentEditOpen} setPaymentForm={setPaymentForm} />;
      case 'KonfirmasiPembayaran': return <PaymentConfirmation paymentRequests={paymentRequests} onAction={handlePaymentAction} />;
      default: return <DashboardHome vendors={vendors} users={users} reviews={reviews} />;
    }
  };

  return (
    <div className="flex bg-gray-50 font-sans">
      <nav className="w-64 bg-white shadow-xl flex flex-col justify-between p-6 border-r border-gray-100 fixed h-screen top-0 left-0 z-10">
        <div>
          <div className="flex items-center mb-10">
            <span className={`text-2xl font-extrabold tracking-tight bg-clip-text text-transparent`} style={{background: 'linear-gradient(90deg,#facc15,#fb923c)'}}>Admin Dashboard</span>
          </div>

          <div className="overflow-y-auto max-h-[calc(100vh-180px)] -mx-2 pr-2">
            <ul className="space-y-2">
              {navItems.map(item => {
                const isActive = activeTab === item.name;
                const Icon = item.icon;
                let count = 0;
                if (item.name === 'KonfirmasiPembayaran') count = pendingPayments;
                if (item.name === 'Vendor') count = pendingVendors;
                if (item.name === 'Reviews') count = pendingReviews;
                return (
                  <li key={item.name}>
                    <button onClick={() => setActiveTab(item.name)} className={`flex items-center w-full p-3 rounded-xl text-left ${isActive ? `text-white ${PRIMARY_COLOR} shadow-lg` : 'text-gray-600 hover:bg-amber-50 hover:text-amber-600'}`}>
                      <Icon size={20} className="mr-3" />
                      <span className="flex-1 font-semibold">{item.label}</span>
                      {count > 0 && <span className={`text-xs font-bold py-0.5 px-2 rounded-full ${isActive ? 'bg-white text-amber-500' : 'bg-red-500 text-white'}`}>{count}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex-shrink-0">
          <p className="text-xs text-gray-400 mb-2 truncate" title="Admin Mock">ID Admin: mock-admin-123</p>
          <button onClick={() => console.log('Simulasi Logout')} className="flex items-center w-full p-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-600 hover:text-white font-semibold">
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto ml-64">
        <div className="p-4 md:p-8">
          {renderContent()}
        </div>
      </main>

      {/* Static content editor modal (centralized) */}
      {editingContent && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl border-t-4 border-amber-500">
            <h2 className="text-3xl font-bold mb-6">Edit Konten: <span className="text-amber-600">{editingContent}</span></h2>
            <textarea value={editorValue} onChange={(e) => setEditorValue(e.target.value)} rows="15" className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 resize-none" />
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setEditingContent(null)} className="py-2.5 px-6 border border-gray-300 rounded-full text-gray-700">Batal</button>
              <button onClick={handleStaticContentSave} className="py-2.5 px-6 rounded-full text-white bg-amber-500">Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment edit modal */}
      {isPaymentEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg border-t-4 border-amber-500">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Nomor Rekening</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nomor Rekening</label>
                <input type="text" value={paymentForm.bankNumber || ''} onChange={(e) => setPaymentForm(prev => ({ ...prev, bankNumber: e.target.value }))} className="w-full p-3 border rounded-lg" placeholder="Contoh: 1234567890" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nama Bank</label>
                <input type="text" value={paymentForm.bankName || ''} onChange={(e) => setPaymentForm(prev => ({ ...prev, bankName: e.target.value }))} className="w-full p-3 border rounded-lg" placeholder="Contoh: Bank Contoh" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Preview QRIS (opsional)</label>
                {paymentForm.qrisImage ? <div className="w-32 h-32 rounded-lg overflow-hidden border mb-2"><img src={paymentForm.qrisImage} alt="QRIS preview" className="object-contain w-full h-full" /></div> : <div className="text-sm text-gray-500 italic mb-2">Belum ada QRIS yang diupload untuk preview.</div>}
                <input type="file" accept="image/*" onChange={(e) => handlePaymentFormQrisUpload(e.target.files[0])} className="block text-sm text-gray-600" />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setIsPaymentEditOpen(false)} className="py-2 px-4 rounded-full border border-gray-200 text-gray-700">Batal</button>
              <button onClick={() => { setPaymentForm(prev => ({ ...prev, bankAccount: `${prev.bankNumber || ''}${prev.bankName ? ' - ' + prev.bankName : ''}` })); savePaymentForm(); }} className="py-2 px-4 rounded-full bg-amber-500 text-white">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
