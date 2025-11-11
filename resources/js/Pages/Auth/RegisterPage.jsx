// TAMBAHKAN Link DI SINI
import { Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaFacebookF, FaGoogle, FaLinkedinIn } from 'react-icons/fa';

const RegisterPage = () => {
  // ... (kode state dan handleSubmit Anda tetap sama) ...
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register attempt:', { name, email, password, confirmPassword });
    // Contoh: Inertia.post('/register', { name, email, password, password_confirmation: confirmPassword });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden lg:grid lg:grid-cols-2">

        {/* --- Kolom Kiri (Panel Overlay) --- */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-center rounded-l-2xl">
          <h1 className="text-4xl font-bold font-serif mb-4">WeddingExpo</h1>
          <p className="text-lg mb-8">
            Platform wedding organizer yang menyediakan vendor terbaik dengan harga terjangkau.
          </p>
          
          {/* UBAH <a> MENJADI <Link> */}
          <Link 
            href="/login" // <-- Gunakan path
            className="py-3 px-8 border-2 border-white rounded-full text-base font-medium hover:bg-white hover:text-yellow-600 transition-all"
          >
            Login
          </Link>
        </div>
        
        {/* --- Kolom Kanan (Form Registrasi) --- */}
        <div className="p-8 lg:p-12">
          
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-4">Buat Akun</h2>
          
          {/* ... (Ikon sosial media tetap <a>) ... */}
          <div className="flex justify-center gap-4 my-4">
            <a href="#" aria-label="Daftar dengan Facebook" className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Daftar dengan Google" className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
              <FaGoogle />
            </a>
            <a href="#" aria-label="Daftar dengan LinkedIn" className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
              <FaLinkedinIn />
            </a>
          </div>
          
          <p className="text-center text-gray-500 text-sm mb-6">atau daftar dengan email Anda</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* ... (Semua input form Anda tetap sama) ... */}
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors" />
            </div>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors" />
            </div>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors" />
            </div>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="password" placeholder="Konfirmasi Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors" />
            </div>

            {/* Tombol Daftar */}
            <div className="pt-2">
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all">
                Daftar
              </button>
            </div>
          </form>
        </div>
        
        {/* Tampilan Mobile untuk Link Login */}
        <div className="lg:hidden text-center p-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
            <p className="text-sm text-gray-600">
              Sudah punya akun?
              
              {/* UBAH <a> MENJADI <Link> */}
              <Link href="/login" className="font-medium text-yellow-600 hover:text-yellow-700 ml-1">
                Login di sini
              </Link>
            </p>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;