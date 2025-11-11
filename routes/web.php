<?php

// routes/web.php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- Impor semua Controller Anda (Duplikat Dihapus) ---
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\Admin\ReviewController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// --- Rute Publik ---
Route::get('/', [HomeController::class, 'index'])->name('home');

// --- RUTE BARU DITAMBAHKAN DI SINI ---
// Rute ini akan menangani klik kartu vendor dan menampilkan halaman detail
// Ini akan memanggil method 'show' di HomeController Anda
Route::get('/vendors/{vendor}', [HomeController::class, 'show'])->name('vendor.show');
// ------------------------------------


// --- Rute User Terautentikasi (Bawaan Breeze) ---
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
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    
    // Rute untuk Admin Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Rute untuk Vendor Management
    Route::patch('/vendors/{vendor}/approve', [VendorController::class, 'approve'])->name('vendors.approve');
    Route::patch('/vendors/{vendor}/reject', [VendorController::class, 'reject'])->name('vendors.reject');

    // Rute untuk Review Management
    Route::patch('/reviews/{review}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');
    Route::patch('/reviews/{review}/reject', [ReviewController::class, 'reject'])->name('reviews.reject');
});


// --- File Rute Auth Bawaan Breeze (Harus di paling bawah) ---
require __DIR__.'/auth.php';