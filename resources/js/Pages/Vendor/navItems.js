import {
    LayoutDashboard,
    User,
    CreditCard,
    Package,
    Image as ImageIcon,
    MessageSquare,
    Banknote,  // Import icon Banknote untuk Pengaturan Rekening
} from "lucide-react";

export const vendorNavItems = [
    {
        name: "dashboard",
        label: "Dashboard",
        route: "vendor.dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "profile",
        label: "Profil Bisnis",
        route: "vendor.profile.edit",
        icon: User,
    },
    {
        name: "membership",
        label: "Langganan",
        route: "vendor.membership.index",
        icon: CreditCard,
    },
    {
        name: "bank-settings",  // Tambahkan menu untuk pengaturan rekening
        label: "Pengaturan Rekening",  // Label untuk menu
        route: "vendor.bank.edit",  // Route untuk mengarahkan ke halaman pengaturan rekening
        icon: Banknote,  // Gunakan icon Banknote
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
    {
        name: "chat",
        label: "Pesan & Chat",
        route: "vendor.chat.index",
        icon: MessageSquare,
    },
];
