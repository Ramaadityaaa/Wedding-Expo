import React, { useMemo, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { HeartOff, MapPin, Star } from "lucide-react";

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
        <div className="min-h-screen bg-gray-50">
            <Head title="Favorit Saya" />
            <Navbar />

            <div className="pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <header className="mb-10 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text tracking-wide font-montserrat">
                            Favorit Saya
                        </h1>
                        <p className="text-gray-600 mt-4 text-base md:text-lg max-w-3xl mx-auto">
                            Daftar vendor yang kamu simpan. Sekali klik di detail vendor, lalu tap ikon hati — masuk ke sini.
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {list.map((v) => (
                                    <div
                                        key={v.id}
                                        className="flex flex-col justify-between bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-3xl shadow-md hover:shadow-lg transition"
                                    >
                                        <div className="flex-grow">
                                            <div className="flex items-start justify-between gap-3">
                                                <h2 className="text-xl font-semibold text-gray-900 leading-snug">
                                                    {v.name}
                                                </h2>
                                            </div>

                                            <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-amber-600" />
                                                <span className="truncate">
                                                    {v.city || "—"}{v.province ? `, ${v.province}` : ""}
                                                </span>
                                            </p>

                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-white/70 text-yellow-800 border border-yellow-200">
                                                    {v.type || "Vendor"}
                                                </span>

                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-white/70 text-gray-700 border border-yellow-200">
                                                    Paket: {v.packages_count ?? 0}
                                                </span>

                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-white/70 text-gray-700 border border-yellow-200">
                                                    <Star className="w-3.5 h-3.5 mr-1 text-yellow-500 fill-current" />
                                                    {v.avg_rating ?? 0} ({v.reviews_count ?? 0})
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 mt-6">
                                            <Link
                                                href={`/vendors/${v.id}`}
                                                className="flex-1 text-center px-4 py-2 text-sm bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors font-semibold"
                                            >
                                                Lihat Detail
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => handleRemove(v.id)}
                                                disabled={processingId === v.id}
                                                className={`px-4 py-2 text-sm rounded-xl border font-semibold transition-colors inline-flex items-center gap-2
                                                    ${processingId === v.id
                                                        ? "border-gray-300 text-gray-400 bg-white cursor-not-allowed"
                                                        : "border-red-300 text-red-600 bg-white hover:bg-red-50"
                                                    }`}
                                            >
                                                <HeartOff className="w-4 h-4" />
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <h3 className="text-2xl font-semibold text-gray-700">Daftar favorit masih kosong</h3>
                                <p className="mt-3 text-gray-500">
                                    Jelajahi vendor, lalu tekan ikon hati di halaman detail vendor.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href="/#vendors"
                                        className="inline-flex items-center px-6 py-3 rounded-xl bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
                                    >
                                        Cari Vendor
                                    </Link>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
}
