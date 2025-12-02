import React, { useEffect, useState } from 'react';
import { LogOut, Menu, X, Settings } from 'lucide-react'; 
import { Link } from '@inertiajs/react'; // <-- IMPORT INERTIA LINK BARU

// Pastikan file navItems berada di path yang sama atau sesuai
import { navItems } from './navItems'; 

// Import Pages (diasumsikan path sudah benar)
import DashboardHome from './pages/DashboardHome';
import VendorManagement from './pages/VendorManagement';
import UserManagement from './pages/UserManagement';
import ReviewModeration from './pages/ReviewModeration';
import StaticContentManagement from './pages/StaticContentManagement';
import RoleEditor from './pages/RoleEditor';
import PaymentSettings from './pages/PaymentSettings';
import PaymentConfirmation from './pages/PaymentConfirmation';

// Import API functions (diasumsikan path sudah benar)
import {
  fetchVendors, fetchReviews, fetchUsers, fetchStaticContent, fetchPaymentRequests,
  updateVendorStatus, deleteVendor,
  updateReviewStatus, deleteReview,
  updateUserStatus, deleteUser,
  updatePaymentRequestStatus, deletePaymentRequest,
  saveStaticContent, updateVendorRole
} from './data/api';

// Import komponen popup (diasumsikan path sudah benar)
import showPopup from './components/Popup';

// Warna Utama dashboard: Orange/Amber yang lembut
const PRIMARY_COLOR = 'bg-amber-600'; 
const PRIMARY_HOVER_COLOR = 'hover:bg-amber-700';

