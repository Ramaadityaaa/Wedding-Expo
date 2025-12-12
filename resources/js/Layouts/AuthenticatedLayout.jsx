// resources/js/Layouts/AuthenticatedLayout.jsx

import { usePage, Link } from '@inertiajs/react';
// import Dropdown, NavLink, dll. (Jika Anda menggunakannya)

// Perbaiki destructuring agar konsisten
export default function AuthenticatedLayout({ auth, header, children }) {
    // Gunakan 'auth' yang dilewatkan dari Edit.jsx (yang berisi auth.user)
    const user = auth?.user ?? usePage().props.auth?.user ?? null; 

    const userName = user?.name ?? 'Guest';

    return (
        <div className="min-h-screen bg-gray-100">
            {/* ... Navbar (Navigation Header) ... */}
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Area Navigasi Kiri (Logo, Tautan Utama) */}
                        <div>
                            {/* ... Tautan Anda di sini ... */}
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            {user ? (
                                // Tampilan ketika sudah login
                                <Link
                                    href={route('profile.edit')}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 hover:text-gray-900 focus:outline-none transition ease-in-out duration-150"
                                >
                                    {userName}
                                </Link>
                            ) : (
                                // Tampilan ketika belum login
                                <Link
                                    href={route('login')}
                                    className="text-sm text-gray-700 underline"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            {/* ... End Navbar ... */}

            {/* Header Content (Tampil di atas main content) */}
            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content Area */}
            {/* Catatan: AuthenticatedLayout biasanya tidak memiliki sidebar. 
               Jika Customer juga perlu sidebar, Anda harus menambahkannya di sini. 
               Karena Anda hanya ingin Vendor memiliki sidebar, layout ini biarkan standar. */}
            <main>{children}</main>
        </div>
    );
}