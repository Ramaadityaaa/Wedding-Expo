import React, { useState, useMemo } from "react";
import {
    Check,
    Star,
    Camera,
    XCircle,
    Loader2,
    AlertTriangle,
    Eye,
    Clock,
    Film,
    ShieldCheck,
    Zap as ZapIcon,
    Package,
} from "lucide-react";
import { router, Head, usePage } from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";

// --- KONFIGURASI TEMA ---
const ACCENT_COLOR = "text-amber-600";
const GRADIENT_CLASS =
    "bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500";
const PRIMARY_COLOR = "bg-amber-600";

// Helper formatCurrency (Sama seperti di Admin Panel)
const formatCurrency = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

// --- PricingCard (presentational) ---
const PricingCard = ({ plan, onSubscribe, isLoading, currentPlanId }) => {
    // Mapping plan dari database (misal: planId di-map ke slug/name)
    const isActive = plan.name.toLowerCase().includes(currentPlanId);

    const buttonText = isActive
        ? "Paket Aktif Saat Ini"
        : plan.price > 0
        ? "Mulai Berlangganan Sekarang"
        : "Pilih Paket Gratis";

    const buttonClass = isActive
        ? "bg-green-600 text-white cursor-default shadow-lg"
        : plan.price > 0
        ? `${GRADIENT_CLASS} hover:opacity-90 text-white shadow-lg shadow-amber-300/50`
        : "bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-md";

    // Pilihan Ikon berdasarkan Kategori Plan
    let Icon = Package;
    if (plan.slug === "basic") Icon = Camera;
    if (plan.is_popular) Icon = Star;
    if (plan.category === "ULTIMA") Icon = ZapIcon;

    // Teks durasi
    const durationText =
        plan.duration_days === 0
            ? "/ Selamanya"
            : `/ ${plan.duration_days} Hari`;

    return (
        <div
            className={`flex flex-col rounded-2xl p-6 shadow-2xl transition-all duration-500 transform hover:scale-[1.03] border-4 
            ${
                isActive
                    ? "border-green-500 ring-4 ring-green-200"
                    : "border-gray-200"
            }
            ${
                plan.is_popular
                    ? "relative ring-4 ring-amber-400 shadow-amber-300/50"
                    : ""
            }
            bg-white`}
        >
            {plan.is_popular && (
                <div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-bold uppercase shadow-lg z-10"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, #FFD700, #FFA500)",
                    }}
                >
                    Pilihan Terbaik
                </div>
            )}

            <header className="text-center mb-6 pt-4">
                <Icon size={32} className={`mx-auto mb-3 ${ACCENT_COLOR}`} />
                <h3 className="text-2xl font-extrabold text-gray-900">
                    {plan.name}
                </h3>
                <p className="text-sm font-semibold text-gray-500 mb-2">
                    Kategori: {plan.category}
                </p>

                <div className="mt-4">
                    <p
                        className={`text-5xl font-extrabold ${
                            plan.price > 0
                                ? "text-transparent bg-clip-text " +
                                  GRADIENT_CLASS
                                : "text-gray-900"
                        }`}
                    >
                        {formatCurrency(plan.price)}
                    </p>
                    <p className="text-gray-500 font-medium mt-1">
                        {durationText}
                    </p>
                </div>
            </header>

            <ul role="list" className="flex-1 space-y-4 mb-8 text-sm">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <Check
                            size={18}
                            className={`flex-shrink-0 mt-1 ${ACCENT_COLOR}`}
                        />
                        <p className={`ml-3 text-gray-700`}>{feature}</p>
                    </li>
                ))}
            </ul>

            <button
                type="button"
                className={`w-full font-bold py-3.5 px-6 rounded-xl transition duration-300 shadow-md flex items-center justify-center ${buttonClass}`}
                onClick={() => onSubscribe(plan.slug)} // Menggunakan slug/name sebagai planId
                disabled={isActive || isLoading}
            >
                {isLoading && plan.price > 0 ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    buttonText
                )}
            </button>
        </div>
    );
};

