import React, { useMemo } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Mail, Phone, MapPin } from "lucide-react";

const safeJsonParse = (value) => {
  if (!value || typeof value !== "string") return null;
  try {
    const parsed = JSON.parse(value);
    return parsed;
  } catch (e) {
    return null;
  }
};

const Footer = () => {
  // Ambil staticContent yang dishare global dari HandleInertiaRequests
  const { staticContent } = usePage().props;

  // DEFAULT (fallback) jika DB kosong / key belum ada
  const defaults = useMemo(
    () => ({
      "Footer - Deskripsi":
        "Platform direktori wedding organizer terlengkap di Indonesia.",
      "Footer - Email": "info@weddingexpo.id",
      "Footer - Telepon": "+62 21 1234 5678",
      "Footer - Lokasi": "Jakarta, Indonesia",

      // Optional: bisa diedit dalam bentuk JSON array (admin bisa ubah di Konten Statis)
      // Contoh format JSON:
      // [{"label":"Cari Vendor","href":"/#vendors"},{"label":"Inspirasi","href":"/#inspiration"},{"label":"Tentang Kami","href":"/#about"}]
      "Footer - Links Layanan": JSON.stringify([
        { label: "Cari Vendor", href: "/#vendors" },
        { label: "Inspirasi", href: "/#inspiration" },
        { label: "Tentang Kami", href: "/#about" },
      ]),
      "Footer - Links Vendor": JSON.stringify([
        { label: "Daftar Vendor", href: "/register/vendor" },
        { label: "Login Vendor", href: "/login" },
      ]),
    }),
    []
  );

  // Merge: default + isi DB (DB menimpa default)
  const content = useMemo(() => {
    return { ...defaults, ...(staticContent || {}) };
  }, [defaults, staticContent]);

  const footerDesc = content["Footer - Deskripsi"] || defaults["Footer - Deskripsi"];
  const footerEmail = content["Footer - Email"] || defaults["Footer - Email"];
  const footerPhone = content["Footer - Telepon"] || defaults["Footer - Telepon"];
  const footerLocation = content["Footer - Lokasi"] || defaults["Footer - Lokasi"];

  const layananLinks =
    safeJsonParse(content["Footer - Links Layanan"]) ||
    safeJsonParse(defaults["Footer - Links Layanan"]) ||
    [];

  const vendorLinks =
    safeJsonParse(content["Footer - Links Vendor"]) ||
    safeJsonParse(defaults["Footer - Links Vendor"]) ||
    [];

  return (
    <footer
      className={[
        "bg-[#121421] text-gray-300",
        "-mt-px pt-px",
        "shadow-[0_-15px_30px_rgba(0,0,0,0.4)]",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* 1. Kolom Logo & Deskripsi */}
          <div>
            <Link href="/" className="mb-4 inline-block">
              <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold shadow-xl rounded-lg">
                <div className="text-xl font-serif tracking-wide leading-tight">
                  Wedding<span className="font-black">Expo</span>
                </div>
              </div>
            </Link>

            <p className="text-gray-400 text-sm mt-2">{footerDesc}</p>
          </div>

          {/* 2. Kolom Layanan (dinamis via JSON) */}
          <div>
            <h4 className="font-semibold text-yellow-400 mb-4 border-b border-gray-700/50 pb-1">
              Layanan
            </h4>
            <ul className="space-y-2">
              {layananLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-yellow-300 transition text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Kolom Vendor (dinamis via JSON) */}
          <div>
            <h4 className="font-semibold text-yellow-400 mb-4 border-b border-gray-700/50 pb-1">
              Vendor
            </h4>
            <ul className="space-y-2">
              {vendorLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-yellow-300 transition text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Kolom Kontak (dinamis) */}
          <div>
            <h4 className="font-semibold text-yellow-400 mb-4 border-b border-gray-700/50 pb-1">
              Kontak
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-yellow-500" />
                <a
                  href={`mailto:${footerEmail}`}
                  className="text-gray-400 hover:text-yellow-300 transition text-sm"
                >
                  {footerEmail}
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-yellow-500" />
                <span className="text-gray-400 text-sm">{footerPhone}</span>
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-yellow-500" />
                <span className="text-gray-400 text-sm">{footerLocation}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} WeddingExpo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
