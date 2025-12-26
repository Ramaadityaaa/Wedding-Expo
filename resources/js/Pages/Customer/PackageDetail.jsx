import React, { useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Badge } from "@/Components/ui/badge";
import {
  CheckCircle2,
  ArrowLeft,
  Info,
  Package as PackageIcon,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function PackageDetail({ pkg, vendor }) {
  // Format rupiah
  const formatPrice = (price) => {
    const num = Number(price ?? 0);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  /**
   * ==========================
   * DATA GAMBAR (CUSTOMER UI)
   * ==========================
   * - Prioritas: pkg.images (array object / string)
   * - Fallback: pkg.image_url (single)
   */
  const images = useMemo(() => {
    const arr = Array.isArray(pkg?.gallery) ? pkg.gallery : [];

    const normalize = (item) => {
      // support object: { url } atau { image_path }
      if (item && typeof item === "object") {
        const u = item.url || item.image_path;
        if (!u) return null;
        if (u.startsWith("http://") || u.startsWith("https://")) return u;
        if (u.startsWith("/storage/")) return u;
        if (u.startsWith("storage/")) return `/${u}`;
        return `/storage/${u}`;
      }

      // support string
      if (typeof item === "string") {
        const src = item;
        if (!src) return null;
        if (src.startsWith("http://") || src.startsWith("https://")) return src;
        if (src.startsWith("/storage/")) return src;
        if (src.startsWith("storage/")) return `/${src}`;
        return `/storage/${src}`;
      }

      return null;
    };

    const normalized = arr.map(normalize).filter(Boolean);

    // fallback single image kalau images kosong
    if (normalized.length === 0 && pkg?.image_url) {
      const single = normalize(pkg.image_url);
      if (single) return [single];
    }

    return normalized;
  }, [pkg]);

  // Lightbox state
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openLightbox = (idx) => {
    setActiveIndex(idx);
    setIsOpen(true);
  };

  const closeLightbox = () => setIsOpen(false);

  const prev = () => {
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  };

  const next = () => {
    setActiveIndex((i) => (i + 1) % images.length);
  };

  return (
    <CustomerLayout>
      <Head title={`Paket ${pkg?.name ?? ""} - Wedding Expo`} />

      <Navbar />

      <div className="min-h-screen bg-[#FFFBEB]/40 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Navigasi - Kembali ke Vendor Detail */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href={route("vendors.details", vendor.id)}
              className="flex items-center text-amber-900/70 hover:text-amber-600 font-medium transition-all group"
            >
              <div className="bg-white p-2 rounded-full shadow-sm mr-3 group-hover:shadow-md transition-all ring-1 ring-amber-100">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Kembali ke Profil Vendor
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* KIRI: GALLERY + DESKRIPSI */}
            <div className="lg:col-span-8 space-y-8">
              {/* ====== GALLERY CARD ====== */}
              <div className="bg-white/60 backdrop-blur-sm rounded-[2.8rem] border border-white shadow-2xl overflow-hidden ring-1 ring-amber-100">
                <div className="p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2 text-amber-950">
                      <div className="p-2 rounded-2xl bg-amber-50 border border-amber-100">
                        <ImageIcon className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Galeri Paket</div>
                        <div className="text-xs text-amber-900/60">
                          Foto-foto dari vendor untuk paket ini
                        </div>
                      </div>
                    </div>

                    <Badge className="bg-amber-600 hover:bg-amber-600 px-4 py-1.5 text-sm rounded-full shadow-lg border-none">
                      {pkg?.name ?? "Paket"}
                    </Badge>
                  </div>

                  {images.length === 0 ? (
                    <div className="rounded-[2rem] border border-amber-100/60 bg-amber-50/30 p-10 text-center">
                      <div className="mx-auto w-14 h-14 rounded-2xl bg-white border border-amber-100 flex items-center justify-center shadow-sm">
                        <PackageIcon className="w-6 h-6 text-amber-600" />
                      </div>
                      <div className="mt-4 font-semibold text-amber-950">
                        Belum ada foto untuk paket ini
                      </div>
                      <div className="mt-1 text-sm text-amber-900/60">
                        Nanti kalau vendor upload foto khusus paket{" "}
                        <span className="font-semibold">{pkg?.name}</span>,
                        galeri akan muncul di sini.
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {images.map((src, idx) => (
                        <button
                          key={`${src}-${idx}`}
                          type="button"
                          onClick={() => openLightbox(idx)}
                          className="group relative overflow-hidden rounded-3xl border border-white shadow-sm ring-1 ring-amber-100 bg-white"
                          aria-label={`Lihat gambar ${idx + 1}`}
                        >
                          <div className="aspect-[4/3]">
                            <img
                              src={src}
                              alt={`Paket ${pkg?.name ?? ""} - ${idx + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                              loading="lazy"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                          <div className="absolute bottom-3 left-3 text-[11px] px-2 py-1 rounded-full bg-white/90 text-amber-900 border border-amber-100 shadow-sm opacity-0 group-hover:opacity-100 transition">
                            Lihat
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ====== DESKRIPSI ====== */}
              <div className="bg-white/60 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white ring-1 ring-amber-100">
                <h1 className="text-4xl font-serif font-bold text-amber-950 mb-4">
                  {pkg?.name}
                </h1>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-amber-950 flex items-center gap-2">
                    <Info className="w-5 h-5 text-amber-600" />
                    Deskripsi Paket
                  </h3>
                  <div className="text-gray-600 leading-relaxed text-lg whitespace-pre-line bg-amber-50/30 p-6 rounded-2xl border border-amber-100/50">
                    {pkg?.description ||
                      "Vendor belum memberikan deskripsi lengkap untuk paket ini."}
                  </div>
                </div>

                <hr className="my-10 border-amber-100" />
              </div>
            </div>

            {/* KANAN: CARD BOOKING */}
            <div className="lg:col-span-4">
              <Card className="sticky top-28 border-none shadow-2xl rounded-[2.5rem] bg-white ring-1 ring-amber-100 p-8">
                <div className="mb-6">
                  <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-widest">
                    Harga Paket
                  </p>
                  <h2 className="text-4xl font-black text-amber-600">
                    {formatPrice(pkg?.price)}
                  </h2>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    "Konsultasi Gratis",
                    "Item Sesuai Deskripsi",
                    "Pendampingan Selama Acara",
                  ].map((t) => (
                    <div
                      key={t}
                      className="flex items-center gap-3 text-gray-600 text-sm"
                    >
                      <div className="bg-amber-100 p-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-amber-600" />
                      </div>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Link
                    href={route("order.selectDate", {
                      vendorId: vendor.id,
                      packageId: pkg.id,
                    })}
                  >
                    <Button className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-lg font-bold shadow-lg shadow-amber-200 transition-all active:scale-[0.98]">
                      Pesan Sekarang
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-amber-50 text-center text-[10px] text-gray-400 font-medium px-4 leading-relaxed uppercase tracking-tighter">
                  Pembayaran aman & terverifikasi oleh sistem Wedding Expo
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {isOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute -top-12 right-0 inline-flex items-center gap-2 text-white/90 hover:text-white transition"
            >
              <span className="text-sm">Tutup</span>
              <X className="w-5 h-5" />
            </button>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-black">
              <img
                src={images[activeIndex]}
                alt={`Preview ${activeIndex + 1}`}
                className="w-full max-h-[80vh] object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/10 text-white transition"
                    aria-label="Sebelumnya"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    type="button"
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/10 text-white transition"
                    aria-label="Berikutnya"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[12px] px-3 py-1 rounded-full bg-white/15 border border-white/10 text-white">
                {activeIndex + 1} / {images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
}
