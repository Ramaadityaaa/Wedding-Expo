import React, { useState, useEffect } from 'react'; // Tambahkan useEffect untuk cleanup
// Catatan: Dependensi Inertia.js/Breeze masih disimulasikan agar komponen dapat berjalan mandiri.

// --- Mock Utility Hooks dan Fungsi (Disesuaikan) ---

// Data dummy
const dummyPlan = {
    name: 'Langganan Membership Premium (Bulanan)',
    price: 250000,
    discount: 0, 
    features: ['Listing Prioritas', 'Akses ke semua fitur', 'Tidak ada biaya tersembunyi', 'Batal kapan saja'],
};
const dummyTax = 27500; 
const dummyTotal = 277500; 

// Mock fungsi formatCurrency
const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

// Mock hook useForm untuk mensimulasikan Inertia.js (data, setData, post, processing)
const useForm = (initialData, initialAccountName = '') => {
    const [data, setData] = useState(initialData);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const total = typeof dummyTotal !== 'undefined' ? dummyTotal : 277500;

    const post = (route, finalData) => {
        setProcessing(true);
        setErrors({});
        
        setTimeout(() => {
            console.log(`Simulating POST to route: ${route}`);
            console.log('Final Data to be submitted:', finalData);
            
            let newErrors = {};
            if (finalData.payment_method === 'bank_transfer') {
                if (!finalData.account_name || finalData.account_name.trim() === '') newErrors.account_name = 'Nama Rekening Transfer wajib diisi.';
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setProcessing(false);
            } else {
                // Mengganti alert() dengan console.log/custom modal karena alert() tidak diizinkan di lingkungan ini.
                console.log(`Pembayaran sebesar ${formatCurrency(total)} menggunakan ${finalData.payment_method === 'bank_transfer' ? `TRANSFER BANK oleh ${finalData.account_name}` : 'QRIS'} berhasil disimulasikan!`);
                // alert(`Pembayaran sebesar ${formatCurrency(total)} menggunakan ${finalData.payment_method === 'bank_transfer' ? `TRANSFER BANK oleh ${finalData.account_name}` : 'QRIS'} berhasil disimulasikan!`);
                setProcessing(false);
            }
        }, 1500);
    };

    return { data, setData, post, processing, errors, setErrors };
};

// --- IKON SVG (Disesuaikan) ---
const primaryColor = '#A3844C'; // Emas Tua
const secondaryColor = '#FFBB00'; // Kuning Emas Cerah

const BankTransferIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0" style={{color: primaryColor}}>
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <path d="M7 15h0M12 15h0M17 15h0" />
        <path d="M12 2v3" />
        <path d="M6 2v3" />
        <path d="M18 2v3" />
    </svg>
);

const QrisIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0" style={{color: primaryColor}}>
        <rect width="5" height="5" x="3" y="3" rx="1" />
        <rect width="5" height="5" x="16" y="3" rx="1" />
        <rect width="5" height="5" x="3" y="16" rx="1" />
        <path d="M21 16h-5v5M10 10h4v4h-4zM10 3v1M3 10h1M10 20v1M20 10h1" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-2 flex-shrink-0" style={{color: primaryColor}}>
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

