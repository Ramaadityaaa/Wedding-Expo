<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Menampilkan dashboard untuk vendor.
     */
    public function index(): Response
    {
        // =========================================================
        // PENTING: Simulasi Mendapatkan Nilai Global dari Environment
        // (Di lingkungan Canvas, nilai ini sudah disediakan secara otomatis)
        // Jika Anda menggunakan Laravel murni, Anda harus mengambilnya
        // dari config atau service Anda.
        // =========================================================
        
        // 1. Dapatkan Firebase Config (misal dari env atau config/services.php)
        // Biasanya ini adalah string JSON dari konfigurasi Firebase Anda.
        // const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        $firebaseConfig = [
            'apiKey'            => env('FIREBASE_API_KEY', 'default_key'),
            'authDomain'        => env('FIREBASE_AUTH_DOMAIN', 'default-domain.firebaseapp.com'),
            'projectId'         => env('FIREBASE_PROJECT_ID', 'default-project'),
            'storageBucket'     => env('FIREBASE_STORAGE_BUCKET'),
            'messagingSenderId' => env('FIREBASE_MESSAGING_SENDER_ID'),
            'appId'             => env('FIREBASE_APP_ID'),
        ];
        
        // 2. Dapatkan Custom Auth Token (Jika Anda menggunakan Custom Auth di Laravel)
        // Jika Anda menggunakan autentikasi default Inertia/Laravel, Anda 
        // mungkin perlu menukarkan token tersebut atau bisa dikosongkan 
        // (dan React akan menggunakan signInAnonymously).
        // const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        $customFirebaseToken = null; 
        
        // Asumsikan kita punya App ID yang sama yang digunakan di frontend
        $appId = env('CANVAS_APP_ID', 'default-app-id');
        
        // =========================================================

        return Inertia::render('Vendor/Dashboard', [
            // Kirim data yang dibutuhkan frontend untuk inisialisasi Firebase
            'firebaseConfig' => json_encode($firebaseConfig),
            'initialAuthToken' => $customFirebaseToken,
            'appId' => $appId,
            
            // Pertahankan props lama (misalnya untuk data non-realtime)
            'products' => [], 
            'orders' => []
        ]);
    }
}