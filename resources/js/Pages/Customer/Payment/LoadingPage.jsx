import React, { useEffect } from "react";
import { Head, router, Link } from "@inertiajs/react";

// --- Konfigurasi Tema ---
const primaryColor = "#A3844C";
const secondaryColor = "#FFBB00";
const tertiaryColor = "#D4B98E";
const bgColor = "#FFFBF7";
const sandColor = "#F7E7C5";

// --- IKON ---

// 1. Ikon Pesawat (Pending)
const PaperAirplaneSketchIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-36 h-36 sm:w-48 sm:h-48 transform transition duration-300 drop-shadow-lg"
    >
        <defs>
            <linearGradient id="goldFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop
                    offset="0%"
                    style={{ stopColor: secondaryColor, stopOpacity: 1 }}
                />
                <stop
                    offset="50%"
                    style={{ stopColor: tertiaryColor, stopOpacity: 1 }}
                />
                <stop
                    offset="100%"
                    style={{ stopColor: primaryColor, stopOpacity: 1 }}
                />
            </linearGradient>
            <linearGradient id="grayShade" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop
                    offset="0%"
                    style={{ stopColor: "#D3D3D3", stopOpacity: 1 }}
                />
                <stop
                    offset="100%"
                    style={{ stopColor: "#A9A9A9", stopOpacity: 1 }}
                />
            </linearGradient>
        </defs>
        <g
            stroke="black"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
        >
            <polygon points="95,50 5,20 30,50 5,80" fill="url(#goldFill)" />
            <line x1="30" y1="50" y2="50" x2="95" />
            <polygon
                points="50,35 30,50 35,40"
                fill="url(#grayShade)"
                strokeWidth="0"
            />
            <line x1="50" y1="35" x2="35" y2="40" />
            <polygon
                points="50,65 30,50 35,60"
                fill="url(#grayShade)"
                strokeWidth="0"
            />
            <line x1="50" y1="65" x2="35" y2="60" />
            <line x1="45" y1="70" x2="35" y2="72" strokeWidth="2" />
            <line x1="45" y1="30" x2="35" y2="28" strokeWidth="2" />
        </g>
    </svg>
);

// 2. Ikon Sukses (Ceklis Hijau)
const SuccessIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-36 h-36 sm:w-48 sm:h-48 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

// 3. Ikon Gagal (Silang Merah)
const FailedIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-36 h-36 sm:w-48 sm:h-48 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

