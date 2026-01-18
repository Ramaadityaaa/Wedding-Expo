import React from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import {
    DollarSign,
    ShoppingBag,
    Star,
    UserCheck,
    ArrowRight,
    CheckCircle,
    Eye,
    Calendar,
} from "lucide-react";

// ======================================================================
// Helper Functions
// ======================================================================

const formatRupiah = (number) => {
    const num = Number(number || 0);
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(num);
};

// ======================================================================
// SummaryCard Component (Clean + Icon Glass Badge)
// ======================================================================

const SummaryCard = ({
    title,
    value,
    icon: Icon,
    colorClass,
    secondaryValue,
    secondaryText,
    secondaryLink,
    subTitle,
    className = "",
}) => {
    return (
        <div
            className={[
                "rounded-2xl p-6 h-full",
                "transition-transform transform hover:scale-[1.01] duration-300",
                "shadow-sm",
                colorClass,
                className,
            ].join(" ")}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h4 className="text-sm font-semibold uppercase text-white/85 tracking-wider">
                        {title}
                    </h4>

                    {/* Value dibuat sedikit lebih “aman” agar tidak kepotong */}
                    <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white leading-snug break-words">
                        {value}
                    </p>

                    {subTitle && (
                        <p className="mt-1 text-sm font-medium text-white/80">
                            {subTitle}
                        </p>
                    )}
                </div>

                <div
                    className={[
                        "shrink-0",
                        "h-11 w-11 rounded-xl",
                        "grid place-items-center",
                        "bg-white/20 backdrop-blur",
                        "ring-1 ring-white/25",
                        "shadow-sm",
                    ].join(" ")}
                >
                    {Icon && <Icon size={20} className="text-white" />}
                </div>
            </div>

            <div className="mt-5 h-px w-full bg-white/25" />

            <div className="mt-4">
                {secondaryValue && (
                    <p className="text-sm font-semibold text-white/90">
                        {secondaryValue}
                    </p>
                )}

                {secondaryLink && (
                    <Link
                        href={secondaryLink}
                        className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white"
                    >
                        {secondaryText}
                        <ArrowRight size={16} />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default function VendorDashboard({ vendor, stats }) {
    const { auth } = usePage().props;

    const {
        total_revenue = 0,
        total_orders = 0,
        total_reviews = 0,
        average_rating = 0.0,
        recent_orders = [],
        recent_reviews = [],
    } = stats || {};

    const today = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <VendorLayout
            user={auth.user}
            vendor={vendor}
            header={
                <div className="text-gray-800">
                    <div className="text-3xl font-bold">Dashboard Ringkasan</div>
                </div>
            }
        >
            <Head title="Vendor Dashboard" />

            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* Header Welcome */}
                <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="min-w-0">
                            <h2 className="text-3xl font-extrabold text-gray-800">
                                Selamat Datang,{" "}
                                <b className="text-amber-600">{vendor?.name}</b>!
                            </h2>
                            <p className="text-base text-gray-600 mt-1">
                                Berikut adalah ringkasan aktivitas bisnis Anda di Wedding Expo hari ini.
                            </p>
                        </div>

                        <span className="shrink-0 text-sm font-medium text-gray-500 bg-amber-50 rounded-full px-4 py-1.5 shadow-sm w-fit">
                            {today}
                        </span>
                    </div>
                </div>

                {/* =========================================================
                    STAT CARDS
                    Target: 2 atas + 2 bawah pada layar besar
                    Bonus: Total Pendapatan dibuat lebih dominan (span 2 kolom)
                ========================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Card 1: Status Verifikasi */}
                    <SummaryCard
                        title="Status Verifikasi"
                        value={vendor?.isApproved}
                        icon={UserCheck}
                        colorClass="bg-gradient-to-br from-amber-500 to-orange-600"
                        secondaryValue={
                            vendor?.isApproved === "APPROVED"
                                ? "Vendor Terverifikasi"
                                : "Proses Sekarang"
                        }
                        secondaryText={
                            vendor?.isApproved === "APPROVED"
                                ? "Lihat Profil"
                                : "Lengkapi Dokumen"
                        }
                        secondaryLink="/vendor/profile"
                        subTitle={`Rating Anda: ${average_rating}/5.0`}
                        // agar rapi di grid
                        className="lg:col-span-2"
                    />

                    {/* Card 2: Total Pendapatan (Dominan) */}
                    <SummaryCard
                        title="Total Pendapatan"
                        value={formatRupiah(total_revenue)}
                        icon={DollarSign}
                        colorClass="bg-gradient-to-br from-green-500 to-teal-600"
                        secondaryText="Lihat Transaksi"
                        secondaryLink="/vendor/payments"
                        subTitle={`Total ${total_orders} Pesanan`}
                        // dibuat span 2 kolom agar nilai Rupiah luas dan jelas
                        className="lg:col-span-2"
                    />

                    {/* Card 3: Total Review */}
                    <SummaryCard
                        title="Total Review"
                        value={`${total_reviews} Ulasan`}
                        icon={Star}
                        colorClass="bg-gradient-to-br from-indigo-500 to-purple-600"
                        secondaryText="Lihat Semua Ulasan"
                        secondaryLink="/vendor/reviews"
                        subTitle={`Rata-rata: ${average_rating} / 5.0`}
                        className="lg:col-span-2"
                    />

                    {/* Card 4: Total Pesanan */}
                    <SummaryCard
                        title="Total Pesanan"
                        value={`${total_orders}`}
                        icon={ShoppingBag}
                        colorClass="bg-gradient-to-br from-pink-500 to-red-600"
                        secondaryText="Kelola Pesanan"
                        secondaryLink="/vendor/orders"
                        subTitle="Semua Status Pesanan"
                        className="lg:col-span-2"
                    />
                </div>

                {/* =========================================================
                    BOTTOM PANELS: Recent Orders & Recent Reviews
                ========================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-bold text-gray-800 flex items-center">
                                <ShoppingBag size={20} className="mr-2 text-indigo-500" /> Pesanan Terbaru
                            </h4>
                            <Link
                                href={"/vendor/orders"}
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                                Lihat Semua
                            </Link>
                        </div>

                        {recent_orders && recent_orders.length > 0 ? (
                            <div className="space-y-3">
                                {recent_orders.slice(0, 3).map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-800 truncate">
                                                {order.customer_name}
                                            </p>

                                            {order.created_date_human && (
                                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {order.created_date_human}
                                                </p>
                                            )}
                                        </div>

                                        <span
                                            className={[
                                                "text-xs font-medium px-2 py-1 rounded-full",
                                                String(order.status).toUpperCase() === "PENDING"
                                                    ? "bg-amber-100 text-amber-600"
                                                    : "bg-green-100 text-green-600",
                                            ].join(" ")}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <CheckCircle size={36} className="mx-auto text-green-500/70 mb-3" />
                                <p className="text-gray-500">Tidak ada pesanan terbaru saat ini.</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Reviews */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-bold text-gray-800 flex items-center">
                                <Star size={20} className="mr-2 text-yellow-500" /> Review Terbaru
                            </h4>
                            <Link
                                href={"/vendor/reviews"}
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                                Lihat Semua
                            </Link>
                        </div>

                        {recent_reviews && recent_reviews.length > 0 ? (
                            <div className="space-y-3">
                                {recent_reviews.slice(0, 3).map((review) => (
                                    <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center mb-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    fill={i < review.rating ? "currentColor" : "none"}
                                                    className={`mr-1 ${
                                                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                                                    }`}
                                                />
                                            ))}
                                            <p className="text-xs font-semibold text-gray-700 ml-2">
                                                {review.customer_name}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <Eye size={36} className="mx-auto text-blue-500/70 mb-3" />
                                <p className="text-gray-500">Semua ulasan sudah terkendali.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </VendorLayout>
    );
}
