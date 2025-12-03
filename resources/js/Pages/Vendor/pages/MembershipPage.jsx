// resources/js/Pages/Vendor/MembershipPage.jsx
import React, { useState, useEffect } from 'react';
import { Check, Star, Camera, XCircle, Loader2, AlertTriangle, Eye, Clock, Film, ShieldCheck, Zap as ZapIcon } from 'lucide-react';
import { router } from '@inertiajs/react'; // Inertia router (navigasi SPA)

// --- KONFIGURASI UMUM & API ENDPOINT ---
const API_BASE_URL = 'http://localhost:8000/api'; // Ganti sesuai backend Laravel bila ada
const PRIMARY_COLOR = 'bg-amber-500';
const ACCENT_COLOR = 'text-amber-600';
const GRADIENT_CLASS = 'bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500';

// --- DATA PAKET BERLANGGANAN ---
const plans = [
    {
        name: 'Basic (Gratis)',
        price: 'Rp 0',
        duration: '/ Selamanya',
        planId: 'basic',
        isFree: true,
        features: [
            { text: 'Akses Direktori Dasar', included: true },
            { text: 'Profil Vendor Sederhana', included: true },
            { text: 'Maks. 5 Foto Unggahan', included: true },
            { text: 'Tidak Bisa Unggah Video', included: false },
            { text: 'Dukungan Prioritas Admin', included: false },
            { text: 'Analisis Kinerja Dasar', included: false },
            { text: 'Promosi di Halaman Utama', included: false },
        ],
        colorClass: 'border-gray-300 bg-white',
        icon: Camera
    },
    {
        name: 'Premium (Langganan Bulanan)',
        price: 'Rp 250.000',
        duration: '/ Bulan',
        planId: 'premium',
        isPopular: true,
        features: [
            { text: 'Semua fitur Basic', included: true },
            { text: 'Unggahan Foto Tidak Terbatas', included: true },
            { text: 'Unggahan Video Tidak Terbatas', included: true },
            { text: 'Kontak Langsung Prioritas', included: true },
            { text: 'Tanda Vendor Terverifikasi', included: true },
            { text: 'Dukungan Prioritas 24/7', included: true },
            { text: 'Analisis Kinerja Lanjut', included: true },
        ],
        colorClass: 'border-amber-500 bg-amber-50',
        icon: Star
    },
];

// --- DATA KEUNTUNGAN PREMIUM ---
const premiumBenefits = [
    { icon: Eye, title: 'Peningkatan Eksposur 5x Lipat', description: 'Profil Anda akan muncul di bagian atas hasil pencarian.' },
    { icon: ShieldCheck, title: 'Personalisasi Profil Tak Terbatas', description: 'Edit profil, deskripsi dan harga tanpa batas.' },
    { icon: Film, title: 'Portofolio Multimedia Tanpa Batas', description: 'Unggah video dan foto tanpa batas.' },
    { icon: Clock, title: 'Dukungan Premium 24/7', description: 'Respons cepat dari tim admin.' },
];

// --- PricingCard (presentational) ---
const PricingCard = ({ plan, onSubscribe, isLoading, currentPlanId }) => {
    const isPremium = plan.planId === 'premium';
    const isActive = plan.planId === currentPlanId;

    const buttonText = isActive
        ? 'Aktif'
        : isPremium ? 'Mulai Berlangganan Sekarang' : 'Pilih Paket Gratis';

    const buttonClass = isActive
        ? 'bg-green-500 text-white cursor-default'
        : isPremium
            ? `${GRADIENT_CLASS} hover:opacity-90 text-white`
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300';

    const Icon = plan.icon;

    return (
        <div
            className={`flex flex-col rounded-2xl p-6 shadow-2xl transition-all duration-500 transform hover:scale-[1.03] border-4 
            ${plan.colorClass} ${isPremium ? 'relative ring-4 ring-amber-400 shadow-amber-300/50' : ''}`}
        >
            {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-bold uppercase shadow-lg z-10"
                    style={{ backgroundImage: 'linear-gradient(to right, #FFD700, #FFA500)' }}
                >
                    Pilihan Terbaik
                </div>
            )}

            <header className="text-center mb-6 pt-4">
                <Icon size={32} className={`mx-auto mb-3 ${ACCENT_COLOR}`} />
                <h3 className="text-2xl font-extrabold text-gray-900">{plan.name}</h3>

                <div className="mt-4">
                    <p className={`text-5xl font-extrabold ${isPremium ? 'text-transparent bg-clip-text ' + GRADIENT_CLASS : 'text-gray-900'}`}>
                        {plan.price}
                    </p>
                    <p className="text-gray-500 font-medium mt-1">{plan.duration}</p>
                </div>
            </header>

            <ul role="list" className="flex-1 space-y-4 mb-8 text-sm">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        {feature.included ? (
                            <Check size={18} className={`flex-shrink-0 mt-1 ${ACCENT_COLOR}`} />
                        ) : (
                            <XCircle size={18} className="flex-shrink-0 mt-1 text-gray-400" />
                        )}
                        <p className={`ml-3 text-gray-700 ${!feature.included ? 'line-through text-gray-400' : ''}`}>
                            {feature.text}
                        </p>
                    </li>
                ))}
            </ul>

            {/* Tombol aksi: HAPUS class 'block' yg konflik; gunakan 'w-full' + flex */}
            <button
                type="button"
                className={`w-full font-bold py-3.5 px-6 rounded-xl transition duration-300 shadow-md flex items-center justify-center ${buttonClass}`}
                onClick={() => onSubscribe(plan.planId)}
                disabled={isActive || isLoading}
            >
                {isLoading && isPremium ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    buttonText
                )}
            </button>
        </div>
    );
};

