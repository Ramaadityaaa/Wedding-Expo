<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- KONTROLER UMUM ---
use App\Http\Controllers\HomeController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\PaymentProofController;

// --- KONTROLER ADMIN ---
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AdminVendorController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\UserStatsController;
use App\Http\Controllers\Admin\PaymentSettingsController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\StaticContentController;
use App\Http\Controllers\Admin\PackagePlanController;

// --- KONTROLER VENDOR ---
use App\Http\Controllers\Vendor\DashboardController as VendorDashboard;
use App\Http\Controllers\Vendor\PackagePageController;
use App\Http\Controllers\Vendor\PortfolioPageController;
use App\Http\Controllers\Vendor\ReviewPageController;
use App\Http\Controllers\Vendor\MembershipController;
use App\Http\Controllers\Vendor\VendorPaymentFlowController;
use App\Http\Controllers\ProfileController; // Diimpor sekali di sini
use App\Http\Controllers\Auth\PasswordController; // Diperlukan untuk password.update

/*
|--------------------------------------------------------------------------- 
| PUBLIC CUSTOMER & GUEST ROUTES
|--------------------------------------------------------------------------- 
*/

Route::get('/', [HomeController::class, 'index'])->name('home');

// Rute Halaman Favorit (Memuat komponen Inertia FavoritePage)
Route::get('/favorites', function () {
    return Inertia::render('Customer/FavoritePage');
})->name('favorites');

// Rute Halaman Vendor Detail untuk Customer
Route::get('/vendors/{vendor}', function ($vendorId) {
    // Mengambil data vendor berdasarkan ID
    $vendor = App\Models\Vendor::findOrFail($vendorId);

    // Kirim data vendor ke komponen VendorDetails di React (Inertia)
    return Inertia::render('Customer/VendorDetails', [
        'vendor' => $vendor, // Data vendor yang akan ditampilkan
    ]);
})->name('vendors.details');


// Rute pendaftaran vendor
Route::get('/register/vendor', [HomeController::class, 'vendorRegister'])->name('vendor.register');
Route::post('/register/vendor', [HomeController::class, 'vendorStore'])->name('vendor.store');

// API Publik
Route::prefix('api')->group(function () {
    Route::get('/vendors', [VendorController::class, 'index'])->name('api.vendors.index');
    Route::get('/vendors/{vendor}', [VendorController::class, 'show'])->name('api.vendors.show');
});


