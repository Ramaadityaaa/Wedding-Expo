import React, { useEffect, useMemo, useState } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import {
    Loader2,
    UploadCloud,
    CheckCircle,
    AlertCircle,
    Eye,
    EyeOff,
} from "lucide-react";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export default function RegisterPage() {
    // -------------------------
    // State & Inertia useForm
    // -------------------------
    const { data, setData, post, processing, errors, reset } = useForm({
        // Sesuai validasi di HomeController
        name: "", // Nama Bisnis
        vendor_type: "",
        city: "",
        province: "",
        address: "",
        permit_number: "",
        permit_image: null,

        pic_name: "", // Nama PIC (akan jadi nama akun User)
        contact_name: "", // Optional, sync otomatis
        contact_email: "", // Optional, sync otomatis
        contact_phone: "", // Optional, sync otomatis

        email: "", // Email untuk Login (User)
        password: "",
        password_confirmation: "",
        whatsapp: "",
        terms_accepted: false,
    });

    // UI State
    const [previewUrl, setPreviewUrl] = useState("");
    const [previewType, setPreviewType] = useState("");
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [clientErrors, setClientErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [fileNameDisplay, setFileNameDisplay] = useState("");
    const [infoMessage, setInfoMessage] = useState("");

    // -------------------------
    // Effects
    // -------------------------
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // Sync otomatis data kontak dengan data akun utama
    useEffect(() => {
        // Kunci: Pastikan contact fields selalu terisi jika user tidak mengisinya terpisah.
        // Ini membantu validasi backend.
        setData((prevData) => ({
            ...prevData,
            contact_name: prevData.pic_name,
            contact_email: prevData.email,
            contact_phone: prevData.whatsapp,
        }));
    }, [data.pic_name, data.email, data.whatsapp, setData]);

    // -------------------------
    // Handlers
    // -------------------------
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setData(name, checked ? 1 : 0);
            return;
        }
        setData(name, value);
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
            setFileNameDisplay("");
            setPreviewType("");
            return;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            setClientErrors((prev) => ({
                ...prev,
                permit_image: "Ukuran file melebihi 5MB.",
            }));
            setData("permit_image", null);
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "application/pdf",
        ];
        if (!allowedTypes.includes(file.type)) {
            setClientErrors((prev) => ({
                ...prev,
                permit_image: "Format file wajib JPG/PNG atau PDF.",
            }));
            setData("permit_image", null);
            return;
        }

        setData("permit_image", file);
        setFileNameDisplay(file.name);

        if (file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setPreviewType("image");
        } else {
            setPreviewUrl("");
            setPreviewType("pdf");
        }
        setClientErrors((prev) => ({ ...prev, permit_image: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setInfoMessage("");
        setClientErrors({});

        // Validasi sederhana di client sebelum kirim
        if (!data.name || !data.email || !data.password || !data.terms_accepted) {
            setInfoMessage("Lengkapi field wajib yang bertanda merah.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // Validasi file besar secara eksplisit sebelum kirim
        if (data.permit_image && data.permit_image.size > MAX_FILE_SIZE_BYTES) {
            setInfoMessage("File izin usaha terlalu besar (Max 5MB).");
            return;
        }

        post(route("vendor.store"), {
            forceFormData: true,
            onSuccess: () => {
                setStatusModalOpen(true);
                if (data.permit_image) {
                    URL.revokeObjectURL(previewUrl);
                }
                reset();
            },
            onError: () => {
                setInfoMessage(
                    "Terdapat kesalahan pada inputan. Mohon periksa kembali."
                );
                window.scrollTo({ top: 0, behavior: "smooth" });
            },
        });
    };

    // Helper Error
    const FieldError = ({ field }) => {
        const msg = errors[field] || clientErrors[field];
        if (msg)
            return (
                <p className="mt-1 text-xs text-red-500 flex items-center">
                    <AlertCircle size={12} className="mr-1" /> {msg}
                </p>
            );
        return null;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <Head title="Daftar Vendor" />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Bergabunglah dengan{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                            Wedding Expo
                        </span>
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Jangkau ribuan calon pengantin dan kembangkan bisnis
                        pernikahan Anda.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
                    {/* Progress Bar Hiasan */}
                    <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>

                    <div className="p-8">
                        {infoMessage && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start">
                                <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{infoMessage}</span>
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                            className="space-y-8"
                        >
                            {/* SECTION 1: DATA BISNIS */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 flex items-center">
                                    <span className="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">
                                        1
                                    </span>
                                    Informasi Bisnis
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nama Bisnis / Vendor
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            onChange={handleInputChange}
                                            placeholder="Contoh: Bunga Mawar Catering"
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition"
                                        />
                                        <FieldError field="name" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Jenis Layanan
                                        </label>
                                        <select
                                            name="vendor_type"
                                            value={data.vendor_type}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white"
                                        >
                                            <option value="">Pilih Kategori</option>
                                            <option value="Wedding Organizer">
                                                Wedding Organizer
                                            </option>
                                        </select>
                                        <FieldError field="vendor_type" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nomor WhatsApp Bisnis
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">
                                                    +62
                                                </span>
                                            </div>
                                            <input
                                                type="tel"
                                                name="whatsapp"
                                                value={data.whatsapp}
                                                onChange={handleInputChange}
                                                placeholder="81234567890"
                                                className="block w-full pl-12 pr-4 py-3 rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white"
                                            />
                                        </div>
                                        <FieldError field="whatsapp" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Kota Domisili
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={data.city}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                                        />
                                        <FieldError field="city" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Provinsi
                                        </label>
                                        <input
                                            type="text"
                                            name="province"
                                            value={data.province}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                                        />
                                        <FieldError field="province" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Alamat Lengkap
                                        </label>
                                        <textarea
                                            name="address"
                                            rows="3"
                                            value={data.address}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                                        ></textarea>
                                        <FieldError field="address" />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2: LEGALITAS */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 flex items-center">
                                    <span className="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">
                                        2
                                    </span>
                                    Dokumen Legalitas
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nomor Izin Usaha (NIB/SIUP)
                                        </label>
                                        <input
                                            type="text"
                                            name="permit_number"
                                            value={data.permit_number}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                                        />
                                        <FieldError field="permit_number" />
                                    </div>

                                    {/* ✅ Upload area + preview terpisah (gambar pasti kelihatan) */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload Dokumen (Max 5MB)
                                        </label>

                                        <div className="w-full">
                                            {/* BOX UPLOAD (klik untuk pilih file) */}
                                            <label className="group w-full flex items-center justify-between gap-4 p-4 md:p-5 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-white hover:bg-gray-50 transition shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100">
                                                        <UploadCloud className="w-6 h-6 text-orange-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800">
                                                            {fileNameDisplay
                                                                ? "File sudah dipilih"
                                                                : "Klik untuk upload dokumen"}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            JPG, PNG, atau PDF (maks. 5MB)
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {fileNameDisplay ? (
                                                        <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-green-50 text-green-700 border border-green-200">
                                                            <CheckCircle size={16} />
                                                            Dipilih
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-gray-100 text-gray-700 border border-gray-200 group-hover:bg-gray-200 transition">
                                                            Pilih File
                                                        </span>
                                                    )}
                                                </div>

                                                <input
                                                    type="file"
                                                    name="permit_image"
                                                    className="hidden"
                                                    accept="image/*,application/pdf"
                                                    onChange={handleFileChange}
                                                />
                                            </label>

                                            {/* Nama file */}
                                            {fileNameDisplay && (
                                                <div className="mt-3 text-sm text-green-700 flex items-center gap-2">
                                                    <CheckCircle size={16} />
                                                    <span className="font-medium">
                                                        {fileNameDisplay}
                                                    </span>
                                                </div>
                                            )}

                                            {/* PREVIEW GAMBAR (tampil nyata, bukan background) */}
                                            {previewType === "image" && previewUrl && (
                                                <div className="mt-4 border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 shadow-sm">
                                                    <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
                                                        <p className="text-sm font-semibold text-gray-800">
                                                            Preview Gambar
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Pastikan foto jelas & terbaca
                                                        </p>
                                                    </div>
                                                    <div className="p-3">
                                                        <img
                                                            src={previewUrl}
                                                            alt="Preview Upload"
                                                            className="w-full max-h-[460px] object-contain rounded-xl bg-white"
                                                            draggable={false}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* PREVIEW PDF (informasi aja) */}
                                            {previewType === "pdf" && fileNameDisplay && (
                                                <div className="mt-4 border border-gray-200 rounded-2xl bg-white shadow-sm p-4">
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        Preview PDF
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        PDF dipilih:{" "}
                                                        <span className="font-medium text-gray-700">
                                                            {fileNameDisplay}
                                                        </span>
                                                    </p>
                                                </div>
                                            )}

                                            <FieldError field="permit_image" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: AKUN LOGIN */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 flex items-center">
                                    <span className="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">
                                        3
                                    </span>
                                    Akun Login (PIC)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nama Lengkap PIC
                                        </label>
                                        <input
                                            type="text"
                                            name="pic_name"
                                            value={data.pic_name}
                                            onChange={handleInputChange}
                                            placeholder="Nama Pemilik / Penanggung Jawab"
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                                        />
                                        <FieldError field="pic_name" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email Login
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                                        />
                                        <FieldError field="email" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Password
                                        </label>
                                        <div className="relative mt-1">
                                            <input
                                                type={passwordVisible ? "text" : "password"}
                                                name="password"
                                                value={data.password}
                                                onChange={handleInputChange}
                                                className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setPasswordVisible(!passwordVisible)
                                                }
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                            >
                                                {passwordVisible ? (
                                                    <EyeOff size={20} />
                                                ) : (
                                                    <Eye size={20} />
                                                )}
                                            </button>
                                        </div>
                                        <FieldError field="password" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Konfirmasi Password
                                        </label>
                                        <div className="relative mt-1">
                                            <input
                                                type={
                                                    confirmPasswordVisible ? "text" : "password"
                                                }
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                onChange={handleInputChange}
                                                className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setConfirmPasswordVisible(
                                                        !confirmPasswordVisible
                                                    )
                                                }
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                            >
                                                {confirmPasswordVisible ? (
                                                    <EyeOff size={20} />
                                                ) : (
                                                    <Eye size={20} />
                                                )}
                                            </button>
                                        </div>
                                        <FieldError field="password_confirmation" />
                                    </div>
                                </div>
                            </div>

                            {/* TERMS */}
                            <div className="flex items-start bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        name="terms_accepted"
                                        type="checkbox"
                                        checked={!!data.terms_accepted}
                                        onChange={(e) => {
                                            setData(
                                                "terms_accepted",
                                                e.target.checked ? 1 : 0
                                            );
                                            setClientErrors((p) => ({
                                                ...p,
                                                terms_accepted: null,
                                            }));
                                        }}
                                        className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label
                                        htmlFor="terms"
                                        className="font-medium text-gray-700"
                                    >
                                        Saya menyetujui{" "}
                                        <a
                                            href="#"
                                            className="text-orange-600 hover:underline"
                                        >
                                            Syarat dan Ketentuan
                                        </a>{" "}
                                        serta{" "}
                                        <a
                                            href="#"
                                            className="text-orange-600 hover:underline"
                                        >
                                            Kebijakan Privasi
                                        </a>{" "}
                                        Wedding Expo.
                                    </label>
                                    <FieldError field="terms_accepted" />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                                >
                                    {processing ? (
                                        <span className="flex items-center">
                                            <Loader2 className="animate-spin mr-2" />{" "}
                                            Memproses...
                                        </span>
                                    ) : (
                                        "DAFTAR SEBAGAI VENDOR"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Sudah punya akun?{" "}
                    <Link
                        href={route("login")}
                        className="font-medium text-orange-600 hover:text-orange-500"
                    >
                        Masuk di sini
                    </Link>
                </p>
            </div>

            {/* Success Modal */}
            {statusModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Pendaftaran Berhasil!
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Terima kasih telah mendaftar. Data Anda sedang kami
                            verifikasi. Silakan login untuk melihat status akun
                            Anda.
                        </p>
                        <Link
                            href={route("login")}
                            className="w-full inline-flex justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-orange-600 hover:bg-orange-700 shadow-lg transition"
                        >
                            Lanjut ke Halaman Login
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
