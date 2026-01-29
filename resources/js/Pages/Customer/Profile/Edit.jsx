import React from "react";
import { Head } from "@inertiajs/react";
import Navbar from "@/components/Navbar"; // Sesuaikan casing folder (components/Components)
import Footer from "@/Components/Footer"; // Sesuaikan casing folder
import UpdateProfileInformationForm from "@/Pages/Profile/Partials/UpdateProfileInformationForm";
import UpdatePasswordForm from "@/Pages/Profile/Partials/UpdatePasswordForm";
import DeleteUserForm from "@/Pages/Profile/Partials/DeleteUserForm";

export default function Edit({ auth, mustVerifyEmail, status }) {
    const user = auth.user;

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col justify-between">
            <Head title="Pengaturan Akun" />

            {/* NAVBAR CUSTOMER */}
            <Navbar auth={auth} user={user} />

            <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
                {/* Header Sederhana */}
                <div className="max-w-4xl mx-auto mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
                        Pengaturan Akun
                    </h1>
                    <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mb-4"></div>
                    <p className="text-gray-600">
                        Kelola informasi profil, keamanan, dan privasi akun
                        Anda.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-8">
                    {/* FORM 1: INFO PROFIL */}
                    <div className="p-4 sm:p-8 bg-white shadow-xl shadow-amber-100/50 sm:rounded-2xl border border-gray-100">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* FORM 2: PASSWORD */}
                    <div className="p-4 sm:p-8 bg-white shadow-xl shadow-amber-100/50 sm:rounded-2xl border border-gray-100">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* FORM 3: HAPUS AKUN */}
                    <div className="p-4 sm:p-8 bg-white shadow-xl shadow-amber-100/50 sm:rounded-2xl border border-gray-100">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <Footer />
        </div>
    );
}
