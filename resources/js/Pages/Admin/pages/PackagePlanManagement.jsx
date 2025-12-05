import React, { useState } from "react";
// >>> PERBAIKAN IMPORT <<<
// Tambahkan useForm ke dalam destructuring import dari @inertiajs/react
import { Head, router, usePage, useForm } from "@inertiajs/react";
// >>> AKHIR PERBAIKAN IMPORT <<<

import AdminLayout from "@/Layouts/AdminLayout";
// >>> PERBAIKAN: Tambahkan Star di sini <<<
import {
    Plus,
    Edit,
    Trash2,
    Check,
    X,
    Loader2,
    DollarSign,
    Package,
    Star,
} from "lucide-react";

const PRIMARY_COLOR = "bg-amber-500";
const ACCENT_COLOR = "text-amber-600";

const PlanModal = ({ plan, onClose, isSaving, onSubmit }) => {
    // --- TAMBAHAN: Daftar opsi Kategori ---
    const CATEGORIES = [
        { value: "BASIC", label: "Basic" },
        { value: "STANDARD", label: "Standard" },
        { value: "ULTIMA", label: "Ultima" },
        { value: "CUSTOM", label: "Custom" },
    ];

    // useForm SEKARANG BERFUNGSI karena sudah diimpor di bagian atas file
    const { data, setData, errors } = useForm({
        id: plan?.id || null,
        name: plan?.name || "",
        price: plan?.price || 0,
        duration_days: plan?.duration_days || 30,

        // >>> KOLOM BARU DARI MIGRASI <<<
        category: plan?.category || "STANDARD", // Default ke STANDARD
        is_popular: plan?.is_popular ?? false, // Default false
        // >>> AKHIR KOLOM BARU <<<

        features: plan?.features?.join("\n") || "",
        is_active: plan?.is_active ?? true,
    });

    // Convert text features back to array on form data change
    const submitHandler = (e) => {
        e.preventDefault();
        // Pastikan fitur dikirim sebagai array string yang bersih
        const featuresArray = data.features
            .split("\n")
            .map((f) => f.trim())
            .filter((f) => f.length > 0);

        // Menggunakan Inertia post untuk update/store
        router.post(
            route("admin.package-plans.store-update"),
            {
                ...data,
                features: featuresArray, // Kirim sebagai array
            },
            {
                onSuccess: () => {
                    onClose();
                },
                onError: (err) => {
                    console.error("Validation Error:", err);
                },
                onFinish: () => {
                    // state isSaving akan diurus oleh Parent Component jika perlu
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800">
                        {plan ? "Edit Paket" : "Tambah Paket Baru"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={submitHandler}>
                    <div className="p-6 space-y-4">
                        {/* Name and Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nama Paket
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="mt-1 w-full rounded-lg border-gray-300"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Harga (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData("price", e.target.value)
                                    }
                                    className="mt-1 w-full rounded-lg border-gray-300"
                                    required
                                />
                                {errors.price && (
                                    <p className="text-xs text-red-500">
                                        {errors.price}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* >>> KOLOM BARU: KATEGORI & POPULER <<< */}
                        <div className="grid grid-cols-3 gap-4 border-t pt-4 border-gray-100">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Jenis Kategori
                                </label>
                                <select
                                    value={data.category}
                                    onChange={(e) =>
                                        setData("category", e.target.value)
                                    }
                                    className="mt-1 w-full rounded-lg border-gray-300"
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option
                                            key={cat.value}
                                            value={cat.value}
                                        >
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="text-xs text-red-500">
                                        {errors.category}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center pt-5">
                                <input
                                    type="checkbox"
                                    id="is_popular"
                                    checked={data.is_popular}
                                    onChange={(e) =>
                                        setData("is_popular", e.target.checked)
                                    }
                                    className="rounded text-pink-600 border-gray-300 shadow-sm focus:ring-pink-500"
                                />
                                <label
                                    htmlFor="is_popular"
                                    className="ml-2 text-sm font-medium text-gray-700 flex items-center"
                                >
                                    <Star
                                        size={16}
                                        className="mr-1 text-yellow-500"
                                    />{" "}
                                    Populer
                                </label>
                                {errors.is_popular && (
                                    <p className="text-xs text-red-500">
                                        {errors.is_popular}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* >>> AKHIR KOLOM BARU <<< */}

                        {/* Duration and Status */}
                        <div className="grid grid-cols-2 gap-4 border-t pt-4 border-gray-100">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Durasi (Hari)
                                </label>
                                <input
                                    type="number"
                                    value={data.duration_days}
                                    onChange={(e) =>
                                        setData("duration_days", e.target.value)
                                    }
                                    className="mt-1 w-full rounded-lg border-gray-300"
                                    required
                                />
                                {errors.duration_days && (
                                    <p className="text-xs text-red-500">
                                        {errors.duration_days}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center pt-5">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData("is_active", e.target.checked)
                                    }
                                    className="rounded text-amber-600 border-gray-300 shadow-sm focus:ring-amber-500"
                                />
                                <label
                                    htmlFor="is_active"
                                    className="ml-2 text-sm font-medium text-gray-700"
                                >
                                    Aktif
                                </label>
                            </div>
                        </div>

                        {/* Features */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Fitur (Pisahkan dengan baris baru)
                            </label>
                            <textarea
                                rows="6"
                                value={data.features}
                                onChange={(e) =>
                                    setData("features", e.target.value)
                                }
                                className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-amber-500"
                            />
                            {errors.features && (
                                <p className="text-xs text-red-500">
                                    {errors.features}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={router.processing || isSaving}
                            className={`px-6 py-2 rounded-lg text-white font-semibold ${PRIMARY_COLOR} hover:opacity-90 transition flex items-center`}
                        >
                            {(router.processing || isSaving) && (
                                <Loader2
                                    size={16}
                                    className="animate-spin mr-2"
                                />
                            )}
                            Simpan Paket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Bagian ini dihapus karena useForm sudah diimport di atas
// const useForm = router.useForm;

export default function PackagePlanManagement({ plans = [] }) {
    const { auth } = usePage().props;
    const [modalPlan, setModalPlan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false); // Untuk tombol delete

    // Helper untuk menampilkan harga yang sudah di-format dari backend
    const formatCurrency = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    const openModal = (plan = null) => {
        setModalPlan(plan);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (
            confirm(
                "Apakah Anda yakin ingin menghapus paket ini secara permanen?"
            )
        ) {
            router.delete(route("admin.package-plans.destroy", id), {
                onStart: () => setIsSaving(true),
                onFinish: () => setIsSaving(false),
            });
        }
    };

    return (
        <AdminLayout user={auth?.user} header="Manajemen Paket Membership">
            <Head title="Kelola Paket" />

            <div className="p-4 sm:p-6 max-w-full mx-auto font-sans">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-800">
                            Manajemen Paket Membership
                        </h1>
                        <p className="text-gray-500">
                            Kelola harga dan fitur paket berlangganan Vendor.
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className={`flex items-center px-6 py-3 rounded-xl text-white font-semibold shadow-lg ${PRIMARY_COLOR} hover:bg-amber-600 transition`}
                    >
                        <Plus size={20} className="mr-2" /> Tambah Paket
                    </button>
                </div>

                {/* Daftar Paket */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`bg-white rounded-2xl shadow-xl border-t-8 p-6 flex flex-col justify-between relative 
                                ${
                                    plan.is_popular
                                        ? "border-pink-500 ring-2 ring-pink-200"
                                        : "border-amber-500"
                                }`}
                        >
                            {plan.is_popular && (
                                <div className="absolute top-0 right-0 px-3 py-1 bg-pink-500 text-white text-xs font-bold uppercase rounded-bl-lg">
                                    Populer
                                </div>
                            )}

                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1 flex items-center">
                                    <Package
                                        size={20}
                                        className={`mr-2 ${ACCENT_COLOR}`}
                                    />
                                    {plan.name}
                                </h3>
                                <p className="text-sm font-mono text-gray-600 mb-4">
                                    {plan.duration_days === 0
                                        ? "Gratis"
                                        : `${plan.duration_days} Hari`}
                                </p>

                                <p
                                    className={`text-4xl font-extrabold mb-1 ${ACCENT_COLOR}`}
                                >
                                    {plan.formatted_price ||
                                        formatCurrency(plan.price)}
                                </p>
                                <p className="text-xs text-gray-500 mb-4 font-semibold uppercase tracking-wider">
                                    Kategori:{" "}
                                    <span className="font-bold text-gray-700">
                                        {plan.category}
                                    </span>
                                </p>

                                <ul className="space-y-2 text-sm text-gray-700 list-none">
                                    {plan.features.map((feature, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start"
                                        >
                                            <Check
                                                size={16}
                                                className={`mr-2 flex-shrink-0 ${ACCENT_COLOR}`}
                                            />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100 flex space-x-3 justify-end">
                                <button
                                    onClick={() => openModal(plan)}
                                    className={`p-2 rounded-full ${ACCENT_COLOR} hover:bg-amber-50 transition`}
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(plan.id)}
                                    className="p-2 rounded-full text-red-600 hover:bg-red-50 transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Tambah/Edit */}
            {isModalOpen && (
                <PlanModal
                    plan={modalPlan}
                    onClose={() => setIsModalOpen(false)}
                    isSaving={isSaving}
                    onSubmit={() => {
                        /* Handled by internal form */
                    }}
                />
            )}
        </AdminLayout>
    );
}
