import React, { useEffect, useState } from "react";
import { Head, router, Link } from "@inertiajs/react";
import { Loader2, CheckCircle, XCircle, RefreshCw, Info } from "lucide-react";

export default function LoadingPage({ status, invoiceId, planName, qrisUrl }) {
    const [dots, setDots] = useState("");

    // --- 1. LOGIKA REALTIME (POLLING) ---
    // Mengecek status terbaru ke server setiap 3 detik
    useEffect(() => {
        // Jika status sudah final (sukses/gagal), stop polling
        if (status === "success" || status === "failed") return;

        const interval = setInterval(() => {
            router.reload({
                only: ["status"], // Mengambil data 'status' terbaru dari Controller
                data: { invoice_id: invoiceId }, // Memastikan ID terkirim saat pengecekan
                preserveScroll: true,
                preserveState: true,
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [status, invoiceId]);

    // --- 2. LOGIKA ANIMASI TITIK-TITIK (...) ---
    useEffect(() => {
        if (status !== "pending" && status !== "qris") return;
        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + "." : ""));
        }, 500);
        return () => clearInterval(interval);
    }, [status]);

    // --- 3. LOGIKA AUTO-REDIRECT ---
    useEffect(() => {
        if (status === "success") {
            const timeout = setTimeout(() => {
                router.visit(route("vendor.dashboard"));
            }, 2500);
            return () => clearTimeout(timeout);
        }
    }, [status]);

    // --- RENDER KONTEN BERDASARKAN STATUS ---
    const renderContent = () => {
        switch (status) {
            case "success":
                return (
                    <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Pembayaran Berhasil!
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Selamat! Paket <strong>{planName}</strong> Anda
                            telah aktif.
                            <br />
                            Mengalihkan ke Dashboard dalam hitungan detik...
                        </p>
                        <Link
                            href={route("vendor.dashboard")}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition shadow-lg hover:shadow-green-200"
                        >
                            Ke Dashboard Sekarang
                        </Link>
                    </div>
                );

            case "failed":
                return (
                    <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
                            <XCircle className="h-12 w-12 text-red-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Pembayaran Ditolak
                        </h2>
                        <p className="text-gray-600 mb-8 text-center max-w-sm mx-auto">
                            Maaf, bukti pembayaran Anda tidak valid atau ditolak
                            oleh Admin. Silakan periksa kembali nominal atau kualitas gambar bukti Anda.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href={route("vendor.payment.proof.upload", {
                                    invoiceId: invoiceId,
                                    amount: 0, // Placeholder, akan divalidasi ulang di page upload
                                    account_name: "-"
                                })}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition w-full sm:w-auto justify-center shadow-md"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                Upload Ulang
                            </Link>
                            <Link
                                href={route("vendor.dashboard")}
                                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition w-full sm:w-auto justify-center"
                            >
                                Batalkan
                            </Link>
                        </div>
                    </div>
                );

            case "qris":
                return (
                    <div className="text-center animate-in fade-in duration-700">
                        <div className="bg-white p-4 inline-block rounded-2xl shadow-xl border border-gray-100 mb-6">
                            {qrisUrl ? (
                                <img
                                    src={qrisUrl}
                                    alt="QRIS Code"
                                    className="w-64 h-64 object-contain"
                                />
                            ) : (
                                <div className="w-64 h-64 bg-gray-100 flex flex-col items-center justify-center text-gray-400 rounded-xl border-2 border-dashed">
                                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                    <span className="text-xs px-4">Memuat kode QRIS...</span>
                                </div>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Scan QRIS di Atas
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Selesaikan pembayaran melalui e-wallet pilihan Anda.
                            <br />
                            Menunggu konfirmasi sistem{dots}
                        </p>
                        <div className="flex justify-center items-center gap-2 text-amber-600 bg-amber-50 py-2.5 px-5 rounded-full mx-auto w-fit border border-amber-100 shadow-sm">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="font-medium text-sm">
                                Mengecek status pembayaran otomatis...
                            </span>
                        </div>
                    </div>
                );

            default: // PENDING VERIFICATION
                return (
                    <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="relative mx-auto h-24 w-24 mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="h-8 w-8 text-amber-600 animate-pulse" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Sedang Diverifikasi
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                            Terima kasih! Bukti pembayaran Anda telah kami
                            terima.
                            <br />
                            Admin kami sedang memverifikasi transaksi Anda.
                            Mohon tunggu sebentar{dots}
                        </p>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 max-w-md mx-auto text-sm text-blue-800 flex gap-4 text-left shadow-sm">
                            <div className="shrink-0 mt-0.5 bg-blue-100 p-1.5 rounded-full h-fit">
                                <Info className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-bold mb-1">Informasi Penting:</p>
                                <p className="leading-relaxed opacity-90">
                                    Halaman ini akan otomatis diperbarui. Anda
                                    juga boleh meninggalkannya; status
                                    keanggotaan akan tetap aktif setelah diverifikasi oleh tim kami.
                                </p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <Link
                                href={route("vendor.dashboard")}
                                className="text-sm text-gray-400 hover:text-amber-600 transition-colors underline underline-offset-4"
                            >
                                Kembali ke Dashboard (Cek Nanti)
                            </Link>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <Head title={`Status Pembayaran - ${planName}`} />

            <div className="sm:mx-auto sm:w-full sm:max-w-2xl px-4">
                <div className="bg-white py-12 px-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] sm:rounded-3xl sm:px-12 border-t-[10px] border-amber-500 relative overflow-hidden transition-all duration-500">
                    
                    {/* Background Pattern Decoration */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-amber-50 opacity-50 blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-blue-50 opacity-50 blur-3xl pointer-events-none"></div>

                    {renderContent()}
                </div>

                <div className="mt-10 text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                        &copy; {new Date().getFullYear()} Wedding Expo Indonesia
                        <span className="mx-2">•</span> 
                        Secure Transaction System
                    </p>
                </div>
            </div>
        </div>
    );
}