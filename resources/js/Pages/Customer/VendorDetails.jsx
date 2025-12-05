import React from 'react';
import Navbar from '../../Components/Navbar'; // Pastikan path sesuai
import Footer from '../../Components/Footer'; // Pastikan path sesuai

// Halaman detail vendor menerima data 'vendor' sebagai props
export default function VendorDetails({ vendor }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            {/* Vendor Details */}
            <div className="pt-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <header className="mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-24 h-24 bg-gray-300 rounded-full"></div> {/* Ganti dengan logo atau foto vendor */}
                            <div>
                                <h1 className="text-4xl font-bold text-yellow-600">{vendor.name}</h1>
                                <p className="text-gray-600 mt-2">{vendor.city}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {vendor.rating} ⭐ ({vendor.reviews} ulasan)
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Tahun Berdiri: {vendor.established}</p>
                                <p className="text-sm text-gray-500">Event Ditangani: {vendor.eventsHandled}</p>
                                <p className="text-sm text-gray-500">Tim Profesional: {vendor.teamMembers}</p>
                            </div>
                        </div>
                        <p className="text-lg text-gray-700 mt-4">{vendor.description}</p>
                    </header>

                    {/* Paket Layanan */}
                    <section className="mt-10">
                        <h2 className="text-3xl font-semibold text-yellow-600">Paket Layanan</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                            {vendor.packages.map((pkg) => (
                                <div key={pkg.name} className="bg-white p-6 rounded-lg shadow-lg">
                                    <h3 className="text-xl font-semibold text-gray-900">{pkg.name}</h3>
                                    <p className="text-gray-500 mt-2">{pkg.description}</p>
                                    <p className="text-lg font-semibold text-yellow-600 mt-4">{pkg.price}</p>
                                    <p className="text-sm text-gray-500 mt-2">Durasi: {pkg.duration}</p>
                                    <button className="w-full mt-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition">
                                        Pilih Paket
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
