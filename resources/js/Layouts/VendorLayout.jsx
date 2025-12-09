import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { vendorNavItems } from "@/Pages/Vendor/navItems";
import {
    LogOut,
    Menu,
    X,
    ChevronRight,
    User,
    Store,
    ShieldCheck,
    Clock,
    Crown,
} from "lucide-react";

export default function VendorLayout({ header, children }) {
    // Ambil data auth dari props
    const { auth } = usePage().props;
    const user = auth.user;
    const vendor = auth.user?.vendor;

    console.log("=== DEBUG VENDOR DATA ===");
    console.log("Full Vendor Object:", vendor);
    console.log("Status di Database:", vendor?.status);
    console.log("Role di Database:", vendor?.role);
    console.log(
        "Apakah Member?:",
        vendor?.role?.toLowerCase() === "membership"
    );
    console.log("=========================");

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Helper Active Route
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

    // --- LOGIKA UTAMA (ROLE BASED ACCESS) ---

    // 1. Cek apakah role-nya sudah 'Membership'
    // Pastikan pengecekan case-insensitive (antisipasi 'membership' atau 'Membership')
    const isMember = vendor?.role?.toLowerCase() === "membership";

    // 2. Cek status approval (sekadar untuk badge visual)
    const isApproved = vendor?.status === "APPROVED";

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* --- SIDEBAR --- */}
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
                {/* Header Sidebar */}
                <div className="h-32 flex flex-col justify-center px-6 border-b border-gray-200 bg-gradient-to-b from-amber-50 to-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 font-bold shadow-sm flex-shrink-0 overflow-hidden">
                            {vendor?.logo ? (
                                <img
                                    src={`/storage/${vendor.logo}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Store size={20} />
                            )}
                        </div>
                        <h1 className="text-sm font-black text-slate-800 leading-tight line-clamp-2">
                            {vendor?.name || user?.name || "Vendor Area"}
                        </h1>
                    </div>

                    {/* STATUS BADGE */}
                    <div className="flex flex-col gap-1">
                        {/* Badge Approval */}
                        <div
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit flex items-center gap-1 border ${
                                isApproved
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-gray-100 text-gray-500 border-gray-200"
                            }`}
                        >
                            {isApproved ? (
                                <ShieldCheck size={10} />
                            ) : (
                                <Clock size={10} />
                            )}
                            {isApproved ? "TERVERIFIKASI" : "MENUNGGU APPROVAL"}
                        </div>

                        {/* Badge Membership (Premium) */}
                        <div
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit flex items-center gap-1 border ${
                                isMember
                                    ? "bg-amber-100 text-amber-700 border-amber-300"
                                    : "bg-slate-100 text-slate-500 border-slate-200"
                            }`}
                        >
                            <Crown size={10} />
                            {isMember ? "MEMBER PREMIUM" : "FREE VENDOR"}
                        </div>
                    </div>
                </div>

                {/* Menu Navigasi */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {vendorNavItems.map((item) => {
                        if (!item.route) return null;

                        // LOGIKA PENGUNCIAN MENU
                        // Menu terkunci jika: Bukan Member DAN menu tersebut bukan Dashboard/Profile/Membership
                        const isLocked =
                            !isMember &&
                            item.name !== "dashboard" &&
                            item.name !== "profile" &&
                            item.name !== "membership";

                        const active = isRouteActive(item.route);

                        return (
                            <Link
                                key={item.name}
                                href={isLocked ? "#" : route(item.route)}
                                onClick={(e) => {
                                    if (isLocked) {
                                        e.preventDefault();
                                        alert(
                                            "Fitur ini khusus Membership. Silakan berlangganan di menu 'Langganan'."
                                        );
                                    } else {
                                        setIsSidebarOpen(false);
                                    }
                                }}
                                className={`
                                    group relative flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                                    ${
                                        isLocked
                                            ? "text-gray-400 bg-gray-50 cursor-not-allowed opacity-70 grayscale"
                                            : active
                                            ? "bg-amber-500 text-white shadow-md shadow-amber-200 translate-x-1"
                                            : "text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                                    }
                                `}
                            >
                                <div
                                    className={`mr-3 transition-transform duration-200 ${
                                        active
                                            ? "scale-110"
                                            : "group-hover:scale-110"
                                    }`}
                                >
                                    <item.icon size={20} />
                                </div>
                                <span className="flex-1">{item.label}</span>

                                {active && !isLocked && (
                                    <ChevronRight
                                        size={16}
                                        className="text-white/80"
                                    />
                                )}

                                {isLocked && (
                                    <span className="ml-auto text-[9px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded border border-slate-300">
                                        LOCKED
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Sidebar */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="flex items-center w-full justify-center py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-red-600 text-sm font-bold hover:bg-red-50 hover:border-red-200 transition-all shadow-sm group"
                    >
                        <LogOut
                            size={16}
                            className="mr-2 group-hover:-translate-x-1 transition-transform"
                        />
                        Keluar
                    </Link>
                </div>
            </aside>

            {/* --- MOBILE OVERLAY --- */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <header className="h-20 flex-shrink-0 bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center justify-between px-6 lg:px-8">
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
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                                {header || "Dashboard"}
                            </h2>
                            <p className="text-xs text-gray-400 hidden sm:block">
                                Kelola bisnis pernikahan Anda dengan mudah
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-700">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {user.email}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-amber-100 overflow-hidden">
                            {user.profile_photo_url ? (
                                <img
                                    src={user.profile_photo_url}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User size={20} />
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50/50">
                    <div className="max-w-7xl mx-auto pb-10">{children}</div>
                </main>
            </div>
        </div>
    );
}
