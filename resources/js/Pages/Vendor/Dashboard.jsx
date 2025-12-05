import React from "react";
import { Head, usePage } from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout"; // Menggunakan Layout baru

export default function VendorDashboard({ vendor }) {
    const { auth } = usePage().props;

    // Catatan: Data Vendor utama (nama, isApproved, dll)
    // akan datang dari props 'vendor' yang dikirim Vendor/DashboardController.php

    return (
        <VendorLayout
            user={auth.user}
            vendor={vendor}
            header="Dashboard Vendor"
        >
            <Head title="Vendor Dashboard" />

            <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Ringkasan Akun Vendor
                </h2>
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Selamat datang, **{vendor.name}**! Akun Anda berstatus:
                        <span
                            className={`font-extrabold ml-2 ${
                                vendor.isApproved === "APPROVED"
                                    ? "text-green-600"
                                    : "text-amber-600"
                            }`}
                        >
                            {vendor.isApproved}
                        </span>
                    </p>
                    <p className="text-sm text-gray-500">
                        Gunakan menu di samping kiri untuk mengelola profil,
                        paket, dan portofolio Anda.
                    </p>
                </div>
            </div>
        </VendorLayout>
    );
}
