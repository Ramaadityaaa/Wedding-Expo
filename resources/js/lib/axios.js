import axios from 'axios';

// Membuat instance Axios dengan pengaturan dasar
const api = axios.create({
    // PERBAIKAN 1: Gunakan URL relatif jika aplikasi Inertia dan API berada di domain yang sama.
    // Jika Anda bersikeras menggunakan URL absolut, pastikan domain di sini SAMA PERSIS 
    // dengan domain yang digunakan browser (misalnya http://127.0.0.1:8000 vs http://localhost:8000).
    // Saya sarankan pakai base URL relatif '/api' jika Anda mengaksesnya dari domain yang sama.
    baseURL: '/api', 
    
    // PERBAIKAN KRUSIAL 2: Menambahkan withCredentials: true
    // Ini memastikan cookie sesi otentikasi Laravel dikirim bersama permintaan.
    withCredentials: true, 

    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`, // Hapus atau biarkan terkomentar jika Anda menggunakan otentikasi session/cookie (Breeze default)
    },
});

// Export instance Axios agar bisa digunakan di seluruh aplikasi
export default api;