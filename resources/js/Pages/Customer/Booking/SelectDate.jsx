import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react'; 
import { CheckCircle, AlertCircle, Calendar, ArrowLeft, CreditCard } from 'lucide-react';

const SelectDate = ({ vendor, package: packageData, auth }) => {
    const { props } = usePage();
    const serverError = props.flash?.error; 

    // Guard clause for error handling
    if (!vendor || !packageData || serverError) {
        const displayMessage = serverError || 
                               'Vendor atau Paket yang dipilih tidak ditemukan atau data hilang saat loading.';

        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <Head title="Error Data" />
                <div className="max-w-md w-full text-center p-10 bg-white shadow-2xl rounded-3xl border border-red-100">
                    <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={40} className="text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Ups! Terjadi Kesalahan</h1>
                    <p className="text-slate-500 mt-3 leading-relaxed">
                        {displayMessage}
                    </p>
                    <button 
                        onClick={() => window.history.back()}
                        className="mt-8 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-slate-800 hover:bg-slate-900 transition-all shadow-lg"
                    >
                        <ArrowLeft size={18} className="mr-2" /> Kembali
                    </button>
                </div>
            </div>
        );
    }

    const [orderDate, setOrderDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!orderDate) {
            setErrorMessage('Silakan pilih tanggal terlebih dahulu.');
            return;
        }
        setErrorMessage('');
        
        router.post(route('order.store'), {
            vendor_id: vendor.id,
            package_id: packageData.id, 
            order_date: orderDate,
        }, {
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false), 
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                setErrorMessage(firstError || "Gagal membuat pemesanan.");
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">
            <Head title="Atur Jadwal Pemesanan" />
            
            <main className="pt-28 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    
                    {/* Breadcrumb / Back Button */}
                    <button onClick={() => window.history.back()} className="flex items-center text-slate-500 hover:text-amber-600 transition-colors mb-6 group">
                        <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Kembali ke Detail Paket</span>
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        
                        {/* Left Side: Summary */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60 sticky top-28">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-4">Ringkasan Pesanan</h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-slate-400">Vendor</p>
                                        <p className="text-lg font-bold text-slate-800">{vendor?.name}</p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100">
                                        <p className="text-sm text-slate-400">Paket Layanan</p>
                                        <p className="text-lg font-semibold text-slate-800">{packageData?.name}</p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 italic text-sm text-slate-500">
                                        Pastikan tanggal yang Anda pilih sesuai dengan ketersediaan waktu Anda.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Form */}
                        <div className="lg:col-span-3">
                            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden">
                                {/* Decorative Gradient */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 opacity-50"></div>

                                <div className="relative">
                                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                                        Pilih Tanggal
                                    </h1>
                                    <p className="text-slate-500 mb-8">Tentukan kapan acara spesial Anda akan dilangsungkan.</p>

                                    {errorMessage && (
                                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 mb-6 flex items-start animate-in fade-in slide-in-from-top-2">
                                            <AlertCircle className="w-5 h-5 mr-3 mt-0.5 shrink-0" />
                                            <p className="text-sm font-medium">{errorMessage}</p>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="space-y-3">
                                            <label htmlFor="order_date" className="block text-sm font-bold text-slate-700 ml-1">
                                                Tanggal Acara
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Calendar className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <input
                                                    id="order_date"
                                                    type="date"
                                                    value={orderDate}
                                                    onChange={(e) => setOrderDate(e.target.value)}
                                                    required
                                                    min={new Date().toISOString().split('T')[0]} 
                                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-lg font-medium shadow-inner"
                                                    disabled={processing}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing || !orderDate}
                                            className={`w-full group relative flex items-center justify-center py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform active:scale-[0.98] ${
                                                processing || !orderDate 
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                                : 'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-amber-200 shadow-xl shadow-amber-500/20'
                                            }`}
                                        >
                                            {processing ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Memproses...
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    Lanjutkan ke Pembayaran
                                                    <CreditCard size={20} className="ml-2 opacity-80 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SelectDate;
