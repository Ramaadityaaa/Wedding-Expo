import { Link } from '@inertiajs/react';

// Ini adalah gabungan dari Navbar.tsx dan layout.tsx Anda
// Versi ini sudah dibersihkan dari sintaks TypeScript
export default function CustomerLayout({ auth, children }) {
    return (
        <div className="min-h-screen bg-white">
            <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4">
                    {/* Logo */}
                    <Link href={route('home')} className="mr-6 flex items-center space-x-2">
                        <span className="font-bold text-lg text-yellow-600">WeddingExpo</span>
                    </Link>

                    {/* Navigasi Tengah */}
                    <nav className="hidden md:flex gap-6">
                        <Link href={route('home')} className="text-sm font-medium text-gray-700 hover:text-yellow-600">
                            Beranda
                        </Link>
                        {/* Kita tambahkan '|| #' untuk fallback jika rute belum ada */}
                        <Link href={route('favorites.index') || '#'} className="text-sm font-medium text-gray-500 hover:text-yellow-600">
                            Favorit
                        </Link>
                    </nav>

                    {/* Navigasi Kanan (Auth) */}
                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')} // Link ke dashboard user/admin
                                className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-flex h-9 items-center justify-center rounded-md bg-yellow-500 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-yellow-600"
                                >
                                    Daftar Vendor
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Konten Halaman akan dimuat di sini */}
            <main>
                {children}
            </main>

            {/* --- Footer Section (Sudah ditambahkan) --- */}
            <footer className="bg-gray-900 text-gray-400">
                <div className="container max-w-7xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        
                        {/* Column 1: Logo & About */}
                        <div>
                            <Link href={route('home')} className="font-bold text-2xl text-yellow-500">
                                WeddingExpo
                            </Link>
                            <p className="mt-4 text-sm">
                                Platform direktori wedding organizer terlengkap di Indonesia.
                            </p>
                        </div>

                        {/* Column 2: Layanan */}
                        <div>
                            <h3 className="font-semibold text-white mb-4">Layanan</h3>
                            <nav className="flex flex-col space-y-2 text-sm">
                                <Link href="#" className="hover:text-yellow-500">Cari Vendor</Link>
                                <Link href={route('favorites.index') || '#'} className="hover:text-yellow-500">Inspirasi</Link>
                            </nav>
                        </div>

                        {/* Column 3: Vendor */}
                        <div>
                            <h3 className="font-semibold text-white mb-4">Vendor</h3>
                            <nav className="flex flex-col space-y-2 text-sm">
                                <Link href={route('register')} className="hover:text-yellow-500">Daftar Vendor</Link>
                                <Link href={route('login')} className="hover:text-yellow-500">Login Vendor</Link>
                                <Link href="#" className="hover:text-yellow-500">Panduan</Link>
                            </nav>
                        </div>

                        {/* Column 4: Kontak */}
                        <div>
                            <h3 className="font-semibold text-white mb-4">Kontak</h3>
                            <ul className="space-y-2 text-sm">
                                <li>info@weddingexpo.id</li>
                                <li>+62 21 1234 5678</li> {/* Ganti dengan nomor asli Anda */}
                                <li>Jakarta, Indonesia</li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-12 pt-8 border-t border-gray-700 text-center">
                        <p className="text-xs text-gray-500">
                            © 2024 WeddingExpo. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
            {/* --- End Footer Section --- */}
            
        </div>
    );
}