// --- KOMPONEN UTAMA (SubscriptionPage) ---
const SubscriptionPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [currentPlanId, setCurrentPlanId] = useState('basic');

    useEffect(() => {
        // Jika mau fetch status vendor dari API, lakukan di sini
        // contoh: fetch(`${API_BASE_URL}/vendor/status`) ...
    }, []);

    // Helper: bangun path invoice (gunakan route() Ziggy bila tersedia, fallback ke template path)
    const buildInvoicePath = (invoiceId) => {
        
        // ================== AWAL PERBAIKAN ==================
        // Fungsi route('vendor.payment.invoice') dari Ziggy Anda tampaknya
        // menghasilkan URL yang salah (tanpa prefix /vendor).
        // Ini adalah masalah konfigurasi di file routes/web.php atau vendor.php di backend.
        //
        // Untuk sementara, kita paksa (hardcode) menggunakan path manual
        // yang sudah benar, sambil menunggu backend diperbaiki.

        /*
        try {
            if (typeof route === 'function') {
                // Ziggy present
                return route('vendor.payment.invoice', invoiceId);
            }
        } catch (e) {
            // ignore
        }
        */
       
        // Langsung gunakan path manual:
        return `/vendor/payment/invoice/${invoiceId}`;
        // ================== AKHIR PERBAIKAN ==================
    };

    // onSubscribe: akan POST ke API untuk membuat invoice, lalu redirect ke halaman invoice
    const handleSubscribe = async (planId) => {
        if (planId === 'basic') {
            setMessage('Anda sudah menggunakan paket Basic.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            // Jika Anda punya API Laravel untuk membuat invoice, gunakan fetch POST di bawah.
            // Contoh endpoint backend: POST /api/invoices  (kembalikan { invoiceId: 'INV-xxx' })
            // Jika tidak ada backend, kita fallback ke simulasi.

            // ----- contoh nyata (comment jika belum tersedia) -----
            // const resp = await fetch(`${API_BASE_URL}/invoices`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ planId })
            // });
            // const result = await resp.json();
            // if (!resp.ok) throw new Error(result.message || 'Gagal membuat invoice');
            // const invoiceId = result.invoiceId;

            // ----- fallback simulasi -----
            await new Promise(r => setTimeout(r, 700)); // simulasi delay
            const invoiceId = `INV-${Date.now()}`; // simulated invoice id

            setMessage('Invoice dibuat. Mengalihkan ke halaman invoice...');
            
            // redirect ke halaman invoice (Inertia)
            const path = buildInvoicePath(invoiceId);
            router.get(path); // Inertia navigation

        } catch (err) {
            console.error('Subscribe error', err);
            setError(err.message || 'Gagal memulai langganan.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 md:p-12 lg:p-16 font-sans">
            <div className="max-w-5xl mx-auto">

                <header className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                        Pilihan <span className={ACCENT_COLOR}>Paket Vendor</span> Terbaik
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Tingkatkan ke Premium (Rp 250.000/Bulan) untuk eksposur dan fitur tak terbatas.
                    </p>
                </header>

                {error && (
                    <div className="flex items-center p-4 mb-8 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50" role="alert">
                        <AlertTriangle className="mr-2 h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">Error:</span> {error}
                    </div>
                )}
                {message && !error && (
                    <div className="flex items-center p-4 mb-8 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50" role="alert">
                        <Check className="mr-2 h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">Sukses:</span> {message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-20">
                    {plans.map((plan) => (
                        <PricingCard
                            key={plan.planId}
                            plan={plan}
                            onSubscribe={handleSubscribe}
                            isLoading={isLoading}
                            currentPlanId={currentPlanId}
                        />
                    ))}
                </div>

                <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border-t-4 border-amber-500">
                    <header className="text-center mb-10">
                        <ZapIcon size={36} className={`${ACCENT_COLOR} mx-auto mb-3`} />
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Keuntungan Eksklusif Paket Premium</h2>
                        <p className="text-gray-600 text-lg">Dapatkan lebih dari sekedar fitur, raih kesuksesan bisnis Anda dengan alat terbaik kami.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {premiumBenefits.map((benefit, index) => {
                            const BenefitIcon = benefit.icon;
                            return (
                                <div key={index} className="flex p-4 rounded-lg bg-gray-50 shadow-sm border border-gray-100">
                                    <BenefitIcon size={24} className={`flex-shrink-0 ${ACCENT_COLOR} mt-1`} />
                                    <div className="ml-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{benefit.title}</h3>
                                        <p className="text-gray-600 text-sm">{benefit.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default SubscriptionPage;