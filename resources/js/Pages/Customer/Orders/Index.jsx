import React from "react";
import { Link, router, Head, usePage } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import {
    Zap,
    ClipboardCheck,
    Calendar,
    Store,
    ArrowRight,
    ArrowLeft,
    Package,
    ListTodo,
} from "lucide-react";

export default function OrdersPage({ orders, currentStatus, summaryData }) {
    const { auth } = usePage().props;

    const normalizeStatus = (status) => (status || "").toString().toUpperCase();
    const activeTab = currentStatus || "processed";

    const goBack = () => {
        if (window.history.length > 1) {
            window.history.back();
            return;
        }
        router.get(route("customer.dashboard"));
    };

    const handleTabChange = (status) => {
        router.get(
            route("customer.orders.index", { status }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    const processedCount = summaryData?.processed ?? 0;
    const completedCount = summaryData?.completed ?? 0;

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const d = new Date(dateString);
        if (Number.isNaN(d.getTime())) return "-";
        return d.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const StatusBadge = ({ status }) => {
        const s = normalizeStatus(status);

        if (s === "COMPLETED") {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-xs font-semibold">
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    Selesai
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5" />
                Diproses
            </span>
        );
    };

    return (
        <CustomerLayout user={auth?.user}>
            <Head title="Pesanan Saya" />

            <div className="max-w-7xl mx-auto py-10 px-5 sm:px-6 lg:px-8">
                {/* Header: Back icon di kiri sejajar judul */}
                <div className="flex items-start gap-4 mb-6">
                    <button
                        type="button"
                        onClick={goBack}
                        aria-label="Kembali"
                        className={[
                            "mt-1 inline-flex items-center justify-center",
                            "w-10 h-10 rounded-xl",
                            "border border-gray-200 bg-white",
                            "text-gray-700 hover:bg-gray-50",
                            "focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400",
                            "active:scale-[0.98] transition",
                        ].join(" ")}
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Pesanan Saya
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Pantau pesanan yang sedang berjalan dan riwayat yang sudah selesai.
                        </p>
                    </div>
                </div>

                {/* Tab + Counter (gaya dashboard) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-4 sm:px-6 pt-5">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <ListTodo className="w-4 h-4" />
                            <span>Ringkasan</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => handleTabChange("processed")}
                                className={[
                                    "w-full text-left p-4 rounded-xl border transition-all",
                                    activeTab === "processed"
                                        ? "border-amber-300 ring-1 ring-amber-200 bg-amber-50/30"
                                        : "border-gray-200 bg-white hover:bg-gray-50",
                                ].join(" ")}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-amber-50 border border-amber-100">
                                            <Zap className="w-5 h-5 text-amber-700" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">
                                                Diproses
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Pesanan aktif
                                            </div>
                                        </div>
                                    </div>

                                    <span
                                        className={[
                                            "text-xs px-2.5 py-1 rounded-full font-semibold",
                                            activeTab === "processed"
                                                ? "bg-amber-100 text-amber-700"
                                                : "bg-gray-100 text-gray-600",
                                        ].join(" ")}
                                    >
                                        {processedCount}
                                    </span>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleTabChange("completed")}
                                className={[
                                    "w-full text-left p-4 rounded-xl border transition-all",
                                    activeTab === "completed"
                                        ? "border-amber-300 ring-1 ring-amber-200 bg-amber-50/30"
                                        : "border-gray-200 bg-white hover:bg-gray-50",
                                ].join(" ")}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-green-50 border border-green-100">
                                            <ClipboardCheck className="w-5 h-5 text-green-700" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">
                                                Riwayat Selesai
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Pesanan selesai
                                            </div>
                                        </div>
                                    </div>

                                    <span
                                        className={[
                                            "text-xs px-2.5 py-1 rounded-full font-semibold",
                                            activeTab === "completed"
                                                ? "bg-amber-100 text-amber-700"
                                                : "bg-gray-100 text-gray-600",
                                        ].join(" ")}
                                    >
                                        {completedCount}
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mt-5 border-t border-gray-200" />

                    {/* Content */}
                    <div className="p-4 sm:p-6">
                        {!orders || orders.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                    <Package className="w-7 h-7 text-gray-400" />
                                </div>
                                <div className="mt-4 text-gray-900 font-semibold">
                                    {activeTab === "completed"
                                        ? "Belum ada riwayat pesanan selesai"
                                        : "Belum ada pesanan yang sedang diproses"}
                                </div>
                                <div className="mt-1 text-sm text-gray-500">
                                    Data akan muncul otomatis saat kamu melakukan pemesanan.
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {orders.map((order) => {
                                    const s = normalizeStatus(order.status);

                                    return (
                                        <div
                                            key={order.id}
                                            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden"
                                        >
                                            <div className="p-5">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="text-lg font-semibold text-gray-900 truncate">
                                                            {order.package?.name || "Paket"}
                                                        </div>

                                                        <div className="mt-2 space-y-1">
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Store className="w-4 h-4 text-amber-600" />
                                                                <span className="truncate">
                                                                    {order.vendor?.name || "-"}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Calendar className="w-4 h-4 text-amber-600" />
                                                                <span>
                                                                    {formatDate(order.order_date)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <StatusBadge status={s} />
                                                </div>

                                                <div className="mt-5 flex items-center justify-between">
                                                    <div className="text-xs text-gray-500">
                                                        Order ID: #{order.id}
                                                    </div>

                                                    <Link
                                                        href={`/customer/orders/${order.id}`}
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold shadow-sm transition"
                                                    >
                                                        Lihat Detail
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>

                                            <div
                                                className={[
                                                    "h-1.5 w-full",
                                                    s === "COMPLETED" ? "bg-green-200" : "bg-amber-200",
                                                ].join(" ")}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
