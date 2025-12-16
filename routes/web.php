<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- KONTROLER UMUM ---
use App\Http\Controllers\HomeController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\PaymentProofController;
use App\Http\Controllers\ChatController;

// --- KONTROLER CUSTOMER (PENTING) ---
use App\Http\Controllers\Customer\BookingController;
use App\Http\Controllers\Customer\CustomerPaymentFlowController; // <--- WAJIB IMPORT INI

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
use App\Http\Controllers\Vendor\VendorPackageController;
use App\Http\Controllers\Vendor\VendorPortfolioController;
use App\Http\Controllers\Vendor\MembershipController;
use App\Http\Controllers\Vendor\VendorPaymentFlowController;
use App\Http\Controllers\Vendor\VendorReviewController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Vendor\BankSettingsController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Vendor\VendorOrderController;

// --- MODELS ---
use App\Models\User;
use App\Models\WeddingOrganizer;

/*
|--------------------------------------------------------------------------- 
| PUBLIC CUSTOMER & GUEST ROUTES
|--------------------------------------------------------------------------- 
*/

// Rute Halaman Home
Route::get('/', [HomeController::class, 'index'])->name('home');

// Rute Halaman Favorit
Route::get('/favorites', function () {
    return Inertia::render('Customer/FavoritePage');
})->name('favorites');

