// resources/js/Pages/RegisterPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "@inertiajs/react";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export default function RegisterPage() {
  // -------------------------
  // State & Inertia useForm
  // -------------------------
  const { data, setData, post, processing, errors, reset } = useForm({
    // fields sesuai controller Laravel yang kamu tampilkan sebelumnya
    // "name" => nama bisnis / perusahaan
    name: "",
    vendor_type: "",
    city: "",
    province: "",
    address: "",
    permit_number: "",
    permit_image: null, // file
    // contact person / PIC
    pic_name: "",
    contact_name: "", // optional - kita isi sama pic_name
    contact_email: "", // optional - isi sama email
    contact_phone: "", // optional - isi sama whatsapp
    email: "",
    password: "",
    password_confirmation: "",
    whatsapp: "",
    terms_accepted: false,
  });

  // local UI state
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewType, setPreviewType] = useState(""); // 'image' | 'pdf' | ''
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [clientErrors, setClientErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [fileNameDisplay, setFileNameDisplay] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  // Useful computed values
  const isFileTooLarge = useMemo(() => {
    return data.permit_image && data.permit_image.size > MAX_FILE_SIZE_BYTES;
  }, [data.permit_image]);

  // -------------------------
  // Effects
  // -------------------------
  // Clean up preview URL when component unmounts or file changed
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // When user changes PIC fields, keep contact_* fields in sync (so controller expects them)
  useEffect(() => {
    // only auto-fill contact_* if they are empty to avoid overriding user edits
    if (!data.contact_name) setData("contact_name", data.pic_name || "");
    if (!data.contact_email) setData("contact_email", data.email || "");
    if (!data.contact_phone) setData("contact_phone", data.whatsapp || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.pic_name, data.email, data.whatsapp]);

  // -------------------------
  // Handlers
  // -------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setData(name, checked ? 1 : 0); // Laravel 'accepted' expects truthy value; use 1/0
      return;
    }
    setData(name, value);
    // clear client errors for that field
    setClientErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setData("permit_image", null);
      setPreviewUrl("");
      setPreviewType("");
      setFileNameDisplay("");
      return;
    }

    // basic client-side checks
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setClientErrors((prev) => ({ ...prev, permit_image: "Ukuran file melebihi 5MB." }));
      setData("permit_image", null);
      setPreviewUrl("");
      setPreviewType("");
      setFileNameDisplay("");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setClientErrors((prev) => ({ ...prev, permit_image: "Format file tidak didukung. Gunakan JPG/PNG atau PDF." }));
      setData("permit_image", null);
      setPreviewUrl("");
      setPreviewType("");
      setFileNameDisplay("");
      return;
    }

    // set form data file
    setData("permit_image", file);

    // set preview
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPreviewType("image");
      setFileNameDisplay(file.name);
    } else if (file.type === "application/pdf") {
      setPreviewUrl("");
      setPreviewType("pdf");
      setFileNameDisplay(file.name);
    } else {
      setPreviewUrl("");
      setPreviewType("");
      setFileNameDisplay(file.name);
    }

    // clear server-side error for permit_image if any
    if (errors && errors.permit_image) {
      // Note: errors comes from Inertia hook; we keep it to show below
    }
  };

  const validateClientSide = () => {
    const newErrors = {};
    if (!data.name || !data.name.trim()) newErrors.name = "Nama perusahaan wajib diisi.";
    if (!data.vendor_type) newErrors.vendor_type = "Jenis layanan wajib dipilih.";
    if (!data.city || !data.province) {
      // If user typed in a combined field earlier, now we require both separately.
      if (!data.city) newErrors.city = "Kota wajib diisi.";
      if (!data.province) newErrors.province = "Provinsi wajib diisi.";
    }
    if (!data.address || !data.address.trim()) newErrors.address = "Alamat lengkap wajib diisi.";
    if (!data.permit_number || !data.permit_number.trim()) newErrors.permit_number = "Nomor izin usaha wajib diisi.";
    if (!data.permit_image) newErrors.permit_image = "File izin usaha wajib diupload.";
    if (!data.pic_name || !data.pic_name.trim()) newErrors.pic_name = "Nama kontak (PIC) wajib diisi.";
    if (!data.email || !data.email.includes("@")) newErrors.email = "Email tidak valid.";
    if (!data.whatsapp || !/^\d{6,15}$/.test(data.whatsapp.replace(/\D/g, ""))) newErrors.whatsapp = "Nomor WhatsApp tidak valid.";
    if (!data.password || data.password.length < 8) newErrors.password = "Password minimal 8 karakter.";
    if (data.password !== data.password_confirmation) newErrors.password_confirmation = "Konfirmasi password tidak cocok.";
    if (!data.terms_accepted || data.terms_accepted == 0) newErrors.terms_accepted = "Harap setujui syarat dan ketentuan.";
    setClientErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // clear previous info
    setInfoMessage("");
    setStatusModalOpen(false);

    // client-side validation
    const ok = validateClientSide();
    if (!ok) {
      setInfoMessage("Perbaiki error pada form terlebih dahulu.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // prepare and send with Inertia
    // use 'forceFormData' to ensure file is sent as multipart/form-data
    post(route("vendor.store"), {
      forceFormData: true,
      onStart: () => {
        setInfoMessage("Mengirim data ke server...");
      },
      onSuccess: () => {
        setInfoMessage("Pendaftaran berhasil - menunggu verifikasi admin.");
        setStatusModalOpen(true);
        // reset local preview/file inputs
        if (previewUrl) {
          try {
            URL.revokeObjectURL(previewUrl);
          } catch (e) {}
          setPreviewUrl("");
          setPreviewType("");
        }
        setFileNameDisplay("");
        // reset form (Inertia reset) but keep some defaults if you want
        reset("name", "vendor_type", "city", "province", "address", "permit_number", "permit_image", "pic_name", "email", "password", "password_confirmation", "whatsapp", "terms_accepted", "contact_name", "contact_email", "contact_phone");
      },
      onError: (serverErrors) => {
        // serverErrors is same as 'errors' provided by useForm; they'll be auto-populated
        setInfoMessage("Server mengembalikan error. Periksa pesan validasi.");
        // scroll to top so user sees messages
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      onFinish: () => {
        // nothing extra
      },
    });
  };

  // -------------------------
  // Helper small components
  // -------------------------
  const FieldError = ({ field }) => {
    // prefer server-side errors (errors), fallback to client-side (clientErrors)
    if (errors && errors[field]) {
      return <p className="mt-1 text-sm text-red-600">{errors[field]}</p>;
    }
    if (clientErrors && clientErrors[field]) {
      return <p className="mt-1 text-sm text-red-600">{clientErrors[field]}</p>;
    }
    return null;
  };

  // small UI for password strength
  const passwordStrength = useMemo(() => {
    const p = data.password || "";
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score; // 0..4
  }, [data.password]);

  const StrengthBar = () => {
    const score = passwordStrength;
    const labels = ["Very weak", "Weak", "OK", "Good", "Strong"];
    const colors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-blue-500", "bg-green-500"];
    return (
      <div className="mt-1">
        <div className="h-2 w-full bg-gray-200 rounded overflow-hidden">
          <div
            className={`h-2 ${colors[score]} rounded`}
            style={{ width: `${(score / 4) * 100}%`, transition: "width 250ms ease" }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">Strength: {labels[score]}</div>
      </div>
    );
  };

  // -------------------------
  // Markup (long & descriptive)
  // -------------------------
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Daftar Vendor Baru</h1>
          <p className="mt-1 text-sm text-gray-600">
            Isi data vendor dan lampirkan dokumen izin usaha. Pendaftaran akan diverifikasi oleh admin sebelum aktif.
          </p>
          {infoMessage && (
            <div className="mt-3 p-3 bg-yellow-50 text-yellow-800 rounded text-sm">{infoMessage}</div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="p-6 space-y-6"
          noValidate
        >
          {/* PRIMARY / BUSINESS SECTION */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700">Informasi Vendor</h2>
            <p className="text-sm text-gray-500 mt-1">Isi data usaha Anda.</p>

            <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Bisnis / Perusahaan</label>
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Bunga Mawar Wedding Organizer"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <FieldError field="name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Jenis Layanan</label>
                <select
                  name="vendor_type"
                  value={data.vendor_type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">-- Pilih --</option>
                  <option value="wo">Wedding Organizer (WO)</option>
                  <option value="catering">Katering</option>
                  <option value="decoration">Dekorasi</option>
                  <option value="photography">Fotografi & Videografi</option>
                  <option value="mua">MUA & Busana</option>
                  <option value="other">Lainnya</option>
                </select>
                <FieldError field="vendor_type" />
              </div>
            </div>

            <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Kota</label>
                <input
                  type="text"
                  name="city"
                  value={data.city}
                  onChange={handleInputChange}
                  placeholder="Contoh: Jakarta"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <FieldError field="city" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Provinsi</label>
                <input
                  type="text"
                  name="province"
                  value={data.province}
                  onChange={handleInputChange}
                  placeholder="Contoh: DKI Jakarta"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <FieldError field="province" />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
              <textarea
                name="address"
                value={data.address}
                onChange={handleInputChange}
                placeholder="Alamat kantor / studio"
                rows="3"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <FieldError field="address" />
            </div>
          </section>

          {/* LEGAL / PERMIT SECTION */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700">Dokumen Legalitas</h2>
            <p className="text-sm text-gray-500 mt-1">Nomor izin usaha & file lampiran (SIUP / NIB).</p>

            <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nomor Izin Usaha (NIB / SIUP)</label>
                <input
                  type="text"
                  name="permit_number"
                  value={data.permit_number}
                  onChange={handleInputChange}
                  placeholder="Contoh: NIB 123456789"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <FieldError field="permit_number" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Upload Izin (JPG/PNG/PDF, max 5MB)</label>
                <input
                  type="file"
                  name="permit_image"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => {
                    // both custom handler and setData for Inertia
                    handleFileChange(e);
                  }}
                  className="mt-1 block w-full text-sm text-gray-700"
                />
                <FieldError field="permit_image" />
                {clientErrors.permit_image && (
                  <p className="mt-1 text-sm text-red-600">{clientErrors.permit_image}</p>
                )}

                {/* preview area */}
                {previewType === "image" && previewUrl && (
                  <div className="mt-3">
                    <div className="text-sm text-gray-600">Preview gambar:</div>
                    <img src={previewUrl} alt="preview" className="mt-2 rounded-md border max-h-56 object-contain" />
                    <div className="text-xs text-gray-500 mt-1">{fileNameDisplay}</div>
                  </div>
                )}
                {previewType === "pdf" && fileNameDisplay && (
                  <div className="mt-3">
                    <div className="text-sm text-gray-600">File PDF dipilih:</div>
                    <div className="mt-2 text-sm text-gray-700 font-medium">{fileNameDisplay}</div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* CONTACT / ACCOUNT */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700">Informasi Kontak & Akun</h2>
            <p className="text-sm text-gray-500 mt-1">Data PIC & akun untuk login.</p>

            <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Kontak (PIC)</label>
                <input
                  type="text"
                  name="pic_name"
                  value={data.pic_name}
                  onChange={handleInputChange}
                  placeholder="Nama orang yang dapat dihubungi"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <FieldError field="pic_name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Email Kontak (jika berbeda)</label>
                <input
                  type="text"
                  name="contact_name"
                  value={data.contact_name}
                  onChange={handleInputChange}
                  placeholder="Opsional"
                  className="mt-1 block w-full border-gray-200 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <FieldError field="contact_name" />
              </div>
            </div>

            <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleInputChange}
                  placeholder="email@contoh.com"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <FieldError field="email" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nomor WhatsApp</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={data.whatsapp}
                  onChange={handleInputChange}
                  placeholder="0812xxxxxxx"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <FieldError field="whatsapp" />
              </div>
            </div>

            <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative mt-1">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    value={data.password}
                    onChange={handleInputChange}
                    placeholder="Minimal 8 karakter"
                    className="block w-full border-gray-300 rounded-md shadow-sm pr-10 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible((s) => !s)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                  >
                    {passwordVisible ? "Sembunyikan" : "Tampilkan"}
                  </button>
                </div>
                <FieldError field="password" />
                <StrengthBar />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                <div className="relative mt-1">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    name="password_confirmation"
                    value={data.password_confirmation}
                    onChange={handleInputChange}
                    placeholder="Ulangi password"
                    className="block w-full border-gray-300 rounded-md shadow-sm pr-10 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setConfirmPasswordVisible((s) => !s)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                  >
                    {confirmPasswordVisible ? "Sembunyikan" : "Tampilkan"}
                  </button>
                </div>
                <FieldError field="password_confirmation" />
              </div>
            </div>
          </section>

          {/* TERMS */}
          <section>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms_accepted"
                  type="checkbox"
                  checked={!!data.terms_accepted}
                  onChange={(e) => {
                    // our handler expects 1/0 for Laravel 'accepted' check
                    setData("terms_accepted", e.target.checked ? 1 : 0);
                    setClientErrors((prev) => {
                      const cp = { ...prev };
                      delete cp.terms_accepted;
                      return cp;
                    });
                  }}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  Saya setuju dengan <a href="/terms" target="_blank" rel="noreferrer" className="text-indigo-600 underline">Syarat dan Ketentuan</a>.
                </label>
                <FieldError field="terms_accepted" />
              </div>
            </div>
          </section>

          {/* SUBMIT */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                <strong>Catatan:</strong> Setelah mendaftar, admin akan memverifikasi dokumen Anda.
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={processing}
                  className={`inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    processing ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {processing ? "Mengirim..." : "Daftar Sekarang"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    // reset both Inertia form and local ui
                    reset();
                    setPreviewUrl("");
                    setPreviewType("");
                    setFileNameDisplay("");
                    setClientErrors({});
                    setInfoMessage("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Success modal */}
        {statusModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black opacity-30" onClick={() => setStatusModalOpen(false)} />
            <div className="relative max-w-md w-full bg-white rounded-lg shadow-lg p-6 z-10">
              <h3 className="text-xl font-semibold">Pendaftaran Berhasil</h3>
              <p className="mt-2 text-sm text-gray-600">Terima kasih, data Anda sudah kami terima. Admin akan memverifikasi dokumen dan menginformasikan melalui email.</p>
              <div className="mt-4 text-right">
                <button
                  onClick={() => setStatusModalOpen(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* End of RegisterPage.jsx */
