import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { Link } from '@inertiajs/react'

export default function Navbar() {
  const favorites = [] 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const handleNavClick = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-gradient-to-r from-yellow-50 via-white to-yellow-50 border-b border-yellow-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <div className="md:hidden mr-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-black hover:text-yellow-700 hover:bg-yellow-50 p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>

            <Link href="/" className="flex items-center">
              <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold shadow-md rounded-lg transition-all duration-300 cursor-pointer">
                <div className="text-xl md:text-2xl font-serif tracking-wide leading-tight">
                  Wedding<span className="font-black">Expo</span>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Center: Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-black hover:text-yellow-700 font-medium transition-colors">
              Beranda
            </Link>
            
            {/* Link Scroll ke Vendor */}
            <Link href="/#vendors" className="text-black hover:text-yellow-700 font-medium transition-colors">
              Vendor
            </Link>

            <Link href="/favorites" className="flex items-center text-black hover:text-yellow-700 font-medium transition-colors">
              Favorit
              {favorites.length > 0 && (
                <span className="ml-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs px-2 py-0.5 rounded-full shadow-sm">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Saya ubah Inspirasi ke hash link juga untuk keamanan, nanti Anda bisa buat sectionnya */}
            <Link href="/#inspiration" className="text-black hover:text-yellow-700 font-medium transition-colors">
              Inspirasi
            </Link>

            {/* --- PERBAIKAN: Link ke section Tentang di halaman yang sama --- */}
            <Link href="/#about" className="text-black hover:text-yellow-700 font-medium transition-colors">
              Tentang
            </Link>
            {/* ------------------------------------------------------------ */}
          </div>
          
          {/* Right: CTA */}
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" className="text-black hover:text-yellow-700 hover:bg-yellow-50">
                Login
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold shadow-md px-2">
                Register
              </Button>
            </div>
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-black hover:text-yellow-700 hover:bg-yellow-50 px-2">
                Login
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold shadow-md px-2">
                Register
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-yellow-200 shadow-lg">
            <div className="px-4 py-3 space-y-3">
              <Link href="/" onClick={handleNavClick} className="block text-black hover:text-yellow-700 font-medium py-2">
                Beranda
              </Link>
              <Link href="/#vendors" onClick={handleNavClick} className="block text-black hover:text-yellow-700 font-medium py-2">
                Vendor
              </Link>
              <Link href="/favorites" onClick={handleNavClick} className="flex items-center text-black hover:text-yellow-700 font-medium py-2">
                Favorit
              </Link>
              <Link href="/#inspiration" onClick={handleNavClick} className="block text-black hover:text-yellow-700 font-medium py-2">
                Inspirasi
              </Link>
              
              {/* Update Mobile Link juga */}
              <Link href="/#about" onClick={handleNavClick} className="block text-black hover:text-yellow-700 font-medium py-2">
                Tentang
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}