import React, { useEffect, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import Navbar from "@/components/Navbar";
import Footer from "@/Components/Footer";
import VendorCard from "@/components/VendorCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function VendorsIndex({ auth, vendors, filters }) {
    const [q, setQ] = useState(filters?.q || "");
    const [sort, setSort] = useState(filters?.sort || "rating");

    useEffect(() => {
        setQ(filters?.q || "");
        setSort(filters?.sort || "rating");
    }, [filters?.q, filters?.sort]);

    const submit = (e) => {
        e.preventDefault();
        router.get(
            route("vendors.index"),
            { q, sort },
            { preserveState: true, replace: true }
        );
    };

    const data = vendors?.data || [];
    const links = vendors?.links || [];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title="Semua Vendor" />

            <Navbar />

            <main className="pt-20">
                <section className="py-10 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                                Semua Vendor
                            </h1>
                            <p className="mt-3 text-gray-600">
                                Cari vendor yang anda inginkan.
                            </p>
                        </div>

                        <form
                            onSubmit={submit}
                            className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-4 md:p-5 flex flex-col md:flex-row gap-3 items-stretch"
                        >
                            <div className="flex items-center bg-gray-50 rounded-xl px-3 flex-1 border border-gray-100">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Cari vendor"
                                    className="w-full bg-transparent border-none focus:ring-0 px-3 py-3 text-gray-700"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="rounded-xl px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                            >
                                Terapkan
                            </Button>
                        </form>

                        <div className="mt-10">
                            {data.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                                    <p className="text-lg text-gray-500 font-medium">
                                        Vendor tidak ditemukan.
                                    </p>
                                    <p className="text-gray-400 mt-2">
                                        Ubah kata kunci pencarian Kamu.
                                    </p>
                                    <div className="mt-6">
                                        <Link href={route("home")}>
                                            <Button variant="outline" className="rounded-xl">
                                                Kembali ke Beranda
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {data.map((vendor) => (
                                        <VendorCard key={vendor.id} vendor={vendor} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {links.length > 0 && (
                            <div className="mt-10 flex flex-wrap gap-2 justify-center">
                                {links.map((l, idx) => {
                                    const label = (l.label || "")
                                        .replace("&laquo;", "")
                                        .replace("&raquo;", "")
                                        .trim();

                                    const isDisabled = !l.url;
                                    const isActive = !!l.active;

                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            disabled={isDisabled}
                                            onClick={() => {
                                                if (!l.url) return;
                                                router.get(l.url, {}, { preserveState: true, replace: true });
                                            }}
                                            className={[
                                                "px-4 py-2 rounded-xl border text-sm font-semibold",
                                                isActive
                                                    ? "bg-amber-600 text-white border-amber-600"
                                                    : "bg-white text-gray-700 border-gray-200",
                                                isDisabled ? "opacity-50 cursor-not-allowed" : "hover:border-amber-300",
                                            ].join(" ")}
                                        >
                                            {label === "" ? "..." : label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
