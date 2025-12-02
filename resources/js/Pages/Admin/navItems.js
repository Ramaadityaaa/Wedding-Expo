import {
    LayoutDashboard,
    DollarSign,
    Users,
    MessageSquare,
    FileText,
    FileBadge,
    CreditCard,
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
    {
        name: "Vendor",
        icon: Users,
        label: "Vendor",
        route: "admin.vendors.index",
    },
    {
        name: "Users",
        icon: Users,
        label: "Pengguna",
        route: "admin.user-stats.index",
    },
    {
        name: "Reviews",
        icon: MessageSquare,
        label: "Ulasan",
        route: "admin.reviews.index", // Rute baru untuk moderasi ulasan
    },
    {
        name: "StaticContent",
        icon: FileText,
        label: "Konten Statis",
        route: "admin.static-content.index", // Set null jika controller belum dibuat, atau ganti 'admin.static-content.index'
    },
    {
        name: "PaymentSettings", // Ganti nama agar unik dari 'KonfirmasiPembayaran'
        icon: CreditCard,
        label: "Pengaturan Bayar",
        route: "admin.payment-settings.index", // Rute baru yang akan kita buat
    },
    {
        name: "RoleEditor",
        icon: FileBadge,
        label: "Editor Peran",
        route: "admin.roles.index", // Rute baru untuk editor peran
    },
];
