<?php  

// routes/web.php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- Impor semua Controller Anda ---
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\DashboardController; 
use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Vendor\DashboardController as VendorDashboard; 
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentProofController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// ==========================================================
// --- RUTE PUBLIK / CUSTOMER ---
// ==========================================================
Route::get('/', [HomeController::class, 'index'])->name('home');

// --- REGISTRASI VENDOR ---
Route::get('/register/vendor', [HomeController::class, 'vendorRegister'])->name('vendor.register');
Route::post('/register/vendor', [HomeController::class, 'vendorStore'])->name('vendor.store');


// ==========================================================
// --- RUTE DASHBOARD DEFAULT ---
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
// --- RUTE VENDOR (SEMUA BERADA DI BLOK INI) ---
// ==========================================================
Route::prefix('vendor')
    ->name('vendor.')
    ->group(function () {

    Route::get('/dashboard', [VendorDashboard::class, 'index'])->name('dashboard');

    Route::get('/membership', function () {
        return Inertia::render('Vendor/MembershipPage');
    })->name('membership');

    // --- PAYMENT FLOW ---
    Route::get('/payment/invoice/{id}', function ($id) {
        return Inertia::render('Vendor/Payment/InvoicePage', [ 'id' => $id ]);
    })->name('payment.invoice');

    Route::get('/payment/create', [PaymentController::class, 'create'])->name('payment.create');
    Route::post('/payment', [PaymentController::class, 'store'])->name('payment.store');

    // Upload Bukti Pembayaran Vendor
    Route::get('/payment/upload', function () {
        return Inertia::render('Vendor/Payment/UploadPaymentProofPage', [
            'amount' => request('amount'),
            'account_name' => request('account_name'),
        ]);
    })->name('payment.upload');

    Route::post('/payment/upload', [PaymentController::class, 'uploadProof'])->name('payment.upload.store');

    Route::get('/payment/loading', function () {
        return Inertia::render('Vendor/Payment/LoadingPage');
    })->name('payment.loading');

    Route::get('/payment/proof', function () {
        return Inertia::render('Vendor/Payment/PaymentProofPage');
    })->name('payment.proof');
});

// ==========================================================
// --- PAYMENT PROOF (UPLOAD VENDOR + REVIEW ADMIN) ---
// ==========================================================

// VENDOR Upload ke PaymentProofController (versi final)
Route::post('/payment-proof/store', [PaymentProofController::class, 'store'])
    ->name('paymentproof.store');

// ADMIN lihat semua bukti pembayaran
Route::get('/admin/payment-proofs', [PaymentProofController::class, 'index'])
    ->name('paymentproof.index');

// ADMIN ubah status (approve / reject)
Route::post('/admin/payment-proof/{id}/status', [PaymentProofController::class, 'updateStatus'])
    ->name('paymentproof.status');


// ==========================================================
// --- RUTE AUTH BAWAAN BREEZE (TIDAK DIPAKAI LOGIN) ---
// ==========================================================
require __DIR__ . '/auth.php';
