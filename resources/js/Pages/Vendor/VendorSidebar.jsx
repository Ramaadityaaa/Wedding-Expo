import * as React from "react";
import { Link, usePage } from "@inertiajs/react";
import { vendorNavItems } from "./navItems";
import { ShieldCheck, Clock, LogOut, Crown, Store } from "lucide-react";

export default function VendorSidebar() {
    const { auth } = usePage().props;
    const vendor = auth.user?.vendor;

    // ✅ samakan dengan real value di DB
    const isApproved = vendor?.status === "APPROVED";
    const isMember = vendor?.role?.toLowerCase() === "membership";

    const isCurrentRoute = (routeName) => {
        try {
            return route().current(routeName) || route().current(routeName + ".*");
        } catch (e) {
            return false;
        }
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-40 overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 text-3xl font-bold mb-3 shadow-sm overflow-hidden">
                    {vendor?.logo ? (
                        <img
                            src={`/storage/${vendor.logo}`}
                            alt="Logo"
                            className="w-full h-full object-cover rounded-2xl"
                        />
                    ) : (
                        <Store size={28} />
                    )}
                </div>

                <h2 className="font-bold text-gray-800 text-center truncate w-full">
                    {vendor?.name || "Nama Vendor"}
                </h2>

                {/* Badge Approval */}
                <div
                    className={`mt-2 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                        isApproved
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }`}
                >
                    {isApproved ? (
                        <>
                            <ShieldCheck size={12} /> TERVERIFIKASI
                        </>
                    ) : (
                        <>
                            <Clock size={12} /> MENUNGGU APPROVAL
                        </>
                    )}
                </div>

                {/* Badge Membership */}
                <div
                    className={`mt-2 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                        isMember
                            ? "bg-amber-100 text-amber-700 border-amber-300"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                >
                    <Crown size={12} />
                    {isMember ? "MEMBER PREMIUM" : "FREE VENDOR"}
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {vendorNavItems.map((item) => {
                    // ✅ Lock rule: kalau kamu mau membership-only, tentukan di sini.
                    // Aku bikin "reviews" tetap kebuka biar vendor bisa lihat ulasan walau free.
                    const isLocked =
                        !isMember &&
                        item.name !== "dashboard" &&
                        item.name !== "profile" &&
                        item.name !== "membership" &&
                        item.name !== "reviews";

                    const isCurrent = isCurrentRoute(item.route);

                    return (
                        <Link
                            key={item.name}
                            href={isLocked ? "#" : route(item.route)}
                            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                                isLocked
                                    ? "text-gray-300 cursor-not-allowed bg-gray-50"
                                    : isCurrent
                                    ? "bg-amber-50 text-amber-700 shadow-sm ring-1 ring-amber-200"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                            onClick={(e) => {
                                if (isLocked) {
                                    e.preventDefault();
                                    alert(
                                        "Fitur ini khusus Membership. Silakan berlangganan di menu 'Langganan'."
                                    );
                                }
                            }}
                        >
                            <item.icon
                                className={`w-5 h-5 mr-3 ${
                                    isCurrent
                                        ? "text-amber-600"
                                        : isLocked
                                        ? "text-gray-300"
                                        : "text-gray-400"
                                }`}
                            />
                            <span>{item.label}</span>

                            {isLocked && (
                                <span className="ml-auto text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">
                                    LOCKED
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="flex items-center w-full px-4 py-3 text-red-500 rounded-xl hover:bg-red-50 transition font-medium"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Keluar
                </Link>
            </div>
        </aside>
    );
}
