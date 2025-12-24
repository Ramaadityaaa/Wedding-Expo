import React, { useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import CustomerGlobalChat from "@/Components/CustomerGlobalChat";
import {
    MapPin,
    Star,
    MessageSquare,
    CheckCircle,
    Package,
    Image as ImageIcon,
    Info,
    Heart,
} from "lucide-react";

export default function VendorDetails({ auth, vendor, isFavorited = false }) {
    const [activeTab, setActiveTab] = useState("packages");
    const [targetVendorForChat, setTargetVendorForChat] = useState(null);

    const [favorited, setFavorited] = useState(!!isFavorited);
    const [favProcessing, setFavProcessing] = useState(false);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    const averageRating = useMemo(() => {
        if (!vendor?.reviews || vendor.reviews.length === 0) return 0;
        const sum = vendor.reviews.reduce((acc, r) => acc + r.rating, 0);
        return (sum / vendor.reviews.length).toFixed(1);
    }, [vendor]);

    const handleChatClick = () => {
        if (!auth?.user) {
            alert("Silakan login atau register sebagai Customer untuk chat dengan vendor.");
            window.location.href = "/login";
            return;
        }

        if (auth.user.id === vendor.user_id) {
            alert("Anda tidak bisa mengirim pesan ke diri sendiri.");
            return;
        }

        setTargetVendorForChat({
            id: vendor.user_id,
            name: vendor.name,
            avatar: vendor.logo ? `/storage/${vendor.logo}` : null,
        });
    };

    const handleToggleFavorite = () => {
        if (!auth?.user) {
            alert("Silakan login terlebih dahulu untuk menambahkan favorit.");
            window.location.href = "/login";
            return;
        }

        if (favProcessing) return;

        // optimistic UI
        const next = !favorited;
        setFavorited(next);
        setFavProcessing(true);

        router.post(
            route("favorites.toggle", vendor.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setFavProcessing(false),
                onError: () => {
                    // rollback kalau gagal
                    setFavorited(!next);
                    alert("Gagal memperbarui favorit. Coba lagi.");
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title={`${vendor.name} - Detail Vendor`} />
            <Navbar auth={auth} />

            <main className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                        <div className="h-48 md:h-64 bg-gradient-to-r from-amber-100 to-yellow-50 relative">
                            {vendor.portfolios?.length > 0 ? (
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
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white p-1 shadow-lg flex-shrink-0">
                                    <div className="w-full h-full bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 text-3xl font-bold overflow-hidden">
                                        {vendor.logo ? (
                                            <img
                                                src={`/storage/${vendor.logo}`}
                                                className="w-full h-full object-cover"
                                                alt={vendor.name}
                                            />
                                        ) : (
                                            vendor.name?.charAt(0)
                                        )}
                                    </div>
                                </div>

                                <div className="md:ml-6 mt-4 md:mt-0 flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600 text-sm">
                                        <div className="flex items-center">
                                            <MapPin size={16} className="mr-1 text-amber-500" />
                                            {vendor.address || "Lokasi tidak tersedia"}
                                        </div>
                                        <div className="flex items-center">
                                            <Star size={16} className="mr-1 text-yellow-400 fill-current" />
                                            <span className="font-semibold text-gray-900 mr-1">{averageRating}</span>
                                            ({vendor.reviews?.length || 0} Ulasan)
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 md:mt-0 flex items-center gap-3">
                                    {/* tombol favorit */}
                                    <button
                                        type="button"
                                        onClick={handleToggleFavorite}
                                        disabled={favProcessing}
                                        className={`
                                            inline-flex items-center justify-center
                                            w-11 h-11 rounded-full
                                            border shadow-sm transition
                                            ${favorited
                                                ? "bg-amber-50 border-amber-200 text-amber-600"
                                                : "bg-white border-gray-200 text-gray-500 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
                                            }
                                            ${favProcessing ? "opacity-60 cursor-not-allowed" : "hover:scale-105"}
                                        `}
                                        aria-label="Toggle Favorit"
                                        title={favorited ? "Hapus dari favorit" : "Tambah ke favorit"}
                                    >
                                        <Heart className={favorited ? "fill-current" : ""} size={18} />
                                    </button>

                                    {/* tombol chat */}
                                    <button
                                        onClick={handleChatClick}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-semibold shadow-md transition flex items-center gap-2 transform hover:scale-105"
                                    >
                                        <MessageSquare size={18} />
                                        Chat Vendor
                                    </button>
                                </div>
                            </div>

                            <div className="flex border-b border-gray-200 overflow-x-auto">
                                {[
                                    { id: "packages", label: "Paket Harga", icon: Package },
                                    { id: "portfolio", label: "Portofolio", icon: ImageIcon },
                                    { id: "reviews", label: "Ulasan Klien", icon: Star },
                                    { id: "about", label: "Tentang", icon: Info },
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

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-3">
                            {activeTab === "packages" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                                    {vendor.packages?.length > 0 ? (
                                        vendor.packages.map((pkg) => (
                                            <div
                                                key={pkg.id}
                                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition"
                                            >
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                                                    <p className="text-2xl font-bold text-amber-600 mb-4 font-mono">
                                                        {formatRupiah(pkg.price)}
                                                    </p>
                                                    <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                                                        {pkg.description}
                                                    </p>

                                                    <ul className="space-y-2 mb-6">
                                                        {pkg.features?.slice(0, 4).map((feature, idx) => (
                                                            <li key={idx} className="flex items-start text-sm text-gray-600">
                                                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                                                                <span>{feature}</span>
                                                            </li>
                                                        ))}
                                                        {pkg.features && pkg.features.length > 4 && (
                                                            <li className="text-xs text-gray-400 italic ml-6">
                                                                + {pkg.features.length - 4} fitur lainnya
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>

                                                <Link
                                                    href={`/vendors/${vendor.id}/package/${pkg.id}`}
                                                    className="w-full mt-auto py-3 px-6 bg-white border-2 border-amber-500 text-amber-600 font-bold rounded-lg hover:bg-amber-50 transition-all ease-in-out transform hover:scale-105 text-center"
                                                >
                                                    Pilih Paket Ini
                                                </Link>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-16 text-center bg-white rounded-xl border border-dashed border-gray-300">
                                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500">Belum ada paket harga yang tersedia.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "portfolio" && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in-up">
                                    {vendor.portfolios?.length > 0 ? (
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
                                            <p className="text-gray-500">Belum ada portofolio.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {auth?.user && targetVendorForChat && (
                <CustomerGlobalChat user={auth.user} initialChatUser={targetVendorForChat} />
            )}
        </div>
    );
}
