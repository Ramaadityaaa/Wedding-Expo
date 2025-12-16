    import React, { useState } from "react";
    import { Head, router } from "@inertiajs/react";
    import VendorLayout from "@/Layouts/VendorLayout";
    import { useToast } from "@/Components/ui/use-toast";
    import Pagination from "@/Components/ui/pagination"; 
    import {
        CircleCheck,
        Truck,
        Clock,
        XCircle,
        ClipboardCheck,
        ListTodo,
        DollarSign,
        Package,
        ShieldCheck, 
        Download, 
        Zap, // Icon baru untuk "Diproses"
    } from "lucide-react";

    // --- Helper Format Rupiah (Sama) ---
    const formatCurrency = (number) => {
        const safeNumber = Number(number) || 0;
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(safeNumber);
    };

    // --- Helper Format Tanggal (Sama) ---
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString("id-ID", options);
    };

    // --- Komponen Badge Status (DISESUAIKAN UNTUK 3 STATUS UTAMA) ---
    const StatusBadge = ({ status }) => {
        const safeStatus = status ? status.toUpperCase() : "UNKNOWN";

        // Peta status untuk 3 tab utama:
        const styles = {
            PENDING: { // Customer belum bayar (Data Backend)
                class: "bg-yellow-100 text-yellow-800 border-yellow-200",
                icon: <Clock className="w-3 h-3 mr-1" />,
                label: "Menunggu Upload Bukti",
            },
            PAID: { // Customer sudah bayar, menunggu verifikasi (Data Backend)
                class: "bg-amber-100 text-amber-800 border-amber-200", 
                icon: <ShieldCheck className="w-3 h-3 mr-1" />,
                label: "Verifikasi Pembayaran", 
            },
            PROCESSED: { // Sudah diverifikasi, sedang dikerjakan (Data Backend)
                class: "bg-blue-200 text-blue-800 border-blue-300", 
                icon: <Zap className="w-3 h-3 mr-1" />,
                label: "Sedang Diproses", 
            },
            COMPLETED: { // Selesai dikerjakan/dikirim (Data Backend)
                class: "bg-green-100 text-green-800 border-green-200",
                icon: <ClipboardCheck className="w-3 h-3 mr-1" />,
                label: "Selesai",
            },
            CANCELED: {
                class: "bg-red-100 text-red-800 border-red-200",
                icon: <XCircle className="w-3 h-3 mr-1" />,
                label: "Dibatalkan",
            },
            UNKNOWN: {
                class: "bg-gray-100",
                icon: null,
                label: "Tidak Diketahui",
            },
        };

        const statusInfo = styles[safeStatus] || styles.UNKNOWN;

        return (
            <span
                className={`flex items-center w-fit px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.class}`}
            >
                {statusInfo.icon}
                {statusInfo.label}
            </span>
        );
    };

    // --- Komponen Summary Card Dinamis (Disempurnakan) ---
    const SummaryCard = ({ title, count, icon, color }) => (
        <div className={`p-5 rounded-xl shadow-lg border border-gray-100 bg-white flex items-center justify-between transition-all duration-300 hover:shadow-xl`}>
            <div>
                <p className="text-sm font-semibold text-gray-500">{title}</p>
                <h2 className={`text-3xl font-bold mt-1 ${color}`}>{count ?? 0}</h2> 
            </div>
            <div className={`p-3 rounded-full ${color.replace('text', 'bg').replace('-600', '-100')}`}>
                {React.cloneElement(icon, { className: `w-6 h-6 ${color}` })}
            </div>
        </div>
    );


    // --- Komponen OrderManagementPage ---
    export default function OrderManagementPage({ 
        auth, 
        orders = { data: [] }, 
        currentStatus, // Ini akan menjadi 'waiting', 'processed', atau 'completed'
        summaryData = { waiting: 0, processed: 0, completed: 0, total_pending: 0, total_paid: 0 } // Gunakan total_pending dan total_paid untuk menghitung waiting
    }) {
        const { toast } = useToast();
        const [selectedOrder, setSelectedOrder] = useState(null);
        const [isProcessing, setIsProcessing] = useState(false);
        
        // Status UI aktif akan menjadi 'waiting', 'processed', atau 'completed'
        const activeStatus = currentStatus || 'waiting'; 

        // --- Definisi Tab Baru (3 Opsi) ---
        const statusTabs = [
            // Tab ini mewakili PENDING (belum bayar) + PAID (menunggu verifikasi)
            { label: "Menunggu Bayar", value: "waiting", icon: <Clock /> }, 
            { label: "Diproses", value: "processed", icon: <Zap /> },     
            { label: "Selesai", value: "completed", icon: <ClipboardCheck /> },       
        ];
        
        // Total 'waiting' dihitung dari PENDING + PAID di backend
        const totalWaiting = (summaryData.total_pending || 0) + (summaryData.total_paid || 0);

        const getCount = (statusValue) => {
            if (statusValue === 'waiting') return totalWaiting;
            return summaryData[statusValue] ?? 0;
        }


        // Mengubah rute untuk Tab Navigation
        const handleTabChange = (status) => {
            router.get(route("vendor.orders.index", { status: status }), {}, {
                preserveScroll: true,
                preserveState: false, 
            });
        };
        
        // --- Aksi Approve Payment ---
        // Logika ini hanya dipanggil saat order berada di tab 'waiting' dan status datanya 'paid'
        const handleApprovePayment = (orderId) => {
            if (!confirm(`Apakah Anda yakin ingin MENERIMA pembayaran untuk Order #${orderId} ini? Order akan dipindahkan ke status Diproses.`)) return;

            setIsProcessing(true);
            router.patch(
                route("vendor.orders.approvePayment", orderId), // Endpoint ini harus mengubah status dari PAID ke PROCESSED
                {},
                {
                    onSuccess: () => {
                        setIsProcessing(false);
                        setSelectedOrder(null);
                        toast({
                            title: "Berhasil!",
                            description: `Pembayaran Order #${orderId} berhasil dikonfirmasi dan dipindahkan ke status Diproses.`,
                            className: "bg-green-600 text-white",
                        });
                    },
                    onError: (errors) => {
                        setIsProcessing(false);
                        console.error(errors);
                        toast({
                            title: "Gagal!",
                            description: "Gagal mengkonfirmasi pembayaran. Cek konsol untuk detail.",
                            className: "bg-red-600 text-white",
                        });
                    },
                }
            );
        };

        // --- Aksi Complete Order ---
        // Logika ini hanya dipanggil saat order berada di tab 'processed'
        const handleCompleteOrder = (orderId) => {
            if (!confirm(`Apakah Anda yakin ingin menandai Order #${orderId} ini SELESAI?`)) return;

            setIsProcessing(true);
            router.patch(
                route("vendor.orders.complete", orderId), // Endpoint ini harus mengubah status dari PROCESSED ke COMPLETED
                {},
                {
                    onSuccess: () => {
                        setIsProcessing(false);
                        toast({
                            title: "Berhasil!",
                            description: `Order #${orderId} berhasil ditandai sebagai Selesai (Completed).`,
                            className: "bg-blue-600 text-white",
                        });
                    },
                    onError: (errors) => {
                        setIsProcessing(false);
                        console.error(errors);
                        toast({
                            title: "Gagal!",
                            description: "Gagal menyelesaikan pesanan. Cek konsol untuk detail.",
                            className: "bg-red-600 text-white",
                        });
                    },
                }
            );
        };

        const orderList = orders.data || []; 
        const paginationLinks = orders.links || [];
        
        return (
            <VendorLayout user={auth.user}>
                <Head title="Manajemen Pesanan" />

                <div className="p-6 bg-gray-50 min-h-screen">
                    <div className="max-w-7xl mx-auto">
                        
                        {/* Header Halaman */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900">
                                    📦 Manajemen Pesanan
                                </h1>
                                <p className="text-gray-500 mt-1">
                                    Kelola semua pesanan yang masuk dan pantau statusnya.
                                </p>
                            </div>
                        </div>

                        {/* Summary Cards DINAMIS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <SummaryCard 
                                title="Menunggu Bayar Total" 
                                count={totalWaiting} 
                                icon={<Clock />} 
                                color="text-amber-600" // Warna gabungan
                            />
                            <SummaryCard 
                                title="Sedang Diproses" 
                                count={summaryData.processed} 
                                icon={<Zap />} 
                                color="text-blue-600"
                            />
                            <SummaryCard 
                                title="Selesai (Completed)" 
                                count={summaryData.completed} 
                                icon={<ClipboardCheck />} 
                                color="text-green-600"
                            />
                        </div>

                        {/* Navigasi Tab Status DINAMIS */}
                        <div className="flex justify-between items-end border-b-2 border-gray-200 mb-6 bg-gray-50 pt-2 z-10">
                            <div className="flex space-x-2">
                                {statusTabs.map((tab) => (
                                    <button
                                        key={tab.value}
                                        onClick={() => handleTabChange(tab.value)}
                                        className={`px-5 py-3 text-base font-bold rounded-t-xl transition-all duration-200 
                                            ${(activeStatus === tab.value) 
                                                ? "text-amber-700 border-b-4 border-amber-700 bg-white shadow-t"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-b-4 border-transparent"
                                            }`}
                                    >
                                        {tab.label} ({getCount(tab.value)})
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tabel Pesanan */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            {orderList.length === 0 ? ( 
                                <div className="p-10 text-center text-gray-500">
                                    <ListTodo className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                                    <h3 className="font-semibold text-lg text-gray-700">Tidak Ada Pesanan</h3>
                                    <p>Tidak ada pesanan di tab **{statusTabs.find(t => t.value === activeStatus)?.label}** saat ini.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-600">
                                        <thead className="bg-gray-100 border-b border-gray-200 text-gray-800 font-bold uppercase tracking-wider">
                                            <tr>
                                                <th className="p-4 w-16">ID</th>
                                                <th className="p-4">Customer</th>
                                                <th className="p-4">Paket</th>
                                                <th className="p-4 w-40">Total & Tanggal</th>
                                                <th className="p-4 w-40">Status</th>
                                                <th className="p-4 text-center w-32">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {orderList.map((order) => { 
                                                const displayPrice = order.total_price ?? order.price ?? order.amount ?? order.package?.price ?? 0;
                                                const statusUpper = order.status ? order.status.toUpperCase() : "PENDING"; 
                                                
                                                return (
                                                    <tr
                                                        key={order.id}
                                                        className="hover:bg-amber-50 transition"
                                                    >
                                                        <td className="p-4 font-mono font-bold text-gray-900">
                                                            #{order.id}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="font-bold text-gray-800">
                                                                {order.user?.name || "Guest"}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {order.user?.email || "-"}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 font-medium flex items-center">
                                                            <Package className="w-4 h-4 mr-2 text-blue-500" />
                                                            {order.package?.name || "Paket Dihapus"}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="font-bold text-amber-600 flex items-center">
                                                                <DollarSign className="w-4 h-4 mr-1"/>
                                                                {formatCurrency(displayPrice)}
                                                            </div>
                                                            <div className="text-xs text-gray-400 mt-1">
                                                                {formatDate(order.created_at)}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <StatusBadge status={statusUpper} />
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            {/* Logika Tombol Aksi DINAMIS */}
                                                            {/* Di tab "Menunggu Bayar" (waiting), aksi ada untuk PAID (perlu dicek) */}
                                                            {statusUpper === "PAID" && (
                                                                <button
                                                                    onClick={() => setSelectedOrder(order)}
                                                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-md transition transform hover:scale-105 flex items-center justify-center mx-auto"
                                                                >
                                                                    <ShieldCheck className="w-3 h-3 mr-1"/> Cek Bukti
                                                                </button>
                                                            )}
                                                            
                                                            {/* Di tab "Diproses" (processed), aksi ada untuk PROCESSED */}
                                                            {statusUpper === "PROCESSED" && (
                                                                <button
                                                                    onClick={() => handleCompleteOrder(order.id)}
                                                                    disabled={isProcessing}
                                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md transition transform hover:scale-105 disabled:opacity-50 flex items-center justify-center mx-auto"
                                                                >
                                                                    <ClipboardCheck className="w-3 h-3 mr-1"/> {isProcessing ? "Menyelesaikan..." : "Tandai Selesai"}
                                                                </button>
                                                            )}

                                                            {/* Di tab "Menunggu Bayar", jika status datanya masih PENDING (belum upload) */}
                                                            {statusUpper === "PENDING" && (
                                                                <span className="text-yellow-500 text-xs italic border border-yellow-200 px-2 py-1 rounded-md bg-yellow-50 font-medium">
                                                                    Menunggu Upload Bukti
                                                                </span>
                                                            )}

                                                            {/* Di tab "Selesai", jika status datanya COMPLETED */}
                                                            {statusUpper === "COMPLETED" && (
                                                                <span className="text-green-500 text-xs italic border border-green-200 px-2 py-1 rounded-md bg-green-50 font-medium">
                                                                    Selesai Diproses
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            
                            {/* Komponen Pagination */}
                            {orderList.length > 0 && paginationLinks.length > 3 && (
                                <div className="p-4 border-t border-gray-100 bg-gray-50">
                                    <Pagination links={paginationLinks} /> 
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MODAL CEK BUKTI PEMBAYARAN (Sama dengan sebelumnya) */}
                    {selectedOrder && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
                                {/* Header Modal */}
                                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-amber-50">
                                    <h3 className="font-bold text-lg text-gray-800">
                                        Verifikasi Pembayaran Order #{selectedOrder.id}
                                    </h3>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="text-gray-400 hover:text-gray-600 transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>

                                {/* Body Modal */}
                                <div className="p-6">
                                    {(() => {
                                        const payment = Array.isArray(selectedOrder.orderPayment) 
                                            ? selectedOrder.orderPayment[0] 
                                            : selectedOrder.orderPayment;

                                        const displayPrice = selectedOrder.total_price ?? selectedOrder.price ?? selectedOrder.amount ?? selectedOrder.package?.price ?? 0;
                                        
                                        const hasProofFile = payment && payment.proof_file; 
                                        
                                        if (!payment) {
                                            return (
                                                <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
                                                    <XCircle className="w-8 h-8 mx-auto text-red-500 mb-3" />
                                                    <p className="font-semibold text-red-700">Data Pembayaran Tidak Ditemukan!</p>
                                                    <p className="text-sm text-red-500 mt-1">Order mungkin belum diunggah bukti, atau terjadi kesalahan relasi data.</p>
                                                </div>
                                            );
                                        }

                                        return (
                                            <>
                                                {/* Info Pembayaran */}
                                                <div className="mb-4">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                        Info Pembayaran
                                                    </label>
                                                    <div className="mt-1 bg-gray-50 p-3 rounded-lg border">
                                                        <p className="font-semibold text-gray-800 text-sm">
                                                            Pengirim: {payment.account_name || "Nama Tidak Terdeteksi"}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mb-2">
                                                            Bank Sumber: {payment.bank_source || "-"}
                                                        </p>
                                                        <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                                                            <p className="text-sm font-medium text-gray-600">Total Dibayar (Harusnya):</p>
                                                            <span className="text-amber-600 font-bold text-lg">
                                                                {formatCurrency(displayPrice)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bukti Transfer */}
                                                <div className="mb-6">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                                        Bukti Transfer
                                                    </label>
                                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-2 bg-gray-50 flex justify-center items-center min-h-[200px]">
                                                        {hasProofFile ? (
                                                            <a
                                                                href={`/storage/${payment.proof_file}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="flex flex-col items-center"
                                                            >
                                                                <img
                                                                    src={`/storage/${payment.proof_file}`}
                                                                    alt="Bukti Transfer"
                                                                    className="max-h-64 object-contain rounded-lg shadow-sm hover:scale-105 transition duration-300 cursor-zoom-in"
                                                                />
                                                                <button 
                                                                    className="mt-3 px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded flex items-center hover:bg-gray-300"
                                                                >
                                                                    <Download className="w-3 h-3 mr-1"/> Lihat / Unduh
                                                                </button>
                                                            </a>
                                                        ) : (
                                                            <div className="text-center py-8">
                                                                <p className="text-gray-400 italic">
                                                                    File bukti tidak ditemukan.
                                                                </p>
                                                                <p className="text-xs text-red-400 mt-1">
                                                                    (Customer belum upload bukti transfer.)
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* Action Buttons */}
                                                <div className="grid grid-cols-2 gap-4 pt-2">
                                                    <button
                                                        onClick={() =>
                                                            alert("Fitur Tolak pembayaran memerlukan implementasi refund atau notifikasi khusus. Untuk saat ini, fungsi ini dinonaktifkan.")
                                                        }
                                                        disabled={true} 
                                                        className="py-3 px-4 rounded-xl border-2 border-red-100 text-red-600 font-bold hover:bg-red-50 hover:border-red-200 transition disabled:opacity-50"
                                                    >
                                                        Tolak (Disabled)
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleApprovePayment(selectedOrder.id)
                                                        }
                                                        disabled={isProcessing || !hasProofFile} 
                                                        className="py-3 px-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition disabled:opacity-50"
                                                    >
                                                        {isProcessing
                                                            ? "Memproses..."
                                                            : "Terima Pembayaran"}
                                                    </button>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </VendorLayout>
        );
    }