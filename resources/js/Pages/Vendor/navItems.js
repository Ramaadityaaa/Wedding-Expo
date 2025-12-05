import {
    LayoutDashboard,
    Package,
    Image,
    MessageSquare,
    CreditCard,
    FileText,
    DollarSign,
    UserCog,
    FileBadge, // Tambahkan ini jika belum ada
} from "lucide-react";

export const vendorNavItems = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
        route: "vendor.dashboard",
    },
    {
        name: "Profile",
        icon: UserCog,
        label: "Profil & Info",
        route: null, // Menggunakan rute bawaan Laravel
    },
    {
        name: "Packages",
        icon: Package,
        label: "Paket Harga",
        route: null,
    },
    {
        name: "Portfolio",
        icon: Image,
        label: "Portofolio",
        route: null,
    },
    {
        name: "Reviews",
        icon: MessageSquare,
        label: "Ulasan",
        route: null,
    },
    {
        name: "PaymentProof",
        icon: DollarSign,
        label: "Status Pembayaran",
        route: null,
    },
    {
        name: "Membership",
        icon: CreditCard,
        label: "Atur Membership",
        // >>> PERBAIKAN UTAMA DI SINI <<<
        route: "vendor.membership.index", // Menggunakan nama rute yang BENAR
    },
];
