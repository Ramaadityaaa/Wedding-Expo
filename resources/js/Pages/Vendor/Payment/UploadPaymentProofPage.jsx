import React, { useState, useCallback, useRef, useEffect } from "react";
import { useForm, Head } from "@inertiajs/react";

// --- KOMPONEN IKON ---
const UploadCloudIcon = ({ className = "w-12 h-12", color = "#D97706" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.5" />
        <path d="M12 12v9" />
        <path d="m8 17 4 4 4-4" />
    </svg>
);

const FileIcon = ({ className = "w-12 h-12", color = "#D97706" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);

const CopyIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);

const CheckIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

// --- KOMPONEN UTAMA ---
export default function UploadPaymentProofPage({
    invoiceId,
    amount,
    vendorBank,
}) {
    // 1. Inisialisasi Form
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            invoice_id: invoiceId || "",
            account_name: "",
            payment_proof: null,
        });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef(null);

    // Format Rupiah
    const formatRupiah = (number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);

    // Sinkronisasi invoiceId
    useEffect(() => {
        if (invoiceId) setData("invoice_id", invoiceId);
    }, [invoiceId]);

    // Cleanup URL preview
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // Handle Copy Rekening
    const copyToClipboard = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Handle File Upload & Validasi
    const handleFileChange = useCallback(
        (file) => {
            if (!file) return;

            // Validasi Ukuran (Maks 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError(
                    "payment_proof",
                    "Ukuran file terlalu besar (Maks 5MB)."
                );
                return;
            }

            // Validasi Tipe File
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "application/pdf",
            ];
            if (!allowedTypes.includes(file.type)) {
                setError(
                    "payment_proof",
                    "Format file harus JPG, PNG, atau PDF."
                );
                return;
            }

            clearErrors("payment_proof");
            setSelectedFile(file);
            setData("payment_proof", file);

            // Preview Logic
            if (file.type.startsWith("image/")) {
                const objectUrl = URL.createObjectURL(file);
                setPreviewUrl(objectUrl);
            } else {
                setPreviewUrl(null); // PDF tidak ada preview gambar
            }
        },
        [setData, setError, clearErrors]
    );

    // Handle Drag & Drop
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFileChange(file);
    };

    const submit = (e) => {
        e.preventDefault();
        if (processing) return;

        post(route("vendor.payment.proof.store"), {
            forceFormData: true,
            preserveScroll: true,
            // onError otomatis ditangani oleh Inertia (ditampilkan di UI)
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col justify-center py-10 sm:px-6 lg:px-8">
            <Head title="Konfirmasi Pembayaran" />

            <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Konfirmasi Pembayaran
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Langkah terakhir untuk mengaktifkan membership Anda.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-5xl">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border-t-8 border-amber-500">
                    <form
                        onSubmit={submit}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-10"
                    >
                        {/* KOLOM KIRI: INFO REKENING */}
                        <div className="space-y-6 lg:border-r lg:pr-10 lg:border-gray-100">
                            <div>
                                <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4 flex items-center">
                                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded mr-2">
                                        1
                                    </span>
                                    Transfer ke Rekening Admin
                                </h3>

                                {/* Kartu Rekening */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-amber-200 rounded-full opacity-20 blur-xl"></div>

                                    <div className="space-y-4 relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                Bank Tujuan
                                            </p>
                                            <p className="text-2xl font-bold text-gray-800">
                                                {vendorBank?.bank_name ||
                                                    "BANK"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                                Nomor Rekening
                                            </p>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-mono text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                                                    {vendorBank?.account_number ||
                                                        "---"}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            vendorBank?.account_number
                                                        )
                                                    }
                                                    className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition focus:outline-none"
                                                    title="Salin No. Rekening"
                                                >
                                                    {copied ? (
                                                        <span className="text-green-600">
                                                            <CheckIcon />
                                                        </span>
                                                    ) : (
                                                        <CopyIcon />
                                                    )}
                                                </button>
                                            </div>
                                            {copied && (
                                                <span className="text-xs text-green-600 font-medium">
                                                    Berhasil disalin!
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                Atas Nama
                                            </p>
                                            <p className="text-base font-semibold text-gray-700">
                                                {vendorBank?.account_holder_name ||
                                                    "ADMIN"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Total Nominal */}
                            <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-amber-800">
                                        Total Nominal Transfer
                                    </p>
                                    <p className="text-xs text-amber-600 mt-1">
                                        *Pastikan nominal sesuai hingga 3 digit
                                        terakhir
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-amber-600">
                                        {formatRupiah(amount)}
                                    </p>
                                </div>
                            </div>

                            {/* QRIS (Optional) */}
                            {vendorBank?.qris_url && (
                                <div className="mt-4 text-center">
                                    <p className="text-sm font-semibold text-gray-500 mb-2">
                                        Atau Scan QRIS
                                    </p>
                                    <div className="inline-block p-2 bg-white border rounded-lg shadow-sm">
                                        <img
                                            src={vendorBank.qris_url}
                                            alt="QRIS"
                                            className="w-32 h-32 object-contain"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* KOLOM KANAN: FORM UPLOAD */}
                        <div className="space-y-6">
                            <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4 flex items-center">
                                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded mr-2">
                                    2
                                </span>
                                Konfirmasi & Upload Bukti
                            </h3>

                            <div className="space-y-5">
                                {/* Input Nama */}
                                <div>
                                    <label
                                        htmlFor="account_name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Nama Pemilik Rekening (Pengirim)
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="account_name"
                                            id="account_name"
                                            value={data.account_name}
                                            onChange={(e) =>
                                                setData(
                                                    "account_name",
                                                    e.target.value
                                                )
                                            }
                                            className={`shadow-sm focus:ring-amber-500 focus:border-amber-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4 ${
                                                errors.account_name
                                                    ? "border-red-500 ring-1 ring-red-500"
                                                    : ""
                                            }`}
                                            placeholder="Contoh: Budi Santoso"
                                        />
                                        {errors.account_name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.account_name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Upload Area */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bukti Transfer
                                    </label>
                                    <div
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleDrop}
                                        onClick={() =>
                                            fileInputRef.current.click()
                                        }
                                        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 
                                            ${
                                                selectedFile
                                                    ? "border-green-400 bg-green-50"
                                                    : "border-gray-300 hover:border-amber-400 hover:bg-gray-50"
                                            }
                                            ${
                                                errors.payment_proof
                                                    ? "border-red-500 bg-red-50"
                                                    : ""
                                            }
                                        `}
                                    >
                                        <div className="space-y-1 text-center">
                                            {previewUrl ? (
                                                <div className="relative">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Preview"
                                                        className="mx-auto h-48 object-contain rounded-md shadow-sm"
                                                    />
                                                    <p className="text-xs text-green-600 mt-2 font-semibold">
                                                        Klik untuk ganti gambar
                                                    </p>
                                                </div>
                                            ) : selectedFile &&
                                              selectedFile.type ===
                                                  "application/pdf" ? (
                                                <div className="flex flex-col items-center justify-center h-48">
                                                    <FileIcon className="w-16 h-16 text-red-500 mb-2" />
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {selectedFile.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        File PDF Siap Diunggah
                                                    </p>
                                                    <p className="text-xs text-green-600 mt-2 font-semibold">
                                                        Klik untuk ganti file
                                                    </p>
                                                </div>
                                            ) : (
                                                <>
                                                    <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600 justify-center mt-2">
                                                        <span className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500">
                                                            <span>
                                                                Upload file
                                                            </span>
                                                        </span>
                                                        <p className="pl-1">
                                                            atau drag and drop
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG, PDF (Maks.
                                                        5MB)
                                                    </p>
                                                </>
                                            )}

                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                ref={fileInputRef}
                                                accept="image/png, image/jpeg, application/pdf"
                                                onChange={(e) =>
                                                    handleFileChange(
                                                        e.target.files[0]
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    {errors.payment_proof && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.payment_proof}
                                        </p>
                                    )}
                                </div>

                                {/* Tombol Submit */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            !selectedFile ||
                                            !data.account_name
                                        }
                                        className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white uppercase tracking-widest 
                                            ${
                                                processing ||
                                                !selectedFile ||
                                                !data.account_name
                                                    ? "bg-gray-300 cursor-not-allowed"
                                                    : "bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-amber-200"
                                            } transition-all duration-200`}
                                    >
                                        {processing ? (
                                            <span className="flex items-center">
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Mengirim Data...
                                            </span>
                                        ) : (
                                            "Konfirmasi Pembayaran"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
