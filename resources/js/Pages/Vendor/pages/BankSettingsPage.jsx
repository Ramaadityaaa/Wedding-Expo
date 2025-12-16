import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";
// IMPORT LAYOUT VENDOR
import VendorLayout from "@/Layouts/VendorLayout";

// --- KOMPONEN INPUT ---
const InputGroup = ({
    label,
    name,
    value,
    onChange,
    error,
    placeholder,
    type = "text",
}) => (
    <div className="mb-5">
        <label
            htmlFor={name}
            className="block text-sm font-semibold text-gray-700 mb-2"
        >
            {label}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-4 py-2 rounded-lg border transition-colors focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                ${
                    error
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-white"
                }`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

export default function BankSettingsPage({ auth, bankDetails }) {
    const { toast } = useToast();

    // State form
    const { data, setData, errors, processing, clearErrors } = useForm({
        bank_name: bankDetails.bank_name || "",
        account_number: bankDetails.account_number || "",
        account_holder_name: bankDetails.account_holder_name || "",
        qris_image: null,
    });

    const [previewUrl, setPreviewUrl] = useState(bankDetails.qris_url);

    // Handle Perubahan File Gambar
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("qris_image", file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        clearErrors();

        router.post(
            route("vendor.bank.update"),
            {
                _method: "patch",
                ...data,
            },
            {
                forceFormData: true,
                onSuccess: () => {
                    toast({
                        title: "Berhasil!",
                        description:
                            "Pengaturan rekening & QRIS berhasil disimpan.",
                        className: "bg-green-600 text-white",
                    });
                },
                onError: () => {
                    toast({
                        title: "Gagal",
                        description: "Periksa kembali inputan Anda.",
                        variant: "destructive",
                    });
                },
            }
        );
    };

    return (
        // BUNGKUS DENGAN VENDOR LAYOUT
        <VendorLayout user={auth.user}>
            <div className="min-h-screen bg-gray-50 p-6 pb-20">
                <Head title="Pengaturan Rekening & QRIS" />

                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Metode Pembayaran
                        </h1>
                        <p className="text-gray-500">
                            Atur rekening bank dan QRIS agar Customer mudah
                            membayar DP/Pelunasan.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {/* KOLOM KIRI: Form Text */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">
                                    Detail Rekening Bank
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputGroup
                                        label="Nama Bank"
                                        name="bank_name"
                                        value={data.bank_name}
                                        onChange={(e) =>
                                            setData("bank_name", e.target.value)
                                        }
                                        error={errors.bank_name}
                                        placeholder="Contoh: BCA, Mandiri"
                                    />
                                    <InputGroup
                                        label="Nomor Rekening"
                                        name="account_number"
                                        value={data.account_number}
                                        onChange={(e) =>
                                            setData(
                                                "account_number",
                                                e.target.value
                                            )
                                        }
                                        error={errors.account_number}
                                        type="number"
                                        placeholder="Contoh: 827xxxxxx"
                                    />
                                </div>
                                <InputGroup
                                    label="Atas Nama (Pemilik Rekening)"
                                    name="account_holder_name"
                                    value={data.account_holder_name}
                                    onChange={(e) =>
                                        setData(
                                            "account_holder_name",
                                            e.target.value
                                        )
                                    }
                                    error={errors.account_holder_name}
                                    placeholder="Nama sesuai buku tabungan"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-amber-600 text-white font-bold rounded-lg shadow-md hover:bg-amber-700 transition-all disabled:opacity-50 flex items-center"
                                >
                                    {processing
                                        ? "Menyimpan..."
                                        : "Simpan Perubahan"}
                                </button>
                            </div>
                        </div>

                        {/* KOLOM KANAN: Upload QRIS */}
                        <div className="md:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
                                <h2 className="text-lg font-bold text-gray-800 mb-2">
                                    Kode QRIS
                                </h2>
                                <p className="text-xs text-gray-500 mb-4">
                                    Upload gambar QRIS (dari Dana, ShopeePay,
                                    atau Bank) agar customer bisa scan.
                                </p>

                                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 relative hover:bg-amber-50 transition-colors">
                                    {previewUrl ? (
                                        <div className="relative w-full h-full flex flex-col items-center justify-center">
                                            <img
                                                src={previewUrl}
                                                alt="Preview QRIS"
                                                className="max-h-64 object-contain rounded-md shadow-sm mb-3"
                                            />
                                            <p className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full">
                                                {data.qris_image
                                                    ? "File Baru Terpilih"
                                                    : "QRIS Saat Ini"}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-12 w-12 mx-auto mb-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1}
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                            <span className="text-sm">
                                                Belum ada QRIS
                                            </span>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>

                                {errors.qris_image && (
                                    <p className="text-red-500 text-xs mt-2 text-center">
                                        {errors.qris_image}
                                    </p>
                                )}

                                <div className="mt-4 text-center">
                                    <span className="text-xs text-amber-600 font-semibold cursor-pointer hover:underline">
                                        {previewUrl
                                            ? "Ganti Gambar"
                                            : "Upload Gambar"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </VendorLayout>
    );
}
