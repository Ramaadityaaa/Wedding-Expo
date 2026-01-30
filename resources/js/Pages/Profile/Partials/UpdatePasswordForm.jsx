// resources/js/Pages/Profile/Partials/UpdatePasswordForm.jsx

import React, { useRef, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { Eye, EyeOff, Shield, CheckCircle2, KeyRound } from "lucide-react";

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

const InputError = ({ message, className = "" }) =>
    message ? <p className={`text-sm font-semibold text-red-600 mt-2 ${className}`}>{message}</p> : null;

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

const ToggleablePasswordInput = ({
    label,
    id,
    value,
    onChange,
    error,
    inputRef,
    autoComplete,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = showPassword ? "text" : "password";

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>

            <div className="relative">
                <Input
                    id={id}
                    ref={inputRef}
                    value={value}
                    onChange={onChange}
                    type={inputType}
                    className="pr-12 pl-11"
                    autoComplete={autoComplete}
                />

                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <KeyRound className="h-5 w-5" />
                </div>

                <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition focus:outline-none"
                    aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            <InputError message={error} />
        </div>
    );
};

export default function UpdatePasswordForm({ className = "" }) {
    const page = usePage().props || {};
    const user = page?.auth?.user;

    const passwordInput = useRef(null);
    const currentPasswordInput = useRef(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword = (e) => {
        e.preventDefault();

        const isVendor = user?.role === "VENDOR";
        const routeName = isVendor ? "vendor.password.update" : "password.update";

        put(route(routeName), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs?.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current?.focus();
                }

                if (errs?.current_password) {
                    reset("current_password");
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <CardShell className={className}>
            <CardHeader
                title="Keamanan Password"
                description="Gunakan password yang panjang dan unik. Hindari menggunakan password yang sama di banyak akun."
                icon={Shield}
            />

            <div className="p-6 sm:p-7">
                <form onSubmit={updatePassword} className="space-y-6">
                    <ToggleablePasswordInput
                        label="Password Saat Ini"
                        id="current_password"
                        value={data.current_password}
                        onChange={(e) => setData("current_password", e.target.value)}
                        error={errors.current_password}
                        inputRef={currentPasswordInput}
                        autoComplete="current-password"
                    />

                    <ToggleablePasswordInput
                        label="Password Baru"
                        id="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        error={errors.password}
                        inputRef={passwordInput}
                        autoComplete="new-password"
                    />

                    <ToggleablePasswordInput
                        label="Konfirmasi Password Baru"
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData("password_confirmation", e.target.value)}
                        error={errors.password_confirmation}
                        autoComplete="new-password"
                    />

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
                                <p className="text-sm font-semibold text-green-800">Password berhasil diperbarui</p>
                            </div>
                        </Transition>
                    </div>
                </form>
            </div>
        </CardShell>
    );
}
