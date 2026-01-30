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
} from "lucide-react"; // Import Hash dihapus karena tidak dipakai lagi
import Navbar from "../../../../../Resources/js/Components/Navbar"; 
import Footer from "../../../../../Resources/js/Components/Footer"; 

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
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold tracking-wide uppercase shadow-sm">
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    Selesai
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold tracking-wide uppercase shadow-sm">
                <Zap className="w-3.5 h-3.5" />
                Diproses
            </span>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/80 font-sans">
            <Head title={`Detail Pesanan #${order?.id || ""}`} />

            <Navbar />

            {/* Padding top disesuaikan agar tidak tertutup navbar */}
            <main className="flex-grow pt-28 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* Tombol Kembali */}
                            <Link
                                href="/customer/orders"
                                className="group flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                title="Kembali ke Daftar Pesanan"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                            </Link>

                            {/* Judul & Order ID (Tanpa icon Hash) */}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                    Detail Pesanan
                                </h1>
                                <div className="text-sm text-gray-500 mt-0.5">
                                    Order ID: <span className="font-medium text-gray-700">{order?.id}</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="ml-14 sm:ml-0">
                            <StatusBadge />
                        </div>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                        
                        {/* Hero Section: Nama Paket */}
                        <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-amber-100 rounded-xl text-amber-600 shrink-0">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                                        Paket yang dipilih
                                    </h2>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                                        {order?.package?.name || "Paket Tidak Diketahui"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Grid Informasi Detail */}
                        <div className="p-6 sm:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                
                                {/* Vendor Info */}
                                <div className="flex gap-4">
                                    <div className="shrink-0 mt-1">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Store className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Vendor Penyedia</p>
                                        <p className="text-base font-semibold text-gray-900">
                                            {order?.vendor?.name || "-"}
                                        </p>
                                    </div>
                                </div>

                                {/* Tanggal Pesanan */}
                                <div className="flex gap-4">
                                    <div className="shrink-0 mt-1">
                                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Tanggal Pesanan</p>
                                        <p className="text-base font-semibold text-gray-900">
                                            {formatDate(order?.order_date)}
                                        </p>
                                    </div>
                                </div>

                                {/* Catatan */}
                                <div className="md:col-span-2 flex gap-4 pt-4 border-t border-gray-100 mt-2">
                                    <div className="shrink-0 mt-1">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                                            <StickyNote className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Catatan Tambahan</p>
                                        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed border border-gray-100">
                                            {order?.notes ? (
                                                order.notes
                                            ) : (
                                                <span className="text-gray-400 italic">Tidak ada catatan khusus.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Decorative Bottom Strip */}
                        <div className={`h-1.5 w-full ${s === "COMPLETED" ? "bg-emerald-400" : "bg-amber-400"}`} />
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}