// Rute Halaman Vendor Detail untuk Customer
Route::get('/vendors/{vendor}', function ($vendorId) {
    // Pastikan WeddingOrganizer sudah di-use di atas
    $vendor = WeddingOrganizer::with([
        'packages',
        'portfolios',
        'reviews.user' // Eager load user yang memberi review
    ])->findOrFail($vendorId);

    return Inertia::render('Customer/VendorDetails', [
        'vendor' => $vendor,
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
| AUTHENTICATED ROUTES (GENERAL - User, Vendor & Admin)
|--------------------------------------------------------------------------- 
*/
Route::middleware(['auth'])->group(function () {

    // --- FITUR PEMESANAN (BOOKING) ---
    // Dipanggil oleh SelectDate.jsx
    Route::post('/order', [BookingController::class, 'store'])->name('order.store');
    Route::get('/select-date/{vendorId}/{packageId}', [BookingController::class, 'selectDate'])->name('order.selectDate');

    // --- FITUR CHAT REAL-TIME (API) ---
    Route::get('/chat/conversations', [ChatController::class, 'getConversations'])->name('chat.conversations');
    Route::get('/chat/{userId}', [ChatController::class, 'getMessages'])->name('chat.get');
    Route::post('/chat', [ChatController::class, 'sendMessage'])->name('chat.send');

    // --- HELPER: CARI KONTAK ADMIN ---
    Route::get('/admin/contact', function () {
        $admin = User::where('role', 'ADMIN')->first();

        return response()->json([
            'id' => $admin ? $admin->id : null,
            'name' => 'Admin Support',
            'avatar' => 'https://ui-avatars.com/api/?name=Admin+Support&background=0D8ABC&color=fff'
        ]);
    })->name('admin.contact');

    // >>> [CUSTOMER PAYMENT FLOW] <<< 
    Route::group(['prefix' => 'customer', 'as' => 'customer.'], function () {

        // --- 1. RUTE STATIS (TARUH DI ATAS) ---
        // Halaman Upload Bukti (GET)
        Route::get('/payment/upload', [CustomerPaymentFlowController::class, 'uploadProofPage'])->name('payment.proof.page');

        // Proses Simpan Bukti Pembayaran (POST)
        Route::post('/payment/upload', [CustomerPaymentFlowController::class, 'uploadProof'])->name('payment.proof.store');

        // Halaman Loading / Status
        Route::get('/payment/loading', [CustomerPaymentFlowController::class, 'paymentLoadingPage'])->name('payment.loading');

        // --- 2. RUTE DINAMIS / WILDCARD (TARUH DI BAWAH) ---
        // Laravel akan membaca ini TERAKHIR, sehingga "upload" atau "loading" tidak dianggap sebagai {orderId}

        // Tampilkan Halaman Rincian Pembayaran (PaymentPage)
        Route::get('/payment/{orderId}', [CustomerPaymentFlowController::class, 'create'])->name('payment.page');

        // Invoice (Opsional)
        Route::get('/payment/{orderId}/invoice', [BookingController::class, 'showPaymentInvoice'])->name('payment.invoice');
    });
});

/*
|--------------------------------------------------------------------------- 
| VENDOR ROUTES
|--------------------------------------------------------------------------- 
*/
Route::prefix('vendor')
    ->name('vendor.') // Prefix nama route jadi 'vendor.dashboard', dll
    ->middleware(['auth', 'vendor'])
    ->group(function () {

        // RUTE DASHBOARD VENDOR (Nama: vendor.dashboard)
        Route::get('/dashboard', [VendorDashboard::class, 'index'])->name('dashboard');

        // >>> RUTE PROFILE & PASSWORD VENDOR <<<
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/password', [PasswordController::class, 'update'])->name('password.update');

        // BANK SETTINGS (Pengaturan Rekening Vendor)
        Route::get('/bank-settings', [BankSettingsController::class, 'edit'])->name('bank.edit');
        Route::patch('/bank-settings', [BankSettingsController::class, 'update'])->name('bank.update');

        // MEMBERSHIP
        Route::get('/membership', [MembershipController::class, 'index'])->name('membership.index');
        Route::post('/membership/subscribe', [MembershipController::class, 'subscribe'])->name('membership.subscribe');

        // PACKAGES
        Route::get('/packages', [VendorPackageController::class, 'index'])->name('packages.index');
        Route::post('/packages', [VendorPackageController::class, 'store'])->name('packages.store');
        Route::put('/packages/{id}', [VendorPackageController::class, 'update'])->name('packages.update');
        Route::delete('/packages/{id}', [VendorPackageController::class, 'destroy'])->name('packages.destroy');

        // PORTFOLIO
        Route::get('/portfolio', [VendorPortfolioController::class, 'index'])->name('portfolio.index');
        Route::post('/portfolio', [VendorPortfolioController::class, 'store'])->name('portfolio.store');
        Route::delete('/portfolio/{id}', [VendorPortfolioController::class, 'destroy'])->name('portfolio.destroy');

        // REVIEWS
        Route::get('/reviews', [VendorReviewController::class, 'index'])->name('reviews.index');
        Route::post('/reviews/{id}/reply', [VendorReviewController::class, 'reply'])->name('reviews.reply');

        // --- HALAMAN CHAT VENDOR (INBOX) ---
        Route::get('/chat-page', function () {
            return Inertia::render('Vendor/pages/ChatPage');
        })->name('chat.index');

        // PAYMENT PROOF
        Route::get('/payment-proofs', [PaymentProofController::class, 'vendorIndex'])->name('paymentproof.index');

        // PAYMENT FLOW (Vendor membayar Membership ke Admin)
        Route::group(['prefix' => 'payment', 'as' => 'payment.'], function () {
            Route::get('/upload', [VendorPaymentFlowController::class, 'uploadProofPage'])->name('proof.upload');
            Route::post('/upload', [VendorPaymentFlowController::class, 'uploadProof'])->name('proof.store');
            Route::get('/loading', [VendorPaymentFlowController::class, 'paymentLoadingPage'])->name('loading');
            Route::get('/{invoiceId}', [VendorPaymentFlowController::class, 'create'])->name('create');
        });

        // MANAJEMEN PESANAN (CUSTOMER ORDER)
        Route::get('/orders', [VendorOrderController::class, 'index'])->name('orders.index');
        Route::post('/orders/{id}/verify', [VendorOrderController::class, 'verifyPayment'])->name('orders.verify');
    });

/*
|--------------------------------------------------------------------------- 
| DASHBOARD REDIRECTOR (MODIFIKASI: Customer ke Home)
|--------------------------------------------------------------------------- 
*/
Route::get('/dashboard', function () {
    $user = auth()->user();

    if (!$user)
        return redirect()->route('home');

    // Admin ke Dashboard Admin
    if ($user->role === 'ADMIN')
        return redirect()->route('admin.dashboard');

    // Vendor ke Dashboard Vendor
    if ($user->role === 'VENDOR')
        return redirect()->route('vendor.dashboard');

    // Customer (User Biasa) -> Redirect ke Home (8000)
    return redirect()->route('home');
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------- 
| ADMIN ROUTES
|--------------------------------------------------------------------------- 
*/
Route::prefix('admin')
    ->name('admin.') // Prefix nama route jadi 'admin.dashboard', dll
    ->middleware(['auth', 'admin'])
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // VENDOR MANAGEMENT
        Route::get('/vendors', [AdminVendorController::class, 'index'])->name('vendors.index');
        Route::patch('/vendors/{vendor}/status', [AdminVendorController::class, 'updateStatus'])->name('vendors.update-status');
        Route::delete('/vendors/{vendor}', [AdminVendorController::class, 'destroy'])->name('vendors.destroy');

        // PAYMENT MANAGEMENT
        Route::get('/payment-proofs', [PaymentProofController::class, 'index'])->name('paymentproof.index');
        Route::post('/payment-proof/{id}/status', [PaymentProofController::class, 'updateStatus'])->name('paymentproof.status');
        Route::get('/payment-settings', [PaymentSettingsController::class, 'index'])->name('payment-settings.index');
        Route::post('/payment-settings', [PaymentSettingsController::class, 'update'])->name('payment-settings.update');

        // USER & PLANS
        Route::get('/users', [UserStatsController::class, 'index'])->name('user-stats.index');
        Route::patch('/users/{id}/status', [UserStatsController::class, 'updateStatus'])->name('users.update-status');
        Route::delete('/users/{id}', [UserStatsController::class, 'destroy'])->name('users.destroy');
        Route::get('/package-plans', [PackagePlanController::class, 'index'])->name('package-plans.index');
        Route::post('/package-plans', [PackagePlanController::class, 'storeOrUpdate'])->name('package-plans.store-update');
        Route::delete('/package-plans/{id}', [PackagePlanController::class, 'destroy'])->name('package-plans.destroy');

        // REVIEWS & CONTENT
        Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');
        Route::patch('/reviews/{id}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');
        Route::patch('/reviews/{id}/reject', [ReviewController::class, 'reject'])->name('reviews.reject');
        Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
        Route::post('/roles/update', [RoleController::class, 'update'])->name('roles.update');
        Route::get('/static-content', [StaticContentController::class, 'index'])->name('static-content.index');
        Route::post('/static-content', [StaticContentController::class, 'update'])->name('static-content.update');

        // --- HALAMAN CHAT ADMIN (SUPPORT) ---
        Route::get('/chat', function () {
            return Inertia::render('Admin/pages/AdminChatPage');
        })->name('chat.index');
    });

require __DIR__ . '/auth.php';
