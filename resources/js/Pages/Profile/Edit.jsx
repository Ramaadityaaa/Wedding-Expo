import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import VendorLayout from "@/Layouts/VendorLayout";
import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
// Import form baru yang kita buat tadi
import UpdateVendorBusinessForm from "./Partials/UpdateVendorBusinessForm";

export default function Edit({ auth, mustVerifyEmail, status }) {
    const isVendor = auth.user.role === "VENDOR";
    const Layout = isVendor ? VendorLayout : AuthenticatedLayout;

    return (
        <Layout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {isVendor ? "Pengaturan Akun & Bisnis" : "Profil Saya"}
                </h2>
            }
        >
            <Head title="Profil Akun" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* BAGIAN 1: KHUSUS VENDOR (DATA BISNIS) */}
                    {isVendor && (
                        <UpdateVendorBusinessForm className="max-w-4xl border border-amber-200" />
                    )}

                    {/* BAGIAN 2: DATA LOGIN (USER) */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section>
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">
                                    Informasi Akun Login
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Update email dan nama tampilan untuk login
                                    aplikasi.
                                </p>
                            </header>
                            <div className="mt-6">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-w-xl"
                                />
                            </div>
                        </section>
                    </div>

                    {/* BAGIAN 3: PASSWORD */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* BAGIAN 4: HAPUS AKUN */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
