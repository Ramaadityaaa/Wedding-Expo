import {
    LayoutDashboard,
    DollarSign,
    Users,
    MessageSquare,
    FileText,
    FileBadge,
    CreditCard,
    Package, // Import ikon Package untuk manajemen paket
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
        route: "admin.reviews.index",
    },
    {
        name: "PackagePlans", // Nama baru untuk manajemen paket
        icon: Package, // Menggunakan ikon paket
        label: "Kelola Paket",
        route: "admin.package-plans.index", // Rute baru yang sudah kita buat
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
        label: "Edit Role",
        route: "admin.roles.index",
    },
    {
        name: "PaymentSettings",
        icon: CreditCard,
        label: "Pengaturan Bayar",
        route: "admin.payment-settings.index",
    },
];
