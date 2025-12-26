import * as React from "react";
import { Link, usePage } from "@inertiajs/react";
import { vendorNavItems } from "./navItems";
import { ChevronRight, LogOut, Crown, ShieldCheck, Clock, User } from "lucide-react";

function ElegantVendorAvatar({ logo, initials }) {
    return (
        <div className="relative h-14 w-14 flex-shrink-0">
            {/* soft glow */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500 opacity-25 blur-md" />

            {/* ring */}
            <div className="relative h-14 w-14 rounded-2xl p-[2px] bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500 shadow-[0_14px_34px_rgba(249,115,22,0.18)]">
                <div className="h-full w-full rounded-2xl bg-slate-950/70 border border-white/5 backdrop-blur flex items-center justify-center overflow-hidden">
                    {logo ? (
                        <img
                            src={`/storage/${logo}`}
                            alt="Vendor Logo"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                            <span className="relative text-[13px] font-extrabold tracking-[0.18em] text-slate-100">
                                {initials}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VendorSidebar() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const vendor = user?.vendor;

    const isApproved = vendor?.status === "APPROVED";
    const isMember = vendor?.role?.toLowerCase() === "membership";

    const vendorTitle = vendor?.name || user?.name || "Vendor";
    const initials =
        vendorTitle
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((w) => w?.[0]?.toUpperCase())
            .join("") || "V";

    const isCurrentRoute = (routeName) => {
        try {
            return route().current(routeName) || route().current(routeName + ".*");
        } catch (e) {
            return false;
        }
    };

    return (
        <aside className="w-72 bg-[#0f172a] text-white border-r border-slate-800 h-screen flex flex-col fixed left-0 top-0 z-40 overflow-y-auto">
            {/* HEADER VENDOR */}
            <div className="px-6 py-5 border-b border-slate-800/60 bg-gradient-to-b from-[#0b1120] to-[#0f172a]">
                <div className="flex items-center gap-4">
                    <ElegantVendorAvatar logo={vendor?.logo} initials={initials} />

                    <div className="min-w-0">
                        <p className="text-base font-extrabold text-white truncate">
                            {vendorTitle}
                        </p>

                        <p className="text-xs text-slate-400 truncate">
                            {user?.email || "vendor@email.com"}
                        </p>

                        <div className="flex gap-2 mt-2 flex-wrap">
                            <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border
                                    ${
                                        isApproved
                                            ? "bg-green-500/10 text-green-300 border-green-500/20"
                                            : "bg-yellow-500/10 text-yellow-300 border-yellow-500/20"
                                    }
                                `}
                            >
                                {isApproved ? <ShieldCheck size={11} /> : <Clock size={11} />}
                                {isApproved ? "TERVERIFIKASI" : "MENUNGGU APPROVAL"}
                            </span>

                            <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border
                                    ${
                                        isMember
                                            ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                                            : "bg-slate-500/10 text-slate-300 border-slate-500/20"
                                    }
                                `}
                            >
                                <Crown size={11} />
                                {isMember ? "MEMBER PREMIUM" : "FREE VENDOR"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* NAV */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                    Main Menu
                </p>

                {vendorNavItems.map((item) => {
                    if (!item.route || !item.icon) return null;

                    const isActive = isCurrentRoute(item.route);
                    const Icon = item.icon;

                    const isLocked =
                        !isMember &&
                        item.name !== "dashboard" &&
                        item.name !== "profile" &&
                        item.name !== "membership" &&
                        item.name !== "reviews";

                    return (
                        <Link
                            key={item.name}
                            href={isLocked ? "#" : route(item.route)}
                            onClick={(e) => {
                                if (!isLocked) return;
                                e.preventDefault();
                                alert("Fitur ini khusus Membership. Silakan berlangganan di menu 'Langganan'.");
                            }}
                            className={`
                                group relative flex items-center px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300
                                ${
                                    isLocked
                                        ? "text-slate-600 bg-slate-900/30 cursor-not-allowed opacity-80"
                                        : isActive
                                        ? "text-white shadow-lg shadow-orange-500/20"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                }
                            `}
                        >
                            {isActive && !isLocked && (
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 opacity-100" />
                            )}

                            <div
                                className={`relative z-10 mr-3 transition-transform duration-300 ${
                                    isLocked
                                        ? "text-slate-600"
                                        : isActive
                                        ? "scale-110 text-white"
                                        : "group-hover:scale-110 group-hover:text-orange-400"
                                }`}
                            >
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>

                            <span className="relative z-10 flex-1">{item.label}</span>

                            {isLocked && (
                                <span className="relative z-10 ml-auto text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                                    LOCKED
                                </span>
                            )}

                            {isActive && !isLocked && (
                                <ChevronRight
                                    size={16}
                                    className="relative z-10 text-white/80 animate-pulse"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* FOOTER */}
            <div className="p-4 border-t border-slate-800 bg-[#0b1120]">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="relative h-10 w-10">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-400 to-orange-600 opacity-25 blur-md" />
                        <div className="relative h-10 w-10 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 to-orange-600">
                            <div className="h-full w-full rounded-full bg-slate-950/70 border border-white/5 backdrop-blur flex items-center justify-center overflow-hidden">
                                {user?.profile_photo_url ? (
                                    <img
                                        src={user.profile_photo_url}
                                        alt={user?.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={18} className="text-slate-200" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate w-40">
                            {user?.name || "Vendor"}
                        </p>
                        <p className="text-xs text-slate-400 truncate w-40">
                            {vendor?.name ? "Vendor" : "Account"}
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
    );
}
