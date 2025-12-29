import React from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
// Import icon yang dibutuhkan
import { DollarSign, ShoppingBag, Star, UserCheck, ArrowRight, CheckCircle, Eye } from 'lucide-react';

// ======================================================================
// Helper Functions
// ======================================================================

// Helper untuk format mata uang Rupiah
const formatRupiah = (number) => {
    const num = number || 0;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(num);
};

// ======================================================================
// SummaryCard Component (DIDESAIN ULANG Sesuai Gambar Admin)
// ======================================================================

// Catatan: 'colorClass' sekarang adalah kelas gradien
const SummaryCard = ({ title, value, icon: Icon, colorClass, secondaryValue, secondaryText, secondaryLink, subTitle }) => {

    // Kelas default untuk icon di kartu
    const iconClass = `p-3 rounded-xl text-white shadow-lg shadow-black/20`;

    return (
        // Gunakan gradien yang dinamis
        <div className={`rounded-2xl p-6 h-full transition-transform transform hover:scale-[1.03] duration-300 ${colorClass}`}>
            <div className="flex items-start justify-between">
                <div>
                    <h4 className="text-sm font-semibold uppercase text-white opacity-90 tracking-wider mb-2">
                        {title}
                    </h4>
                    {/* Nilai Utama */}
                    <p className="text-4xl font-extrabold text-white leading-tight">
                        {value}
                    </p>
                    {/* Sub Title */}
                    {subTitle && (
                        <p className="text-base font-medium text-white opacity-80 mt-1">
                            {subTitle}
                        </p>
                    )}
                </div>

                {/* Icon di Pojok Kanan Atas */}
                <div className={iconClass}>
                    {Icon && <Icon size={24} />}
                </div>
            </div>

            {/* Bagian Bawah (Secondary Value / Quick Action) */}
            <div className="mt-4 pt-4 border-t border-white border-opacity-30">
                {secondaryValue && (
                    <p className="text-lg font-bold text-white mb-2">
                        {secondaryValue}
                    </p>
                )}

                {secondaryLink && (
                    // Menggunakan Link Inertia untuk navigasi
                    <Link href={secondaryLink} className="inline-flex items-center text-sm font-semibold text-white hover:underline transition">
                        {secondaryText} <ArrowRight size={16} className="ml-2" />
                    </Link>
                )}
            </div>
        </div>
    );
};

// ======================================================================
// Main Vendor Dashboard Component
// ======================================================================

