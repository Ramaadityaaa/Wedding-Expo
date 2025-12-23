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
    Download,
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
const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
};

// --- Komponen Badge Status ---
const StatusBadge = ({ status }) => {
    const safeStatus = status ? status.toUpperCase() : "UNKNOWN";
    const styles = {
        PENDING: {
            class: "bg-yellow-100 text-yellow-800 border-yellow-200",
            icon: <Clock className="w-3 h-3 mr-1" />,
            label: "Menunggu / Cek Bukti",
        },
        PAID: {
            class: "bg-green-100 text-green-800 border-green-200",
            icon: <ShieldCheck className="w-3 h-3 mr-1" />,
            label: "Lunas / Terverifikasi",
        },
        PROCESSED: {
            class: "bg-blue-200 text-blue-800 border-blue-300",
            icon: <Zap className="w-3 h-3 mr-1" />,
            label: "Diproses",
        },
        COMPLETED: {
            class: "bg-green-100 text-green-800 border-green-200",
            icon: <ClipboardCheck className="w-3 h-3 mr-1" />,
            label: "Selesai",
        },
        REJECTED: {
            class: "bg-red-100 text-red-800 border-red-200",
            icon: <XCircle className="w-3 h-3 mr-1" />,
            label: "Ditolak",
        },
        CANCELLED: {
            class: "bg-red-100 text-red-800 border-red-200",
            icon: <XCircle className="w-3 h-3 mr-1" />,
            label: "Batal",
        },
        UNKNOWN: {
            class: "bg-gray-100",
            icon: null,
            label: "Status: " + safeStatus,
        },
    };
    const info = styles[safeStatus] || styles.UNKNOWN;
    return (
        <span
            className={`flex items-center w-fit px-3 py-1 rounded-full text-xs font-bold border ${info.class}`}
        >
            {info.icon} {info.label}
        </span>
    );
};

// --- Komponen Summary Card ---
const SummaryCard = ({ title, count, icon, color }) => (
    <div
        className={`p-5 rounded-xl shadow-lg border border-gray-100 bg-white flex items-center justify-between transition-all duration-300 hover:shadow-xl`}
    >
        <div>
            <p className="text-sm font-semibold text-gray-500">{title}</p>
            <h2 className={`text-3xl font-bold mt-1 ${color}`}>{count ?? 0}</h2>
        </div>
        <div
            className={`p-3 rounded-full ${color
                .replace("text", "bg")
                .replace("-600", "-100")}`}
        >
            {React.cloneElement(icon, { className: `w-6 h-6 ${color}` })}
        </div>
    </div>
);

