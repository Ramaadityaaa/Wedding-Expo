import React from 'react';
// Hapus impor { Head, Link } dari '@inertiajs/react' untuk mengatasi masalah resolusi modul di lingkungan ini (Canvas).
// Dalam proyek Laravel/Inertia, impor asli adalah BENAR.
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react'; 

// Menerima prop 'status' dan 'rejectionReason' dari Laravel
export default function VerificationStatus({ status, rejectionReason }) {
    const renderContent = () => {
        // PENTING: Case harus cocok dengan yang dikirim dari Laravel (yang sudah di strtolower)
        switch (status) {
            case 'approved': // Menggunakan 'approved' (lowercase)
                return (
                    // === Status APPROVED (ELEGANT SUCCESS) ===
                    <div className="text-center p-10 bg-white shadow-xl rounded-xl max-w-lg mx-auto border-t-4 border-green-500"> {/* Border hijau untuk sukses */}
                        <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" /> {/* Ikon hijau */}
                        <h1 className="text-3xl font-bold text-gray-800 mb-3">Selamat! Akun Anda Telah Disetujui</h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Tim administrasi kami telah meninjau dan menyetujui akun vendor Anda.
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Sekarang Anda dapat mulai mengelola profil, menambah layanan, dan berinteraksi dengan calon pengantin.
                        </p>
                        {/* Mengganti Inertia Link dengan tag <a> standar untuk pratinjau. Gunakan path placeholder. */}
                        <a href="/vendor/dashboard"> 
                            <button className="px-8 py-3 font-semibold rounded-full text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center mx-auto">
                                Ke Dashboard Vendor <ArrowRight className="ml-2 w-5 h-5"/>
                            </button>
                        </a>
                    </div>
                );

            case 'rejected': // Menggunakan 'rejected' (lowercase)
                return (
                    // === Status REJECTED (FORMAL REJECTION) ===
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
                            Anda dapat menghubungi admin untuk klarifikasi lebih lanjut atau mencoba mendaftar kembali jika masalah telah diperbaiki.
                        </p>
                        {/* Mengarahkan ke register ulang, diganti dengan tag <a> standar */}
                        <a href="/vendor/register"> 
                            <button className="px-8 py-3 font-semibold rounded-full text-white bg-red-500 hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg">
                                Daftar Ulang
                            </button>
                        </a>
                    </div>
                );
            
            case 'pending': // Menggunakan 'pending' (lowercase)
            default:
                return (
                    // === Status PENDING (DEFAULT WAITING PAGE) ===
                    <div className="text-center p-10 bg-white shadow-xl rounded-xl max-w-lg mx-auto border-t-4 border-yellow-500">
                        <Clock className="w-16 h-16 mx-auto text-yellow-500 mb-4 animate-spin-slow" /> 
                        <h1 className="text-3xl font-bold text-gray-800 mb-3">Akun Dalam Proses Verifikasi</h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Terima kasih telah mendaftar. Tim admin kami sedang meninjau kelengkapan dan persyaratan data Anda.
                        </p>
                        <p className="text-sm text-gray-500">
                            Kami akan memberi tahu Anda melalui email setelah proses verifikasi selesai (biasanya 1-2 hari kerja). Silakan me-*refresh* halaman secara berkala untuk status terbaru.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            {/* Tag <Head> dari Inertia dihapus untuk kompatibilitas pratinjau */}
            
            {renderContent()}
        </div>
    );
}