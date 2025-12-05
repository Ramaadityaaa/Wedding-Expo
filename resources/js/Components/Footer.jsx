import React from 'react';
import { Link } from '@inertiajs/react';
// Menggunakan ikon Lucide seperti di komponen Navbar Anda
import { Mail, Phone, MapPin } from 'lucide-react'; 

const Footer = () => (
    // Menggunakan warna latar belakang yang sangat gelap (dark blue/black) 
    // agar sesuai dengan image yang Anda berikan.
    <footer className="bg-[#121421] text-gray-300 mt-16 shadow-[0_-15px_30px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                
                {/* 1. Kolom Logo & Deskripsi */}
                <div>
                    {/* Logo sesuai dengan gambar */}
                    <Link href="/" className="mb-4 inline-block">
                        <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold shadow-xl rounded-lg">
                            <div className="text-xl font-serif tracking-wide leading-tight">
                                Wedding<span className="font-black">Expo</span>
                            </div>
                        </div>
                    </Link>
                    <p className="text-gray-400 text-sm mt-2">
                        Platform direktori wedding organizer terlengkap di Indonesia.
                    </p>
                </div>

                {/* 2. Kolom Layanan */}
                <div>
                    <h4 className="font-semibold text-yellow-400 mb-4 border-b border-gray-700/50 pb-1">Layanan</h4>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/#vendors" className="text-gray-400 hover:text-yellow-300 transition text-sm">Cari Vendor</Link>
                        </li>
                        <li>
                            <Link href="/#inspiration" className="text-gray-400 hover:text-yellow-300 transition text-sm">Inspirasi</Link>
                        </li>
                        <li>
                            <Link href="/#about" className="text-gray-400 hover:text-yellow-300 transition text-sm">Tentang Kami</Link>
                        </li>
                    </ul>
                </div>

                {/* 3. Kolom Vendor */}
                <div>
                    <h4 className="font-semibold text-yellow-400 mb-4 border-b border-gray-700/50 pb-1">Vendor</h4>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/register/vendor" className="text-gray-400 hover:text-yellow-300 transition text-sm">Daftar Vendor</Link>
                        </li>
                        <li>
                            <Link href="/login" className="text-gray-400 hover:text-yellow-300 transition text-sm">Login Vendor</Link>
                        </li>
                    </ul>
                </div>

                {/* 4. Kolom Kontak */}
                <div>
                    <h4 className="font-semibold text-yellow-400 mb-4 border-b border-gray-700/50 pb-1">Kontak</h4>
                    <ul className="space-y-3">
                        <li className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-yellow-500" />
                            <a href="mailto:info@weddingexpo.id" className="text-gray-400 hover:text-yellow-300 transition text-sm">
                                info@weddingexpo.id
                            </a>
                        </li>
                        <li className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-yellow-500" />
                            <span className="text-gray-400 text-sm">+62 21 1234 5678</span>
                        </li>
                        <li className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-yellow-500" />
                            <span className="text-gray-400 text-sm">
                                Jakarta, Indonesia
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} WeddingExpo. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
);

export default Footer;