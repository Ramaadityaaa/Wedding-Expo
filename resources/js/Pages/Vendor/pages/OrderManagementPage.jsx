import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import { useToast } from "@/Components/ui/use-toast";
import Pagination from "@/Components/ui/pagination";
import {
    Clock,
    ClipboardCheck,
    Zap,
    ShieldCheck,
    ListTodo,
    DollarSign,
    Package,
    XCircle,
    FileText,
    AlertCircle,
} from "lucide-react";

// --- Helper Format Rupiah ---
const formatCurrency = (number) => {
    const safeNumber = Number(number) || 0;
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(safeNumber);
};

// --- Helper Format Tanggal ---
// Support: "2026-01-18" (order_date) atau ISO datetime (created_at)
const formatDate = (dateString) => {
    if (!dateString) return "-";

    // Kalau formatnya hanya YYYY-MM-DD, paksa jadi date valid local
    // (new Date("YYYY-MM-DD") di beberapa browser bisa dianggap UTC dan geser)
    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    const dateObj = isDateOnly
        ? new Date(`${dateString}T00:00:00`)
        : new Date(dateString);

    if (Number.isNaN(dateObj.getTime())) return "-";

    // Kalau date only: tidak perlu jam, kalau datetime: tampilkan jam
    const options = isDateOnly
        ? { year: "numeric", month: "short", day: "numeric" }
        : {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          };

    return dateObj.toLocaleDateString("id-ID", options);
};

// --- [LOGIKA STATUS UTAMA] ---
const getEffectiveStatus = (order) => {
    if (order.status === "COMPLETED") return "COMPLETED";
    if (order.status === "CANCELLED") return "CANCELLED";
    if (order.status === "PROCESSED") return "PROCESSED";

    if (order.payment_status === "PAID") return "PAID";
    if (order.payment_status === "REJECTED") return "REJECTED";

    return "PENDING";
};

// --- Komponen Sub-Status Badge ---
const SubStatusBadge = ({ order }) => {
    const effectiveStatus = getEffectiveStatus(order);
    const hasProof = order.order_payment && order.order_payment.proof_file;

    if (effectiveStatus === "PENDING") {
        if (hasProof) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold animate-pulse">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Perlu Verifikasi
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200 text-xs font-medium">
                <Clock className="w-3.5 h-3.5" />
                Menunggu Upload Customer
            </span>
        );
    }

    if (effectiveStatus === "PROCESSED" || effectiveStatus === "PAID") {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                <Zap className="w-3.5 h-3.5" />
                Sedang Diproses
            </span>
        );
    }

    if (effectiveStatus === "COMPLETED") {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-bold">
                <ClipboardCheck className="w-3.5 h-3.5" />
                Selesai
            </span>
        );
    }

    if (effectiveStatus === "REJECTED" || effectiveStatus === "CANCELLED") {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                <XCircle className="w-3.5 h-3.5" />
                Dibatalkan
            </span>
        );
    }

    return <span className="text-xs text-gray-400">-</span>;
};

// --- Komponen Summary Card ---
const SummaryCard = ({ title, count, icon, color, active }) => (
    <div
        className={`p-5 rounded-xl shadow-sm border transition-all duration-300 cursor-pointer
        ${
            active
                ? `border-${color.split("-")[1]}-500 ring-1 ring-${
                      color.split("-")[1]
                  }-500 bg-white transform scale-[1.02]`
                : "border-gray-100 bg-white hover:shadow-md hover:border-gray-300"
        }`}
    >
        <div className="flex justify-between items-center">
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {title}
                </p>
                <h2 className={`text-2xl font-black mt-1 ${color}`}>
                    {count ?? 0}
                </h2>
            </div>
            <div
                className={`p-3 rounded-full ${color
                    .replace("text", "bg")
                    .replace("600", "50")
                    .replace("700", "50")}`}
            >
                {React.cloneElement(icon, { className: `w-6 h-6 ${color}` })}
            </div>
        </div>
    </div>
);

