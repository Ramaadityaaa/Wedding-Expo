import React, { useState } from "react";
import { Link } from "@inertiajs/react";
// Mengubah import untuk mendapatkan array menu yang benar
import { vendorNavItems } from "@/Pages/Vendor/navItems";
import { LogOut, Menu, X, ChevronRight, User } from "lucide-react";

export default function VendorLayout({ user, vendor, header, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* --- SIDEBAR VENDOR (Fixed Height) --- */}
            <aside
                className={`
                    absolute md:relative z-50 h-full w-64 flex-shrink-0 flex flex-col 
                    bg-white text-slate-800 border-r border-gray-200 shadow-xl
                    transition-transform duration-300 ease-out
                    ${
                        isSidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full md:translate-x-0"
                    }
                `}
            >
                {/* 1. Logo & Status */}
                <div className="h-20 flex flex-col justify-center px-6 border-b border-gray-200 bg-amber-50">
                    <h1 className="text-xl font-black text-slate-800 truncate">
                        {vendor.name || "Vendor Profile"}
                    </h1>
                    <p
                        className={`text-xs font-bold mt-0.5 ${
                            vendor.isApproved === "APPROVED"
                                ? "text-green-600"
                                : "text-amber-600"
                        }`}
                    >
                        Status: {vendor.isApproved || "PENDING"}
                    </p>
                </div>

                {/* 2. NAVIGATION (Scrollable) */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {/* Menggunakan vendorNavItems dari file terpisah */}
                    {vendorNavItems.map((item) => {
                        // Hanya tampilkan menu yang memiliki rute terdefinisi
                        if (!item.route) return null;

                        const isActive = isRouteActive(item.route);

                        return (
                            <Link
                                key={item.name}
                                href={route(item.route)} // Wajib menggunakan route() Inertia
                                onClick={() => setIsSidebarOpen(false)}
                                className={`
                                    group relative flex items-center px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200
                                    ${
                                        isActive
                                            ? "bg-amber-500 text-white shadow-md shadow-amber-300/50"
                                            : "text-slate-600 hover:bg-gray-100 hover:text-amber-600"
                                    }
                                `}
                            >
                                <div
                                    className={`mr-3 transition-transform duration-200`}
                                >
                                    <item.icon size={20} />
                                </div>
                                <span className="flex-1">{item.label}</span>
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

                {/* 3. SIDEBAR FOOTER (Logout) */}
                <div className="p-4 border-t border-gray-200">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="flex items-center w-full justify-center py-2.5 px-4 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition-colors"
                    >
                        <LogOut size={16} className="mr-2" />
                        Log Out
                    </Link>
                </div>
            </aside>

            {/* --- MOBILE BACKDROP --- */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* --- MAIN CONTENT WRAPPER --- */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* 1. TOP NAVBAR */}
                <header className="h-20 flex-shrink-0 bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-gray-100 md:hidden transition-colors"
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

                    <div className="flex items-center gap-3">
                        <p className="text-sm text-gray-500 hidden sm:block">
                            {user.name}
                        </p>
                        <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold shadow-md">
                            <User size={20} />
                        </div>
                    </div>
                </header>

                {/* 2. SCROLLABLE CONTENT AREA */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <div className="max-w-7xl mx-auto pb-10">{children}</div>
                </main>
            </div>
        </div>
    );
}
