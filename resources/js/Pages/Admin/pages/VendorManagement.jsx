import React, { useState, useMemo, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Loader2,
    Clock,
    CheckCircle,
    XCircle,
    FileText,
    Info,
    Trash2,
} from "lucide-react";

// --- HELPER COMPONENTS ---

const PRIMARY_COLOR = "bg-amber-500 hover:bg-amber-600";

const moment = {
    format: (date) => {
        if (!date) return "-";
        try {
            const dateObj = new Date(date);
            if (isNaN(dateObj)) return "-";
            return dateObj.toLocaleDateString("id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (e) {
            return "-";
        }
    },
};

const ToastNotification = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!isVisible) return null;

    const baseStyle =
        "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl transition-opacity duration-300 z-50 transform";
    const typeStyles = {
        success: "bg-green-600 text-white",
        error: "bg-red-600 text-white",
        info: "bg-gray-700 text-white",
    };

    return (
        <div className={`${baseStyle} ${typeStyles[type] || typeStyles.info}`}>
            <p className="font-semibold">{message}</p>
        </div>
    );
};

const StatusCard = ({ title, count, colorClass, icon: Icon }) => (
    <div className={`p-5 bg-white rounded-xl shadow-lg border-l-4 ${colorClass}`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {title}
                </p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">
                    {count}
                </p>
            </div>
            <Icon className="w-8 h-8 text-gray-300" />
        </div>
    </div>
);

const ActionButton = ({ icon: Icon, title, color, onClick, disabled }) => (
    <button
        onClick={onClick}
        title={title}
        disabled={disabled}
        className={`p-2 rounded-full text-white transition duration-150 ease-in-out ${color} ${
            disabled ? "opacity-50 cursor-not-allowed" : "shadow-md hover:shadow-lg"
        }`}
    >
        <Icon className="w-5 h-5" />
    </button>
);

/**
 * ModalBase (DI-PERBAIKI):
 * - batas tinggi modal max-h-[90vh]
 * - konten (body) auto-scroll agar tidak kepotong di 100% desktop
 * - wrapper pakai overflow-hidden, body overflow-auto
 */
const ModalBase = ({
    isOpen,
    title,
    onClose,
    children,
    maxWidthClass = "max-w-lg",
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-gray-900/75 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidthClass} mx-auto overflow-hidden max-h-[90vh]`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header (tetap) */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1"
                    >
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                {/* Body (scrollable) */}
                <div className="overflow-auto max-h-[calc(90vh-72px)]">
                    {children}
                </div>
            </div>
        </div>
    );
};

const ConfirmationModal = ({
    isOpen,
    title,
    message,
    confirmText,
    confirmColor,
    onCancel,
    onConfirm,
    isProcessing,
}) => (
    <ModalBase isOpen={isOpen} title={title} onClose={onCancel}>
        <div className="p-6">
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-end space-x-3">
                <button
                    onClick={onCancel}
                    disabled={isProcessing}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition disabled:opacity-50"
                >
                    Batal
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isProcessing}
                    className={`px-4 py-2 text-sm font-semibold text-white rounded-full transition flex items-center ${
                        confirmColor || "bg-indigo-600"
                    } hover:opacity-90 disabled:opacity-50`}
                >
                    {isProcessing && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {confirmText}
                </button>
            </div>
        </div>
    </ModalBase>
);

const DetailItem = ({ label, value, color }) => (
    <div className="border-b border-gray-100 pb-3">
        <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
        <p className={`text-base font-semibold text-gray-900 ${color || ""}`}>
            {value}
        </p>
    </div>
);

/**
 * VendorDetailModal (DI-PERBAIKI):
 * - gambar tidak memaksa tinggi berlebihan
 * - pakai max-h agar aman di 100% desktop
 */
const VendorDetailModal = ({ isOpen, vendor, onClose }) => {
    const statusColor =
        vendor?.isApproved === "APPROVED"
            ? "text-green-600"
            : vendor?.isApproved === "PENDING"
            ? "text-amber-600"
            : "text-red-600";

    return (
        <ModalBase
            isOpen={isOpen}
            title="Detail Vendor"
            onClose={onClose}
            maxWidthClass="max-w-5xl"
        >
            {vendor ? (
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* LEFT: IMAGE PREVIEW */}
                    <div className="bg-black flex items-center justify-center p-3">
                        {vendor.permit_image_url ? (
                            <img
                                src={vendor.permit_image_url}
                                alt="Surat Izin Usaha"
                                className="w-full object-contain max-h-[70vh]"
                            />
                        ) : (
                            <div className="text-center p-8">
                                <p className="text-gray-300 font-semibold">
                                    Tidak ada gambar izin usaha
                                </p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Vendor belum mengunggah surat izin usaha.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: DETAILS */}
                    <div className="p-6 md:p-7">
                        <p className="text-sm text-gray-500 mb-5">
                            {vendor.id ? `ID Vendor #${vendor.id}` : ""}
                        </p>

                        <div className="space-y-4">
                            <DetailItem label="Nama Vendor" value={vendor.name || "-"} />
                            <DetailItem
                                label="Email Kontak"
                                value={vendor.email || vendor.contact_email || "-"}
                            />
                            <DetailItem
                                label="Nomor Telepon"
                                value={vendor.phone || vendor.contact_phone || "-"}
                            />
                            <DetailItem
                                label="Nomor Izin Usaha"
                                value={vendor.permit_number || "-"}
                            />
                            <DetailItem
                                label="Alamat Bisnis"
                                value={vendor.address || "Belum diisi"}
                            />
                            <DetailItem label="Kota" value={vendor.city || "-"} />
                            <DetailItem
                                label="Status Verifikasi"
                                value={vendor.isApproved || "PENDING"}
                                color={statusColor}
                            />
                            <DetailItem
                                label="Tanggal Bergabung"
                                value={moment.format(vendor.created_at)}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-6">
                    <p className="text-gray-500">Data tidak tersedia.</p>
                </div>
            )}
        </ModalBase>
    );
};

