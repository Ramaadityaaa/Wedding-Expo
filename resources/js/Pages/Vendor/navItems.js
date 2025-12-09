import {
    LayoutDashboard,
    User,
    CreditCard,
    Package,
    Image as ImageIcon,
    MessageSquare,
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

    // Menu-menu ini akan TERKUNCI otomatis jika status != active
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
    }, // Pastikan nama route ini 'chat.index' (yang halaman)
];