export default function LoadingPage({ status = "pending", orderId }) {
    // --- LOGIKA REAL-TIME POLLING ---
    useEffect(() => {
        // Hanya lakukan polling jika status masih PENDING
        if (status === "pending" || status === "PENDING") {
            const interval = setInterval(() => {
                // Reload halaman secara parsial (hanya prop 'status') setiap 3 detik
                router.reload({ only: ["status"] });
            }, 3000);

            // Bersihkan interval saat komponen di-unmount atau status berubah
            return () => clearInterval(interval);
        }
    }, [status]);

    // --- RENDER KONTEN BERDASARKAN STATUS ---
    const renderContent = () => {
        // KASUS 1: PEMBAYARAN BERHASIL
        if (status === "PAID" || status === "success") {
            return (
                <div className="animate-fade-in-up">
                    <div className="mb-10 flex justify-center">
                        <SuccessIcon />
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4 text-green-700">
                        Pembayaran Berhasil!
                    </h1>
                    <p className="text-2xl text-gray-600 mb-8">
                        Terima kasih! Pesanan Anda telah dikonfirmasi.
                    </p>
                    <Link
                        href={route("dashboard")} // Atau route ke detail order
                        className="inline-block px-8 py-4 bg-green-600 text-white font-bold rounded-xl text-xl shadow-lg hover:bg-green-700 transition transform hover:scale-105"
                    >
                        Lihat Pesanan Saya
                    </Link>
                </div>
            );
        }

        // KASUS 2: PEMBAYARAN GAGAL / DITOLAK
        if (["REJECTED", "CANCELLED", "EXPIRED", "failed"].includes(status)) {
            return (
                <div className="animate-fade-in-up">
                    <div className="mb-10 flex justify-center">
                        <FailedIcon />
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4 text-red-700">
                        Verifikasi Gagal
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Maaf, bukti pembayaran Anda ditolak atau kedaluwarsa.
                        <br />
                        Silakan coba unggah ulang.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={route("customer.payment.proof.page", {
                                order_id: orderId,
                                amount: 0,
                                account_name: "-",
                            })} // Parameter dummy untuk reload form
                            className="px-8 py-4 bg-amber-600 text-white font-bold rounded-xl text-lg shadow-lg hover:bg-amber-700 transition"
                        >
                            Unggah Ulang Bukti
                        </Link>
                        <Link
                            href={route("admin.contact")} // Opsional: Hubungi Admin
                            className="px-8 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl text-lg hover:bg-gray-300 transition"
                        >
                            Bantuan Admin
                        </Link>
                    </div>
                </div>
            );
        }

        // KASUS 3: DEFAULT (PENDING / LOADING) - Desain Pesawat Anda
        return (
            <div>
                <style>{`
                    @keyframes send-out-loop {
                        0% { transform: translateX(-150%) rotate(-5deg); opacity: 0; }
                        10% { transform: translateX(-50%) rotate(0deg); opacity: 1; }
                        35% { transform: translateX(0) translateY(-10px) rotate(3deg); opacity: 1; }
                        75% { transform: translateX(150%) translateY(0) rotate(5deg); opacity: 0.5; }
                        100% { transform: translateX(150%) translateY(0) rotate(5deg); opacity: 0; }
                    }
                    @keyframes pulse-shadow {
                        0% { box-shadow: 0 0 15px 5px rgba(255, 187, 0, 0.5); }
                        50% { box-shadow: 0 0 25px 10px rgba(255, 187, 0, 0.8); }
                        100% { box-shadow: 0 0 15px 5px rgba(255, 187, 0, 0.5); }
                    }
                    .sending-plane {
                        animation: send-out-loop 4s linear infinite;
                    }
                `}</style>

                <div className="mb-16 h-40 relative flex items-center justify-center">
                    <div className="absolute w-full h-full flex justify-center items-center">
                        <div
                            className="absolute sending-plane"
                            style={{ left: "50%" }}
                        >
                            <PaperAirplaneSketchIcon />
                        </div>
                    </div>
                </div>

                <h1
                    className="text-4xl sm:text-5xl font-extrabold mb-6"
                    style={{ color: primaryColor }}
                >
                    Verifikasi Sedang Berjalan
                </h1>

                <p className="text-2xl sm:text-3xl text-gray-700 leading-relaxed">
                    Pesawat data sedang mengirimkan bukti Anda ke Admin.
                    <br />
                    Harap menunggu maksimal:
                    <strong
                        className="block text-3xl sm:text-4xl mt-4 p-3 rounded-lg"
                        style={{
                            color: primaryColor,
                            backgroundColor: sandColor,
                            animation: "pulse-shadow 2s ease-in-out infinite",
                        }}
                    >
                        1 x 24 Jam Kerja
                    </strong>
                </p>

                <p className="text-sm text-gray-400 mt-8 italic">
                    Halaman ini akan otomatis diperbarui setelah verifikasi
                    selesai...
                </p>
            </div>
        );
    };

    return (
        <div
            className="font-sans min-h-screen flex justify-center items-center p-4 sm:p-12"
            style={{ backgroundColor: bgColor }}
        >
            <Head title="Status Pembayaran" />

            <div
                className="max-w-4xl w-full mx-auto p-12 md:p-24 text-center bg-white rounded-3xl shadow-2xl transition-all duration-500"
                style={{
                    borderTop: `16px solid ${
                        status === "PAID"
                            ? "#10B981"
                            : status === "REJECTED"
                            ? "#EF4444"
                            : secondaryColor
                    }`,
                    boxShadow: "0 20px 60px -15px rgba(0,0,0,0.3)",
                }}
            >
                {renderContent()}
            </div>
        </div>
    );
}
