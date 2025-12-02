import React, { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Loader2, X } from "lucide-react";

export default function PaymentSettings({ paymentSettings = {} }) {
    const { auth } = usePage().props;

    // State Tampilan (Preview)
    const [settings, setSettings] = useState({
        bankAccount:
            paymentSettings.bankAccount || "123456789 - Bank BCA (Contoh)",
        qrisImage: paymentSettings.qrisImage || null,
    });

    // State untuk File Asli (untuk diupload ke server)
    const [qrisFile, setQrisFile] = useState(null);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({ bankNumber: "", bankName: "" });
    const [isProcessing, setIsProcessing] = useState(false);

    // --- HANDLERS ---

    const handleOpenEdit = () => {
        // Memecah string "NoRek - NamaBank" agar masuk ke form input terpisah
        const separator = " - ";
        const parts = settings.bankAccount.split(separator);

        // Fallback jika format tidak sesuai
        setEditForm({
            bankNumber: parts[0] || "",
            bankName: parts.length > 1 ? parts.slice(1).join(separator) : "",
        });
        setIsEditOpen(true);
    };

    const handleSaveModal = () => {
        // Gabungkan kembali untuk tampilan preview
        const combined = `${editForm.bankNumber} - ${editForm.bankName}`;
        setSettings((prev) => ({ ...prev, bankAccount: combined }));
        setIsEditOpen(false);
    };

    const handleQrisUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setQrisFile(file); // Simpan file objek asli untuk dikirim ke server

            // Buat preview lokal untuk UX
            const reader = new FileReader();
            reader.onloadend = () => {
                setSettings((prev) => ({ ...prev, qrisImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClearQris = () => {
        setQrisFile(null); // Hapus file upload
        setSettings((prev) => ({ ...prev, qrisImage: null }));
    };

    const handleSaveToServer = () => {
        if (!confirm("Simpan perubahan pengaturan pembayaran?")) return;

        // Persiapkan data untuk dikirim ke Backend
        // Kita harus memecah string akun kembali karena Controller mengharapkan 'bankNumber' dan 'bankName'
        const separator = " - ";
        const parts = settings.bankAccount.split(separator);
        const bankNumber = parts[0] || "";
        const bankName = parts.length > 1 ? parts.slice(1).join(separator) : "";

        const formData = {
            bankNumber: bankNumber,
            bankName: bankName,
            // Kirim file hanya jika ada file baru yang dipilih
            ...(qrisFile ? { qrisImage: qrisFile } : {}),
        };

        router.post(route("admin.payment-settings.update"), formData, {
            forceFormData: true, // Penting untuk upload file
            onStart: () => setIsProcessing(true),
            onFinish: () => setIsProcessing(false),
            onSuccess: () => {
                setQrisFile(null); // Reset input file setelah sukses
                // Tidak perlu alert manual, Flash Message dari Layout akan muncul otomatis
            },
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout user={auth?.user} header="Payment Settings">
            <Head title="Pengaturan Pembayaran" />

            <div className="p-4 sm:p-6 max-w-full mx-auto font-sans">
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                        Payment / Invoice Settings
                    </h1>
                    <p className="text-gray-500">
                        Atur nomor rekening dan QRIS yang akan muncul di invoice
                        vendor.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* KARTU 1: NOMOR REKENING */}
                    <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>

                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-amber-700">
                                        Nomor Rekening
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Rekening tujuan transfer manual.
                                    </p>
                                </div>
                                <div className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-lg">
                                    Default
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                                    Rekening Aktif
                                </p>
                                <p className="text-lg font-mono font-medium text-gray-800 break-all">
                                    {settings.bankAccount || (
                                        <span className="italic text-gray-400">
                                            Belum diatur
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={handleOpenEdit}
                                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-md hover:shadow-lg hover:from-amber-600 hover:to-orange-600 transition transform hover:-translate-y-0.5"
                                >
                                    Edit Rekening
                                </button>
                                <button
                                    onClick={() =>
                                        setSettings((prev) => ({
                                            ...prev,
                                            bankAccount: "",
                                        }))
                                    }
                                    className="py-2.5 px-4 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 font-medium transition"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* KARTU 2: QRIS */}
                    <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>

                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-amber-700">
                                        QRIS Code
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Scan untuk pembayaran instan.
                                    </p>
                                </div>
                                <div className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-lg">
                                    Image
                                </div>
                            </div>

                            <div className="flex gap-4">
                                {/* Preview Image */}
                                <div className="w-32 h-32 flex-shrink-0 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
                                    {settings.qrisImage ? (
                                        <>
                                            <img
                                                src={settings.qrisImage}
                                                alt="QRIS"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                <button
                                                    onClick={handleClearQris}
                                                    className="text-white hover:text-red-400"
                                                >
                                                    <X />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-gray-400 text-xs text-center px-2">
                                            No QRIS
                                        </span>
                                    )}
                                </div>

                                {/* Upload Controls */}
                                <div className="flex-1 flex flex-col justify-center space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Upload Baru
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleQrisUpload}
                                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-amber-50 file:text-amber-700
                                hover:file:bg-amber-100 cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Format: JPG, PNG (Max 2MB)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TOMBOL SIMPAN GLOBAL */}
                <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                    <button
                        onClick={handleSaveToServer}
                        disabled={isProcessing}
                        className="py-3 px-8 rounded-full font-bold text-white bg-gradient-to-r from-gray-800 to-black shadow-lg hover:shadow-xl hover:bg-gray-700 transition transform hover:-translate-y-0.5 disabled:opacity-70 flex items-center"
                    >
                        {isProcessing && (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        )}
                        Simpan Semua Pengaturan
                    </button>
                </div>

                {/* MODAL EDIT REKENING */}
                {isEditOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Edit Rekening
                                </h3>
                                <button
                                    onClick={() => setIsEditOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nomor Rekening
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                                        value={editForm.bankNumber}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                bankNumber: e.target.value,
                                            })
                                        }
                                        placeholder="Contoh: 1234567890"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Bank / Pemilik
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                                        value={editForm.bankName}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                bankName: e.target.value,
                                            })
                                        }
                                        placeholder="Contoh: Bank BCA a.n Admin"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setIsEditOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSaveModal}
                                    className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold shadow-md transition"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
