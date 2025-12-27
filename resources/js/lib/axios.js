import axios from 'axios';

// Membuat instance Axios dengan pengaturan dasar
const api = axios.create({
    // baseURL: '/api' sudah benar untuk rute API internal
    baseURL: '/api', 
    
    // KRUSIAL: Memastikan cookie sesi dikirim untuk otentikasi Admin API
    withCredentials: true, 

    headers: {
        'Content-Type': 'application/json',
    },
});

// Export instance Axios agar bisa digunakan di seluruh aplikasi
export default api;
