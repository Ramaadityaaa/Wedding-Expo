import React from 'react';
import { Link } from '@inertiajs/react'; // Import Link untuk navigasi antar halaman
import Navbar from '../../Components/Navbar'; // Pastikan path sesuai
import Footer from '../../Components/Footer'; // Pastikan path sesuai

const dummyFavorites = [
    { id: 1, name: 'Studio Foto Awan Jingga', category: 'Fotografi', city: 'Bandung', price: 'Rp 5.000.000' },
    { id: 2, name: 'Catering Bunga Melati', category: 'Katering', city: 'Jakarta', price: 'Rp 50.000 / porsi' },
    { id: 3, name: 'Venue Grand Ballroom', category: 'Venue', city: 'Surabaya', price: 'Rp 20.000.000' },
];

export default function FavoritePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            {/* Konten Halaman Favorit */}
            <div className="pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <header className="mb-12 text-center">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text tracking-wide font-montserrat">
                            Favorit Saya
                        </h1>
                        <p className="text-gray-600 mt-4 text-lg max-w-3xl mx-auto">
                            Kelola semua daftar vendor dan inspirasi yang Anda simpan dengan mudah. Temukan vendor terbaik untuk hari istimewa Anda.
                        </p>
                    </header>
                    <section className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 space-y-6">
                        {dummyFavorites.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {dummyFavorites.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col justify-between items-start bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out"
                                    >
                                        <div className="flex-grow">
                                            <h2 className="text-2xl font-semibold text-gray-900">{item.name}</h2>
                                            <p className="text-sm text-gray-500 mt-2">
                                                <span className="font-medium text-yellow-700">{item.category}</span> • {item.city}
                                            </p>
                                            <p className="text-md font-semibold text-gray-700 mt-2">{item.price}</p>
                                        </div>
                                        <div className="flex space-x-4 mt-6">
                                            {/* Link untuk mengarahkan ke halaman VendorDetail */}
                                            <Link 
                                                href={`/vendors/${item.id}`} 
                                                className="px-6 py-2 text-sm bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors"
                                            >
                                                Lihat Detail
                                            </Link>
                                            <button className="px-6 py-2 text-sm border border-red-400 text-red-600 rounded-xl hover:bg-red-50 transition-colors">
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-12 bg-gray-50 rounded-lg">
                                <h3 className="text-2xl font-semibold text-gray-700">Ups, Daftar Anda Kosong!</h3>
                                <p className="mt-3 text-gray-500">Jelajahi berbagai vendor pernikahan menakjubkan dan klik ikon hati untuk menyimpan favorit Anda.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
