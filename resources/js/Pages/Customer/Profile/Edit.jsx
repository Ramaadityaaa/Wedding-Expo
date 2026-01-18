import React from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { User, Mail, Phone, MapPin, Save, ArrowLeft } from "lucide-react";

// =====================================================
// Small Field Wrapper (biar konsisten dan rapi)
// =====================================================
function Field({ label, hint, error, children }) {
    return (
        <div className="space-y-2">
            <div className="flex items-end justify-between gap-3">
                <label className="block text-sm font-semibold text-gray-800">
                    {label}
                </label>
                {hint ? <span className="text-xs text-gray-500">{hint}</span> : null}
            </div>

            {children}

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
    );
}

// =====================================================
// Input with Left Icon (anti tabrakan)
// =====================================================
function IconInput({
    icon: Icon,
    type = "text",
    value,
    onChange,
    placeholder,
    error,
    autoComplete,
    disabled = false,
}) {
    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Icon size={18} />
            </span>

            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                disabled={disabled}
                className={[
                    "w-full rounded-xl border bg-white",
                    "pl-11 pr-4 py-3",
                    "text-gray-900 placeholder:text-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400",
                    "disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed",
                    error ? "border-red-300" : "border-gray-200",
                ].join(" ")}
            />
        </div>
    );
}

// =====================================================
// Textarea with Left Icon (anti tabrakan)
// =====================================================
function IconTextarea({ icon: Icon, rows = 4, value, onChange, placeholder, error }) {
    return (
        <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400 pointer-events-none">
                <Icon size={18} />
            </span>

            <textarea
                rows={rows}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={[
                    "w-full rounded-xl border bg-white",
                    "pl-11 pr-4 py-3",
                    "text-gray-900 placeholder:text-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400",
                    "resize-none",
                    error ? "border-red-300" : "border-gray-200",
                ].join(" ")}
            />
        </div>
    );
}

export default function Edit({ user }) {
    const { auth, flash } = usePage().props;

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route("customer.profile.update"), { preserveScroll: true });
    };

    return (
        <CustomerLayout user={auth?.user}>
            <Head title="Edit Profil" />

            <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* Header: Back icon di kiri sejajar judul */}
                <div className="flex items-start gap-4 mb-6">
                    <Link
                        href="/"
                        aria-label="Kembali"
                        className={[
                            "mt-1 inline-flex items-center justify-center",
                            "w-10 h-10 rounded-xl",
                            "border border-gray-200 bg-white",
                            "text-gray-700 hover:bg-gray-50",
                            "focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400",
                        ].join(" ")}
                    >
                        <ArrowLeft size={18} />
                    </Link>

                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                            Edit Profil
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Perbarui informasi akun Anda agar tetap akurat.
                        </p>
                    </div>
                </div>

                {/* Alerts */}
                {(flash?.success || flash?.error) && (
                    <div
                        className={[
                            "mb-6 rounded-xl px-4 py-3 border",
                            flash?.success
                                ? "bg-green-50 border-green-200 text-green-800"
                                : "bg-red-50 border-red-200 text-red-800",
                        ].join(" ")}
                    >
                        {flash?.success || flash?.error}
                    </div>
                )}

                {recentlySuccessful && (
                    <div className="mb-6 rounded-xl px-4 py-3 border bg-green-50 border-green-200 text-green-800">
                        Profil berhasil diperbarui.
                    </div>
                )}

                {/* Card Form */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                    <div className="px-6 sm:px-8 py-6 border-b border-gray-100 bg-gray-50/40">
                        <h2 className="text-lg font-bold text-gray-900">Informasi Akun</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Data berikut digunakan untuk akun dan komunikasi.
                        </p>
                    </div>

                    <form onSubmit={submit} className="px-6 sm:px-8 py-6 space-y-6">
                        <Field label="Nama Lengkap" error={errors.name}>
                            <IconInput
                                icon={User}
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="Masukkan nama lengkap"
                                error={errors.name}
                                autoComplete="name"
                            />
                        </Field>

                        <Field label="Email" hint="Dipakai untuk login" error={errors.email}>
                            <IconInput
                                icon={Mail}
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                placeholder="Masukkan email"
                                error={errors.email}
                                autoComplete="email"
                            />
                            <p className="text-xs text-gray-500">
                                Pastikan email aktif untuk notifikasi dan login.
                            </p>
                        </Field>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className={[
                                    "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3",
                                    "font-semibold text-white shadow-sm transition-colors",
                                    processing
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-amber-600 hover:bg-amber-700",
                                ].join(" ")}
                            >
                                <Save size={18} />
                                {processing ? "Menyimpan..." : "Simpan Perubahan"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-6 text-xs text-gray-500">
                    Untuk keamanan, fitur ganti password sebaiknya dibuat di halaman khusus.
                </div>
            </div>
        </CustomerLayout>
    );
}
