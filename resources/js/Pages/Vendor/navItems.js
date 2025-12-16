import {
    LayoutDashboard,
    User,
    CreditCard,
    Package,
    Image as ImageIcon,
    MessageSquare,
    Banknote,
    ShoppingBag, // <--- Import Icon baru untuk Pesanan
} from "lucide-react";

export const vendorNavItems = [
    {
        name: "dashboard",
        label: "Dashboard",
        route: "vendor.dashboard",
        icon: LayoutDashboard,
    },
    // --- MENU BARU: MANAJEMEN PESANAN ---
    {
        name: "orders",
        label: "Pesanan Masuk",
        route: "vendor.orders.index", // Pastikan route ini sesuai web.php
        icon: ShoppingBag,
    },
    // ------------------------------------
    {
        name: "packages",
        label: "Paket Jasa",
        route: "vendor.packages.index",
        icon: Package,
    },
    {
        name: "portfolio",
        label: "Galeri Portofolio",
        route: "vendor.portfolio.index",
        icon: ImageIcon,
    },
    {
        name: "profile",
        label: "Profil Bisnis",
        route: "vendor.profile.edit",
        icon: User,
    },
    {
        name: "bank-settings",
        label: "Pengaturan Rekening",
        route: "vendor.bank.edit",
        icon: Banknote,
    },
    {
        name: "membership",
        label: "Langganan",
        route: "vendor.membership.index",
        icon: CreditCard,
    },
    {
        name: "chat",
        label: "Pesan & Chat",
        route: "vendor.chat.index",
        icon: MessageSquare,
    },
];
