import React, { useState } from "react";
import { router, useForm, Head } from "@inertiajs/react";
import moment from "moment";
import "moment/locale/id";

// --- KONFIGURASI TEMA ---
const PRIMARY_COLOR = "#D97706";
const SECONDARY_COLOR = "#FCD34D";
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
const ToastNotification = ({ isVisible, message }) => {
    return (
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
};

// Komponen Card Header
const PaymentHeaderCard = ({ title }) => (
    <div className="p-6 md:p-8 rounded-t-xl text-white shadow-lg flex items-center justify-between bg-gradient-to-r from-amber-600 to-amber-400">
        <h2 className="font-bold text-3xl sm:text-4xl">{title}</h2>
        <LargeCheckIcon color="white" />
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
const TransferDetail = ({ label, value, valueStyle = {}, showToast }) => {
    const copyToClipboard = (text) => {
        if (!text || text === "-") return;
        try {
            navigator.clipboard.writeText(text);
            showToast(label + " berhasil disalin!");
        } catch (err) {
            showToast("Gagal menyalin. Salin manual.");
        }
    };

    return (
        <div className="flex justify-between text-sm text-gray-700 items-center">
            <span className="font-medium text-gray-600">{label}</span>
            <div className="flex items-center">
                <span
                    className="font-mono text-right font-bold text-gray-800"
                    style={{ ...valueStyle }}
                >
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
export default function PaymentPage({ auth, order }) {
    // 1. Guard Clause: Pastikan data order dan vendor tersedia
    if (!order || !order.package || !order.package.vendor) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <Head title="Data Error" />
                <div className="text-center p-8 bg-white shadow-xl rounded-xl">
                    <h1 className="text-2xl font-bold text-red-700">
                        Data Vendor Tidak Ditemukan
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Mohon hubungi admin jika masalah berlanjut.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        &larr; Kembali
                    </button>
                </div>
            </div>
        );
    }

    // 2. Extract Data Vendor
    const vendor = order.package.vendor;
    const bankName = vendor.bank_name || "Bank Belum Diatur";
    const accountNumber = vendor.account_number || "-";
    const accountHolder = vendor.account_holder_name || vendor.name;
    // URL QRIS: Menggunakan path dari database
    const qrisUrl = vendor.qris_path ? `/storage/${vendor.qris_path}` : null;

    // 3. Kalkulasi Harga
    const pkg = order.package;
    const basePrice = pkg.price || 0;
    const taxRate = 0.11;
    const taxAmount = basePrice * taxRate;
    const totalAmount = basePrice + taxAmount;

    // Format Tanggal
    const orderDate = order.order_date;
    const formattedDate = orderDate
        ? moment(orderDate).locale("id").format("dddd, D MMMM YYYY")
        : "Tanggal Belum Dipilih";

    // Form State
    const { data, setData, processing, errors, setError, clearErrors } =
        useForm({
            payment_method: "bank_transfer",
            account_name: "", // Nama pengirim (opsional di tahap ini, wajib di upload)
        });

    const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
    const [toast, setToast] = useState({ visible: false, message: "" });

    const showToast = (message) => {
        setToast({ visible: true, message });
        setTimeout(() => setToast({ visible: false, message: "" }), 2200);
    };

    const handlePaymentMethodChange = (method) => {
        if (paymentMethod === method) return;
        setPaymentMethod(method);
        setData("payment_method", method);
        clearErrors();
    };

    // --- FUNGSI SUBMIT ---
    const submit = (e) => {
        e.preventDefault();
        clearErrors();

        // Cek jika Vendor belum atur rekening
        if (paymentMethod === "bank_transfer" && accountNumber === "-") {
            showToast("Vendor belum mengatur rekening bank.");
            return;
        }

        // Cek jika Vendor belum atur QRIS
        if (paymentMethod === "qris" && !qrisUrl) {
            showToast("Vendor belum mengatur QRIS.");
            return;
        }

        // Redirect ke Halaman Upload Bukti
        // Kita kirim data via Query Params (GET) ke controller 'uploadProofPage'
        router.get(route("customer.payment.proof.page"), {
            order_id: order.id,
            amount: totalAmount,
            // Jika user pilih QRIS, nama akun bisa di-skip/auto-fill nanti
            account_name:
                paymentMethod === "qris" ? "QRIS Payment" : data.account_name,
        });
    };

    return (
        <div className="font-sans min-h-screen bg-gray-50">
            <Head title="Halaman Pembayaran" />

            <main>
                <div className="py-12 bg-white/50">
                    <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-2xl sm:rounded-xl border-b-8 border-amber-500">
                            <PaymentHeaderCard title="RINCIAN PEMBAYARAN" />

                            <form onSubmit={submit}>
                                <div className="p-6 md:p-10 text-gray-800 grid grid-cols-1 md:grid-cols-5 gap-10">
                                    {/* --- KOLOM KIRI: Detail Pesanan --- */}
                                    <div className="space-y-6 md:col-span-3">
                                        <h3
                                            className={`text-2xl font-bold border-b pb-2 ${ACCENT_CLASS} border-amber-200`}
                                        >
                                            Ringkasan Tagihan
                                        </h3>

                                        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 shadow-sm relative overflow-hidden">
                                            {/* Pita Vendor */}
                                            <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-bl-lg">
                                                Vendor: {vendor.name}
                                            </div>

                                            <div className="border-b border-gray-100 pb-4">
                                                <div className="flex justify-between font-semibold text-lg text-gray-700 mt-2">
                                                    <span>{pkg.name}</span>
                                                    <span
                                                        className={ACCENT_CLASS}
                                                    >
                                                        {formatCurrency(
                                                            pkg.price
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2 text-sm text-gray-600">
                                                <p className="font-medium text-gray-700">
                                                    Detail Pesanan:
                                                </p>
                                                <div className="flex items-start list-none font-semibold text-base text-gray-800">
                                                    <CheckIcon />{" "}
                                                    {formattedDate}
                                                </div>

                                                <div className="pl-6 text-xs text-gray-500 italic">
                                                    Lokasi: {vendor.city},{" "}
                                                    {vendor.province}
                                                </div>

                                                {/* Fitur Paket */}
                                                <div className="mt-3 grid grid-cols-1 gap-1">
                                                    {Array.isArray(
                                                        pkg.features
                                                    ) &&
                                                        pkg.features
                                                            .slice(0, 4)
                                                            .map(
                                                                (
                                                                    feature,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="flex items-start list-none text-sm text-gray-600"
                                                                    >
                                                                        <CheckIcon />{" "}
                                                                        {
                                                                            feature
                                                                        }
                                                                    </div>
                                                                )
                                                            )}
                                                    {Array.isArray(
                                                        pkg.features
                                                    ) &&
                                                        pkg.features.length >
                                                            4 && (
                                                            <p className="text-xs text-gray-400 pl-6">
                                                                +{" "}
                                                                {pkg.features
                                                                    .length -
                                                                    4}{" "}
                                                                fitur lainnya
                                                            </p>
                                                        )}
                                                </div>
                                            </div>

                                            <div className="border-t pt-4 space-y-2 border-amber-200">
                                                <div className="flex justify-between text-sm">
                                                    <span>Harga Paket</span>
                                                    <span className="font-semibold">
                                                        {formatCurrency(
                                                            basePrice
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>
                                                        Pajak & Layanan (11%)
                                                    </span>
                                                    <span className="font-semibold">
                                                        {formatCurrency(
                                                            taxAmount
                                                        )}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`flex justify-between text-xl font-extrabold ${ACCENT_CLASS} pt-2`}
                                                >
                                                    <span>Total Bayar</span>
                                                    <span>
                                                        {formatCurrency(
                                                            totalAmount
                                                        )}
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
                                            Pilih Metode Bayar
                                        </h3>

                                        <div className="grid grid-cols-1 gap-4">
                                            {/* Tombol Bank Transfer */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handlePaymentMethodChange(
                                                        "bank_transfer"
                                                    )
                                                }
                                                className={`flex items-center p-4 rounded-xl border-2 transition-all shadow-sm ${
                                                    paymentMethod ===
                                                    "bank_transfer"
                                                        ? "border-amber-500 bg-amber-50 ring-1 ring-amber-300"
                                                        : "border-gray-200 hover:border-amber-300 bg-white"
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
                                                <div className="ml-3 text-left">
                                                    <span className="block font-bold text-gray-800">
                                                        Transfer Bank
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        Manual Check (1-3 Jam)
                                                    </span>
                                                </div>
                                            </button>

                                            {/* Tombol QRIS */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handlePaymentMethodChange(
                                                        "qris"
                                                    )
                                                }
                                                className={`flex items-center p-4 rounded-xl border-2 transition-all shadow-sm ${
                                                    paymentMethod === "qris"
                                                        ? "border-amber-500 bg-amber-50 ring-1 ring-amber-300"
                                                        : "border-gray-200 hover:border-amber-300 bg-white"
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
                                                <div className="ml-3 text-left">
                                                    <span className="block font-bold text-gray-800">
                                                        QRIS
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        Scan & Upload Bukti
                                                    </span>
                                                </div>
                                            </button>
                                        </div>

                                        {/* DETAIL REKENING VENDOR */}
                                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 relative">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-xl"></div>

                                            {paymentMethod ===
                                            "bank_transfer" ? (
                                                <>
                                                    <h4 className="font-bold text-gray-800 border-b pb-2">
                                                        Rekening Vendor
                                                    </h4>
                                                    <TransferDetail
                                                        label="Bank"
                                                        value={bankName}
                                                        showToast={showToast}
                                                    />
                                                    <TransferDetail
                                                        label="No. Rekening"
                                                        value={accountNumber}
                                                        showToast={showToast}
                                                    />
                                                    <TransferDetail
                                                        label="A.N"
                                                        value={accountHolder}
                                                        showToast={showToast}
                                                    />

                                                    <div className="bg-blue-50 p-3 rounded text-xs text-blue-700 mt-2">
                                                        Silakan transfer sesuai
                                                        nominal total. Simpan
                                                        bukti transfer untuk
                                                        diupload di halaman
                                                        selanjutnya.
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <h4 className="font-bold text-gray-800 border-b pb-2">
                                                        QRIS Vendor
                                                    </h4>
                                                    {qrisUrl ? (
                                                        <div className="text-center">
                                                            <img
                                                                src={qrisUrl}
                                                                alt="QRIS"
                                                                className="w-40 h-40 object-contain mx-auto border rounded mb-2"
                                                            />
                                                            <p className="text-xs text-gray-500">
                                                                Scan kode di
                                                                atas menggunakan
                                                                E-Wallet /
                                                                M-Banking Anda.
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-4 text-gray-400">
                                                            <p>
                                                                Kode QRIS belum
                                                                tersedia untuk
                                                                vendor ini.
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
                                        className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                                    >
                                        <span>Lanjut ke Upload Bukti</span>
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
