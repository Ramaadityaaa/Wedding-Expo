import React, { useState, useMemo } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ReviewCard from "../components/ReviewCard";
import { MessageSquare, AlertCircle, CheckCircle, XCircle } from "lucide-react";

const PRIMARY_COLOR = "bg-amber-500 hover:bg-amber-600";

export default function ReviewModeration({ reviews = [] }) {
    const { auth } = usePage().props;
    const [reviewView, setReviewView] = useState("PENDING"); // Default tab Uppercase sesuai ENUM DB
    const [isProcessing, setIsProcessing] = useState(false);

    // --- HANDLE ACTIONS ---
    const handleReviewAction = (reviewId, actionType) => {
        setIsProcessing(true);

        const options = {
            onSuccess: () => setIsProcessing(false),
            onError: () => {
                setIsProcessing(false);
                alert("Gagal memproses ulasan.");
            },
            preserveScroll: true,
        };

        if (actionType === "REJECTED") {
            if (
                !confirm(
                    "Tolak ulasan ini? Ulasan tidak akan tampil di publik."
                )
            ) {
                setIsProcessing(false);
                return;
            }
            router.patch(route("admin.reviews.reject", reviewId), {}, options);
        } else if (actionType === "APPROVED") {
            router.patch(route("admin.reviews.approve", reviewId), {}, options);
        }
    };

    // --- FILTER DATA ---
    // Filter langsung berdasarkan kolom 'status' dari database
    const filteredReviews = useMemo(() => {
        return reviews.filter((r) => r.status === reviewView);
    }, [reviews, reviewView]);

    const counts = {
        PENDING: reviews.filter((r) => r.status === "PENDING").length,
        APPROVED: reviews.filter((r) => r.status === "APPROVED").length,
        REJECTED: reviews.filter((r) => r.status === "REJECTED").length,
    };

    return (
        <AdminLayout user={auth?.user} header="Moderasi Ulasan">
            <Head title="Moderasi Ulasan" />

            <div className="p-4 sm:p-6 max-w-full mx-auto font-sans">
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                        Moderasi Ulasan
                    </h1>
                    <p className="text-gray-500">
                        Kelola ulasan vendor yang masuk. Ulasan 'Rejected' tidak
                        akan dihapus, hanya disembunyikan.
                    </p>
                </div>

                {/* TABS */}
                <div className="flex space-x-3 mb-8 overflow-x-auto pb-2">
                    {["PENDING", "APPROVED", "REJECTED"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setReviewView(status)}
                            disabled={isProcessing}
                            className={`flex-shrink-0 px-6 py-2 rounded-full font-bold text-sm transition-all border flex items-center ${
                                reviewView === status
                                    ? `${PRIMARY_COLOR} text-white shadow-lg border-transparent`
                                    : "bg-white text-gray-600 hover:bg-amber-50 border-gray-200"
                            }`}
                        >
                            {/* Icon kecil di tab */}
                            {status === "PENDING" && (
                                <AlertCircle size={16} className="mr-2" />
                            )}
                            {status === "APPROVED" && (
                                <CheckCircle size={16} className="mr-2" />
                            )}
                            {status === "REJECTED" && (
                                <XCircle size={16} className="mr-2" />
                            )}

                            {status === "PENDING"
                                ? "Menunggu"
                                : status === "APPROVED"
                                ? "Disetujui"
                                : "Ditolak"}
                            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                {counts[status] || 0}
                            </span>
                        </button>
                    ))}
                </div>

                {/* GRID CONTENT */}
                {filteredReviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredReviews.map((r) => (
                            <ReviewCard
                                key={r.id}
                                review={{
                                    ...r,
                                    // Mapping data untuk props komponen ReviewCard
                                    vendorName:
                                        r.wedding_organizer?.name ||
                                        "Unknown Vendor",
                                    userName: r.user?.name || "Unknown User",
                                    content: r.comment,
                                    status: r.status, // Pass status asli (PENDING/APPROVED/REJECTED)
                                }}
                                onAction={(id, type) =>
                                    handleReviewAction(id, type)
                                } // type: 'APPROVED' or 'REJECTED'
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-16 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-gray-50 rounded-full mb-4">
                            <MessageSquare className="w-12 h-12 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                            Belum ada ulasan
                        </h3>
                        <p className="text-gray-500 mt-1">
                            Tidak ada ulasan dengan status{" "}
                            <span className="font-semibold text-amber-600">
                                {reviewView}
                            </span>
                            .
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
