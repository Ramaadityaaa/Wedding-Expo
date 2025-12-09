import React, { useState, useMemo } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function PaymentConfirmation({ paymentRequests = [] }) {
    const { auth } = usePage().props;
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState("Pending");

    // --- HITUNG JUMLAH DATA (COUNTERS) ---
    // Gunakan useMemo agar tidak dihitung ulang setiap kali render, kecuali data berubah
    const counts = useMemo(() => {
        return {
            All: paymentRequests.length,
            Pending: paymentRequests.filter((p) => p.status === "Pending")
                .length,
            Approved: paymentRequests.filter((p) => p.status === "Approved")
                .length,
            Rejected: paymentRequests.filter((p) => p.status === "Rejected")
                .length,
        };
    }, [paymentRequests]);

    // --- HANDLE ACTIONS ---
    const handleAction = (id, actionType) => {
        const confirmationText =
            actionType === "Approved" ? "menyetujui" : "menolak";

        if (
            !window.confirm(
                `Apakah Anda yakin ingin ${confirmationText} pembayaran ini?`
            )
        )
            return;

        router.post(
            route("admin.paymentproof.status", id),
            { status: actionType },
            {
                onSuccess: () => setSelected(null),
                preserveScroll: true,
            }
        );
    };

    // --- FILTER DATA ---
    const filtered = paymentRequests.filter((p) =>
        filter === "All" ? true : p.status === filter
    );

    return (
        <AdminLayout user={auth?.user} header="Konfirmasi Pembayaran">
            <Head title="Konfirmasi Pembayaran" />

            <div className="p-4 sm:p-6 max-w-full mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                        Konfirmasi Pembayaran
                    </h1>
                    <p className="text-gray-500">
                        Terima dan verifikasi bukti pembayaran vendor.
                    </p>
                </div>

                {/* --- FILTER BUTTONS DENGAN COUNTER --- */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                    <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
                        {["Pending", "Approved", "Rejected", "All"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    filter === f
                                        ? "bg-amber-600 text-white shadow-md transform scale-105"
                                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-amber-300"
                                }`}
                            >
                                <span>{f === "All" ? "Semua" : f}</span>

                                {/* Badge Angka */}
                                <span
                                    className={`ml-2 py-0.5 px-2 rounded-full text-xs font-bold ${
                                        filter === f
                                            ? "bg-white/20 text-white"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    {counts[f]}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="text-sm text-gray-500 font-medium">
                        Total Data: {counts.All}
                    </div>
                </div>

                {/* --- TABLE --- */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-amber-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Vendor
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Paket
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Nominal
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-100">
                                {filtered.length > 0 ? (
                                    filtered.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="hover:bg-gray-50 transition duration-150"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {p.vendor?.name ??
                                                    "Unknown Vendor"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600 font-bold">
                                                {p.package_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                                                Rp{" "}
                                                {Number(
                                                    p.amount
                                                ).toLocaleString("id-ID")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {p.created_at
                                                    ? new Date(
                                                          p.created_at
                                                      ).toLocaleDateString(
                                                          "id-ID",
                                                          {
                                                              day: "numeric",
                                                              month: "short",
                                                              year: "numeric",
                                                          }
                                                      )
                                                    : "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                                        p.status === "Pending"
                                                            ? "bg-amber-100 text-amber-700"
                                                            : p.status ===
                                                              "Approved"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            setSelected(p)
                                                        }
                                                        className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-medium transition"
                                                    >
                                                        Detail
                                                    </button>
                                                    {p.status === "Pending" && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    handleAction(
                                                                        p.id,
                                                                        "Approved"
                                                                    )
                                                                }
                                                                className="px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 text-xs font-medium transition shadow-sm"
                                                            >
                                                                Terima
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleAction(
                                                                        p.id,
                                                                        "Rejected"
                                                                    )
                                                                }
                                                                className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-medium transition shadow-sm"
                                                            >
                                                                Tolak
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-10 text-center text-gray-500 italic"
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="mb-2 text-2xl">
                                                    📭
                                                </span>
                                                Tidak ada data pembayaran untuk
                                                filter "{filter}".
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- MODAL DETAIL --- */}
                {selected && (
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all scale-100">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Detail Pembayaran
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        ID: #{selected.id} •{" "}
                                        {selected.vendor?.name}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelected(null)}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center p-4 min-h-[300px]">
                                    {selected.file_path ? (
                                        <img
                                            src={`/storage/${selected.file_path}`}
                                            alt="Bukti Pembayaran"
                                            className="max-h-[400px] w-full object-contain rounded-lg shadow-sm"
                                        />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <p className="text-sm">
                                                Tidak ada lampiran gambar.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                                                Pesanan Paket
                                            </p>
                                            <p className="text-xl font-extrabold text-gray-900">
                                                {selected.package_name}
                                            </p>
                                        </div>

                                        <div className="pb-4 border-b border-gray-100">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                                Nominal Transfer
                                            </p>
                                            <p className="text-3xl font-extrabold text-gray-900 font-mono">
                                                Rp{" "}
                                                {Number(
                                                    selected.amount
                                                ).toLocaleString("id-ID")}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                                Status Saat Ini
                                            </p>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                                                    selected.status ===
                                                    "Pending"
                                                        ? "bg-amber-100 text-amber-800"
                                                        : selected.status ===
                                                          "Approved"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {selected.status}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                                Pengirim
                                            </p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {selected.account_name}{" "}
                                                {selected.bank_name &&
                                                    ` (${selected.bank_name})`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        {selected.status === "Pending" ? (
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={() =>
                                                        handleAction(
                                                            selected.id,
                                                            "Rejected"
                                                        )
                                                    }
                                                    className="w-full py-3 rounded-xl border border-red-200 text-red-700 font-bold hover:bg-red-50 transition"
                                                >
                                                    Tolak
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleAction(
                                                            selected.id,
                                                            "Approved"
                                                        )
                                                    }
                                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 transition transform hover:-translate-y-0.5"
                                                >
                                                    Terima
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 p-3 rounded-lg text-center text-sm text-gray-500">
                                                Transaksi selesai:{" "}
                                                <strong>
                                                    {selected.status}
                                                </strong>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
