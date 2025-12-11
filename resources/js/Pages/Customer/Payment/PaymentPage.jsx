import React, { useState } from "react";
import { router, useForm, Head } from "@inertiajs/react";
import moment from 'moment'; // Import moment.js untuk memformat tanggal
import 'moment/locale/id'; // Opsional: Untuk format tanggal Indonesia

// --- KONFIGURASI TEMA ---
const PRIMARY_COLOR = "#D97706";
const SECONDARY_COLOR = "#FCD34D";
const ACCENT_CLASS = "text-amber-700";

// --- IKON SVG (Tidak Berubah) ---
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
// --- Akhir Ikon SVG ---

// Komponen Toast Notification (Tidak Berubah)
const ToastNotification = ({ isVisible, message }) => {
    return (
        <div
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out 
                ${
                    isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8 pointer-events-none"
                }`}
        >
            <div className="flex items-center p-4 rounded-xl shadow-2xl text-white font-semibold min-w-[200px] bg-amber-600">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-8.98" />
                    <path d="M22 4L12 14.01l-3-3" />
                </svg>
                {message}
            </div>
        </div>
    );
};

// Komponen Card Header Pembayaran (Tidak Berubah)
const PaymentHeaderCard = ({ title }) => (
    <div className="p-6 md:p-8 rounded-t-xl text-white shadow-lg flex items-center justify-between bg-gradient-to-r from-amber-600 to-amber-400">
        <h2 className="font-bold text-3xl sm:text-4xl">{title}</h2>
        <LargeCheckIcon color="white" />
    </div>
);

// Helper formatCurrency (Tidak Berubah)
const formatCurrency = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

// Komponen Detail Transfer (Tidak Berubah)
const TransferDetail = ({ label, value, valueStyle = {}, showToast }) => {
    const copyToClipboard = (text) => {
        try {
            const tempInput = document.createElement("textarea");
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
            showToast(label + " berhasil disalin!");
        } catch (err) {
            showToast("Gagal menyalin. Salin manual.");
        }
    };

    return (
        <div className="flex justify-between text-sm text-gray-700">
            <span className="font-medium text-gray-600">{label}</span>
            <span className="font-mono text-right" style={{ ...valueStyle }}>
                {value}
                {label === "Nomor Rekening" && (
                    <button
                        type="button"
                        onClick={() => copyToClipboard(value)}
                        className="ml-2 text-xs font-normal underline text-amber-500 hover:text-amber-600 transition"
                    >
                        [Salin]
                    </button>
                )}
            </span>
        </div>
    );
};

// Komponen Halaman Utama (DI SINI PERUBAHAN UTAMA)
export default function PaymentPage({
    auth,
    order, 
    paymentSettings,
}) {
    // =================================================================
    // >>> GUARD CLAUSE UTAMA UNTUK MENGHINDARI ERROR UNDEFINED (Sudah Ada)
    // =================================================================
    if (!order || !order.package || !order.package.vendor) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <Head title="Data Error" />
                <div className="text-center p-8 bg-white shadow-xl rounded-xl">
                    <h1 className="text-2xl font-bold text-red-700">Data Pemesanan Tidak Ditemukan</h1>
                    <p className="text-gray-600 mt-2">
                        Data Order (ID: {order?.id}), Paket, atau Vendor hilang. Pastikan Controller memuat Order dengan relasi `package.vendor`.
                    </p>
                    <button 
                        onClick={() => window.history.back()}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-500 hover:bg-gray-600"
                    >
                        &larr; Kembali
                    </button>
                </div>
            </div>
        );
    }

    // =================================================================
    // >>> DESTRUKTURISASI DATA AMAN DAN PERHITUNGAN (PERUBAHAN 1)
    // =================================================================
    const pkg = order.package; 
    
    const basePrice = pkg.price || 0;
    const taxRate = 0.11;
    const taxAmount = basePrice * taxRate;
    const totalAmount = basePrice + taxAmount; 
    const invoiceId = order.id; 

    // --- PERUBAHAN UTAMA: MENGAMBIL DAN MEMFORMAT TANGGAL PEMESANAN ---
    const orderDate = order.order_date; // Mengambil tanggal dari objek Order
    
    // Memformat tanggal agar lebih mudah dibaca (misal: 25 Desember 2025)
    // Pastikan Anda telah menginstal moment.js: npm install moment
    const formattedDate = orderDate 
        ? moment(orderDate).locale('id').format('dddd, D MMMM YYYY') 
        : 'Tanggal Belum Dipilih'; // Fallback jika order_date kosong

    // =================================================================


    const { bankName, accountNumber, accountHolder, qrisUrl } =
        paymentSettings || {
            bankName: "Bank Tujuan (BELUM DIATUR ADMIN)",
            accountNumber: "000000000000",
            accountHolder: "Admin Belum Atur",
            qrisUrl: null,
        };

    const { data, setData, processing, errors, setError, clearErrors } =
        useForm({
            payment_method: "bank_transfer",
            account_name: "",
        });

    const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
    const [toast, setToast] = useState({ visible: false, message: "" });

    const showToast = (message) => {
        setToast({ visible: true, message });
        setTimeout(() => {
            setToast({ visible: false, message: "" });
        }, 2200);
    };

    const handlePaymentMethodChange = (method) => {
        if (paymentMethod === method) return;
        setPaymentMethod(method);
        setData("payment_method", method);
    };

    const submit = (e) => {
        e.preventDefault();
        clearErrors();

        if (paymentMethod === "bank_transfer") {
            if (data.account_name.trim() === "") {
                setError("account_name", "Nama Rekening Transfer wajib diisi.");
                return;
            }

            // MENGIRIM DATA TOTAL JUMLAH DAN ID INVOICE YANG SUDAH DIAMBIL DARI ORDER
            router.get(route("vendor.payment.proof.upload"), {
                invoiceId: invoiceId, // Menggunakan order.id
                amount: totalAmount,  // Menggunakan totalAmount yang dihitung
                account_name: data.account_name,
            });
        }

        if (paymentMethod === "qris") {
            if (!qrisUrl) {
                showToast(
                    "Admin belum mengatur QRIS. Pilih transfer bank atau hubungi admin."
                );
                return;
            }

            router.get(route("vendor.payment.loading"), {
                message:
                    "Silakan lanjutkan pembayaran Anda melalui QRIS. Setelah pembayaran selesai, Admin akan memverifikasi transaksi.",
                qrisUrl: qrisUrl,
            });
        }
    };

    return (
        <div className="font-sans min-h-screen bg-gray-50">
            <Head title="Halaman Pembayaran" />

            <main>
                <div className="py-12 bg-white/50">
                    <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-2xl sm:rounded-xl border-b-8 border-amber-500">
                            <PaymentHeaderCard title="HALAMAN PEMBAYARAN" />

                            <form onSubmit={submit}>
                                <div className="p-6 md:p-10 text-gray-800 grid grid-cols-1 md:grid-cols-5 gap-10">
                                    {/* Kolom Kiri */}
                                    <div className="space-y-6 md:col-span-3">
                                        <h3
                                            className={`text-2xl font-bold border-b pb-2 ${ACCENT_CLASS} border-amber-200`}
                                        >
                                            Ringkasan Tagihan ({formatCurrency(totalAmount)}) 
                                        </h3>

                                        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 shadow-sm">
                                            <div className="border-b border-gray-100 pb-4">
                                                <div className="flex justify-between font-semibold text-lg text-gray-700">
                                                    <span>{pkg.name} - ({order.package.vendor.name})</span> 
                                                    <span
                                                        className={ACCENT_CLASS}
                                                    >
                                                        {formatCurrency(pkg.price)} 
                                                    </span>
                                                </div>
                                            </div>

                                            {/* PERUBAHAN 2: MENGGANTI BAGIAN MANFAAT UTAMA DENGAN TANGGAL */}
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <p className="font-medium text-gray-700">
                                                    Tanggal Pemesanan: {/* Ganti Manfaat Utama */}
                                                </p>
                                                <div className="flex items-start list-none font-semibold text-base text-gray-800">
                                                    <CheckIcon /> 
                                                    {formattedDate} {/* Tampilkan Tanggal yang sudah diformat */}
                                                </div>
                                                {Array.isArray(pkg.features) && 
                                                pkg.features.length > 0 ? (
                                                    pkg.features.map(
                                                         (feature, index) => (
                                                             <li
                                                                 key={index}
                                                                 className="flex items-start list-none text-sm text-gray-600"
                                                             >
                                                                 <CheckIcon />
                                                                 {feature}
                                                             </li>
                                                         )
                                                    )
                                                ) : (
                                                    <p className="text-gray-500 italic text-sm">
                                                     </p>
                                                )}

                                            </div>
                                            {/* AKHIR PERUBAHAN 2 */}

                                            <div className="border-t pt-4 space-y-2 border-amber-200">
                                                <div className="flex justify-between text-sm">
                                                    <span>Subtotal</span>
                                                    <span className="font-semibold">
                                                        {formatCurrency(pkg.price)} 
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>PPN (11%)</span>
                                                    <span className="font-semibold">
                                                        {formatCurrency(taxAmount)} 
                                                    </span>
                                                </div>
                                                <div
                                                    className={`flex justify-between text-xl font-extrabold ${ACCENT_CLASS}`}
                                                >
                                                    <span>Total Tagihan</span>
                                                    <span>
                                                        {formatCurrency(totalAmount)} 
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-xs text-gray-500 pt-4">
                                                Dengan mengklik "Bayar
                                                Sekarang", Anda mengonfirmasi
                                                telah membaca dan menyetujui
                                                Syarat dan Ketentuan layanan
                                                kami.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Kolom Kanan (Metode Pembayaran) */}
                                    <div className="space-y-6 md:col-span-2">
                                        <h3
                                            className={`text-2xl font-bold border-b pb-2 ${ACCENT_CLASS} border-amber-200`}
                                        >
                                            Metode Pembayaran
                                        </h3>

                                        <div className="grid grid-cols-1 gap-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handlePaymentMethodChange(
                                                        "bank_transfer"
                                                    )
                                                }
                                                className={`flex items-center p-4 rounded-xl border-2 transition-all shadow-md ${
                                                    paymentMethod ===
                                                    "bank_transfer"
                                                        ? "border-amber-500 bg-amber-50 ring-2 ring-amber-300"
                                                        : "border-gray-300 hover:border-gray-400 bg-white"
                                                }`}
                                            >
                                                <BankTransferIcon />
                                                <span className="ml-3 font-semibold text-sm sm:text-base text-gray-700">
                                                    Transfer Bank (Manual)
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handlePaymentMethodChange(
                                                        "qris"
                                                    )
                                                }
                                                className={`flex items-center p-4 rounded-xl border-2 transition-all shadow-md ${
                                                    paymentMethod === "qris"
                                                        ? "border-amber-500 bg-amber-50 ring-2 ring-amber-300"
                                                        : "border-gray-300 hover:border-gray-400 bg-white"
                                                }`}
                                            >
                                                <QrisIcon />
                                                <span className="ml-3 font-semibold text-sm sm:text-base text-gray-700">
                                                    QRIS
                                                </span>
                                            </button>
                                        </div>

                                        {paymentMethod === "bank_transfer" && (
                                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                                <h4 className="font-semibold text-gray-800 text-lg border-b pb-2">
                                                    Detail Transfer
                                                </h4>

                                                <TransferDetail
                                                    label="Bank"
                                                    value={bankName}
                                                    showToast={showToast}
                                                />
                                                <TransferDetail
                                                    label="Nomor Rekening"
                                                    value={accountNumber}
                                                    showToast={showToast}
                                                />
                                                <TransferDetail
                                                    label="Atas Nama"
                                                    value={accountHolder}
                                                    showToast={showToast}
                                                />

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 pb-1">
                                                        Nama Rekening Pengirim
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            data.account_name
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "account_name",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                                                        placeholder="Masukkan nama pemilik rekening"
                                                    />
                                                    {errors.account_name && (
                                                        <p className="text-red-600 text-xs mt-1">
                                                            {
                                                                errors.account_name
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {paymentMethod === "qris" && (
                                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                                {!qrisUrl ? (
                                                    <p className="text-red-600 text-sm text-center">
                                                        QRIS belum tersedia.
                                                        Hubungi Admin atau
                                                        gunakan Transfer Bank.
                                                    </p>
                                                ) : (
                                                    <img
                                                        src={qrisUrl}
                                                        alt="QRIS"
                                                        className="w-full rounded-lg border shadow-md"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="px-6 md:px-10 pb-10">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-lg py-3 rounded-xl shadow-lg transition"
                                    >
                                        Bayar Sekarang
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