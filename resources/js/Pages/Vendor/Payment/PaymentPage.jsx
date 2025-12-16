import React, { useState, useCallback, useMemo, useRef } from "react";
import { useForm, Head } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";

const PRIMARY_COLOR = "#D97706";
const SECONDARY_COLOR = "#FCD34D";
const ACCENT_CLASS = "text-amber-700";

// --- IKON SVG ---
const UploadCloudIcon = ({
    className = "w-10 h-10",
    color = PRIMARY_COLOR,
}) => (
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

const FileTextIcon = ({ className = "w-5 h-5", color = PRIMARY_COLOR }) => (
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
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
    </svg>
);

const LargeCheckIcon = ({ color = "white" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-8.98" />
        <path d="M22 4L12 14.01l-3-3" />
    </svg>
);

const Loader2 = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        <path d="M16.999 16.999 12 12" opacity="0.5" />
    </svg>
);

const CopyIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);

// Helper Format Rupiah
const formatCurrency = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

const PaymentHeaderCard = ({ title }) => (
    <div className="p-8 md:p-10 rounded-t-2xl text-white shadow-lg flex items-center justify-between bg-gradient-to-r from-amber-600 to-amber-400">
        <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-wide">
            {title}
        </h2>
        <LargeCheckIcon color="white" />
    </div>
);

