import React from 'react';  
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react'; 
import Navbar from '@/components/Navbar';
import Footer from '@/Components/Footer'; 

export default function Dashboard({ auth, vendors = [] }) {
  const user = auth?.user ?? null;

  // Logika pencarian dan filter vendor
  const [searchQuery, setSearchQuery] = React.useState({
    name: '',
    city: '',
    filter: 'name'  // Default filter adalah "Nama Vendor"
  });

  const handleSearchChange = (e) => {
    setSearchQuery({
      ...searchQuery,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterChange = (e) => {
    setSearchQuery({
      ...searchQuery,
      filter: e.target.value
    });
  };

  const filteredVendors = vendors.filter((vendor) => {
    const query = searchQuery.filter === 'name' ? vendor.name : vendor.city;
    const searchName = searchQuery.filter === 'name' ? searchQuery.name : searchQuery.city;
    return query.toLowerCase().includes(searchName.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Temukan Vendor Pernikahan Impian Anda" />

      {/* Navbar */}
      <Navbar auth={auth} user={user} />

      <main>
        {/* 1. Hero Section: Gradasi Kuning ke Kuning Pucat (yellow-50) */}
        <section className="relative bg-gradient-to-b from-yellow-100 to-yellow-50 py-24 md:py-32 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-400 rounded-full filter blur-3xl opacity-30"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400 rounded-full filter blur-3xl opacity-30"></div>
          </div>
          <div className="relative max-w-6xl mx-auto text-center">
            <h1 className="font-sans text-yellow-900 mb-6 leading-relaxed drop-shadow-md uppercase tracking-widest">
              <span className="text-4xl md:text-5xl font-light text-yellow-800">Temukan Vendor</span>
              <br />
              <span className="font-extrabold text-5xl md:text-7xl bg-gradient-to-r from-amber-600 to-yellow-700 bg-clip-text text-transparent drop-shadow-lg">
                Pernikahan Impian Anda
              </span>
            </h1>
            <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
              Platform direktori wedding organizer terlengkap di Indonesia
            </p>

            {/* Pencarian Vendor (Minimalis & Elegan) */}
            <div className="max-w-3xl mx-auto mb-8 mt-8">
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full shadow-xl p-1.5">
                {/* Dropdown Filter (Jarak Panah Diperbaiki) */}
                <select
                  name="filter"
                  value={searchQuery.filter}
                  onChange={handleFilterChange}
                  className="py-2 pl-4 **pr-8** rounded-full bg-white text-gray-700 w-auto font-medium focus:ring-yellow-500 focus:ring-1 border-0 appearance-none bg-no-repeat bg-[length:1.25rem] **bg-[position:right_1rem_center]** cursor-pointer"
                  // Ikon kustom SVG untuk panah ke bawah
                  style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23d9a700' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>\")" }}
                >
                  <option value="name">Vendor</option>
                  <option value="city">Kota</option>
                </select>

                {/* Input Text (Borderless) */}
                <input
                  type="text"
                  name={searchQuery.filter === 'name' ? "name" : "city"} 
                  value={searchQuery.filter === 'name' ? searchQuery.name : searchQuery.city}
                  onChange={handleSearchChange}
                  placeholder={searchQuery.filter === 'name' ? "Cari Nama Vendor..." : "Cari Nama Kota..."}
                  className="py-2 px-4 w-full text-gray-800 bg-transparent border-0 focus:ring-0 placeholder-gray-500"
                />

                {/* Search Button (Bulat dengan Gradasi Emas) */}
                <button className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full shadow-lg hover:shadow-xl hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 flex-shrink-0">
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Featured Vendors Section: Gradasi Kuning Pucat (yellow-50) ke Putih (white) */}
        <section
          id="vendors"
          className="py-16 px-4 bg-gradient-to-b from-yellow-50 to-white scroll-mt-24"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif text-black mb-4">Vendor Pilihan Kami</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
            </div>

            {filteredVendors.length === 0 ? (
              <p className="text-center text-gray-500">Tidak ada vendor yang ditampilkan saat ini.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredVendors.map((vendor) => (
                  <Link key={vendor.id} href={`/vendors/${vendor.id}`}>
                    <div className="group cursor-pointer border border-gray-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm hover:bg-white h-full">
                      <div className="p-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-20 h-20 mb-4 rounded-full overflow-hidden bg-gradient-to-br from-yellow-100 to-yellow-200 p-1">
                            <div className="w-full h-full rounded-full overflow-hidden bg-white">
                              <img
                                src={
                                  vendor.coverPhoto ||
                                  `https://placehold.co/100x100/FFF0C9/C7991F?text=${vendor.name ? vendor.name[0] : 'V'}`
                                }
                                alt={vendor.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-black mb-1 group-hover:text-yellow-700 transition-colors">
                            {vendor.name}
                          </h3>
                          <div className="flex items-center text-gray-600 text-sm mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-4 h-4 mr-1"
                            >
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {vendor.city || 'Lokasi'}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{vendor.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link href="/#vendors">
                <Button
                  variant="outline"
                  className="px-8 py-3 border-yellow-400 text-yellow-700 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-yellow-600 hover:text-black hover:border-transparent font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Lihat Semua Vendor
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 3. Tentang WeddingExpo Section: Gradasi Putih (white) ke Abu Pucat (gray-50) */}
        <section
          id="about"
          className="py-16 px-4 bg-gradient-to-b from-white to-gray-50 scroll-mt-24" 
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                Tentang <span className="text-yellow-600">WeddingExpo</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                WeddingExpo adalah platform terpercaya yang menghubungkan calon
                pengantin dengan ribuan vendor pernikahan profesional di
                seluruh Indonesia.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Kami memahami bahwa pernikahan adalah momen sekali seumur
                hidup. Oleh karena itu, kami berdedikasi untuk memudahkan Anda
                dalam merencanakan pernikahan impian, mulai dari pemilihan
                lokasi, katering, hingga dokumentasi.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <h4 className="text-2xl font-bold text-yellow-700">1000+</h4>
                  <p className="text-sm text-gray-600">Vendor Terdaftar</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <h4 className="text-2xl font-bold text-yellow-700">50+</h4>
                  <p className="text-sm text-gray-600">Kota Dijangkau</p>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full bg-yellow-200 rounded-2xl transform rotate-3"></div>
                <img
                  src="https://placehold.co/600x400/FFF0C9/C7991F?text=About+Us+Wedding"
                  alt="Tentang WeddingExpo"
                  className="relative rounded-2xl shadow-lg w-full object-cover h-80"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}