// resources/js/lib/axios.js
import axios from 'axios';

// Membuat instance Axios dengan pengaturan dasar
const api = axios.create({
    baseURL: 'http://localhost:8000/api',  // Sesuaikan dengan URL API Laravel Anda
    headers: {
        'Content-Type': 'application/json',
        // Jika perlu, tambahkan token autentikasi di sini
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
});

// Export instance Axios agar bisa digunakan di seluruh aplikasi
export default api;
