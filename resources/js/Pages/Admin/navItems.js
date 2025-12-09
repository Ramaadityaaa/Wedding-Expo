import {
    LayoutDashboard,
    DollarSign,
    Users,
    MessageSquare,
    MessageCircle, // <--- Import Icon baru untuk Chat
    FileText,
    FileBadge,
    CreditCard,
    Package,
} from "lucide-react";

export const navItems = [
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
    // --- MENU BARU: CHAT SUPPORT ---
    {
        name: "Chat",
        icon: MessageCircle,
        label: "Pusat Pesan",
        route: "admin.chat.index", // Sesuai dengan route di web.php
    },
    // -------------------------------
    {
        name: "Vendor",
        icon: Users,
        label: "Kelola Vendor",
        route: "admin.vendors.index",
    },
    {
        name: "Users",
        icon: Users,
        label: "Data Pengguna",
        route: "admin.user-stats.index",
    },
    {
        name: "PackagePlans",
        icon: Package,
        label: "Master Paket",
        route: "admin.package-plans.index",
    },
    {
        name: "Reviews",
        icon: MessageSquare,
        label: "Moderasi Ulasan",
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
        label: "Manajemen Role",
        route: "admin.roles.index",
    },
    {
        name: "PaymentSettings",
        icon: CreditCard,
        label: "Rekening Bank",
        route: "admin.payment-settings.index",
    },
];
