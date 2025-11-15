<?php 

// routes/web.php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- Impor semua Controller Anda ---
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\DashboardController; // Admin Dashboard
use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Vendor\DashboardController as VendorDashboard; // Vendor Dashboard

// Impor PaymentController
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


// ==========================================================
// --- RUTE DASHBOARD BAWAAN (TIDAK ADA LOGIN) ---
// ==========================================================
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');


// ==========================================================
// --- RUTE ADMIN (TANPA LOGIN) ---
// ==========================================================
Route::prefix('admin')
    ->name('admin.')
    ->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/vendors', [VendorController::class, 'index'])->name('vendors.index');
    Route::patch('/vendors/{vendor}/approve', [VendorController::class, 'approve'])->name('vendors.approve');
    Route::patch('/vendors/{vendor}/reject', [VendorController::class, 'reject'])->name('vendors.reject');

    Route::patch('/reviews/{review}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');
    Route::patch('/reviews/{review}/reject', [ReviewController::class, 'reject'])->name('reviews.reject');
});


// ==========================================================
// --- RUTE VENDOR (TANPA LOGIN) ---
// ==========================================================
Route::prefix('vendor')
    ->name('vendor.')
    ->group(function () {

    // Dashboard vendor tanpa login
    Route::get('/dashboard', [VendorDashboard::class, 'index'])->name('dashboard');

    // Membership Page
    Route::get('/membership', function () {
        return Inertia::render('Vendor/MembershipPage');
    })->name('membership');

    // Payment Page
    Route::get('/payment', [PaymentController::class, 'create'])->name('payment.create');
    Route::post('/payment', [PaymentController::class, 'store'])->name('payment.store');
});


// ==========================================================
// --- RUTE AUTH BAWAAN BREEZE (TIDAK DIPAKAI LOGIN) ---
// ==========================================================
require __DIR__.'/auth.php';

