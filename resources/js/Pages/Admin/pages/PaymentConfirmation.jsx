import React, { useState } from 'react';

const PaymentConfirmation = ({ paymentRequests = [], onAction }) => {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('Pending');

  const filtered = paymentRequests.filter(p => filter === 'All' ? true : p.status === filter);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Konfirmasi Pembayaran</h1>
      <p className="text-gray-500 mb-6">Terima dan verifikasi bukti pembayaran yang dikirim oleh vendor member.</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          {['Pending','Confirmed','Rejected','All'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium ${filter===f ? 'bg-amber-500 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>{f === 'All' ? 'Semua' : f}</button>
          ))}
        </div>
        <div className="text-sm text-gray-500">Total: {paymentRequests.length}</div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-amber-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Vendor</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nominal</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Bank / Rek.</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tanggal Kirim</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.vendorName}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{p.currency} {p.amount.toLocaleString('id-ID')}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{p.bankName} / {p.accountNumber}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(p.submittedAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-center text-sm"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.status === 'Pending' ? 'bg-amber-100 text-amber-800' : p.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{p.status}</span></td>
                <td className="px-4 py-3 text-center text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <button onClick={() => setSelected(p)} className="px-3 py-1 rounded-full border border-gray-200 text-sm">Lihat</button>
                    {p.status === 'Pending' && <>
                      <button onClick={() => onAction(p.id, 'Confirmed')} className="px-3 py-1 rounded-full bg-green-500 text-white text-sm">Konfirmasi</button>
                      <button onClick={() => onAction(p.id, 'Rejected')} className="px-3 py-1 rounded-full bg-red-500 text-white text-sm">Tolak</button>
                    </>}
                    <button onClick={() => onAction(p.id, 'delete')} className="px-3 py-1 rounded-full border border-gray-200 text-sm text-red-600">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="6" className="py-8 text-center text-gray-500 italic">Tidak ada permintaan konfirmasi pembayaran untuk filter ini.</td></tr>}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{selected.vendorName}</h3>
                <p className="text-sm text-gray-500">{selected.note}</p>
              </div>
              <div><button onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-800">Tutup</button></div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
                {selected.proofImage ? <img src={selected.proofImage} alt="Bukti Pembayaran" className="max-h-80 object-contain" /> : <div className="text-sm text-gray-400 italic">Belum ada bukti gambar (simulasi)</div>}
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-2"><strong>Nominal:</strong> {selected.currency} {selected.amount.toLocaleString('id-ID')}</div>
                <div className="text-sm text-gray-600 mb-2"><strong>Bank:</strong> {selected.bankName}</div>
                <div className="text-sm text-gray-600 mb-2"><strong>Nomor Rekening:</strong> {selected.accountNumber}</div>
                <div className="text-sm text-gray-600 mb-2"><strong>Atas Nama:</strong> {selected.accountHolder}</div>
                <div className="mt-4 flex space-x-2">
                  {selected.status === 'Pending' && <>
                    <button onClick={() => { onAction(selected.id, 'Confirmed'); setSelected(null); }} className="py-2 px-4 rounded-full bg-green-500 text-white">Konfirmasi</button>
                    <button onClick={() => { onAction(selected.id, 'Rejected'); setSelected(null); }} className="py-2 px-4 rounded-full bg-red-500 text-white">Tolak</button>
                  </>}
                  <button onClick={() => { onAction(selected.id, 'delete'); setSelected(null); }} className="py-2 px-4 rounded-full border border-gray-200 text-red-600">Hapus</button>
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
