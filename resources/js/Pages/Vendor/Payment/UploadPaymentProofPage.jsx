import React, { useState, useCallback, useRef, useEffect } from "react";
import { useForm, Head } from "@inertiajs/react";

// --- Ikon Components (Tetap) ---
const UploadCloudIcon = ({ className = "w-10 h-10", color = "#D97706" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.5" /><path d="M12 12v9" /><path d="m8 17 4 4 4-4" />
    </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
);

export default function UploadPaymentProofPage({ invoiceId, amount, vendorBank }) {
    // 1. Inisialisasi Form - KUNCI: Gunakan invoice_id (snake_case)
    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        invoice_id: invoiceId || "", 
        account_name: "", 
        payment_proof: null,
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    // Sinkronisasi jika props berubah
    useEffect(() => {
        if (invoiceId) setData("invoice_id", invoiceId);
    }, [invoiceId]);

    // Cleanup preview URL
    useEffect(() => {
        return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
    }, [previewUrl]);

    const handleFileChange = useCallback((file) => {
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError("payment_proof", "Ukuran file terlalu besar (Maks 5MB).");
            return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
            setError("payment_proof", "Format file harus JPG, PNG, atau PDF.");
            return;
        }

        clearErrors("payment_proof");
        setSelectedFile(file);
        setData("payment_proof", file);

        if (file.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        } else {
            setPreviewUrl(null); 
        }
    }, [setData, setError, clearErrors]);

    const submit = (e) => {
        e.preventDefault();
        if (processing) return;

        post(route("vendor.payment.proof.store"), {
            forceFormData: true, 
            preserveScroll: true,
            onSuccess: () => alert("Bukti pembayaran berhasil diunggah! Menunggu verifikasi admin."),
        });
    };

    const copyToClipboard = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        alert("Nomor rekening berhasil disalin.");
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title="Konfirmasi Pembayaran" />
            
            <div className="max-w-4xl mx-auto px-4 py-10">
                <header className="mb-8 text-center md:text-left">
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
                        Konfirmasi Pembayaran
                    </h1>
                    <p className="text-gray-500">Silakan selesaikan pembayaran dan unggah bukti transfer.</p>
                </header>

                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* INFO REKENING */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xs font-bold text-amber-600 uppercase mb-4">Rekening Tujuan</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Bank</p>
                                    <p className="text-lg font-bold text-gray-800">{vendorBank?.bank_name || "BCA"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Nomor Rekening</p>
                                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-dashed border-gray-300">
                                        <span className="font-mono text-lg font-bold text-gray-900">{vendorBank?.account_number || "123-456-7890"}</span>
                                        <button type="button" onClick={() => copyToClipboard(vendorBank?.account_number)} className="text-amber-600"><CopyIcon /></button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Atas Nama</p>
                                    <p className="font-bold text-gray-800 uppercase">{vendorBank?.account_holder_name || "WEDDING EXPO ADMIN"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-600 p-6 rounded-2xl shadow-lg text-white">
                            <p className="text-sm opacity-80 mb-1">Total Transfer:</p>
                            <p className="text-3xl font-black">Rp {new Intl.NumberFormat("id-ID").format(amount)}</p> 
                        </div>
                    </div>

                    {/* FORM UPLOAD */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xs font-bold text-blue-600 uppercase mb-6">Detail Pengirim</h3>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Nama Pemilik Rekening (Anda)</label>
                                <input 
                                    type="text"
                                    value={data.account_name}
                                    onChange={(e) => setData("account_name", e.target.value)}
                                    className={`w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-amber-500 ${errors.account_name ? 'border-red-500' : ''}`}
                                    placeholder="Nama sesuai di struk/m-banking"
                                />
                                {errors.account_name && <p className="text-red-500 text-xs mt-1">{errors.account_name}</p>}
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Unggah Bukti</label>
                                <div 
                                    onClick={() => fileInputRef.current.click()}
                                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'} ${errors.payment_proof ? 'border-red-400 bg-red-50' : ''}`}
                                >
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileChange(e.target.files[0])} accept="image/*,application/pdf" />
                                    
                                    {previewUrl ? (
                                        <img src={previewUrl} className="h-32 mx-auto rounded-lg object-contain" />
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <UploadCloudIcon className="mb-2" />
                                            <p className="text-sm font-bold">{selectedFile ? selectedFile.name : "Pilih Gambar / PDF"}</p>
                                        </div>
                                    )}
                                </div>
                                {errors.payment_proof && <p className="text-red-500 text-xs mt-1">{errors.payment_proof}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 rounded-xl text-white font-black bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 transition-all uppercase tracking-widest"
                            >
                                {processing ? "Mengirim..." : "Konfirmasi Pembayaran"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}