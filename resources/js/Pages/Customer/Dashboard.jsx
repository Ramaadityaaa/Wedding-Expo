import { Head, Link, router } from "@inertiajs/react";
import { Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

export default function Dashboard({ auth, vendors = [] }) {
    // Amankan data user
    const user = auth?.user ?? null;
    const favorites = user?.favorites ?? [];

    // Logika search telah dihapus sesuai permintaan, sehingga state terkait juga dihapus.

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Temukan Vendor Pernikahan Impian Anda" />
            {/* Navbar dari CustomerLayout, sekarang diberi auth */}
            <Navbar auth={auth} user={user} />
            <main>
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-yellow-100 via-yellow-50 to-amber-50 py-24 md:py-32 px-4 overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        {/* Efek cahaya latar belakang yang lebih halus */}
                        <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-400 rounded-full filter blur-3xl opacity-30"></div>
                        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400 rounded-full filter blur-3xl opacity-30"></div>
                    </div>
                    <div className="relative max-w-6xl mx-auto text-center">
                        {/* Judul Utama: Gaya Minimalis Elegan (Sans-serif, Uppercase, Wide Tracking) */}
                        <h1 className="font-sans text-yellow-900 mb-6 leading-relaxed drop-shadow-md uppercase tracking-widest">
                            {/* Baris 1: Ringan dan Lapang */}
                            <span className="text-4xl md:text-5xl font-light text-yellow-800">
                                Temukan Vendor
                            </span>

                            <br />

                            {/* Baris 2: Tebal dan Terang (Pusat Perhatian), menggabungkan "Impian Anda" */}
                            <span className="font-extrabold text-5xl md:text-7xl bg-gradient-to-r from-amber-600 to-yellow-700 bg-clip-text text-transparent drop-shadow-lg">
                                Pernikahan Impian Anda
                            </span>
                        </h1>
                        <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
                            Platform direktori wedding organizer terlengkap di
                            Indonesia
                        </p>
                                    {/* Search Bar telah dihapus */}         {" "}
                    </div>
                           {" "}
                </section>
                        {/* Featured Vendors Section */}       {" "}
                <section
                    id="vendors"
                    className="py-16 px-4 bg-gradient-to-b from-white to-yellow-50 scroll-mt-24"
                >
                             {" "}
                    <div className="max-w-6xl mx-auto">
                                   {" "}
                        <div className="text-center mb-12">
                                         {" "}
                            <h2 className="text-3xl font-serif text-black mb-4">
                                                Vendor Pilihan Kami            
                                 {" "}
                            </h2>
                                         {" "}
                            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
                                       {" "}
                        </div>
                                   {" "}
                        {vendors.length === 0 ? (
                            <p className="text-center text-gray-500">
                                                Tidak ada vendor yang
                                ditampilkan saat ini.              {" "}
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                               {" "}
                                {vendors.map((vendor) => (
                                    <Link
                                        key={vendor.id}
                                        href={`/vendors/${vendor.id}`}
                                    >
                                                           {" "}
                                        <Card className="group cursor-pointer border border-gray-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm hover:bg-white h-full">
                                                                 {" "}
                                            <CardContent className="p-6">
                                                                       {" "}
                                                <div className="flex flex-col items-center text-center">
                                                                             {" "}
                                                    <div className="w-20 h-20 mb-4 rounded-full overflow-hidden bg-gradient-to-br from-yellow-100 to-yellow-200 p-1">
                                                                               
                                                           {" "}
                                                        <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                                                               
                                                                     {" "}
                                                            <img
                                                                src={
                                                                    vendor.coverPhoto ||
                                                                    `https://placehold.co/100x100/FFF0C9/C7991F?text=${
                                                                        vendor.name
                                                                            ? vendor
                                                                                  .name[0]
                                                                            : "V"
                                                                    }`
                                                                }
                                                                alt={
                                                                    vendor.name
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />
                                                                               
                                                                   {" "}
                                                        </div>
                                                                               
                                                         {" "}
                                                    </div>
                                                                             {" "}
                                                    <h3 className="text-lg font-semibold text-black mb-1 group-hover:text-yellow-700 transition-colors">
                                                                               
                                                            {vendor.name}       
                                                                         {" "}
                                                    </h3>
                                                                             {" "}
                                                    <div className="flex items-center text-gray-600 text-sm mb-2">
                                                                               
                                                           {" "}
                                                        {/* MapPin di sini tetap dipertahankan karena ada data lokasi */}
                                                                               
                                                           {" "}
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
                                                            <circle
                                                                cx="12"
                                                                cy="10"
                                                                r="3"
                                                            />
                                                        </svg>
                                                                               
                                                           {" "}
                                                        {vendor.city ||
                                                            "Lokasi"}
                                                                               
                                                         {" "}
                                                    </div>
                                                                             {" "}
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                                               
                                                            {vendor.description}
                                                                               
                                                         {" "}
                                                    </p>
                                                                           {" "}
                                                </div>
                                                                     {" "}
                                            </CardContent>
                                                               {" "}
                                        </Card>
                                                         {" "}
                                    </Link>
                                ))}
                                             {" "}
                            </div>
                        )}
                                   {" "}
                        <div className="text-center mt-12">
                                         {" "}
                            <Link href="/#vendors">
                                               {" "}
                                <Button
                                    variant="outline"
                                    className="px-8 py-3 border-yellow-400 text-yellow-700 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-yellow-600 hover:text-black hover:border-transparent font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                                      Lihat Semua Vendor        
                                           {" "}
                                </Button>
                                             {" "}
                            </Link>
                                       {" "}
                        </div>
                                 {" "}
                    </div>
                           {" "}
                </section>
                        {/* Section Tentang Kami */}       {" "}
                <section
                    id="about"
                    className="py-16 px-4 bg-white scroll-mt-24 border-t border-yellow-100"
                >
                             {" "}
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                                   {" "}
                        <div className="flex-1 space-y-6 text-center md:text-left">
                                         {" "}
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                                                Tentang{" "}
                                <span className="text-yellow-600">
                                    WeddingExpo
                                </span>
                                             {" "}
                            </h2>
                                         {" "}
                            <p className="text-lg text-gray-600 leading-relaxed">
                                                WeddingExpo adalah platform
                                terpercaya yang menghubungkan calon            
                                    pengantin dengan ribuan vendor pernikahan
                                profesional di                 seluruh
                                Indonesia.              {" "}
                            </p>
                                         {" "}
                            <p className="text-gray-600 leading-relaxed">
                                                Kami memahami bahwa pernikahan
                                adalah momen sekali seumur                
                                hidup. Oleh karena itu, kami berdedikasi untuk
                                memudahkan Anda                 dalam
                                merencanakan pernikahan impian, mulai dari
                                pemilihan                 lokasi, katering,
                                hingga dokumentasi.              {" "}
                            </p>
                                         {" "}
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                               {" "}
                                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                                                     {" "}
                                    <h4 className="text-2xl font-bold text-yellow-700">
                                        1000+
                                    </h4>
                                                     {" "}
                                    <p className="text-sm text-gray-600">
                                        Vendor Terdaftar
                                    </p>
                                                   {" "}
                                </div>
                                               {" "}
                                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                                                     {" "}
                                    <h4 className="text-2xl font-bold text-yellow-700">
                                        50+
                                    </h4>
                                                     {" "}
                                    <p className="text-sm text-gray-600">
                                        Kota Dijangkau
                                    </p>
                                                   {" "}
                                </div>
                                             {" "}
                            </div>
                                       {" "}
                        </div>
                                   {" "}
                        <div className="flex-1">
                                         {" "}
                            <div className="relative">
                                               {" "}
                                <div className="absolute -top-4 -left-4 w-full h-full bg-yellow-200 rounded-2xl transform rotate-3"></div>
                                               {" "}
                                <img
                                    src="https://placehold.co/600x400/FFF0C9/C7991F?text=About+Us+Wedding"
                                    alt="Tentang WeddingExpo"
                                    className="relative rounded-2xl shadow-lg w-full object-cover h-80"
                                />
                                             {" "}
                            </div>
                                       {" "}
                        </div>
                                 {" "}
                    </div>
                           {" "}
                </section>
                     {" "}
            </main>
                  {/* Footer */}     {" "}
            <footer className="bg-gray-900 text-gray-300 mt-16">
                       {" "}
                <div className="max-w-6xl mx-auto px-4 py-12">
                             {" "}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                   {" "}
                        <div>
                                         {" "}
                            <Link href="/" className="flex items-center mb-4">
                                               {" "}
                                <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold shadow-md rounded-lg">
                                                     {" "}
                                    <div className="text-xl font-serif tracking-wide leading-tight">
                                                            Wedding
                                        <span className="font-black">Expo</span>
                                                         {" "}
                                    </div>
                                                   {" "}
                                </div>
                                             {" "}
                            </Link>
                                         {" "}
                            <p className="text-gray-400 text-sm">
                                                Platform direktori wedding
                                organizer terlengkap di Indonesia.              {" "}
                            </p>
                                       {" "}
                        </div>
                                   {" "}
                        <div>
                                         {" "}
                            <h4 className="font-semibold text-white mb-4">
                                Layanan
                            </h4>
                                         {" "}
                            <ul className="space-y-2">
                                               {" "}
                                <li>
                                                     {" "}
                                    <Link
                                        href="/#vendors"
                                        className="text-gray-400 hover:text-yellow-400 text-sm"
                                    >
                                                            Cari Vendor        
                                                 {" "}
                                    </Link>
                                                   {" "}
                                </li>
                                               {" "}
                                <li>
                                                     {" "}
                                    <Link
                                        href="/#inspiration"
                                        className="text-gray-400 hover:text-yellow-400 text-sm"
                                    >
                                                            Inspirasi          
                                               {" "}
                                    </Link>
                                                   {" "}
                                </li>
                                               {" "}
                                <li>
                                                     {" "}
                                    <Link
                                        href="/#about"
                                        className="text-gray-400 hover:text-yellow-400 text-sm"
                                    >
                                                            Tentang Kami        
                                                 {" "}
                                    </Link>
                                                   {" "}
                                </li>
                                             {" "}
                            </ul>
                                       {" "}
                        </div>
                                   {" "}
                        <div>
                                         {" "}
                            <h4 className="font-semibold text-white mb-4">
                                Vendor
                            </h4>
                                         {" "}
                            <ul className="space-y-2">
                                               {" "}
                                <li>
                                                     {" "}
                                    <Link
                                        href="/register/vendor"
                                        className="text-gray-400 hover:text-yellow-400 text-sm"
                                    >
                                                            Daftar Vendor      
                                                   {" "}
                                    </Link>
                                                   {" "}
                                </li>
                                               {" "}
                                <li>
                                                     {" "}
                                    <Link
                                        href="/login"
                                        className="text-gray-400 hover:text-yellow-400 text-sm"
                                    >
                                                            Login Vendor        
                                                 {" "}
                                    </Link>
                                                   {" "}
                                </li>
                                             {" "}
                            </ul>
                                       {" "}
                        </div>
                                   {" "}
                        <div>
                                         {" "}
                            <h4 className="font-semibold text-white mb-4">
                                Kontak
                            </h4>
                                         {" "}
                            <ul className="space-y-3">
                                               {" "}
                                <li className="flex items-center">
                                                     {" "}
                                    <Mail className="w-4 h-4 mr-2 text-yellow-400" />
                                                     {" "}
                                    <a
                                        href="mailto:info@weddingexpo.id"
                                        className="text-gray-400 hover:text-yellow-400 text-sm"
                                    >
                                                            info@weddingexpo.id
                                                         {" "}
                                    </a>
                                                   {" "}
                                </li>
                                               {" "}
                                <li className="flex items-center">
                                                     {" "}
                                    <Phone className="w-4 h-4 mr-2 text-yellow-400" />
                                                     {" "}
                                    <span className="text-gray-400 text-sm">
                                        +62 21 1234 5678
                                    </span>
                                                   {" "}
                                </li>
                                               {" "}
                                <li className="flex items-center">
                                                     {" "}
                                    {/* MapPin di sini menggunakan inline SVG karena importnya dihapus */}
                                                     {" "}
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
                                        className="w-4 h-4 mr-2 text-yellow-400"
                                    >
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                                     {" "}
                                    <span className="text-gray-400 text-sm">
                                                            Jakarta, Indonesia  
                                                       {" "}
                                    </span>
                                                   {" "}
                                </li>
                                             {" "}
                            </ul>
                                       {" "}
                        </div>
                                 {" "}
                    </div>
                             {" "}
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                                   {" "}
                        <p className="text-sm text-gray-500">
                                          © 2024 WeddingExpo. All rights
                            reserved.            {" "}
                        </p>
                                 {" "}
                    </div>
                           {" "}
                </div>
                     {" "}
            </footer>
               {" "}
        </div>
    );
}
