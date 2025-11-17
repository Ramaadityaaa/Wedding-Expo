import React, { useState, useCallback, useMemo } from 'react';

// --- Konfigurasi Tema dan Data Mock ---
// Warna konsisten dari halaman sebelumnya
const primaryColor = '#A3844C'; // Emas Tua
const secondaryColor = '#FFBB00'; // Kuning Emas Cerah
const borderColor = '#D4B98E'; // Perpaduan warna emas/cokelat muda

// Data dummy (Anggap ini data yang diambil dari Invoice ID)
const dummyInvoice = {
    id: 'INV-120923001',
    transferTarget: 'Mandiri (PT. Vendor Cemerlang)',
    amount: 277500,
    dueDate: '2025-10-31',
};

// Mock fungsi formatCurrency
const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

// Mock hook useForm untuk mensimulasikan Inertia.js/Laravel data submission
const useForm = (initialData) => {
    const [data, setData] = useState(initialData);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const post = (route, formData) => {
        setProcessing(true);
        setErrors({});

        // Simulasi validasi file
        if (!formData.proof_file) {
            setErrors({ proof_file: 'Bukti pembayaran wajib diunggah.' });
            setProcessing(false);
            return;
        }

        // Simulasi API call dengan delay
        setTimeout(() => {
            console.log(`Simulasi POST ke: ${route}`);
            console.log('Data yang disubmit:', {
                invoice_id: formData.invoice_id,
                file_name: formData.proof_file.name,
                file_size: (formData.proof_file.size / 1024).toFixed(2) + ' KB'
            });

            // Simulasi sukses
            // Mengganti alert() dengan tampilan log atau modal sederhana
            console.log(`Unggahan sukses! Bukti pembayaran untuk ${formData.invoice_id} sedang diverifikasi.`);
            setProcessing(false);
            
            // Di aplikasi nyata: arahkan ke halaman status
            // window.location.href = '/payment-status/verifying'; 
        }, 1500);
    };

    return { data, setData, post, processing, errors, setErrors };
};

// --- IKON SVG (Menggantikan Lucide/FontAwesome) ---

const UploadCloudIcon = ({ className = 'w-10 h-10', color = primaryColor }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.5" />
        <path d="M12 12v9" />
        <path d="m8 17 4 4 4-4" />
    </svg>
);

const FileTextIcon = ({ className = 'w-5 h-5', color = primaryColor }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
    </svg>
);

