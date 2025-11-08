<?php

// routes/web.php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- Impor semua Controller Anda ---
use App\Http\Controllers\HomeController; // <-- DI SINI PERBAIKANNYA (1)
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\Admin\ReviewController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// --- Rute Publik (Homepage/Dashboard Customer) ---
// DI SINI PERBAIKANNYA (2): Mengganti fungsi default dengan HomeController
Route::get('/', [HomeController::class, 'index'])->name('home');


// --- Rute User Terautentikasi (Bawaan Breeze) ---
// CATATAN: Ini adalah /dashboard untuk USER biasa
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Rute Profil Bawaan Breeze
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// ==========================================================
// --- RUTE ADMIN BARU ANDA (Sudah Lengkap) ---
// ==========================================================
// Dilindungi oleh middleware 'auth', 'verified', dan 'admin'
// ==========================================================
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    
    // Rute untuk Admin Dashboard
    // GET /admin/dashboard -> admin.dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Rute untuk Vendor Management
    // PATCH /admin/vendors/{vendor}/approve -> admin.vendors.approve
    Route::patch('/vendors/{vendor}/approve', [VendorController::class, 'approve'])->name('vendors.approve');
    
    // PATCH /admin/vendors/{vendor}/reject -> admin.vendors.reject
    Route::patch('/vendors/{vendor}/reject', [VendorController::class, 'reject'])->name('vendors.reject');

    // Rute untuk Review Management
    // PATCH /admin/reviews/{review}/approve -> admin.reviews.approve
    Route::patch('/reviews/{review}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');

    // PATCH /admin/reviews/{review}/reject -> admin.reviews.reject
    Route::patch('/reviews/{review}/reject', [ReviewController::class, 'reject'])->name('reviews.reject');
});


// --- File Rute Auth Bawaan Breeze (Harus di paling bawah) ---
require __DIR__.'/auth.php';