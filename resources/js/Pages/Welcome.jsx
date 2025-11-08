import { Link, Head } from '@inertiajs/react';

// 'vendors' adalah props dari HomeController
export default function Welcome({ auth, vendors, canLogin, canRegister }) {
    return (
        <>
            <Head title="Wedding Expo" />
            <div className="min-h-screen bg-gray-100 p-10">
                <h1 className="text-3xl font-bold">Wedding Expo Customer Dashboard</h1>
                <p className="mt-2">Data ini datang dari Laravel:</p>

                <div className="mt-6">
                    {vendors.length === 0 ? (
                        <p>Tidak ada vendor yang disetujui saat ini.</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-4">
                            {vendors.map((vendor) => (
                                <div key={vendor.id} className="bg-white p-4 shadow rounded">
                                    <h2 className="font-bold">{vendor.name}</h2>
                                    <p>{vendor.city}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}