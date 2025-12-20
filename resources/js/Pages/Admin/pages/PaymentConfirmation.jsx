import React, { useState, useMemo, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function PaymentConfirmation({ paymentRequests = [] }) {
    const { auth } = usePage().props;
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState("PENDING"); // Standarisasi uppercase sesuai DB
    const [processing, setProcessing] = useState(false);

    // --- HITUNG JUMLAH DATA (COUNTERS) ---
    const counts = useMemo(() => {
        return {
            ALL: paymentRequests.length,
            PENDING: paymentRequests.filter((p) => p.status?.toUpperCase() === "PENDING").length,
            APPROVED: paymentRequests.filter((p) => p.status?.toUpperCase() === "APPROVED" || p.status?.toUpperCase() === "PAID").length,
            REJECTED: paymentRequests.filter((p) => p.status?.toUpperCase() === "REJECTED").length,
        };
    }, [paymentRequests]);

    // --- HANDLE ACTIONS ---
    const handleAction = (id, actionType) => {
        const actionLabel = actionType === "Approved" ? "MENYETUJUI" : "MENOLAK";

        if (!window.confirm(`Apakah Anda yakin ingin ${actionLabel} pembayaran ini?`)) return;

        setProcessing(true);
        router.post(
            route("admin.paymentproof.status", id),
            { status: actionType },
            {
                onSuccess: () => {
                    setSelected(null);
                    setProcessing(false);
                },
                onError: () => setProcessing(false),
                onFinish: () => setProcessing(false),
                preserveScroll: true,
            }
        );
    };

    // --- FILTER DATA ---
    const filtered = paymentRequests.filter((p) => {
        const status = p.status?.toUpperCase();
        if (filter === "ALL") return true;
        if (filter === "APPROVED") return status === "APPROVED" || status === "PAID";
        return status === filter;
    });

    // Close modal on Escape key
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === "Escape") setSelected(null); };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    return (
        <AdminLayout user={auth?.user} header="Konfirmasi Pembayaran">
            <Head title="Konfirmasi Pembayaran" />

            <div className="p-4 sm:p-6 max-w-full mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                        Konfirmasi Pembayaran
                    </h1>
                    <p className="text-gray-500">
                        Verifikasi bukti transfer dari vendor untuk aktivasi paket membership.
                    </p>
                </div>

                {/* --- FILTER BUTTONS --- */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                    <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                        {[
                            { id: "PENDING", label: "Menunggu" },
                            { id: "APPROVED", label: "Disetujui" },
                            { id: "REJECTED", label: "Ditolak" },
                            { id: "ALL", label: "Semua" }
                        ].map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id)}
                                className={`flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                                    filter === f.id
                                        ? "bg-amber-600 text-white shadow-lg ring-2 ring-amber-600 ring-offset-2"
                                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <span>{f.label}</span>
                                <span className={`ml-2 py-0.5 px-2 rounded-lg text-xs font-bold ${
                                    filter === f.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                                }`}>
                                    {counts[f.id]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- TABLE --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Vendor</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Paket</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nominal</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {filtered.length > 0 ? (
                                    filtered.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50/50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{p.vendor?.name || 'N/A'}</div>
                                                <div className="text-xs text-gray-500">{p.account_name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-amber-700 font-medium bg-amber-50 px-2 py-1 rounded">
                                                    {p.package_name || 'Paket'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-gray-700">
                                                Rp {Number(p.amount).toLocaleString("id-ID")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                    p.status?.toUpperCase() === "PENDING" ? "bg-amber-100 text-amber-700" :
                                                    (p.status?.toUpperCase() === "APPROVED" || p.status?.toUpperCase() === "PAID") ? "bg-emerald-100 text-emerald-700" :
                                                    "bg-red-100 text-red-700"
                                                }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <button
                                                    onClick={() => setSelected(p)}
                                                    className="text-amber-600 hover:text-amber-700 font-bold p-2"
                                                >
                                                    Periksa Bukti
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic">
                                            Tidak ada data pembayaran ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- MODAL DETAIL --- */}
                {selected && (
                    <div 
                        className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => !processing && setSelected(null)} // Click outside to close
                    >
                        <div 
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()} // Prevent close when clicking modal content
                        >
                            {/* Gambar Bukti */}
                            <div className="flex-1 bg-black flex items-center justify-center p-2">
                                {selected.file_path ? (
                                    <img
                                        src={`/storage/${selected.file_path}`}
                                        alt="Bukti Transfer"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <div className="text-white">Tidak ada file gambar.</div>
                                )}
                            </div>

                            {/* Info & Aksi */}
                            <div className="w-full md:w-[400px] p-8 flex flex-col bg-white">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900">Detail Verifikasi</h3>
                                        <p className="text-sm text-gray-500">ID Transaksi #{selected.id}</p>
                                    </div>
                                    <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>

                                <div className="space-y-6 flex-grow">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Nama Vendor</label>
                                        <p className="text-lg font-bold text-gray-800">{selected.vendor?.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Atas Nama Rekening</label>
                                        <p className="text-lg font-bold text-gray-800">{selected.account_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Nominal Transfer</label>
                                        <p className="text-3xl font-black text-amber-600">Rp {Number(selected.amount).toLocaleString("id-ID")}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Paket Yang Dipilih</label>
                                        <p className="font-bold text-gray-700">{selected.package_name}</p>
                                    </div>
                                </div>

                                {/* Tombol Aksi */}
                                {selected.status?.toUpperCase() === "PENDING" && (
                                    <div className="mt-8 space-y-3">
                                        <button
                                            disabled={processing}
                                            onClick={() => handleAction(selected.id, "Approved")}
                                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all disabled:opacity-50"
                                        >
                                            {processing ? "Memproses..." : "Konfirmasi & Aktifkan Paket"}
                                        </button>
                                        <button
                                            disabled={processing}
                                            onClick={() => handleAction(selected.id, "Rejected")}
                                            className="w-full py-4 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 rounded-2xl font-bold transition-all disabled:opacity-50"
                                        >
                                            Tolak Pembayaran
                                        </button>
                                    </div>
                                )}
                                
                                {selected.status?.toUpperCase() !== "PENDING" && (
                                    <div className={`mt-8 p-4 rounded-2xl text-center font-bold uppercase text-sm ${
                                        (selected.status?.toUpperCase() === "APPROVED" || selected.status?.toUpperCase() === "PAID") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                                    }`}>
                                        Status: {selected.status}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}