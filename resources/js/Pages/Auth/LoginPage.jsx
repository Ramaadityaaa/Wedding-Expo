// TAMBAHKAN Link DI SINI
import { Link } from '@inertiajs/react'; 
import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaFacebookF, FaGoogle, FaLinkedinIn } from 'react-icons/fa';

const LoginPage = () => {
  // ... (kode state dan handleSubmit Anda tetap sama) ...
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // Contoh: Inertia.post('/login', { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden lg:grid lg:grid-cols-2">

        {/* --- Kolom Kiri (Form Login) --- */}
        <div className="p-8 lg:p-12">
          {/* ... (kode form Anda) ... */}
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-4">Login</h2>
          
          {/* Ikon sosial biarkan <a> karena ini bukan link Inertia */}
          <div className="flex justify-center gap-4 my-4">
            <a href="#" aria-label="Login dengan Facebook" className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Login dengan Google" className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
              <FaGoogle />
            </a>
            <a href="#" aria-label="Login dengan LinkedIn" className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
              <FaLinkedinIn />
            </a>
          </div>
          
          <p className="text-center text-gray-500 text-sm mb-6">atau gunakan akun email Anda</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ... (Input Email & Password tetap sama) ... */}
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors" />
            </div>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors" />
            </div>

            {/* Remember Me & Lupa Password */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-gray-900">
                  Ingat saya
                </label>
              </div>
              
              {/* UBAH <a> MENJADI <Link> */}
              <Link 
                href="/forgot-password" // <-- Gunakan path
                className="font-medium text-yellow-600 hover:text-yellow-700"
              >
                Lupa password?
              </Link>
            </div>

            {/* Tombol Login */}
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all">
              Login
            </button>
          </form>
        </div>

        {/* --- Kolom Kanan (Panel Overlay) --- */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-center rounded-r-2xl">
          <h1 className="text-4xl font-bold font-serif mb-4">WeddingExpo</h1>
          <p className="text-lg mb-8">
            Platform wedding organizer yang menyediakan vendor terbaik dengan harga terjangkau.
          </p>
          
          {/* UBAH <a> MENJADI <Link> */}
          <Link 
            href="/register" // <-- Gunakan path
            className="py-3 px-8 border-2 border-white rounded-full text-base font-medium hover:bg-white hover:text-yellow-600 transition-all"
          >
            Daftar
          </Link>
        </div>
        
        {/* Tampilan Mobile untuk Link Daftar */}
        <div className="lg:hidden text-center p-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
            <p className="text-sm text-gray-600">
              Belum punya akun?
              
              {/* UBAH <a> MENJADI <Link> */}
              <Link href="/register" className="font-medium text-yellow-600 hover:text-yellow-700 ml-1">
                Daftar di sini
              </Link>
            </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;