// --- MAIN PAGE COMPONENT ---
export default function OrderManagementPage({
    auth,
    orders = { data: [] },
    currentStatus,
    summaryData = { waiting: 0, processed: 0, completed: 0 },
}) {
    const { toast } = useToast();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const activeTab = currentStatus || "waiting";

    const statusTabs = [
        { label: "Menunggu Bayar", value: "waiting", icon: <Clock /> },
        { label: "Diproses", value: "processed", icon: <Zap /> },
        { label: "Riwayat Selesai", value: "completed", icon: <ListTodo /> },
    ];

    const handleTabChange = (status) => {
        router.get(
            route("vendor.orders.index", { status }),
            {},
            { preserveScroll: true, preserveState: true }
        );
    };

    const handleVerify = (orderId, action) => {
        if (
            !confirm(
                `Apakah Anda yakin ingin ${
                    action === "approve" ? "MENERIMA" : "MENOLAK"
                } pesanan ini?`
            )
        ) {
            return;
        }

        setIsProcessing(true);
        router.post(
            route("vendor.orders.verify", orderId),
            { action },
            {
                onSuccess: () => {
                    setIsProcessing(false);
                    setSelectedOrder(null);
                    toast({
                        title: "Berhasil",
                        description: "Status pesanan berhasil diperbarui.",
                        className: "bg-green-600 text-white",
                    });
                },
                onError: () => setIsProcessing(false),
            }
        );
    };

    const handleComplete = (orderId) => {
        if (!confirm("Apakah pesanan ini benar-benar sudah selesai?")) return;

        setIsProcessing(true);
        router.patch(
            route("vendor.orders.complete", orderId),
            {},
            {
                onSuccess: () => {
                    setIsProcessing(false);
                    toast({
                        title: "Selesai!",
                        description: "Pesanan dipindahkan ke riwayat selesai.",
                        className: "bg-blue-600 text-white",
                    });
                },
                onError: () => setIsProcessing(false),
            }
        );
    };

    const orderList = orders.data || [];
    const paginationLinks = orders.links || [];

    return (
        <VendorLayout user={auth.user}>
            <Head title="Manajemen Pesanan" />

            <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                                Order Masuk
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Pantau pembayaran dan status pengerjaan pesanan
                                Anda.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div onClick={() => handleTabChange("waiting")}>
                            <SummaryCard
                                title="Menunggu Bayar"
                                count={summaryData.waiting}
                                icon={<Clock />}
                                color="text-amber-600"
                                active={activeTab === "waiting"}
                            />
                        </div>
                        <div onClick={() => handleTabChange("processed")}>
                            <SummaryCard
                                title="Sedang Diproses"
                                count={summaryData.processed}
                                icon={<Zap />}
                                color="text-blue-600"
                                active={activeTab === "processed"}
                            />
                        </div>
                        <div onClick={() => handleTabChange("completed")}>
                            <SummaryCard
                                title="Riwayat Selesai"
                                count={summaryData.completed}
                                icon={<ClipboardCheck />}
                                color="text-green-600"
                                active={activeTab === "completed"}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50/50">
                            {statusTabs.map((tab) => (
                                <button
                                    key={tab.value}
                                    onClick={() => handleTabChange(tab.value)}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all duration-200 border-b-2 whitespace-nowrap
                                        ${
                                            activeTab === tab.value
                                                ? "border-amber-500 text-amber-700 bg-white"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    {React.cloneElement(tab.icon, {
                                        className: "w-4 h-4",
                                    })}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {orderList.length === 0 ? (
                            <div className="p-16 text-center flex flex-col items-center justify-center">
                                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                                    <ListTodo className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-800">
                                    Belum ada pesanan
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    Tidak ada data pesanan di tab status ini.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-bold text-xs tracking-wider">
                                        <tr>
                                            <th className="p-4 w-20">
                                                Order ID
                                            </th>
                                            <th className="p-4">
                                                Customer & Paket
                                            </th>
                                            <th className="p-4">
                                                Total & Tanggal Order
                                            </th>

                                            {/* ✅ KOLOM BARU */}
                                            <th className="p-4">
                                                Tanggal Dibuat
                                            </th>

                                            <th className="p-4">
                                                Status & Sub-Status
                                            </th>
                                            <th className="p-4 text-center">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {orderList.map((order) => {
                                            const displayPrice =
                                                order.amount ??
                                                order.total_price ??
                                                order.package?.price ??
                                                0;

                                            const effectiveStatus =
                                                getEffectiveStatus(order);

                                            const hasProof =
                                                order.order_payment &&
                                                order.order_payment.proof_file;

                                            // Tanggal order yang ditampilkan di kolom "Total & Tanggal Order"
                                            const orderDateDisplay =
                                                order.order_date ||
                                                order.created_at;

                                            return (
                                                <tr
                                                    key={order.id}
                                                    className="hover:bg-gray-50/80 transition-colors"
                                                >
                                                    <td className="p-4 font-mono font-bold text-gray-600">
                                                        #{order.id}
                                                    </td>

                                                    <td className="p-4">
                                                        <div className="font-bold text-gray-900">
                                                            {order.customer
                                                                ?.name ||
                                                                "Guest"}
                                                        </div>

                                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                                            <Package className="w-3 h-3 mr-1 text-blue-500" />
                                                            {order.package
                                                                ?.name ||
                                                                "Paket tidak ditemukan"}
                                                        </div>

                                                        <div className="text-xs text-gray-400 mt-0.5">
                                                            {order.customer
                                                                ?.email || "-"}
                                                        </div>
                                                    </td>

                                                    <td className="p-4">
                                                        <div className="font-bold text-amber-600 flex items-center">
                                                            <DollarSign className="w-3 h-3 mr-0.5" />
                                                            {formatCurrency(
                                                                displayPrice
                                                            )}
                                                        </div>

                                                        {/* ✅ TANGGAL ORDER */}
                                                        <div className="text-gray-400 text-xs mt-1">
                                                            {formatDate(
                                                                orderDateDisplay
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* ✅ KOLOM BARU: TANGGAL PESANAN DIBUAT */}
                                                    <td className="p-4">
                                                        <div className="text-gray-400 text-xs">
                                                            {formatDate(
                                                                order.created_at
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="p-4">
                                                        <SubStatusBadge
                                                            order={order}
                                                        />
                                                    </td>

                                                    <td className="p-4 text-center">
                                                        {activeTab ===
                                                            "waiting" &&
                                                            hasProof && (
                                                                <button
                                                                    onClick={() =>
                                                                        setSelectedOrder(
                                                                            order
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center justify-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all transform hover:scale-105 active:scale-95"
                                                                >
                                                                    <FileText className="w-3 h-3 mr-1.5" />
                                                                    Cek Bukti
                                                                </button>
                                                            )}

                                                        {activeTab ===
                                                            "waiting" &&
                                                            !hasProof && (
                                                                <span className="text-xs text-gray-400 italic bg-gray-50 px-2 py-1 rounded">
                                                                    Menunggu
                                                                    customer...
                                                                </span>
                                                            )}

                                                        {activeTab ===
                                                            "processed" && (
                                                            <button
                                                                onClick={() =>
                                                                    handleComplete(
                                                                        order.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    isProcessing
                                                                }
                                                                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all transform hover:scale-105"
                                                            >
                                                                <ClipboardCheck className="w-3 h-3 mr-1.5" />
                                                                Tandai Selesai
                                                            </button>
                                                        )}

                                                        {activeTab ===
                                                            "completed" && (
                                                            <span
                                                                className={`text-xs font-medium px-3 py-1 rounded-full border ${
                                                                    effectiveStatus ===
                                                                    "COMPLETED"
                                                                        ? "text-green-600 bg-green-50 border-green-100"
                                                                        : "text-red-600 bg-red-50 border-red-100"
                                                                }`}
                                                            >
                                                                {effectiveStatus ===
                                                                "COMPLETED"
                                                                    ? "Archived"
                                                                    : "Cancelled"}
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

                        {orderList.length > 0 && paginationLinks.length > 3 && (
                            <div className="p-4 border-t border-gray-100 bg-gray-50">
                                <Pagination links={paginationLinks} />
                            </div>
                        )}
                    </div>
                </div>

                {/* MODAL VERIFIKASI */}
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-amber-50 to-white">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">
                                        Verifikasi Pembayaran
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Order ID: {selectedOrder.id}
                                    </p>

                                    {/* ✅ TANGGAL ORDER DI POPUP */}
                                    <p className="text-xs text-gray-500 mt-1">
                                        Tanggal Order:{" "}
                                        <span className="font-semibold text-gray-700">
                                            {formatDate(
                                                selectedOrder.order_date ||
                                                    selectedOrder.created_at
                                            )}
                                        </span>
                                    </p>

                                    {/* ✅ TANGGAL DIBUAT DI POPUP (opsional, tapi biasanya bagus untuk audit) */}
                                    <p className="text-xs text-gray-500 mt-1">
                                        Dibuat:{" "}
                                        <span className="font-semibold text-gray-700">
                                            {formatDate(
                                                selectedOrder.created_at
                                            )}
                                        </span>
                                    </p>
                                </div>

                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-400 hover:text-gray-600 transition rounded-full p-1 hover:bg-gray-100"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6">
                                {(() => {
                                    const payment =
                                        selectedOrder.order_payment;
                                    const displayPrice =
                                        selectedOrder.amount ??
                                        selectedOrder.total_price ??
                                        0;

                                    if (!payment) {
                                        return (
                                            <div className="text-center py-8 text-red-500">
                                                Data pembayaran tidak valid.
                                            </div>
                                        );
                                    }

                                    return (
                                        <>
                                            <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                                                        Pengirim
                                                    </p>
                                                    <p className="font-semibold text-gray-800 text-sm mt-0.5">
                                                        {payment.account_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {payment.bank_source ||
                                                            "Bank Transfer"}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider"></p>

                                                    {/* ✅ PERBAIKAN: kalau displayPrice 0/kosong, teks nominal tidak ditampilkan */}
                                                    {Number(displayPrice) >
                                                        0 && (
                                                        <span className="text-amber-600 font-bold text-lg">
                                                            {formatCurrency(
                                                                displayPrice
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-2 tracking-wider">
                                                    Bukti Transfer
                                                </p>
                                                <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-100 flex justify-center items-center h-64 relative group">
                                                    {payment.proof_file ? (
                                                        <a
                                                            href={`/storage/${payment.proof_file}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="w-full h-full flex items-center justify-center"
                                                        >
                                                            <img
                                                                src={`/storage/${payment.proof_file}`}
                                                                alt="Bukti"
                                                                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                        </a>
                                                    ) : (
                                                        <div className="flex flex-col items-center text-gray-400">
                                                            <AlertCircle className="w-8 h-8 mb-2" />
                                                            <p className="text-sm italic">
                                                                File tidak
                                                                ditemukan
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 pt-2">
                                                <button
                                                    onClick={() =>
                                                        handleVerify(
                                                            selectedOrder.id,
                                                            "reject"
                                                        )
                                                    }
                                                    disabled={isProcessing}
                                                    className="py-3 px-4 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition flex justify-center items-center gap-2"
                                                >
                                                    <XCircle className="w-4 h-4" />
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
                                                    className="py-3 px-4 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-lg shadow-amber-200 transition flex justify-center items-center gap-2"
                                                >
                                                    {isProcessing ? (
                                                        "Menyimpan..."
                                                    ) : (
                                                        <>
                                                            <ShieldCheck className="w-4 h-4" />
                                                            Terima Pembayaran
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </VendorLayout>
    );
}
