import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, Calendar, CheckCircle, Package, User, Building, Landmark } from 'lucide-react';

// Data mock disesuaikan berdasarkan Invoice (termasuk PPN 11% dan diskon)
const mockReceiptData = {
  status: 'success',
  data: {
    vendorName: 'PT. Vendor Cemerlang',
    vendorAddress: 'Jl. Digital No. 12, Jakarta',
    vendorEmail: 'billing@vendorcemerlang.co.id',
    invoiceNumber: 'INV-202501-00123',
    transactionId: 'TXN-PAID-98765', // ID Transaksi pembayaran (berbeda dari No. Invoice)
    customerName: 'Pelanggan Premium Yth.',
    customerAddress: 'Jl. Sukses No. 45, Bandung',
    customerEmail: 'anda@example.com',
    paymentDate: '2025-01-18 11:30:00', // Tanggal pembayaran telah dilakukan
    validUntil: '2025-02-18', 
    subtotal: 250000,
    ppnRate: 0.11,
    ppnAmount: 27500, // 11% dari 250.000
    totalPaid: 277500,
    paymentMethod: 'Bank Transfer (BCA)',
    lineItems: [
      { description: 'Langganan Membership Premium (Bulanan)', qty: 1, unitPrice: 250000, total: 250000, type: 'item' },
      { description: 'Diskon Pemasangan Awal', qty: 1, unitPrice: 0, total: 0, type: 'discount' },
    ],
  }
};

