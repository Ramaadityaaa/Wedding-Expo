import React, { useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { Download, CircleCheck, Loader } from 'lucide-react';

// === Mock Data Invoice ===
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
    setTimeout(() => {
      setInvoice(mockInvoiceData);
      setLoading(false);
    }, 1000);
  }, []);

  // === FIX: Tombol Bayar Sekarang ===
  const goToPaymentPage = () => {
    router.get(route('vendor.payment.create'));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin w-8 h-8 text-amber-600" />
        <span className="ml-3">Memuat invoice...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl bg-white shadow-2xl p-8 mx-auto rounded-xl border-t-8 border-amber-500">

        {/* Header */}
        <header className="pb-6 border-b">
          <h1 className="text-4xl font-extrabold text-amber-700">INVOICE</h1>
          <p className="text-gray-600 mt-1">#{invoice.invoiceId}</p>

          {invoice.status === 'PENDING' && (
            <p className="mt-3 px-3 py-1 text-red-800 font-semibold bg-red-100 border border-red-300 rounded-full w-max">
              BELUM DIBAYAR
            </p>
          )}
        </header>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <p className="font-semibold text-amber-600">Ditagihkan Kepada</p>
            <p className="font-medium">{invoice.customer.name}</p>
            <p className="text-sm">{invoice.customer.address}</p>
            <p className="text-sm">{invoice.customer.email}</p>
          </div>

          <div>
            <p className="font-semibold text-amber-600">Tanggal Invoice</p>
            <p className="text-sm">{formatDateLong(invoice.dateIssued)}</p>
          </div>

          <div>
            <p className="font-semibold text-amber-600">Jatuh Tempo</p>
            <p className="text-sm font-medium text-red-500">
              {formatDateLong(invoice.dueDate)}
            </p>
          </div>
        </div>

        {/* Tabel */}
        <div className="mt-6 overflow-hidden shadow rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-amber-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Deskripsi</th>
                <th className="px-4 py-2 text-right">Qty</th>
                <th className="px-4 py-2 text-right">Harga</th>
                <th className="px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i} className="odd:bg-yellow-50">
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2 text-right">{item.quantity}</td>
                  <td className="px-4 py-2 text-right">{formatRupiah(item.unitPrice)}</td>
                  <td className="px-4 py-2 text-right">{formatRupiah(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-end mt-6">
          <div className="w-64">
            <div className="flex justify-between py-1">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>PPN (11%)</span>
              <span>{formatRupiah(tax)}</span>
            </div>
            <div className="flex justify-between py-3 mt-2 text-lg font-bold bg-orange-100 px-4 rounded-lg">
              <span>Total</span>
              <span>{formatRupiah(total)}</span>
            </div>
          </div>
        </div>

        {/* Tombol BAYAR SEKARANG */}
        {invoice.status === 'PENDING' && (
          <div className="flex justify-center mt-10">
            <button
              onClick={goToPaymentPage}
              className="bg-amber-600 text-white px-10 py-4 rounded-xl text-xl font-bold shadow-xl hover:bg-amber-700"
            >
              BAYAR SEKARANG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