// Props: vendor (data vendor utama) dan stats (data statistik)
export default function VendorDashboard({ vendor, stats }) {
    const { auth } = usePage().props;

    // Default values jika stats belum terisi (untuk keamanan)
    const {
        total_revenue = 0,
        total_orders = 0,
        total_reviews = 0,
        average_rating = 0.0,
        recent_orders = [],
        recent_reviews = [],
    } = stats || {};

    // Ambil tanggal hari ini (atau tanggal saat data di-fetch)
    // Catatan: Format tanggal sudah disesuaikan
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // Data Card yang Dinamis dengan Gradien
    const cardData = [
        {
            title: "Status Verifikasi",
            value: vendor.isApproved,
            icon: UserCheck,
            // Warna Orange/Amber
            colorClass: `bg-gradient-to-br from-amber-500 to-orange-600`,
            secondaryValue: vendor.isApproved === 'APPROVED' ? 'Vendor Terverifikasi' : 'Proses Sekarang',
            secondaryText: vendor.isApproved === 'APPROVED' ? 'Lihat Profil' : 'Lengkapi Dokumen',
            // PERBAIKAN ZIGGY: Menggunakan URL relatif
            secondaryLink: '/vendor/profile',
            subTitle: `Rating Anda: ${average_rating}/5.0`,
        },
        {
            title: "Total Pendapatan",
            value: formatRupiah(total_revenue),
            icon: DollarSign,
            // Warna Hijau/Teal
            colorClass: `bg-gradient-to-br from-green-500 to-teal-600`,
            secondaryText: 'Lihat Transaksi',
            // PERBAIKAN ZIGGY: Menggunakan URL relatif
            secondaryLink: '/vendor/payments',
            subTitle: `Total ${total_orders} Pesanan`,
        },
        {
            title: "Total Review",
            value: `${total_reviews} Ulasan`,
            icon: Star,
            // Warna Biru/Ungu
            colorClass: `bg-gradient-to-br from-indigo-500 to-purple-600`,
            secondaryText: 'Lihat Semua Ulasan',
            // PERBAIKAN ZIGGY: Menggunakan URL relatif
            secondaryLink: '/vendor/reviews',
            subTitle: `Rata-rata: ${average_rating} / 5.0`,
        },
        {
            title: "Total Pesanan",
            value: `${total_orders}`,
            icon: ShoppingBag,
            // Warna Pink/Merah
            colorClass: `bg-gradient-to-br from-pink-500 to-red-600`,
            secondaryText: 'Kelola Pesanan',
            // PERBAIKAN ZIGGY: Menggunakan URL relatif
            secondaryLink: '/vendor/orders',
            subTitle: 'Semua Status Pesanan',
        },
    ];

    return (
        <VendorLayout
            user={auth.user}
            vendor={vendor}
            header={<h1 className="text-3xl font-bold text-gray-800">Dashboard Ringkasan</h1>}
        >
            <Head title="Vendor Dashboard" />

            {/* Konten Utama Dashboard */}
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

                {/* === BAGIAN SAPAAN ELEGAN === */}
                <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-800">
                                Selamat Datang, <b className="text-amber-600">{vendor.name}</b>! 👋
                            </h2>
                            <p className="text-base text-gray-600 mt-1">
                                Berikut adalah ringkasan aktivitas bisnis Anda di Wedding Expo hari ini.
                            </p>
                        </div>
                        <span className="text-sm font-medium text-gray-500 bg-amber-50 rounded-full px-4 py-1.5 shadow-sm">
                            Senin, {today}
                        </span>
                    </div>
                </div>

                {/* === SUMMARY CARDS === */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {cardData.map((item, index) => (
                        <SummaryCard
                            key={index}
                            title={item.title}
                            value={item.value}
                            icon={item.icon}
                            colorClass={item.colorClass}
                            secondaryText={item.secondaryText}
                            secondaryLink={item.secondaryLink}
                            subTitle={item.subTitle}
                        />
                    ))}
                </div>

                {/* === LIST PESANAN & REVIEW TERBARU === */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Kartu Pesanan Terbaru */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-bold text-gray-800 flex items-center">
                                <ShoppingBag size={20} className="mr-2 text-indigo-500" /> Pesanan Terbaru
                            </h4>
                            {/* PERBAIKAN ZIGGY: Menggunakan URL relatif */}
                            <Link href={'/vendor/orders'} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                                Lihat Semua
                            </Link>
                        </div>

                        {recent_orders && recent_orders.length > 0 ? (
                            // Daftar Pesanan
                            <div className="space-y-3">
                                {recent_orders.slice(0, 3).map(order => (
                                    <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            {/* Catatan: customer_name diasumsikan ada di object order yang dikirim dari controller */}
                                            <p className="font-semibold text-gray-800">{order.customer_name}</p>
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${order.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
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

                    {/* Kartu Review Terbaru */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-bold text-gray-800 flex items-center">
                                <Star size={20} className="mr-2 text-yellow-500" /> Review Terbaru
                            </h4>
                            {/* PERBAIKAN ZIGGY: Menggunakan URL relatif */}
                            <Link href={'/vendor/reviews'} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                                Lihat Semua
                            </Link>
                        </div>

                        {recent_reviews && recent_reviews.length > 0 ? (
                            // Daftar Review
                            <div className="space-y-3">
                                {recent_reviews.slice(0, 3).map(review => (
                                    <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center mb-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} className={`mr-1 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                            ))}
                                            <p className="text-xs font-semibold text-gray-700 ml-2">{review.customer_name}</p>
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
                {/* End List */}

            </div>
        </VendorLayout>
    );
}