import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User as UserIcon, LogIn, UserPlus } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import CustomerGlobalChat from "@/Components/CustomerGlobalChat"; // Import Component Chat

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const { auth } = usePage().props || {};
    const user = auth?.user || null;
    const role = user?.role || null;
    const isLoggedIn = !!user;

    const favorites = [];

    const profileRef = useRef(null);

    const handleNavClick = () => {
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
    };

    // close dropdown ketika klik di luar
    useEffect(() => {
        const onClickOutside = (e) => {
            if (!profileRef.current) return;
            if (!profileRef.current.contains(e.target)) setIsProfileOpen(false);
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    // close dropdown ketika ESC
    useEffect(() => {
        const onEsc = (e) => {
            if (e.key === "Escape") setIsProfileOpen(false);
        };
        document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, []);

    return (
        <>
            <nav
                className="
                    fixed top-0 left-0 right-0 w-full z-50
                    backdrop-blur-2xl
                    bg-white/35
                    shadow-[0_4px_25px_rgba(255,200,80,0.35)]
                    border-b border-yellow-400/40
                    gold-glow
                "
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* LOGO + HAMBURGER */}
                        <div className="flex items-center space-x-2">
                            <button
                                className="md:hidden p-2 rounded-lg bg-white/70 shadow hover:bg-yellow-100 transition-all"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Buka menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>

                            <Link href="/" className="flex items-center group">
                                <div
                                    className="
                                        px-4 py-2 rounded-xl shadow-lg relative overflow-hidden
                                        transition-all duration-300
                                        group-hover:shadow-[0_0_35px_rgba(255,210,100,1)]
                                    "
                                    style={{
                                        background:
                                            "linear-gradient(135deg,#f4c95d,#ffb300,#ff8f00,#f4c95d,#ffb300)",
                                        backgroundSize: "200% 200%",
                                        animation: "goldPulse 4s ease-in-out infinite",
                                        boxShadow: "0 0 18px rgba(255,185,60,0.8)",
                                    }}
                                >
                                    <div className="absolute inset-0 pointer-events-none shineSweep"></div>

                                    <div className="relative text-xl md:text-2xl font-serif tracking-wide text-white font-bold drop-shadow-[0_0_6px_white]">
                                        Wedding <span className="font-black">Expo</span>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* MENU DESKTOP */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link className="navLink" href="/">
                                Beranda
                            </Link>
                            <Link className="navLink" href="/#vendors">
                                Vendor
                            </Link>

                            <Link className="flex items-center navLink" href="/favorites">
                                Favorit
                                {favorites.length > 0 && (
                                    <span className="ml-1 bg-gold-pill text-white text-xs px-2 py-0.5 rounded-full shadow">
                                        {favorites.length}
                                    </span>
                                )}
                            </Link>

                            <Link className="navLink" href="/#inspiration">
                                Inspirasi
                            </Link>
                            <Link className="navLink" href="/#about">
                                Tentang
                            </Link>
                        </div>

                        {/* AREA KANAN – DESKTOP */}
                        <div className="hidden md:flex items-center space-x-3">
                            {/* BELUM LOGIN → TAMPILKAN LOGIN + REGISTER CUSTOMER */}
                            {!isLoggedIn && (
                                <div className="flex items-center gap-2">
                                    <Link href="/login">
                                        <Button
                                            className="
                                                rounded-xl px-5 py-2 h-10
                                                bg-white/80 text-gray-900
                                                border border-yellow-300/70
                                                shadow-sm
                                                hover:bg-white hover:border-yellow-400
                                                hover:shadow-[0_8px_20px_rgba(255,190,60,0.22)]
                                                transition-all
                                            "
                                        >
                                            <LogIn className="w-4 h-4 mr-2 text-amber-700" />
                                            Login
                                        </Button>
                                    </Link>

                                    <Link href="/register">
                                        <Button
                                            className="
                                                rounded-xl px-5 py-2 h-10
                                                text-white font-semibold
                                                border border-yellow-300/30
                                                shadow-[0_10px_25px_rgba(255,170,40,0.35)]
                                                hover:shadow-[0_12px_28px_rgba(255,170,40,0.45)]
                                                transition-all
                                                relative overflow-hidden
                                            "
                                            style={{
                                                background:
                                                    "linear-gradient(135deg,#f59e0b,#f97316,#f59e0b)",
                                                backgroundSize: "200% 200%",
                                                animation: "goldPulse 4s ease-in-out infinite",
                                            }}
                                        >
                                            <span className="absolute inset-0 pointer-events-none shineSweep opacity-80"></span>
                                            <span className="relative inline-flex items-center">
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Register
                                            </span>
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            {/* SUDAH LOGIN → HANYA ICON PROFIL */}
                            {isLoggedIn && (
                                <div className="relative" ref={profileRef}>
                                    {/* ICON PROFIL DI HEADER */}
                                    <button
                                        type="button"
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="
                                            w-9 h-9 rounded-full
                                            bg-gradient-to-tr from-yellow-400 to-yellow-600
                                            flex items-center justify-center
                                            shadow-md border border-white/80
                                            hover:scale-105 transition-transform
                                        "
                                        aria-label="Buka menu profil"
                                        aria-expanded={isProfileOpen}
                                    >
                                        <UserIcon className="w-5 h-5 text-white" />
                                    </button>

                                    {/* DROPDOWN INFO AKUN */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white/95 border border-yellow-100 rounded-xl shadow-xl p-3 text-sm z-50">
                                            <p className="font-semibold text-gray-900">
                                                {user.name || "Pengguna"}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user.email}
                                            </p>
                                            <p className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-yellow-100 text-yellow-700">
                                                Role: {role || "VISITOR"}
                                            </p>

                                            {/* Link ke dashboard sesuai role */}
                                            {role === "ADMIN" && (
                                                <Link
                                                    href="/admin/dashboard"
                                                    className="mt-3 block text-xs font-semibold text-yellow-700 hover:text-yellow-800"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    Ke Dashboard Admin
                                                </Link>
                                            )}

                                            {role === "VENDOR" && (
                                                <Link
                                                    href="/vendor/dashboard"
                                                    className="mt-3 block text-xs font-semibold text-yellow-700 hover:text-yellow-800"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    Ke Dashboard Vendor
                                                </Link>
                                            )}

                                            {(!role || role === "VISITOR") && (
                                                <Link
                                                    href="/dashboard"
                                                    className="mt-3 block text-xs font-semibold text-yellow-700 hover:text-yellow-800"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    Ke Dashboard
                                                </Link>
                                            )}

                                            <Link
                                                href="/profile"
                                                className="mt-2 block text-xs font-semibold text-yellow-700 hover:text-yellow-800"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Lihat & Ubah Profil
                                            </Link>

                                            {/* PESANAN SAYA */}
                                            <Link
                                                href="/customer/orders"
                                                className="mt-2 block text-xs font-semibold text-yellow-700 hover:text-yellow-800"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Pesanan Saya
                                            </Link>

                                            {/* LOGOUT */}
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="mt-3 w-full text-left text-xs font-semibold text-red-500 hover:text-red-600"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Logout
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MOBILE MENU */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden bg-white/90 backdrop-blur-xl border-t border-yellow-300 shadow-xl animate-fadeIn">
                            <div className="px-4 py-4">
                                {/* NAV LIST */}
                                <div className="flex flex-col gap-1">
                                    <Link
                                        href="/"
                                        onClick={handleNavClick}
                                        className="w-full block px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 hover:bg-yellow-50 hover:text-yellow-800 transition"
                                    >
                                        Beranda
                                    </Link>

                                    <Link
                                        href="/#vendors"
                                        onClick={handleNavClick}
                                        className="w-full block px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 hover:bg-yellow-50 hover:text-yellow-800 transition"
                                    >
                                        Vendor
                                    </Link>

                                    <Link
                                        href="/favorites"
                                        onClick={handleNavClick}
                                        className="w-full block px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 hover:bg-yellow-50 hover:text-yellow-800 transition"
                                    >
                                        Favorit
                                    </Link>

                                    <Link
                                        href="/#inspiration"
                                        onClick={handleNavClick}
                                        className="w-full block px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 hover:bg-yellow-50 hover:text-yellow-800 transition"
                                    >
                                        Inspirasi
                                    </Link>

                                    <Link
                                        href="/#about"
                                        onClick={handleNavClick}
                                        className="w-full block px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 hover:bg-yellow-50 hover:text-yellow-800 transition"
                                    >
                                        Tentang
                                    </Link>
                                </div>

                                {/* MOBILE – BELUM LOGIN */}
                                {!isLoggedIn && (
                                    <div className="pt-4 mt-4 border-t border-yellow-200 space-y-2">
                                        <Link href="/login" onClick={handleNavClick}>
                                            <Button
                                                className="
                                w-full rounded-xl h-11
                                bg-white text-gray-900
                                border border-yellow-300/70
                                shadow-sm
                                hover:bg-white hover:border-yellow-400
                                transition-all
                            "
                                            >
                                                Login
                                            </Button>
                                        </Link>

                                        <Link href="/register" onClick={handleNavClick}>
                                            <Button
                                                className="
                                w-full rounded-xl h-11
                                text-white font-semibold
                                shadow-[0_10px_25px_rgba(255,170,40,0.35)]
                                transition-all
                                relative overflow-hidden
                            "
                                                style={{
                                                    background:
                                                        "linear-gradient(135deg,#f59e0b,#f97316,#f59e0b)",
                                                    backgroundSize: "200% 200%",
                                                    animation: "goldPulse 4s ease-in-out infinite",
                                                }}
                                            >
                                                Register
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                                {/* MOBILE – SUDAH LOGIN */}
                                {isLoggedIn && (
                                    <div className="pt-4 mt-4 border-t border-yellow-200 space-y-2">
                                        <div className="px-1">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {user.name || "Pengguna"}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user.email}
                                            </p>
                                            <p className="mt-1 inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-yellow-100 text-yellow-700">
                                                Role: {role || "VISITOR"}
                                            </p>
                                        </div>

                                        {role === "ADMIN" && (
                                            <Link href="/admin/dashboard" onClick={handleNavClick}>
                                                <Button className="btn-login w-full mt-1">
                                                    Ke Dashboard Admin
                                                </Button>
                                            </Link>
                                        )}

                                        {role === "VENDOR" && (
                                            <Link href="/vendor/dashboard" onClick={handleNavClick}>
                                                <Button className="btn-login w-full mt-1">
                                                    Ke Dashboard Vendor
                                                </Button>
                                            </Link>
                                        )}

                                        {(!role || role === "VISITOR") && (
                                            <Link href="/dashboard" onClick={handleNavClick}>
                                                <Button className="btn-login w-full mt-1">
                                                    Ke Dashboard
                                                </Button>
                                            </Link>
                                        )}

                                        <Link
                                            href="/profile"
                                            onClick={handleNavClick}
                                            className="w-full block px-4 py-3 rounded-xl text-sm font-semibold text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800 transition"
                                        >
                                            Lihat & Ubah Profil
                                        </Link>

                                        <Link
                                            href="/customer/orders"
                                            onClick={handleNavClick}
                                            className="w-full block px-4 py-3 rounded-xl text-sm font-semibold text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800 transition"
                                        >
                                            Pesanan Saya
                                        </Link>

                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            onClick={handleNavClick}
                                            className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition"
                                        >
                                            Logout
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* GLOBAL CHAT WIDGET */}
            {isLoggedIn && auth?.user && <CustomerGlobalChat user={auth.user} />}
        </>
    );
}
