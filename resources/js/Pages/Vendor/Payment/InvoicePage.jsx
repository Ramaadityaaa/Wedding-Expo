import React, { useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { Download, CircleCheck, Loader } from 'lucide-react';

// === Mock Data Invoice ===
// Di aplikasi nyata, data ini akan datang dari props, bukan mock
const mockInvoiceData = {
  invoiceId: 'INV-202501-00123',
  dateIssued: '2025-01-15',
  dueDate: '2025-02-14',
  status: 'PENDING',
  vendor: {
    name: 'PT. Vendor Cemerlang',
    address: 'Jl. Digital No. 12, Jakarta',
    email: 'billing@vendorcemerlang.co.id',
  },
  customer: {
    name: 'Pelanggan Premium Yth.',
    address: 'Jl. Sukses No. 45, Bandung',
    email: 'anda@example.com',
  },
  items: [
    { description: 'Langganan Membership Premium (Bulanan)', quantity: 1, unitPrice: 250000 },
    { description: 'Diskon Pemasangan Awal', quantity: 1, unitPrice: 0 }
  ],
};

// Formatter uang
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Formatter tanggal panjang
const formatDateLong = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

// Hitung total
const calculateTotals = (items) => {
  const subtotal = items.reduce((s, i) => s + (i.quantity * i.unitPrice), 0);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

export default function InvoicePage({ id }) {

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  const { subtotal, tax, total } = invoice
    ? calculateTotals(invoice.items)
    : { subtotal: 0, tax: 0, total: 0 };

  useEffect(() => {
    // Di aplikasi nyata, Anda akan fetch data dari API menggunakan `id`
    // Contoh: fetch(`/api/invoice/${id}`).then(...)
    setTimeout(() => {
      setInvoice(mockInvoiceData);
      setLoading(false);
    }, 1000);
  }, [id]); // tambahkan `id` sebagai dependensi

  // ================== AWAL PERBAIKAN ==================
  // FIX: Tombol Bayar Sekarang
  // Kita gunakan path manual '/vendor/payment/create'
  // Sesuai dengan nama rute 'vendor.payment.create' di file web.php
  const goToPaymentPage = () => {
    // router.visit(route('vendor.payment')); // <-- INI SALAH (nama rute salah & error Ziggy)
    router.get('/vendor/payment/create'); // <-- INI PERBAIKANNYA
  };
  // ================== AKHIR PERBAIKAN ==================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        <Loader className="animate-spin w-10 h-10 text-amber-600" />
        <span className="ml-4 text-lg">Memuat invoice...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <div className="max-w-5xl bg-white shadow-2xl p-12 mx-auto rounded-2xl border-t-8 border-amber-500">

        {/* Header */}
        <header className="pb-8 border-b">
          <h1 className="text-5xl font-extrabold text-amber-700">INVOICE</h1>
          <p className="text-gray-600 mt-2 text-lg">#{invoice.invoiceId}</p>

          {invoice.status === 'PENDING' && (
            <p className="mt-4 px-4 py-2 text-red-800 text-lg font-semibold bg-red-100 border border-red-300 rounded-full w-max">
              BELUM DIBAYAR
            </p>
          )}
        </header>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10 text-lg">
          <div>
            <p className="font-semibold text-amber-600 text-xl mb-1">Ditagihkan Kepada</p>
            <p className="font-bold">{invoice.customer.name}</p>
            <p>{invoice.customer.address}</p>
            <p>{invoice.customer.email}</p>
          </div>

          <div>
          V <p className="font-semibold text-amber-600 text-xl mb-1">Tanggal Invoice</p>
            <p>{formatDateLong(invoice.dateIssued)}</p>
          </div>

          <div>
            <p className="font-semibold text-amber-600 text-xl mb-1">Jatuh Tempo</p>
            <p className="font-bold text-red-500">
              {formatDateLong(invoice.dueDate)}
            </p>
          </div>
        </div>

        {/* Tabel */}
        <div className="mt-10 overflow-hidden shadow-md rounded-xl">
          <table className="w-full text-lg">
            <thead className="bg-amber-600 text-white text-lg">
              <tr>
                <th className="px-6 py-4 text-left">Deskripsi</th>
                <th className="px-6 py-4 text-right">Qty</th>
                <th className="px-6 py-4 text-right">Harga</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="text-lg">
              {invoice.items.map((item, i) => (
                <tr key={i} className="odd:bg-yellow-50">
                  <td className="px-6 py-4">{item.description}</td>
                  <td className="px-6 py-4 text-right">{item.quantity}</td>
Read `table.md-README.md` and `table.md-README.md-1.md` and generate the content for `table.md-README.md-2.md`.
                  <td className="px-6 py-4 text-right">{formatRupiah(item.unitPrice)}</td>
                  <td className="px-6 py-4 text-right">{formatRupiah(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-end mt-10 text-xl">
          <div className="w-72">
            <div className="flex justify-between py-2">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>PPN (11%)</span>
              <span>{formatRupiah(tax)}</span>
            </div>
            <div className="flex justify-between py-4 mt-4 text-2xl font-bold bg-orange-100 px-6 rounded-xl">
JSON         <span>Total</span>
              <span>{formatRupiah(total)}</span>
            </div>
          </div>
        </div>

        {/* Tombol Bayar */}
        {invoice.status === 'PENDING' && (
          <div className="flex justify-center mt-14">
            <button
              onClick={goToPaymentPage}
I             className="bg-amber-600 text-white px-16 py-5 rounded-2xl text-2xl font-bold shadow-xl hover:bg-amber-700 transition-all duration-300"
            >
              BAYAR SEKARANG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}