import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useForm, Head } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";

// --- KONSTANTA ---
const PRIMARY_COLOR = "#D97706";
const SECONDARY_COLOR = "#FCD34D";
const ACCENT_CLASS = "text-amber-700";

// --- IKON SVG ---
const Icons = {
    Upload: ({ className, color = PRIMARY_COLOR }) => (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.5" /><path d="M12 12v9" /><path d="m8 17 4 4 4-4" />
        </svg>
    ),
    File: ({ className, color = PRIMARY_COLOR }) => (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
        </svg>
    ),
    Check: ({ color = "white" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-8.98" /><path d="M22 4L12 14.01l-3-3" />
        </svg>
    ),
    Copy: ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
    ),
    Loader: ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
};

const formatCurrency = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);
};

const HeaderCard = ({ title }) => (
    <div className="p-8 md:p-10 rounded-t-2xl text-white shadow-lg flex items-center justify-between bg-gradient-to-r from-amber-600 to-amber-400">
        <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-wide uppercase">
            {title}
        </h2>
        <Icons.Check color="white" />
    </div>
);

export default function UploadPaymentProofPage({
    amount = 0,
    orderId, // Pastikan dari Controller dikirim dengan nama 'orderId'
    total = 0,
    vendorBank = {},
}) {
    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        order_id: orderId || "", // Inisialisasi awal
        amount: amount || total,
        account_name: "",
        payment_proof: null,
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const { toast } = useToast();
    const fileInputRef = useRef(null);

    // FIX: Sinkronisasi order_id jika prop orderId berubah
    useEffect(() => {
        if (orderId) {
            setData("order_id", orderId);
        }
    }, [orderId]);

    const safeBank = {
        bank_name: vendorBank?.bank_name || "Bank Transfer",
        account_number: vendorBank?.account_number || "-",
        account_holder_name: vendorBank?.account_holder_name || "-",
        qris_url: vendorBank?.qris_url || null,
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const copyToClipboard = (text) => {
        if (!text || text === "-") return;
        navigator.clipboard.writeText(text);
        toast({
            title: "Berhasil disalin",
            description: "Nomor rekening telah disalin ke clipboard.",
            className: "bg-green-600 text-white border-none",
        });
    };

    const handleFileChange = useCallback((file) => {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setError("payment_proof", "Ukuran file maksimal adalah 5MB.");
            return;
        }
        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
            setError("payment_proof", "Format file harus JPG, PNG, atau PDF.");
            return;
        }
        clearErrors("payment_proof");
        setData("payment_proof", file);

        if (file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    }, [setData, setError, clearErrors]);

    const submit = (e) => {
        e.preventDefault();
        
        // DEBUG: Cek konsol browser untuk memastikan data ada sebelum dikirim
        console.log("Data yang akan dikirim:", data);

        post(route("customer.payment.proof.store"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast({ title: "Berhasil!", description: "Bukti pembayaran telah dikirim." });
            },
            onError: (err) => {
                console.error("Server Errors:", err); //
                toast({ 
                    variant: "destructive", 
                    title: "Gagal Mengirim", 
                    description: err.order_id || "Terjadi kesalahan validasi." 
                });
            }
        });
    };

    return (
        <div className="font-sans min-h-screen bg-gray-50 flex justify-center items-start pt-10 pb-20 px-4">
            <Head title="Konfirmasi Pembayaran" />

            <div className="max-w-5xl w-full">
                <div className="bg-white overflow-hidden shadow-2xl rounded-2xl border-b-8 border-amber-500">
                    <HeaderCard title="Konfirmasi Pembayaran" />

                    <form onSubmit={submit} className="p-6 md:p-12">
                        {/* Hidden Input untuk keamanan tambahan */}
                        <input type="hidden" value={data.order_id} name="order_id" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="md:col-span-1 space-y-6">
                                <h3 className={`text-xl font-bold border-b-2 pb-2 ${ACCENT_CLASS} border-amber-100`}>
                                    Informasi Rekening
                                </h3>
                                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 space-y-4 shadow-sm">
                                    <div>
                                        <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-1">Bank Tujuan</p>
                                        <p className="font-bold text-gray-900 text-lg">{safeBank.bank_name}</p>
                                    </div>
                                    <div className="pt-3 border-t border-amber-200">
                                        <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-1">Nomor Rekening</p>
                                        <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-amber-100">
                                            <span className="font-mono font-bold text-xl text-amber-800 tracking-tighter">
                                                {safeBank.account_number}
                                            </span>
                                            <button 
                                                type="button"
                                                onClick={() => copyToClipboard(safeBank.account_number)}
                                                className="p-2 hover:bg-amber-50 rounded-full transition-colors text-amber-600"
                                            >
                                                <Icons.Copy />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-amber-200">
                                        <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-1">Atas Nama</p>
                                        <p className="font-semibold text-gray-800">{safeBank.account_holder_name}</p>
                                    </div>
                                </div>

                                {safeBank.qris_url && (
                                    <div className="text-center p-4 bg-white border rounded-2xl shadow-sm">
                                        <p className="text-sm font-bold text-gray-600 mb-3">Atau Scan QRIS:</p>
                                        <img src={safeBank.qris_url} alt="QRIS" className="w-full max-w-[180px] mx-auto rounded-lg" />
                                    </div>
                                )}

                                <div className="p-6 bg-gray-900 rounded-2xl text-white">
                                    <p className="text-gray-400 text-sm mb-1">Total Tagihan:</p>
                                    <p className="text-3xl font-black text-amber-400">
                                        {formatCurrency(data.amount)}
                                    </p>
                                    {/* Tampilkan error order_id jika ada */}
                                    {errors.order_id && <p className="text-red-400 text-[10px] mt-2 uppercase tracking-widest">{errors.order_id}</p>}
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-8">
                                <h3 className={`text-xl font-bold border-b-2 pb-2 ${ACCENT_CLASS} border-amber-100`}>
                                    Detail Pengirim
                                </h3>

                                <div className="space-y-2">
                                    <label htmlFor="account_name" className="text-sm font-bold text-gray-700 ml-1">
                                        Nama Rekening Pengirim <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="account_name"
                                        type="text"
                                        required
                                        value={data.account_name}
                                        onChange={(e) => setData("account_name", e.target.value)}
                                        className={`w-full px-4 py-4 rounded-xl border-2 transition-all focus:ring-4 focus:ring-amber-500/10 outline-none
                                            ${errors.account_name ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-amber-500"}`}
                                        placeholder="Masukkan nama lengkap sesuai di ATM/M-Banking"
                                    />
                                    {errors.account_name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.account_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">
                                        Bukti Transfer (Gambar/PDF) <span className="text-red-500">*</span>
                                    </label>
                                    
                                    <div 
                                        onClick={() => fileInputRef.current.click()}
                                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
                                        }}
                                        className={`group relative border-4 border-dashed rounded-3xl p-8 transition-all cursor-pointer text-center
                                            ${data.payment_proof ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-amber-400 hover:bg-amber-50/30'}`}
                                    >
                                        <input 
                                            type="file" 
                                            ref={fileInputRef}
                                            className="hidden" 
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            onChange={(e) => handleFileChange(e.target.files[0])}
                                        />

                                        {previewUrl ? (
                                            <div className="space-y-4">
                                                <img src={previewUrl} alt="Preview" className="h-48 mx-auto rounded-lg shadow-md object-cover" />
                                                <p className="text-green-600 font-bold text-sm flex items-center justify-center">
                                                    <Icons.File className="w-4 h-4 mr-2" color="#16a34a" /> File siap diunggah
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 py-4">
                                                <Icons.Upload className="w-16 h-16 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                                <div>
                                                    <p className="text-lg font-bold text-gray-700">Klik untuk unggah atau seret file</p>
                                                    <p className="text-sm text-gray-500">JPG, PNG, atau PDF (Maks. 5MB)</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {errors.payment_proof && <p className="text-red-500 text-xs mt-1 font-medium">{errors.payment_proof}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !data.payment_proof || !data.account_name}
                                    className="w-full relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div 
                                        className="absolute inset-0 w-full h-full transition-all duration-300 group-hover:scale-105"
                                        style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 100%)` }}
                                    ></div>
                                    <div className="relative py-5 px-6 flex items-center justify-center text-white font-black text-xl tracking-wide">
                                        {processing ? (
                                            <>
                                                <Icons.Loader className="animate-spin h-6 w-6 mr-3" />
                                                Sedang Mengirim...
                                            </>
                                        ) : (
                                            "KIRIM KONFIRMASI"
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}