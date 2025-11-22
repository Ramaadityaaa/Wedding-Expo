import React, { useState, useEffect, useMemo } from 'react';
import {
    LogOut,
    Users,
    MessageSquare,
    FileText,
    LayoutDashboard,
    CheckCircle,
    XCircle,
    Trash2,
    Edit,
    Clock,
    FileBadge,
    CreditCard,
    DollarSign,
} from 'lucide-react';
import { router } from '@inertiajs/react';

// === Custom Popup Modal ===
function showPopup(message) {
    const modal = document.createElement('div');
    modal.style =
        'position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:99999;';
    modal.innerHTML = `<div style='background:white;padding:20px;border-radius:12px;max-width:300px;text-align:center;font-family:sans-serif;'>
        <p>${message}</p>
        <button id='popupCloseBtn' style='margin-top:12px;padding:6px 16px;border-radius:8px;background:#ffb200;color:white;'>OK</button>
    </div>`;
    document.body.appendChild(modal);
    modal.querySelector('#popupCloseBtn').onclick = () => modal.remove();
}

// --- KONFIGURASI UMUM & MOCK API SIMULATION ---

// Waktu tunda untuk simulasi respons API dari Laravel
const API_DELAY = 500;

// Fungsi untuk mensimulasikan panggilan API (menggantikan Firebase CRUD)
const simulateApiCall = (data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, API_DELAY);
    });
};

// Data Mock awal (Menambahkan 'phone' ke Vendor dan User)
const MOCK_VENDORS = [
    { id: 'v1', name: 'WO Bunga Cinta', email: 'bunga@wo.com', phone: '081234567890', status: 'Pending', role: 'Vendor' },
    { id: 'v2', name: 'WO Emas Abadi', email: 'emas@wo.com', phone: '082198765432', status: 'Approved', role: 'Vendor' },
    { id: 'v3', name: 'WO Pelangi', email: 'pelangi@wo.com', phone: '085711223344', status: 'Pending', role: 'Vendor' },
    { id: 'v4', name: 'WO Silver Moon', email: 'silver@wo.com', phone: '089955667788', status: 'Rejected', role: 'Vendor' },
    { id: 'v5', name: 'WO Ceria Pesta', email: 'ceria@wo.com', phone: '081512345678', status: 'Approved', role: 'Membership' },
    { id: 'v6', name: 'WO Mega Indah', email: 'mega@wo.com', phone: '087812341234', status: 'Pending', role: 'Vendor' },
];

const MOCK_REVIEWS = [
    { id: 'r1', vendorName: 'WO Emas Abadi', userName: 'Adi P.', content: 'Pelayanan sangat memuaskan!', status: 'Pending' },
    { id: 'r2', vendorName: 'WO Bunga Cinta', userName: 'Sari M.', content: 'Agak mahal tapi hasilnya bagus.', status: 'Approved' },
    { id: 'r3', vendorName: 'WO Pelangi', userName: 'Joko K.', content: 'Kurang responsif.', status: 'Pending' },
    { id: 'r4', vendorName: 'WO Emas Abadi', userName: 'Rina T.', content: 'Sangat direkomendasikan!', status: 'Approved' },
    { id: 'r5', vendorName: 'WO Pelangi', userName: 'Budi S.', content: 'Tidak sesuai ekspektasi.', status: 'Rejected' },
];

const MOCK_USERS = [
    { id: 'u1', name: 'Calon Pengantin A', email: 'cpa@mail.com', phone: '081111122222', status: 'Active' },
    { id: 'u2', name: 'Calon Pengantin B', email: 'cpb@mail.com', phone: '083333344444', status: 'Suspended' },
    { id: 'u3', name: 'Fotografer C', email: 'foto@mail.com', phone: '085555566666', status: 'Active' },
    { id: 'u4', name: 'Event Planner X', email: 'epx@mail.com', phone: '087712349876', status: 'Active' },
];

// --- MOCK PAYMENT CONFIRMATION DATA (DARI VENDOR MEMBERSHIP FORM) ---
const MOCK_PAYMENT_REQUESTS = [
    {
        id: 'p1',
        vendorId: 'v5',
        vendorName: 'WO Ceria Pesta',
        amount: 500000,
        currency: 'IDR',
        bankName: 'Bank Contoh',
        accountNumber: '1234567890',
        accountHolder: 'WO Ceria Pesta',
        proofImage: null,
        note: 'Pembayaran membership paket Gold - satu tahun',
        submittedAt: '2025-11-17T08:30:00+07:00',
        status: 'Pending',
    },
    {
        id: 'p2',
        vendorId: 'v1',
        vendorName: 'WO Bunga Cinta',
        amount: 250000,
        currency: 'IDR',
        bankName: 'Bank Contoh',
        accountNumber: '0987654321',
        accountHolder: 'Bunga Cinta',
        proofImage: null,
        note: 'Top-up membership - paket Silver',
        submittedAt: '2025-11-16T14:20:00+07:00',
        status: 'Pending',
    },
];

const fetchPaymentRequests = () => simulateApiCall(MOCK_PAYMENT_REQUESTS);
const updatePaymentRequestStatus = (id, status) => simulateApiCall({ success: true, id, status });
const deletePaymentRequest = (id) => simulateApiCall({ success: true, id });

const INITIAL_STATIC_CONTENT = {
    'Tentang Kami':
        'Ini adalah platform direktori vendor terlengkap di Indonesia. Kami menghubungkan calon pengantin dengan vendor terbaik.',
    'Kontak Kami': 'Hubungi kami melalui email: admin@weddingexpo.co.id atau telepon: (021) 1234-5678.',
    FAQ: 'Q: Bagaimana cara mendaftar? A: Klik tombol "Daftar Vendor" di sudut kanan atas. Q: Berapa biaya yang dikenakan? A: Biaya layanan bervariasi.',
};

