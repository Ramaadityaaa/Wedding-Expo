import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/Components/Footer";
import VendorCard from "@/components/VendorCard";

export default function Dashboard({ auth, vendors = [] }) {
    const user = auth?.user ?? null;

    const displayedVendors = vendors;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title="Temukan Vendor Pernikahan Impian Anda" />

            <Navbar auth={auth} user={user} />

            <main>
                {/* ================= HERO (TANPA SEARCH) ================= */}
                <section className="relative bg-gradient-to-b from-yellow-100 via-amber-50 to-white py-24 md:py-32 px-4 overflow-hidden">
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

                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Jelajahi ribuan vendor profesional terpercaya di Indonesia. Mulai dari
                            katering lezat, dekorasi memukau, hingga dokumentasi abadi.
                        </p>

                        {/* Spacer agar jarak tetap “rasa desainnya” seperti saat ada search */}
                        <div className="mt-10" />
                    </div>
                </section>

                {/* ================= VENDOR PILIHAN KAMI ================= */}
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

                        {displayedVendors.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <p className="text-xl text-gray-500 font-medium">
                                    Belum ada vendor yang tersedia saat ini.
                                </p>
                                <p className="text-gray-400 mt-2">
                                    Silakan coba lagi nanti atau lihat semua vendor.
                                </p>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="flex gap-8 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
                                    {displayedVendors.map((vendor) => (
                                        <div
                                            key={vendor.id}
                                            className="flex-none w-[320px] snap-start"
                                        >
                                            <VendorCard vendor={vendor} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="text-center mt-16">
                            <Link href={route("vendors.index")}>
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

                {/* ================= ABOUT (DIMEPETKAN KE FOOTER) ================= */}
                <section
                    id="about"
                    className="relative pt-24 pb-0 px-4 bg-gradient-to-b from-white via-amber-50 to-yellow-100 overflow-hidden mb-0"
                >
                    {/* Overlay atas biar nyatu dengan section putih di atasnya */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent" />

                    {/* dekorasi lembut */}
                    <div className="absolute inset-0 pointer-events-none opacity-30">
                        <div className="absolute -top-16 -left-16 w-96 h-96 bg-amber-300 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -right-20 w-[520px] h-[520px] bg-yellow-300 rounded-full blur-3xl opacity-70"></div>
                    </div>

                    <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-16">
                        {/* Kiri: teks */}
                        <div className="flex-1 space-y-8">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight text-gray-900">
                                Mengapa Memilih <br />
                                <span className="text-amber-600">WeddingExpo?</span>
                            </h2>

                            <p className="text-gray-700 text-lg leading-relaxed">
                                Kami lebih dari sekadar direktori. Kami adalah teman perjalanan Anda
                                menuju pelaminan. Dengan fitur keamanan pembayaran, verifikasi vendor
                                ketat, dan ribuan ulasan asli, kami membantu memastikan hari bahagia
                                Anda lebih tenang dan terarah.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-amber-200/70">
                                <div className="bg-white/70 backdrop-blur rounded-2xl p-5 border border-amber-100 shadow-sm">
                                    <h4 className="text-3xl font-extrabold text-amber-700">1.2k+</h4>
                                    <p className="text-sm text-gray-600 mt-1">Vendor Aktif</p>
                                </div>

                                <div className="bg-white/70 backdrop-blur rounded-2xl p-5 border border-amber-100 shadow-sm">
                                    <h4 className="text-3xl font-extrabold text-amber-700">5k+</h4>
                                    <p className="text-sm text-gray-600 mt-1">Pasangan Bahagia</p>
                                </div>

                                <div className="bg-white/70 backdrop-blur rounded-2xl p-5 border border-amber-100 shadow-sm">
                                    <h4 className="text-3xl font-extrabold text-amber-700">4.9</h4>
                                    <p className="text-sm text-gray-600 mt-1">Rating Kepuasan</p>
                                </div>
                            </div>
                        </div>

                        {/* Kanan: gambar */}
                        <div className="flex-1 relative w-full">
                            <div className="absolute -inset-4 bg-amber-500/20 rounded-2xl blur-xl"></div>
                            <img
                                src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Wedding Moment"
                                className="relative rounded-2xl shadow-2xl border border-amber-100 w-full object-cover h-[400px]"
                            />
                        </div>
                    </div>

                    {/* Spacer kecil saja supaya tidak “nempel keras” tapi tetap pepet */}
                    <div className="h-6" />
                </section>
            </main>

            <Footer />
        </div>
    );
}
