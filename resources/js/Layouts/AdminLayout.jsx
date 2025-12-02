import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import {
    LayoutDashboard,
    DollarSign,
    Users,
    MessageSquare,
    FileText,
    FileBadge,
    CreditCard,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Search,
    Bell,
    Settings,
} from "lucide-react";

export default function AdminLayout({ user, header, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // === DEFINISI MENU SIDEBAR ===
    const navItems = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            label: "Dashboard",
            route: "admin.dashboard",
        },
        {
            name: "KonfirmasiPembayaran",
            icon: DollarSign,
            label: "Konfirmasi Bayar",
            route: "admin.paymentproof.index",
        },
        {
            name: "Vendor",
            icon: Users,
            label: "Vendor",
            route: "admin.vendors.index",
        },
        {
            name: "Users",
            icon: Users,
            label: "Pengguna",
            route: "admin.user-stats.index",
        },
        {
            name: "Reviews",
            icon: MessageSquare,
            label: "Ulasan",
            route: "admin.reviews.index",
        },
        {
            name: "StaticContent",
            icon: FileText,
            label: "Konten Statis",
            route: "admin.static-content.index",
        },
        {
            name: "EditRole",
            icon: FileBadge,
            label: "Edit Role",
            route: "admin.roles.index",
        },
        {
            name: "PaymentSettings",
            icon: CreditCard,
            label: "Pengaturan Bayar",
            route: "admin.payment-settings.index",
        },
    ];

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
        // Wrapper utama menggunakan h-screen overflow-hidden agar layout terkunci di viewport
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden selection:bg-orange-500 selection:text-white">
            {/* --- SIDEBAR (Futuristic Dark Theme) --- */}
            <aside
                className={`
                    absolute md:relative z-50 h-full w-72 flex-shrink-0 flex flex-col 
                    bg-[#0f172a] text-white border-r border-slate-800 shadow-2xl
                    transition-transform duration-300 ease-out
                    ${
                        isSidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full md:translate-x-0"
                    }
                `}
            >
                {/* 1. LOGO AREA (Modern Gradient) */}
                <div className="h-20 flex items-center px-8 border-b border-slate-800/50 bg-[#0f172a]/50 backdrop-blur-xl">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 drop-shadow-sm">
                                WEDDING
                            </span>
                            <span className="text-slate-100">EXPO</span>
                        </h1>
                        <p className="text-[10px] text-slate-400 font-medium tracking-[0.2em] mt-0.5">
                            ADMINISTRATION PANEL
                        </p>
                    </div>
                </div>

                {/* 2. NAVIGATION (Scrollable) */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                    <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                        Main Menu
                    </p>

                    {navItems.map((item) => {
                        const isActive = isRouteActive(item.route);

                        return (
                            <Link
                                key={item.name}
                                href={item.route ? route(item.route) : "#"}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`
                                    group relative flex items-center px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300
                                    ${
                                        isActive
                                            ? "text-white shadow-lg shadow-orange-500/20"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    }
                                `}
                            >
                                {/* Active Background with "Glassy & Shiny" Effect */}
                                {isActive && (
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 opacity-100 transition-opacity"></div>
                                )}

                                {/* Icon */}
                                <div
                                    className={`relative z-10 mr-3 transition-transform duration-300 ${
                                        isActive
                                            ? "scale-110 text-white"
                                            : "group-hover:scale-110 group-hover:text-orange-400"
                                    }`}
                                >
                                    <item.icon
                                        size={20}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                </div>

                                {/* Label */}
                                <span className="relative z-10 flex-1">
                                    {item.label}
                                </span>

                                {/* Active Indicator (Chevron) */}
                                {isActive && (
                                    <ChevronRight
                                        size={16}
                                        className="relative z-10 text-white/80 animate-pulse"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* 3. SIDEBAR FOOTER (User & Logout) */}
                <div className="p-4 border-t border-slate-800 bg-[#0b1120]">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-600 p-[2px]">
                            <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">
                                {user?.name}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                                Administrator
                            </p>
                        </div>
                    </div>
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="flex items-center justify-center w-full py-2.5 px-4 rounded-lg bg-slate-800 text-red-400 text-sm font-semibold hover:bg-red-500/10 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20"
                    >
                        <LogOut size={16} className="mr-2" />
                        Keluar
                    </Link>
                </div>
            </aside>

            {/* --- MOBILE BACKDROP --- */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* --- MAIN CONTENT WRAPPER --- */}
            <div className="flex-1 flex flex-col min-w-0 bg-gray-50 h-screen overflow-hidden">
                {/* 1. TOP NAVBAR (Sticky Glass) */}
                <header className="h-20 flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden transition-colors"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? (
                                <X size={24} />
                            ) : (
                                <Menu size={24} />
                            )}
                        </button>

                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                            {header || "Dashboard"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Search Bar (Visual Only) */}
                        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-orange-300 focus-within:bg-white transition-all w-64">
                            <Search size={18} className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Cari sesuatu..."
                                className="bg-transparent border-none outline-none text-sm text-gray-600 w-full placeholder-gray-400"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="p-2.5 rounded-full text-slate-500 hover:bg-orange-50 hover:text-orange-600 transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* 2. SCROLLABLE CONTENT AREA */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto pb-10">{children}</div>
                </main>
            </div>
        </div>
    );
}
