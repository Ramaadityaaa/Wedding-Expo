import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react'; 
import { CheckCircle, AlertTriangle } from 'lucide-react';

const SelectDate = ({ vendor, package: packageData, auth }) => {
    
    const { props } = usePage();
    // Ambil flash message error dari redirect
    const serverError = props.flash?.error; 

    // =================================================================
    // [PERBAIKAN KRUSIAL] - Guard Clause untuk Error Props
    // =================================================================
    // Cek apakah vendor/packageData hilang ATAU ada error yang dikirim dari server
    if (!vendor || !packageData || serverError) {
        
        // Tentukan pesan error yang akan ditampilkan
        const displayMessage = serverError || 
                               'Vendor atau Paket yang dipilih tidak ditemukan atau data hilang saat loading. Pastikan Anda mengakses halaman ini dari link yang benar.';

        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <Head title="Error Data" />
                <div className="text-center p-8 bg-white shadow-xl rounded-xl">
                    <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-red-700">Data Pemesanan Tidak Lengkap</h1>
                    <p className="text-gray-600 mt-2">
                        {displayMessage}
                    </p>
                    {/* Tambahkan tombol kembali */}
                    <button 
                        onClick={() => window.history.back()}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-500 hover:bg-gray-600"
                    >
                        &larr; Kembali
                    </button>
                </div>
            </div>
        );
    }
    
    // =================================================================
    // Bagian Utama Komponen (Hanya dirender jika vendor dan packageData ADA)
    // =================================================================

    const [orderDate, setOrderDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!orderDate) {
            setErrorMessage('Tanggal pemesanan harus dipilih.');
            return;
        }

        setErrorMessage('');
        setSuccessMessage('');
        
        router.post(route('order.store'), {
            vendor_id: vendor.id,
            package_id: packageData.id, 
            order_date: orderDate,
        }, {
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false), 
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                setErrorMessage(firstError || "Gagal membuat pemesanan. Cek kembali data Anda.");
                setSuccessMessage('');
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title={`Atur Jadwal Pemesanan`} />
            <main className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
                        <div className="px-8 py-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                Atur Jadwal Pemesanan
                            </h1>
                            <p className="text-gray-600 text-lg">
                                {/* Di sini aman karena sudah dicek di guard clause di atas */}
                                Pilih tanggal yang sesuai untuk pemesanan paket **"{packageData.name}"** dari vendor **"{vendor.name}"**. 
                            </p>
                        </div>
                    </div>

                    {/* Formulir Pemesanan */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        {/* Pesan Error dan Sukses */}
                        {successMessage && (
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 flex items-center" role="alert">
                                <CheckCircle className="w-5 h-5 mr-3" />
                                <p className="font-bold">Berhasil!</p>
                                <p className="text-sm ml-2">{successMessage}</p>
                            </div>
                        )}
                        {errorMessage && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-center" role="alert">
                                <AlertTriangle className="w-5 h-5 mr-3" />
                                <p className="font-bold">Gagal!</p>
                                <p className="text-sm ml-2">{errorMessage}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center">
                                    <label htmlFor="order_date" className="text-lg text-gray-800 w-32 shrink-0">Pilih Tanggal:</label>
                                    <input
                                        id="order_date"
                                        type="date"
                                        value={orderDate}
                                        onChange={(e) => setOrderDate(e.target.value)}
                                        required
                                        min={new Date().toISOString().split('T')[0]} 
                                        className="w-full py-2 px-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        disabled={processing}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className={`font-bold py-2 px-6 rounded-lg transition-all duration-300 ${
                                            processing 
                                            ? 'bg-amber-300 cursor-not-allowed' 
                                            : 'bg-amber-500 text-white hover:bg-amber-600 shadow-md'
                                        }`}
                                        disabled={processing || !orderDate} 
                                    >
                                        {processing ? 'Memproses...' : 'Lanjutkan Pembayaran'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SelectDate;