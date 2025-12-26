import {
    LayoutDashboard,
    User,
    CreditCard,
    Package,
    Image as ImageIcon,
    MessageSquare,
    Banknote,
    ShoppingBag,
    Star, // ✅ icon Ulasan
} from "lucide-react";

export const vendorNavItems = [
    {
        name: "dashboard",
        label: "Dashboard",
        route: "vendor.dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "orders",
        label: "Pesanan Masuk",
        route: "vendor.orders.index",
        icon: ShoppingBag,
    },
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

    // ✅ MENU BARU: ULASAN
    {
        name: "reviews",
        label: "Ulasan",
        route: "vendor.reviews.index",
        icon: Star,
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
