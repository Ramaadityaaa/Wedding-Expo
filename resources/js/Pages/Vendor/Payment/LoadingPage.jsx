import React, { useEffect, useState } from "react";
import { Head, router, Link } from "@inertiajs/react";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";

export default function LoadingPage({ status, invoiceId, planName, qrisUrl }) {
    const [dots, setDots] = useState("");

    // --- 1. LOGIKA REALTIME (POLLING) ---
    // Mengecek status terbaru ke server setiap 3 detik tanpa refresh halaman
    useEffect(() => {
        // Jika status sudah final (sukses/gagal), stop polling
        if (status === "success" || status === "failed") return;

        const interval = setInterval(() => {
            router.reload({
                only: ["status"], // Hanya refresh data 'status' agar ringan
                preserveScroll: true,
                preserveState: true,
            });
        }, 3000); // 3000ms = 3 detik

        return () => clearInterval(interval);
    }, [status]);

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
            // Beri jeda 2.5 detik agar user melihat centang hijau, lalu redirect
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
                    <div className="text-center animate-fade-in-up">
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
                            Mengalihkan ke Dashboard...
                        </p>
                        <Link
                            href={route("vendor.dashboard")}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition"
                        >
                            Ke Dashboard Sekarang
                        </Link>
                    </div>
                );

            case "failed":
                return (
                    <div className="text-center animate-fade-in-up">
                        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
                            <XCircle className="h-12 w-12 text-red-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Pembayaran Ditolak
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Maaf, bukti pembayaran Anda tidak valid atau ditolak
                            oleh Admin.
                            <br />
                            Silakan periksa kembali atau unggah ulang.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                href={route("vendor.payment.proof.upload", {
                                    invoiceId: invoiceId,
                                })}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                Upload Ulang
                            </Link>
                            <Link
                                href={route("vendor.dashboard")}
                                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
                            >
                                Batalkan
                            </Link>
                        </div>
                    </div>
                );

            case "qris":
                return (
                    <div className="text-center animate-fade-in-up">
                        <div className="bg-white p-4 inline-block rounded-xl shadow-lg border mb-6">
                            {qrisUrl ? (
                                <img
                                    src={qrisUrl}
                                    alt="QRIS Code"
                                    className="w-64 h-64 object-contain"
                                />
                            ) : (
                                <div className="w-64 h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                                    QRIS Image Placeholder
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
                        <div className="flex justify-center items-center gap-2 text-amber-600 bg-amber-50 py-2 px-4 rounded-full mx-auto w-fit">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="font-medium text-sm">
                                Mengecek status pembayaran otomatis...
                            </span>
                        </div>
                    </div>
                );

            default: // PENDING
                return (
                    <div className="text-center animate-fade-in-up">
                        <div className="relative mx-auto h-24 w-24 mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
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

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto text-sm text-blue-800 flex gap-3 text-left">
                            <div className="shrink-0 mt-0.5">ℹ️</div>
                            <div>
                                <p className="font-semibold">Tips:</p>
                                <p>
                                    Halaman ini akan otomatis diperbarui. Anda
                                    juga boleh meninggalkannya; status
                                    keanggotaan akan aktif setelah diverifikasi.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Link
                                href={route("vendor.dashboard")}
                                className="text-sm text-gray-400 hover:text-gray-600 underline"
                            >
                                Kembali ke Dashboard (Cek Nanti)
                            </Link>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <Head title="Memproses Pembayaran" />

            <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                <div className="bg-white py-12 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border-t-8 border-amber-500 relative overflow-hidden">
                    {/* Background Pattern Decoration */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-amber-50 opacity-50 blur-2xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-blue-50 opacity-50 blur-2xl pointer-events-none"></div>

                    {renderContent()}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} Wedding Expo
                        Indonesia. Secure Payment.
                    </p>
                </div>
            </div>
        </div>
    );
}
