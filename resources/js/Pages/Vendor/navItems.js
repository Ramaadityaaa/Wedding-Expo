import {
    LayoutDashboard,
    User,
    CreditCard,
    Package,
    Image as ImageIcon,
    MessageSquare,
    Banknote,
    ShoppingBag,
    Star,
} from "lucide-react";

export const vendorNavItems = [
    // --- UTAMA ---
    {
        name: "dashboard",
        label: "Dashboard",
        route: "vendor.dashboard",
        icon: LayoutDashboard,
    },

    // --- OPERASIONAL (Pesanan & Chat) ---
    {
        name: "orders",
        label: "Pesanan Masuk",
        route: "vendor.orders.index",
        icon: ShoppingBag,
    },
    {
        name: "chat",
        label: "Pesan & Chat",
        route: "vendor.chat.index",
        icon: MessageSquare,
    },

    // --- MANAJEMEN PRODUK (Paket, Portofolio, Review) ---
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
        name: "reviews",
        label: "Ulasan Klien",
        route: "vendor.reviews.index",
        icon: Star,
    },

    // --- PENGATURAN & KEUANGAN ---
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
];