const LargeCheckIcon = ({ color = 'white' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-8.98" />
        <path d="M22 4L12 14.01l-3-3" />
    </svg>
);

// Komponen Card Header Pembayaran
const PaymentHeaderCard = ({ title, primaryColor, secondaryColor }) => (
    <div 
        className="p-8 md:p-10 rounded-t-xl text-white shadow-lg flex items-center justify-between" // Padding ditingkatkan
        style={{
            backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
        }}
    >
        <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-wide">
            {title}
        </h2>
        <LargeCheckIcon color="white" />
    </div>
);

// Komponen Utama
export default function App({ invoice = dummyInvoice }) {
    
    // Anggap route Laravel untuk submission
    const route = (name) => `/api/${name}`; 

    const { data, setData, post, processing, errors, setErrors } = useForm({
        invoice_id: invoice.id,
        proof_file: null,
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = React.useRef(null);

    const handleFileChange = useCallback((file) => {
        if (file) {
            // Validasi sederhana
            if (file.size > 2 * 1024 * 1024) { // Max 2MB
                setErrors({ proof_file: 'Ukuran file maksimal 2MB.' });
                setSelectedFile(null);
                setData(prev => ({ ...prev, proof_file: null }));
                return;
            }
            if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
                setErrors({ proof_file: 'Hanya format JPG, PNG, atau PDF yang diizinkan.' });
                setSelectedFile(null);
                setData(prev => ({ ...prev, proof_file: null }));
                return;
            }

            setErrors({});
            setSelectedFile(file);
            setData(prev => ({ ...prev, proof_file: file }));
        }
    }, [setData, setErrors]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileChange(files[0]);
        }
    }, [handleFileChange]);

    const submit = (e) => {
        e.preventDefault();
        
        // Di dunia nyata, kita akan membuat FormData untuk mengirim file
        post(route('payment.upload'), data);
    };

    const isFileSelected = useMemo(() => !!selectedFile, [selectedFile]);

    return (
        <div className="font-sans min-h-screen bg-white flex justify-center items-start pt-16 pb-20" style={{backgroundColor: '#FFFBF7'}}>
            
            {/* Lebar Kontainer Ditingkatkan dari max-w-4xl menjadi max-w-5xl */}
            <div className="max-w-5xl w-full mx-4 sm:mx-8 lg:mx-12">
                <div className="bg-white overflow-hidden shadow-2xl rounded-2xl border-b-8 mb-16" style={{borderColor: secondaryColor}}>
                    
                    {/* CARD HEADER */}
                    <PaymentHeaderCard 
                        title="UNGGAH BUKTI PEMBAYARAN" 
                        primaryColor={primaryColor} 
                        secondaryColor={secondaryColor} 
                    />

                    <form onSubmit={submit}>
                        {/* Padding Konten Ditingkatkan dari p-6/p-10 menjadi p-8/p-12 */}
                        <div className="p-8 md:p-12 text-gray-800 grid grid-cols-1 md:grid-cols-3 gap-10">

                            {/* Kolom Kiri: Detail Invoice (1/3) */}
                            <div className="space-y-8 md:col-span-1"> {/* Spacing ditingkatkan */}
                                <h3 className="text-2xl font-serif font-semibold border-b pb-3 mb-4" style={{color: primaryColor, borderColor: primaryColor + '50'}}>
                                    Detail Tagihan Pembayaran
                                </h3>
                                <div className="space-y-4 text-base"> {/* Ukuran teks dan spacing ditingkatkan */}
                                    <DetailItem label="ID Invoice" value={invoice.id} highlight={true} />
                                    <DetailItem label="Tujuan Transfer" value={invoice.transferTarget} />
                                    <DetailItem label="Total Harus Dibayar" value={formatCurrency(invoice.amount)} valueStyle={{color: primaryColor, fontWeight: 'bold', fontSize: '1.25rem'}}/>
                                    <DetailItem label="Batas Waktu Pembayaran" value={invoice.dueDate} />
                                </div>

                                <div className="p-5 rounded-xl text-base shadow-md" style={{backgroundColor: '#FFF7E6', border: `1px solid ${borderColor}`}}>
                                    <p className="font-extrabold" style={{color: primaryColor}}>PENTING:</p>
                                    <p className="text-sm mt-2 text-gray-700">Bukti transfer (Struk/Screenshot) harus mencantumkan tanggal, jumlah transfer, dan tujuan rekening yang sesuai untuk mempercepat proses verifikasi.</p>
                                </div>
                            </div>

                            {/* Kolom Kanan: Area Upload (2/3) */}
                            <div className="space-y-8 md:col-span-2"> {/* Spacing ditingkatkan */}
                                <h3 className="text-2xl font-serif font-semibold border-b pb-3 mb-4" style={{color: primaryColor, borderColor: primaryColor + '50'}}>
                                    Formulir Unggah Bukti Transfer
                                </h3>

                                {/* Drag and Drop Area - Tinggi ditingkatkan */}
                                <div
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={handleDrop}
                                    className={`relative p-12 h-64 rounded-2xl border-4 border-dashed transition-all cursor-pointer hover:bg-gray-50 flex items-center justify-center
                                        ${errors.proof_file ? 'border-red-500 bg-red-50' : isFileSelected ? 'border-green-500 bg-green-50' : 'border-gray-300'}
                                    `}
                                    onClick={() => fileInputRef.current.click()}
                                    style={{
                                        borderColor: errors.proof_file ? '#EF4444' : isFileSelected ? '#10B981' : borderColor,
                                        backgroundColor: errors.proof_file ? '#FEF2F2' : isFileSelected ? '#F0FFF4' : 'white',
                                    }}
                                >
                                    <input
                                        type="file"
                                        id="file_upload"
                                        name="proof_file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) => handleFileChange(e.target.files[0])}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        ref={fileInputRef} // Menggunakan ref untuk klik
                                    />
                                    
                                    <div className="text-center space-y-3">
                                        <UploadCloudIcon className="w-20 h-20 mx-auto" color={isFileSelected ? '#10B981' : primaryColor} />
                                        <p className="font-extrabold text-xl text-gray-700">
                                            Seret File Bukti Pembayaran ke Sini
                                        </p>
                                        <p className="text-base text-gray-500">
                                            atau <span className="font-semibold" style={{color: secondaryColor}}>klik di mana saja</span> untuk menelusuri file
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Format yang diterima: JPG, PNG, atau PDF. Ukuran file maksimal: 2 MB.
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Status File */}
                                {isFileSelected && (
                                    <div className="flex items-center p-4 rounded-xl border bg-white shadow-lg" style={{borderColor: '#10B981'}}>
                                        <FileTextIcon color="#10B981" className="w-6 h-6 flex-shrink-0" />
                                        <span className="ml-4 text-base font-semibold text-gray-700 truncate">
                                            {selectedFile.name}
                                        </span>
                                        <span className="ml-auto text-sm text-gray-500 font-mono">
                                            ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    </div>
                                )}

                                {/* Pesan Error */}
                                {errors.proof_file && (
                                    <div className="text-base text-red-700 p-4 rounded-xl bg-red-100 border border-red-400 font-medium">
                                        <p className="font-bold">Gagal Mengunggah:</p>
                                        <p>{errors.proof_file}</p>
                                    </div>
                                )}

                                {/* Tombol Submit */}
                                <button
                                    type="submit"
                                    disabled={processing || !isFileSelected}
                                    className="w-full text-white font-extrabold py-5 px-6 rounded-xl text-xl shadow-2xl transition-all disabled:opacity-50 mt-6 transform hover:scale-[1.01]"
                                    style={{
                                        backgroundColor: primaryColor,
                                        backgroundImage: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                                        backgroundSize: '200% 100%',
                                        boxShadow: `0 10px 20px -5px ${primaryColor}60`,
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundPosition = 'right center'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundPosition = 'left center'}
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Mengunggah & Memproses...
                                        </span>
                                    ) : 'Kirim Bukti Pembayaran'}
                                </button>
                                
                                <p className="text-sm text-gray-500 pt-4 text-center">
                                    Setelah dikirim, verifikasi pembayaran biasanya memakan waktu 1-2 jam kerja.
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Komponen Pembantu Detail Item
const DetailItem = ({ label, value, highlight = false, valueStyle = {} }) => (
    <div className="flex justify-between border-b border-gray-100 py-3"> {/* Padding vertikal ditingkatkan */}
        <span className="text-gray-600 font-medium">{label}</span>
        <span className={`text-right ${highlight ? 'font-mono text-gray-900 font-extrabold' : 'text-gray-800'}`} style={valueStyle}>
            {value}
        </span>
    </div>
);