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

import {
  fetchVendors, fetchReviews, fetchUsers, fetchStaticContent, fetchPaymentRequests,
  updateVendorStatus, deleteVendor,
  updateReviewStatus, deleteReview,
  updateUserStatus, deleteUser,
  updatePaymentRequestStatus, deletePaymentRequest,
  saveStaticContent, updateVendorRole
} from './data/api';

import showPopup from './components/Popup';
import { PRIMARY_COLOR } from './data/constants';

const Dashboard = () => {

  const [activeTab, setActiveTab] = useState('Dashboard');

  // views
  const [vendorView, setVendorView] = useState('Pending');
  const [userView, setUserView] = useState('Active');
  const [reviewView, setReviewView] = useState('Pending');

  // global states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [vendors, setVendors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [staticContent, setStaticContent] = useState({});
  const [paymentRequests, setPaymentRequests] = useState([]);

  // static editor
  const [editingContent, setEditingContent] = useState(null);
  const [editorValue, setEditorValue] = useState('');

  // payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    bankAccount: "123456789 - Bank Contoh",
    qrisImage: null
  });

  const [isPaymentEditOpen, setIsPaymentEditOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    bankAccount: "",
    qrisImage: null,
    bankNumber: "",
    bankName: ""
  });

  // role edits
  const [roleEdits, setRoleEdits] = useState({});

  // load data
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

  const handleVendorAction = async (id, action) => {
    const text = action === "delete" ? "menghapus" 
      : action === "Approved" ? "menyetujui" : "menolak";

    if (!window.confirm(`Yakin ingin ${text} vendor ID ${id}?`)) return;

    try {
      if (action === "delete") {
        await deleteVendor(id);
        setVendors(v => v.filter(x => x.id !== id));
      } else {
        await updateVendorStatus(id, action);
        setVendors(v => v.map(x => x.id === id ? { ...x, status: action } : x));
      }
    } catch {
      setError("Gagal memproses vendor");
    }
  };

  const handleReviewAction = async (id, action) => {
    const text = action === "delete" ? "menghapus"
      : action === "Approved" ? "menyetujui" : "menolak";

    if (!window.confirm(`Yakin ingin ${text} ulasan ID ${id}?`)) return;

    try {
      if (action === "delete") {
        await deleteReview(id);
        setReviews(r => r.filter(x => x.id !== id));
      } else {
        await updateReviewStatus(id, action);
        setReviews(r => r.map(x => x.id === id ? { ...x, status: action } : x));
      }
    } catch {
      setError("Gagal memproses ulasan");
    }
  };

  const handleUserAction = async (id, status) => {
    const text = status === "delete" ? "menghapus"
      : status === "Suspended" ? "menangguhkan" : "mengaktifkan";

    if (!window.confirm(`Yakin ingin ${text} user ID ${id}?`)) return;

    try {
      if (status === "delete") {
        await deleteUser(id);
        setUsers(u => u.filter(x => x.id !== id));
      } else {
        await updateUserStatus(id, status);
        setUsers(u => u.map(x => x.id === id ? { ...x, status } : x));
      }
    } catch {
      setError("Gagal memproses user");
    }
  };

  const handlePaymentAction = async (id, action) => {
    const text = action === "delete" ? "menghapus"
      : action === "Confirmed" ? "mengonfirmasi" : "menolak";

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

  // ------ payment editor ------
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

  // ---- loading & error ----
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

  // ------- derived counts -------
  const pendingVendors = vendors.filter(v => v.status === "Pending").length;
  const approvedVendors = vendors.filter(v => v.status === "Approved").length;
  const pendingReviews = reviews.filter(r => r.status === "Pending").length;
  const activeUsers = users.filter(u => u.status === "Active").length;
  const pendingPayments = paymentRequests.filter(p => p.status === "Pending").length;

  // render routes
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <DashboardHome
            vendors={vendors}
            users={users}
            reviews={reviews}
          />
        );

      case "Vendor":
        return (
          <VendorManagement
            vendors={vendors}
            vendorView={vendorView}
            setVendorView={setVendorView}
            handleVendorAction={handleVendorAction}
            pendingVendors={pendingVendors}
            approvedVendors={approvedVendors}
          />
        );

      case "Users":
        return (
          <UserManagement
            users={users}
            userView={userView}
            setUserView={setUserView}
            handleUserAction={handleUserAction}
          />
        );

      case "Reviews":
        return (
          <ReviewModeration
            reviews={reviews}
            reviewView={reviewView}
            setReviewView={setReviewView}
            handleReviewAction={handleReviewAction}
          />
        );

      case "StaticContent":
        return (
          <StaticContentManagement
            staticContent={staticContent}
            setEditingContent={setEditingContent}
            setEditorValue={setEditorValue}
            editingContent={editingContent}
          />
        );

      case "EditRole":
        return (
          <RoleEditor
            vendors={vendors}
            roleEdits={roleEdits}
            setRoleEdits={setRoleEdits}
            handleSaveRoles={handleSaveRoles}
          />
        );

      case "Payment":
        return (
          <PaymentSettings
            paymentSettings={paymentSettings}
            openPaymentEdit={openPaymentEdit}
            setPaymentSettings={setPaymentSettings}
            isPaymentEditOpen={isPaymentEditOpen}
            paymentForm={paymentForm}
            setPaymentForm={setPaymentForm}
            savePaymentForm={savePaymentForm}
          />
        );

      case "KonfirmasiPembayaran":
        return (
          <PaymentConfirmation
            paymentRequests={paymentRequests}
            onAction={handlePaymentAction}
          />
        );

      default:
        return <DashboardHome vendors={vendors} users={users} reviews={reviews} />;
    }
  };

  return (
    <div className="flex bg-gray-50">

      {/* SIDEBAR */}
      <nav className="w-64 bg-white shadow-xl p-6 border-r fixed h-screen">

        {/* LOGO */}
        <div className="mb-10">
          <h1
            className="text-2xl font-extrabold bg-clip-text text-transparent"
            style={{ background: "linear-gradient(90deg,#facc15,#fb923c)" }}
          >
            Admin Dashboard
          </h1>
        </div>

        {/* NAV ITEMS */}
        <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-160px)]">

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
                  onClick={() => setActiveTab(item.name)}
                  className={`flex items-center w-full p-3 rounded-xl
                    ${isActive ? `${PRIMARY_COLOR} text-white shadow-xl`
                               : "text-gray-600 hover:bg-amber-50 hover:text-amber-600"}`}
                >
                  <Icon size={20} className="mr-3" />
                  <span className="flex-1 font-semibold">{item.label}</span>

                  {count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold 
                      ${isActive ? "bg-white text-amber-600" : "bg-red-500 text-white"}`}>
                      {count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}

        </ul>

        {/* LOGOUT */}
        <button
          className="w-full mt-6 flex items-center p-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-600 hover:text-white"
        >
          <LogOut size={20} className="mr-3" />
          Keluar
        </button>

      </nav>

      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1 p-6">
        {renderContent()}
      </main>

      {/* STATIC CONTENT EDITOR */}
      {editingContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl">
            <h3 className="text-xl font-bold mb-4">Edit Konten: {editingContent}</h3>

            <textarea
              rows={10}
              className="w-full border p-3 rounded-lg"
              value={editorValue}
              onChange={(e) => setEditorValue(e.target.value)}
            />

            <div className="mt-4 flex justify-end space-x-3">
              <button onClick={() => setEditingContent(null)} className="px-4 py-2 border rounded-lg">Batal</button>
              <button onClick={handleStaticContentSave} className="px-4 py-2 bg-amber-500 text-white rounded-lg">Simpan</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
