// resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.jsx

import React from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { User, Mail, CheckCircle2, AlertTriangle } from "lucide-react";

const Label = ({ children, htmlFor }) => (
    <label
        htmlFor={htmlFor}
        className="text-sm font-semibold text-gray-700"
    >
        {children}
    </label>
);

const Input = ({ className = "", type = "text", ...props }) => (
    <input
        type={type}
        className={[
            "h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-800",
            "placeholder:text-gray-400",
            "outline-none transition",
            "focus:border-amber-300 focus:ring-4 focus:ring-amber-200/60",
            "disabled:cursor-not-allowed disabled:opacity-60",
            className,
        ].join(" ")}
        {...props}
    />
);

const Button = ({ children, disabled, type, className = "", ...props }) => (
    <button
        disabled={disabled}
        type={type}
        className={[
            "inline-flex items-center justify-center gap-2",
            "h-11 px-6 rounded-2xl text-sm font-semibold",
            "transition",
            "focus:outline-none focus:ring-4 focus:ring-amber-200/70",
            disabled
                ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-sm hover:shadow-md hover:from-amber-600 hover:to-yellow-700 active:from-amber-700 active:to-yellow-800",
            className,
        ].join(" ")}
        {...props}
    >
        {children}
    </button>
);

const InputError = ({ message }) =>
    message ? <p className="text-sm font-semibold text-red-600 mt-2">{message}</p> : null;

const CardShell = ({ children, className = "" }) => (
    <div
        className={[
            "w-full rounded-3xl bg-white",
            "border border-gray-100",
            "shadow-sm hover:shadow-xl transition-shadow duration-300",
            "overflow-hidden",
            className,
        ].join(" ")}
    >
        {children}
    </div>
);

const CardHeader = ({ title, description, icon: Icon }) => (
    <div className="p-6 sm:p-7 bg-gradient-to-r from-amber-50 via-white to-yellow-50 border-b border-gray-100">
        <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-100/60 border border-amber-100 flex items-center justify-center shadow-sm">
                <Icon className="h-6 w-6 text-amber-700" />
            </div>

            <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    </div>
);

export default function UpdateProfileInformationForm({
    mustVerifyEmail = false,
    status,
    className = "",
}) {
    const page = usePage().props || {};
    const user = page?.auth?.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user?.name || "",
        email: user?.email || "",
    });

    const submit = (e) => {
        e.preventDefault();

        const isVendor = user?.role === "VENDOR";
        const routeName = isVendor ? "vendor.profile.update" : "profile.update";

        patch(route(routeName), {
            preserveScroll: true,
        });
    };

    return (
        <CardShell className={className}>
            <CardHeader
                title="Informasi Profil"
                description="Perbarui nama dan email akun kamu. Pastikan email aktif agar notifikasi tetap masuk."
                icon={User}
            />

            <div className="p-6 sm:p-7">
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <div className="relative">
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    required
                                    autoComplete="name"
                                    className="pl-11"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                                    <User className="h-5 w-5" />
                                </div>
                            </div>
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Alamat Email</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    required
                                    autoComplete="username"
                                    className="pl-11"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                            </div>
                            <InputError message={errors.email} />
                        </div>
                    </div>

                    {mustVerifyEmail && user?.email_verified_at === null && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-amber-100 flex items-center justify-center border border-amber-200">
                                    <AlertTriangle className="h-5 w-5 text-amber-700" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-amber-900">
                                        Email kamu belum diverifikasi.
                                    </p>
                                    <p className="mt-1 text-sm text-amber-800 leading-relaxed">
                                        Klik tombol di bawah untuk mengirim ulang email verifikasi.
                                    </p>

                                    <div className="mt-3">
                                        <Link
                                            href={route("verification.send")}
                                            method="post"
                                            as="button"
                                            className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold bg-white border border-amber-200 text-amber-800 hover:bg-amber-50 transition"
                                        >
                                            Kirim Ulang Verifikasi
                                        </Link>
                                    </div>

                                    {status === "verification-link-sent" && (
                                        <div className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-green-50 border border-green-200 px-3 py-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-700" />
                                            <p className="text-sm font-semibold text-green-800">
                                                Tautan verifikasi baru sudah dikirim ke email kamu.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <div className="inline-flex items-center gap-2 rounded-2xl bg-green-50 border border-green-200 px-3 py-2">
                                <CheckCircle2 className="h-4 w-4 text-green-700" />
                                <p className="text-sm font-semibold text-green-800">Berhasil disimpan</p>
                            </div>
                        </Transition>
                    </div>
                </form>
            </div>
        </CardShell>
    );
}
