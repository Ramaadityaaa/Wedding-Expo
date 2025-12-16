import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import { useToast } from "@/Components/ui/use-toast";

// Helper Format Rupiah
const formatCurrency = (number) => {
    // Pastikan number diubah jadi tipe Number dulu, kalau null/undefined jadi 0
    const safeNumber = Number(number) || 0;
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(safeNumber);
};

// Helper Format Tanggal
const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
};

// Komponen Badge Status
const StatusBadge = ({ status }) => {
    // Normalisasi ke huruf besar biar aman
    const safeStatus = status ? status.toUpperCase() : "UNKNOWN";

    const styles = {
        PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
        PAID: "bg-green-100 text-green-800 border-green-200",
        CONFIRMED: "bg-green-100 text-green-800 border-green-200",
        REJECTED: "bg-red-100 text-red-800 border-red-200",
        CANCELLED: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
                styles[safeStatus] || "bg-gray-100"
            }`}
        >
            {safeStatus}
        </span>
    );
};

export default function OrderManagementPage({ auth, orders }) {
    const { toast } = useToast();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Fungsi Verifikasi (Terima/Tolak)
    const handleVerify = (orderId, action) => {
        if (
            !confirm(
                `Apakah Anda yakin ingin ${
                    action === "approve" ? "MENERIMA" : "MENOLAK"
                } pembayaran ini?`
            )
        )
            return;

        setIsProcessing(true);
        router.post(
            route("vendor.orders.verify", orderId),
            {
                action: action,
            },
            {
                onSuccess: () => {
                    setIsProcessing(false);
                    setSelectedOrder(null);
                    toast({
                        title: "Berhasil",
                        description: `Pesanan berhasil di-${
                            action === "approve" ? "konfirmasi" : "tolak"
                        }.`,
                        className: "bg-green-600 text-white",
                    });
                },
                onError: () => setIsProcessing(false),
            }
        );
    };

    return (
        <VendorLayout user={auth.user}>
            <Head title="Manajemen Pesanan" />

            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Daftar Pesanan Masuk
                            </h1>
                            <p className="text-gray-500">
                                Kelola pesanan dan verifikasi pembayaran dari
                                customer.
                            </p>
                        </div>
                    </div>

                    {/* Tabel Pesanan */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {orders.length === 0 ? (
                            <div className="p-10 text-center text-gray-500">
                                Belum ada pesanan masuk.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-800 font-semibold">
                                        <tr>
                                            <th className="p-4">ID Order</th>
                                            <th className="p-4">Customer</th>
                                            <th className="p-4">Paket</th>
                                            <th className="p-4">
                                                Total & Tanggal
                                            </th>
                                            <th className="p-4">
                                                Status Bayar
                                            </th>
                                            <th className="p-4 text-center">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.map((order) => {
                                            // FIX: Prioritaskan kolom 'price', lalu 'amount', lalu 'total_price'
                                            // Jika masih null, ambil dari relasi package.price
                                            const displayPrice =
                                                order.price ??
                                                order.amount ??
                                                order.total_price ??
                                                order.package?.price ??
                                                0;

                                            // FIX: Pastikan status selalu huruf besar untuk perbandingan
                                            const statusUpper =
                                                order.payment_status
                                                    ? order.payment_status.toUpperCase()
                                                    : "";

                                            return (
                                                <tr
                                                    key={order.id}
                                                    className="hover:bg-gray-50 transition"
                                                >
                                                    <td className="p-4 font-mono font-bold">
                                                        #{order.id}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-bold text-gray-800">
                                                            {order.user?.name ||
                                                                "Guest"}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {order.user
                                                                ?.email || "-"}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 font-medium">
                                                        {order.package?.name ||
                                                            "Paket Dihapus"}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-bold text-amber-600">
                                                            {formatCurrency(
                                                                displayPrice
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {formatDate(
                                                                order.created_at
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <StatusBadge
                                                            status={
                                                                order.payment_status
                                                            }
                                                        />
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {/* Logika Tombol: Hanya muncul jika status PENDING */}
                                                        {statusUpper ===
                                                        "PENDING" ? (
                                                            <button
                                                                onClick={() =>
                                                                    setSelectedOrder(
                                                                        order
                                                                    )
                                                                }
                                                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-md transition transform hover:scale-105"
                                                            >
                                                                Cek Bukti
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-400 text-xs italic border border-gray-200 px-2 py-1 rounded">
                                                                {statusUpper ===
                                                                "PAID"
                                                                    ? "Lunas"
                                                                    : "Selesai"}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* MODAL CEK BUKTI PEMBAYARAN */}
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
                            {/* Header Modal */}
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-amber-50">
                                <h3 className="font-bold text-lg text-gray-800">
                                    Verifikasi Order #{selectedOrder.id}
                                </h3>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-400 hover:text-gray-600 transition"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Body Modal */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Info Pengirim
                                    </label>
                                    <div className="flex justify-between items-center mt-1 bg-gray-50 p-3 rounded-lg border">
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">
                                                {selectedOrder.order_payment
                                                    ?.account_name ||
                                                    "Nama Tidak Terdeteksi"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Bank Pengirim:{" "}
                                                {selectedOrder.order_payment
                                                    ?.bank_source || "-"}
                                            </p>
                                        </div>
                                        <span className="text-amber-600 font-bold">
                                            {formatCurrency(
                                                selectedOrder.price ??
                                                    selectedOrder.amount ??
                                                    selectedOrder.total_price ??
                                                    0
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                        Bukti Transfer
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-2 bg-gray-50 flex justify-center items-center min-h-[200px]">
                                        {selectedOrder.order_payment
                                            ?.proof_file ? (
                                            <a
                                                href={`/storage/${selectedOrder.order_payment.proof_file}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <img
                                                    src={`/storage/${selectedOrder.order_payment.proof_file}`}
                                                    alt="Bukti Transfer"
                                                    className="max-h-64 object-contain rounded-lg shadow-sm hover:scale-105 transition duration-300 cursor-zoom-in"
                                                />
                                            </a>
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-gray-400 italic">
                                                    File bukti tidak ditemukan.
                                                </p>
                                                <p className="text-xs text-red-400 mt-1">
                                                    (Mungkin customer belum
                                                    upload)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-center text-xs text-gray-400 mt-2">
                                        Klik gambar untuk memperbesar
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <button
                                        onClick={() =>
                                            handleVerify(
                                                selectedOrder.id,
                                                "reject"
                                            )
                                        }
                                        disabled={isProcessing}
                                        className="py-3 px-4 rounded-xl border-2 border-red-100 text-red-600 font-bold hover:bg-red-50 hover:border-red-200 transition disabled:opacity-50"
                                    >
                                        Tolak
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleVerify(
                                                selectedOrder.id,
                                                "approve"
                                            )
                                        }
                                        disabled={isProcessing}
                                        className="py-3 px-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition disabled:opacity-50"
                                    >
                                        {isProcessing
                                            ? "Memproses..."
                                            : "Terima Pembayaran"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </VendorLayout>
    );
}
