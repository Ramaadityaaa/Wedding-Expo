<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AdminVendorController; 
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Vendor\DashboardController as VendorDashboard;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentProofController;
use App\Http\Controllers\Admin\UserStatsController;

/*
|---------------------------------------------------------------------------
| PUBLIC CUSTOMER ROUTES
|---------------------------------------------------------------------------
*/

// HOMEPAGE = resources/js/Pages/Customer/Dashboard.jsx
Route::get('/', [HomeController::class, 'index'])->name('home');

// REGISTER VENDOR (no login)
Route::get('/register/vendor', [HomeController::class, 'vendorRegister'])->name('vendor.register');
Route::post('/register/vendor', [HomeController::class, 'vendorStore'])->name('vendor.store');

/*
|---------------------------------------------------------------------------
| DASHBOARD DEFAULT (AFTER LOGIN)
|---------------------------------------------------------------------------
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
|---------------------------------------------------------------------------
| ADMIN ROUTES (INERTIA PAGES & ACTIONS)
|---------------------------------------------------------------------------
| Path: /admin
*/
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'can:view-admin-area']) 
    ->group(function () {

        // --- 1. RUTE INERTIA (PAGES) ---
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        // Vendor Management Page
        Route::get('/vendors', [AdminVendorController::class, 'index'])->name('vendors.index');
        // Payment Proof Management Page
        Route::get('/payment-proofs', [PaymentProofController::class, 'index'])->name('paymentproof.index');
        // User Stats / Reporting Page
        Route::get('/user-stats', [UserStatsController::class, 'index'])->name('user-stats.index'); 

        // --- 2. RUTE ACTION LAMA (Inertia Actions) ---
        Route::patch('/vendors/{vendor}/approve', [AdminVendorController::class, 'approve'])->name('vendors.approve');
        Route::patch('/vendors/{vendor}/reject', [AdminVendorController::class, 'reject'])->name('vendors.reject');
        
        Route::patch('/reviews/{review}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');
        Route::patch('/reviews/{review}/reject', [ReviewController::class, 'reject'])->name('reviews.reject');

        Route::post('/payment-proof/{id}/status', [PaymentProofController::class, 'updateStatus'])->name('paymentproof.status');
    });

/*
|---------------------------------------------------------------------------
| ADMIN API ROUTES (DATA FETCHING - DIISOLASI)
|---------------------------------------------------------------------------
| Path: /api/admin/
| Blok ini diisolasi untuk memastikan rute terdaftar sebagai /api/admin/...
| sesuai dengan panggilan frontend Anda (fetch('/api/admin/vendors/data'))
*/
Route::prefix('api/admin') 
    ->name('admin.api.') // Ubah nama rute untuk menghindari konflik
    ->middleware(['auth', 'can:view-admin-area']) // Menggunakan middleware web.php (auth)
    ->group(function () {
        
        // --- Vendor Management API ---
        // 1. [GET] Mengambil semua data vendor: /api/admin/vendors/data
        Route::get('/vendors/data', [AdminVendorController::class, 'data'])->name('vendors.data');
        
        // 2. [GET] DETAIL VENDOR: /api/admin/vendors/{vendor_id}
        Route::get('/vendors/{vendor_id}', [AdminVendorController::class, 'show'])->name('vendors.show');
        
        // 3. [PATCH] Mengubah Status Vendor: /api/admin/vendors/{vendor_id}/status
        Route::patch('/vendors/{vendor_id}/status', [AdminVendorController::class, 'updateStatus'])->name('vendors.updateStatus');
        
        // 4. [DELETE] Menghapus Vendor: /api/admin/vendors/{vendor_id}
        Route::delete('/vendors/{vendor_id}', [AdminVendorController::class, 'destroy'])->name('vendors.delete');
        
        // --- Payment Proof Management API ---
        Route::get('/payment-proofs/data', [PaymentProofController::class, 'data'])->name('paymentproof.data');
        Route::post('/payment-proofs/{id}/approve', [PaymentProofController::class, 'approve'])->name('paymentproof.approve');
        Route::post('/payment-proofs/{id}/reject', [PaymentProofController::class, 'reject'])->name('paymentproof.reject');
    });

/*
|---------------------------------------------------------------------------
| VENDOR ROUTES
|---------------------------------------------------------------------------
*/
require __DIR__ . '/auth.php';
