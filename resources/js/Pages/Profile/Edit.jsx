// resources/js/Pages/Profile/Edit.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import VendorLayout from '@/Layouts/VendorLayout';

import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';

// Fungsi untuk memilih komponen Layout berdasarkan role pengguna.
const getLayoutComponent = (user) => {
    // 1. Cek jika user memiliki role 'Vendor' atau 'Admin' di level User (opsional)
    // Asumsi: Vendor memiliki objek vendor di auth.user.vendor
    const isVendor = user?.vendor !== undefined && user?.vendor !== null;
    
    // 2. Prioritaskan VendorLayout untuk pengguna yang merupakan Vendor
    if (isVendor) {
        return VendorLayout;
    } 

    // 3. Gunakan AuthenticatedLayout untuk semua role lain (Customer, Admin, dll. yang tidak perlu VendorSidebar)
    return AuthenticatedLayout;
};

export default function Edit({ auth, mustVerifyEmail, status }) {
    // 1. Pilih Komponen Layout
    const LayoutComponent = getLayoutComponent(auth.user);
    
    const profileContent = (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* Update Profile Form */}
                <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                {/* Update Password Form */}
                <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                {/* Delete User Form */}
                <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </div>
    );

    // 3. Render dengan Layout yang dipilih
    // Kita harus MENGIRIM properti 'auth' (berisi user) ke Layout, karena Layout membutuhkannya.
    return (
        <LayoutComponent
            auth={auth} // Kirim seluruh objek auth ke Layouts
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profil Saya</h2>}
        >
            <Head title="Profil" />
            {profileContent}
        </LayoutComponent>
    );
}