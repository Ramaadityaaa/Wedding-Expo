import React, { useState } from "react";
import axios from "axios";
import { Head, usePage, router } from "@inertiajs/react";
import {
    AlertCircle,
    Calendar,
    ArrowLeft,
    CreditCard,
    Store,
    Package,
    ListTodo,
    CheckCircle,
} from "lucide-react";

const SelectDate = ({ vendor, package: packageData }) => {
    const { props } = usePage();
    const serverError = props.flash?.error;

    const [orderDate, setOrderDate] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [processing, setProcessing] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const d = new Date(dateString);
        if (Number.isNaN(d.getTime())) return "-";
        return d.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const todayMin = new Date().toISOString().split("T")[0];

    if (!vendor || !packageData || serverError) {
        const displayMessage =
            serverError ||
            "Vendor atau Paket yang dipilih tidak ditemukan atau data hilang saat loading.";

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
                <Head title="Error Data" />

                <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="mx-auto w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                            <AlertCircle className="w-7 h-7 text-red-600" />
                        </div>

                        <h1 className="mt-5 text-xl font-extrabold text-gray-900 text-center">
                            Ups! Terjadi Kesalahan
                        </h1>

                        <p className="mt-2 text-sm text-gray-500 text-center leading-relaxed">
                            {displayMessage}
                        </p>

                        <button
                            onClick={() => window.history.back()}
                            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold shadow-sm transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali
                        </button>
                    </div>

                    <div className="h-1.5 w-full bg-red-200" />
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!orderDate) {
            setErrorMessage("Silakan pilih tanggal terlebih dahulu.");
            return;
        }

        setErrorMessage("");
        setProcessing(true);

        try {
            const res = await axios.post(route("api.checkAvailability"), {
                vendor_id: vendor.id,
                package_id: packageData.id,
                order_date: orderDate,
            });

            if (!res.data?.available) {
                const max = res.data?.max ?? 3;
                setErrorMessage(`Tanggal tersebut sudah penuh. Maksimal ${max} pemesanan untuk paket ini.`);
                setProcessing(false);
                return;
            }

            router.post(
                route("order.store"),
                {
                    vendor_id: vendor.id,
                    package_id: packageData.id,
                    order_date: orderDate,
                },
                {
                    onFinish: () => setProcessing(false),
                    onError: (errors) => {
                        const firstError = Object.values(errors)[0];
                        setErrorMessage(firstError || "Gagal membuat pemesanan.");
                        setProcessing(false);
                    },
                }
            );
        } catch (err) {
            // Jika backend mengembalikan 422, tampilkan pesan validasi jika ada
            const message =
                err?.response?.data?.message ||
                "Terjadi kesalahan dalam pengecekan tanggal.";

            setErrorMessage(message);
            setProcessing(false);
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Atur Jadwal Pemesanan" />

            <main className="py-10 px-5 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali
                        </button>

                        <div className="text-xs text-gray-500">
                            Atur jadwal pemesanan
                        </div>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Pilih Tanggal
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Tentukan tanggal acara, lalu lanjutkan ke tahap pembayaran.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-6">
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <ListTodo className="w-4 h-4" />
                                        <span>Ringkasan Pesanan</span>
                                    </div>

                                    <div className="mt-4 space-y-4">
                                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Store className="w-4 h-4 text-amber-600" />
                                                Vendor
                                            </div>
                                            <div className="text-gray-900 font-semibold mt-1">
                                                {vendor?.name || "-"}
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-white border border-gray-200">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Package className="w-4 h-4 text-amber-600" />
                                                Paket Layanan
                                            </div>
                                            <div className="text-gray-900 font-semibold mt-1">
                                                {packageData?.name || "-"}
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-white border border-gray-200">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-amber-600" />
                                                Tanggal Dipilih
                                            </div>
                                            <div className="text-gray-900 font-semibold mt-1">
                                                {orderDate ? formatDate(orderDate) : "-"}
                                            </div>
                                        </div>

                                        <div className="text-xs text-gray-500 leading-relaxed">
                                            Pastikan tanggal yang kamu pilih sudah sesuai dengan jadwalmu.
                                        </div>
                                    </div>
                                </div>

                                <div className="h-1.5 w-full bg-amber-200" />
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-6 sm:p-7">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">
                                                Form Jadwal
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                Pilih tanggal acara untuk melanjutkan.
                                            </div>
                                        </div>

                                        {orderDate ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-xs font-semibold">
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                Siap
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-semibold">
                                                <Calendar className="w-3.5 h-3.5" />
                                                Pilih tanggal
                                            </span>
                                        )}
                                    </div>

                                    {errorMessage && (
                                        <div className="mt-5 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                                            <p className="text-sm font-medium">
                                                {errorMessage}
                                            </p>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="order_date"
                                                className="block text-sm font-semibold text-gray-800"
                                            >
                                                Tanggal Acara
                                            </label>

                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Calendar className="h-5 w-5 text-gray-400" />
                                                </div>

                                                <input
                                                    id="order_date"
                                                    type="date"
                                                    value={orderDate}
                                                    onChange={(e) => setOrderDate(e.target.value)}
                                                    required
                                                    min={todayMin}
                                                    className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-200 focus:bg-white transition text-sm font-semibold"
                                                    disabled={processing}
                                                />
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                Minimal tanggal hari ini atau setelahnya.
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing || !orderDate}
                                            className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition shadow-sm
                                                ${
                                                    processing || !orderDate
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "bg-amber-600 hover:bg-amber-700 text-white"
                                                }`}
                                        >
                                            {processing ? (
                                                <>
                                                    <svg
                                                        className="animate-spin h-5 w-5 text-white"
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
                                                    Memproses...
                                                </>
                                            ) : (
                                                <>
                                                    Lanjutkan ke Pembayaran
                                                    <CreditCard className="w-5 h-5 opacity-90" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>

                                <div className="h-1.5 w-full bg-amber-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SelectDate;
