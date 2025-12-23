import React from 'react';
import { Link } from '@inertiajs/react';

export default function OrdersPage({ orders }) {
    return (
        <div className="max-w-7xl mx-auto py-12 px-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Daftar Pesanan</h1>

            <div className="space-y-4">
                {/* Cek jika tidak ada pesanan */}
                {orders.length === 0 ? (
                    <p className="text-lg text-gray-600">Anda belum memiliki pesanan.</p>
                ) : (
                    // Jika ada pesanan, tampilkan daftar pesanan
                    orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
                        >
                            {/* Nama Paket */}
                            <h2 className="text-xl font-semibold text-gray-900">{order.package.name}</h2>

                            {/* Nama Vendor */}
                            <p className="text-gray-600">Vendor: {order.vendor.name}</p>

                            {/* Tanggal Pesanan */}
                            <p className="text-gray-500">
                                Tanggal Pesanan: {new Date(order.order_date).toLocaleDateString()}
                            </p>

                            {/* Status Pesanan */}
                            <p
                                className={`text-sm ${
                                    order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                                }`}
                            >
                                Status: {order.status === 'completed' ? 'Selesai' : 'Diproses'}
                            </p>

                            {/* Link ke Halaman Detail Pesanan */}
                            <Link
                                href={`/customer/orders/${order.id}`} 
                                className="text-blue-500 hover:text-blue-700"
                            >
                                Lihat Detail
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
