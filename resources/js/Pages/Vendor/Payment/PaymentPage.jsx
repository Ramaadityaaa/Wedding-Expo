import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
// PERBAIKAN: Mengembalikan ke alias default Breeze
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// --- IKON SVG (Tetap sama) ---

// Ikon Kartu Kredit (Warna Terakota)
const CreditCardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E07A5F]">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
);

// Ikon QRIS (Warna Terakota)
const QrisIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E07A5F]">
        <rect width="5" height="5" x="3" y="3" rx="1" />
        <rect width="5" height="5" x="16" y="3" rx="1" />
        <rect width="5" height="5" x="3" y="16" rx="1" />
        <path d="M21 16h-5v5M10 10h4v4h-4zM10 3v1M3 10h1M10 20v1M20 10h1" />
    </svg>
);

// Ikon Ceklis (Warna Terakota)
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#E07A5F] mr-2 flex-shrink-0">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);
// ---

// Ganti nama komponen menjadi PaymentPage
export default function PaymentPage({ auth, plan, tax, total }) {
    const { data, setData, post, processing, errors } = useForm({
        payment_method: 'card', // 'card' or 'qris'
        cardholder_name: '',
        card_number: '',
        expiry_date: '',
        cvc: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('card');

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
        setData('payment_method', method);
    };

    const submit = (e) => {
        e.preventDefault();
        // Ganti nama rute post
        post(route('payment.store'));
    };

    // Format harga ke Rupiah (Tetap sama)
    const formatCurrency = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-serif text-2xl text-[#5E504C] leading-tight">Halaman Pembayaran</h2>}
        >
            {/* Ganti title halaman */}
            <Head title="Halaman Pembayaran" />

            <div className="py-12 bg-[#FFFBF7]">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-[#E07A5F]/30">
                        <form onSubmit={submit}>
                            <div className="p-6 md:p-10 text-[#5E504C] grid grid-cols-1 md:grid-cols-2 gap-10">

                                {/* Kolom Kiri: Ringkasan Pesanan (Tetap sama) */}
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-serif text-[#5E504C] border-b border-[#E07A5F]/50 pb-2">
                                        Ringkasan Pesanan
                                    </h3>
                                    <div className="bg-[#FFFBF7] p-6 rounded-lg border border-[#E07A5F]/50 space-y-4">
                                        <h4 className="text-xl font-semibold">{plan.name}</h4>
                                        <ul className="space-y-2 text-sm">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-center">
                                                    <CheckIcon />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        <div className="border-t border-[#E07A5F]/50 pt-4 space-y-2">
                                            <div className="flex justify-between">
                                                <span>Subtotal</span>
                                                <span className="font-semibold">{formatCurrency(plan.price)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>PPN (11%)</span>
                                                <span className="font-semibold">{formatCurrency(tax)}</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-bold text-[#E07A5F]">
                                                <span>Total Pembayaran</span>
                                                <span>{formatCurrency(total)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Dengan melanjutkan, Anda setuju dengan Syarat & Ketentuan kami. Langganan Anda akan diperpanjang secara otomatis. Anda bisa membatalkannya kapan saja.
                                    </p>
                                </div>

                                {/* Kolom Kanan: Detail Pembayaran (Logika tetap sama) */}
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-serif text-[#5E504C] border-b border-[#E07A5F]/50 pb-2">
                                        Metode Pembayaran
                                    </h3>
                                    
                                    {/* Pilihan Metode */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handlePaymentMethodChange('card')}
                                            className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                                                paymentMethod === 'card' ? 'border-[#E07A5F] bg-[#FFFBF7] ring-2 ring-[#E07A5F]' : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            <CreditCardIcon />
                                            <span className="ml-3 font-semibold">Kartu Kredit/Debit</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handlePaymentMethodChange('qris')}
                                            className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                                                paymentMethod === 'qris' ? 'border-[#E07A5F] bg-[#FFFBF7] ring-2 ring-[#E07A5F]' : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            <QrisIcon />
                                            <span className="ml-3 font-semibold">QRIS</span>
                                        </button>
                                    </div>

                                    {/* Form Kartu Kredit */}
                                    {paymentMethod === 'card' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="cardholder_name" className="block text-sm font-medium mb-1">Nama Pemegang Kartu</label>
                                                <input 
                                                    type="text" 
                                                    id="cardholder_name"
                                                    value={data.cardholder_name}
                                                    onChange={e => setData('cardholder_name', e.target.value)}
                                                    className="w-full rounded-lg border-[#E07A5F]/50 focus:border-[#E07A5F] focus:ring-[#E07A5F] bg-white"
                                                    placeholder="Nama lengkap Anda"
                                                />
                                                {errors.cardholder_name && <p className="text-sm text-red-600 mt-1">{errors.cardholder_name}</p>}
                                            </div>
                                            <div>
                                                {/* PERBAIKAN: Mengganti </Mabel> menjadi </label> */}
                                                <label htmlFor="card_number" className="block text-sm font-medium mb-1">Nomor Kartu</label>
                                                <input 
                                                    type="text" 
                                                    id="card_number"
                                                    value={data.card_number}
                                                    onChange={e => setData('card_number', e.target.value)}
                                                    className="w-full rounded-lg border-[#E07A5F]/50 focus:border-[#E07A5F] focus:ring-[#E07A5F] bg-white"
                                                    placeholder="0000 0000 0000 0000"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="expiry_date" className="block text-sm font-medium mb-1">Kedaluwarsa (MM/YY)</label>
                                                    <input 
                                                        type="text" 
                                                        id="expiry_date"
                                                        value={data.expiry_date}
                                                        onChange={e => setData('expiry_date', e.target.value)}
                                                        className="w-full rounded-lg border-[#E07A5F]/50 focus:border-[#E07A5F] focus:ring-[#E07A5F] bg-white"
                                                        placeholder="MM / YY"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="cvc" className="block text-sm font-medium mb-1">CVC</label>
                                                    <input 
                                                        type="text" 
                                                        id="cvc"
                                                        value={data.cvc}
                                                        onChange={e => setData('cvc', e.target.value)}
                                                        className="w-full rounded-lg border-[#E07A5F]/50 focus:border-[#E07A5F] focus:ring-[#E07A5F] bg-white"
                                                        placeholder="123"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tampilan QRIS */}
                                    {paymentMethod === 'qris' && (
                                        <div className="p-6 bg-[#FFFBF7] rounded-lg border border-[#E07A5F]/50 text-center space-y-4">
                                            <p className="font-semibold">Pindai kode QR untuk membayar</p>
                                            {/* Ganti dengan gambar QR Code asli dari payment gateway */}
                                            <div className="w-48 h-48 bg-gray-300 mx-auto rounded-lg flex items-center justify-center text-gray-500">
                                                [QR Code Placeholder]
                                            </div>
                                            <p className="text-sm">Gunakan aplikasi bank atau e-wallet Anda (GoPay, OVO, Dana, ShopeePay, dll) untuk memindai.</p>
                                        </div>
                                    )}

                                    {/* Tombol Bayar */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-[#E07A5F] text-white font-bold py-4 px-6 rounded-lg text-lg shadow-md hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E07A5F] disabled:opacity-50"
                                    >
                                        {processing ? 'Memproses...' : `Bayar Sekarang (${formatCurrency(total)})`}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}