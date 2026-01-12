import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    Users,
    Store,
    MessageSquare,
    CreditCard,
    Clock,
    CheckCircle,
    ArrowRight,
    TrendingUp,
    AlertCircle,
} from "lucide-react";

// Komponen Kartu Statistik
const StatCard = ({
    title,
    count,
    icon: Icon,
    colorClass,
    link,
    linkText,
    subText,
}) => (
    <div
        className={`relative overflow-hidden rounded-2xl shadow-xl border border-white/20 ${colorClass} text-white transition-transform duration-300 hover:-translate-y-1 group`}
    >
        {/* Dekorasi Background */}
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
        <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

        <div className="p-6 relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">
                        {title}
                    </p>
                    <h3 className="text-3xl font-extrabold">{count}</h3>
                    {subText && (
                        <p className="text-xs text-white/70 mt-1 font-medium">
                            {subText}
                        </p>
                    )}
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-inner">
                    <Icon size={24} className="text-white" />
                </div>
            </div>

            {link && (
                <div className="mt-4 pt-3 border-t border-white/20">
                    <Link
                        href={link}
                        className="flex items-center text-xs font-bold uppercase tracking-wide hover:text-white/80 transition-colors"
                    >
                        {linkText} <ArrowRight size={14} className="ml-2" />
                    </Link>
                </div>
            )}
        </div>
    </div>
);

export default function Dashboard({
    stats,
    pendingVendors = [],
    pendingReviews = [],
}) {
    const { auth } = usePage().props;

    // Helper Format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(number);
    };

    return (
        <AdminLayout user={auth.user} header="Dashboard Ringkasan">
            <Head title="Admin Dashboard" />

            <div className="p-4 sm:p-6 max-w-7xl mx-auto font-sans">
                {/* Welcome Banner */}
                <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg border border-orange-100 flex flex-col md:flex-row items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Selamat Datang,{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                                {auth.user.name}
                            </span>
                            ! 
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Berikut adalah ringkasan aktivitas platform Wedding
                            Expo hari ini.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium border border-orange-100 shadow-sm">
                        {new Date().toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>

                {/* Grid Statistik Utama */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Kartu Vendor Pending */}
                    <StatCard
                        title="Verifikasi Vendor"
                        count={stats.pendingVendors}
                        icon={Store}
                        colorClass="bg-gradient-to-br from-amber-400 to-orange-500"
                        link={route("admin.vendors.index")}
                        linkText="Proses Sekarang"
                        subText={`${stats.approvedVendors} Vendor Aktif`}
                    />

                    {/* Kartu Revenue */}
                    <StatCard
                        title="Total Pendapatan"
                        count={formatRupiah(stats.totalRevenue || 0)}
                        icon={CreditCard}
                        colorClass="bg-gradient-to-br from-emerald-400 to-teal-600"
                        link={route("admin.paymentproof.index")}
                        linkText="Lihat Transaksi"
                        subText={`+${stats.monthlyGrowth}% bulan ini`}
                    />

                    {/* Kartu Ulasan Pending */}
                    <StatCard
                        title="Moderasi Ulasan"
                        count={stats.pendingReviews}
                        icon={MessageSquare}
                        colorClass="bg-gradient-to-br from-blue-400 to-indigo-500"
                        link={route("admin.reviews.index")}
                        linkText="Moderasi Ulasan"
                        subText={`${stats.totalReviews} Total Ulasan`}
                    />

                    {/* Kartu Total User */}
                    <StatCard
                        title="Total Pengguna"
                        count={stats.totalUsers}
                        icon={Users}
                        colorClass="bg-gradient-to-br from-pink-400 to-rose-500"
                        link={route("admin.user-stats.index")}
                        linkText="Kelola Pengguna"
                        subText="Customer Terdaftar"
                    />
                </div>

                {/* Section Detail: Split View */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Daftar Vendor Pending Terbaru */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                <Clock
                                    className="mr-2 text-amber-500"
                                    size={20}
                                />
                                Vendor Menunggu Verifikasi
                            </h3>
                            <Link
                                href={route("admin.vendors.index")}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="p-0 flex-1">
                            {pendingVendors.length > 0 ? (
                                <ul className="divide-y divide-gray-100">
                                    {pendingVendors.map((vendor) => (
                                        <li
                                            key={vendor.id}
                                            className="p-4 hover:bg-gray-50 transition flex items-center justify-between"
                                        >
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold mr-3">
                                                    {vendor.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {vendor.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {vendor.city ||
                                                            "Kota tidak diketahui"}{" "}
                                                        • {vendor.type}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                href={route(
                                                    "admin.vendors.index"
                                                )}
                                                className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold hover:bg-amber-200 transition"
                                            >
                                                Review
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-8 text-center text-gray-400 italic">
                                    <CheckCircle
                                        className="mx-auto mb-2 text-green-300"
                                        size={32}
                                    />
                                    Tidak ada vendor pending saat ini.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Daftar Ulasan Pending Terbaru */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                <AlertCircle
                                    className="mr-2 text-blue-500"
                                    size={20}
                                />
                                Ulasan Perlu Moderasi
                            </h3>
                            <Link
                                href={route("admin.reviews.index")}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="p-0 flex-1">
                            {pendingReviews.length > 0 ? (
                                <ul className="divide-y divide-gray-100">
                                    {pendingReviews.map((review) => (
                                        <li
                                            key={review.id}
                                            className="p-4 hover:bg-gray-50 transition"
                                        >
                                            <div className="flex justify-between mb-1">
                                                <p className="text-xs font-bold text-gray-700">
                                                    {review.user?.name ||
                                                        "Anonim"}
                                                </p>
                                                <span className="text-xs text-gray-400">
                                                    untuk{" "}
                                                    {
                                                        review.wedding_organizer
                                                            ?.name
                                                    }
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 italic mb-2">
                                                "
                                                {review.comment.substring(
                                                    0,
                                                    60
                                                )}
                                                {review.comment.length > 60
                                                    ? "..."
                                                    : ""}
                                                "
                                            </p>
                                            <div className="flex justify-end">
                                                <Link
                                                    href={route(
                                                        "admin.reviews.index"
                                                    )}
                                                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center"
                                                >
                                                    Moderasi{" "}
                                                    <ArrowRight
                                                        size={12}
                                                        className="ml-1"
                                                    />
                                                </Link>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-8 text-center text-gray-400 italic">
                                    <CheckCircle
                                        className="mx-auto mb-2 text-green-300"
                                        size={32}
                                    />
                                    Semua ulasan aman terkendali.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
