import React from 'react';

// --- Konfigurasi Tema & Styling ---
const primaryColor = '#A3844C'; // Emas Tua (Aksen)
const secondaryColor = '#FFBB00'; // Kuning Emas Cerah (Highlight)
const tertiaryColor = '#D4B98E'; // Perpaduan emas/cokelat muda untuk detail
const bgColor = '#FFFBF7'; // Putih Gading
const sandColor = '#F7E7C5'; // Warna krem emas (Digunakan untuk background teks)

// Komponen Pesawat Kertas Sketsa Emas (SVG yang sudah dibalik, lancip ke kanan)
const PaperAirplaneSketchIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        // UKURAN DITINGKATKAN: w-36 h-36 untuk mobile, w-48 h-48 untuk desktop
        className="w-36 h-36 sm:w-48 sm:h-48 transform transition duration-300 drop-shadow-lg"
    >
        {/* Definisi Gradient Emas untuk Isian */}
        <defs>
            <linearGradient id="goldFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: secondaryColor, stopOpacity: 1}} />
                <stop offset="50%" style={{stopColor: tertiaryColor, stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: primaryColor, stopOpacity: 1}} />
            </linearGradient>
            <linearGradient id="grayShade" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#D3D3D3', stopOpacity: 1}} /> {/* Abu-abu terang */}
                <stop offset="100%" style={{stopColor: '#A9A9A9', stopOpacity: 1}} /> {/* Abu-abu gelap */}
            </linearGradient>
        </defs>

        {/* Garis Outline Hitam Tebal */}
        <g stroke="black" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
            {/* Outline luar pesawat. Sekarang lancip di 95,50 (kanan) */}
            <polygon points="95,50 5,20 30,50 5,80" fill="url(#goldFill)" />

            {/* Garis lipatan tengah pesawat (dari belakang ke depan) */}
            <line x1="30" y1="50" y2="50" x2="95" />

            {/* Garis lipatan sayap atas (shading abu-abu) - koordinat dibalik */}
            <polygon points="50,35 30,50 35,40" fill="url(#grayShade)" strokeWidth="0" />
            <line x1="50" y1="35" x2="35" y2="40" />


            {/* Garis lipatan sayap bawah (shading abu-abu) - koordinat dibalik */}
            <polygon points="50,65 30,50 35,60" fill="url(#grayShade)" strokeWidth="0" />
            <line x1="50" y1="65" x2="35" y2="60" />


            {/* Garis goresan detail - koordinat dibalik */}
            <line x1="45" y1="70" x2="35" y2="72" strokeWidth="2" />
            <line x1="45" y1="30" x2="35" y2="28" strokeWidth="2" />
        </g>
    </svg>
);

// Komponen Utama Halaman Loading Pesawat Kertas
export default function App() {
    return (
        <div
            className="font-sans min-h-screen flex justify-center items-center p-4 sm:p-12"
            style={{backgroundColor: bgColor}}
        >
            {/* CSS Animation Block */}
            <style>{`
                /* Animasi: Muncul dari kiri, melintas di tengah, lalu terbang keluar ke kanan (Pengiriman Data) */
                @keyframes send-out-loop {
                    0% { transform: translateX(-150%) rotate(-5deg); opacity: 0; }
                    10% { transform: translateX(-50%) rotate(0deg); opacity: 1; }
                    35% { transform: translateX(0) translateY(-10px) rotate(3deg); opacity: 1; } /* Titik "Di Dalam/Tengah" */
                    75% { transform: translateX(150%) translateY(0) rotate(5deg); opacity: 0.5; } /* Titik "Terbang Keluar" */
                    100% { transform: translateX(150%) translateY(0) rotate(5deg); opacity: 0; }
                }

                @keyframes pulse-shadow {
                    0% { box-shadow: 0 0 15px 5px rgba(255, 187, 0, 0.5); }
                    50% { box-shadow: 0 0 25px 10px rgba(255, 187, 0, 0.8); }
                    100% { box-shadow: 0 0 15px 5px rgba(255, 187, 0, 0.5); }
                }
                .sending-plane {
                    animation: send-out-loop 4s linear infinite; /* Durasi 4 detik untuk siklus pengiriman */
                }
            `}</style>
            
            {/* Kartu Loading Utama */}
            <div 
                // UKURAN DITINGKATKAN: max-w-4xl dan padding lebih besar
                className="max-w-4xl w-full mx-auto p-16 md:p-24 text-center bg-white rounded-3xl shadow-2xl"
                style={{
                    borderTop: `16px solid ${secondaryColor}`, // Border sedikit lebih tebal
                    boxShadow: '0 20px 60px -15px rgba(0,0,0,0.3)', // Bayangan lebih kuat
                    overflow: 'hidden',
                }}
            >
                
                {/* Area Animasi Pesawat Kertas */}
                {/* UKURAN DITINGKATKAN: tinggi lebih besar untuk ruang animasi */}
                <div className="mb-16 h-40 relative flex items-center justify-center">
                    {/* Wadah Animasi */}
                    <div className="absolute w-full h-full flex justify-center items-center">
                         {/* Pesawat yang Melakukan Loop Terbang */}
                        <div className="absolute sending-plane" style={{left: '50%'}}>
                            <PaperAirplaneSketchIcon /> 
                        </div>
                    </div>
                </div>

                {/* Teks Utama */}
                {/* UKURAN DITINGKATKAN: text-5xl */}
                <h1 className="text-5xl font-extrabold mb-6" style={{color: primaryColor}}>
                    Proses Verifikasi Pembayaran Sedang Berjalan
                </h1>

                {/* Pesan Waktu Tunggu */}
                {/* UKURAN DITINGKATKAN: text-3xl */}
                <p className="text-3xl text-gray-700 leading-relaxed">
                    Pesawat data kami sedang mengirimkan informasi verifikasi Anda.
                    <br />
                    Harap menunggu maksimal:
                    {/* UKURAN DITINGKATKAN: text-4xl */}
                    <strong className="block text-4xl mt-4 p-3 rounded-lg" style={{color: primaryColor, backgroundColor: sandColor, animation: 'pulse-shadow 2s ease-in-out infinite'}}>
                        1 x 24 Jam Kerja
                    </strong>.
                </p>

            </div>
        </div>
    );
}