import React, { useState } from 'react'
import { Link, useForm } from '@inertiajs/react'
import { FaUser, FaEnvelope, FaLock, FaFacebookF, FaGoogle, FaLinkedinIn, FaEye, FaEyeSlash } from 'react-icons/fa'

export default function RegisterPage() {
  // State untuk visibility password
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // POST ke route('register') (Breeze + Ziggy)
    // Catatan: asumsi fungsi route() tersedia di lingkungan Inertia
    post(route('register'))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden lg:grid lg:grid-cols-2">
        {/* Panel kiri (Kolom Overlay/Iklan - Hanya Desktop) */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-center rounded-l-2xl">
          <h1 className="text-4xl font-bold font-serif mb-4">WeddingExpo</h1>
          <p className="text-lg mb-8">
            Platform wedding organizer yang menyediakan vendor terbaik dengan harga terjangkau.
          </p>
          <Link
            href={route('login')}
            className="py-3 px-8 border-2 border-white rounded-full text-base font-medium hover:bg-white hover:text-yellow-600 transition-all"
          >
            Login
          </Link>
        </div>

        {/* Form register (Panel kanan) */}
        <div className="p-8 lg:p-12">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-4">Buat Akun</h2>

          <div className="flex justify-center gap-4 my-4">
            <a 
              href="#" 
              aria-label="Daftar dengan Facebook"
              className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <FaFacebookF />
            </a>
            <a 
              href="#" 
              aria-label="Daftar dengan Google"
              className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <FaGoogle />
            </a>
            <a 
              href="#" 
              aria-label="Daftar dengan LinkedIn"
              className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <FaLinkedinIn />
            </a>
          </div>

          <p className="text-center text-gray-500 text-sm mb-6">atau daftar dengan email Anda</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama */}
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
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
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Konfirmasi Password */}
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmation ? "text" : "password"}
                placeholder="Konfirmasi Password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmation(!showConfirmation)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showConfirmation ? "Hide confirmation password" : "Show confirmation password"}
              >
                {showConfirmation ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={processing}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all disabled:opacity-60"
              >
                {processing ? 'Memproses...' : 'Daftar'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer mobile (Di dalam div utama) */}
        <div className="lg:hidden text-center p-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
          <p className="text-sm text-gray-600">
            Sudah punya akun?
            <Link href={route('login')} className="font-medium text-yellow-600 hover:text-yellow-700 ml-1">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}