// --- MAIN COMPONENT ---
export default function VendorManagement({ vendors = [] }) {
    const { auth, flash } = usePage().props;

    const [currentStatus, setCurrentStatus] = useState("PENDING");
    const [isProcessing, setIsProcessing] = useState(false);

    const [modal, setModal] = useState({
        isOpen: false,
        vendorId: null,
        actionType: null,
        title: "",
        message: "",
        confirmText: "",
        confirmColor: "",
    });

    const [detailModal, setDetailModal] = useState({
        isOpen: false,
        vendor: null,
    });

    const [toast, setToast] = useState({ message: "", type: "" });

    useEffect(() => {
        if (flash?.success) {
            setToast({ message: flash.success, type: "success" });
        } else if (flash?.error) {
            setToast({ message: flash.error, type: "error" });
        }
    }, [flash]);

    const calculatedCounts = useMemo(() => {
        const counts = {
            TOTAL: vendors.length,
            PENDING: 0,
            APPROVED: 0,
            REJECTED: 0,
        };
        vendors.forEach((vendor) => {
            const status = vendor.isApproved || "PENDING";
            if (counts.hasOwnProperty(status)) counts[status]++;
        });
        return counts;
    }, [vendors]);

    const visibleVendors = useMemo(() => {
        return vendors.filter((v) => (v.isApproved || "PENDING") === currentStatus);
    }, [vendors, currentStatus]);

    const handleViewDetail = (vendor) => setDetailModal({ isOpen: true, vendor });

    const confirmAction = (vendor, actionType) => {
        let config = {};
        if (actionType === "delete") {
            config = {
                title: "Konfirmasi Hapus",
                message: `Hapus Vendor "${vendor.name}" permanen?`,
                confirmText: "Hapus",
                confirmColor: "bg-red-600",
            };
        } else if (actionType === "APPROVED") {
            config = {
                title: "Setujui Vendor",
                message: `Setujui pendaftaran "${vendor.name}"?`,
                confirmText: "Setujui",
                confirmColor: "bg-green-600",
            };
        } else if (actionType === "REJECTED") {
            config = {
                title: "Tolak Vendor",
                message: `Tolak pendaftaran "${vendor.name}"?`,
                confirmText: "Tolak",
                confirmColor: "bg-yellow-600",
            };
        }
        setModal({ isOpen: true, vendorId: vendor.id, actionType, ...config });
    };

    const executeAction = () => {
        const { vendorId, actionType } = modal;
        setIsProcessing(true);

        const options = {
            onSuccess: () => {
                setModal((prev) => ({ ...prev, isOpen: false }));
                setIsProcessing(false);
            },
            onError: () => {
                setToast({ message: "Gagal memproses permintaan.", type: "error" });
                setIsProcessing(false);
            },
        };

        if (actionType === "delete") {
            router.delete(route("admin.vendors.destroy", vendorId), options);
        } else {
            router.patch(
                route("admin.vendors.update-status", vendorId),
                { status: actionType },
                options
            );
        }
    };

    const getStatusStyle = (status) => {
        const lower = (status || "").toLowerCase();
        if (lower === "approved") return "bg-green-100 text-green-800 border-green-300";
        if (lower === "pending") return "bg-amber-100 text-amber-800 border-amber-300";
        return "bg-red-100 text-red-800 border-red-300";
    };

    return (
        <AdminLayout user={auth?.user} header="Manajemen Vendor">
            <Head title="Manajemen Vendor" />

            <div className="py-2">
                <div className="max-w-full mx-auto">
                    <div className="mb-6">
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                            Verifikasi Vendor
                        </h1>
                        <p className="text-gray-500">
                            Kelola persetujuan dan status akun Vendor baru.
                        </p>
                    </div>

                    {/* Statistik Ringkas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <StatusCard
                            title="Pending"
                            count={calculatedCounts.PENDING}
                            colorClass="border-amber-500"
                            icon={Clock}
                        />
                        <StatusCard
                            title="Approved"
                            count={calculatedCounts.APPROVED}
                            colorClass="border-green-500"
                            icon={CheckCircle}
                        />
                        <StatusCard
                            title="Rejected"
                            count={calculatedCounts.REJECTED}
                            colorClass="border-red-500"
                            icon={XCircle}
                        />
                        <StatusCard
                            title="Total"
                            count={calculatedCounts.TOTAL}
                            colorClass="border-indigo-500"
                            icon={FileText}
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex space-x-2 sm:space-x-4 mb-6 overflow-x-auto pb-2">
                        {["PENDING", "APPROVED", "REJECTED"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setCurrentStatus(status)}
                                className={`px-4 sm:px-6 py-2 rounded-full font-semibold whitespace-nowrap transition border ${
                                    currentStatus === status
                                        ? `${PRIMARY_COLOR} text-white shadow-lg border-transparent`
                                        : "bg-white text-gray-600 hover:bg-amber-50 border-gray-200"
                                }`}
                            >
                                {status.charAt(0) + status.slice(1).toLowerCase()} (
                                {calculatedCounts[status]})
                            </button>
                        ))}
                    </div>

                    {/* Tabel Data */}
                    <div className="overflow-x-auto bg-white rounded-xl shadow-2xl border border-gray-100">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-amber-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                        Nama Vendor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                        Dibuat Pada
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {visibleVendors.length > 0 ? (
                                    visibleVendors.map((vendor) => (
                                        <tr
                                            key={vendor.id}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {vendor.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {moment.format(vendor.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span
                                                    className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusStyle(
                                                        vendor.isApproved
                                                    )}`}
                                                >
                                                    {vendor.isApproved || "PENDING"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <div className="flex justify-center space-x-2">
                                                    <ActionButton
                                                        icon={Info}
                                                        title="Detail"
                                                        color="bg-indigo-500 hover:bg-indigo-600"
                                                        onClick={() => handleViewDetail(vendor)}
                                                    />
                                                    {vendor.isApproved !== "APPROVED" && (
                                                        <ActionButton
                                                            icon={CheckCircle}
                                                            title="Setujui"
                                                            color="bg-green-500 hover:bg-green-600"
                                                            onClick={() =>
                                                                confirmAction(vendor, "APPROVED")
                                                            }
                                                        />
                                                    )}
                                                    {vendor.isApproved !== "REJECTED" && (
                                                        <ActionButton
                                                            icon={XCircle}
                                                            title="Tolak"
                                                            color="bg-yellow-500 hover:bg-yellow-600"
                                                            onClick={() =>
                                                                confirmAction(vendor, "REJECTED")
                                                            }
                                                        />
                                                    )}
                                                    <ActionButton
                                                        icon={Trash2}
                                                        title="Hapus"
                                                        color="bg-red-500 hover:bg-red-600"
                                                        onClick={() => confirmAction(vendor, "delete")}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center py-12 text-gray-500 italic"
                                        >
                                            <div className="flex flex-col items-center">
                                                <Info className="w-12 h-12 text-gray-300 mb-2" />
                                                <p>
                                                    Tidak ada data vendor di kategori {currentStatus}.
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Data baru akan muncul otomatis di sini setelah registrasi.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Modals & Toast */}
                    <ConfirmationModal
                        isOpen={modal.isOpen}
                        title={modal.title}
                        message={modal.message}
                        confirmText={modal.confirmText}
                        confirmColor={modal.confirmColor}
                        isProcessing={isProcessing}
                        onCancel={() => setModal((prev) => ({ ...prev, isOpen: false }))}
                        onConfirm={executeAction}
                    />

                    <VendorDetailModal
                        isOpen={detailModal.isOpen}
                        vendor={detailModal.vendor}
                        onClose={() => setDetailModal({ isOpen: false, vendor: null })}
                    />

                    <ToastNotification
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast({ message: "", type: "" })}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
