import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    ClipboardCheck,
    Zap,
    Store,
    Calendar,
    Package,
    StickyNote,
} from "lucide-react";

export default function OrderDetail({ order }) {
    const normalizeStatus = (status) => (status || "").toString().toUpperCase();
    const s = normalizeStatus(order?.status);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const d = new Date(dateString);
        if (Number.isNaN(d.getTime())) return "-";
        return d.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const StatusBadge = () => {
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
        <div className="min-h-screen bg-gray-50">
            <Head title="Detail Pesanan" />

            <div className="max-w-4xl mx-auto py-10 px-5 sm:px-6 lg:px-8">
                {/* Top bar */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <Link
                        href="/customer/orders"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>

                    <div className="text-xs text-gray-500">
                        Order ID: #{order?.id}
                    </div>
                </div>

                {/* Header */}
                <div className="mb-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                                Detail Pesanan
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Informasi paket, vendor, tanggal, dan status pesanan.
                            </p>
                        </div>

                        <StatusBadge />
                    </div>
                </div>

                {/* Main card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Package className="w-4 h-4" />
                            <span>Ringkasan Pesanan</span>
                        </div>

                        <div className="mt-4 space-y-4">
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                                <div className="text-sm text-gray-500">
                                    Nama Paket
                                </div>
                                <div className="text-lg font-semibold text-gray-900 mt-1">
                                    {order?.package?.name || "-"}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white border border-gray-200">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Store className="w-4 h-4 text-amber-600" />
                                        Vendor
                                    </div>
                                    <div className="text-gray-900 font-semibold mt-1">
                                        {order?.vendor?.name || "-"}
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-white border border-gray-200">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 text-amber-600" />
                                        Tanggal Pesanan
                                    </div>
                                    <div className="text-gray-900 font-semibold mt-1">
                                        {formatDate(order?.order_date)}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white border border-gray-200">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <StickyNote className="w-4 h-4 text-amber-600" />
                                    Catatan
                                </div>
                                <div className="text-sm text-gray-700 mt-2 leading-relaxed">
                                    {order?.notes || "Tidak ada catatan."}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* strip bawah */}
                    <div
                        className={`h-1.5 w-full ${
                            s === "COMPLETED" ? "bg-green-200" : "bg-amber-200"
                        }`}
                    />
                </div>
            </div>
        </div>
    );
}
