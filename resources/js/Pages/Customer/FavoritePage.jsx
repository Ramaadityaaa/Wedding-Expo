import React, { useMemo, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { HeartOff, MapPin, Star, ArrowRight } from "lucide-react";

export default function FavoritePage({ favorites = [] }) {
    const { auth } = usePage().props || {};
    const user = auth?.user || null;

    const [processingId, setProcessingId] = useState(null);

    const list = useMemo(() => favorites || [], [favorites]);

    const handleRemove = (vendorId) => {
        if (!user) {
            alert("Silakan login terlebih dahulu.");
            window.location.href = "/login";
            return;
        }

        if (processingId) return;

        setProcessingId(vendorId);
        router.delete(route("favorites.destroy", vendorId), {
            preserveScroll: true,
            onFinish: () => setProcessingId(null),
            onError: () => {
                setProcessingId(null);
                alert("Gagal menghapus favorit. Coba lagi.");
            },
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Head title="Favorit Saya" />
            <Navbar />

            <main className="flex-1 pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <header className="mb-10 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text tracking-wide font-montserrat">
                            Favorit Saya
                        </h1>
                        <p className="text-gray-600 mt-4 text-base md:text-lg max-w-3xl mx-auto">
                            Daftar vendor yang kamu simpan. Buka detail vendor lalu tap ikon hati untuk menambahkannya ke sini.
                        </p>
                    </header>

                    <section className="bg-white shadow-xl rounded-3xl p-6 md:p-10">
                        {!user && (
                            <div className="mb-6 p-4 rounded-2xl bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm">
                                Kamu belum login. Login dulu supaya favoritmu bisa tersimpan permanen.
                                <div className="mt-3">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-yellow-200 text-yellow-800 font-semibold hover:bg-yellow-100 transition"
                                    >
                                        Login
                                    </Link>
                                </div>
                            </div>
                        )}

                        {list.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {list.map((v) => {
                                    const rating = Number(v.avg_rating ?? 0);
                                    const reviewCount = Number(v.reviews_count ?? 0);
                                    const packagesCount = Number(v.packages_count ?? 0);
                                    const locationText = `${v.city || "—"}${v.province ? `, ${v.province}` : ""}`;

                                    return (
                                        <div
                                            key={v.id}
                                            className="
                                                group relative overflow-hidden rounded-3xl
                                                bg-white border border-gray-100
                                                shadow-sm hover:shadow-xl transition-all duration-300
                                            "
                                        >
                                            <div className="relative h-40">
                                                {v.coverPhoto ? (
                                                    <img
                                                        src={v.coverPhoto}
                                                        alt={v.name}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-gradient-to-br from-yellow-50 via-white to-yellow-100" />
                                                )}

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                                                <div className="absolute left-4 bottom-4 right-4">
                                                    <div className="flex items-end justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <h2 className="text-lg font-semibold text-white leading-snug truncate">
                                                                {v.name}
                                                            </h2>
                                                            <div className="mt-1 flex items-center gap-2 text-xs text-white/90">
                                                                <MapPin className="w-4 h-4" />
                                                                <span className="truncate">{locationText}</span>
                                                            </div>
                                                        </div>

                                                        <div className="shrink-0">
                                                            <div className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold text-white border border-white/20">
                                                                <Star className="w-4 h-4 text-yellow-300 fill-current" />
                                                                <span>{rating.toFixed(1)}</span>
                                                                <span className="text-white/75">({reviewCount})</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-100">
                                                        {v.type || "Vendor"}
                                                    </span>

                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-100">
                                                        Paket: {packagesCount}
                                                    </span>

                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-100">
                                                        Rating: {rating.toFixed(1)}
                                                    </span>
                                                </div>

                                                <div className="mt-5 flex gap-3">
                                                    <Link
                                                        href={`/vendors/${v.id}`}
                                                        className="
                                                            flex-1 inline-flex items-center justify-center gap-2
                                                            px-4 py-2.5 rounded-2xl
                                                            bg-gradient-to-r from-yellow-500 to-amber-600
                                                            text-white text-sm font-semibold
                                                            shadow-sm hover:shadow-md
                                                            transition
                                                        "
                                                    >
                                                        Lihat Detail
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemove(v.id)}
                                                        disabled={processingId === v.id}
                                                        className={[
                                                            "inline-flex items-center justify-center gap-2",
                                                            "px-4 py-2.5 rounded-2xl text-sm font-semibold",
                                                            "border transition",
                                                            processingId === v.id
                                                                ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                                                                : "border-red-200 text-red-600 bg-white hover:bg-red-50 hover:border-red-300",
                                                        ].join(" ")}
                                                        aria-label="Hapus dari favorit"
                                                    >
                                                        <HeartOff className="w-4 h-4" />
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-yellow-300/15 blur-2xl" />
                                                <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-amber-400/15 blur-2xl" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center p-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <h3 className="text-2xl font-semibold text-gray-700">
                                    Daftar favorit masih kosong
                                </h3>
                                <p className="mt-3 text-gray-500">
                                    Jelajahi vendor, lalu tekan ikon hati di halaman detail vendor.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href={route("vendors.index")}
                                        className="inline-flex items-center px-6 py-3 rounded-xl bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
                                    >
                                        Cari Vendor
                                    </Link>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
