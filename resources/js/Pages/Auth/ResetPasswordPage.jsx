import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { FaEnvelope } from 'react-icons/fa';

const ResetPasswordPage = ({ status }) => {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route('password.email'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden lg:grid lg:grid-cols-2">

        {/* --- Kolom Kiri (Form) --- */}
        <div className="p-8 lg:p-12">

          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-4">Lupa Password?</h2>

          <p className="text-center text-gray-500 text-sm mb-6">
            Jangan khawatir. Masukkan email Anda dan kami akan kirimkan link untuk reset password.
          </p>

          {/* Status sukses dari Laravel */}
          {status && (
            <div className="text-center text-sm mb-4 text-green-600 font-medium">
              {status}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Input Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
              />
            </div>

            {/* Error email (tidak mengubah tampilan besar) */}
            {errors.email && (
              <div className="text-center text-sm text-red-600">
                {errors.email}
              </div>
            )}

            {/* Tombol Kirim Link */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={processing}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all disabled:opacity-60"
              >
                {processing ? 'Mengirim...' : 'Kirim Link Reset'}
              </button>
            </div>
          </form>
        </div>

        {/* --- Kolom Kanan (Panel Overlay) --- */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-center rounded-r-2xl">
          <h1 className="text-4xl font-bold font-serif mb-4">WeddingExpo</h1>
          <p className="text-lg mb-8">
            Ingat password Anda? Kembali dan login untuk melanjutkan.
          </p>

          <Link
            href="/login"
            className="py-3 px-8 border-2 border-white rounded-full text-base font-medium hover:bg-white hover:text-yellow-600 transition-all"
          >
            Login
          </Link>
        </div>

        {/* Tampilan Mobile untuk Link Login */}
        <div className="lg:hidden text-center p-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
          <p className="text-sm text-gray-600">
            Ingat passwordnya?
            <Link href="/login" className="font-medium text-yellow-600 hover:text-yellow-700 ml-1">
              Login di sini
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ResetPasswordPage;
