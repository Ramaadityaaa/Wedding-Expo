import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User as UserIcon } from "lucide-react";
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

    const handleNavClick = () => {
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
    };

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
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
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
                                        animation:
                                            "goldPulse 4s ease-in-out infinite",
                                        boxShadow:
                                            "0 0 18px rgba(255,185,60,0.8)",
                                    }}
                                >
                                    <div className="absolute inset-0 pointer-events-none shineSweep"></div>

                                    <div className="relative text-xl md:text-2xl font-serif tracking-wide text-white font-bold drop-shadow-[0_0_6px_white]">
                                        Wedding{" "}
                                        <span className="font-black">Expo</span>
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

                            <Link
                                className="flex items-center navLink"
                                href="/favorites"
                            >
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
                        <div className="hidden md:flex items-center space-x-4">
                            {/* BELUM LOGIN → TAMPILKAN LOGIN + REGISTER CUSTOMER */}
                            {!isLoggedIn && (
                                <>
                                    <Link href="/login">
                                        <Button className="btn-login rounded-xl px-5 py-2 text-white font-semibold">
                                            Login
                                        </Button>
                                    </Link>

                                    <Link href="/register">
                                        <Button className="btn-login rounded-xl px-5 py-2 text-white font-semibold">
                                            Register
                                        </Button>
                                    </Link>
                                </>
                            )}

                            {/* SUDAH LOGIN → HANYA ICON PROFIL (DROPDOWN berisi akun + dashboard + logout) */}
                            {isLoggedIn && (
                                <div className="relative">
                                    {/* ICON PROFIL DI HEADER */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsProfileOpen(!isProfileOpen)
                                        }
                                        className="
                                        w-9 h-9 rounded-full 
                                        bg-gradient-to-tr from-yellow-400 to-yellow-600
                                        flex items-center justify-center
                                        shadow-md border border-white/80
                                        hover:scale-105 transition-transform
                                    "
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
                                                    onClick={() =>
                                                        setIsProfileOpen(false)
                                                    }
                                                >
                                                    Ke Dashboard Admin
                                                </Link>
                                            )}

                                            {role === "VENDOR" && (
                                                <Link
                                                    href="/vendor/dashboard"
                                                    className="mt-3 block text-xs font-semibold text-yellow-700 hover:text-yellow-800"
                                                    onClick={() =>
                                                        setIsProfileOpen(false)
                                                    }
                                                >
                                                    Ke Dashboard Vendor
                                                </Link>
                                            )}

                                            {(!role || role === "VISITOR") && (
                                                <Link
                                                    href="/dashboard"
                                                    className="mt-3 block text-xs font-semibold text-yellow-700 hover:text-yellow-800"
                                                    onClick={() =>
                                                        setIsProfileOpen(false)
                                                    }
                                                >
                                                    Ke Dashboard
                                                </Link>
                                            )}

                                            <Link
                                                href="/profile"
                                                className="mt-2 block text-xs font-semibold text-yellow-700 hover:text-yellow-800"
                                                onClick={() =>
                                                    setIsProfileOpen(false)
                                                }
                                            >
                                                Lihat & Ubah Profil
                                            </Link>

                                            {/* PESANAN SAYA */}
                                            <Link
                                                href="/customer/orders"
                                                className="mt-2 block text-xs font-semibold text-yellow-700 hover:text-yellow-800"
                                                onClick={() =>
                                                    setIsProfileOpen(false)
                                                }
                                            >
                                                Pesanan Saya
                                            </Link>

                                            {/* LOGOUT DALAM DROPDOWN */}
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="mt-3 w-full text-left text-xs font-semibold text-red-500 hover:text-red-600"
                                                onClick={() =>
                                                    setIsProfileOpen(false)
                                                }
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
                            <div className="px-4 py-4 space-y-3">
                                <Link
                                    className="mobileLink"
                                    href="/"
                                    onClick={handleNavClick}
                                >
                                    Beranda
                                </Link>
                                <Link
                                    className="mobileLink"
                                    href="/#vendors"
                                    onClick={handleNavClick}
                                >
                                    Vendor
                                </Link>
                                <Link
                                    className="mobileLink"
                                    href="/favorites"
                                    onClick={handleNavClick}
                                >
                                    Favorit
                                </Link>
                                <Link
                                    className="mobileLink"
                                    href="/#inspiration"
                                    onClick={handleNavClick}
                                >
                                    Inspirasi
                                </Link>
                                <Link
                                    className="mobileLink"
                                    href="/#about"
                                    onClick={handleNavClick}
                                >
                                    Tentang
                                </Link>

                                {/* MOBILE – BELUM LOGIN */}
                                {!isLoggedIn && (
                                    <>
                                        <Link
                                            href="/register"
                                            onClick={handleNavClick}
                                        >
                                            <Button className="btn-login w-full mt-2">
                                                Register
                                            </Button>
                                        </Link>

                                        <Link
                                            href="/login"
                                            onClick={handleNavClick}
                                        >
                                            <Button className="btn-login w-full">
                                                Login
                                            </Button>
                                        </Link>
                                    </>
                                )}

                                {/* MOBILE – SUDAH LOGIN */}
                                {isLoggedIn && (
                                    <>
                                        <div className="pt-2 mt-2 border-t border-yellow-200">
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
                                            <Link
                                                href="/admin/dashboard"
                                                onClick={handleNavClick}
                                            >
                                                <Button className="btn-login w-full mt-2">
                                                    Ke Dashboard Admin
                                                </Button>
                                            </Link>
                                        )}
                                        {role === "VENDOR" && (
                                            <Link
                                                href="/vendor/dashboard"
                                                onClick={handleNavClick}
                                            >
                                                <Button className="btn-login w-full mt-2">
                                                    Ke Dashboard Vendor
                                                </Button>
                                            </Link>
                                        )}
                                        {(!role || role === "VISITOR") && (
                                            <Link
                                                href="/dashboard"
                                                onClick={handleNavClick}
                                            >
                                                <Button className="btn-login w-full mt-2">
                                                    Ke Dashboard
                                                </Button>
                                            </Link>
                                        )}

                                        <Link
                                            href="/profile"
                                            onClick={handleNavClick}
                                            className="block text-xs font-semibold text-yellow-700 hover:text-yellow-800 mt-2"
                                        >
                                            Lihat & Ubah Profil
                                        </Link>

                                        {/* PESANAN SAYA */}
                                        <Link
                                            href="/orders"
                                            onClick={handleNavClick}
                                            className="block text-xs font-semibold text-yellow-700 hover:text-yellow-800 mt-2"
                                        >
                                            Pesanan Saya
                                        </Link>

                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            onClick={handleNavClick}
                                        >
                                            <Button className="btn-login w-full mt-2">
                                                Logout
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* --- GLOBAL CHAT WIDGET (Di Luar Nav Agar Posisi Fixed Benar) --- */}
            {/* Hanya muncul jika user sudah login */}
            {isLoggedIn && auth?.user && (
                <CustomerGlobalChat user={auth.user} />
            )}
        </>
    );
}
