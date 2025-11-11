import { useState } from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react'; // Benar: Import dari Inertia
import { Search, MapPin, Star, Heart } from 'lucide-react';

// --- PERBAIKAN 2: Path impor diubah ke 'components' (lowercase 'c') ---
// Ini agar konsisten dengan file shadcn/ui Anda yang lain (misal: badge.jsx)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
// -----------------------------------------------------------------

// --- PERBAIKAN 1: Menambahkan default value '[]' untuk 'vendors' ---
// Ini akan memperbaiki error "Cannot read properties of undefined (reading 'length')"
export default function Dashboard({ auth, vendors = [] }) {
  
  // Kita simpan state untuk search bar
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('location');

  const handleSearch = () => {
    console.log('Searching for:', searchQuery, 'type:', searchType)
    // TODO: Implement search functionality
  }

  return (
    <CustomerLayout auth={auth}>
      <Head title="Temukan Vendor Pernikahan Impian Anda" />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-100 via-yellow-50 to-amber-50 py-20 px-4 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-400 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-300 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-black mb-6 bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 bg-clip-text text-transparent leading-tight tracking-wide font-light drop-shadow-sm">
            Temukan Vendor
            <br />
            <span className="font-semibold text-6xl md:text-8xl bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-700 bg-clip-text text-transparent">
              Pernikahan Impian
            </span>
            <br />
            <span className="text-4xl md:text-6xl font-light text-gray-700">
              Anda
            </span>
          </h1>
          <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
            Platform direktori wedding organizer terlengkap di Indonesia
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-yellow-200 p-3">
              <div className="flex-1 flex gap-2">
                <Button
                  variant={searchType === 'location' ? 'default' : 'outline'}
                  onClick={() => setSearchType('location')}
                  className={`px-4 py-2 ${searchType === 'location' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black shadow-md' : 'text-gray-600 hover:text-yellow-700 hover:bg-yellow-50'}`}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Lokasi
                </Button>
                <Button
                  variant={searchType === 'name' ? 'default' : 'outline'}
                  onClick={() => setSearchType('name')}
                  className={`px-4 py-2 ${searchType === 'name' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black shadow-md' : 'text-gray-600 hover:text-yellow-700 hover:bg-yellow-50'}`}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Nama WO
                </Button>
              </div>
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder={searchType === 'location' ? 'Masukkan kota atau provinsi...' : 'Masukkan nama wedding organizer...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white/80"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  onClick={handleSearch}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  CARI
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vendors Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-yellow-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-black mb-4">
              Vendor Pilihan Kami
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
          </div>
          
          {/* Karena 'vendors' sekarang default-nya '[]', .length tidak akan crash */}
          {vendors.length === 0 ? (
            <p className="text-center text-gray-500">
                Tidak ada vendor yang disetujui saat ini.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {vendors.map((vendor) => (
                // --- PERBAIKAN 3: Menggunakan path URL yang dinamis ---
                <Link key={vendor.id} href={`/vendors/${vendor.id}`}>
                  <Card className="group cursor-pointer border border-gray-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm hover:bg-white">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        {/* Logo / Gambar */}
                        <div className="w-20 h-20 mb-4 rounded-full overflow-hidden bg-gradient-to-br from-yellow-100 to-yellow-200 p-1">
                          <div className="w-full h-full rounded-full overflow-hidden bg-white">
                            <img
                              src={vendor.coverPhoto || `https://placehold.co/100x100/FFF0C9/C7991F?text=${vendor.name[0]}`}
                              alt={vendor.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        {/* Vendor Info */}
                        <h3 className="text-lg font-semibold text-black mb-1 group-hover:text-yellow-700 transition-colors">
                          {vendor.name}
                        </h3>
                        
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {vendor.city}
                        </div>
                        
                        {/* Rating & Review Count (Dikom-comment karena 'vendors' mungkin belum punya data ini) */}
                        {/* <div className="flex items-center gap-1 mb-3">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-black">{vendor.rating}</span>
                          <span className="text-sm text-gray-500">({vendor.reviewCount})</span>
                        </div>
                        */}
                        
                        {/* Description */}
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {vendor.description}
                        </p>
                        
                        {/* Tombol Favorite (Dikom-comment karena 'useFavorites' belum dimigrasi) */}
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          className={`mt-4 ...`}
                          onClick={(e) => { e.preventDefault() ... }}
                        >
                          <Heart ... />
                        </Button>
                        */}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          
          {/* View All Button */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="px-8 py-3 border-yellow-400 text-yellow-700 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-yellow-600 hover:text-black hover:border-transparent font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Lihat Semua Vendor
            </Button>
          </div>
        </div>
      </section>
      
    </CustomerLayout>
  )
} 