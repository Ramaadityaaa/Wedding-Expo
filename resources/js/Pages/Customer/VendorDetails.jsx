import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import CustomerGlobalChat from "@/Components/CustomerGlobalChat"; // Widget Chat
import {
    MapPin,
    Star,
    MessageSquare,
    CheckCircle,
    Package,
    Image as ImageIcon,
    Info,
} from "lucide-react";

export default function VendorDetails({ auth, vendor }) {
    // State untuk Tab Navigasi (Default: packages)
    const [activeTab, setActiveTab] = useState("packages");

    // State untuk memicu Chat Widget (menyimpan data target user chat)
    const [targetVendorForChat, setTargetVendorForChat] = useState(null);

    // Helper Format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    // Helper Hitung Rata-rata Rating
    const averageRating =
        vendor.reviews.length > 0
            ? (
                  vendor.reviews.reduce(
                      (acc, review) => acc + review.rating,
                      0
                  ) / vendor.reviews.length
              ).toFixed(1)
            : 0;

    // --- FUNGSI KLIK TOMBOL CHAT ---
    const handleChatClick = () => {
        // Cek Login
        if (!auth.user) {
            alert(
                "Silakan login atau register sebagai Customer untuk chat dengan vendor."
            );
            window.location.href = "/login";
            return;
        }

        // Cek apakah user mencoba chat vendornya sendiri
        if (auth.user.id === vendor.user_id) {
            alert("Anda tidak bisa mengirim pesan ke diri sendiri.");
            return;
        }

        // Set data vendor target agar Widget Chat terbuka
        setTargetVendorForChat({
            id: vendor.user_id, // PENTING: Chat ke User ID pemilik vendor
            name: vendor.name,
            avatar: vendor.logo ? `/storage/${vendor.logo}` : null,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title={`${vendor.name} - Detail Vendor`} />
            <Navbar auth={auth} />

            <main className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* --- 1. HEADER VENDOR --- */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                        {/* Banner Area */}
                        <div className="h-48 md:h-64 bg-gradient-to-r from-amber-100 to-yellow-50 relative">
                            {vendor.portfolios.length > 0 ? (
                                <img
                                    src={`/storage/${vendor.portfolios[0].imageUrl}`}
                                    className="w-full h-full object-cover opacity-60"
                                    alt="Cover Vendor"
                                />
                            ) : (
                                <div className="w-full h-full bg-amber-50 flex items-center justify-center text-amber-200">
                                    <ImageIcon size={64} />
                                </div>
                            )}
                        </div>

                        <div className="px-8 pb-8">
                            <div className="relative flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6">
                                {/* Logo / Avatar */}
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white p-1 shadow-lg flex-shrink-0">
                                    <div className="w-full h-full bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 text-3xl font-bold overflow-hidden">
                                        {vendor.logo ? (
                                            <img
                                                src={`/storage/${vendor.logo}`}
                                                className="w-full h-full object-cover"
                                                alt={vendor.name}
                                            />
                                        ) : (
                                            vendor.name.charAt(0)
                                        )}
                                    </div>
                                </div>

                                {/* Info Utama */}
                                <div className="md:ml-6 mt-4 md:mt-0 flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {vendor.name}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600 text-sm">
                                        <div className="flex items-center">
                                            <MapPin
                                                size={16}
                                                className="mr-1 text-amber-500"
                                            />
                                            {vendor.address ||
                                                "Lokasi tidak tersedia"}
                                        </div>
                                        <div className="flex items-center">
                                            <Star
                                                size={16}
                                                className="mr-1 text-yellow-400 fill-current"
                                            />
                                            <span className="font-semibold text-gray-900 mr-1">
                                                {averageRating}
                                            </span>
                                            ({vendor.reviews.length} Ulasan)
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol Chat */}
                                <div className="mt-4 md:mt-0">
                                    <button
                                        onClick={handleChatClick}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-semibold shadow-md transition flex items-center gap-2 transform hover:scale-105"
                                    >
                                        <MessageSquare size={18} />
                                        Chat Vendor
                                    </button>
                                </div>
                            </div>

                            {/* Tabs Navigation */}
                            <div className="flex border-b border-gray-200 overflow-x-auto">
                                {[
                                    {
                                        id: "packages",
                                        label: "Paket Harga",
                                        icon: Package,
                                    },
                                    {
                                        id: "portfolio",
                                        label: "Portofolio",
                                        icon: ImageIcon,
                                    },
                                    {
                                        id: "reviews",
                                        label: "Ulasan Klien",
                                        icon: Star,
                                    },
                                    {
                                        id: "about",
                                        label: "Tentang",
                                        icon: Info,
                                    },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                            activeTab === tab.id
                                                ? "border-amber-500 text-amber-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        <tab.icon size={16} className="mr-2" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- 2. KONTEN TAB --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-3">
                            {/* === TAB: PAKET HARGA === */}
                            {activeTab === "packages" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                                    {vendor.packages.length > 0 ? (
                                        vendor.packages.map((pkg) => (
                                            <div
                                                key={pkg.id}
                                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition"
                                            >
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                        {pkg.name}
                                                    </h3>
                                                    <p className="text-2xl font-bold text-amber-600 mb-4 font-mono">
                                                        {formatRupiah(
                                                            pkg.price
                                                        )}
                                                    </p>
                                                    <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                                                        {pkg.description}
                                                    </p>

                                                    {/* List Fitur */}
                                                    <ul className="space-y-2 mb-6">
                                                        {pkg.features &&
                                                            pkg.features
                                                                .slice(0, 4)
                                                                .map(
                                                                    (
                                                                        feature,
                                                                        idx
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className="flex items-start text-sm text-gray-600"
                                                                        >
                                                                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                                                                            <span>
                                                                                {
                                                                                    feature
                                                                                }
                                                                            </span>
                                                                        </li>
                                                                    )
                                                                )}
                                                        {pkg.features &&
                                                            pkg.features
                                                                .length > 4 && (
                                                                <li className="text-xs text-gray-400 italic ml-6">
                                                                    +{" "}
                                                                    {pkg
                                                                        .features
                                                                        .length -
                                                                        4}{" "}
                                                                    fitur
                                                                    lainnya
                                                                </li>
                                                            )}
                                                    </ul>
                                                </div>
                                                <button className="w-full mt-auto py-3 bg-white border-2 border-amber-500 text-amber-600 font-bold rounded-lg hover:bg-amber-50 transition">
                                                    Pilih Paket Ini
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-16 text-center bg-white rounded-xl border border-dashed border-gray-300">
                                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500">
                                                Belum ada paket harga yang
                                                tersedia.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* === TAB: PORTOFOLIO === */}
                            {activeTab === "portfolio" && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in-up">
                                    {vendor.portfolios.length > 0 ? (
                                        vendor.portfolios.map((item) => (
                                            <div
                                                key={item.id}
                                                className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer shadow-sm"
                                            >
                                                {item.videoUrl ? (
                                                    <video
                                                        src={`/storage/${item.videoUrl}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={`/storage/${item.imageUrl}`}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                                                    <p className="text-white font-medium text-sm truncate w-full">
                                                        {item.title}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-16 text-center bg-white rounded-xl border border-dashed border-gray-300">
                                            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500">
                                                Belum ada portofolio.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* === TAB: ULASAN === */}
                            {activeTab === "reviews" && (
                                <div className="space-y-6 animate-fade-in-up">
                                    {vendor.reviews.length > 0 ? (
                                        vendor.reviews.map((review) => (
                                            <div
                                                key={review.id}
                                                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                                            {review.user?.name.charAt(
                                                                0
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-900">
                                                                {
                                                                    review.user
                                                                        ?.name
                                                                }
                                                            </h4>
                                                            <div className="flex text-yellow-400 text-xs mt-0.5">
                                                                {[
                                                                    ...Array(5),
                                                                ].map(
                                                                    (_, i) => (
                                                                        <Star
                                                                            key={
                                                                                i
                                                                            }
                                                                            size={
                                                                                12
                                                                            }
                                                                            fill={
                                                                                i <
                                                                                review.rating
                                                                                    ? "currentColor"
                                                                                    : "none"
                                                                            }
                                                                            className={
                                                                                i >=
                                                                                review.rating
                                                                                    ? "text-gray-300"
                                                                                    : ""
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(
                                                            review.created_at
                                                        ).toLocaleDateString(
                                                            "id-ID"
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 text-sm pl-13 mt-2">
                                                    "{review.comment}"
                                                </p>

                                                {/* Balasan Vendor */}
                                                {review.reply && (
                                                    <div className="mt-4 ml-4 pl-4 border-l-4 border-amber-200 bg-amber-50 p-3 rounded-r-lg">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-bold text-amber-800">
                                                                {vendor.name}
                                                            </span>
                                                            <span className="text-[10px] px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded">
                                                                Penjual
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-600">
                                                            {review.reply}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-16 text-center bg-white rounded-xl border border-dashed border-gray-300">
                                            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500">
                                                Belum ada ulasan untuk vendor
                                                ini.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* === TAB: TENTANG === */}
                            {activeTab === "about" && (
                                <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm animate-fade-in-up">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Tentang {vendor.name}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                        {vendor.description ||
                                            "Deskripsi vendor belum tersedia."}
                                    </p>

                                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">
                                                Lokasi
                                            </p>
                                            <p className="font-medium text-gray-900 flex items-center">
                                                <MapPin
                                                    size={16}
                                                    className="mr-2 text-gray-400"
                                                />
                                                {vendor.address || "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">
                                                Kontak
                                            </p>
                                            <p className="font-medium text-gray-900 flex items-center">
                                                <MessageSquare
                                                    size={16}
                                                    className="mr-2 text-gray-400"
                                                />
                                                {vendor.phone || "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* --- 3. WIDGET CHAT (DIPICU SAAT KLIK) --- */}
            {auth.user && targetVendorForChat && (
                <CustomerGlobalChat
                    user={auth.user}
                    initialChatUser={targetVendorForChat}
                />
            )}
        </div>
    );
}
