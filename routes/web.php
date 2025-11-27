<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\DashboardController;
// Perbaikan Import: Gunakan AdminVendorController
use App\Http\Controllers\Admin\AdminVendorController; 
use App\Http\Controllers\Admin\VendorController; // Controller yang sudah ada untuk Inertia View
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Vendor\DashboardController as VendorDashboard;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentProofController;

// Import yang hilang (disimpan)
use App\Http\Controllers\Admin\UserStatsController;

/*
|--------------------------------------------------------------------------
| PUBLIC CUSTOMER ROUTES
|--------------------------------------------------------------------------
*/

// HOMEPAGE = resources/js/Pages/Customer/Dashboard.jsx
Route::get('/', [HomeController::class, 'index'])->name('home');

// REGISTER VENDOR (no login)
Route::get('/register/vendor', [HomeController::class, 'vendorRegister'])->name('vendor.register');
Route::post('/register/vendor', [HomeController::class, 'vendorStore'])->name('vendor.store');


/*
|--------------------------------------------------------------------------
| DASHBOARD DEFAULT (AFTER LOGIN)
|--------------------------------------------------------------------------
*/
Route::get('/dashboard', function () {
    $user = auth()->user();

    if (! $user) {
        return redirect()->route('home');
    }

    // SESUAI ENUM DI MIGRASI: ['VISITOR', 'VENDOR', 'ADMIN']
    if ($user->role === 'ADMIN') {
        return redirect()->route('admin.dashboard');
    }

    if ($user->role === 'VENDOR') {
        return redirect()->route('vendor.dashboard');
    }

    // VISITOR / CUSTOMER → pakai Customer/Dashboard (landing WeddingExpo)
    return Inertia::render('Customer/Dashboard', [
        'isLoggedIn' => true,
        'user' => $user,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');


/*
|--------------------------------------------------------------------------
| ADMIN ROUTES (INERTIA PAGES)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'can:view-admin-area']) 
    ->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Vendor Management (Inertia Page)
        Route::get('/vendors', [AdminVendorController::class, 'index'])->name('vendors.index');

        // Vendor Management (Actions yang sudah ada - KEMUNGKINAN TIDAK TERPAKAI JIKA MEMAKAI API DI BAWAH)
        // Jika Anda menggunakan AdminVendorController untuk API, rute ini harusnya juga menggunakan AdminVendorController
        Route::patch('/vendors/{vendor}/approve', [AdminVendorController::class, 'approve'])->name('vendors.approve');
        Route::patch('/vendors/{vendor}/reject', [AdminVendorController::class, 'reject'])->name('vendors.reject');

        // Review Management
        Route::patch('/reviews/{review}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');
        Route::patch('/reviews/{review}/reject', [ReviewController::class, 'reject'])->name('reviews.reject');

        // Payment Proof Management (Inertia Page dan Update Status)
        Route::get('/payment-proofs', [PaymentProofController::class, 'index'])->name('paymentproof.index');
        Route::post('/payment-proof/{id}/status', [PaymentProofController::class, 'updateStatus'])->name('paymentproof.status');

        // User Stats / Reporting
        Route::get('/user-stats', [UserStatsController::class, 'index'])->name('user-stats.index'); 
    });


/*
|--------------------------------------------------------------------------
| ADMIN API ROUTES (TELAH DIPERBAIKI AGAR SESUAI DENGAN FRONTEND)
|--------------------------------------------------------------------------
*/
Route::prefix('api/admin') // Path yang dipanggil di frontend: /api/admin/...
    ->middleware(['auth', 'can:view-admin-area'])
    ->group(function () {
        
        // Vendor Management (Menggunakan AdminVendorController)
        
        // 1. [GET] Mengambil semua data vendor: admin.vendors.data
        Route::get('/vendors/data', [AdminVendorController::class, 'data'])->name('admin.vendors.data');
        
        // >>> PERBAIKAN UTAMA: Tambah rute untuk DETAIL VENDOR (GET)
        // Path ini sesuai dengan yang dicoba di frontend: /api/admin/vendors/466
        Route::get('/vendors/{vendor_id}', [AdminVendorController::class, 'show'])->name('admin.vendors.show');
        
        // 2. [PATCH] Mengubah Status Vendor: admin.vendors.updateStatus
        Route::patch('/vendors/{vendor_id}/status', [AdminVendorController::class, 'updateStatus'])->name('admin.vendors.updateStatus');
        
        // 3. [DELETE] Menghapus Vendor: admin.vendors.delete
        Route::delete('/vendors/{vendor_id}', [AdminVendorController::class, 'destroy'])->name('admin.vendors.delete');
        
        // Payment Proof Management (API)
        Route::get('/payment-proofs/data', [PaymentProofController::class, 'index'])->name('admin.api.paymentproof.data');
        Route::post('/payment-proofs/{id}/approve', [PaymentProofController::class, 'approve'])->name('admin.api.paymentproof.approve');
        Route::post('/payment-proofs/{id}/reject', [PaymentProofController::class, 'reject'])->name('admin.api.paymentproof.reject');
    });


/*
|--------------------------------------------------------------------------
| VENDOR ROUTES
|--------------------------------------------------------------------------
*/
// ... (Sisa rute VENDOR dan AUTH tetap sama)
require __DIR__ . '/auth.php';