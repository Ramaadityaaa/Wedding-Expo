import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Link } from '@inertiajs/react';
import { Mail, Phone, MapPin } from 'lucide-react';
 
export default function CustomerLayout({ auth, children }) {
  
  const favorites = auth.user ? auth.user.favorites : []; 
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> 

      <main>
        {children}
      </main>

      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Kolom 1 */}
            <div>
              <Link href="/" className="flex items-center mb-4">
                <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold shadow-md rounded-lg">
                  <div className="text-xl font-serif tracking-wide leading-tight">
                    Wedding<span className="font-black">Expo</span>
                  </div>
                </div>
              </Link>
              <p className="text-gray-400 text-sm">
                Platform direktori wedding organizer terlengkap di Indonesia.
              </p> 
            </div>
            
            {/* Kolom 2 */}
            <div>
              <h4 className="font-semibold text-white mb-4">Layanan</h4>
              <ul className="space-y-2">
                <li><Link href="/#vendors" className="text-gray-400 hover:text-yellow-400 text-sm">Cari Vendor</Link></li>
                <li><Link href="/#inspiration" className="text-gray-400 hover:text-yellow-400 text-sm">Inspirasi</Link></li>
                
                {/* --- PERBAIKAN: Link footer ke Tentang --- */}
                <li><Link href="/#about" className="text-gray-400 hover:text-yellow-400 text-sm">Tentang Kami</Link></li>
                {/* ---------------------------------------- */}
              </ul>
            </div>
            
            {/* Kolom 3 */}
            <div>
              <h4 className="font-semibold text-white mb-4">Vendor</h4>
              <ul className="space-y-2">
                <li><Link href="/register/vendor" className="text-gray-400 hover:text-yellow-400 text-sm">Daftar Vendor</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-yellow-400 text-sm">Login Vendor</Link></li>
              </ul>
            </div>
            
            {/* Kolom 4 */}
            <div>
              <h4 className="font-semibold text-white mb-4">Kontak</h4>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-yellow-400" />
                  <a href="mailto:info@weddingexpo.id" className="text-gray-400 hover:text-yellow-400 text-sm">
                    info@weddingexpo.id
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-yellow-400" />
                  <span className="text-gray-400 text-sm">+62 21 1234 5678</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-yellow-400" />
                  <span className="text-gray-400 text-sm">Jakarta, Indonesia</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2024 WeddingExpo. All rights reserved.
            </p> 
          </div>
        </div>
      </footer>
    </div>
  );
}