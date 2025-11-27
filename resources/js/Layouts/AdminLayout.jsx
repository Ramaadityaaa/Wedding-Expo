import React from 'react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

// === SVG INLINE ICONS (Telah Disediakan) ===
const IconDashboard = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h11.25A2.25 2.25 0 0 1 18 5.25v2.25m-15.75 0h15.75m-15.75 0A2.25 2.25 0 0 1 2.25 10.5v1.5m1.5-4.5V18m0 0h15.75m-15.75 0a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25M7.5 12h9m-9 3h9" /></svg>;
const IconUsers = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.125l-2.25-1.5m1.5-6.625l4.5 9.75M16.5 10.5l-4.5 4.5m-1.5-6.625L10.5 17.25M9 7.5l-2.25 1.5M7.5 15h9M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z" /></svg>;
const IconCreditCard = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9.75h19.5m-4.5-4.5v15M2.25 12h19.5m-4.5 4.5v3.75M2.25 18h19.5" /></svg>;
const IconLogOut = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l3-3m-3 3L9 6m0 10.5h6" /></svg>;
const IconMenu = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const IconClose = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
// === END ICONS ===


// Komponen Tata Letak Khusus untuk Admin Dashboard
export default function AdminLayout({ user, header, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Daftar Navigasi Sidebar (pastikan rute ini terdefinisi di routes/web.php)
    const AdminNavigation = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: IconDashboard, active: route().current('admin.dashboard') },
        // Rute untuk Verifikasi Vendor (AdminVendorController@index di backend)
        { name: 'Verifikasi Vendor', href: route('admin.vendors.index'), icon: IconUsers, active: route().current('admin.vendors.index') || route().current('admin.vendors.*') },
        // Rute untuk Bukti Pembayaran
        { name: 'Bukti Pembayaran', href: route('admin.paymentproof.index'), icon: IconCreditCard, active: route().current('admin.paymentproof.index') },
    ];
    
    // Item navigasi yang bisa diklik (digunakan untuk sidebar dan mobile dropdown)
    const NavItem = ({ item }) => (
        <Link
            href={item.href}
            className={`flex items-center px-6 py-3 transition duration-150 ease-in-out ${
                item.active 
                    ? 'bg-indigo-700 border-l-4 border-indigo-300' 
                    : 'hover:bg-indigo-700'
            }`}
            onClick={() => setIsSidebarOpen(false)} // Tutup sidebar setelah navigasi
        >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
        </Link>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar (Desktop) */}
            <aside 
                className={`fixed top-0 left-0 h-full w-64 bg-indigo-800 text-white shadow-2xl z-40
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0 md:flex-shrink-0`}
            >
                <div className="p-6 text-2xl font-extrabold text-center border-b border-indigo-700">
                    Admin Panel
                </div>
                <nav className="mt-6">
                    {AdminNavigation.map((item) => (
                        <NavItem key={item.name} item={item} />
                    ))}
                    
                    {/* Logout Button */}
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center px-6 py-3 mt-4 text-sm font-medium hover:bg-red-700 w-full text-left transition duration-150 ease-in-out"
                    >
                        <IconLogOut className="h-5 w-5 mr-3" />
                        Log Out
                    </Link>
                </nav>
            </aside>

            {/* Backdrop untuk mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-x-hidden">
                
                {/* Header (Top Navbar) */}
                <header className="bg-white shadow sticky top-0 z-20">
                    <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        
                        {/* Tombol Hamburger (Mobile) */}
                        <button 
                            className="text-gray-500 hover:text-gray-700 md:hidden p-2 rounded-md transition duration-150 ease-in-out"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
                        </button>
                        
                        {/* Judul Halaman */}
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            {header || 'Dashboard'}
                        </h2>
                        
                        {/* Info User (Desktop/Mobile) */}
                        <div className="text-gray-600 hidden sm:block">
                            Selamat datang, <span className="font-medium text-indigo-600">{user.name}</span>!
                        </div>
                        <div className="text-gray-600 sm:hidden">
                            <span className="font-medium text-indigo-600">{user.name}</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-6 lg:p-8 flex-1">
                    {children}
                </main>

                <footer className="py-4 text-center text-sm text-gray-500 border-t mt-auto">
                    &copy; {new Date().getFullYear()} Wedding Expo Admin.
                </footer>
            </div>
        </div>
    );
}