// --- KOMPONEN UTAMA (MembershipPage) ---
export default function MembershipPage({
    packagePlans: plans,
    currentPlan,
    vendor,
}) {
    const { flash } = usePage().props;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(flash.success || null);
    const [currentPlanId, setCurrentPlanId] = useState(currentPlan);

    // onSubscribe: akan POST ke Laravel untuk membuat invoice, lalu redirect
    const handleSubscribe = (planSlug) => {
        if (planSlug.toLowerCase() === "basic" || planSlug === currentPlanId) {
            setMessage("Anda sudah menggunakan paket ini.");
            return;
        }

        if (
            !confirm(
                `Anda akan dialihkan ke halaman pembayaran untuk paket ${planSlug}. Lanjutkan?`
            )
        )
            return;

        setIsLoading(true);
        setError(null);
        setMessage(null);

        // Panggil Controller Vendor/MembershipController@subscribe
        router.post(
            route("vendor.membership.subscribe"),
            {
                plan_slug: planSlug, // Kirim slug paket yang dipilih
                vendor_id: vendor.id,
            },
            {
                onSuccess: (page) => {
                    // Redirect ke halaman pembayaran (dihandle di Controller)
                },
                onError: (errors) => {
                    setError(
                        errors.message ||
                            "Gagal memulai langganan. Cek log server."
                    );
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            }
        );
    };

    return (
        <VendorLayout
            user={usePage().props.auth.user}
            vendor={vendor}
            header="Pilihan Membership"
        >
            <Head title="Membership Vendor" />

            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                        Pilihan{" "}
                        <span className={ACCENT_COLOR}>Paket Vendor</span>{" "}
                        Terbaik
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Tingkatkan ke paket berbayar untuk eksposur dan fitur
                        tak terbatas.
                    </p>
                </header>

                {/* Alert Messages */}
                {error && (
                    <div
                        className="flex items-center p-4 mb-8 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50"
                        role="alert"
                    >
                        <AlertTriangle className="mr-2 h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">Error:</span> {error}
                    </div>
                )}
                {message && !error && (
                    <div
                        className="flex items-center p-4 mb-8 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50"
                        role="alert"
                    >
                        <Check
                            size={18}
                            className="mr-2 h-5 w-5 flex-shrink-0"
                        />
                        <span className="font-medium">Pesan:</span> {message}
                    </div>
                )}

                {/* Daftar Paket (Dinamis dari Backend) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-20">
                    {plans.length > 0 ? (
                        plans.map((plan) => (
                            <PricingCard
                                key={plan.id}
                                plan={plan}
                                onSubscribe={handleSubscribe}
                                isLoading={isLoading}
                                currentPlanId={currentPlanId}
                            />
                        ))
                    ) : (
                        <div className="md:col-span-2 text-center p-16 bg-white rounded-xl shadow-lg">
                            <ZapIcon
                                className={`${ACCENT_COLOR} mx-auto mb-3`}
                                size={36}
                            />
                            <p className="text-lg text-gray-600">
                                Admin belum mendefinisikan paket membership.
                                Silakan hubungi admin.
                            </p>
                        </div>
                    )}
                </div>

                {/* Section Keuntungan (Sisa dari template, bisa diisi ulang) */}
                <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border-t-4 border-amber-500">
                    <header className="text-center mb-10">
                        <ZapIcon
                            size={36}
                            className={`${ACCENT_COLOR} mx-auto mb-3`}
                        />
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                            Keuntungan Eksklusif
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Dapatkan lebih dari sekedar fitur, raih kesuksesan
                            bisnis Anda.
                        </p>
                    </header>

                    {/* Menggunakan data dummy lokal karena tidak ada di props */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                icon: Eye,
                                title: "Eksposur Maksimal",
                                description:
                                    "Profil Anda muncul di hasil pencarian teratas.",
                            },
                            {
                                icon: ShieldCheck,
                                title: "Tanda Verifikasi",
                                description:
                                    "Meningkatkan kepercayaan calon pengantin.",
                            },
                            {
                                icon: Film,
                                title: "Portofolio Tak Terbatas",
                                description:
                                    "Unggah semua video dan foto Anda.",
                            },
                            {
                                icon: Clock,
                                title: "Dukungan Prioritas",
                                description: "Respons cepat dari tim admin.",
                            },
                        ].map((benefit, index) => {
                            const BenefitIcon = benefit.icon;
                            return (
                                <div
                                    key={index}
                                    className="flex p-4 rounded-lg bg-gray-50 shadow-sm border border-gray-100"
                                >
                                    <BenefitIcon
                                        size={24}
                                        className={`flex-shrink-0 ${ACCENT_COLOR} mt-1`}
                                    />
                                    <div className="ml-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </VendorLayout>
    );
}
