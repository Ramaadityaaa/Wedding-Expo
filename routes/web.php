<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- CONTROLLERS ---
use App\Http\Controllers\HomeController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\PaymentController; // Controller Vendor Bayar
use App\Http\Controllers\PaymentProofController; // Controller Admin Konfirmasi Bayar

// Admin Controllers
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AdminVendorController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\UserStatsController;
use App\Http\Controllers\Admin\PaymentSettingsController;
use App\Http\Controllers\Admin\StaticContentController;

// Vendor Controllers
use App\Http\Controllers\Vendor\DashboardController as VendorDashboard;

/*
|---------------------------------------------------------------------------
| PUBLIC CUSTOMER & GUEST ROUTES
|---------------------------------------------------------------------------
*/

// Homepage
Route::get('/', [HomeController::class, 'index'])->name('home');

// Registrasi Vendor (Tanpa Login)
Route::get('/register/vendor', [HomeController::class, 'vendorRegister'])->name('vendor.register');
Route::post('/register/vendor', [HomeController::class, 'vendorStore'])->name('vendor.store');

// API Publik (Untuk Frontend Customer lihat list vendor)
Route::prefix('api')->group(function () {
    Route::get('/vendors', [VendorController::class, 'index'])->name('api.vendors.index');
    Route::get('/vendors/{vendor}', [VendorController::class, 'show'])->name('api.vendors.show');
});


/*
|---------------------------------------------------------------------------
| DASHBOARD REDIRECTOR (SETELAH LOGIN)
|---------------------------------------------------------------------------
*/
Route::get('/dashboard', function () {
    $user = auth()->user();

    if (! $user) {
        return redirect()->route('home');
    }

    // Redirect berdasarkan Role
    if ($user->role === 'ADMIN') {
        return redirect()->route('admin.dashboard');
    }

    if ($user->role === 'VENDOR') {
        return redirect()->route('vendor.dashboard');
    }

    // Default: Customer Dashboard
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
    ->middleware(['auth', 'can:view-admin-area']) // Pastikan Gate/Middleware ini ada
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

        // 4. Pengaturan Pembayaran (Payment Settings - BARU)
        // Halaman edit nomor rekening admin & QRIS
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

        // 7. Role Editor untuk Vendor
        // ROLE EDITOR (Membership)
        Route::get('/roles', [App\Http\Controllers\Admin\RoleController::class, 'index'])->name('roles.index');
        Route::post('/roles/update', [App\Http\Controllers\Admin\RoleController::class, 'update'])->name('roles.update');

        // 8. Konten Statis (Opsional / Placeholder)
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
    ->middleware(['auth', 'can:view-admin-area'])
    ->group(function () {
        // Rute ini mungkin masih dipakai oleh komponen lama yang fetch manual
        Route::get('/payment-proofs/data', [PaymentProofController::class, 'data'])->name('paymentproof.data');
    });


/*
|---------------------------------------------------------------------------
| AUTH ROUTES
|---------------------------------------------------------------------------
*/
require __DIR__ . '/auth.php';
