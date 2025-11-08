'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { useState } from 'react'

export default function Navbar() {
  const { favorites } = useFavorites()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-yellow-50 via-white to-yellow-50 border-b border-yellow-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo */}
          <div className="flex items-center">
            {/* Mobile Menu Button - Only visible on mobile */}
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

            {/* Logo - Always visible */}
            <Link href="/" className="flex items-center">
              <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold shadow-md rounded-lg transition-all duration-300 cursor-pointer">
                <div className="text-xl md:text-2xl font-serif tracking-wide leading-tight">
                  Wedding<span className="font-black">Expo</span>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Menu Items - Center */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-black hover:text-yellow-700 font-medium transition-colors"
            >
              Beranda
            </Link>
            <Link 
              href="/vendors" 
              className="text-black hover:text-yellow-700 font-medium transition-colors"
            >
              Vendor
            </Link>
            <Link 
              href="/favorites" 
              className="flex items-center text-black hover:text-yellow-700 font-medium transition-colors"
            >
              Favorit
              {favorites.length > 0 && (
                <span className="ml-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs px-2 py-0.5 rounded-full shadow-sm">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link 
              href="/inspiration" 
              className="text-black hover:text-yellow-700 font-medium transition-colors"
            >
              Inspirasi
            </Link>
            <Link 
              href="/about" 
              className="text-black hover:text-yellow-700 font-medium transition-colors"
            >
              Tentang
            </Link>
          </div>
          
          {/* Right Section: CTA Buttons */}
          <div className="flex items-center space-x-2">
            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-black hover:text-yellow-700 hover:bg-yellow-50"
              >
                Masuk
              </Button>
              <Button 
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold shadow-md"
              >
                Daftar Vendor
              </Button>
            </div>

            {/* Mobile CTA Buttons */}
            <div className="md:hidden flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-black hover:text-yellow-700 hover:bg-yellow-50 px-2"
              >
                Masuk
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold shadow-md px-2"
              >
                Daftar
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-yellow-200 shadow-lg">
            <div className="px-4 py-3 space-y-3">
              <Link 
                href="/" 
                className="block text-black hover:text-yellow-700 font-medium transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link 
                href="/vendors" 
                className="block text-black hover:text-yellow-700 font-medium transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Vendor
              </Link>
              <Link 
                href="/favorites" 
                className="flex items-center text-black hover:text-yellow-700 font-medium transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Favorit
                {favorites.length > 0 && (
                  <span className="ml-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs px-2 py-0.5 rounded-full shadow-sm">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link 
                href="/inspiration" 
                className="block text-black hover:text-yellow-700 font-medium transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Inspirasi
              </Link>
              <Link 
                href="/about" 
                className="block text-black hover:text-yellow-700 font-medium transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tentang
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}