// Ikon Ceklis Besar untuk header
const LargeCheckIcon = ({ color = 'white' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-8.98" />
        <path d="M22 4L12 14.01l-3-3" />
    </svg>
);
// ---

// Komponen Toast Notification Baru
const ToastNotification = ({ isVisible, message, primaryColor }) => {
    // Gunakan transisi CSS untuk animasi masuk/keluar yang halus
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
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-8.98" />
                    <path d="M22 4L12 14.01l-3-3" />
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
        style={{
            backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
        }}
    >
        <h2 className="font-bold text-3xl sm:text-4xl">
            {title}
        </h2>
        {/* Ikon tambahan di kanan atas, bisa diganti sesuai kebutuhan */}
        <LargeCheckIcon color="white" />
    </div>
);

// Ganti nama komponen menjadi App
export default function App({ auth, plan = dummyPlan, tax = dummyTax, total = dummyTotal }) {
    
    const route = (name) => `/checkout/${name.split('.')[0]}`;
    
    const { data, post, processing, errors, setErrors } = useForm({
        payment_method: 'bank_transfer',
    });

    const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
    const [accountName, setAccountName] = useState('');

    // 1. State untuk notifikasi toast
    const [toast, setToast] = useState({ visible: false, message: '' });

    // 2. Fungsi untuk menampilkan toast
    const showToast = (message) => {
        setToast({ visible: true, message });
        
        // Membersihkan timer sebelumnya jika ada (misal: spam klik)
        let timer = setTimeout(() => {
            setToast({ visible: false, message: '' });
        }, 2200); // Durasi tampil 2.2 detik (disesuaikan dengan transisi)

        // Cleanup timer saat komponen di-unmount
        return () => clearTimeout(timer);
    };

    const handlePaymentMethodChange = (method) => {
        if (paymentMethod === method) return; 
        setPaymentMethod(method);
    };

    const submit = (e) => {
        e.preventDefault();

        const finalData = { 
            ...data, 
            payment_method: paymentMethod,
            account_name: accountName 
        };

        setErrors({});

        let newErrors = {};
        if (paymentMethod === 'bank_transfer' && accountName.trim() === '') {
            newErrors.account_name = 'Nama Rekening Transfer wajib diisi.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            post(route('payment.store'), finalData);
        }
    };

    // Layout Dasar (tanpa header khusus halaman pembayaran)
    const AuthenticatedLayout = ({ children }) => (
        <div className="font-sans min-h-screen bg-white" style={{backgroundColor: '#FFFBF7'}}>
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {/* Header kosong atau hanya berisi elemen navigasi lain (jika ada) */}
                </div>
            </header>
            <main>{children}</main>
        </div>
    );
    
    const Head = ({ title }) => <title>{title}</title>;


    return (
        <AuthenticatedLayout>
            <Head title="Halaman Pembayaran" />

            <div className="py-12" style={{backgroundColor: '#FFFCEB'}}>
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-2xl sm:rounded-xl border-b-8" style={{borderColor: secondaryColor}}>
                        
                        {/* CARD HEADER BARU */}
                        <PaymentHeaderCard 
                            title="HALAMAN PEMBAYARAN" 
                            primaryColor={primaryColor} 
                            secondaryColor={secondaryColor} 
                        />

                        <form onSubmit={submit}>
                            <div className="p-6 md:p-10 text-gray-800 grid grid-cols-1 md:grid-cols-5 gap-10">

                                {/* Kolom Kiri: Ringkasan Pesanan (3/5 lebar) */}
                                <div className="space-y-6 md:col-span-3">
                                    <h3 className="text-2xl font-serif border-b pb-2" style={{color: primaryColor, borderColor: primaryColor + '50'}}>
                                        Ringkasan Tagihan ({formatCurrency(total)})
                                    </h3>
                                    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 shadow-sm">
                                        
                                        {/* Rincian Item */}
                                        <div className="border-b border-gray-100 pb-4">
                                            <div className="flex justify-between font-semibold text-lg text-gray-700">
                                                <span>{plan.name}</span>
                                                <span style={{color: primaryColor}}>{formatCurrency(plan.price)}</span>
                                            </div>
                                            {plan.discount > 0 && (
                                                <div className="flex justify-between text-sm text-red-500 mt-1">
                                                    <span>Diskon Pemasangan Awal</span>
                                                    <span>- {formatCurrency(plan.discount)}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Fitur/Manfaat */}
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <p className="font-medium text-gray-700">Manfaat Utama:</p>
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-start list-none">
                                                    <CheckIcon />
                                                    {feature}
                                                </li>
                                            ))}
                                        </div>

                                        {/* Total Perhitungan */}
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

                                {/* Kolom Kanan: Detail Pembayaran (2/5 lebar) */}
                                <div className="space-y-6 md:col-span-2">
                                    <h3 className="text-2xl font-serif border-b pb-2" style={{color: primaryColor, borderColor: primaryColor + '50'}}>
                                        Metode
                                    </h3>
                                    
                                    {/* Pilihan Metode */}
                                    <div className="grid grid-cols-1 gap-4">
                                        {/* Pilihan Transfer Bank */}
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
                                        
                                        {/* Pilihan QRIS */}
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
                                                {/* Memastikan showToast dan secondaryColor diteruskan */}
                                                <TransferDetail label="Bank Tujuan" value="Mandiri (PT. Vendor Cemerlang)" showToast={showToast} secondaryColor={secondaryColor} />
                                                <TransferDetail label="Nomor Rekening" value="123 4567 8901" showToast={showToast} secondaryColor={secondaryColor} />
                                                <TransferDetail label="Jumlah Tagihan" value={formatCurrency(total)} valueStyle={{fontWeight: 'bold', color: primaryColor}} showToast={showToast} secondaryColor={secondaryColor} />
                                                <TransferDetail label="Batas Waktu" value="24 jam setelah tagihan ini dibuat" showToast={showToast} secondaryColor={secondaryColor} />
                                            </div>

                                            {/* Input Nama Pemilik Rekening (Untuk Konfirmasi) */}
                                            <div className="pt-2">
                                                <label htmlFor="account_name" className="block text-sm font-medium mb-1">Nama Pemilik Rekening Transfer <span className="text-red-500">*</span></label>
                                                <input 
                                                    type="text" 
                                                    id="account_name"
                                                    name="account_name"
                                                    value={accountName} 
                                                    onChange={(e) => setAccountName(e.target.value)} 
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
            {/* 3. Tampilkan Toast Notification */}
            <ToastNotification 
                isVisible={toast.visible} 
                message={toast.message} 
                primaryColor={primaryColor}
            />
        </AuthenticatedLayout>
    );
}

// Komponen Pembantu untuk detail transfer bank
// Menerima showToast dan secondaryColor sebagai props
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
                                // Ganti alert() sukses dengan Toast
                                if (showToast) showToast('Nomor Rekening berhasil disalin!');
                            }).catch(err => {
                                console.error('Gagal menyalin:', err);
                                // Gunakan Toast untuk kegagalan penyalinan
                                if (showToast) showToast('Gagal menyalin. Salin manual.');
                            });
                        } else {
                            // Gunakan Toast jika browser tidak mendukung
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