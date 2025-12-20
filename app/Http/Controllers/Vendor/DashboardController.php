<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse; // Tambahan untuk mendukung redirect
use Illuminate\Support\Facades\Auth;
use App\Models\Order; 
use App\Models\Review;
use App\Models\WeddingOrganizer; 
use App\Models\User; 

class DashboardController extends Controller
{
    /**
     * METHOD BARU: Menampilkan halaman verifikasi (LoadingPage) tanpa mengganggu index.
     * Menggunakan tipe data Response|RedirectResponse agar tidak error PHP0408.
     */
    public function verificationStatus(): Response|RedirectResponse
    {
        $user = Auth::user();
        $vendor = $user->weddingOrganizer;

        if (!$vendor) {
            return Inertia::render('Vendor/Payment/LoadingPage', [
                'status' => 'error',
                'message' => 'Profil Vendor Anda tidak ditemukan. Silakan hubungi admin.'
            ]);
        }

        // Jika ternyata sudah APPROVED (misal user refresh halaman ini)
        if ($vendor->isApproved === 'APPROVED') {
            return redirect()->route('vendor.dashboard');
        }

        $status = strtolower($vendor->isApproved);
        $message = $status === 'pending'
            ? 'Akun Anda sedang dalam proses verifikasi oleh Administrator. Mohon tunggu.'
            : 'Pendaftaran Anda ditolak. Silakan hubungi admin untuk detail lebih lanjut.';

        return Inertia::render('Vendor/Payment/LoadingPage', [
            'status' => $status,
            'message' => $message
        ]);
    }

    /**
     * Menampilkan dashboard Vendor (Kode Asli Anda 100% Utuh).
     */
    public function index(): Response
    {
        $user = Auth::user();

        $vendor = $user->weddingOrganizer; 
        
        if (!$vendor) {
            return Inertia::render('Vendor/Payment/LoadingPage', [
                'status' => 'error',
                'message' => 'Profil Vendor Anda tidak ditemukan. Silakan hubungi admin.'
            ]);
        }
        
        $vendorId = $vendor->id;
        
        // 2. Cek Status Verifikasi dan Redirect (Logika Asli Anda)
        if ($vendor->isApproved === 'PENDING' || $vendor->isApproved === 'REJECTED') {
            
            $status = strtolower($vendor->isApproved);
            $message = $status === 'pending'
                ? 'Akun Anda sedang dalam proses verifikasi oleh Administrator. Mohon tunggu.'
                : 'Pendaftaran Anda ditolak. Silakan hubungi admin untuk detail lebih lanjut.';
                
            return Inertia::render('Vendor/Payment/LoadingPage', [
                'status' => $status,
                'message' => $message
            ]);
        }
        
        // 3. Status APPROVED: Ambil Data Statistik dan Recent Data
        
        // Foreign Key di tabel Order/Review ke Vendor
        $fkColumn = 'vendor_id'; 
        
        // --- A. Statistik Dasar ---
        
        $priceColumn = 'total_price'; 
        
        $totalRevenue = Order::where($fkColumn, $vendorId)
                             ->where('status', 'PAID') 
                             ->sum($priceColumn); 

        $totalOrders = Order::where($fkColumn, $vendorId)->count();
        
        $reviewsQuery = Review::where($fkColumn, $vendorId);
        $totalReviews = $reviewsQuery->count();
        $averageRating = $reviewsQuery->avg('rating');

        // --- B. Data Pesanan Terbaru (Limit 3) ---
        $recentOrders = Order::where($fkColumn, $vendorId)
                             ->orderBy('created_at', 'desc')
                             ->limit(3)
                             // PERBAIKAN: Mengganti relasi 'user' menjadi 'customer'
                             ->with(['customer' => function ($query) { 
                                 // customer_id di tabel orders merujuk ke id di tabel users
                                 $query->select('id', 'name'); 
                             }]) 
                             // Select kolom baru (total_price) dan foreign key user (customer_id)
                             ->select('id', $priceColumn, 'status', 'created_at', 'customer_id as user_id') 
                             ->get()
                             ->map(function ($order) use ($priceColumn) {
                                 // PERBAIKAN: Mengakses relasi 'customer'
                                 $order->customer_name = $order->customer ? $order->customer->name : 'Pelanggan Dihapus'; 
                                 
                                 // Mapping kembali ke total_price (nama yang sama, untuk konsistensi frontend)
                                 $order->total_price = $order->{$priceColumn}; 
                                 return $order;
                             });
                             
        // --- C. Data Review Terbaru (Limit 3) ---
        $recentReviews = Review::where($fkColumn, $vendorId)
                               ->orderBy('created_at', 'desc')
                               ->limit(3)
                               ->with(['user' => function ($query) { // Asumsi relasi Review ke User adalah 'user'
                                   $query->select('id', 'name');
                               }])
                               ->select('id', 'rating', 'comment', 'user_id') 
                               ->get()
                               ->map(function ($review) {
                                   $review->customer_name = $review->user ? $review->user->name : 'Pengulas Dihapus'; 
                                   return $review;
                               });


        // --- D. Gabungkan Data Statistik ---
        $stats = [
            'total_revenue' => $totalRevenue ?? 0,
            'total_orders' => $totalOrders ?? 0,
            'total_reviews' => $totalReviews ?? 0,
            'average_rating' => number_format($averageRating ?? 0, 1), 
            'recent_orders' => $recentOrders, 
            'recent_reviews' => $recentReviews,
        ];
        
        // 4. Tampilkan Dashboard utama
        return Inertia::render('Vendor/Dashboard', [
            'vendor' => $vendor, 
            'stats' => $stats,
            'message' => 'Selamat datang kembali di Dashboard Vendor!'
        ]);
    }
}