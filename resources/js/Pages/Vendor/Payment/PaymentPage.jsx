import React, { useState } from "react";
import { router, useForm, Head } from "@inertiajs/react";
import moment from "moment";
import "moment/locale/id";

// --- KONFIGURASI TEMA ---
const PRIMARY_COLOR = "#D97706";
const ACCENT_CLASS = "text-amber-700";

// --- IKON SVG ---
const BankTransferIcon = () => (
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
        className={`${ACCENT_CLASS} flex-shrink-0`}
    >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <path d="M7 15h0M12 15h0M17 15h0" />
        <path d="M12 2v3" />
        <path d="M6 2v3" />
        <path d="M18 2v3" />
    </svg>
);
const QrisIcon = () => (
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
        className={`${ACCENT_CLASS} flex-shrink-0`}
    >
        <rect width="5" height="5" x="3" y="3" rx="1" />
        <rect width="5" height="5" x="16" y="3" rx="1" />
        <rect width="5" height="5" x="3" y="16" rx="1" />
        <path d="M21 16h-5v5M10 10h4v4h-4zM10 3v1M3 10h1M10 20v1M20 10h1" />
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
        className={`mr-2 flex-shrink-0 ${ACCENT_CLASS}`}
    >
        <path d="M20 6 9 17l-5-5" />
    </svg>
);
const LargeCheckIcon = ({ color = "white" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="flex-shrink-0"
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-8.98" />
        <path d="M22 4L12 14.01l-3-3" />
    </svg>
);

// Komponen Toast Notification
const ToastNotification = ({ isVisible, message }) => (
    <div
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
            isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8 pointer-events-none"
        }`}
    >
        <div className="flex items-center p-4 rounded-xl shadow-2xl text-white font-semibold min-w-[200px] bg-amber-600">
            <CheckIcon />
            {message}
        </div>
    </div>
);

// Helper Format Rupiah
const formatCurrency = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

// Komponen Detail Transfer
const TransferDetail = ({ label, value, showToast }) => {
    const copyToClipboard = (text) => {
        if (!text || text === "-") return;
        navigator.clipboard.writeText(text);
        showToast(label + " berhasil disalin!");
    };

    return (
        <div className="flex justify-between text-sm text-gray-700 items-center">
            <span className="font-medium text-gray-600">{label}</span>
            <div className="flex items-center">
                <span className="font-mono text-right font-bold text-gray-800">
                    {value}
                </span>
                {label === "Nomor Rekening" && value !== "-" && (
                    <button
                        type="button"
                        onClick={() => copyToClipboard(value)}
                        className="ml-2 text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition"
                    >
                        Salin
                    </button>
                )}
            </div>
        </div>
    );
};

// --- KOMPONEN UTAMA ---
export default function PaymentPage({
    auth,
    plan,
    tax,
    total,
    invoiceId,
    vendorBank,
}) {
    // FORM STATE: Gunakan invoice_id sesuai controller
    const { data, setData, processing, errors, setError, clearErrors } =
        useForm({
            invoice_id: invoiceId, // <-- PENTING: Ambil dari props controller create()
            amount: total,
        });

    const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
    const [toast, setToast] = useState({ visible: false, message: "" });

    const showToast = (message) => {
        setToast({ visible: true, message });
        setTimeout(() => setToast({ visible: false, message: "" }), 2200);
    };

    // Fungsi Submit: Mengarahkan ke halaman Upload Bukti
    const submit = (e) => {
        e.preventDefault();

        // Redirect ke halaman upload proof dengan query parameter invoiceId
        // Route ini harus sesuai dengan yang ada di web.php untuk VendorPaymentFlowController
        router.get(route("vendor.payment.proof.upload"), {
            invoiceId: invoiceId,
        });
    };

    return (
        <div className="font-sans min-h-screen bg-gray-50">
            <Head title="Pembayaran Membership" />

            <main>
                <div className="py-12 bg-white/50">
                    <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-2xl sm:rounded-xl border-b-8 border-amber-500">
                            {/* Header Card */}
                            <div className="p-6 md:p-8 rounded-t-xl text-white shadow-lg flex items-center justify-between bg-gradient-to-r from-amber-600 to-amber-400">
                                <h2 className="font-bold text-3xl sm:text-4xl">
                                    TAGIHAN MEMBERSHIP
                                </h2>
                                <LargeCheckIcon color="white" />
                            </div>

                            <form onSubmit={submit}>
                                <div className="p-6 md:p-10 text-gray-800 grid grid-cols-1 md:grid-cols-5 gap-10">
                                    {/* --- KOLOM KIRI: Detail Tagihan --- */}
                                    <div className="space-y-6 md:col-span-3">
                                        <h3
                                            className={`text-2xl font-bold border-b pb-2 ${ACCENT_CLASS} border-amber-200`}
                                        >
                                            Rincian Paket
                                        </h3>

                                        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 shadow-sm relative">
                                            <div className="border-b border-gray-100 pb-4">
                                                <div className="flex justify-between font-semibold text-lg text-gray-700 mt-2">
                                                    <span>{plan.name}</span>
                                                    <span
                                                        className={ACCENT_CLASS}
                                                    >
                                                        {formatCurrency(
                                                            plan.price
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="mt-3 grid grid-cols-1 gap-1">
                                                    {Array.isArray(
                                                        plan.features
                                                    ) &&
                                                        plan.features.map(
                                                            (
                                                                feature,
                                                                index
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-start list-none text-sm text-gray-600"
                                                                >
                                                                    <CheckIcon />{" "}
                                                                    {feature}
                                                                </div>
                                                            )
                                                        )}
                                                </div>
                                            </div>

                                            <div className="border-t pt-4 space-y-2 border-amber-200">
                                                <div className="flex justify-between text-sm">
                                                    <span>Harga Paket</span>
                                                    <span className="font-semibold">
                                                        {formatCurrency(
                                                            plan.price
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Pajak (11%)</span>
                                                    <span className="font-semibold">
                                                        {formatCurrency(tax)}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`flex justify-between text-xl font-extrabold ${ACCENT_CLASS} pt-2`}
                                                >
                                                    <span>Total Bayar</span>
                                                    <span>
                                                        {formatCurrency(total)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- KOLOM KANAN: Metode Pembayaran --- */}
                                    <div className="space-y-6 md:col-span-2">
                                        <h3
                                            className={`text-2xl font-bold border-b pb-2 ${ACCENT_CLASS} border-amber-200`}
                                        >
                                            Instruksi Pembayaran
                                        </h3>

                                        {/* Pilihan Metode (Visual Saja) */}
                                        <div className="grid grid-cols-1 gap-4">
                                            <div
                                                onClick={() =>
                                                    setPaymentMethod(
                                                        "bank_transfer"
                                                    )
                                                }
                                                className={`cursor-pointer flex items-center p-4 rounded-xl border-2 transition-all shadow-sm ${
                                                    paymentMethod ===
                                                    "bank_transfer"
                                                        ? "border-amber-500 bg-amber-50"
                                                        : "border-gray-200"
                                                }`}
                                            >
                                                <div
                                                    className={`p-2 rounded-full ${
                                                        paymentMethod ===
                                                        "bank_transfer"
                                                            ? "bg-amber-200"
                                                            : "bg-gray-100"
                                                    }`}
                                                >
                                                    <BankTransferIcon />
                                                </div>
                                                <div className="ml-3">
                                                    <span className="block font-bold text-gray-800">
                                                        Transfer Bank
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        Manual Check (Admin)
                                                    </span>
                                                </div>
                                            </div>

                                            <div
                                                onClick={() =>
                                                    setPaymentMethod("qris")
                                                }
                                                className={`cursor-pointer flex items-center p-4 rounded-xl border-2 transition-all shadow-sm ${
                                                    paymentMethod === "qris"
                                                        ? "border-amber-500 bg-amber-50"
                                                        : "border-gray-200"
                                                }`}
                                            >
                                                <div
                                                    className={`p-2 rounded-full ${
                                                        paymentMethod === "qris"
                                                            ? "bg-amber-200"
                                                            : "bg-gray-100"
                                                    }`}
                                                >
                                                    <QrisIcon />
                                                </div>
                                                <div className="ml-3">
                                                    <span className="block font-bold text-gray-800">
                                                        QRIS
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        Scan & Upload
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Detail Rekening Admin */}
                                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 relative">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-xl"></div>

                                            {paymentMethod ===
                                            "bank_transfer" ? (
                                                <>
                                                    <h4 className="font-bold text-gray-800 border-b pb-2">
                                                        Rekening Admin
                                                    </h4>
                                                    <TransferDetail
                                                        label="Bank"
                                                        value={
                                                            vendorBank.bank_name
                                                        }
                                                        showToast={showToast}
                                                    />
                                                    <TransferDetail
                                                        label="No. Rekening"
                                                        value={
                                                            vendorBank.account_number
                                                        }
                                                        showToast={showToast}
                                                    />
                                                    <TransferDetail
                                                        label="A.N"
                                                        value={
                                                            vendorBank.account_holder_name
                                                        }
                                                        showToast={showToast}
                                                    />

                                                    <div className="bg-blue-50 p-3 rounded text-xs text-blue-700 mt-2">
                                                        Silakan transfer sesuai
                                                        nominal total. Simpan
                                                        bukti transfer untuk
                                                        diupload di langkah
                                                        selanjutnya.
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <h4 className="font-bold text-gray-800 border-b pb-2">
                                                        QRIS Admin
                                                    </h4>
                                                    {vendorBank.qris_url ? (
                                                        <div className="text-center">
                                                            <img
                                                                src={
                                                                    vendorBank.qris_url
                                                                }
                                                                alt="QRIS"
                                                                className="w-40 h-40 object-contain mx-auto border rounded mb-2"
                                                            />
                                                            <p className="text-xs text-gray-500">
                                                                Scan kode di
                                                                atas untuk
                                                                membayar.
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-4 text-gray-400">
                                                            <p>
                                                                QRIS Admin belum
                                                                tersedia.
                                                            </p>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol Lanjut */}
                                <div className="px-6 md:px-10 pb-10">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition transform hover:scale-[1.01] disabled:opacity-50 flex justify-center items-center"
                                    >
                                        <span>
                                            Saya Sudah Bayar, Lanjut Upload
                                            Bukti
                                        </span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 ml-2"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <ToastNotification
                isVisible={toast.visible}
                message={toast.message}
            />
        </div>
    );
}
