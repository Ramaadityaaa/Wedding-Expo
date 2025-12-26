import React, { useMemo, useState } from "react";
import { Head, router, Link } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import CustomerGlobalChat from "@/Components/CustomerGlobalChat";
import {
  MapPin,
  Star,
  MessageSquare,
  CheckCircle,
  Package,
  Image as ImageIcon,
  Info,
  Heart,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

function StarRatingInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="p-1 rounded hover:bg-gray-100 transition"
          aria-label={`Beri rating ${n}`}
        >
          <Star
            size={22}
            className={n <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">
        {value ? `${value}/5` : "Pilih bintang"}
      </span>
    </div>
  );
}

function StarsDisplay({ value }) {
  const v = Number(value || 0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={16}
          className={n <= v ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

export default function VendorDetails({
  auth,
  vendor,
  isFavorited = false,
  avgRating = 0,
  reviewCount = 0,
  myReview = null,
}) {
  const [activeTab, setActiveTab] = useState("packages");
  const [targetVendorForChat, setTargetVendorForChat] = useState(null);

  const [favorited, setFavorited] = useState(!!isFavorited);
  const [favProcessing, setFavProcessing] = useState(false);

  // REVIEW UI STATE
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(myReview?.rating || 0);
  const [comment, setComment] = useState(myReview?.comment || "");
  const [reviewProcessing, setReviewProcessing] = useState(false);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // ✅ HEADER RATING HARUS DARI BACKEND (BIAR KONSISTEN)
  const headerAverage = useMemo(() => Number(avgRating || 0).toFixed(1), [avgRating]);
  const headerCount = useMemo(() => Number(reviewCount || 0), [reviewCount]);

  const handleChatClick = () => {
    if (!auth?.user) {
      alert("Silakan login atau register sebagai Customer untuk chat dengan vendor.");
      window.location.href = "/login";
      return;
    }

    if (auth.user.id === vendor.user_id) {
      alert("Anda tidak bisa mengirim pesan ke diri sendiri.");
      return;
    }

    setTargetVendorForChat({
      id: vendor.user_id,
      name: vendor.name,
      avatar: vendor.logo ? `/storage/${vendor.logo}` : null,
    });
  };

  const handleToggleFavorite = () => {
    if (!auth?.user) {
      alert("Silakan login terlebih dahulu untuk menambahkan favorit.");
      window.location.href = "/login";
      return;
    }
    if (favProcessing) return;

    const next = !favorited;
    setFavorited(next);
    setFavProcessing(true);

    router.post(route("favorites.toggle", vendor.id), {}, {
      preserveScroll: true,
      onFinish: () => setFavProcessing(false),
      onError: () => {
        setFavorited(!next);
        alert("Gagal memperbarui favorit. Coba lagi.");
      },
    });
  };

  const openReviewModal = () => {
    if (!auth?.user) {
      alert("Silakan login dulu untuk memberikan ulasan.");
      window.location.href = "/login";
      return;
    }
    setRating(myReview?.rating || 0);
    setComment(myReview?.comment || "");
    setReviewModalOpen(true);
  };

  const submitReview = (e) => {
    e.preventDefault();

    if (!rating || rating < 1) {
      alert("Pilih rating bintang minimal 1.");
      return;
    }
    if (!comment || comment.trim().length < 3) {
      alert("Tulis ulasan minimal 3 karakter.");
      return;
    }
    if (reviewProcessing) return;

    setReviewProcessing(true);

    router.post(
      route("customer.reviews.upsert", vendor.id),
      { rating, comment },
      {
        preserveScroll: true,
        onFinish: () => {
          setReviewProcessing(false);
          setReviewModalOpen(false);
        },
        onError: () => {
          setReviewProcessing(false);
          alert("Gagal menyimpan ulasan. Coba lagi.");
        },
      }
    );
  };

  const deleteReview = () => {
    if (!auth?.user) return;
    if (!myReview) return;

    const ok = confirm("Yakin mau menghapus ulasan kamu?");
    if (!ok) return;

    router.delete(route("customer.reviews.destroy", vendor.id), {
      preserveScroll: true,
      onError: () => alert("Gagal menghapus ulasan. Coba lagi."),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Head title={`${vendor.name} - Detail Vendor`} />
      <Navbar auth={auth} />

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="h-48 md:h-64 bg-gradient-to-r from-amber-100 to-yellow-50 relative">
              {vendor.portfolios?.length > 0 ? (
                <img
                  src={`/storage/${vendor.portfolios[0].imageUrl}`}
                  className="w-full h-full object-cover opacity-60"
                  alt="Cover Vendor"
                />
              ) : (
                <div className="w-full h-full bg-amber-50 flex items-center justify-center text-amber-200">
                  <ImageIcon size={64} />
                </div>
              )}
            </div>

            <div className="px-8 pb-8">
              <div className="relative flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white p-1 shadow-lg flex-shrink-0">
                  <div className="w-full h-full bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 text-3xl font-bold overflow-hidden">
                    {vendor.logo ? (
                      <img
                        src={`/storage/${vendor.logo}`}
                        className="w-full h-full object-cover"
                        alt={vendor.name}
                      />
                    ) : (
                      vendor.name?.charAt(0)
                    )}
                  </div>
                </div>

                <div className="md:ml-6 mt-4 md:mt-0 flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600 text-sm">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1 text-amber-500" />
                      {vendor.address || "Lokasi tidak tersedia"}
                    </div>

                    {/* ✅ FIX: rating & count dari props backend */}
                    <div className="flex items-center">
                      <Star size={16} className="mr-1 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900 mr-1">
                        {headerAverage}
                      </span>
                      ({headerCount} Ulasan)
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex items-center gap-3">
                  {/* Favorit */}
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    disabled={favProcessing}
                    className={`
                      inline-flex items-center justify-center
                      w-11 h-11 rounded-full
                      border shadow-sm transition
                      ${
                        favorited
                          ? "bg-amber-50 border-amber-200 text-amber-600"
                          : "bg-white border-gray-200 text-gray-500 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
                      }
                      ${favProcessing ? "opacity-60 cursor-not-allowed" : "hover:scale-105"}
                    `}
                    aria-label="Toggle Favorit"
                    title={favorited ? "Hapus dari favorit" : "Tambah ke favorit"}
                  >
                    <Heart className={favorited ? "fill-current" : ""} size={18} />
                  </button>

                  {/* Chat */}
                  <button
                    onClick={handleChatClick}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-semibold shadow-md transition flex items-center gap-2 transform hover:scale-105"
                  >
                    <MessageSquare size={18} />
                    Chat Vendor
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {[
                  { id: "packages", label: "Paket Harga", icon: Package },
                  { id: "portfolio", label: "Portofolio", icon: ImageIcon },
                  { id: "reviews", label: "Ulasan Klien", icon: Star },
                  { id: "about", label: "Tentang", icon: Info },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-amber-500 text-amber-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <tab.icon size={16} className="mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3">
              {/* PACKAGES */}
              {activeTab === "packages" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                  {vendor.packages?.length > 0 ? (
                    vendor.packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition"
                      >
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                          <p className="text-2xl font-bold text-amber-600 mb-4 font-mono">
                            {formatRupiah(pkg.price)}
                          </p>
                          <p className="text-gray-500 text-sm mb-6 line-clamp-3">{pkg.description}</p>

                          <ul className="space-y-2 mb-6">
                            {pkg.features?.slice(0, 4).map((feature, idx) => (
                              <li key={idx} className="flex items-start text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                            {pkg.features && pkg.features.length > 4 && (
                              <li className="text-xs text-gray-400 italic ml-6">
                                + {pkg.features.length - 4} fitur lainnya
                              </li>
                            )}
                          </ul>
                        </div>

                        <Link
                          href={`/vendors/${vendor.id}/package/${pkg.id}`}
                          className="w-full mt-auto py-3 px-6 bg-white border-2 border-amber-500 text-amber-600 font-bold rounded-lg hover:bg-amber-50 transition-all ease-in-out transform hover:scale-105 text-center"
                        >
                          Pilih Paket Ini
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-16 text-center bg-white rounded-xl border border-dashed border-gray-300">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Belum ada paket harga yang tersedia.</p>
                    </div>
                  )}
                </div>
              )}

              {/* PORTFOLIO */}
              {activeTab === "portfolio" && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in-up">
                  {vendor.portfolios?.length > 0 ? (
                    vendor.portfolios.map((item) => (
                      <div
                        key={item.id}
                        className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer shadow-sm"
                      >
                        {item.videoUrl ? (
                          <video src={`/storage/${item.videoUrl}`} className="w-full h-full object-cover" />
                        ) : (
                          <img
                            src={`/storage/${item.imageUrl}`}
                            alt={item.title}
                            className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                          <p className="text-white font-medium text-sm truncate w-full">{item.title}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-16 text-center bg-white rounded-xl border border-dashed border-gray-300">
                      <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Belum ada portofolio.</p>
                    </div>
                  )}
                </div>
              )}

              {/* REVIEWS */}
              {activeTab === "reviews" && (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Ulasan Klien</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Beri bintang dan ulasan untuk membantu customer lain.
                        </p>

                        {myReview && (
                          <div className="mt-3 inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-700">
                            <StarsDisplay value={myReview.rating} />
                            <span className="font-semibold">Ulasan kamu</span>
                            {myReview.status && myReview.status !== "APPROVED" && (
                              <span className="ml-1 text-[11px] text-gray-500">(Status: {myReview.status})</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={openReviewModal}
                          className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm transition flex items-center gap-2"
                        >
                          <Pencil size={16} />
                          {myReview ? "Edit Ulasan" : "Tulis Ulasan"}
                        </button>

                        {myReview && (
                          <button
                            type="button"
                            onClick={deleteReview}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 text-red-600 font-semibold transition flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-black text-gray-900">{headerAverage}</div>
                      <div>
                        <StarsDisplay value={Math.round(Number(avgRating || 0))} />
                        <div className="text-sm text-gray-500 mt-1">{headerCount} ulasan (APPROVED)</div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-5">
                      {vendor.reviews?.length > 0 ? (
                        vendor.reviews.map((r) => {
                          const isMine = auth?.user?.id && r.user_id === auth.user.id;
                          return (
                            <div key={r.id} className="border border-gray-100 rounded-xl p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <div className="font-bold text-gray-900 truncate">
                                      {r.user?.name || "Customer"}
                                    </div>

                                    {isMine && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold">
                                        Ulasan Kamu
                                      </span>
                                    )}

                                    {r.status && r.status !== "APPROVED" && isMine && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-gray-600 font-bold">
                                        {r.status}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 mt-1">
                                    <StarsDisplay value={r.rating} />
                                    <span className="text-xs text-gray-400">
                                      {r.created_at ? new Date(r.created_at).toLocaleDateString("id-ID") : ""}
                                    </span>
                                  </div>

                                  <p className="text-sm text-gray-700 mt-3 whitespace-pre-line">{r.comment}</p>
                                </div>
                              </div>

                              {r.reply && (
                                <div className="mt-4 bg-gray-50 border border-gray-100 rounded-lg p-3">
                                  <div className="text-xs font-bold text-gray-600 mb-1">Balasan Vendor</div>
                                  <p className="text-sm text-gray-700 whitespace-pre-line">{r.reply}</p>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-10 text-center text-gray-500">
                          Belum ada ulasan. Jadilah yang pertama memberi ulasan.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* MODAL REVIEW */}
                  {reviewModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                      <div className="absolute inset-0 bg-black/40" onClick={() => setReviewModalOpen(false)} />
                      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {myReview ? "Edit Ulasan" : "Tulis Ulasan"}
                            </h3>
                            <p className="text-sm text-gray-500">Beri bintang dan cerita singkat pengalaman kamu.</p>
                          </div>
                          <button
                            type="button"
                            className="p-2 rounded-lg hover:bg-gray-100"
                            onClick={() => setReviewModalOpen(false)}
                          >
                            <X size={18} />
                          </button>
                        </div>

                        <form onSubmit={submitReview} className="p-5 space-y-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-700 mb-2">Rating</div>
                            <StarRatingInput value={rating} onChange={setRating} />
                          </div>

                          <div>
                            <div className="text-sm font-semibold text-gray-700 mb-2">Ulasan</div>
                            <textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              rows={5}
                              className="w-full rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-amber-200 px-4 py-3 text-sm"
                              placeholder="Contoh: Vendor responsif, hasil memuaskan, tepat waktu..."
                            />
                            <div className="mt-1 text-xs text-gray-400">Maksimal 1000 karakter.</div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setReviewModalOpen(false)}
                              className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 font-semibold"
                            >
                              Batal
                            </button>
                            <button
                              type="submit"
                              disabled={reviewProcessing}
                              className={`px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold ${
                                reviewProcessing ? "opacity-60 cursor-not-allowed" : ""
                              }`}
                            >
                              {reviewProcessing ? "Menyimpan..." : "Simpan Ulasan"}
                            </button>
                          </div>

                          <div className="text-xs text-gray-500">
                            * Jika moderasi aktif, ulasan kamu bisa berstatus PENDING sebelum tampil publik.
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ABOUT */}
              {activeTab === "about" && (
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm animate-fade-in-up">
                  <h3 className="text-lg font-bold text-gray-900">Tentang Vendor</h3>
                  <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                    {vendor.description || "Deskripsi vendor belum tersedia."}
                  </p>

                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-100 rounded-xl p-4">
                      <div className="text-xs text-gray-500">Alamat</div>
                      <div className="text-sm font-semibold text-gray-800 mt-1">{vendor.address || "-"}</div>
                    </div>
                    <div className="border border-gray-100 rounded-xl p-4">
                      <div className="text-xs text-gray-500">Kontak</div>
                      <div className="text-sm font-semibold text-gray-800 mt-1">{vendor.phone || vendor.contact || "-"}</div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />

      {auth?.user && targetVendorForChat && (
        <CustomerGlobalChat user={auth.user} initialChatUser={targetVendorForChat} />
      )}
    </div>
  );
}
