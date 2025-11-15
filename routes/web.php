<?php 

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Vendor\DashboardController as VendorDashboard;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/vendors', [HomeController::class, 'allVendors'])->name('vendors.all');
Route::get('/vendors/{vendor}', [HomeController::class, 'show'])->name('vendor.show');

Route::get('/favorit', [HomeController::class, 'favorites'])->name('favorites');
Route::get('/tentang', [HomeController::class, 'about'])->name('about');
Route::get('/panduan', [HomeController::class, 'panduan'])->name('panduan');
Route::get('/inspiration', [HomeController::class, 'inspiration'])->name('inspiration');
Route::get('/tips', [HomeController::class, 'tips'])->name('tips');

Route::get('/register/vendor', [HomeController::class, 'vendorRegister'])
    ->name('vendor.register');


/*
|--------------------------------------------------------------------------
| ADMIN ROUTES (NO LOGIN)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->group(function () {

    Route::get('/dashboard', [AdminDashboard::class, 'index'])
        ->name('dashboard');  

    Route::get('/vendors', [VendorController::class, 'index'])
        ->name('vendors.index');

    Route::patch('/vendors/{vendor}/approve', [VendorController::class, 'approve'])
        ->name('vendors.approve');

    Route::patch('/vendors/{vendor}/reject', [VendorController::class, 'reject'])
        ->name('vendors.reject');

    Route::patch('/reviews/{review}/approve', [ReviewController::class, 'approve'])
        ->name('reviews.approve');

    Route::patch('/reviews/{review}/reject', [ReviewController::class, 'reject'])
        ->name('reviews.reject');
});


/*
|--------------------------------------------------------------------------
| VENDOR ROUTES — PAYMENT FLOW (NO LOGIN)
|--------------------------------------------------------------------------
| Flow:
| 1. /vendor/membership            → pilih paket
| 2. /vendor/payment/invoice/{id}  → Halaman Invoice
| 3. /vendor/payment               → Form Upload Bukti
| 4. /vendor/payment/proof/{id}    → Halaman Bukti Terkirim
|--------------------------------------------------------------------------
*/
Route::prefix('vendor')->name('vendor.')->group(function () {

    // Dashboard Vendor
    Route::get('/dashboard', [VendorDashboard::class, 'index'])
        ->name('dashboard');


    /* 1️⃣ Membership Page */
    Route::get('/membership', function () {
        return Inertia::render('Vendor/MembershipPage');
    })->name('membership');


    /* 2️⃣ Invoice Page (Setelah Klik Mulai Berlangganan) */
    Route::get('/payment/invoice/{id}', function ($id) {
        return Inertia::render('Vendor/Payment/InvoicePage', [
            'id' => $id
        ]);
    })->name('payment.invoice');


    /* 3️⃣ Payment Form (Upload Bukti Pembayaran) */
    Route::get('/payment', [PaymentController::class, 'create'])
        ->name('payment.create');  
        // View: resources/js/Pages/Vendor/Payment/PaymentPage.jsx

    Route::post('/payment', [PaymentController::class, 'store'])
        ->name('payment.store');


    /* 4️⃣ Payment Proof Page */
    Route::get('/payment/proof/{id}', function ($id) {
        return Inertia::render('Vendor/Payment/PaymentProofPage', [
            'id' => $id
        ]);
    })->name('payment.proof');

});


/*
|--------------------------------------------------------------------------
| AUTH ROUTES (Laravel Breeze)
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';