/*
|--------------------------------------------------------------------------- 
| CUSTOMER/GENERAL AUTHENTICATED ROUTES
|--------------------------------------------------------------------------- 
| Rute profil standar yang digunakan oleh Customer atau pengguna non-vendor.
| Diperlukan oleh komponen UpdateProfileInformationForm.jsx
*/
Route::middleware('auth')->group(function () {
    // Rute untuk menampilkan halaman edit profil customer/umum
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // Rute untuk memproses pembaruan nama/email customer/umum
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    // Rute untuk memproses pembaruan kata sandi customer/umum
    Route::put('/password', [PasswordController::class, 'update'])->name('password.update');
    // Rute untuk menghapus akun (jika diperlukan)
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Rute Verifikasi Email (Digunakan oleh UpdateProfileInformationForm)
    Route::post('email/verification-notification', [App\Http\Controllers\Auth\EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');
});


/*
|--------------------------------------------------------------------------- 
| VENDOR ROUTES
|--------------------------------------------------------------------------- 
*/
Route::prefix('vendor')
    ->name('vendor.')
    ->middleware(['auth', 'vendor'])
    ->group(function () {

        Route::get('/dashboard', [VendorDashboard::class, 'index'])->name('dashboard');

        // 2. PROFILE VENDOR
        // Menambahkan rute edit yang hilang
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        // Vendor juga bisa ganti password, menggunakan rute umum 'password.update' atau vendor spesifik jika ada

        // 3. MEMBERSHIP MANAGEMENT 
        Route::get('/membership', [MembershipController::class, 'index'])->name('membership.index');
        Route::post('/membership/subscribe', [MembershipController::class, 'subscribe'])->name('membership.subscribe');

        // 4. PACKAGE MANAGEMENT 
        Route::get('/packages', [PackagePageController::class, 'index'])->name('packages.index');

        // 5. PORTFOLIO
        Route::get('/portfolio', [PortfolioPageController::class, 'index'])->name('portfolio.index');

        // 6. REVIEWS
        Route::get('/reviews', [ReviewPageController::class, 'index'])->name('reviews.index');

        // 7. PAYMENT PROOF (Index Vendor)
        Route::get('/payment-proofs', [PaymentProofController::class, 'vendorIndex'])->name('paymentproof.index');

        // 8. PAYMENT INITIATION & FLOW (Menggunakan VendorPaymentFlowController)
        Route::group(['prefix' => 'payment', 'as' => 'payment.'], function () {

            // 8.1 Halaman Pembayaran (GET /vendor/payment/{invoiceId})
            Route::get('/{invoiceId}', [VendorPaymentFlowController::class, 'create'])->name('create');

            // 8.2 Halaman Upload Bukti (GET /vendor/payment/upload)
            Route::get('/upload', [VendorPaymentFlowController::class, 'uploadProofPage'])->name('proof.upload');

            // 8.3 Simpan Bukti (POST /vendor/payment/upload)
            Route::post('/upload', [VendorPaymentFlowController::class, 'uploadProof'])->name('proof.store');

            // 8.4 Halaman Loading/Sukses Pembayaran
            Route::get('/loading', [VendorPaymentFlowController::class, 'paymentLoadingPage'])->name('loading');
        });
    });

/*
|---------------------------------------------------------------------------
| DASHBOARD REDIRECTOR (AFTER LOGIN)
|---------------------------------------------------------------------------
*/
Route::get('/dashboard', function () {
    $user = auth()->user();

    if (! $user) return redirect()->route('home');
    if ($user->role === 'ADMIN') return redirect()->route('admin.dashboard');
    if ($user->role === 'VENDOR') return redirect()->route('vendor.dashboard');

    return Inertia::render('Customer/Dashboard', ['isLoggedIn' => true, 'user' => $user]);
})->middleware(['auth', 'verified'])->name('dashboard');


/*
|--------------------------------------------------------------------------- 
| ADMIN ROUTES (PREFIX: /admin)
|--------------------------------------------------------------------------- 
*/
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin'])
    ->group(function () {
        // [ADMIN ROUTES TIDAK BERUBAH DARI PERBAIKAN SEBELUMNYA]
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/vendors', [AdminVendorController::class, 'index'])->name('vendors.index');
        Route::patch('/vendors/{vendor}/status', [AdminVendorController::class, 'updateStatus'])->name('vendors.update-status');
        Route::delete('/vendors/{vendor}', [AdminVendorController::class, 'destroy'])->name('vendors.destroy');
        Route::get('/payment-proofs', [PaymentProofController::class, 'index'])->name('paymentproof.index');
        Route::post('/payment-proof/{id}/status', [PaymentProofController::class, 'updateStatus'])->name('paymentproof.status');
        Route::get('/payment-settings', [PaymentSettingsController::class, 'index'])->name('payment-settings.index');
        Route::post('/payment-settings', [PaymentSettingsController::class, 'update'])->name('payment-settings.update');
        Route::get('/users', [UserStatsController::class, 'index'])->name('user-stats.index');
        Route::patch('/users/{id}/status', [UserStatsController::class, 'updateStatus'])->name('users.update-status');
        Route::delete('/users/{id}', [UserStatsController::class, 'destroy'])->name('users.destroy');
        Route::get('/package-plans', [PackagePlanController::class, 'index'])->name('package-plans.index');
        Route::post('/package-plans', [PackagePlanController::class, 'storeOrUpdate'])->name('package-plans.store-update');
        Route::delete('/package-plans/{id}', [PackagePlanController::class, 'destroy'])->name('package-plans.destroy');
        Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');
        Route::patch('/reviews/{id}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');
        Route::patch('/reviews/{id}/reject', [ReviewController::class, 'reject'])->name('reviews.reject');
        Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
        Route::post('/roles/update', [RoleController::class, 'update'])->name('roles.update');
        Route::get('/static-content', [StaticContentController::class, 'index'])->name('static-content.index');
        Route::post('/static-content', [StaticContentController::class, 'update'])->name('static-content.update');
    });

/*
|---------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------- 
| Biasanya berisi rute login, register, reset password.
*/
require __DIR__ . '/auth.php';