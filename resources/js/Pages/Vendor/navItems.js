import { LayoutDashboard, DollarSign, Users, MessageSquare, FileText, FileBadge, CreditCard } from "lucide-react";

export const vendorNavItems = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
        route: "vendor.dashboard",
    },
    {
        name: "Konfirmasi Pembayaran",
        icon: DollarSign,
        label: "Konfirmasi Bayar",
        route: "vendor.paymentproof.index",
    },
    {
        name: "Vendor",
        icon: Users,
        label: "Vendor",
        route: "vendor.vendors.index",
    },
    {
        name: "Reviews",
        icon: MessageSquare,
        label: "Ulasan",
        route: "vendor.reviews.index",
    },
    {
        name: "Payment Settings",
        icon: CreditCard,
        label: "Pengaturan Bayar",
        route: "vendor.payment-settings.index",
    },
    {
        name: "Static Content",
        icon: FileText,
        label: "Konten Statis",
        route: "vendor.static-content.index",
    },
    {
        name: "Role Editor",
        icon: FileBadge,
        label: "Editor Peran",
        route: "vendor.roles.index",
    },
];
