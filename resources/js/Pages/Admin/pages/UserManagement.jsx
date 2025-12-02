import React, { useState, useMemo } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout"; // Import Layout
import {
    CheckCircle,
    XCircle,
    Trash2,
    Users,
    ShieldAlert,
    Search,
} from "lucide-react";

export default function UserManagement({ users = [] }) {
    const { auth } = usePage().props;
    const [currentView, setCurrentView] = useState("Active"); // Active, Suspended
    const [searchQuery, setSearchQuery] = useState("");

    // --- HANDLERS (Aksi ke Backend) ---
    const handleAction = (userId, actionType) => {
        let confirmMsg = "";
        let routeName = "";
        let method = "patch";
        let data = {};

        if (actionType === "delete") {
            confirmMsg =
                "Apakah Anda yakin ingin menghapus pengguna ini secara permanen?";
            routeName = "admin.users.destroy"; // Pastikan route ini ada
            method = "delete";
        } else if (actionType === "Suspended") {
            confirmMsg =
                "Apakah Anda yakin ingin menangguhkan (suspend) akun ini?";
            routeName = "admin.users.update-status";
            data = { status: "Suspended" };
        } else if (actionType === "Active") {
            confirmMsg = "Aktifkan kembali akun ini?";
            routeName = "admin.users.update-status";
            data = { status: "Active" };
        }

        if (!window.confirm(confirmMsg)) return;

        router[method](route(routeName, userId), data, {
            onSuccess: () => {
                // Data akan refresh otomatis
            },
            preserveScroll: true,
        });
    };

    // --- FILTERING & SEARCH ---
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesStatus = (user.status || "Active") === currentView;
            const matchesSearch =
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [users, currentView, searchQuery]);

    const stats = {
        active: users.filter((u) => (u.status || "Active") === "Active").length,
        suspended: users.filter((u) => u.status === "Suspended").length,
    };

    // Helper Styles
    const getStatusBadge = (status) => {
        if (status === "Suspended")
            return "bg-red-100 text-red-800 border-red-200";
        return "bg-green-100 text-green-800 border-green-200";
    };

    return (
        <AdminLayout user={auth?.user} header="Manajemen Pengguna">
            <Head title="Manajemen Pengguna" />

            <div className="p-4 sm:p-6 max-w-full mx-auto font-sans">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                            Manajemen Pengguna
                        </h1>
                        <p className="text-gray-500">
                            Kelola akun pengguna (Customer) yang terdaftar di
                            platform.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-4 md:mt-0 relative">
                        <input
                            type="text"
                            placeholder="Cari nama atau email..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full md:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setCurrentView("Active")}
                        className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                            currentView === "Active"
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                    >
                        <Users className="w-5 h-5 mr-2" />
                        Aktif ({stats.active})
                    </button>
                    <button
                        onClick={() => setCurrentView("Suspended")}
                        className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                            currentView === "Suspended"
                                ? "bg-red-600 text-white shadow-lg shadow-red-200"
                                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                    >
                        <ShieldAlert className="w-5 h-5 mr-2" />
                        Ditangguhkan ({stats.suspended})
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Info Pengguna
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Kontak
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Bergabung
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50 transition duration-150"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg mr-3">
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            ID: #{user.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {user.email}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {user.phone || "-"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(
                                                        user.status || "Active"
                                                    )}`}
                                                >
                                                    {user.status || "Active"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                {user.created_at
                                                    ? new Date(
                                                          user.created_at
                                                      ).toLocaleDateString(
                                                          "id-ID"
                                                      )
                                                    : "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <div className="flex justify-center space-x-2">
                                                    {/* Tombol Aksi Dinamis */}
                                                    {(user.status ||
                                                        "Active") ===
                                                    "Active" ? (
                                                        <button
                                                            onClick={() =>
                                                                handleAction(
                                                                    user.id,
                                                                    "Suspended"
                                                                )
                                                            }
                                                            title="Tangguhkan Akun"
                                                            className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition"
                                                        >
                                                            <ShieldAlert className="w-5 h-5" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                handleAction(
                                                                    user.id,
                                                                    "Active"
                                                                )
                                                            }
                                                            title="Aktifkan Kembali"
                                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() =>
                                                            handleAction(
                                                                user.id,
                                                                "delete"
                                                            )
                                                        }
                                                        title="Hapus Permanen"
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-12 text-center text-gray-500 italic"
                                        >
                                            <div className="flex flex-col items-center">
                                                <Users className="w-12 h-12 text-gray-300 mb-3" />
                                                <p>
                                                    Tidak ada pengguna ditemukan
                                                    di kategori{" "}
                                                    <strong>
                                                        {currentView}
                                                    </strong>
                                                    .
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
