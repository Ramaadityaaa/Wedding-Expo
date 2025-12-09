import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import { Star, MessageCircle, Reply, User, X } from "lucide-react";

const StarRating = ({ rating }) => {
    return (
        <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={16}
                    fill={i < rating ? "currentColor" : "none"}
                    className={i < rating ? "text-amber-400" : "text-gray-300"}
                />
            ))}
        </div>
    );
};

export default function ReviewPage({ auth, reviews = [], stats = null }) {
    // SAFETY CHECK: Gunakan default value agar tidak crash jika stats undefined
    const safeStats = stats || {
        total_reviews: 0,
        average_rating: 0,
        stars_5: 0,
        stars_4: 0,
        stars_3: 0,
        stars_2: 0,
        stars_1: 0,
    };

    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    const { data, setData, post, processing, reset } = useForm({
        reply: "",
    });

    const openReplyModal = (review) => {
        setSelectedReview(review);
        setData("reply", review.reply || "");
        setReplyModalOpen(true);
    };

    const submitReply = (e) => {
        e.preventDefault();
        post(route("vendor.reviews.reply", selectedReview.id), {
            onSuccess: () => {
                setReplyModalOpen(false);
                reset();
            },
        });
    };

    return (
        <VendorLayout user={auth.user} header="Ulasan Klien">
            <Head title="Ulasan Klien" />

            <div className="py-6">
                {/* --- BAGIAN 1: STATISTIK --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Card Total Review */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <MessageCircle size={32} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">
                                Total Ulasan
                            </p>
                            {/* Gunakan safeStats */}
                            <h3 className="text-3xl font-bold text-gray-800">
                                {safeStats.total_reviews}
                            </h3>
                        </div>
                    </div>

                    {/* Card Average Rating */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                            <Star size={32} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">
                                Rata-rata Rating
                            </p>
                            {/* Gunakan safeStats */}
                            <h3 className="text-3xl font-bold text-gray-800">
                                {Number(safeStats.average_rating).toFixed(1)}{" "}
                                <span className="text-sm text-gray-400 font-normal">
                                    / 5.0
                                </span>
                            </h3>
                        </div>
                    </div>

                    {/* Card Breakdown */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm mb-2">
                            Kepuasan Klien
                        </p>
                        <div className="space-y-1">
                            {[5, 4, 3, 2, 1].map((star) => {
                                // Gunakan safeStats
                                const count = safeStats[`stars_${star}`];
                                const percentage =
                                    safeStats.total_reviews > 0
                                        ? (count / safeStats.total_reviews) *
                                          100
                                        : 0;
                                return (
                                    <div
                                        key={star}
                                        className="flex items-center gap-2 text-xs"
                                    >
                                        <span className="w-3">{star}</span>
                                        <Star
                                            size={10}
                                            className="text-amber-400"
                                            fill="currentColor"
                                        />
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-400 rounded-full"
                                                style={{
                                                    width: `${percentage}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-gray-400 w-6 text-right">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* --- BAGIAN 2: LIST REVIEW --- */}
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Apa Kata Mereka?
                </h3>

                {reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                                            {review.user?.profile_photo_url ? (
                                                <img
                                                    src={
                                                        review.user
                                                            .profile_photo_url
                                                    }
                                                    alt={review.user.name}
                                                />
                                            ) : (
                                                <User size={24} />
                                            )}
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-gray-900">
                                                {review.user?.name ||
                                                    "Customer"}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <StarRating
                                                    rating={review.rating}
                                                />
                                                <span className="text-xs text-gray-400">
                                                    •{" "}
                                                    {new Date(
                                                        review.created_at
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                            <p className="mt-3 text-gray-700 leading-relaxed">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => openReplyModal(review)}
                                        className="text-gray-400 hover:text-blue-600 transition p-2 rounded-full hover:bg-blue-50"
                                        title="Balas Ulasan"
                                    >
                                        <Reply size={20} />
                                    </button>
                                </div>

                                {review.reply && (
                                    <div className="mt-4 ml-16 bg-gray-50 p-4 rounded-xl border-l-4 border-amber-500">
                                        <p className="text-xs font-bold text-amber-600 mb-1">
                                            Balasan Anda:
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {review.reply}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">
                            Belum ada ulasan
                        </h3>
                        <p className="text-gray-500">
                            Ulasan akan muncul di sini setelah klien memberikan
                            penilaian.
                        </p>
                    </div>
                )}
            </div>

            {/* --- MODAL REPLY --- */}
            {replyModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">
                                Balas Ulasan
                            </h3>
                            <button
                                onClick={() => setReplyModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={submitReply} className="p-6">
                            <div className="mb-4 bg-gray-50 p-3 rounded-lg text-sm text-gray-600 italic">
                                "{selectedReview?.comment}"
                            </div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tulis Balasan
                            </label>
                            <textarea
                                value={data.reply}
                                onChange={(e) =>
                                    setData("reply", e.target.value)
                                }
                                className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500 h-32"
                                placeholder="Terima kasih atas masukannya..."
                                required
                            ></textarea>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setReplyModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md transition disabled:opacity-50"
                                >
                                    {processing
                                        ? "Mengirim..."
                                        : "Kirim Balasan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </VendorLayout>
    );
}
