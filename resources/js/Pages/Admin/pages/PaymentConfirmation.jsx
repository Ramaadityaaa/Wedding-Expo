import React, { useState } from 'react';

const PaymentConfirmation = ({ paymentRequests = [], onAction }) => {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('Pending');

  // FILTER Berdasarkan status
  const filtered = paymentRequests.filter(p =>
    filter === 'All' ? true : p.status === filter
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Konfirmasi Pembayaran</h1>
      <p className="text-gray-500 mb-6">
        Terima dan verifikasi bukti pembayaran vendor.
      </p>

      {/* Filter Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          {['Pending', 'Approved', 'Rejected', 'All'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === f
                  ? 'bg-amber-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              {f === 'All' ? 'Semua' : f}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-500">
          Total: {paymentRequests.length}
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow-lg border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-amber-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Vendor
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Nominal
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Tanggal Kirim
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {p.vendor?.name ?? 'Unknown'}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  Rp {Number(p.amount).toLocaleString('id-ID')}
                </td>

                <td className="px-4 py-3 text-sm text-gray-500">
                  {p.created_at
                    ? new Date(p.created_at).toLocaleString('id-ID')
                    : '-'}
                </td>

                <td className="px-4 py-3 text-center text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      p.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : p.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-center text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setSelected(p)}
                      className="px-3 py-1 rounded-full border border-gray-200 text-sm"
                    >
                      Lihat
                    </button>

                    {p.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => onAction(p.id, 'Approved')}
                          className="px-3 py-1 rounded-full bg-green-500 text-white text-sm"
                        >
                          Konfirmasi
                        </button>

                        <button
                          onClick={() => onAction(p.id, 'Rejected')}
                          className="px-3 py-1 rounded-full bg-red-500 text-white text-sm"
                        >
                          Tolak
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => onAction(p.id, 'delete')}
                      className="px-3 py-1 rounded-full border border-gray-200 text-sm text-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="py-8 text-center text-gray-500 italic"
                >
                  Tidak ada pembayaran untuk filter ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DETAIL */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{selected.vendor?.name}</h3>
                <p className="text-sm text-gray-500">
                  ID Pembayaran: {selected.id}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                Tutup
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GAMBAR */}
              <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
                {selected.file_url ? (
                  <img
                    src={selected.file_url}
                    alt="Bukti Pembayaran"
                    className="max-h-80 object-contain"
                  />
                ) : (
                  <div className="text-sm text-gray-400 italic">
                    Tidak ada bukti pembayaran.
                  </div>
                )}
              </div>

              {/* DETAIL */}
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Nominal:</strong> Rp{' '}
                  {Number(selected.amount).toLocaleString('id-ID')}
                </p>

                <p className="text-sm text-gray-600 mb-2">
                  <strong>Status:</strong> {selected.status}
                </p>

                <p className="text-sm text-gray-600 mb-2">
                  <strong>Dikirim pada:</strong>{' '}
                  {new Date(selected.created_at).toLocaleString('id-ID')}
                </p>

                <div className="mt-4 flex space-x-2">
                  {selected.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => {
                          onAction(selected.id, 'Approved');
                          setSelected(null);
                        }}
                        className="py-2 px-4 rounded-full bg-green-500 text-white"
                      >
                        Konfirmasi
                      </button>

                      <button
                        onClick={() => {
                          onAction(selected.id, 'Rejected');
                          setSelected(null);
                        }}
                        className="py-2 px-4 rounded-full bg-red-500 text-white"
                      >
                        Tolak
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      onAction(selected.id, 'delete');
                      setSelected(null);
                    }}
                    className="py-2 px-4 rounded-full border border-gray-200 text-red-600"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentConfirmation;
