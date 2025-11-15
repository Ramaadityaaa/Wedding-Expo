<?php 

// routes/web.php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- Impor semua Controller Anda ---
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\DashboardController; // Ini untuk Admin
use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Vendor\DashboardController as VendorDashboard; // Ini untuk Vendor

// --- TAMBAHAN SAYA: Impor PaymentController Anda ---
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// ==========================================================
// --- RUTE PUBLIK / CUSTOMER ---
// ==========================================================
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/vendors/{vendor}', [HomeController::class, 'show'])->name('vendor.show');
Route::get('/vendors', [HomeController::class, 'allVendors'])->name('vendors.all');
Route::get('/favorit', [HomeController::class, 'favorites'])->name('favorites');
Route::get('/tentang', [HomeController::class, 'about'])->name('about');
Route::get('/inspiration', [HomeController::class, 'inspiration'])->name('inspiration');
Route::get('/tips', [HomeController::class, 'tips'])->name('tips');
Route::get('/panduan', [HomeController::class, 'panduan'])->name('panduan');
Route::get('/register/vendor', [HomeController::class, 'vendorRegister'])->name('vendor.register');


// --- Rute User Terautentikasi (Bawaan Breeze) ---
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard'); // Dashboard bawaan Breeze
})->middleware(['auth', 'verified'])->name('dashboard');

// Rute Profil Bawaan Breeze
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// ==========================================================
// --- RUTE ADMIN ---
// ==========================================================
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    
    // Menggunakan Admin\DashboardController
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard'); 
    
    Route::get('/vendors', [VendorController::class, 'index'])->name('vendors.index');
    Route::patch('/vendors/{vendor}/approve', [VendorController::class, 'approve'])->name('vendors.approve');
    Route::patch('/vendors/{vendor}/reject', [VendorController::class, 'reject'])->name('vendors.reject');
    Route::patch('/reviews/{review}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');
    Route::patch('/reviews/{review}/reject', [ReviewController::class, 'reject'])->name('reviews.reject');
});


// ==========================================================
// --- RUTE VENDOR (SAYA PERBAIKI DAN LENGKAPI) ---
// ==========================================================
// PERBAIKAN: Menghapus ->prefix('vendor') yang duplikat
// PERBAIKAN: Menambahkan middleware (dengan asumsi Anda punya middleware 'isVendor')
Route::middleware(['auth', 'verified', 'isVendor']) // <-- SAYA TAMBAHKAN INI
    ->prefix('vendor') // <-- HANYA SATU
    ->name('vendor.')
    ->group(function () {
    
    // Menggunakan 'VendorDashboard' yang sudah kita beri alias
    Route::get('/dashboard', [VendorDashboard::class, 'index'])->name('dashboard');

    // ⭐ RUTE MEMBERSHIP (Sudah ada)
    Route::get('/membership', function () {
        return Inertia::render('Vendor/MembershipPage');
    })->name('membership');

    // --- TAMBAHAN SAYA: Rute untuk PaymentPage ---
    // Rute untuk menampilkan halaman pembayaran (dari PaymentController)
    Route::get('/payment', [PaymentController::class, 'create'])->name('payment.create');
    // Rute untuk memproses formulir pembayaran
    Route::post('/payment', [PaymentController::class, 'store'])->name('payment.store');
    // --- AKHIR TAMBAHAN ---
});


// --- File Rute Auth Bawaan Breeze (HARUS DI PALING BAWAH) ---
require __DIR__.'/auth.php';