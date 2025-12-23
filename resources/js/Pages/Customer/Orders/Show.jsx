import React from 'react';

export default function OrderDetail({ order }) {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Detail Pesanan</h1>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">{order.package.name}</h2>
                <p className="text-gray-600">Vendor: {order.vendor.name}</p>
                <p className="text-gray-500">Tanggal Pesanan: {new Date(order.order_date).toLocaleDateString()}</p>
                <p className={`text-sm ${order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                    Status: {order.status === 'completed' ? 'Selesai' : 'Diproses'}
                </p>
                <p className="text-sm text-gray-500 mt-4">Catatan: {order.notes || 'Tidak ada catatan.'}</p>
            </div>
        </div>
    );
}
