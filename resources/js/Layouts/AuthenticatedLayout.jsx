import { usePage, Link } from '@inertiajs/react';

export default function AuthenticatedLayout({ auth, header, children }) {
    // ambil auth dari props atau dari shared props Inertia
    const page = usePage();
    const sharedAuth = auth ?? page.props.auth ?? {};
    const user = sharedAuth.user ?? null;

    const userName = user?.name ?? 'Guest';

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* ... kiri nav ... */}

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            {user ? (
                                // kalau sudah login, tampilkan dropdown nama user
                                <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md"
                                    >
                                        {userName}
                                    </button>
                                </span>
                            ) : (
                                // kalau belum login, tampilkan tombol Login
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

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