// --- MAIN COMPONENT ---
export default function OrderManagementPage({
    auth,
    orders = { data: [] },
    currentStatus,
    summaryData = { waiting: 0, processed: 0, completed: 0 },
}) {
    const { toast } = useToast();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const activeStatus = currentStatus || "waiting";

    const statusTabs = [
        { label: "Menunggu Bayar", value: "waiting", icon: <Clock /> },
        { label: "Diproses", value: "processed", icon: <Zap /> },
        { label: "Selesai", value: "completed", icon: <ClipboardCheck /> },
    ];

    const getCount = (statusValue) => {
        return summaryData[statusValue] ?? 0;
    };

    const handleTabChange = (status) => {
        router.get(
            route("vendor.orders.index", { status: status }),
            {},
            { preserveScroll: true, preserveState: false }
        );
    };

    // --- Aksi Verify (Approve/Reject) ---
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
            { action: action },
            {
                onSuccess: () => {
                    setIsProcessing(false);
                    setSelectedOrder(null);
                    toast({
                        title: "Berhasil",
                        description: `Pembayaran berhasil di-${
                            action === "approve" ? "terima" : "tolak"
                        }.`,
                        className: "bg-green-600 text-white",
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

            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">
                                📦 Manajemen Pesanan
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Kelola pesanan dan verifikasi pembayaran.
                            </p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <SummaryCard
                            title="Menunggu Konfirmasi"
                            count={summaryData.waiting}
                            icon={<Clock />}
                            color="text-amber-600"
                        />
                        <SummaryCard
                            title="Sedang Diproses"
                            count={summaryData.processed}
                            icon={<Zap />}
                            color="text-blue-600"
                        />
                        <SummaryCard
                            title="Selesai"
                            count={summaryData.completed}
                            icon={<ClipboardCheck />}
                            color="text-green-600"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex justify-between items-end border-b-2 border-gray-200 mb-6 bg-gray-50 pt-2 z-10">
                        <div className="flex space-x-2">
                            {statusTabs.map((tab) => (
                                <button
                                    key={tab.value}
                                    onClick={() => handleTabChange(tab.value)} // Perubahan tab akan men-trigger handleTabChange
                                    className={`px-5 py-3 text-base font-bold rounded-t-xl transition-all duration-200 
                                        ${activeStatus === tab.value
                                            ? "text-amber-700 border-b-4 border-amber-700 bg-white shadow-t"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-b-4 border-transparent"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        {orderList.length === 0 ? (
                            <div className="p-10 text-center text-gray-500">
                                <ListTodo className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                                <h3 className="font-semibold text-lg text-gray-700">
                                    Tidak Ada Pesanan
                                </h3>
                                <p>Tidak ada data pesanan untuk tab ini.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-100 border-b border-gray-200 text-gray-800 font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4 w-16">ID</th>
                                            <th className="p-4">Customer</th>
                                            <th className="p-4">Paket</th>
                                            <th className="p-4 w-40">
                                                Total & Tanggal
                                            </th>
                                            <th className="p-4 w-40">Status</th>
                                            <th className="p-4 text-center w-32">
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
                                            const statusUpper =
                                                order.payment_status
                                                    ? order.payment_status.toUpperCase()
                                                    : "PENDING";

                                            const hasProof =
                                                order.order_payment &&
                                                order.order_payment.proof_file;

                                            return (
                                                <tr
                                                    key={order.id}
                                                    className="hover:bg-amber-50 transition"
                                                >
                                                    <td className="p-4 font-mono font-bold text-gray-900">
                                                        #{order.id}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-bold text-gray-800">
                                                            {order.user?.name ||
                                                                "Guest"}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {order.user?.email}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 font-medium flex items-center">
                                                        <Package className="w-4 h-4 mr-2 text-blue-500" />
                                                        {order.package?.name ||
                                                            "Paket Dihapus"}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-bold text-amber-600 flex items-center">
                                                            <DollarSign className="w-4 h-4 mr-1" />
                                                            {formatCurrency(
                                                                displayPrice
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            {formatDate(
                                                                order.created_at
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <StatusBadge
                                                            status={statusUpper}
                                                        />
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {/* Tombol Aksi */}
                                                        {statusUpper ===
                                                            "PENDING" &&
                                                            hasProof && (
                                                                <button
                                                                    onClick={() =>
                                                                        setSelectedOrder(
                                                                            order
                                                                        )
                                                                    }
                                                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-md transition transform hover:scale-105 flex items-center justify-center mx-auto"
                                                                >
                                                                    <ShieldCheck className="w-3 h-3 mr-1" />{" "}
                                                                    Cek Bukti
                                                                </button>
                                                            )}

                                                        {statusUpper ===
                                                            "PENDING" &&
                                                            !hasProof && (
                                                                <span className="text-yellow-600 text-xs italic bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
                                                                    Menunggu
                                                                    Upload
                                                                </span>
                                                            )}

                                                        {statusUpper ===
                                                            "PAID" && (
                                                            <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded border border-green-200">
                                                                Lunas
                                                            </span>
                                                        )}

                                                        {statusUpper ===
                                                            "PROCESSED" && (
                                                            <span className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded border border-blue-200">
                                                                Diproses
                                                            </span>
                                                        )}

                                                        {(statusUpper ===
                                                            "COMPLETED" ||
                                                            statusUpper ===
                                                                "FINISHED") && (
                                                            <span className="text-gray-500 text-xs italic">
                                                                Selesai
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
                        {/* Pagination */}
                        {orderList.length > 0 && paginationLinks.length > 3 && (
                            <div className="p-4 border-t border-gray-100 bg-gray-50">
                                <Pagination links={paginationLinks} />
                            </div>
                        )}
                    </div>
                </div>

                {/* MODAL CEK BUKTI (POPUP) */}
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-amber-50">
                                <h3 className="font-bold text-lg text-gray-800">
                                    Verifikasi Pembayaran #{selectedOrder.id}
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
                            <div className="p-6">
                                {(() => {
                                    const payment = selectedOrder.order_payment;
                                    const displayPrice =
                                        selectedOrder.amount ??
                                        selectedOrder.total_price ??
                                        0;

                                    if (!payment)
                                        return (
                                            <p className="text-red-500 text-center">
                                                Data pembayaran tidak ditemukan.
                                            </p>
                                        );

                                    return (
                                        <>
                                            <div className="mb-4 bg-gray-50 p-3 rounded-lg border">
                                                <p className="font-semibold text-gray-800 text-sm">
                                                    Pengirim:{" "}
                                                    {payment.account_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Total:{" "}
                                                    <span className="text-amber-600 font-bold">
                                                        {formatCurrency(
                                                            displayPrice
                                                        )}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="mb-6 border-2 border-dashed border-gray-300 rounded-xl p-2 bg-gray-50 flex justify-center items-center min-h-[200px]">
                                                {payment.proof_file ? (
                                                    <a
                                                        href={`/storage/${payment.proof_file}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        <img
                                                            src={`/storage/${payment.proof_file}`}
                                                            alt="Bukti"
                                                            className="max-h-64 object-contain rounded-lg shadow-sm"
                                                        />
                                                    </a>
                                                ) : (
                                                    <p className="text-gray-400 italic">
                                                        File bukti tidak
                                                        ditemukan.
                                                    </p>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                                <button
                                                    onClick={() =>
                                                        handleVerify(
                                                            selectedOrder.id,
                                                            "reject"
                                                        )
                                                    }
                                                    disabled={isProcessing}
                                                    className="py-3 px-4 rounded-xl border-2 border-red-100 text-red-600 font-bold hover:bg-red-50"
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
                                                    className="py-3 px-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg"
                                                >
                                                    {isProcessing
                                                        ? "Memproses..."
                                                        : "Terima Pembayaran"}
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
