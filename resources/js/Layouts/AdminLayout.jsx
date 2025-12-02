import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { navItems } from "@/Pages/Admin/navItems";
import { LogOut, Menu, X, ChevronRight } from "lucide-react";

export default function AdminLayout({ user, header, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Fungsi Helper untuk cek apakah rute aktif
    const isRouteActive = (routeName) => {
        if (!routeName) return false;
        try {
            return (
                route().current(routeName) || route().current(routeName + ".*")
            );
        } catch (e) {
            return false;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* --- SIDEBAR (Desktop & Mobile) --- */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white text-gray-800 shadow-2xl z-40 border-r border-gray-100
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:relative md:translate-x-0 md:flex-shrink-0 flex flex-col`}
            >
                {/* LOGO AREA */}
                <div className="p-8 mb-2">
                    <h1
                        className="text-2xl font-extrabold bg-clip-text text-transparent tracking-tight"
                        style={{
                            backgroundImage:
                                "linear-gradient(90deg, #facc15, #fb923c)",
                        }} // Efek Emas ke Orange
                    >
                        Admin Dashboard
                    </h1>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">
                        Wedding Expo Panel
                    </p>
                </div>

                {/* NAVIGASI */}
                <nav className="flex-1 px-4 overflow-y-auto space-y-2 pb-4">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">
                        Menu Utama
                    </p>

                    {navItems.map((item) => {
                        const isActive = isRouteActive(item.route);

                        return (
                            <Link
                                key={item.name}
                                href={item.route ? route(item.route) : "#"}
                                className={`group flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 ease-in-out font-medium relative overflow-hidden ${
                                    isActive
                                        ? "text-white shadow-lg shadow-orange-200" // Shadow halus saat aktif
                                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                                }`}
                                style={
                                    isActive
                                        ? {
                                              background:
                                                  "linear-gradient(90deg, #f59e0b, #ea580c)", // Gradient Orange Mengkilat
                                          }
                                        : {}
                                }
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                {/* Indikator aktif di kiri (opsional, untuk estetika) */}
                                {isActive && (
                                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-white/20"></span>
                                )}

                                <div
                                    className={`mr-3 transition-transform duration-200 ${
                                        isActive
                                            ? "scale-110"
                                            : "group-hover:scale-110"
                                    }`}
                                >
                                    {item.icon && <item.icon size={20} />}
                                </div>

                                <span className="flex-1">{item.label}</span>

                                {/* Panah kecil jika aktif */}
                                {isActive && (
                                    <ChevronRight
                                        size={16}
                                        className="text-white/80"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* FOOTER SIDEBAR (LOGOUT) */}
                <div className="p-4 border-t border-gray-100">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="flex items-center w-full px-4 py-3.5 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-100 transition-all duration-200"
                    >
                        <LogOut size={20} className="mr-3" />
                        Keluar
                    </Link>
                </div>
            </aside>

            {/* --- BACKDROP MOBILE --- */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* --- KONTEN UTAMA --- */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* HEADER (Navbar Atas) */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100">
                    <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        {/* Tombol Hamburger (Mobile) */}
                        <button
                            className="text-gray-500 hover:text-orange-500 md:hidden p-2 rounded-lg transition-colors"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? (
                                <X size={24} />
                            ) : (
                                <Menu size={24} />
                            )}
                        </button>

                        {/* Judul Halaman */}
                        <h2 className="text-xl font-bold text-gray-800 leading-tight ml-2 md:ml-0">
                            {header || "Dashboard"}
                        </h2>

                        {/* Profil User */}
                        <div className="flex items-center space-x-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-800">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Administrator
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-md">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}
