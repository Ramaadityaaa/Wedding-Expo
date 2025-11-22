<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Vendor\DashboardController as VendorDashboard;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentProofController;

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

    // Extra safety, kalau tidak ada user (meski sudah ada middleware auth)
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
        // user sebenarnya sudah ada di shared props `auth.user`,
        // properti ini hanya tambahan bila mau dipakai langsung
        'user' => $user,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');


/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth']) // boleh ditambah 'verified' kalau mau wajib email terverifikasi
    ->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('/vendors', [VendorController::class, 'index'])->name('vendors.index');
        Route::patch('/vendors/{vendor}/approve', [VendorController::class, 'approve'])->name('vendors.approve');
        Route::patch('/vendors/{vendor}/reject', [VendorController::class, 'reject'])->name('vendors.reject');

        Route::patch('/reviews/{review}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');
        Route::patch('/reviews/{review}/reject', [ReviewController::class, 'reject'])->name('reviews.reject');

        Route::get('/payment-proofs', [PaymentProofController::class, 'index'])->name('paymentproof.index');
        Route::post('/payment-proof/{id}/status', [PaymentProofController::class, 'updateStatus'])->name('paymentproof.status');
    });


/*
|--------------------------------------------------------------------------
| VENDOR ROUTES
|--------------------------------------------------------------------------
*/
Route::prefix('vendor')
    ->name('vendor.')
    ->middleware(['auth']) // boleh ditambah 'verified' juga kalau mau
    ->group(function () {

        Route::get('/dashboard', [VendorDashboard::class, 'index'])->name('dashboard');

        Route::get('/membership', fn () => Inertia::render('Vendor/MembershipPage'))->name('membership');

        Route::get('/payment/invoice/{id}', [PaymentController::class, 'invoice'])->name('payment.invoice');
        Route::get('/payment/create', [PaymentController::class, 'create'])->name('payment.create');
        Route::post('/payment', [PaymentController::class, 'store'])->name('payment.store');
        Route::get('/payment/upload', [PaymentController::class, 'uploadPage'])->name('payment.upload');
        Route::post('/payment/upload', [PaymentController::class, 'uploadProof'])->name('payment.upload.store');
        Route::get('/payment/loading', fn () => Inertia::render('Vendor/Payment/LoadingPage'))->name('payment.loading');
        Route::get('/payment/proof', fn () => Inertia::render('Vendor/Payment/PaymentProofPage'))->name('payment.proof');
    });


/*
|--------------------------------------------------------------------------
| PAYMENT PROOF
|--------------------------------------------------------------------------
*/
Route::post('/payment-proof/store', [PaymentProofController::class, 'store'])
    ->middleware(['auth'])
    ->name('paymentproof.store');


/*
|--------------------------------------------------------------------------
| AUTH ROUTES (BREEZE)
|--------------------------------------------------------------------------
*/
require __DIR__ . '/auth.php';
