import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';

// --- HELPER FUNCTION: Memetakan isApproved (0/1) ke Status String (PENDING/APPROVED) ---
const mapIsApprovedToStatus = (isApproved) => {
    // Ingat: Backend mencari NULL atau 0 untuk PENDING. 
    // Di frontend, kita anggap 0 atau NULL adalah PENDING.
    if (isApproved === 1) return 'APPROVED';
    if (isApproved === 0 || isApproved === null) return 'PENDING';
    return 'UNKNOWN'; // Status default jika ada nilai lain
};

// --- Komponen Modal Sederhana (Pengganti confirm/alert) ---
const SimpleModal = ({ message, onConfirm, onCancel, show }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full">
                <p className="mb-4 text-gray-700">{message}</p>
                <div className="flex justify-end space-x-3">
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                        >
                            Batal
                        </button>
                    )}
                    {onConfirm && (
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                        >
                            Lanjutkan
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
// --- END Komponen Modal ---


const VendorsIndex = ({ initialCounts }) => {
    // 1. STATE MANAGEMENT
    const [vendors, setVendors] = useState([]); 
    const [counts, setCounts] = useState(initialCounts || { pending: 0, approved: 0, rejected: 0 }); 
    const [currentTab, setCurrentTab] = useState('pending'); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // State untuk Modal
    const [modal, setModal] = useState({
        show: false,
        message: '',
        onConfirm: null,
    });

    // 2. FUNGSI UNTUK MEMUAT DATA DARI API
    const fetchVendorsData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Kita panggil API endpoint yang sama
            // Catatan: Pastikan di web.php/api.php Anda memiliki route:
            // Route::get('/admin/vendors/dashboard', [AdminVendorController::class, 'getDashboardData']);
            const response = await axios.get('/api/admin/vendors/dashboard', {
                params: { 
                    // Mengirim status sebagai UPPERCASE agar sesuai dengan logika Controller
                    status: currentTab.toUpperCase() 
                }
            });
            
            setVendors(response.data.data); 
            setCounts(response.data.counts);

        } catch (err) {
            console.error('Error fetching vendor data:', err.response?.data?.message || err.message);
            setError('Gagal memuat data vendor. Silakan cek konsol untuk detail.');
        } finally {
            setLoading(false);
        }
    }, [currentTab]);

    // 3. EFFECT HOOK: Panggil fungsi fetch saat komponen dimuat atau tab berubah
    useEffect(() => {
        fetchVendorsData();
    }, [fetchVendorsData]);

    // 4. FUNGSI UNTUK AKSI APPROVE/REJECT
    const handleAction = async (vendorId, status) => {
        setModal({
            show: true,
            message: `Apakah Anda yakin ingin ${status === 'APPROVED' ? 'menyetujui' : 'menolak'} vendor ini?`,
            onConfirm: async () => {
                setModal({ show: false, message: '', onConfirm: null }); // Tutup modal konfirmasi
                try {
                    const response = await axios.post(`/api/admin/vendors/update-status/${vendorId}`, {
                        status: status
                    });
                    
                    // Tampilkan pesan sukses dalam modal baru (sebagai pengganti alert)
                    setModal({
                        show: true,
                        message: response.data.message,
                        onConfirm: () => setModal({ show: false, message: '', onConfirm: null }),
                        onCancel: null, // Hanya tombol OK
                    });
                    fetchVendorsData(); // Muat ulang data

                } catch (err) {
                    const errorMessage = err.response?.data?.message || 'Terjadi kesalahan saat memperbarui status.';
                    setModal({
                        show: true,
                        message: `Gagal: ${errorMessage}`,
                        onConfirm: () => setModal({ show: false, message: '', onConfirm: null }),
                        onCancel: null,
                    });
                }
            },
            onCancel: () => setModal({ show: false, message: '', onConfirm: null }),
        });
    };

    // 5. RENDER KOMPONEN UTAMA
    // PENTING: Tambahkan wrapper untuk menghindari horizontal scroll di mobile
    return (
        <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
            <Head title="Manajemen Vendor" />
            
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">Manajemen Vendor</h1>
            
            {/* Tampilan Tab Dinamis */}
            <div className="mb-6 flex space-x-2 sm:space-x-4 border-b">
                {['pending', 'approved', 'rejected'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setCurrentTab(tab)}
                        className={`py-2 px-3 sm:px-4 text-sm sm:text-base border-b-2 font-semibold transition duration-150 
                            ${currentTab === tab 
                                ? 'border-orange-500 text-orange-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700'}`
                        }
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)} 
                        <span className="ml-1 bg-gray-200 text-gray-700 px-2 py-0.5 text-xs rounded-full">
                            {counts[tab] || 0}
                        </span>
                    </button>
                ))}
            </div>

            {loading && <div className="p-4 text-center text-orange-500">Memuat data...</div>}
            {error && <div className="p-4 text-center text-red-600 border border-red-300 bg-red-50 rounded-lg">{error}</div>}

            {/* Tampilan Tabel Vendor */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Vendor</th>
                            <th className="py-3 px-4 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Akun</th> {/* PERBAIKAN: Ambil dari relasi User */}
                            <th className="py-3 px-4 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terdaftar</th>
                            <th className="py-3 px-4 sm:px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="py-3 px-4 sm:px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vendors.length > 0 ? (
                            vendors.map((vendor) => {
                                // 2. PERBAIKAN: Hitung status dari isApproved
                                const statusString = mapIsApprovedToStatus(vendor.isApproved);
                                
                                return (
                                    <tr key={vendor.id} className="hover:bg-gray-50 transition duration-100">
                                        {/* vendor.name sudah benar */}
                                        <td className="py-3 px-4 sm:px-6 text-sm font-medium text-gray-900 whitespace-nowrap">{vendor.name}</td>
                                        
                                        {/* 3. PERBAIKAN: Mengambil Email dari relasi User */}
                                        <td className="py-3 px-4 sm:px-6 text-sm text-gray-500">{vendor.user ? vendor.user.email : 'N/A'}</td>
                                        
                                        {/* Mengambil Created At */}
                                        <td className="py-3 px-4 sm:px-6 text-sm text-gray-500">{new Date(vendor.created_at).toLocaleDateString()}</td>
                                        
                                        {/* 4. PERBAIKAN: Badge Status menggunakan statusString */}
                                        <td className="py-3 px-4 sm:px-6 text-center">
                                            <span className={`py-1 px-3 rounded-full text-xs font-semibold ${
                                                statusString === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                                                (statusString === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')
                                            }`}>
                                                {statusString}
                                            </span>
                                        </td>
                                        
                                        {/* 5. PERBAIKAN: Aksi menggunakan statusString */}
                                        <td className="py-3 px-4 sm:px-6 text-center">
                                            {statusString === 'PENDING' && (
                                                <div className="flex item-center justify-center space-x-2">
                                                    {/* Tombol Setujui */}
                                                    <button 
                                                        onClick={() => handleAction(vendor.id, 'APPROVED')} 
                                                        className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-150 shadow-md"
                                                        title="Setujui"
                                                    >
                                                        <i className="fas fa-check"></i>
                                                    </button>
                                                    {/* Tombol Tolak */}
                                                    <button 
                                                        onClick={() => handleAction(vendor.id, 'REJECTED')} 
                                                        className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-150 shadow-md"
                                                        title="Tolak"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            )}
                                            {statusString === 'APPROVED' && (
                                                <button 
                                                    onClick={() => handleAction(vendor.id, 'REJECTED')} 
                                                    className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                                >
                                                    Tolak
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-500">
                                    Tidak ada data vendor untuk status {currentTab.toUpperCase()}.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Modal untuk Konfirmasi dan Notifikasi */}
            <SimpleModal
                {...modal}
            />
        </div>
    );
};

export default VendorsIndex;