// Salin semua kode ini untuk file:
// resources/js/Pages/Vendor/Payment/PaymentPage.jsx

import React, { useState, useEffect } from 'react';
import { router, useForm, Head } from '@inertiajs/react'; // Import Inertia asli

// --- IKON SVG ---
const primaryColor = '#A3844C';
const secondaryColor = '#FFBB00';
const BankTransferIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0" style={{color: primaryColor}}>
        <rect width="20" height="14" x="2" y="5" rx="2" /><path d="M7 15h0M12 15h0M17 15h0" /><path d="M12 2v3" /><path d="M6 2v3" /><path d="M18 2v3" />
    </svg>
);
const QrisIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0" style={{color: primaryColor}}>
        <rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-5v5M10 10h4v4h-4zM10 3v1M3 10h1M10 20v1M20 10h1" />
    </svg>
);
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-2 flex-shrink-0" style={{color: primaryColor}}>
        <path d="M20 6 9 17l-5-5" />
    </svg>
);
const LargeCheckIcon = ({ color = 'white' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-8.98" /><path d="M22 4L12 14.01l-3-3" />
    </svg>
);
// --- Akhir Ikon SVG ---


// Komponen Toast Notification
const ToastNotification = ({ isVisible, message, primaryColor }) => {
    return (
        <div 
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out 
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}
        >
            <div 
                className="flex items-center p-4 rounded-xl shadow-2xl text-white font-semibold min-w-[200px]"
                style={{ backgroundColor: primaryColor }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-8.98" /><path d="M22 4L12 14.01l-3-3" />
                </svg>
                {message}
            </div>
        </div>
    );
};

// Komponen Card Header Pembayaran
const PaymentHeaderCard = ({ title, primaryColor, secondaryColor }) => (
    <div 
        className="p-6 md:p-8 rounded-t-xl text-white shadow-lg flex items-center justify-between"
        style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
    >
        <h2 className="font-bold text-3xl sm:text-4xl">{title}</h2>
        <LargeCheckIcon color="white" />
    </div>
);

// Helper formatCurrency
const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

// Komponen Halaman Utama
export default function PaymentPage({ auth, plan, tax, total }) {
    
    // ================== AWAL PERBAIKAN #1 ==================
    // Ganti 'setErrors' dengan 'setError' dan 'clearErrors'
    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        payment_method: 'bank_transfer',
        account_name: '', 
    });
    // ================== AKHIR PERBAIKAN #1 =================

    const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
    const [toast, setToast] = useState({ visible: false, message: '' });

    const showToast = (message) => {
        setToast({ visible: true, message });
        let timer = setTimeout(() => {
            setToast({ visible: false, message: '' });
        }, 2200);
        return () => clearTimeout(timer);
    };

    const handlePaymentMethodChange = (method) => {
        if (paymentMethod === method) return; 
        setPaymentMethod(method);
        setData('payment_method', method); 
    };

    // ================== AWAL PERBAIKAN #2 ==================
    // Perbaikan di dalam fungsi submit
    const submit = (e) => {
        e.preventDefault();
        clearErrors(); // <-- Ganti dari setErrors({})

        if (paymentMethod === 'bank_transfer') {
            if (data.account_name.trim() === '') {
                // Ganti dari setErrors({ ... })
                setError('account_name', 'Nama Rekening Transfer wajib diisi.');
                return; 
            }
            
            // Panggil router.get TANPA 'onStart'
            // 'processing' akan otomatis di-set oleh Inertia
            router.get('/vendor/payment/upload', {
                invoice_id: 'INV-DUMMY-123', 
                amount: total,
                account_name: data.account_name
            });
        } 
        
        else if (paymentMethod === 'qris') {
            // Panggil router.get TANPA 'onStart'
            router.get('/vendor/payment/loading');
        }
    };
    // ================== AKHIR PERBAIKAN #2 ==================

    return (
        <div className="font-sans min-h-screen" style={{backgroundColor: '#FFFBF7'}}>
            <Head title="Halaman Pembayaran" />

            <main>
                <div className="py-12" style={{backgroundColor: '#FFFCEB'}}>
                    <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-2xl sm:rounded-xl border-b-8" style={{borderColor: secondaryColor}}>
                            
                            <PaymentHeaderCard 
                                title="HALAMAN PEMBAYARAN" 
                                primaryColor={primaryColor} 
                                secondaryColor={secondaryColor} 
                            />

                            <form onSubmit={submit}>
                                <div className="p-6 md:p-10 text-gray-800 grid grid-cols-1 md:grid-cols-5 gap-10">

                                    {/* Kolom Kiri: Ringkasan Pesanan */}
                                    <div className="space-y-6 md:col-span-3">
                                        <h3 className="text-2xl font-serif border-b pb-2" style={{color: primaryColor, borderColor: primaryColor + '50'}}>
                                            Ringkasan Tagihan ({formatCurrency(total)})
                                        </h3>
                                        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 shadow-sm">
                                            
                                            <div className="border-b border-gray-100 pb-4">
                                                <div className="flex justify-between font-semibold text-lg text-gray-700">
                                                    <span>{plan.name}</span>
                                                    <span style={{color: primaryColor}}>{formatCurrency(plan.price)}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <p className="font-medium text-gray-700">Manfaat Utama:</p>
                                                {plan.features.map((feature, index) => (
                                                    <li key={index} className="flex items-start list-none">
                                                        <CheckIcon />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </div>

                                            <div className="border-t pt-4 space-y-2" style={{borderColor: secondaryColor + '50'}}>
                                                <div className="flex justify-between text-sm">
                                                    <span>Subtotal</span>
                                                    <span className="font-semibold">{formatCurrency(plan.price)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>PPN (11%)</span>
                                                    <span className="font-semibold">{formatCurrency(tax)}</span>
                                                </div>
                                                <div className="flex justify-between text-xl font-extrabold" style={{color: primaryColor}}>
                                                    <span>Total Tagihan</span>
                                                    <span>{formatCurrency(total)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <p className="text-xs text-gray-500 pt-4">
                                            Dengan mengklik "Bayar Sekarang", Anda mengonfirmasi telah membaca dan menyetujui Syarat dan Ketentuan layanan kami.
                                        </p>
                                    </div>

                                    {/* Kolom Kanan: Detail Pembayaran */}
                                    <div className="space-y-6 md:col-span-2">
                                        <h3 className="text-2xl font-serif border-b pb-2" style={{color: primaryColor, borderColor: primaryColor + '50'}}>
                                            Metode
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => handlePaymentMethodChange('bank_transfer')}
                                                className={`flex items-center p-4 rounded-xl border-2 transition-all shadow-md ${
                                                    paymentMethod === 'bank_transfer' ? 'border-primary-gold bg-light-gold ring-2 ring-primary-gold' : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                                style={{
                                                    '--primary-gold': primaryColor,
                                                    '--light-gold': '#FFF7E6',
                                                    borderColor: paymentMethod === 'bank_transfer' ? primaryColor : 'rgb(209 213 219)',
                                                    backgroundColor: paymentMethod === 'bank_transfer' ? '#FFF7E6' : 'white',
                                                    '--tw-ring-color': primaryColor,
                                                }}
                                            >
                                                <BankTransferIcon />
                                                <span className="ml-3 font-semibold text-sm sm:text-base text-gray-700">Transfer Bank (Mandiri/BCA)</span>
                                            </button>
                                            
                                            <button
                                                type="button"
                                                onClick={() => handlePaymentMethodChange('qris')}
                                                className={`flex items-center p-4 rounded-xl border-2 transition-all shadow-md ${
                                                    paymentMethod === 'qris' ? 'border-primary-gold bg-light-gold ring-2 ring-primary-gold' : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                                style={{
                                                    '--primary-gold': primaryColor,
                                                    '--light-gold': '#FFF7E6',
                                                    borderColor: paymentMethod === 'qris' ? primaryColor : 'rgb(209 213 219)',
                                                    backgroundColor: paymentMethod === 'qris' ? '#FFF7E6' : 'white',
                                                    '--tw-ring-color': primaryColor,
                                                }}
                                            >
                                                <QrisIcon />
                                                <span className="ml-3 font-semibold text-sm sm:text-base text-gray-700">QRIS (Semua E-Wallet)</span>
                                            </button>
                                        </div>

                                        {/* Detail Transfer Bank */}
                                        {paymentMethod === 'bank_transfer' && (
                                            <div className="space-y-4 p-5 bg-gray-50 rounded-lg border border-gray-200">
                                                <p className="font-semibold text-sm" style={{color: primaryColor}}>Langkah Transfer Bank</p>
                                                <div className="space-y-3">
                                                    <TransferDetail label="Bank Tujuan" value="Mandiri (PT. Vendor Cemerlang)" showToast={showToast} secondaryColor={secondaryColor} />
                                                    <TransferDetail label="Nomor Rekening" value="123 4567 8901" showToast={showToast} secondaryColor={secondaryColor} />
                                                    <TransferDetail label="Jumlah Tagihan" value={formatCurrency(total)} valueStyle={{fontWeight: 'bold', color: primaryColor}} showToast={showToast} secondaryColor={secondaryColor} />
                                                    <TransferDetail label="Batas Waktu" value="24 jam setelah tagihan ini dibuat" showToast={showToast} secondaryColor={secondaryColor} />
                                                </div>

                                                <div className="pt-2">
                                                    <label htmlFor="account_name" className="block text-sm font-medium mb-1">Nama Pemilik Rekening Transfer <span className="text-red-500">*</span></label>
                                                    <input 
                                                        type="text" 
                                                        id="account_name"
                                                        name="account_name"
                                                        value={data.account_name} 
                                                        onChange={(e) => setData('account_name', e.target.value)} 
                                                        className={`w-full p-3 border rounded-lg bg-white shadow-sm transition duration-150 focus:ring-secondary-orange focus:border-secondary-orange ${errors.account_name ? 'border-red-500' : 'border-gray-300'}`}
                                                        placeholder="Nama Anda di buku tabungan"
                                                        style={{'--tw-ring-color': secondaryColor, '--tw-border-color': secondaryColor}}
                                                    />
                                                    {errors.account_name && <p className="text-sm text-red-600 mt-1">{errors.account_name}</p>}
                                                </div>
                                                <p className="text-xs text-gray-500 pt-1">
                                                    Setelah transfer, klik tombol di bawah untuk konfirmasi pembayaran.
                                                </p>
                                            </div>
                                        )}

                                        {/* Tampilan QRIS */}
                                        {paymentMethod === 'qris' && (
                                            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center space-y-4 shadow-inner">
                                                <p className="font-semibold text-sm" style={{color: primaryColor}}>Pindai Kode QR ini</p>
                                                <img
                                                    src={`https://placehold.co/192x192/${secondaryColor.substring(1)}/ffffff?text=QRIS+CODE`}
                                                    alt="QR Code Placeholder"
                                                    className="w-48 h-48 mx-auto rounded-lg border border-gray-300 shadow-md"
                                                />
                                                <p className="text-sm text-gray-600">Pastikan jumlah yang dibayarkan adalah <span className="font-bold" style={{color: primaryColor}}>{formatCurrency(total)}</span>.</p>
                                                <p className="text-xs text-gray-500">
                                                    Gunakan aplikasi bank atau e-wallet (GoPay, DANA, dll) yang mendukung QRIS.
                                                </p>
                                            </div>
                                        )}

                                        {/* Tombol Bayar */}
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full text-white font-bold py-4 px-6 rounded-xl text-lg shadow-xl transition-all disabled:opacity-50"
                                            style={{
                                                backgroundColor: primaryColor,
                                                backgroundImage: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                                                backgroundSize: '200% 100%',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundPosition = 'right center'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundPosition = 'left center'}
                                        >
                                            {processing ? 'Memproses...' : (paymentMethod === 'bank_transfer' ? 'Konfirmasi Pembayaran' : 'Selesai Memindai QRIS')}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            
            <ToastNotification 
                isVisible={toast.visible} 
                message={toast.message} 
                primaryColor={primaryColor}
            />
        </div>
    );
}

// Komponen Pembantu untuk detail transfer bank
const TransferDetail = ({ label, value, valueStyle = {}, showToast, secondaryColor }) => (
    <div className="flex justify-between text-sm text-gray-700">
        <span className="font-medium text-gray-600">{label}</span>
        <span className="font-mono text-right" style={{...valueStyle}}>
            {value}
            {label === 'Nomor Rekening' && (
                <button 
                    type="button" 
                    onClick={() => {
                        if (navigator.clipboard) {
                            navigator.clipboard.writeText(value).then(() => {
                                if (showToast) showToast('Nomor Rekening berhasil disalin!');
                            }).catch(err => {
                                console.error('Gagal menyalin:', err);
                                if (showToast) showToast('Gagal menyalin. Salin manual.');
                            });
                        } else {
                            if (showToast) showToast('Browser tidak mendukung. Salin manual.');
                        }
                    }}
                    className="ml-2 text-xs font-normal underline" 
                    style={{color: secondaryColor}}
                >
                    [Salin]
                </button>
            )}
        </span>
    </div>
);