const App = () => {
  const [receipt, setReceipt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const formatRupiah = useCallback((amount) => {
    // Memastikan angka dikonversi dengan benar sebelum format
    const number = typeof amount === 'number' ? amount : parseFloat(amount);
    if (isNaN(number)) return 'Rp 0';
    return 'Rp ' + number.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }, []);
  
  const showAlert = useCallback((message) => {
    setAlertMessage(message);
    setIsAlertVisible(true);
    setTimeout(() => setIsAlertVisible(false), 3000); // Sembunyikan setelah 3 detik
  }, []);

  // Fungsi ini mensimulasikan panggilan API ke backend Laravel
  useEffect(() => {
    // Di aplikasi nyata, Anda akan melakukan fetch ke API Laravel di sini.

    // Simulasi penundaan 1 detik untuk loading
    const timer = setTimeout(() => {
      if (mockReceiptData.status === 'success') {
        setReceipt(mockReceiptData.data);
      } else {
        setError('Data receipt tidak ditemukan.');
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-xl font-medium text-gray-700">Memuat Bukti Pembayaran...</div>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
        <div className="text-xl font-medium text-white p-4 rounded-lg bg-red-600">{error || 'Data tidak tersedia.'}</div>
      </div>
    );
  }

  const gradientHeader = "bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500";
  const gradientButton = "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600";
  
  // Pemformatan Tanggal Bayar tanpa jam
  const formattedDate = new Date(receipt.paymentDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  const formattedValidUntil = new Date(receipt.validUntil).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      {/* Custom Alert Box */}
      {isAlertVisible && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-opacity duration-300">
          {alertMessage}
        </div>
      )}

      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-xl overflow-hidden transform transition-all duration-300">
        
        {/* Header Emas/Oranye */}
        <div className={`p-6 sm:p-8 text-white ${gradientHeader} flex justify-between items-start`}>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              BUKTI PEMBAYARAN
            </h1>
            <p className="mt-2 text-yellow-100 text-sm sm:text-base">
              Pembayaran No. Invoice **{receipt.invoiceNumber}** telah dikonfirmasi.
            </p>
          </div>
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-300" />
        </div>
        
        {/* Detail Perusahaan & Pelanggan */}
        <div className="p-6 sm:p-8 pb-4 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Vendor Info */}
            <div>
                <div className="flex items-center space-x-2 mb-2 text-gray-800">
                    <Building className="w-5 h-5 text-orange-500" />
                    <h2 className="text-sm font-semibold uppercase">Dibayar Kepada</h2>
                </div>
                <p className="font-bold text-lg text-gray-900">{receipt.vendorName}</p>
                <p className="text-sm text-gray-600">{receipt.vendorAddress}</p>
                <p className="text-sm text-gray-600">Email: {receipt.vendorEmail}</p>
            </div>
            {/* Customer Info */}
            <div className='sm:text-right'>
                <div className="flex items-center justify-start sm:justify-end space-x-2 mb-2 text-gray-800">
                    <User className="w-5 h-5 text-orange-500" />
                    <h2 className="text-sm font-semibold uppercase">Dibayar Oleh</h2>
                </div>
                <p className="font-bold text-lg text-gray-900">{receipt.customerName}</p>
                <p className="text-sm text-gray-600">{receipt.customerAddress}</p>
                <p className="text-sm text-gray-600">Email: {receipt.customerEmail}</p>
            </div>
          </div>
        </div>

        {/* Detail Transaksi & Tanggal */}
        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-200">
            <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                <Landmark className="w-5 h-5 text-yellow-600" />
                <div>
                    {/* ID Pembayaran diubah menjadi Nomor Invoice */}
                    <p className="text-xs text-gray-500">Nomor Invoice</p>
                    <p className="font-medium text-gray-800 text-sm">{receipt.invoiceNumber}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                <Calendar className="w-5 h-5 text-yellow-600" />
                <div>
                    <p className="text-xs text-gray-500">Tanggal Bayar</p>
                    {/* Pemformatan Tanggal Bayar tanpa jam */}
                    <p className="font-medium text-gray-800 text-sm">{formattedDate}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-yellow-600" />
                <div>
                    <p className="text-xs text-gray-500">Metode Bayar</p>
                    <p className="font-medium text-gray-800 text-sm">{receipt.paymentMethod}</p>
                </div>
            </div>
        </div>


        {/* Itemized List / Rincian Tagihan */}
        <div className="p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Rincian Pembelian</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-orange-500 text-white text-left text-sm font-semibold uppercase tracking-wider">
                            <th className="px-6 py-3 w-3/5 rounded-tl-lg">Deskripsi</th>
                            <th className="px-6 py-3 w-1/5 text-center">Qty</th>
                            <th className="px-6 py-3 w-1/5 text-right rounded-tr-lg">Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {receipt.lineItems.map((item, index) => (
                            <tr key={index} className={item.type === 'discount' ? 'bg-yellow-50 text-green-700' : 'text-gray-900'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{item.qty}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right">
                                    {/* Diskon = -Rp 0, Item > 0 */}
                                    {item.type === 'discount' ? '-Rp 0' : formatRupiah(item.total)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Tambahan: Langganan Berakhir */}
            <p className="mt-4 text-sm font-semibold text-gray-700">
                Langganan Anda berlaku hingga: <span className="text-orange-600">{formattedValidUntil}</span>
            </p>

            {/* Total Summary */}
            <div className="flex justify-end mt-6">
                <div className="w-full sm:w-1/2 space-y-2">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-medium">{formatRupiah(receipt.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 border-b pb-2 border-dashed">
                        <span>PPN ({receipt.ppnRate * 100}%)</span>
                        <span className="font-medium">{formatRupiah(receipt.ppnAmount)}</span>
                    </div>
                    
                    {/* Total */}
                    <div className={`flex justify-between pt-3 border-t border-gray-300`}>
                        <span className="text-xl font-bold text-gray-800">TOTAL DIBAYAR</span>
                        <span className={`text-2xl font-extrabold text-orange-600 ${gradientButton} bg-clip-text text-transparent`}>
                            {formatRupiah(receipt.totalPaid)}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <p className="text-xs text-gray-500">
              {/* Pesan akhir lebih ringkas karena sudah ada detail di atas */}
              Dokumen ini adalah bukti pembayaran yang sah.
            </p>
            <button
              className={`px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out ${gradientButton} text-sm`}
              onClick={() => showAlert(`Receipt No. ${receipt.transactionId} berhasil diunduh (simulasi).`)}
            >
              <span className="flex items-center">
                <Package className="w-4 h-4 mr-2" /> Unduh PDF
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;