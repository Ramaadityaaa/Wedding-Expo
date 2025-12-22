import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout'; // Pastikan layout customer sudah terintegrasi
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import Navbar from "@/Components/Navbar"; // Mengimpor Navbar yang sudah ada
import Footer from "@/Components/Footer"; // Mengimpor Footer yang sudah ada
import { Badge } from '@/Components/ui/badge';
import { 
    CheckCircle2, 
    ArrowLeft, 
    MessageCircle, 
    Calendar, 
    Info, 
    ShieldCheck,
    Star,
    Clock,
    Users
} from 'lucide-react';

export default function PackageDetail({ pkg, vendor }) {
    // Fungsi format rupiah
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <CustomerLayout>
            <Head title={`Paket ${pkg.name} - Wedding Expo`} />
            
            {/* Navbar yang sudah ada */}
            <Navbar /> 

            <div className="min-h-screen bg-[#FFFBEB]/40 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                    {/* Navigasi - Kembali ke Vendor Detail */}
                    <div className="flex items-center justify-between mb-8">
                        <Link 
                            href={route('vendors.details', vendor.id)} 
                            className="flex items-center text-amber-900/70 hover:text-amber-600 font-medium transition-all group"
                        >
                            <div className="bg-white p-2 rounded-full shadow-sm mr-3 group-hover:shadow-md transition-all">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            Kembali ke Profil Vendor
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Kiri: Visual & Deskripsi (8 Kolom) */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                                <img 
                                    src={pkg.image_url ? `/storage/${pkg.image_url}` : '/images/default-pkg.jpg'} 
                                    className="w-full h-full object-cover"
                                    alt={pkg.name}
                                />
                                <div className="absolute top-6 left-6">
                                    <Badge className="bg-amber-600 hover:bg-amber-600 px-4 py-1.5 text-sm rounded-full shadow-lg border-none">
                                        Paket Pilihan
                                    </Badge>
                                </div>
                            </div>

                            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white">
                                <h1 className="text-4xl font-serif font-bold text-amber-950 mb-4">
                                    {pkg.name}
                                </h1>

                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-amber-950 flex items-center gap-2">
                                        <Info className="w-5 h-5 text-amber-600" />
                                        Deskripsi Paket
                                    </h3>
                                    <div className="text-gray-600 leading-relaxed text-lg whitespace-pre-line bg-amber-50/30 p-6 rounded-2xl border border-amber-100/50">
                                        {pkg.description || "Vendor belum memberikan deskripsi lengkap untuk paket ini."}
                                    </div>
                                </div>

                                <hr className="my-10 border-amber-100" />
                            </div>
                        </div>

                        {/* Kanan: Card Booking (4 Kolom) */}
                        <div className="lg:col-span-4">
                            <Card className="sticky top-28 border-none shadow-2xl rounded-[2.5rem] bg-white ring-1 ring-amber-100 p-8">
                                <div className="mb-6">
                                    <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-widest">Harga Paket</p>
                                    <h2 className="text-4xl font-black text-amber-600">
                                        {formatPrice(pkg.price)}
                                    </h2>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                                        <div className="bg-amber-100 p-1 rounded-full">
                                            <CheckCircle2 className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <span>Konsultasi Gratis</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                                        <div className="bg-amber-100 p-1 rounded-full">
                                            <CheckCircle2 className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <span>Item Sesuai Deskripsi</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                                        <div className="bg-amber-100 p-1 rounded-full">
                                            <CheckCircle2 className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <span>Pendampingan Selama Acara</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {/* Tombol Pesan Sekarang */}
                                    <Link href={route('order.selectDate', { vendorId: vendor.id, packageId: pkg.id })}>
                                        <Button className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-lg font-bold shadow-lg shadow-amber-200 transition-all active:scale-[0.98]">
                                            Pesan Sekarang
                                        </Button>
                                    </Link>
                                </div>

                                <div className="mt-8 pt-8 border-t border-amber-50 text-center text-[10px] text-gray-400 font-medium px-4 leading-relaxed uppercase tracking-tighter">
                                    Pembayaran aman & terverifikasi oleh sistem Wedding Expo
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
