import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/Components/Footer";

export default function Dashboard({ auth, vendors = [] }) {
    const user = auth?.user ?? null;

    // State untuk pencarian
    const [searchQuery, setSearchQuery] = useState({
        term: "", // Satu input untuk semua (bisa nama atau kota)
        filter: "all", // Opsional: bisa dikembangkan nanti
    });

    // Filter Logic: Mencari di Nama ATAU Kota
    const filteredVendors = vendors.filter((vendor) => {
        const term = searchQuery.term.toLowerCase();
        const matchName = vendor.name.toLowerCase().includes(term);
        const matchCity = vendor.city.toLowerCase().includes(term);
        return matchName || matchCity;
    });

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title="Temukan Vendor Pernikahan Impian Anda" />

            {/* Navbar */}
            <Navbar auth={auth} user={user} />

            <main>
                {/* 1. HERO SECTION */}
                <section className="relative bg-gradient-to-b from-yellow-100 via-amber-50 to-white py-24 md:py-32 px-4 overflow-hidden">
                    {/* Background Blobs */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-yellow-300 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
                        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-amber-400 rounded-full filter blur-3xl opacity-30"></div>
                    </div>

                    <div className="relative max-w-5xl mx-auto text-center z-10">
                        <h1 className="font-serif text-yellow-900 mb-6 leading-tight drop-shadow-sm">
                            <span className="text-3xl md:text-4xl font-light block text-yellow-800 mb-2">
                                Rencanakan Momen Spesial
                            </span>
                            <span className="font-extrabold text-5xl md:text-7xl bg-gradient-to-r from-amber-600 to-yellow-800 bg-clip-text text-transparent">
                                Pernikahan Impian
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Jelajahi ribuan vendor profesional terpercaya di
                            Indonesia. Mulai dari katering lezat, dekorasi
                            memukau, hingga dokumentasi abadi.
                        </p>

                        {/* SEARCH BAR (Updated UI) */}
                        <div className="max-w-2xl mx-auto relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative flex items-center bg-white rounded-full shadow-xl p-2 pr-2">
                                <Search className="ml-4 w-6 h-6 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery.term}
                                    onChange={(e) =>
                                        setSearchQuery({
                                            ...searchQuery,
                                            term: e.target.value,
                                        })
                                    }
                                    placeholder="Cari vendor, katering, atau kota..."
                                    className="w-full py-3 px-4 text-gray-700 bg-transparent border-none focus:ring-0 placeholder-gray-400 text-lg"
                                />
                                <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-md transform hover:scale-105">
                                    Cari
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. VENDOR LIST SECTION */}
                <section id="vendors" className="py-20 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                                Vendor Pilihan Kami
                            </h2>
                            <div className="w-20 h-1.5 bg-amber-500 mx-auto rounded-full"></div>
                            <p className="mt-4 text-gray-600">
                                Temukan partner terbaik untuk hari bahagia Anda
                            </p>
                        </div>

                        {filteredVendors.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <p className="text-xl text-gray-500 font-medium">
                                    Belum ada vendor yang sesuai pencarian Anda.
                                </p>
                                <p className="text-gray-400 mt-2">
                                    Coba kata kunci lain atau lihat semua
                                    vendor.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {filteredVendors.map((vendor) => (
                                    <Link
                                        key={vendor.id}
                                        href={route(
                                            "vendors.details",
                                            vendor.id
                                        )}
                                        className="group h-full"
                                    >
                                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-amber-200 transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
                                            {/* Cover Image */}
                                            <div className="relative h-48 overflow-hidden bg-gray-200">
                                                {vendor.coverPhoto ? (
                                                    <img
                                                        src={vendor.coverPhoto}
                                                        alt={vendor.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-yellow-50 text-amber-300">
                                                        <span className="text-4xl font-bold opacity-50">
                                                            {vendor.name.charAt(
                                                                0
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                                                        {vendor.name}
                                                    </h3>
                                                </div>

                                                <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md">
                                                    <span className="text-amber-500 mr-1">
                                                        ★
                                                    </span>
                                                    <span className="text-xs font-bold text-amber-700">
                                                        {vendor.rating > 0
                                                            ? vendor.rating
                                                            : "New"}
                                                    </span>
                                                </div>

                                                <div className="flex items-center text-gray-500 text-sm mb-3">
                                                    <MapPin className="w-4 h-4 mr-1 text-amber-500" />
                                                    <span className="truncate">
                                                        {vendor.city}
                                                    </span>
                                                </div>

                                                <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                                                    {vendor.description ||
                                                        "Tidak ada deskripsi singkat."}
                                                </p>

                                                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                                                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                                        Verified Vendor
                                                    </span>
                                                    <span className="text-sm text-gray-400 group-hover:translate-x-1 transition-transform">
                                                        Detail →
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        <div className="text-center mt-16">
                            <Link href="/vendors">
                                <Button
                                    variant="outline"
                                    className="px-8 py-6 rounded-full border-2 border-gray-200 text-gray-600 font-bold hover:border-amber-500 hover:text-amber-600 hover:bg-white transition-all text-lg"
                                >
                                    Lihat Semua Vendor
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 3. ABOUT SECTION (Updated) */}
                <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-800/50 skew-x-12 transform translate-x-20"></div>

                    <div className="max-w-6xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
                                Mengapa Memilih <br />
                                <span className="text-amber-400">
                                    WeddingExpo?
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                Kami lebih dari sekadar direktori. Kami adalah
                                teman perjalanan Anda menuju pelaminan. Dengan
                                fitur keamanan pembayaran, verifikasi vendor
                                ketat, dan ribuan ulasan asli, kami memastikan
                                hari bahagia Anda bebas dari rasa khawatir.
                            </p>

                            <div className="grid grid-cols-3 gap-8 pt-4 border-t border-gray-700">
                                <div>
                                    <h4 className="text-3xl font-bold text-amber-400">
                                        1.2k+
                                    </h4>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Vendor Aktif
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold text-amber-400">
                                        5k+
                                    </h4>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Pasangan Bahagia
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold text-amber-400">
                                        4.9
                                    </h4>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Rating Kepuasan
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 relative">
                            <div className="absolute -inset-4 bg-amber-500/20 rounded-2xl blur-xl"></div>
                            <img
                                src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Wedding Moment"
                                className="relative rounded-2xl shadow-2xl border-4 border-gray-800 w-full object-cover h-[400px]"
                            />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
