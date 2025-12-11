import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Package, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';

const SelectDate = ({ vendor, selectedPackage, auth }) => {
    
    // =================================================================
    // [PERBAIKAN KRUSIAL] - Penanganan Props yang Hilang (Penyebab Blank Page)
    // =================================================================
    if (!vendor || !selectedPackage) {
        // Tampilkan halaman error yang jelas alih-alih blank page
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <Head title="Error Data" />
                <div className="text-center p-8 bg-white shadow-xl rounded-xl">
                    <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-red-700">Data Pemesanan Tidak Lengkap</h1>
                    <p className="text-gray-600 mt-2">
                        Vendor atau Paket yang dipilih tidak ditemukan. Pastikan Anda mengakses halaman ini dari link yang benar.
                    </p>
                </div>
            </div>
        );
    }
    // =================================================================

    const [orderDate, setOrderDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Ambil CSRF Token dari DOM (Penting untuk Laravel POST request)
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        // Validasi jika tanggal belum dipilih
        if (!orderDate) {
            setErrorMessage('Tanggal pemesanan harus dipilih.');
            return;
        }

        // Reset pesan sebelumnya
        setErrorMessage('');
        setSuccessMessage('');

        // Kirim data ke backend
        fetch('/order', { // Menggunakan path relatif '/order' yang sesuai dengan route('order.store')
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken, // <-- Tambahkan CSRF Token
            },
            body: JSON.stringify({
                vendor_id: vendor.id,
                package_id: selectedPackage.id,
                order_date: orderDate,
            }),
        })
        .then(async (response) => {
            const data = await response.json();

            if (response.ok) {
                // Sukses (Status 200/201)
                setSuccessMessage(data.message || 'Pemesanan berhasil dibuat! Silakan tunggu konfirmasi.');
                setErrorMessage('');
            } else {
                // Error dari server (Status 4xx/5xx)
                setErrorMessage(data.message || 'Gagal membuat pemesanan. Coba lagi!');
                setSuccessMessage('');
                // Opsional: Log error validasi jika ada
                if (data.errors) {
                    console.error("Validation Errors:", data.errors);
                }
            }
        })
        .catch((error) => {
            setErrorMessage('Terjadi kesalahan koneksi, coba lagi nanti!');
            setSuccessMessage('');
            console.error('Error:', error);
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title={`Atur Jadwal Pemesanan`} />
            <Navbar auth={auth} />

            <main className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
                        <div className="px-8 py-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                Atur Jadwal Pemesanan
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Pilih tanggal yang sesuai untuk pemesanan paket 
                                **"{selectedPackage.name}"** dari vendor **"{vendor.name}"**.
                            </p>
                        </div>
                    </div>

                    {/* Formulir Pemesanan */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        {/* Pesan Error dan Sukses */}
                        {successMessage && (
                            <div className="text-green-600 bg-green-100 p-4 mb-4 rounded-lg flex items-center">
                                <CheckCircle size={16} className="mr-2" />
                                {successMessage}
                            </div>
                        )}
                        {errorMessage && (
                            <div className="text-red-600 bg-red-100 p-4 mb-4 rounded-lg flex items-center">
                                {/* Ganti CheckCircle dengan AlertTriangle untuk error */}
                                <AlertTriangle size={16} className="mr-2" /> 
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center">
                                    <label className="text-lg text-gray-800 w-32">Pilih Tanggal:</label>
                                    <input
                                        type="date"
                                        value={orderDate}
                                        onChange={(e) => setOrderDate(e.target.value)}
                                        required
                                        className="w-full py-2 px-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-amber-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-amber-600 transition-all duration-300"
                                    >
                                        Simpan Tanggal
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SelectDate;