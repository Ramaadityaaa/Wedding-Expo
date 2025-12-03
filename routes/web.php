<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- KONTROLER UMUM ---
use App\Http\Controllers\HomeController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentProofController;

// --- KONTROLER ADMIN ---
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AdminVendorController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\UserStatsController;
use App\Http\Controllers\Admin\PaymentSettingsController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\StaticContentController;

// --- KONTROLER VENDOR ---
use App\Http\Controllers\Vendor\DashboardController as VendorDashboard;

/*
|---------------------------------------------------------------------------
| PUBLIC CUSTOMER & GUEST ROUTES
|---------------------------------------------------------------------------
*/

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/register/vendor', [HomeController::class, 'vendorRegister'])->name('vendor.register');
Route::post('/register/vendor', [HomeController::class, 'vendorStore'])->name('vendor.store');

// API Publik
Route::prefix('api')->group(function () {
    Route::get('/vendors', [VendorController::class, 'index'])->name('api.vendors.index');
    Route::get('/vendors/{vendor}', [VendorController::class, 'show'])->name('api.vendors.show');
});


/*
|---------------------------------------------------------------------------
| VENDOR ROUTES
|---------------------------------------------------------------------------
*/
Route::prefix('vendor')
    ->name('vendor.')
    ->middleware(['auth', 'vendor']) // Menggunakan alias 'vendor' dari Kernel.php
    ->group(function () {
        
        // 1. Dashboard Vendor Utama (Menangani /vendor/dashboard)
        Route::get('/dashboard', [VendorDashboard::class, 'index'])->name('dashboard');

        // 2. Catch-all untuk Path-based Routing React (Menangani /vendor/dashboard/portfolio, /vendor/dashboard/packages, dll.)
        // Rute ini harus diletakkan setelah rute dashboard utama.
        Route::get('/dashboard/{tab}', [VendorDashboard::class, 'index'])
             ->where('tab', '.*') // Wajib agar menangkap semua segmen (e.g., portfolio, packages)
             ->name('dashboard.tab');

        // Tambahkan rute vendor lainnya di sini
    });


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

    if ($user->role === 'ADMIN') {
        return redirect()->route('admin.dashboard');
    }

    if ($user->role === 'VENDOR') {
        // Ubah redirect ke rute vendor dashboard yang bersih (tanpa tab)
        return redirect()->route('vendor.dashboard');
    }

    // Default Customer/Visitor Dashboard
    return Inertia::render('Customer/Dashboard', [
        'isLoggedIn' => true,
        'user' => $user,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|---------------------------------------------------------------------------
| ADMIN ROUTES (PREFIX: /admin)
|---------------------------------------------------------------------------
*/
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin']) // Menggunakan alias 'admin' dari Kernel.php
    ->group(function () {

        // 1. Dashboard Utama
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // 2. Manajemen Vendor
        Route::get('/vendors', [AdminVendorController::class, 'index'])->name('vendors.index');
        Route::patch('/vendors/{vendor}/status', [AdminVendorController::class, 'updateStatus'])->name('vendors.update-status');
        Route::delete('/vendors/{vendor}', [AdminVendorController::class, 'destroy'])->name('vendors.destroy');
        Route::get('/vendors/{vendor}', [AdminVendorController::class, 'show'])->name('vendors.show');

        // 3. Konfirmasi Pembayaran (Payment Proofs)
        Route::get('/payment-proofs', [PaymentProofController::class, 'index'])->name('paymentproof.index');
        Route::post('/payment-proof/{id}/status', [PaymentProofController::class, 'updateStatus'])->name('paymentproof.status');
        Route::delete('/payment-proof/{id}', [PaymentProofController::class, 'destroy'])->name('paymentproof.destroy');

        // 4. Pengaturan Pembayaran (Payment Settings)
        Route::get('/payment-settings', [PaymentSettingsController::class, 'index'])->name('payment-settings.index');
        Route::post('/payment-settings', [PaymentSettingsController::class, 'update'])->name('payment-settings.update');

        // 5. Manajemen Pengguna (User Management)
        Route::get('/users', [UserStatsController::class, 'index'])->name('user-stats.index');
        Route::patch('/users/{id}/status', [UserStatsController::class, 'updateStatus'])->name('users.update-status');
        Route::delete('/users/{id}', [UserStatsController::class, 'destroy'])->name('users.destroy');

        // 6. Moderasi Ulasan (Review Management)
        Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');
        Route::patch('/reviews/{id}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');
        Route::patch('/reviews/{id}/reject', [ReviewController::class, 'reject'])->name('reviews.reject');

        // 7. Edit Role
        Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
        Route::post('/roles/update', [RoleController::class, 'update'])->name('roles.update');

        // 8. Konten Statis
        Route::get('/static-content', [StaticContentController::class, 'index'])->name('static-content.index');
        Route::post('/static-content', [StaticContentController::class, 'update'])->name('static-content.update');
    });

/*
|---------------------------------------------------------------------------
| ADMIN API ROUTES (LEGACY / AJAX SUPPORT)
|---------------------------------------------------------------------------
*/
Route::prefix('api/admin')
    ->name('admin.api.')
    ->middleware(['auth', 'admin'])
    ->group(function () {
        Route::get('/payment-proofs/data', [PaymentProofController::class, 'data'])->name('paymentproof.data');
    });

/*
|---------------------------------------------------------------------------
| AUTH ROUTES
|---------------------------------------------------------------------------
*/
require __DIR__ . '/auth.php';