// Mock Functions API (Menggantikan Firestore Calls)
const fetchVendors = () => simulateApiCall(MOCK_VENDORS);
const fetchUsers = () => simulateApiCall(MOCK_USERS);
const fetchReviews = () => simulateApiCall(MOCK_REVIEWS);
const fetchStaticContent = () => simulateApiCall(INITIAL_STATIC_CONTENT);

const updateVendorStatus = (id, status) => simulateApiCall({ success: true, id, status });
const deleteVendor = (id) => simulateApiCall({ success: true, id });
const updateVendorRole = (id, role) => simulateApiCall({ success: true, id, role });

const updateReviewStatus = (id, status) => simulateApiCall({ success: true, id, status });
const deleteReview = (id) => simulateApiCall({ success: true, id });

const updateUserStatus = (id, status) => simulateApiCall({ success: true, id, status });
const deleteUser = (id) => simulateApiCall({ success: true, id });

const saveStaticContent = (key, value) => simulateApiCall({ success: true, key, value });

// Warna Kustom yang terinspirasi dari gambar (Warm Gold/Amber)
const PRIMARY_COLOR = 'bg-amber-500';
const HOVER_COLOR = 'hover:bg-amber-600';
const ACCENT_COLOR = 'text-amber-600';
const GRADIENT_CLASS = 'bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500';

// --- KOMPONEN UI KECIL (SummaryCard, ActionButton, ReviewCard) ---

// Kartu Ringkasan Dashboard
const SummaryCard = ({ icon: Icon, title, value, colorClass }) => (
    <div
        className={`p-5 rounded-xl text-white flex flex-col justify-between 
        ${colorClass} 
        shadow-lg 
        transform transition duration-500 ease-in-out 
        hover:scale-[1.05] 
        hover:shadow-[0_0_20px_rgba(251,191,36,0.8)]
        min-h-40`}
    >
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium opacity-90">{title}</h3>
            <Icon size={28} strokeWidth={2} className="opacity-90" />
        </div>
        <p className="mt-4 text-4xl font-extrabold">{value}</p>
    </div>
);

// Tombol Aksi
const ActionButton = ({ icon: Icon, onClick, title, color }) => (
    <button
        onClick={onClick}
        title={title}
        className={`p-2 rounded-full ${color} text-white transition duration-200 shadow-md hover:opacity-80`}
    >
        <Icon size={18} />
    </button>
);

