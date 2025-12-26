import React, { useMemo, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ReviewCard from "../components/ReviewCard";
import { MessageSquare, AlertCircle, CheckCircle, XCircle } from "lucide-react";

const PRIMARY_COLOR = "bg-amber-500 hover:bg-amber-600";

export default function ReviewModeration({ reviews = [] }) {
  const { auth } = usePage().props;

  const [reviewView, setReviewView] = useState("PENDING");
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Normalisasi actionType biar aman:
   * - "approve" / "approved" / "APPROVED" -> "APPROVED"
   * - "reject" / "rejected" / "REJECTED" -> "REJECTED"
   */
  const normalizeAction = (actionType) => {
    const t = String(actionType || "").trim().toUpperCase();
    if (t === "APPROVED" || t === "APPROVE") return "APPROVED";
    if (t === "REJECTED" || t === "REJECT" || t === "DECLINED") return "REJECTED";
    return "";
  };

  const handleReviewAction = (reviewId, actionType) => {
    const action = normalizeAction(actionType);

    if (!reviewId || !action) return;

    if (isProcessing) return;
    setIsProcessing(true);

    const options = {
      preserveScroll: true,
      // onFinish lebih aman daripada onSuccess, karena pasti kepanggil
      // baik sukses ataupun error
      onFinish: () => setIsProcessing(false),
      onError: () => alert("Gagal memproses ulasan."),
    };

    if (action === "REJECTED") {
      const ok = confirm("Tolak ulasan ini? Ulasan tidak akan tampil di publik.");
      if (!ok) {
        setIsProcessing(false);
        return;
      }
      router.patch(route("admin.reviews.reject", reviewId), {}, options);
      return;
    }

    if (action === "APPROVED") {
      router.patch(route("admin.reviews.approve", reviewId), {}, options);
      return;
    }

    setIsProcessing(false);
  };

  const filteredReviews = useMemo(() => {
    return (reviews || []).filter((r) => r?.status === reviewView);
  }, [reviews, reviewView]);

  const counts = useMemo(() => {
    const list = reviews || [];
    return {
      PENDING: list.filter((r) => r?.status === "PENDING").length,
      APPROVED: list.filter((r) => r?.status === "APPROVED").length,
      REJECTED: list.filter((r) => r?.status === "REJECTED").length,
    };
  }, [reviews]);

  return (
    <AdminLayout user={auth?.user} header="Moderasi Ulasan">
      <Head title="Moderasi Ulasan" />

      <div className="p-4 sm:p-6 max-w-full mx-auto font-sans">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Moderasi Ulasan
          </h1>
          <p className="text-gray-500">
            Kelola ulasan vendor yang masuk. Ulasan 'Rejected' tidak akan dihapus,
            hanya disembunyikan.
          </p>
        </div>

        {/* TABS */}
        <div className="flex space-x-3 mb-8 overflow-x-auto pb-2">
          {["PENDING", "APPROVED", "REJECTED"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setReviewView(status)}
              disabled={isProcessing}
              className={`flex-shrink-0 px-6 py-2 rounded-full font-bold text-sm transition-all border flex items-center ${
                reviewView === status
                  ? `${PRIMARY_COLOR} text-white shadow-lg border-transparent`
                  : "bg-white text-gray-600 hover:bg-amber-50 border-gray-200"
              } ${isProcessing ? "opacity-60 cursor-not-allowed" : ""}`}
            >
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
                  // Pastikan mapping relasi sesuai backend-mu
                  // Kalau backend pakai relasi "vendor", ini sudah benar.
                  // Kalau backend masih "weddingOrganizer", ganti di sini.
                  vendorName: r.vendor?.name || "Unknown Vendor",
                  userName: r.user?.name || "Unknown User",
                  content: r.comment,
                  status: r.status,
                }}
                onAction={handleReviewAction}
                isProcessing={isProcessing}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-16 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <MessageSquare className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Belum ada ulasan</h3>
            <p className="text-gray-500 mt-1">
              Tidak ada ulasan dengan status{" "}
              <span className="font-semibold text-amber-600">{reviewView}</span>.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