// --- KOMPONEN UTAMA ---
export default function UploadPaymentProofPage({
    auth,
    amount,
    orderId,
    total,
    // FIX: Berikan nilai default objek kosong agar tidak error undefined
    vendorBank = {},
}) {
    // FIX: Buat fallback data jika vendorBank masih kosong
    const safeBank = {
        bank_name: vendorBank?.bank_name || "Memuat...",
        account_number: vendorBank?.account_number || "-",
        account_holder_name: vendorBank?.account_holder_name || "-",
        qris_url: vendorBank?.qris_url || null,
    };

    // Inisialisasi form
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            order_id: orderId,
            amount: amount || total || 0,
            account_name: "",
            payment_proof: null,
        });

    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const { toast } = useToast();

    // Fungsi Copy to Clipboard
    const copyToClipboard = (text) => {
        if (text === "-" || !text) return;
        navigator.clipboard.writeText(text);
        toast({
            title: "Disalin!",
            description: "Nomor rekening berhasil disalin.",
            className: "bg-green-600 text-white border-none",
        });
    };

    // Validasi File
    const handleFileChange = useCallback(
        (file) => {
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    setError("payment_proof", "Ukuran file melebihi 5MB.");
                    setSelectedFile(null);
                    setData("payment_proof", null);
                    return;
                }
                if (
                    !["image/jpeg", "image/png", "application/pdf"].includes(
                        file.type
                    )
                ) {
                    setError(
                        "payment_proof",
                        "Hanya format JPG, PNG, atau PDF yang diizinkan."
                    );
                    setSelectedFile(null);
                    setData("payment_proof", null);
                    return;
                }

                clearErrors("payment_proof");
                setSelectedFile(file);
                setData("payment_proof", file);
            }
        },
        [setData, setError, clearErrors]
    );

    // Drag & Drop
    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                handleFileChange(files[0]);
            }
        },
        [handleFileChange]
    );

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // --- FUNGSI SUBMIT ---
    const submit = (e) => {
        e.preventDefault();

        if (!data.account_name) {
            setError("account_name", "Nama rekening pengirim wajib diisi.");
            return;
        }

        if (!data.payment_proof) {
            setError("payment_proof", "Bukti pembayaran wajib diunggah.");
            return;
        }

        post(route("customer.payment.proof.store"), {
            forceFormData: true,
            onError: (errors) => {
                console.error("Server errors:", errors);
            },
        });
    };

    const isFileSelected = useMemo(() => !!selectedFile, [selectedFile]);

    return (
        <div className="font-sans min-h-screen bg-gray-50 flex justify-center items-start pt-16 pb-20">
            <Head title="Upload Bukti Pembayaran" />
            <div className="max-w-5xl w-full mx-4 sm:mx-8 lg:mx-12">
                <div className="bg-white overflow-hidden shadow-2xl rounded-2xl border-b-8 border-amber-500">
                    <PaymentHeaderCard title="KONFIRMASI PEMBAYARAN" />

                    <form onSubmit={submit}>
                        <div className="p-8 md:p-12 text-gray-800 grid grid-cols-1 md:grid-cols-3 gap-10">
                            {/* --- KOLOM KIRI: INFO TRANSFER (DINAMIS) --- */}
                            <div className="space-y-6 md:col-span-1 border-r md:border-r-gray-100 md:pr-6">
                                <h3
                                    className={`text-2xl font-bold border-b pb-3 mb-4 ${ACCENT_CLASS} border-amber-200`}
                                >
                                    Transfer Ke Vendor
                                </h3>

                                {/* Info Bank Vendor */}
                                <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 shadow-sm">
                                    <p className="text-sm text-gray-500 mb-1">
                                        Bank Tujuan
                                    </p>
                                    <p className="font-bold text-lg text-gray-900">
                                        {safeBank.bank_name}
                                    </p>

                                    <div className="my-3 border-t border-amber-200/50"></div>

                                    <p className="text-sm text-gray-500 mb-1">
                                        Nomor Rekening
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="font-mono font-bold text-xl text-amber-700 tracking-wide">
                                            {safeBank.account_number}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                copyToClipboard(
                                                    safeBank.account_number
                                                )
                                            }
                                            className="p-1.5 hover:bg-amber-200 rounded-md transition text-amber-600"
                                            title="Salin Nomor Rekening"
                                        >
                                            <CopyIcon className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="my-3 border-t border-amber-200/50"></div>

                                    <p className="text-sm text-gray-500 mb-1">
                                        Atas Nama
                                    </p>
                                    <p className="font-medium text-gray-800">
                                        {safeBank.account_holder_name}
                                    </p>
                                </div>

                                {/* QRIS Display (Jika Ada) */}
                                {safeBank.qris_url && (
                                    <div className="mt-6 text-center">
                                        <p className="text-sm font-semibold text-gray-600 mb-3">
                                            Atau Scan QRIS:
                                        </p>
                                        <div className="inline-block p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                                            <img
                                                src={safeBank.qris_url}
                                                alt="QRIS Vendor"
                                                className="w-48 h-48 object-contain"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8">
                                    <p className="text-sm text-gray-500">
                                        Total Tagihan:
                                    </p>
                                    <p className="text-3xl font-extrabold text-amber-600">
                                        {formatCurrency(data.amount)}
                                    </p>
                                </div>
                            </div>

                            {/* --- KOLOM KANAN: FORM INPUT & UPLOAD --- */}
                            <div className="space-y-8 md:col-span-2">
                                <h3
                                    className={`text-2xl font-bold border-b pb-3 mb-4 ${ACCENT_CLASS} border-amber-200`}
                                >
                                    Formulir Konfirmasi
                                </h3>

                                {/* Input Nama Pengirim (Manual) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nama Rekening Pengirim (Anda)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.account_name}
                                        onChange={(e) =>
                                            setData(
                                                "account_name",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-amber-500 transition-colors
                                            ${
                                                errors.account_name
                                                    ? "border-red-500 bg-red-50"
                                                    : "border-gray-300"
                                            }`}
                                        placeholder="Contoh: Budi Santoso"
                                    />
                                    {errors.account_name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.account_name}
                                        </p>
                                    )}
                                </div>

                                {/* Area Upload */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Bukti Transfer
                                    </label>
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragEnter={handleDragOver}
                                        onDrop={handleDrop}
                                        className={`relative p-12 h-64 rounded-2xl border-4 border-dashed transition-all cursor-pointer hover:bg-gray-50 flex items-center justify-center
                                            ${
                                                errors.payment_proof
                                                    ? "border-red-500 bg-red-50"
                                                    : isFileSelected
                                                    ? "border-green-500 bg-green-50"
                                                    : "border-gray-300"
                                            }
                                        `}
                                    >
                                        <input
                                            type="file"
                                            name="payment_proof"
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    e.target.files[0]
                                                )
                                            }
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            ref={fileInputRef}
                                        />

                                        <div className="text-center space-y-3 pointer-events-none">
                                            <UploadCloudIcon
                                                className="w-20 h-20 mx-auto"
                                                color={
                                                    errors.payment_proof
                                                        ? "#EF4444"
                                                        : isFileSelected
                                                        ? "#10B981"
                                                        : PRIMARY_COLOR
                                                }
                                            />
                                            <p className="font-extrabold text-xl text-gray-700">
                                                Seret File Bukti ke Sini
                                            </p>
                                            <p className="text-base text-gray-500">
                                                atau{" "}
                                                <span className="font-semibold text-amber-500">
                                                    klik area ini
                                                </span>
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                JPG, PNG, PDF (Maks 5 MB)
                                            </p>
                                        </div>
                                    </div>

                                    {isFileSelected &&
                                        !errors.payment_proof && (
                                            <div className="flex items-center p-4 mt-4 rounded-xl border bg-white shadow-sm border-green-500">
                                                <FileTextIcon
                                                    color="#10B981"
                                                    className="w-6 h-6 flex-shrink-0"
                                                />
                                                <span className="ml-4 text-base font-semibold text-gray-700 truncate">
                                                    {selectedFile.name}
                                                </span>
                                                <span className="ml-auto text-sm text-gray-500 font-mono">
                                                    (
                                                    {(
                                                        selectedFile.size /
                                                        1024 /
                                                        1024
                                                    ).toFixed(2)}{" "}
                                                    MB)
                                                </span>
                                            </div>
                                        )}
                                    {errors.payment_proof && (
                                        <p className="text-red-500 text-sm mt-2">
                                            {errors.payment_proof}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !isFileSelected}
                                    className="w-full text-white font-extrabold py-5 px-6 rounded-xl text-xl shadow-xl transition-all disabled:opacity-50 mt-2 transform hover:scale-[1.01]"
                                    style={{
                                        backgroundColor: PRIMARY_COLOR,
                                        backgroundImage: `linear-gradient(90deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 100%)`,
                                    }}
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center">
                                            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                            Memproses...
                                        </span>
                                    ) : (
                                        "Kirim Bukti Pembayaran"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
