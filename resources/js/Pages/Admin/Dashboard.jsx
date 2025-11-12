import React, { useState, useEffect, useMemo } from 'react';
import { LogOut, Users, MessageSquare, FileText, LayoutDashboard, CheckCircle, XCircle, Trash2, Edit, TrendingUp, Clock, FileBadge } from 'lucide-react';

// --- KONFIGURASI UMUM & MOCK API SIMULATION ---

// Waktu tunda untuk simulasi respons API dari Laravel
const API_DELAY = 500; 

// Fungsi untuk mensimulasikan panggilan API (menggantikan Firebase CRUD)
const simulateApiCall = (data) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(data);
        }, API_DELAY);
    });
};

// Data Mock awal (Menambahkan 'phone' ke Vendor dan User)
const MOCK_VENDORS = [
    { id: 'v1', name: 'WO Bunga Cinta', email: 'bunga@wo.com', phone: '081234567890', status: 'Pending' },
    { id: 'v2', name: 'WO Emas Abadi', email: 'emas@wo.com', phone: '082198765432', status: 'Approved' },
    { id: 'v3', name: 'WO Pelangi', email: 'pelangi@wo.com', phone: '085711223344', status: 'Pending' },
    { id: 'v4', name: 'WO Silver Moon', email: 'silver@wo.com', phone: '089955667788', status: 'Rejected' },
    { id: 'v5', name: 'WO Ceria Pesta', email: 'ceria@wo.com', phone: '081512345678', status: 'Approved' },
    { id: 'v6', name: 'WO Mega Indah', email: 'mega@wo.com', phone: '087812341234', status: 'Pending' },
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

const INITIAL_STATIC_CONTENT = {
    'Tentang Kami': 'Ini adalah platform direktori vendor terlengkap di Indonesia. Kami menghubungkan calon pengantin dengan vendor terbaik.',
    'Kontak Kami': 'Hubungi kami melalui email: admin@weddingexpo.co.id atau telepon: (021) 1234-5678.',
    'FAQ': 'Q: Bagaimana cara mendaftar? A: Klik tombol "Daftar Vendor" di sudut kanan atas. Q: Berapa biaya yang dikenakan? A: Biaya layanan bervariasi.',
};

// Mock Functions API (Menggantikan Firestore Calls)
const fetchVendors = () => simulateApiCall(MOCK_VENDORS);
const fetchUsers = () => simulateApiCall(MOCK_USERS);
const fetchReviews = () => simulateApiCall(MOCK_REVIEWS);
const fetchStaticContent = () => simulateApiCall(INITIAL_STATIC_CONTENT);

const updateVendorStatus = (id, status) => simulateApiCall({ success: true, id, status });
const deleteVendor = (id) => simulateApiCall({ success: true, id });

const updateReviewStatus = (id, status) => simulateApiCall({ success: true, id, status });
const deleteReview = (id) => simulateApiCall({ success: true, id });

const updateUserStatus = (id, status) => simulateApiCall({ success: true, id, status });
const deleteUser = (id) => simulateApiCall({ success: true, id });

const saveStaticContent = (key, value) => simulateApiCall({ success: true, key, value });

// Warna Kustom yang terinspirasi dari gambar (Warm Gold/Amber)
const PRIMARY_COLOR = 'bg-amber-500';
const HOVER_COLOR = 'hover:bg-amber-600';
const ACCENT_COLOR = 'text-amber-600';
const GRADIENT_CLASS = 'bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500'; // Gradasi Emas

// --- KOMPONEN UI KECIL (SummaryCard, ActionButton, ReviewCard) ---

// Kartu Ringkasan Dashboard (Diperbarui dengan Gradasi dan Efek Glowing)
const SummaryCard = ({ icon: Icon, title, value, colorClass }) => (
    // Penambahan min-h-40 (sekitar 10rem atau 160px) untuk membuatnya lebih persegi panjang
    <div className={`p-5 rounded-xl text-white flex flex-col justify-between 
        ${colorClass} 
        shadow-lg 
        transform transition duration-500 ease-in-out 
        hover:scale-[1.05] 
        hover:shadow-[0_0_20px_rgba(251,191,36,0.8)]
        min-h-40`}>
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium opacity-90">{title}</h3>
            {/* Ikon diperbarui */}
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

// Review Card Component (Dipotong untuk brevity)
const ReviewCard = ({ review, onAction }) => {
    const statusBg = review.status === 'Approved' ? 'bg-green-100 text-green-800' : review.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800';
    const borderColor = review.status === 'Approved' ? 'border-green-300' : review.status === 'Pending' ? 'border-amber-500' : 'border-red-300';
    
    return (
        <div className={`bg-white p-5 rounded-xl shadow-lg border-t-4 ${borderColor} flex flex-col justify-between transition duration-300 hover:shadow-xl`}>
            {/* Header / Meta Info */}
            <div className="flex justify-between items-start mb-3 border-b pb-2">
                <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">Vendor</p>
                    <p className="text-lg font-bold text-gray-800 truncate" title={review.vendorName}>{review.vendorName}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusBg}`}>
                    {review.status}
                </span>
            </div>

            {/* Content */}
            <p className="text-sm italic text-gray-700 mb-4 h-16 overflow-y-auto leading-relaxed">
                "{review.content}"
            </p>
            
            {/* Footer / User & Actions */}
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


// --- KOMPONEN UTAMA (App) ---

const App = () => {
    // State Data Aplikasi
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [vendorView, setVendorView] = useState('Pending'); 
    const [reviewView, setReviewView] = useState('Pending'); 
    const [userView, setUserView] = useState('Active');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Data Aplikasi (Mock State)
    const [vendors, setVendors] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [users, setUsers] = useState([]);
    const [staticContent, setStaticContent] = useState(INITIAL_STATIC_CONTENT);

    // State untuk Static Content Editor
    const [editingContent, setEditingContent] = useState(null);
    const [editorValue, setEditorValue] = useState('');

    // --- DATA FETCHING DENGAN MOCK API (Mengganti Firebase) ---
    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetching data dari Mock API (simulasi Laravel endpoints)
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

            } catch (e) {
                console.error('Gagal memuat data dari API:', e);
                setError('Gagal memuat data. Mohon periksa koneksi atau API.');
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
        
    }, []); 

    // --- LOGIKA APLIKASI (CRUD) ---

    // Handler Aksi Vendor (Dipotong untuk brevity)
    const handleVendorAction = async (vendorId, status) => {
        const actionName = status === 'delete' ? 'menghapus' : status === 'Approved' ? 'menyetujui' : 'menolak';
        const isConfirmed = window.confirm(`Apakah Anda yakin ingin ${actionName} vendor ID: ${vendorId}?`);
        if (!isConfirmed) return;

        try {
            if (status === 'delete') {
                await deleteVendor(vendorId); // Mock API Call
                setVendors(prev => prev.filter(v => v.id !== vendorId));
                console.log(`Vendor ${vendorId} berhasil dihapus.`);
            } else {
                await updateVendorStatus(vendorId, status); // Mock API Call
                setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, status: status } : v));
                console.log(`Vendor ${vendorId} status diperbarui menjadi ${status}.`);
            }
        } catch (e) {
            console.error(`Gagal melakukan aksi ${status} pada vendor:`, e);
            setError(`Aksi gagal. Error: ${e.message}`);
        }
    };
    
    // Handler Aksi Ulasan (Dipotong untuk brevity)
    const handleReviewAction = async (reviewId, status) => {
        const actionName = status === 'delete' ? 'menghapus' : status === 'Approved' ? 'menyetujui' : 'menolak';
        const isConfirmed = window.confirm(`Apakah Anda yakin ingin ${actionName} ulasan ID: ${reviewId}?`);
        if (!isConfirmed) return;

        try {
            if (status === 'delete') {
                await deleteReview(reviewId); // Mock API Call
                setReviews(prev => prev.filter(r => r.id !== reviewId));
                console.log(`Ulasan ${reviewId} berhasil dihapus.`);
            } else {
                await updateReviewStatus(reviewId, status); // Mock API Call
                setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: status } : r));
                console.log(`Ulasan ${reviewId} status diperbarui menjadi ${status}.`);
            }
        } catch (e) {
            console.error(`Gagal melakukan aksi ${status} pada ulasan:`, e);
            setError(`Aksi gagal. Error: ${e.message}`);
        }
    };

    // Handler Aksi Pengguna (Dipotong untuk brevity)
    const handleUserAction = async (id, action) => {
        const actionName = action === 'delete' ? 'menghapus' : action === 'Suspended' ? 'menangguhkan' : 'mengaktifkan';
        const isConfirmed = window.confirm(`Apakah Anda yakin ingin ${actionName} pengguna ID: ${id}?`);
        if (!isConfirmed) return;

        try {
            if (action === 'delete') {
                await deleteUser(id); // Mock API Call
                setUsers(prev => prev.filter(u => u.id !== id));
                console.log(`Pengguna ${id} berhasil dihapus.`);
            } else {
                await updateUserStatus(id, action); // Mock API Call
                setUsers(prev => prev.map(u => u.id === id ? { ...u, status: action } : u));
                console.log(`Pengguna ${id} status diperbarui menjadi ${action}.`);
            }
        } catch (e) {
            console.error(`Gagal melakukan aksi ${action} pada pengguna:`, e);
            setError(`Aksi gagal. Error: ${e.message}`);
        }
    };

    // Handler Simpan Konten Statis (Dipotong untuk brevity)
    const handleStaticContentSave = async () => {
        if (!editingContent) return;
        
        const isConfirmed = window.confirm(`Simpan perubahan untuk ${editingContent}?`);
        if (!isConfirmed) return;

        try {
            await saveStaticContent(editingContent, editorValue); // Mock API Call
            setStaticContent(prev => ({ ...prev, [editingContent]: editorValue }));
            setEditingContent(null);
            console.log(`Konten statis ${editingContent} berhasil diperbarui.`);
        } catch (e) {
            console.error('Gagal menyimpan konten statis:', e);
            setError(`Gagal menyimpan. Error: ${e.message}`);
        }
    };

    // --- DATA TURUNAN UNTUK DASHBOARD ---
    const pendingVendors = useMemo(() => vendors.filter(v => v.status === 'Pending').length, [vendors]);
    const approvedVendors = useMemo(() => vendors.filter(v => v.status === 'Approved').length, [vendors]);
    const pendingReviews = useMemo(() => reviews.filter(r => r.status === 'Pending').length, [reviews]);
    const activeUsers = useMemo(() => users.filter(u => u.status === 'Active').length, [users]);

    // --- RENDER TAB CONTENTS ---

    // 1. DASHBOARD OVERVIEW (Layout Diperbarui)
    const DashboardContent = () => {
        
        const activeVendorList = vendors.filter(v => v.status === 'Approved').slice(0, 5);
        const activeUserList = users.filter(u => u.status === 'Active').slice(0, 5);
        const pendingVendorList = vendors.filter(v => v.status === 'Pending').slice(0, 5);
        const pendingReviewList = reviews.filter(r => r.status === 'Pending').slice(0, 5);
        
        return (
            <div className="space-y-8 p-6">
                <h1 className="text-3xl font-extrabold text-gray-800">Panel Kontrol Utama</h1>
                <p className="text-gray-500">Selamat datang kembali, Super Admin. Ini adalah ringkasan aktivitas platform Anda.</p>
                
                {/* Bagian Atas: Summary Cards (Menggunakan Gradasi Emas) */}
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
                
                {/* Bagian Bawah: Dua Kolom (Kiri: Aktif, Kanan: Terbaru) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* KIRI: Daftar Pengguna & Vendor Aktif */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                            <CheckCircle size={20} className="text-green-500 mr-2" /> 
                            Pengguna & Vendor Aktif
                        </h2>
                        <div className="space-y-6">
                            
                            {/* Vendor Aktif */}
                            <div>
                                <h3 className="text-lg font-bold text-amber-600 mb-2 border-b border-amber-100 pb-1">Vendor Aktif ({approvedVendors})</h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    {activeVendorList.length > 0 ? (
                                        activeVendorList.map(v => (
                                            <li key={v.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                                                <span className="font-medium truncate">{v.name}</span>
                                                <span className="text-xs text-gray-500 ml-2">{v.email}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="italic text-gray-500">Tidak ada vendor aktif.</li>
                                    )}
                                </ul>
                            </div>

                            {/* Pengguna Aktif */}
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-lg font-bold text-blue-600 mb-2 border-b border-blue-100 pb-1">Pengguna Terdaftar Aktif ({activeUsers})</h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    {activeUserList.length > 0 ? (
                                        activeUserList.map(u => (
                                            <li key={u.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                                                <span className="font-medium truncate">{u.name}</span>
                                                <span className="text-xs text-gray-500 ml-2">{u.email}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="italic text-gray-500">Tidak ada pengguna aktif.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    {/* KANAN: Aktivitas Terbaru */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                            <MessageSquare size={20} className="text-amber-500 mr-2" />
                            Aktivitas Terbaru
                        </h2>
                        <div className="space-y-3">
                            {/* Vendor Pending */}
                            {pendingVendorList.map((v) => (
                                <div key={v.id} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400 transition hover:bg-red-100">
                                    <p className="text-sm text-gray-800">
                                        <span className="font-bold text-red-600">Vendor Baru:</span> **{v.name}** menunggu persetujuan.
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Email: {v.email}</p>
                                </div>
                            ))}
                            {/* Review Pending */}
                            {pendingReviewList.map((r) => (
                                <div key={r.id} className="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400 transition hover:bg-amber-100">
                                    <p className="text-sm text-gray-800">
                                        <span className="font-bold text-amber-600">Ulasan Baru:</span> Dari {r.userName} untuk **{r.vendorName}** menunggu moderasi.
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Ulasan: "{r.content.substring(0, 40)}..."</p>
                                </div>
                            ))}

                            {(pendingVendorList.length === 0 && pendingReviewList.length === 0) && (
                                <p className="text-sm text-gray-500 italic p-4 text-center">Tidak ada aktivitas baru yang perlu dimoderasi.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // 2. VENDOR MANAGEMENT (Teks Diperbarui)
    const VendorManagement = () => {
        const filteredVendors = vendors.filter(v => v.status === vendorView);
        const totalVendors = filteredVendors.length;

        return (
            <div className="p-6">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Manajemen Vendor</h1>
                <p className="text-gray-500 mb-6">Kelola persetujuan dan status akun Vendor di platform.</p>

                {/* Sub-Tabs for Vendor View */}
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
                        Ditolak ({vendors.filter(v => v.status === 'Rejected').length})
                    </button>
                </div>
                
                <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-amber-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Vendor</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">No. Telepon</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredVendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.phone}</td> 
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <span className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            vendor.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                            vendor.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                                            'bg-red-100 text-red-800'
                                        }`}>
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
                                                    onClick={() => handleVendorAction(vendor.id, 'Approved')} 
                                                />
                                            )}
                                            {vendor.status !== 'Rejected' && (
                                                <ActionButton 
                                                    icon={XCircle} 
                                                    title="Tolak" 
                                                    color="bg-yellow-500" 
                                                    onClick={() => handleVendorAction(vendor.id, 'Rejected')} 
                                                />
                                            )}
                                            <ActionButton 
                                                icon={Trash2} 
                                                title="Hapus" 
                                                color="bg-red-500" 
                                                onClick={() => handleVendorAction(vendor.id, 'delete')} 
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {totalVendors === 0 && <p className="text-center py-10 text-gray-500 italic">Tidak ada data vendor di kategori **{vendorView}**.</p>}
                </div>
            </div>
        );
    };

    // 3. USER MANAGEMENT (Tidak Berubah)
    const UserManagement = () => {
        const filteredUsers = users.filter(u => u.status === userView);
        const totalUsers = filteredUsers.length;
        const activeUsersCount = users.filter(u => u.status === 'Active').length;
        const suspendedUsersCount = users.filter(u => u.status === 'Suspended').length;

        return (
            <div className="p-6">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Manajemen Pengguna</h1>
                <p className="text-gray-500 mb-6">Kelola status dan akun pengguna yang terdaftar di platform.</p>

                {/* Sub-Tabs for User View */}
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
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Pengguna</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">No. Telepon</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td> 
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <span className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                            'bg-red-100 text-red-800'
                                        }`}>
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
                                                    onClick={() => handleUserAction(user.id, 'Active')} 
                                                />
                                            )}
                                            {user.status !== 'Suspended' && (
                                                <ActionButton 
                                                    icon={XCircle} 
                                                    title="Tangguhkan" 
                                                    color="bg-yellow-500" 
                                                    onClick={() => handleUserAction(user.id, 'Suspended')} 
                                                />
                                            )}
                                            <ActionButton 
                                                icon={Trash2} 
                                                title="Hapus" 
                                                color="bg-red-500" 
                                                onClick={() => handleUserAction(user.id, 'delete')} 
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {totalUsers === 0 && <p className="text-center py-10 text-gray-500 italic">Tidak ada data pengguna di kategori **{userView}**.</p>}
                </div>
            </div>
        );
    };

    // 4. REVIEW MODERATION (Tidak Berubah)
    const ReviewModeration = () => {
        const filteredReviews = reviews.filter(r => r.status === reviewView);

        return (
            <div className="p-6">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Moderasi Ulasan</h1>
                <p className="text-gray-500 mb-6">Kelola ulasan vendor yang masuk dan tentukan mana yang akan dipublikasikan.</p>
    
                <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
                    {['Pending', 'Approved', 'Rejected'].map(status => {
                        const count = reviews.filter(r => r.status === status).length;
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
                                {status.replace('Pending', 'Menunggu').replace('Approved', 'Disetujui').replace('Rejected', 'Ditolak')} ({count})
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
                            <p className="text-center text-gray-500 italic">Tidak ada ulasan dengan status **{reviewView.replace('Pending', 'Menunggu').replace('Approved', 'Disetujui').replace('Rejected', 'Ditolak')}**.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };
    
    // 5. STATIC CONTENT MANAGEMENT (Teks Diperbarui)
    const StaticContentManagement = () => (
        <div className="p-6">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Manajemen Konten Statis</h1>
            <p className="text-gray-500 mb-8">Kelola konten halaman non-dinamis seperti 'Tentang Kami', 'Kontak Kami', dan 'FAQ'.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {Object.keys(staticContent).map((key) => (
                    <div 
                        key={key} 
                        className="bg-white p-6 rounded-2xl shadow-xl border border-amber-200 bg-gradient-to-br from-white to-amber-50 flex flex-col justify-between transform hover:shadow-2xl hover:scale-[1.01] transition duration-500"
                    >
                        <div>
                            <h2 className={`text-xl font-bold mb-2 ${ACCENT_COLOR}`}>{key}</h2>
                            <p className="text-gray-600 text-sm italic h-16 overflow-hidden leading-relaxed">{staticContent[key].substring(0, 150)}{staticContent[key].length > 150 ? '...' : ''}</p>
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

            {/* Modal Editor */}
            {editingContent && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl transform transition-all duration-300 scale-100 border-t-4 border-amber-500">
                        <h2 className={`text-3xl font-bold mb-6 text-gray-800`}>Edit Konten: <span className={ACCENT_COLOR}>{editingContent}</span></h2>
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

    // Fungsi untuk memilih konten berdasarkan tab aktif
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
            default:
                return <DashboardContent />;
        }
    };

    // --- RENDER UTAMA (LAYOUT) ---
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className={`${ACCENT_COLOR.replace('text-', 'border-t-')} border-4 border-solid border-gray-200 h-12 w-12 rounded-full animate-spin`}></div>
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
                    <p className="text-sm mt-4 text-gray-500">Jika ini API, pastikan server Laravel Anda berjalan.</p>
                </div>
            </div>
        );
    }
    
    // Navigasi Sidebar (Label Vendor Diperbarui)
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'Vendor', icon: Users, count: pendingVendors, label: 'Vendor' }, 
        { name: 'Users', icon: Users, label: 'Pengguna' },
        { name: 'Reviews', icon: MessageSquare, count: pendingReviews, label: 'Ulasan' },
        { name: 'StaticContent', icon: FileText, label: 'Konten Statis' },
    ];

    return (
        <div className="flex bg-gray-50 font-sans"> {/* min-h-screen dihapus dari sini */}
            {/* Sidebar: Ditambahkan fixed, h-screen, top-0, left-0, dan z-10 */}
            <nav className="w-64 bg-white shadow-xl flex flex-col justify-between p-6 border-r border-gray-100 fixed h-screen top-0 left-0 z-10">
                <div>
                    {/* Header Sidebar: Admin Dashboard dengan Gradasi */}
                    <div className="flex items-center mb-10">
                        <span className={`text-2xl font-extrabold tracking-tight ${GRADIENT_CLASS} bg-clip-text text-transparent`}>
                            Admin Dashboard
                        </span>
                    </div>

                    {/* Menu Items (Dibuat scrollable jika terlalu banyak) */}
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
                                                    : `text-gray-600 hover:bg-amber-50 hover:text-amber-600`
                                            }`}
                                        >
                                            <Icon size={20} className="mr-3" />
                                            <span className="flex-1 font-semibold">{item.label || item.name}</span>
                                            {item.count > 0 && (
                                                <span className={`text-xs font-bold py-0.5 px-2 rounded-full ${
                                                    isActive ? 'bg-white text-amber-500' : 'bg-red-500 text-white'
                                                }`}>
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

                {/* Info User & Logout (Mocked) - Diubah menjadi Merah */}
                <div className="pt-6 border-t border-gray-100 flex-shrink-0">
                    <p className="text-xs text-gray-400 mb-2 truncate" title="Admin Mock">ID Admin: mock-admin-123</p>
                    <button
                        // Fungsi logout hanya simulasi
                        onClick={() => { console.log("Simulasi Logout. Di aplikasi Laravel/React, ini akan memanggil endpoint /logout."); }}
                        // Styling tombol Keluar diubah ke warna merah
                        className="flex items-center w-full p-3 rounded-xl text-left transition-colors duration-200 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white font-semibold shadow-md hover:shadow-lg"
                    >
                        <LogOut size={20} className="mr-3" />
                        <span className="font-medium">Keluar (Simulasi)</span>
                    </button>
                </div>
            </nav>

            {/* Main Content Area: Ditambahkan ml-64 untuk mengimbangi sidebar yang fixed */}
            <main className="flex-1 overflow-y-auto ml-64">
                <div className="p-4 md:p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default App;