import React, { useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react'; // Tambahkan router untuk polling
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react'; 

export default function VerificationStatus({ status, rejectionReason }) {
    
    // --- FITUR TAMBAHAN: POLLING OTOMATIS ---
    useEffect(() => {
        let interval;
        
        // Hanya lakukan polling jika status masih 'pending'
        if (status?.toLowerCase() === 'pending') {
            interval = setInterval(() => {
                // reload hanya data 'status' dan 'rejectionReason' dari server
                router.reload({ only: ['status', 'rejectionReason'] });
            }, 5000); // Cek setiap 5 detik
        }

        // Jika tiba-tiba status berubah jadi approved, langsung pindahkan ke dashboard
        if (status?.toLowerCase() === 'approved') {
            router.visit(route('vendor.dashboard'));
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [status]);

    const renderContent = () => {
        // Normalisasi status ke lowercase agar tidak ada error typo
        const currentStatus = status?.toLowerCase();

        switch (currentStatus) {
            case 'approved':
                return (
                    <div className="text-center p-10 bg-white shadow-xl rounded-xl max-w-lg mx-auto border-t-4 border-green-500">
                        <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
                        <h1 className="text-3xl font-bold text-gray-800 mb-3">Selamat! Akun Anda Telah Disetujui</h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Tim administrasi kami telah meninjau dan menyetujui akun vendor Anda.
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Sekarang Anda dapat mulai mengelola profil, menambah layanan, dan berinteraksi dengan calon pengantin.
                        </p>
                        <Link href={route('vendor.dashboard')}> 
                            <button className="px-8 py-3 font-semibold rounded-full text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center mx-auto">
                                Ke Dashboard Vendor <ArrowRight className="ml-2 w-5 h-5"/>
                            </button>
                        </Link>
                    </div>
                );

            case 'rejected':
                return (
                    <div className="text-center p-10 bg-white shadow-xl rounded-xl max-w-lg mx-auto border-t-4 border-red-600">
                        <XCircle className="w-16 h-16 mx-auto text-red-600 mb-4" />
                        <h1 className="text-3xl font-bold text-gray-800 mb-3">Mohon Maaf, Akun Ditolak</h1>
                        <p className="text-lg text-gray-600 mb-4">
                            Akun Anda belum memenuhi persayaratan untuk menjadi vendor bagian kami.
                        </p>
                        {rejectionReason && (
                            <div className="bg-red-50 p-4 rounded-lg mb-6 border border-red-200">
                                <h3 className="font-semibold text-red-700 mb-2">Alasan Penolakan:</h3>
                                <p className="text-sm text-red-600 italic">{rejectionReason}</p>
                            </div>
                        )}
                        <p className="text-sm text-gray-500 mb-6">
                            Silakan hubungi admin atau perbaiki data Anda dan daftar ulang.
                        </p>
                        <Link href={route('vendor.register')}> 
                            <button className="px-8 py-3 font-semibold rounded-full text-white bg-red-500 hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg">
                                Daftar Ulang
                            </button>
                        </Link>
                    </div>
                );
            
            case 'pending':
            default:
                return (
                    <div className="text-center p-10 bg-white shadow-xl rounded-xl max-w-lg mx-auto border-t-4 border-yellow-500">
                        {/* Tambahkan kelas animate-spin agar jamnya berputar pelan */}
                        <Clock className="w-16 h-16 mx-auto text-yellow-500 mb-4 animate-[spin_3s_linear_infinite]" /> 
                        <h1 className="text-3xl font-bold text-gray-800 mb-3">Akun Dalam Proses Verifikasi</h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Terima kasih telah mendaftar. Tim admin kami sedang meninjau kelengkapan dan persyaratan data Anda.
                        </p>
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 mb-4">
                            <p className="text-sm text-yellow-700 animate-pulse">
                                Halaman ini akan otomatis dialihkan jika status Anda berubah.
                            </p>
                        </div>
                        <p className="text-xs text-gray-400">
                            Estimasi waktu verifikasi: 1-2 hari kerja.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Head title="Status Verifikasi Vendor" />
            {renderContent()}
        </div>
    );
}