const Dashboard = () => {

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const [editingContent, setEditingContent] = useState(null);
  const [editorValue, setEditorValue] = useState('');

  const [paymentSettings, setPaymentSettings] = useState({
    bankAccount: "123456789 - Bank Contoh",
    qrisImage: null
  });

  const [isPaymentEditOpen, setIsPaymentEditOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    bankNumber: "",
    bankName: "",
    qrisImage: null,
  });

  const [roleEdits, setRoleEdits] = useState({});

  // ---------------- useEffect: Load Initial Data ----------------
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [v, r, u, c, p] = await Promise.all([
          fetchVendors(),
          fetchReviews(),
          fetchUsers(),
          fetchStaticContent(),
          fetchPaymentRequests()
        ]);

        setVendors(v);
        setReviews(r);
        setUsers(u);
        setStaticContent(c);
        setPaymentRequests(p);

      } catch (e) {
        console.error(e);
        setError("Gagal memuat data API.");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  // ---------------- HANDLERS ----------------
  // ... (Semua handler aksi CRUD dan pembayaran lainnya) ...
  
  const handleVendorAction = async (id, action) => {
    const text = action === "delete" ? "menghapus" : action === "Approved" ? "menyetujui" : "menolak";

    if (!window.confirm(`Yakin ingin ${text} vendor ID ${id}?`)) return;

    try {
      if (action === "delete") {
        await deleteVendor(id);
        setVendors(v => v.filter(x => x.id !== id));
      } else {
        await updateVendorStatus(id, action);
        setVendors(v => v.map(x => x.id === id ? { ...x, status: action } : x));
      }
      showPopup("Status vendor diperbarui.");
    } catch {
      setError("Gagal memproses vendor");
    }
  };

  const handleReviewAction = async (id, action) => {
    const text = action === "delete" ? "menghapus" : action === "Approved" ? "menyetujui" : "menolak";

    if (!window.confirm(`Yakin ingin ${text} ulasan ID ${id}?`)) return;

    try {
      if (action === "delete") {
        await deleteReview(id);
        setReviews(r => r.filter(x => x.id !== id));
      } else {
        await updateReviewStatus(id, action);
        setReviews(r => r.map(x => x.id === id ? { ...x, status: action } : x));
      }
      showPopup("Status ulasan diperbarui.");
    } catch {
      setError("Gagal memproses ulasan");
    }
  };

  const handleUserAction = async (id, status) => {
    const text = status === "delete" ? "menghapus" : status === "Suspended" ? "menangguhkan" : "mengaktifkan";

    if (!window.confirm(`Yakin ingin ${text} user ID ${id}?`)) return;

    try {
      if (status === "delete") {
        await deleteUser(id);
        setUsers(u => u.filter(x => x.id !== id));
      } else {
        await updateUserStatus(id, status);
        setUsers(u => u.map(x => x.id === id ? { ...x, status } : x));
      }
      showPopup("Status user diperbarui.");
    } catch {
      setError("Gagal memproses user");
    }
  };

  const handlePaymentAction = async (id, action) => {
    const text = action === "delete" ? "menghapus" : action === "Confirmed" ? "mengonfirmasi" : "menolak";

    if (!window.confirm(`Yakin ingin ${text} pembayaran ID ${id}?`)) return;

    try {
      if (action === "delete") {
        await deletePaymentRequest(id);
        setPaymentRequests(p => p.filter(x => x.id !== id));
      } else {
        await updatePaymentRequestStatus(id, action);
        setPaymentRequests(p => p.map(x => x.id === id ? { ...x, status: action } : x));
      }
      showPopup("Status pembayaran diperbarui.");

    } catch {
      setError("Gagal memproses pembayaran");
    }
  };

  const handleStaticContentSave = async () => {
    if (!editingContent) return;
    if (!window.confirm(`Simpan perubahan?`)) return;

    try {
      await saveStaticContent(editingContent, editorValue);
      setStaticContent(s => ({ ...s, [editingContent]: editorValue }));
      setEditingContent(null);
      showPopup("Konten statis disimpan.");
    } catch {
      setError("Gagal menyimpan konten");
    }
  };

  const handleSaveRoles = async () => {
    const edits = Object.entries(roleEdits);
    if (edits.length === 0) {
      showPopup("Tidak ada perubahan");
      return;
    }

    if (!window.confirm("Simpan role vendor?")) return;

    try {
      for (const [id, role] of edits) {
        await updateVendorRole(id, role);
        setVendors(v => v.map(x => x.id === id ? { ...x, role } : x));
      }
      setRoleEdits({});
      showPopup("Role berhasil disimpan");
    } catch {
      setError("Gagal menyimpan role");
    }
  };

  const openPaymentEdit = () => {
    const parts = paymentSettings.bankAccount.split(" - ");
    setPaymentForm({
      bankNumber: parts[0] || "",
      bankName: parts[1] || "",
      qrisImage: paymentSettings.qrisImage
    });
    setIsPaymentEditOpen(true);
  };

  const savePaymentForm = () => {
    const merged = `${paymentForm.bankNumber} - ${paymentForm.bankName}`;
    setPaymentSettings({
      bankAccount: merged,
      qrisImage: paymentForm.qrisImage
    });
    setIsPaymentEditOpen(false);
    showPopup("Payment disimpan (preview)");
  };
  
  // Menutup sidebar setelah navigasi di mobile
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if (isSidebarOpen) {
      setIsSidebarOpen(false); 
    }
  };


  // ---------------- Loading & Error Display ----------------
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Memuat Dashboard...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        {error}
      </div>
    );

  // Derived Counts
  const pendingVendors = vendors.filter(v => v.status === "Pending").length;
  const approvedVendors = vendors.filter(v => v.status === "Approved").length;
  const pendingReviews = reviews.filter(r => r.status === "Pending").length;
  const pendingPayments = paymentRequests.filter(p => p.status === "Pending").length;

  // ---------------- Render Content (Routing) ----------------
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardHome vendors={vendors} users={users} reviews={reviews} />;
      case "Vendor":
        return <VendorManagement vendors={vendors} vendorView={vendorView} setVendorView={setVendorView} handleVendorAction={handleVendorAction} pendingVendors={pendingVendors} approvedVendors={approvedVendors} />;
      case "Users":
        return <UserManagement users={users} userView={userView} setUserView={setUserView} handleUserAction={handleUserAction} />;
      case "Reviews":
        return <ReviewModeration reviews={reviews} reviewView={reviewView} setReviewView={setReviewView} handleReviewAction={handleReviewAction} />;
      case "StaticContent":
        return <StaticContentManagement staticContent={staticContent} setEditingContent={setEditingContent} setEditorValue={setEditorValue} editingContent={editingContent} />;
      case "EditRole":
        return <RoleEditor vendors={vendors} roleEdits={roleEdits} setRoleEdits={setRoleEdits} handleSaveRoles={handleSaveRoles} />;
      case "Payment":
        return <PaymentSettings paymentSettings={paymentSettings} openPaymentEdit={openPaymentEdit} setPaymentSettings={setPaymentSettings} isPaymentEditOpen={isPaymentEditOpen} paymentForm={paymentForm} setPaymentForm={setPaymentForm} savePaymentForm={savePaymentForm} />;
      case "KonfirmasiPembayaran":
        return <PaymentConfirmation paymentRequests={paymentRequests} onAction={handlePaymentAction} />;
      default:
        return <DashboardHome vendors={vendors} users={users} reviews={reviews} />;
    }
  };


  return (
    <div className="flex bg-gray-50 min-h-screen"> 

      {/* OVERLAY (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR (Responsive & Clean) */}
      <nav 
        // Mengubah styling sidebar agar sedikit lebih modern
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-2xl p-4 border-r border-gray-100 flex flex-col z-50 
                   transform transition-transform duration-300 ease-in-out
                   ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                   lg:translate-x-0 lg:fixed`} 
      >

        {/* LOGO & Close Button (Mobile Only) */}
        <div className="mb-8 p-2 flex justify-between items-center">
          <h1
            className="text-2xl font-extrabold text-gray-900" // <-- HAPUS text-transparent DAN bg-clip-text
            // Gunakan PRIMARY_COLOR untuk mendapatkan warna yang jelas
          >
            <span className="text-amber-600">Admin</span> Panel
          </h1>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden p-1 rounded-full text-gray-500 hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* NAV ITEMS CONTAINER */}
        <ul className="space-y-2 flex-1 overflow-y-auto pr-2">

          {navItems.map(item => {
            const isActive = activeTab === item.name;
            const Icon = item.icon;

            let count = 0;
            if (item.name === "Vendor") count = pendingVendors;
            if (item.name === "Reviews") count = pendingReviews;
            if (item.name === "KonfirmasiPembayaran") count = pendingPayments;

            return (
              <li key={item.name}>
                <button
                  onClick={() => handleTabClick(item.name)} 
                  className={`flex items-center w-full p-3 rounded-xl transition duration-200 
                    ${isActive
                      ? `${PRIMARY_COLOR} text-white shadow-md shadow-amber-300/50` 
                      : "text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                    }`}
                >
                  <Icon size={20} className="mr-3" />
                  <span className="flex-1 font-medium text-left">{item.label}</span>

                  {count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold
                      ${isActive ? "bg-white text-red-600" : "bg-red-500 text-white"}`}>
                      {count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}

        </ul>

        {/* LOGOUT BUTTON - Menggunakan Link Inertia untuk POST ke Backend */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link
            // Mengirim permintaan POST ke rute logout Laravel
            href={route('logout')} 
            method="post"
            as="button" // Render sebagai tombol
            preserveScroll={false} // Pastikan halaman dimuat ulang jika perlu
            className="w-full flex items-center p-3 rounded-xl bg-red-100 text-red-700 font-medium
                       hover:bg-red-600 hover:text-white transition duration-200"
          >
            <LogOut size={20} className="mr-3" />
            Keluar
          </Link>
        </div>

      </nav>

      {/* MAIN CONTENT & HEADER */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64">
        
        {/* HEADER TOP BAR (Mobile Only) */}
        <div className="lg:hidden flex items-center justify-between bg-white p-3 rounded-xl shadow-md mb-6 sticky top-0 z-30">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              {navItems.find(i => i.name === activeTab)?.label || activeTab}
            </h2>
        </div>
        
        {/* HEADER DESKTOP */}
        <div className="w-full"> 
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                  {navItems.find(i => i.name === activeTab)?.label || activeTab}
              </h2>
              <p className="text-gray-500 mt-1">
                  Kelola dan pantau aktivitas platform Anda.
              </p>
            </div>
            {renderContent()}
        </div>
      </main>

      {/* STATIC CONTENT EDITOR (Modal - Styling Clean) */}
      {editingContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-2xl">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Edit Konten: {editingContent}</h3>

            <textarea
              rows={10}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150"
              value={editorValue}
              onChange={(e) => setEditorValue(e.target.value)}
            />

            <div className="mt-4 flex justify-end space-x-3">
              <button onClick={() => setEditingContent(null)} className="px-4 py-2 border rounded-xl text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={handleStaticContentSave} className={`px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition duration-150`}>Simpan</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;