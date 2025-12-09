import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import {
    Plus,
    Edit,
    Trash2,
    X,
    Check,
    Package,
    DollarSign,
} from "lucide-react";

export default function PackagePage({ auth, packages }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null); // Jika null = Mode Tambah

    // State form
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: "",
        price: "",
        description: "",
        featuresText: "", // Helper untuk input fitur (dipisah baris baru)
    });

    // Buka Modal (Mode Tambah / Edit)
    const openModal = (pkg = null) => {
        if (pkg) {
            setEditingPackage(pkg);
            setData({
                name: pkg.name,
                price: pkg.price,
                description: pkg.description || "",
                featuresText: pkg.features ? pkg.features.join("\n") : "",
            });
        } else {
            setEditingPackage(null);
            reset();
        }
        setIsModalOpen(true);
    };

    // Handle Submit
    const handleSubmit = (e) => {
        e.preventDefault();

        // Konversi text area ke array features
        const featuresArray = data.featuresText
            .split("\n")
            .map((f) => f.trim())
            .filter((f) => f !== "");

        const payload = { ...data, features: featuresArray };

        if (editingPackage) {
            put(route("vendor.packages.update", editingPackage.id), {
                ...payload,
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post(route("vendor.packages.store"), {
                ...payload,
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("Yakin ingin menghapus paket ini?")) {
            router.delete(route("vendor.packages.destroy", id));
        }
    };

    return (
        <VendorLayout user={auth.user} header="Manajemen Paket Jasa">
            <Head title="Paket Jasa Vendor" />

            <div className="py-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Daftar Paket Jasa
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Buat pilihan paket yang menarik untuk klien Anda.
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md transition"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Buat Paket Baru
                    </button>
                </div>

                {/* --- GRID PAKET --- */}
                {packages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
                                            <Package size={24} />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openModal(pkg)}
                                                className="text-gray-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50 transition"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(pkg.id)
                                                }
                                                className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {pkg.name}
                                    </h3>
                                    <p className="text-2xl font-bold text-amber-600 mb-4 font-mono">
                                        Rp{" "}
                                        {Number(pkg.price).toLocaleString(
                                            "id-ID"
                                        )}
                                    </p>

                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                        {pkg.description ||
                                            "Tidak ada deskripsi."}
                                    </p>

                                    {/* List Fitur */}
                                    <div className="space-y-2 mb-6">
                                        {pkg.features &&
                                            pkg.features
                                                .slice(0, 4)
                                                .map((feat, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-start text-sm text-gray-600"
                                                    >
                                                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                                                        <span>{feat}</span>
                                                    </div>
                                                ))}
                                        {pkg.features &&
                                            pkg.features.length > 4 && (
                                                <p className="text-xs text-gray-400 italic">
                                                    + {pkg.features.length - 4}{" "}
                                                    fitur lainnya
                                                </p>
                                            )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">
                            Belum ada paket
                        </h3>
                        <p className="text-gray-500">
                            Mulai tawarkan jasa Anda dengan membuat paket
                            pertama.
                        </p>
                    </div>
                )}
            </div>

            {/* --- MODAL FORM --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingPackage
                                    ? "Edit Paket"
                                    : "Buat Paket Baru"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Paket
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                                    placeholder="Contoh: Paket Dekorasi Mewah"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Harga (Rp)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 text-sm font-bold">
                                            Rp
                                        </span>
                                    </div>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData("price", e.target.value)
                                        }
                                        className="w-full pl-10 rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                {errors.price && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                                    rows="2"
                                    placeholder="Penjelasan singkat..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Daftar Fitur{" "}
                                    <span className="text-gray-400 font-normal">
                                        (Pisahkan dengan baris baru / Enter)
                                    </span>
                                </label>
                                <textarea
                                    value={data.featuresText}
                                    onChange={(e) =>
                                        setData("featuresText", e.target.value)
                                    }
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
                                    rows="5"
                                    placeholder="Contoh:&#10;Dekorasi Pelaminan 6m&#10;Lighting Set&#10;Kursi Tiffany 50pcs"
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-md transition disabled:opacity-50"
                                >
                                    {processing
                                        ? "Menyimpan..."
                                        : editingPackage
                                        ? "Update Paket"
                                        : "Simpan Paket"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </VendorLayout>
    );
}
