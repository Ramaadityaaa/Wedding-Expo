import React, { useState } from 'react';

// --- DUMMY IMPLEMENTATION UNTUK MENGHINDARI ERROR IMPOR ---
// Ini mensimulasikan fungsionalitas Inertia.js dan routing.
const Link = ({ href, children, className, ...props }) => (
    <a href={href} className={className} onClick={(e) => {
        if (href && (href.startsWith('/') || href.startsWith('#'))) {
            e.preventDefault();
            console.log(`Navigasi disimulasikan ke: ${href}`);
            // Di lingkungan Inertia, ini akan memicu request ke Laravel
        }
    }} {...props}>{children}</a>
);

const route = (name) => {
    const routes = {
        'home': '/',
        'favorites': '/favorites',
        'login': '/login',
        'logout': '#logout', // Simulasikan logout
        'dashboard': '/dashboard', // Simulasikan dashboard
    };
    return routes[name] || '#';
};

const UserIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const LogOutIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const Mail = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const Phone = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72 17 17 0 0 0 .81 4.97 2 2 0 0 1-.72 2.05L6.47 11c4 4 7 6.93 11 11l-2.73-2.73a2 2 0 0 1 2.05-.72A17 17 0 0 0 19.28 14A2 2 0 0 1 22 16.92z"/></svg>;
const Button = ({ children, className = '', ...props }) => (
    <button className={`px-4 py-2 font-semibold rounded-lg transition-all duration-300 ${className}`} {...props}>
        {children}
    </button>
);
// MapPin Icon (Untuk digunakan di Footer)
const MapPin = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;


// --- Komponen Dropdown Profil ---
const ProfileDropdown = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="relative">
            {/* Tombol/Icon Profil */}
            <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-yellow-50 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
                {/* Avatar Placeholder */}
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {(user.name || 'U')[0].toUpperCase()}
                </div>
                <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            {/* Menu Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-50 origin-top-right animate-fade-in-down">
                    
                    {/* Header Nama User */}
                    <div className="px-4 py-2 border-b text-sm text-gray-900 truncate">
                        {user.name || 'Pengguna'}
                    </div>

                    {/* Link ke Dashboard/Profil */}
                    <Link
                        href={route('dashboard')}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <UserIcon className="w-4 h-4 mr-2"/> Profil / Dashboard
                    </Link>

                    {/* Link Logout */}
                    <Link
                        href={route('logout')}
                        method="post" 
                        as="button"
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border-t mt-1"
                        onClick={() => {
                            console.log('Simulasi Logout');
                            setIsOpen(false);
                        }}
                    >
                        <LogOutIcon className="w-4 h-4 mr-2"/> Logout
                    </Link>
                </div>
            )}
        </div>
    );
};


