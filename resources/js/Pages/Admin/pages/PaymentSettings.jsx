import React from 'react';
import { PRIMARY_COLOR } from '../data/constants';

const PaymentSettings = ({ paymentSettings = {}, openPaymentEdit, setPaymentSettings, handleQrisUpload, handleSavePayment, isPaymentEditOpen, paymentForm, handlePaymentFormQrisUpload, setIsPaymentEditOpen, setPaymentForm }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Payment / Invoice Settings</h1>
      <p className="text-gray-500 mb-6">Atur nomor rekening dan QRIS yang akan muncul di invoice.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-2xl border border-amber-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-amber-700">Nomor Rekening</h3>
              <p className="text-sm text-gray-500 mt-1">Nomor rekening yang akan tercetak di invoice.</p>
            </div>
            <div className="text-sm text-gray-400">Default</div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-600 mb-2">Rekening Saat Ini</div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-800 font-medium">{paymentSettings.bankAccount || <span className="text-gray-400 italic">Belum diisi</span>}</div>
              <div className="flex space-x-2">
                <button onClick={openPaymentEdit} className="py-2 px-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400 text-white font-semibold shadow">Edit</button>
                <button onClick={() => setPaymentSettings(prev => ({ ...prev, bankAccount: '' }))} className="py-2 px-3 rounded-full border border-amber-100 text-amber-700">Hapus</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-amber-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-amber-700">QRIS</h3>
              <p className="text-sm text-gray-500 mt-1">Gambar QRIS yang akan tampil di invoice (upload terpisah dari rekening).</p>
            </div>
            <div className="text-sm text-gray-400">Default</div>
          </div>

          <div className="mt-4">
            <div className="flex items-center space-x-4">
              {paymentSettings.qrisImage ? (
                <div className="w-28 h-28 rounded-lg overflow-hidden border">
                  <img src={paymentSettings.qrisImage} alt="QRIS" className="object-contain w-full h-full" />
                </div>
              ) : (
                <div className="w-28 h-28 rounded-lg border flex items-center justify-center text-gray-400 italic text-sm">Belum ada QRIS</div>
              )}

              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-2">Upload QRIS Baru</div>
                <input type="file" accept="image/*" onChange={(e) => handleQrisUpload(e.target.files[0])} className="block text-sm text-gray-600" />
                <div className="mt-3 flex space-x-2">
                  <button onClick={() => setPaymentSettings(prev => ({ ...prev, qrisImage: null }))} className="py-2 px-3 rounded-full border border-amber-100 text-amber-700">Hapus</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button onClick={handleSavePayment} className="py-2 px-4 rounded-full font-bold text-white bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400">Simpan Pengaturan</button>
      </div>
    </div>
  );
};

export default PaymentSettings;
