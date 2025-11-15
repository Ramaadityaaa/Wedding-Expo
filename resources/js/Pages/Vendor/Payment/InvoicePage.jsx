import React, { useState, useEffect, useCallback } from 'react';
import { Download, Printer, CircleCheck, Loader } from 'lucide-react';

// Simulasi data yang akan dikirim dari backend Laravel
const mockInvoiceData = {
  invoiceId: 'INV-202501-00123',
  dateIssued: '2025-01-15',
  dueDate: '2025-02-14', // <-- Diperbarui: 30 hari setelah 2025-01-15
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
    {
      description: 'Langganan Membership Premium (Bulanan)',
      quantity: 1,
      unitPrice: 250000, // Rp 250.000
    },
    {
      description: 'Diskon Pemasangan Awal',
      quantity: 1,
      unitPrice: -0, // Diskon 0 untuk simulasi
    }
  ],
};

const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Fungsi baru untuk memformat tanggal menjadi format panjang Indonesia (e.g., 15 Januari 2025)
const formatDateLong = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
};

// Menghitung total dari item invoice
const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxRate = 0.11; // PPN 11%
  const taxAmount = subtotal * taxRate;
  const grandTotal = subtotal + taxAmount;
  return { subtotal, taxAmount, grandTotal };
};

// Komponen Utama
const App = () => {
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPayMessage, setShowPayMessage] = useState(false); // State untuk modal pembayaran
  
  const { subtotal, taxAmount, grandTotal } = invoice ? calculateTotals(invoice.items) : { subtotal: 0, taxAmount: 0, grandTotal: 0 };

  // Simulasi fetch data dari API Laravel
  const fetchInvoiceData = useCallback(async () => {
    // Di aplikasi nyata, Anda akan menggunakan fetch() atau axios di sini.
    // Contoh: const response = await fetch('/api/invoice/123');
    // const data = await response.json();
    
    // Simulasi loading 1 detik
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setInvoice(mockInvoiceData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchInvoiceData();
  }, [fetchInvoiceData]);

  // Handler untuk Print Invoice - Dihilangkan dari UI, tapi fungsi tetap ada jika dibutuhkan
  // const handlePrint = () => {
  //   window.print();
  // };
  
  // Handler untuk Pembayaran (Simulasi)
  const handlePay = () => {
      // Implementasi nyata: Arahkan ke halaman pembayaran atau panggil API pembayaran
      setShowPayMessage(true); // Tampilkan modal kustom
      // window.location.href = '/checkout/invoice/' + invoice.invoiceId;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader className="w-8 h-8 animate-spin text-amber-500" />
        <span className="ml-3 text-lg text-gray-700">Memuat Invoice...</span>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-600">Gagal memuat data invoice.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-['Inter']">
      
      {/* Tombol Aksi - HANYA TOMBOL DOWNLOAD PDF DITARUH DI SINI */}
      <div className="flex justify-end space-x-4 mb-6 print:hidden">
        
        {/* Tombol Download PDF (Tampil jika sudah LUNAS) */}
        {invoice.status === 'PAID' && (
            <button
              className="flex items-center px-4 py-2 text-white transition-colors duration-150 rounded-lg shadow-md bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-300"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </button>
        )}
      </div>

      {/* Kontainer Invoice Utama */}
      <div className="max-w-4xl p-8 mx-auto bg-white rounded-xl shadow-2xl border-t-8 border-amber-500">
        
        {/* Header Invoice */}
        <header className="flex flex-col justify-between pb-8 border-b-2 border-gray-100 md:flex-row">
          <div>
            <h1 className="text-4xl font-extrabold text-amber-700">INVOICE</h1>
            <p className="mt-1 text-sm text-gray-500">#{invoice.invoiceId}</p>
            {/* Tampilan Status */}
            {invoice.status === 'PAID' ? (
              <div className="flex items-center mt-3 text-lg font-semibold text-green-600">
                <CircleCheck className="w-5 h-5 mr-2 text-green-500 fill-green-100 stroke-green-600" />
                LUNAS
              </div>
            ) : (
              // Status PENDING/Belum Dibayar
              <div className="flex items-center mt-3 text-lg font-semibold text-red-700 bg-red-100/50 p-1 px-3 rounded-full border border-red-300">
                <span className="text-red-500 mr-2">•</span>
                BELUM DIBAYAR
              </div>
            )}
          </div>
          <div className="mt-4 text-right md:mt-0">
            <h2 className="text-xl font-bold text-gray-800">{invoice.vendor.name}</h2>
            <p className="text-sm text-gray-500">{invoice.vendor.address}</p>
            <p className="text-sm text-gray-500">{invoice.vendor.email}</p>
          </div>
        </header>

        {/* Informasi Tanggal & Pelanggan */}
        <section className="grid grid-cols-1 gap-6 py-8 md:grid-cols-3">
          {/* Tagihan Kepada */}
          <div>
            <p className="mb-2 text-sm font-semibold uppercase text-amber-600">Ditagihkan Kepada:</p>
            <p className="font-medium text-gray-800">{invoice.customer.name}</p>
            <p className="text-sm text-gray-600">{invoice.customer.address}</p>
            <p className="text-sm text-gray-600">{invoice.customer.email}</p>
          </div>
          {/* Detail Tanggal */}
          <div>
            <p className="mb-2 text-sm font-semibold uppercase text-amber-600">Tanggal Invoice:</p>
            <p className="text-sm text-gray-800">{formatDateLong(invoice.dateIssued)}</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold uppercase text-amber-600">Tanggal Jatuh Tempo:</p>
            <p className="text-sm font-medium text-red-500">{formatDateLong(invoice.dueDate)}</p>
          </div>
        </section>

        {/* Tabel Item Invoice */}
        <section className="mt-6">
          <div className="overflow-x-auto rounded-lg shadow-inner">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead>
                <tr className="text-white uppercase bg-amber-600">
                  <th className="px-4 py-3 font-semibold w-1/2">Deskripsi</th>
                  <th className="px-4 py-3 font-semibold text-right">Kuantitas</th>
                  <th className="px-4 py-3 font-semibold text-right">Harga Satuan</th>
                  <th className="px-4 py-3 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-yellow-50'}`}>
                    <td className="px-4 py-3 text-gray-700 font-medium">{item.description}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatRupiah(item.unitPrice)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">{formatRupiah(item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Ringkasan Total */}
        <section className="flex justify-end mt-8">
          <div className="w-full max-w-sm">
            {/* Subtotal */}
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-800">{formatRupiah(subtotal)}</span>
            </div>
            {/* PPN */}
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">PPN (11%):</span>
              <span className="font-medium text-gray-800">{formatRupiah(taxAmount)}</span>
            </div>
            {/* Grand Total */}
            <div 
                className="flex justify-between py-3 mt-4 text-xl rounded-lg shadow-md font-extrabold px-4"
                style={{
                    backgroundColor: invoice.status === 'PAID' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 140, 0, 0.3)', // Emas terang vs Oranye terang
                    color: invoice.status === 'PAID' ? 'rgb(180, 83, 9)' : 'rgb(190, 50, 0)', // Amber 800 vs deeper orange
                }}
            >
              <span>TOTAL {invoice.status === 'PAID' ? 'DIBAYAR' : 'TAGIHAN'}:</span>
              <span>{formatRupiah(grandTotal)}</span>
            </div>
          </div>
        </section>

        {/* Footer/Catatan & Tombol Pembayaran */}
        <footer className="pt-8 mt-12 border-t border-gray-200">
          <p className="mb-2 text-sm font-semibold uppercase text-amber-600">Catatan:</p>
          <p className="text-sm text-gray-600">Pembayaran harus dilakukan sebelum tanggal jatuh tempo. Jika Anda telah membayar, mohon abaikan tagihan ini atau hubungi tim penagihan kami.</p>

          {/* Tombol Pembayaran - Di dalam card, di bawah total (tampil jika PENDING) */}
          {invoice.status === 'PENDING' && (
              <div className="flex justify-center mt-6 print:hidden">
                  <button
                      onClick={handlePay}
                      className="flex items-center px-10 py-4 text-white transition-colors duration-150 rounded-xl shadow-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 focus:outline-none focus:ring-4 focus:ring-amber-300 text-xl font-bold tracking-wider uppercase"
                  >
                      BAYAR SEKARANG
                  </button>
              </div>
          )}

          <p className="mt-6 text-xs text-center text-gray-400">Invoice dibuat secara otomatis. Tanda tangan tidak diperlukan.</p>
        </footer>

      </div>

      {/* MODAL KUSTOM UNTUK SIMULASI PEMBAYARAN */}
      {showPayMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 print:hidden" onClick={() => setShowPayMessage(false)}>
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center border-t-8 border-amber-600" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-extrabold text-amber-700 mb-4">Gerbang Pembayaran</h3>
            <p className="text-gray-600 mb-6">Simulasi: Anda akan diarahkan ke layanan pembayaran untuk menyelesaikan tagihan sebesar **{formatRupiah(grandTotal)}**.</p>
            <p className="text-sm text-gray-500 mb-6">Terima kasih telah berlangganan Premium!</p>
            <button
              onClick={() => setShowPayMessage(false)}
              className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
            >
              Lanjutkan ke Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

/*
  Catatan untuk Developer:
  - Tombol 'Cetak Invoice' (bersama dengan handlePrint) telah dihapus dari bagian atas UI.
  - Hanya tombol 'Download PDF' (jika status PAID) yang tersisa di bagian atas.
  - Tanggal Jatuh Tempo (dueDate) di mockInvoiceData diatur menjadi 30 hari setelah Tanggal Invoice (dateIssued).
*/