// --- Komponen Navbar ---
const Navbar = ({ user }) => {
    const isLoggedIn = !!user;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-lg">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo (Link ke Beranda) */}
                    <Link href="/" className="flex items-center">
                        <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold shadow-md rounded-lg">
                            <div className="text-xl font-serif tracking-wide leading-tight">
                                Wedding<span className="font-black">Expo</span>
                            </div>
                        </div>
                    </Link>

                    {/* Navigasi Utama */}
                    <div className="hidden md:flex space-x-6">
                        {/* LINK BERANDA */}
                        <Link href={route('home')} className="text-gray-600 hover:text-yellow-600 font-medium transition-colors">
                            Beranda
                        </Link>
                        {/* LINK FAVORIT */}
                        <Link href={route('favorites')} className="text-gray-600 hover:text-yellow-600 font-medium transition-colors">
                            Favorit
                        </Link>
                        <Link href="/vendors" className="text-gray-600 hover:text-yellow-600 font-medium transition-colors">
                            Vendor
                        </Link>
                        <Link href="/inspiration" className="text-gray-600 hover:text-yellow-600 font-medium transition-colors">
                            Inspirasi
                        </Link>
                    </div>

                    {/* Profil/Auth */}
                    <div className="flex items-center space-x-4">
                        {isLoggedIn ? (
                            <ProfileDropdown user={user} />
                        ) : (
                            <Link href={route('login')}>
                                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-md">
                                    Login
                                </Button>
                            </Link>
                        )}
                        <div className="md:hidden">
                            <Button className="p-2 border border-gray-300 bg-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

// --- Komponen Footer (SUDAH DIPERBARUI SESUAI GAMBAR) ---
const Footer = () => (
    <footer className="bg-[#121421] text-gray-300 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                
                {/* 1. Kolom Logo & Deskripsi */}
                <div>
                    <Link href="/" className="mb-4 inline-block">
                        {/* Logo dengan background Emas/Kuning */}
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

                {/* 2. Kolom Layanan - FIXED JSX structure here */}
                <div>
                    {/* Judul kolom berwarna Emas/Kuning */}
                    <h4 className="font-semibold text-yellow-400 mb-4">Layanan</h4>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/#vendors" className="text-gray-400 hover:text-yellow-300 transition text-sm">Cari Vendor</Link>
                        </li>
                        <li>
                            <Link href="/#inspiration" className="text-gray-400 hover:text-yellow-300 transition text-sm">Inspirasi</Link>
                        </li>
                        {/* The previously misplaced </li> tag and unwrapped Link were here. Corrected now: */}
                        <li> 
                            <Link href="/#about" className="text-gray-400 hover:text-yellow-300 transition text-sm">Tentang Kami</Link>
                        </li>
                    </ul>
                </div>

                {/* 3. Kolom Vendor */}
                <div>
                    {/* Judul kolom berwarna Emas/Kuning */}
                    <h4 className="font-semibold text-yellow-400 mb-4">Vendor</h4>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/register/vendor" className="text-gray-400 hover:text-yellow-300 transition text-sm">Daftar Vendor</Link>
                        </li>
                        <li>
                            <Link href={route('login')} className="text-gray-400 hover:text-yellow-300 transition text-sm">Login Vendor</Link>
                        </li>
                    </ul>
                </div>

                {/* 4. Kolom Kontak */}
                <div>
                    {/* Judul kolom berwarna Emas/Kuning */}
                    <h4 className="font-semibold text-yellow-400 mb-4">Kontak</h4>
                    <ul className="space-y-3">
                        <li className="flex items-center">
                            {/* Icon berwarna Emas/Kuning */}
                            <Mail className="w-4 h-4 mr-2 text-yellow-500" />
                            <a href="mailto:info@weddingexpo.id" className="text-gray-400 hover:text-yellow-300 transition text-sm">
                                info@weddingexpo.id
                            </a>
                        </li>
                        <li className="flex items-center">
                            {/* Icon berwarna Emas/Kuning */}
                            <Phone className="w-4 h-4 mr-2 text-yellow-500" />
                            <span className="text-gray-400 text-sm">+62 21 1234 5678</span>
                        </li>
                        <li className="flex items-center">
                            {/* Icon berwarna Emas/Kuning */}
                            <MapPin className="w-4 h-4 mr-2 text-yellow-500" />
                            <span className="text-gray-400 text-sm">
                                Jakarta, Indonesia
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Copyright: Border di atasnya menggunakan warna yang lebih gelap (gray-700) agar kontras */}
            <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                <p className="text-sm text-gray-500">
                    © 2024 WeddingExpo. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
);


export default function CustomerLayout({ auth, children }) {
    // 1. Dapatkan data user untuk Navbar
    const user = auth?.user ?? null;

    return (
        <div className="min-h-screen bg-gray-50">
            
            {/* 2. Pastikan Navbar menerima prop 'user' untuk ProfileDropdown */}
            <Navbar user={user} />

            {/* 3. Beri padding pada main content agar tidak tertutup oleh fixed Navbar */}
            <main className="pt-16">
                {children}
            </main>

            {/* 4. Footer */}
            <Footer />
        </div>
    );
}