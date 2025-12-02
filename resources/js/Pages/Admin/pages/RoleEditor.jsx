import React, { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Loader2, Save, RotateCcw } from "lucide-react";

export default function RoleEditor({ vendors = [] }) {
    const { auth } = usePage().props;

    // State lokal untuk menyimpan perubahan sementara sebelum di-save ke database
    const [roleEdits, setRoleEdits] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    // --- HANDLER ---

    // Fungsi untuk mengubah state lokal
    const handleLocalChange = (vendorId, newRole) => {
        setRoleEdits((prev) => ({
            ...prev,
            [vendorId]: newRole,
        }));
    };

    // Fungsi Reset
    const handleReset = () => {
        if (confirm("Batalkan semua perubahan yang belum disimpan?")) {
            setRoleEdits({});
        }
    };

    // Fungsi Simpan ke Server (Batch Update)
    const handleSaveRoles = () => {
        const editsCount = Object.keys(roleEdits).length;
        if (editsCount === 0) {
            alert("Tidak ada perubahan role yang perlu disimpan.");
            return;
        }

        if (!confirm(`Simpan perubahan role untuk ${editsCount} vendor?`))
            return;

        setIsProcessing(true);

        router.post(
            route("admin.roles.update"),
            {
                edits: roleEdits, // Mengirim object { id: 'Role', id2: 'Role' }
            },
            {
                onSuccess: () => {
                    setRoleEdits({}); // Reset state lokal setelah sukses
                    setIsProcessing(false);
                },
                onError: () => {
                    alert("Gagal menyimpan perubahan.");
                    setIsProcessing(false);
                },
                preserveScroll: true,
            }
        );
    };

    return (
        <AdminLayout user={auth?.user} header="Edit Role Vendor">
            <Head title="Edit Role" />

            <div className="p-4 sm:p-6 max-w-full mx-auto font-sans">
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                        Edit Role Vendor / Membership
                    </h1>
                    <p className="text-gray-500">
                        Atur tingkatan membership vendor (Vendor Biasa vs
                        Membership Premium). Hanya menampilkan vendor yang sudah{" "}
                        <strong>Approved</strong>.
                    </p>
                </div>

                <div className="overflow-x-auto bg-white rounded-2xl shadow-2xl border border-amber-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                    Nama Vendor
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                    No. Telepon
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                    Role Saat Ini
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">
                                    Ubah Role
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {vendors.length > 0 ? (
                                vendors.map((v) => {
                                    // Tentukan role yang akan ditampilkan (prioritas: state lokal > database)
                                    const currentRole =
                                        roleEdits[v.id] || v.role || "Vendor";

                                    return (
                                        <tr
                                            key={v.id}
                                            className="hover:bg-amber-50/50 transition duration-150"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {v.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {v.contact_email || v.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {v.contact_phone ||
                                                    v.phone ||
                                                    "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span
                                                    className={`px-2 py-1 rounded-md text-xs font-bold ${
                                                        v.role === "Membership"
                                                            ? "bg-indigo-100 text-indigo-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {v.role || "Vendor"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="inline-flex items-center space-x-2 bg-gray-100 p-1.5 rounded-full border border-gray-200">
                                                    <button
                                                        onClick={() =>
                                                            handleLocalChange(
                                                                v.id,
                                                                "Vendor"
                                                            )
                                                        }
                                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                                                            currentRole ===
                                                            "Vendor"
                                                                ? "bg-white text-gray-800 shadow-md ring-1 ring-gray-200"
                                                                : "text-gray-500 hover:text-gray-700"
                                                        }`}
                                                    >
                                                        Vendor
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleLocalChange(
                                                                v.id,
                                                                "Membership"
                                                            )
                                                        }
                                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                                                            currentRole ===
                                                            "Membership"
                                                                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md"
                                                                : "text-gray-500 hover:text-gray-700"
                                                        }`}
                                                    >
                                                        Membership
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-12 text-gray-500 italic"
                                    >
                                        Tidak ada vendor yang berstatus
                                        Approved.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 bg-white p-4 rounded-xl shadow-lg border border-amber-100">
                    <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                        <span className="font-bold text-amber-600">
                            {Object.keys(roleEdits).length}
                        </span>{" "}
                        perubahan tertunda. Klik Simpan untuk menerapkan.
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleReset}
                            disabled={
                                Object.keys(roleEdits).length === 0 ||
                                isProcessing
                            }
                            className="flex items-center px-5 py-2.5 rounded-full border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-50 transition"
                        >
                            <RotateCcw size={18} className="mr-2" />
                            Reset
                        </button>
                        <button
                            onClick={handleSaveRoles}
                            disabled={
                                Object.keys(roleEdits).length === 0 ||
                                isProcessing
                            }
                            className="flex items-center px-6 py-2.5 rounded-full font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-orange-700 transform hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <Loader2
                                    size={18}
                                    className="animate-spin mr-2"
                                />
                            ) : (
                                <Save size={18} className="mr-2" />
                            )}
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