// Review Card Component
const ReviewCard = ({ review, onAction }) => {
    const statusBg =
        review.status === 'Approved'
            ? 'bg-green-100 text-green-800'
            : review.status === 'Pending'
            ? 'bg-amber-100 text-amber-800'
            : 'bg-red-100 text-red-800';

    const borderColor =
        review.status === 'Approved'
            ? 'border-green-300'
            : review.status === 'Pending'
            ? 'border-amber-500'
            : 'border-red-300';

    return (
        <div
            className={`bg-white p-5 rounded-xl shadow-lg border-t-4 ${borderColor} flex flex-col justify-between transition duration-300 hover:shadow-xl`}
        >
            <div className="flex justify-between items-start mb-3 border-b pb-2">
                <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">Vendor</p>
                    <p className="text-lg font-bold text-gray-800 truncate" title={review.vendorName}>
                        {review.vendorName}
                    </p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusBg}`}>{review.status}</span>
            </div>

            <p className="text-sm italic text-gray-700 mb-4 h-16 overflow-y-auto leading-relaxed">
                &quot;{review.content}&quot;
            </p>

            <div className="flex justify-between items-center pt-2 border-t">
                <p className="text-sm font-medium text-gray-500 flex items-center">
                    <Users size={14} className="mr-1" />
                    Oleh: {review.userName}
                </p>
                <div className="flex space-x-2">
                    {review.status !== 'Approved' && (
                        <ActionButton
                            icon={CheckCircle}
                            title="Setujui Ulasan"
                            color="bg-green-500"
                            onClick={() => onAction(review.id, 'Approved')}
                        />
                    )}
                    {review.status !== 'Rejected' && review.status !== 'Pending' && (
                        <ActionButton
                            icon={XCircle}
                            title="Tolak Ulasan"
                            color="bg-yellow-500"
                            onClick={() => onAction(review.id, 'Rejected')}
                        />
                    )}
                    <ActionButton
                        icon={Trash2}
                        title="Hapus Permanen"
                        color="bg-red-500"
                        onClick={() => onAction(review.id, 'delete')}
                    />
                </div>
            </div>
        </div>
    );
};

// --- PAYMENT CONFIRMATION TAB COMPONENT ---
const PaymentConfirmation = ({ paymentRequests, onAction }) => {
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState('Pending'); // Pending | Confirmed | Rejected | All

    const filtered = paymentRequests ? paymentRequests.filter((p) => (filter === 'All' ? true : p.status === filter)) : [];

    return (
        <div className="p-6">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Konfirmasi Pembayaran</h1>
            <p className="text-gray-500 mb-6">Terima dan verifikasi bukti pembayaran yang dikirim oleh vendor member.</p>

            <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                    {['Pending', 'Confirmed', 'Rejected', 'All'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                filter === f
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-white border border-gray-200 text-gray-600'
                            }`}
                        >
                            {f === 'All' ? 'Semua' : f}
                        </button>
                    ))}
                </div>
                <div className="text-sm text-gray-500">Total: {paymentRequests ? paymentRequests.length : 0}</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-amber-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                Vendor
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                Nominal
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                Bank / Rek.
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                Tanggal Kirim
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                                Status
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filtered &&
                            filtered.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.vendorName}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        {p.currency} {p.amount.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {p.bankName} / {p.accountNumber}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {new Date(p.submittedAt).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                p.status === 'Pending'
                                                    ? 'bg-amber-100 text-amber-800'
                                                    : p.status === 'Confirmed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                                onClick={() => setSelected(p)}
                                                className="px-3 py-1 rounded-full border border-gray-200 text-sm"
                                            >
                                                Lihat
                                            </button>
                                            {p.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => onAction(p.id, 'Confirmed')}
                                                        className="px-3 py-1 rounded-full bg-green-500 text-white text-sm"
                                                    >
                                                        Konfirmasi
                                                    </button>
                                                    <button
                                                        onClick={() => onAction(p.id, 'Rejected')}
                                                        className="px-3 py-1 rounded-full bg-red-500 text-white text-sm"
                                                    >
                                                        Tolak
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => onAction(p.id, 'delete')}
                                                className="px-3 py-1 rounded-full border border-gray-200 text-sm text-red-600"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        {filtered && filtered.length === 0 && (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="py-8 text-center text-gray-500 italic"
                                >
                                    Tidak ada permintaan konfirmasi pembayaran untuk filter ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selected && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold">{selected.vendorName}</h3>
                                <p className="text-sm text-gray-500">{selected.note}</p>
                            </div>
                            <div>
                                <button
                                    onClick={() => setSelected(null)}
                                    className="text-gray-500 hover:text-gray-800"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
                                {selected.proofImage ? (
                                    <img
                                        src={selected.proofImage}
                                        alt="Bukti Pembayaran"
                                        className="max-h-80 object-contain"
                                    />
                                ) : (
                                    <div className="text-sm text-gray-400 italic">
                                        Belum ada bukti gambar (simulasi)
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 mb-2">
                                    <strong>Nominal:</strong> {selected.currency}{' '}
                                    {selected.amount.toLocaleString('id-ID')}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    <strong>Bank:</strong> {selected.bankName}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    <strong>Nomor Rekening:</strong> {selected.accountNumber}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    <strong>Atas Nama:</strong> {selected.accountHolder}
                                </div>
                                <div className="mt-4 flex space-x-2">
                                    {selected.status === 'Pending' && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    onAction(selected.id, 'Confirmed');
                                                    setSelected(null);
                                                }}
                                                className="py-2 px-4 rounded-full bg-green-500 text-white font-semibold"
                                            >
                                                Konfirmasi
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onAction(selected.id, 'Rejected');
                                                    setSelected(null);
                                                }}
                                                className="py-2 px-4 rounded-full bg-red-500 text-white font-semibold"
                                            >
                                                Tolak
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => {
                                            onAction(selected.id, 'delete');
                                            setSelected(null);
                                        }}
                                        className="py-2 px-4 rounded-full border border-gray-200 text-red-600"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const App = () => {
    // State Data Aplikasi
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [vendorView, setVendorView] = useState('Pending');
    const [reviewView, setReviewView] = useState('Pending');
    const [userView, setUserView] = useState('Active');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [vendors, setVendors] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [users, setUsers] = useState([]);
    const [staticContent, setStaticContent] = useState(INITIAL_STATIC_CONTENT);
    const [paymentRequests, setPaymentRequests] = useState([]);

    const [editingContent, setEditingContent] = useState(null);
    const [editorValue, setEditorValue] = useState('');

    const [paymentSettings, setPaymentSettings] = useState({
        bankAccount: '1234567890 - Bank Contoh',
        qrisImage: null,
    });
    const [roleEdits, setRoleEdits] = useState({});

    const [isPaymentEditOpen, setIsPaymentEditOpen] = useState(false);
    const [paymentForm, setPaymentForm] = useState({ bankAccount: '', qrisImage: null });

    // --- DATA FETCHING DENGAN MOCK API ---
    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [vendorData, reviewData, userData, contentData] = await Promise.all([
                    fetchVendors(),
                    fetchReviews(),
                    fetchUsers(),
                    fetchStaticContent(),
                ]);

                setVendors(vendorData);
                setReviews(reviewData);
                setUsers(userData);
                setStaticContent(contentData);

                const paymentData = await fetchPaymentRequests();
                setPaymentRequests(paymentData);
            } catch (e) {
                console.error('Gagal memuat data dari API:', e);
                setError('Gagal memuat data. Mohon periksa koneksi atau API.');
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, []);

    // Handler Aksi Vendor
    const handleVendorAction = async (vendorId, status) => {
        const actionName =
            status === 'delete' ? 'menghapus' : status === 'Approved' ? 'menyetujui' : 'menolak';
        const isConfirmed = window.confirm(
            `Apakah Anda yakin ingin ${actionName} vendor ID: ${vendorId}?`,
        );
        if (!isConfirmed) return;

        try {
            if (status === 'delete') {
                await deleteVendor(vendorId);
                setVendors((prev) => prev.filter((v) => v.id !== vendorId));
            } else {
                await updateVendorStatus(vendorId, status);
                setVendors((prev) =>
                    prev.map((v) => (v.id === vendorId ? { ...v, status: status } : v)),
                );
            }
        } catch (e) {
            console.error(`Gagal melakukan aksi ${status} pada vendor:`, e);
            setError(`Aksi gagal. Error: ${e.message}`);
        }
    };

    // Handler Aksi Ulasan
    const handleReviewAction = async (reviewId, status) => {
        const actionName =
            status === 'delete' ? 'menghapus' : status === 'Approved' ? 'menyetujui' : 'menolak';
        const isConfirmed = window.confirm(
            `Apakah Anda yakin ingin ${actionName} ulasan ID: ${reviewId}?`,
        );
        if (!isConfirmed) return;

        try {
            if (status === 'delete') {
                await deleteReview(reviewId);
                setReviews((prev) => prev.filter((r) => r.id !== reviewId));
            } else {
                await updateReviewStatus(reviewId, status);
                setReviews((prev) =>
                    prev.map((r) => (r.id === reviewId ? { ...r, status: status } : r)),
                );
            }
        } catch (e) {
            console.error(`Gagal melakukan aksi ${status} pada ulasan:`, e);
            setError(`Aksi gagal. Error: ${e.message}`);
        }
    };

    // Handler Konfirmasi Pembayaran
    const handlePaymentAction = async (paymentId, action) => {
        const actionName =
            action === 'delete'
                ? 'menghapus'
                : action === 'Confirmed'
                ? 'mengonfirmasi'
                : 'menolak';
        const isConfirmed = window.confirm(
            `Apakah Anda yakin ingin ${actionName} permintaan pembayaran ID: ${paymentId}?`,
        );
        if (!isConfirmed) return;
        try {
            if (action === 'delete') {
                await deletePaymentRequest(paymentId);
                setPaymentRequests((prev) => prev.filter((p) => p.id !== paymentId));
                showPopup('Permintaan pembayaran dihapus.');
            } else {
                await updatePaymentRequestStatus(paymentId, action);
                setPaymentRequests((prev) =>
                    prev.map((p) => (p.id === paymentId ? { ...p, status: action } : p)),
                );
                showPopup('Status permintaan pembayaran diperbarui.');
            }
        } catch (e) {
            console.error('Gagal melakukan aksi pada permintaan pembayaran:', e);
            setError('Aksi pembayaran gagal.');
        }
    };

    // Handler Aksi Pengguna
    const handleUserAction = async (id, action) => {
        const actionName =
            action === 'delete'
                ? 'menghapus'
                : action === 'Suspended'
                ? 'menangguhkan'
                : 'mengaktifkan';
        const isConfirmed = window.confirm(
            `Apakah Anda yakin ingin ${actionName} pengguna ID: ${id}?`,
        );
        if (!isConfirmed) return;

        try {
            if (action === 'delete') {
                await deleteUser(id);
                setUsers((prev) => prev.filter((u) => u.id !== id));
            } else {
                await updateUserStatus(id, action);
                setUsers((prev) =>
                    prev.map((u) => (u.id === id ? { ...u, status: action } : u)),
                );
            }
        } catch (e) {
            console.error(`Gagal melakukan aksi ${action} pada pengguna:`, e);
            setError(`Aksi gagal. Error: ${e.message}`);
        }
    };

    // Handler Simpan Konten Statis
    const handleStaticContentSave = async () => {
        if (!editingContent) return;

        const isConfirmed = window.confirm(`Simpan perubahan untuk ${editingContent}?`);
        if (!isConfirmed) return;

        try {
            await saveStaticContent(editingContent, editorValue);
            setStaticContent((prev) => ({ ...prev, [editingContent]: editorValue }));
            setEditingContent(null);
        } catch (e) {
            console.error('Gagal menyimpan konten statis:', e);
            setError(`Gagal menyimpan. Error: ${e.message}`);
        }
    };

    // Handler Simpan Role
    const handleSaveRoles = async () => {
        const entries = Object.entries(roleEdits);
        if (entries.length === 0) {
            showPopup('Tidak ada perubahan role yang disimpan.');
            return;
        }
        const isConfirmed = window.confirm('Simpan perubahan role untuk vendor yang dipilih?');
        if (!isConfirmed) return;
        try {
            for (const [id, role] of entries) {
                await updateVendorRole(id, role);
                setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, role } : v)));
            }
            setRoleEdits({});
            showPopup('Perubahan role berhasil disimpan.');
        } catch (e) {
            console.error('Gagal menyimpan role:', e);
            setError('Gagal menyimpan role.');
        }
    };

    // Handler Simpan Payment Settings
    const handleSavePayment = async () => {
        const isConfirmed = window.confirm('Simpan perubahan pembayaran (rekening / QRIS)?');
        if (!isConfirmed) return;
        try {
            await simulateApiCall(paymentSettings);
            showPopup('Pengaturan pembayaran disimpan.');
        } catch (e) {
            console.error('Gagal menyimpan payment settings:', e);
            setError('Gagal menyimpan payment settings.');
        }
    };

    // Upload QRIS
    const handleQrisUpload = (file, setter = setPaymentSettings) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            setter((prev) => ({ ...prev, qrisImage: e.target.result }));
        };
        reader.readAsDataURL(file);
    };

    const handlePaymentFormQrisUpload = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            setPaymentForm((prev) => ({ ...prev, qrisImage: e.target.result }));
        };
        reader.readAsDataURL(file);
    };

    const openPaymentEdit = () => {
        const parts = (paymentSettings.bankAccount || '').split(' - ');
        const bankNumber = parts[0] || '';
        const bankName = parts.slice(1).join(' - ') || '';
        setPaymentForm({
            bankAccount: paymentSettings.bankAccount,
            qrisImage: paymentSettings.qrisImage,
            bankNumber,
            bankName,
        });
        setIsPaymentEditOpen(true);
    };

    const savePaymentForm = () => {
        const combined =
            paymentForm.bankNumber && paymentForm.bankName
                ? `${paymentForm.bankNumber} - ${paymentForm.bankName}`
                : paymentForm.bankAccount || '';
        setPaymentSettings({ bankAccount: combined, qrisImage: paymentForm.qrisImage });
        setIsPaymentEditOpen(false);
        showPopup('Perubahan payment berhasil disimpan (preview).');
    };

    // --- DATA TURUNAN ---
    const pendingVendors = useMemo(
        () => vendors.filter((v) => v.status === 'Pending').length,
        [vendors],
    );
    const approvedVendors = useMemo(
        () => vendors.filter((v) => v.status === 'Approved').length,
        [vendors],
    );
    const pendingReviews = useMemo(
        () => reviews.filter((r) => r.status === 'Pending').length,
        [reviews],
    );
    const activeUsers = useMemo(
        () => users.filter((u) => u.status === 'Active').length,
        [users],
    );
    const pendingPayments = useMemo(
        () => (paymentRequests ? paymentRequests.filter((p) => p.status === 'Pending').length : 0),
        [paymentRequests],
    );

    // --- TAB CONTENTS ---

    const DashboardContent = () => {
        const activeVendorList = vendors.filter((v) => v.status === 'Approved').slice(0, 5);
        const activeUserList = users.filter((u) => u.status === 'Active').slice(0, 5);
        const pendingVendorList = vendors.filter((v) => v.status === 'Pending').slice(0, 5);
        const pendingReviewList = reviews.filter((r) => r.status === 'Pending').slice(0, 5);

        return (
            <div className="space-y-8 p-6">
                <h1 className="text-3xl font-extrabold text-gray-800">Panel Kontrol Utama</h1>
                <p className="text-gray-500">
                    Selamat datang kembali, Super Admin. Ini adalah ringkasan aktivitas platform Anda.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SummaryCard
                        icon={Clock}
                        title="Vendor Tertunda"
                        value={pendingVendors}
                        colorClass={GRADIENT_CLASS}
                    />
                    <SummaryCard
                        icon={MessageSquare}
                        title="Ulasan Menunggu"
                        value={pendingReviews}
                        colorClass={GRADIENT_CLASS}
                    />
                    <SummaryCard
                        icon={FileBadge}
                        title="Vendor Disetujui"
                        value={approvedVendors}
                        colorClass={GRADIENT_CLASS}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                            <CheckCircle size={20} className="text-green-500 mr-2" />
                            Pengguna & Vendor Aktif
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-amber-600 mb-2 border-b border-amber-100 pb-1">
                                    Vendor Aktif ({approvedVendors})
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    {activeVendorList.length > 0 ? (
                                        activeVendorList.map((v) => (
                                            <li
                                                key={v.id}
                                                className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
                                            >
                                                <span className="font-medium truncate">{v.name}</span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    {v.email}
                                                </span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="italic text-gray-500">
                                            Tidak ada vendor aktif.
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-lg font-bold text-blue-600 mb-2 border-b border-blue-100 pb-1">
                                    Pengguna Terdaftar Aktif ({activeUsers})
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    {activeUserList.length > 0 ? (
                                        activeUserList.map((u) => (
                                            <li
                                                key={u.id}
                                                className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
                                            >
                                                <span className="font-medium truncate">{u.name}</span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    {u.email}
                                                </span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="italic text-gray-500">
                                            Tidak ada pengguna aktif.
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                            <MessageSquare size={20} className="text-amber-500 mr-2" />
                            Aktivitas Terbaru
                        </h2>
                        <div className="space-y-3">
                            {pendingVendorList.map((v) => (
                                <div
                                    key={v.id}
                                    className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400 transition hover:bg-red-100"
                                >
                                    <p className="text-sm text-gray-800">
                                        <span className="font-bold text-red-600">
                                            Vendor Baru:
                                        </span>{' '}
                                        <strong>{v.name}</strong> menunggu persetujuan.
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Email: {v.email}
                                    </p>
                                </div>
                            ))}
                            {pendingReviewList.map((r) => (
                                <div
                                    key={r.id}
                                    className="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400 transition hover:bg-amber-100"
                                >
                                    <p className="text-sm text-gray-800">
                                        <span className="font-bold text-amber-600">
                                            Ulasan Baru:
                                        </span>{' '}
                                        Dari {r.userName} untuk <strong>{r.vendorName}</strong>{' '}
                                        menunggu moderasi.
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Ulasan: &quot;{r.content.substring(0, 40)}...&quot;
                                    </p>
                                </div>
                            ))}

                            {pendingVendorList.length === 0 &&
                                pendingReviewList.length === 0 && (
                                    <p className="text-sm text-gray-500 italic p-4 text-center">
                                        Tidak ada aktivitas baru yang perlu dimoderasi.
                                    </p>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const VendorManagement = () => {
        const filteredVendors = vendors.filter((v) => v.status === vendorView);
        const totalVendors = filteredVendors.length;

        return (
            <div className="p-6">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Manajemen Vendor</h1>
                <p className="text-gray-500 mb-6">
                    Kelola persetujuan dan status akun Vendor di platform.
                </p>

                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setVendorView('Pending')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                            vendorView === 'Pending'
                                ? `${PRIMARY_COLOR} text-white shadow-lg`
                                : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'
                        }`}
                    >
                        Menunggu Persetujuan ({pendingVendors})
                    </button>
                    <button
                        onClick={() => setVendorView('Approved')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                            vendorView === 'Approved'
                                ? `${PRIMARY_COLOR} text-white shadow-lg`
                                : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'
                        }`}
                    >
                        Disetujui ({approvedVendors})
                    </button>
                    <button
                        onClick={() => setVendorView('Rejected')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                            vendorView === 'Rejected'
                                ? `${PRIMARY_COLOR} text-white shadow-lg`
                                : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'
                        }`}
                    >
                        Ditolak ({vendors.filter((v) => v.status === 'Rejected').length})
                    </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-amber-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Nama Vendor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    No. Telepon
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredVendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {vendor.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {vendor.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {vendor.phone}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <span
                                            className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                vendor.status === 'Approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : vendor.status === 'Pending'
                                                    ? 'bg-amber-100 text-amber-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex justify-center space-x-2">
                                            {vendor.status !== 'Approved' && (
                                                <ActionButton
                                                    icon={CheckCircle}
                                                    title="Setujui"
                                                    color="bg-green-500"
                                                    onClick={() =>
                                                        handleVendorAction(
                                                            vendor.id,
                                                            'Approved',
                                                        )
                                                    }
                                                />
                                            )}
                                            {vendor.status !== 'Rejected' && (
                                                <ActionButton
                                                    icon={XCircle}
                                                    title="Tolak"
                                                    color="bg-yellow-500"
                                                    onClick={() =>
                                                        handleVendorAction(
                                                            vendor.id,
                                                            'Rejected',
                                                        )
                                                    }
                                                />
                                            )}
                                            <ActionButton
                                                icon={Trash2}
                                                title="Hapus"
                                                color="bg-red-500"
                                                onClick={() =>
                                                    handleVendorAction(vendor.id, 'delete')
                                                }
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {totalVendors === 0 && (
                        <p className="text-center py-10 text-gray-500 italic">
                            Tidak ada data vendor di kategori <strong>{vendorView}</strong>.
                        </p>
                    )}
                </div>
            </div>
        );
    };

    const UserManagement = () => {
        const filteredUsers = users.filter((u) => u.status === userView);
        const totalUsers = filteredUsers.length;
        const activeUsersCount = users.filter((u) => u.status === 'Active').length;
        const suspendedUsersCount = users.filter((u) => u.status === 'Suspended').length;

        return (
            <div className="p-6">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Manajemen Pengguna</h1>
                <p className="text-gray-500 mb-6">
                    Kelola status dan akun pengguna yang terdaftar di platform.
                </p>

                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setUserView('Active')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                            userView === 'Active'
                                ? `${PRIMARY_COLOR} text-white shadow-lg`
                                : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'
                        }`}
                    >
                        Aktif ({activeUsersCount})
                    </button>
                    <button
                        onClick={() => setUserView('Suspended')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                            userView === 'Suspended'
                                ? `${PRIMARY_COLOR} text-white shadow-lg`
                                : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'
                        }`}
                    >
                        Ditangguhkan ({suspendedUsersCount})
                    </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-amber-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Nama Pengguna
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    No. Telepon
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.phone}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <span
                                            className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.status === 'Active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex justify-center space-x-2">
                                            {user.status !== 'Active' && (
                                                <ActionButton
                                                    icon={CheckCircle}
                                                    title="Aktifkan"
                                                    color="bg-green-500"
                                                    onClick={() =>
                                                        handleUserAction(user.id, 'Active')
                                                    }
                                                />
                                            )}
                                            {user.status !== 'Suspended' && (
                                                <ActionButton
                                                    icon={XCircle}
                                                    title="Tangguhkan"
                                                    color="bg-yellow-500"
                                                    onClick={() =>
                                                        handleUserAction(user.id, 'Suspended')
                                                    }
                                                />
                                            )}
                                            <ActionButton
                                                icon={Trash2}
                                                title="Hapus"
                                                color="bg-red-500"
                                                onClick={() =>
                                                    handleUserAction(user.id, 'delete')
                                                }
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {totalUsers === 0 && (
                        <p className="text-center py-10 text-gray-500 italic">
                            Tidak ada data pengguna di kategori <strong>{userView}</strong>.
                        </p>
                    )}
                </div>
            </div>
        );
    };

    const ReviewModeration = () => {
        const filteredReviews = reviews.filter((r) => r.status === reviewView);

        return (
            <div className="p-6">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Moderasi Ulasan</h1>
                <p className="text-gray-500 mb-6">
                    Kelola ulasan vendor yang masuk dan tentukan mana yang akan dipublikasikan.
                </p>

                <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
                    {['Pending', 'Approved', 'Rejected'].map((status) => {
                        const count = reviews.filter((r) => r.status === status).length;
                        return (
                            <button
                                key={status}
                                onClick={() => setReviewView(status)}
                                className={`flex-shrink-0 px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                                    reviewView === status
                                        ? `${PRIMARY_COLOR} text-white shadow-lg`
                                        : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'
                                }`}
                            >
                                {status
                                    .replace('Pending', 'Menunggu')
                                    .replace('Approved', 'Disetujui')
                                    .replace('Rejected', 'Ditolak')}{' '}
                                ({count})
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredReviews.length > 0 ? (
                        filteredReviews.map((review) => (
                            <ReviewCard
                                key={review.id}
                                review={review}
                                onAction={handleReviewAction}
                            />
                        ))
                    ) : (
                        <div className="md:col-span-3 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
                            <p className="text-center text-gray-500 italic">
                                Tidak ada ulasan dengan status{' '}
                                <strong>
                                    {reviewView
                                        .replace('Pending', 'Menunggu')
                                        .replace('Approved', 'Disetujui')
                                        .replace('Rejected', 'Ditolak')}
                                </strong>
                                .
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const StaticContentManagement = () => (
        <div className="p-6">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Manajemen Konten Statis</h1>
            <p className="text-gray-500 mb-8">
                Kelola konten halaman non-dinamis seperti &apos;Tentang Kami&apos;, &apos;Kontak
                Kami&apos;, dan &apos;FAQ&apos;.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {Object.keys(staticContent).map((key) => (
                    <div
                        key={key}
                        className="bg-white p-6 rounded-2xl shadow-xl border border-amber-200 bg-gradient-to-br from-white to-amber-50 flex flex-col justify-between transform hover:shadow-2xl hover:scale-[1.01] transition duration-500"
                    >
                        <div>
                            <h2 className={`text-xl font-bold mb-2 ${ACCENT_COLOR}`}>{key}</h2>
                            <p className="text-gray-600 text-sm italic h-16 overflow-hidden leading-relaxed">
                                {staticContent[key].substring(0, 150)}
                                {staticContent[key].length > 150 ? '...' : ''}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingContent(key);
                                setEditorValue(staticContent[key]);
                            }}
                            className={`mt-4 py-2 px-4 rounded-full text-white text-sm font-medium ${PRIMARY_COLOR} ${HOVER_COLOR} transition-colors flex items-center justify-center shadow-lg hover:shadow-xl`}
                        >
                            <Edit size={16} className="mr-2" /> Edit Konten
                        </button>
                    </div>
                ))}
            </div>

            {editingContent && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl transform transition-all duration-300 scale-100 border-t-4 border-amber-500">
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">
                            Edit Konten:{' '}
                            <span className={ACCENT_COLOR}>{editingContent}</span>
                        </h2>
                        <textarea
                            value={editorValue}
                            onChange={(e) => setEditorValue(e.target.value)}
                            rows="15"
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 resize-none font-sans text-base transition duration-150"
                            placeholder={`Masukkan konten untuk halaman ${editingContent}...`}
                        ></textarea>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setEditingContent(null)}
                                className="py-2.5 px-6 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors font-semibold"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleStaticContentSave}
                                className={`py-2.5 px-6 rounded-full text-white font-bold ${PRIMARY_COLOR} ${HOVER_COLOR} transition-colors shadow-lg`}
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const RoleEditor = () => {
        const vendorsForTable = vendors.filter((v) => v.status === 'Approved');

        return (
            <div className="p-6">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                    Edit Role Vendor / Membership
                </h1>
                <p className="text-gray-500 mb-6">
                    Menampilkan vendor yang sudah <strong>Approved</strong>. Pilih role untuk
                    masing-masing vendor — hasil akan tercetak pada invoice dan profil.
                </p>

                <div className="overflow-x-auto bg-white rounded-2xl shadow-2xl border border-amber-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                    Nama
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                    No. Telepon
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                                    Pilih Role
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {vendorsForTable.map((v) => (
                                <tr key={v.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {v.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {v.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {v.phone}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {v.status}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <div className="inline-flex items-center space-x-2 bg-amber-50 p-1 rounded-full">
                                            <button
                                                onClick={() =>
                                                    setRoleEdits((prev) => ({
                                                        ...prev,
                                                        [v.id]: 'Vendor',
                                                    }))
                                                }
                                                className={`px-4 py-1 rounded-full text-sm font-semibold transition-all duration-200 ${
                                                    (roleEdits[v.id] || v.role) === 'Vendor'
                                                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg transform scale-100'
                                                        : 'bg-white text-amber-600 border border-amber-100 hover:scale-[1.02]'
                                                }`}
                                            >
                                                Vendor
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setRoleEdits((prev) => ({
                                                        ...prev,
                                                        [v.id]: 'Membership',
                                                    }))
                                                }
                                                className={`px-4 py-1 rounded-full text-sm font-semibold transition-all duration-200 ${
                                                    (roleEdits[v.id] || v.role) === 'Membership'
                                                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg transform scale-100'
                                                        : 'bg-white text-amber-600 border border-amber-100 hover:scale-[1.02]'
                                                }`}
                                            >
                                                Membership
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {vendorsForTable.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-8 text-gray-500 italic"
                                    >
                                        Belum ada vendor yang disetujui.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500">
                        Perubahan akan diterapkan ke vendor yang dipilih setelah klik Simpan.
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setRoleEdits({})}
                            className="py-2 px-4 rounded-full border border-amber-200 text-amber-700 bg-white hover:bg-amber-50 transition"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleSaveRoles}
                            className="py-2 px-4 rounded-full font-bold text-white bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400 shadow-lg hover:opacity-95 transition"
                        >
                            Simpan Role
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const PaymentSettings = () => {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Payment / Invoice Settings</h1>
                <p className="text-gray-500 mb-6">
                    Atur nomor rekening dan QRIS yang akan muncul di invoice. Setiap bagian dapat diubah terpisah.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-2xl border border-amber-200 p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-amber-700">Nomor Rekening</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Nomor rekening yang akan tercetak di invoice.
                                </p>
                            </div>
                            <div className="text-sm text-gray-400">Default</div>
                        </div>

                        <div className="mt-4">
                            <div className="text-sm text-gray-600 mb-2">Rekening Saat Ini</div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-800 font-medium">
                                    {paymentSettings.bankAccount || (
                                        <span className="text-gray-400 italic">Belum diisi</span>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={openPaymentEdit}
                                        className="py-2 px-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400 text-white font-semibold shadow"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            setPaymentSettings((prev) => ({
                                                ...prev,
                                                bankAccount: '',
                                            }))
                                        }
                                        className="py-2 px-3 rounded-full border border-amber-100 text-amber-700 bg-white hover:bg-amber-50"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-2xl border border-amber-200 p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-amber-700">QRIS</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Gambar QRIS yang akan tampil di invoice (upload terpisah dari rekening).
                                </p>
                            </div>
                            <div className="text-sm text-gray-400">Default</div>
                        </div>

                        <div className="mt-4">
                            <div className="flex items-center space-x-4">
                                {paymentSettings.qrisImage ? (
                                    <div className="w-28 h-28 rounded-lg overflow-hidden border">
                                        <img
                                            src={paymentSettings.qrisImage}
                                            alt="QRIS"
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-28 h-28 rounded-lg border flex items-center justify-center text-gray-400 italic text-sm">
                                        Belum ada QRIS
                                    </div>
                                )}

                                <div className="flex-1">
                                    <div className="text-sm text-gray-600 mb-2">Upload QRIS Baru</div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleQrisUpload(e.target.files[0])}
                                        className="block text-sm text-gray-600"
                                    />
                                    <div className="mt-3 flex space-x-2">
                                        <button
                                            onClick={() =>
                                                setPaymentSettings((prev) => ({
                                                    ...prev,
                                                    qrisImage: null,
                                                }))
                                            }
                                            className="py-2 px-3 rounded-full border border-amber-100 text-amber-700 bg-white hover:bg-amber-50"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSavePayment}
                        className="py-2 px-4 rounded-full font-bold text-white bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400 shadow-lg"
                    >
                        Simpan Pengaturan
                    </button>
                </div>

                {isPaymentEditOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg border-t-4 border-amber-500">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                                Edit Nomor Rekening
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Nomor Rekening
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentForm.bankNumber || ''}
                                        onChange={(e) =>
                                            setPaymentForm((prev) => ({
                                                ...prev,
                                                bankNumber: e.target.value,
                                            }))
                                        }
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:border-amber-400"
                                        placeholder="Contoh: 1234567890"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Nama Bank
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentForm.bankName || ''}
                                        onChange={(e) =>
                                            setPaymentForm((prev) => ({
                                                ...prev,
                                                bankName: e.target.value,
                                            }))
                                        }
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:border-amber-400"
                                        placeholder="Contoh: Bank Contoh"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Preview QRIS (opsional)
                                    </label>
                                    {paymentForm.qrisImage ? (
                                        <div className="w-32 h-32 rounded-lg overflow-hidden border mb-2">
                                            <img
                                                src={paymentForm.qrisImage}
                                                alt="QRIS preview"
                                                className="object-contain w-full h-full"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500 italic mb-2">
                                            Belum ada QRIS yang diupload untuk preview.
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            handlePaymentFormQrisUpload(e.target.files[0])
                                        }
                                        className="block text-sm text-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => setIsPaymentEditOpen(false)}
                                    className="py-2 px-4 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => {
                                        setPaymentForm((prev) => ({
                                            ...prev,
                                            bankAccount: `${prev.bankNumber || ''}${
                                                prev.bankName ? ' - ' + prev.bankName : ''
                                            }`,
                                        }));
                                        savePaymentForm();
                                    }}
                                    className="py-2 px-4 rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400 text-white font-semibold"
                                >
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return <DashboardContent />;
            case 'Vendor':
                return <VendorManagement />;
            case 'Users':
                return <UserManagement />;
            case 'Reviews':
                return <ReviewModeration />;
            case 'StaticContent':
                return <StaticContentManagement />;
            case 'EditRole':
                return <RoleEditor />;
            case 'Payment':
                return <PaymentSettings />;
            case 'KonfirmasiPembayaran':
                return (
                    <PaymentConfirmation
                        paymentRequests={paymentRequests}
                        onAction={handlePaymentAction}
                    />
                );
            default:
                return <DashboardContent />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div
                    className={`${ACCENT_COLOR.replace(
                        'text-',
                        'border-t-',
                    )} border-4 border-solid border-gray-200 h-12 w-12 rounded-full animate-spin`}
                ></div>
                <p className="ml-4 text-gray-600">Memuat Admin Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-red-50 p-8">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200">
                    <h1 className="text-xl font-bold text-red-600 mb-4">Kesalahan Fatal</h1>
                    <p className="text-gray-700">{error}</p>
                    <p className="text-sm mt-4 text-gray-500">
                        Jika ini API, pastikan server Laravel Anda berjalan.
                    </p>
                </div>
            </div>
        );
    }

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'KonfirmasiPembayaran', icon: DollarSign, count: pendingPayments, label: 'Konfirmasi Bayar' },
        { name: 'Vendor', icon: Users, count: pendingVendors, label: 'Vendor' },
        { name: 'Users', icon: Users, label: 'Pengguna' },
        { name: 'Reviews', icon: MessageSquare, count: pendingReviews, label: 'Ulasan' },
        { name: 'StaticContent', icon: FileText, label: 'Konten Statis' },
        { name: 'EditRole', icon: FileBadge, label: 'Edit Role' },
        { name: 'Payment', icon: CreditCard, label: 'Payment' },
    ];

    return (
        <div className="flex bg-gray-50 font-sans">
            <nav className="w-64 bg-white shadow-xl flex flex-col justify-between p-6 border-r border-gray-100 fixed h-screen top-0 left-0 z-10">
                <div>
                    <div className="flex items-center mb-10">
                        <span
                            className={`${GRADIENT_CLASS} bg-clip-text text-transparent text-2xl font-extrabold tracking-tight`}
                        >
                            Admin Dashboard
                        </span>
                    </div>

                    <div className="overflow-y-auto max-h-[calc(100vh-180px)] -mx-2 pr-2">
                        <ul className="space-y-2">
                            {navItems.map((item) => {
                                const isActive = activeTab === item.name;
                                const Icon = item.icon;
                                return (
                                    <li key={item.name}>
                                        <button
                                            onClick={() => setActiveTab(item.name)}
                                            className={`flex items-center w-full p-3 rounded-xl text-left transition-colors duration-200 ${
                                                isActive
                                                    ? `text-white ${PRIMARY_COLOR} shadow-lg shadow-amber-200`
                                                    : 'text-gray-600 hover:bg-amber-50 hover:text-amber-600'
                                            }`}
                                        >
                                            <Icon size={20} className="mr-3" />
                                            <span className="flex-1 font-semibold">
                                                {item.label || item.name}
                                            </span>
                                            {item.count > 0 && (
                                                <span
                                                    className={`text-xs font-bold py-0.5 px-2 rounded-full ${
                                                        isActive
                                                            ? 'bg-white text-amber-500'
                                                            : 'bg-red-500 text-white'
                                                    }`}
                                                >
                                                    {item.count}
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex-shrink-0">
                    <p
                        className="text-xs text-gray-400 mb-2 truncate"
                        title="Admin Mock"
                    >
                        ID Admin: mock-admin-123
                    </p>
                    <button
                        onClick={() => {
                            // LOGOUT sungguhan via Inertia → POST ke /logout (route Breeze)
                            router.post('/logout');
                        }}
                        className="flex items-center w-full p-3 rounded-xl text-left transition-colors duration-200 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white font-semibold shadow-md hover:shadow-lg"
                    >
                        <LogOut size={20} className="mr-3" />
                        <span className="font-medium">Keluar</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 overflow-y-auto ml-64">
                <div className="p-4 md:p-8">{renderContent()}</div>
            </main>
        </div>
    );
};

export default App;
