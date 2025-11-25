import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';

// Asumsi: File ini adalah Admin/Vendors/Index.jsx atau serupa

const VendorsIndex = ({ initialCounts }) => {
    // 1. STATE MANAGEMENT
    const [vendors, setVendors] = useState([]); // Data vendor yang ditampilkan
    const [counts, setCounts] = useState(initialCounts || { pending: 0, approved: 0, rejected: 0 }); // Hitungan tab
    const [currentTab, setCurrentTab] = useState('pending'); // Tab yang aktif
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 2. FUNGSI UNTUK MEMUAT DATA DARI API
    const fetchVendorsData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Panggil API endpoint yang telah kita buat
            const response = await axios.get('/api/admin/vendors/dashboard', {
                params: { 
                    status: currentTab // Jika Anda ingin memfilter berdasarkan tab (saat ini API Anda hanya mengambil 'pending')
                }
            });
            
            // Perbarui state dengan data dari Controller API (getDashboardData)
            setVendors(response.data.data); 
            setCounts(response.data.counts);

        } catch (err) {
            console.error('Error fetching vendor data:', err);
            setError('Gagal memuat data vendor. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    }, [currentTab]); // Rerun saat currentTab berubah

    // 3. EFFECT HOOK: Panggil fungsi fetch saat komponen dimuat atau tab berubah
    useEffect(() => {
        fetchVendorsData();
    }, [fetchVendorsData]);

    // 4. FUNGSI UNTUK AKSI APPROVE/REJECT
    const handleUpdateStatus = async (vendorId, status) => {
        if (!confirm(`Apakah Anda yakin ingin ${status === 'APPROVED' ? 'menyetujui' : 'menolak'} vendor ini?`)) {
            return;
        }

        try {
            const response = await axios.post(`/api/admin/vendors/update-status/${vendorId}`, {
                status: status
            });
            
            // Setelah berhasil, tampilkan pesan sukses dan muat ulang data
            alert(response.data.message);
            fetchVendorsData(); // Muat ulang data untuk memperbarui daftar dan hitungan tab

        } catch (err) {
            alert(err.response?.data?.message || 'Terjadi kesalahan saat memperbarui status.');
        }
    };

    // 5. RENDER KOMPONEN UTAMA
    if (loading) return <div className="p-4 text-center">Memuat data...</div>;
    if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

    return (
        <div className="p-6">
            <Head title="Manajemen Vendor" />
            <h1 className="text-2xl font-bold mb-4">Manajemen Vendor</h1>
            
            {/* Tampilan Tab Dinamis */}
            <div className="mb-6 flex space-x-4 border-b">
                {['pending', 'approved', 'rejected'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setCurrentTab(tab)}
                        className={`py-2 px-4 border-b-2 font-medium 
                            ${currentTab === tab 
                                ? 'border-orange-500 text-orange-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700'}`
                        }
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
                    </button>
                ))}
            </div>

            {/* Tampilan Tabel Vendor */}
            <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Nama Vendor</th>
                        <th className="py-3 px-6 text-left">Email</th>
                        <th className="py-3 px-6 text-left">No. Telepon</th>
                        <th className="py-3 px-6 text-center">Status</th>
                        <th className="py-3 px-6 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {vendors.length > 0 ? (
                        vendors.map((vendor) => (
                            <tr key={vendor.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{vendor.name}</td>
                                <td className="py-3 px-6 text-left">{vendor.email}</td>
                                <td className="py-3 px-6 text-left">{vendor.phone}</td>
                                <td className="py-3 px-6 text-center">
                                    <span className={`py-1 px-3 rounded-full text-xs font-semibold ${vendor.status_verifikasi === 'PENDING' ? 'bg-yellow-200 text-yellow-800' : (vendor.status_verifikasi === 'APPROVED' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800')}`}>
                                        {vendor.status_verifikasi}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    {vendor.status_verifikasi === 'PENDING' && (
                                        <div className="flex item-center justify-center space-x-2">
                                            {/* Tombol Setujui */}
                                            <button 
                                                onClick={() => handleUpdateStatus(vendor.id, 'APPROVED')} 
                                                className="w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-150"
                                                title="Setujui"
                                            >
                                                <i className="fas fa-check"></i>
                                            </button>
                                            {/* Tombol Tolak */}
                                            <button 
                                                onClick={() => handleUpdateStatus(vendor.id, 'REJECTED')} 
                                                className="w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-150"
                                                title="Tolak"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
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
    );
};

export default VendorsIndex;