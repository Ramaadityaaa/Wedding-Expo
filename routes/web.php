<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- KONTROLER UMUM ---
use App\Http\Controllers\HomeController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\PaymentProofController;
use App\Http\Controllers\ChatController;

// --- KONTROLER CUSTOMER ---
use App\Http\Controllers\Customer\BookingController;
use App\Http\Controllers\Customer\CustomerPaymentFlowController;
use App\Http\Controllers\Customer\CustomerOrderController; // Import CustomerOrderController

// --- KONTROLER ADMIN ---
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AdminVendorController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
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
|-------------------------------------------------------------------------- 
| PUBLIC CUSTOMER & GUEST ROUTES
|-------------------------------------------------------------------------- 
*/

// Rute Halaman Home
Route::get('/', [HomeController::class, 'index'])->name('home');

// Rute Halaman Favorit
Route::get('/favorites', function () {
    return Inertia::render('Customer/FavoritePage');
})->name('favorites');

// Rute Halaman Vendor Detail untuk Customer
Route::get('/vendors/{vendor}', function ($vendorId) {
    $vendor = WeddingOrganizer::with([
        'packages',
        'portfolios',
        'reviews.user'
    ])->findOrFail($vendorId);

    return Inertia::render('Customer/VendorDetails', [
        'vendor' => $vendor,
    ]);
})->name('vendors.details');

// Rute untuk halaman detail paket
Route::get('/vendors/{vendor}/package/{package}', function ($vendorId, $packageId) {
    $vendor = WeddingOrganizer::with([
        'packages',
        'portfolios',
        'reviews.user'
    ])->findOrFail($vendorId);

    $package = $vendor->packages->find($packageId);

    if (!$package) {
        abort(404, 'Package not found');
    }

    return Inertia::render('Customer/PackageDetail', [
        'pkg' => $package,
        'vendor' => $vendor,
    ]);
})->name('package.detail');

// Rute untuk memilih tanggal pemesanan paket
Route::get('/order/select-date/{vendorId}/{packageId}', [BookingController::class, 'selectDate'])->name('order.selectDate');

// Rute untuk halaman pembayaran
Route::get('/payment/{orderId}', [BookingController::class, 'showPaymentPage'])->name('payment.page');

// Rute pendaftaran vendor (Guest)
Route::get('/register/vendor', [HomeController::class, 'vendorRegister'])->name('vendor.register');
Route::post('/register/vendor', [HomeController::class, 'vendorStore'])->name('vendor.store');

// API Publik
Route::prefix('api')->group(function () {
    Route::get('/vendors', [VendorController::class, 'index'])->name('api.vendors.index');
    Route::get('/vendors/{vendor}', [VendorController::class, 'show'])->name('api.vendors.show');
});

/*
|-------------------------------------------------------------------------- 
| AUTHENTICATED ROUTES (GENERAL - User, Vendor & Admin)
|-------------------------------------------------------------------------- 
*/
Route::middleware(['auth'])->group(function () {

    // --- FITUR PEMESANAN (BOOKING) ---
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

    // --- CUSTOMER PAYMENT FLOW --- 
    Route::group(['prefix' => 'customer', 'as' => 'customer.'], function () {
        Route::get('/payment/upload', [CustomerPaymentFlowController::class, 'uploadProofPage'])->name('payment.proof.page');
        Route::post('/payment/upload', [CustomerPaymentFlowController::class, 'uploadProof'])->name('payment.proof.store');
        Route::get('/payment/loading', [CustomerPaymentFlowController::class, 'paymentLoadingPage'])->name('payment.loading');
        Route::get('/payment/{orderId}', [BookingController::class, 'showPaymentPage'])->name('payment.page');
        Route::get('/payment/{orderId}/invoice', [BookingController::class, 'showPaymentInvoice'])->name('payment.invoice');
    });

    // --- HALAMAN PESANAN SAYA (CUSTOMER ORDER) --- 
    Route::get('/customer/orders', [CustomerOrderController::class, 'index'])->name('customer.orders.index');// Pesanan Saya
});


/*
|-------------------------------------------------------------------------- 
| VENDOR ROUTES
|-------------------------------------------------------------------------- 
*/

// --- HALAMAN TUNGGU VERIFIKASI AKUN (Aksesible untuk Vendor PENDING/REJECTED) ---
Route::middleware(['auth'])->group(function () {
    Route::get('/vendor/verification-status', function () {
        $vendor = auth()->user()->vendor;
        return Inertia::render('Auth/Vendor/VerificationStatus', [
            'status' => $vendor ? $vendor->isApproved : 'PENDING',
            'rejectionReason' => $vendor ? $vendor->rejection_reason : null,
        ]);
    })->name('vendor.verification');
});

// --- RUTE VENDOR YANG SUDAH DISAPROVE (MEMBERSHIP & MANAJEMEN) ---
Route::prefix('vendor')
    ->name('vendor.')
    ->middleware(['auth', 'vendor_approved'])
    ->group(function () {

        // DASHBOARD
        Route::get('/dashboard', [VendorDashboard::class, 'index'])->name('dashboard');

        // PROFILE & PASSWORD
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/password', [PasswordController::class, 'update'])->name('password.update');

        // BANK SETTINGS
        Route::get('/bank-settings', [BankSettingsController::class, 'edit'])->name('bank.edit');
        Route::patch('/bank-settings', [BankSettingsController::class, 'update'])->name('bank.update');

        // MEMBERSHIP (Pilih Paket)
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

        // CHAT VENDOR
        Route::get('/chat-page', function () {
            return Inertia::render('Vendor/pages/ChatPage');
        })->name('chat.index');

        // PAYMENT PROOF & FLOW (MEMBERSHIP)
        Route::get('/payment-proofs', [PaymentProofController::class, 'vendorIndex'])->name('paymentproof.index');

        // Asumsi ini berada di dalam prefix 'vendor'
        Route::group(['prefix' => 'payments', 'as' => 'payment.'], function () {

            // 1. Halaman Index Utama
            Route::get('/', function () {
                return Inertia::render('Vendor/Payment/PaymentIndexPage');
            })->name('index');

            // 2. Route Loading
            Route::get('/loading', [VendorPaymentFlowController::class, 'paymentLoadingPage'])->name('loading');

            // 3. Route Form Upload Bukti
            Route::get('/upload', [VendorPaymentFlowController::class, 'uploadProofPage'])->name('proof.upload');

            // 4. Route Proses Simpan Bukti
            Route::post('/upload', [VendorPaymentFlowController::class, 'uploadProof'])->name('proof.store');

            // 5. Route Rincian Invoice (Wildcard)
            Route::get('/{invoiceId}', [VendorPaymentFlowController::class, 'create'])->name('create');
        });

        // MANAJEMEN PESANAN (DARI CUSTOMER)
        Route::get('/orders', [VendorOrderController::class, 'index'])->name('orders.index');
        Route::post('/orders/{id}/verify', [VendorOrderController::class, 'verifyPayment'])->name('orders.verify');
    });

/*
|-------------------------------------------------------------------------- 
| DASHBOARD REDIRECTOR (LOGIKA PENYALURAN LOGIN)
|-------------------------------------------------------------------------- 
*/
Route::get('/dashboard', function () {
    $user = auth()->user();

    if (!$user)
        return redirect()->route('home');

    if ($user->role === 'ADMIN') {
        return redirect()->route('admin.dashboard');
    }

    if ($user->role === 'VENDOR') {
        $vendor = $user->vendor;
        if (!$vendor || $vendor->isApproved !== 'APPROVED') {
            return redirect()->route('vendor.verification');
        }
        return redirect()->route('vendor.dashboard');
    }

    // Untuk customer diarahkan ke halaman pesanan
    return redirect()->route('orders.index'); // Pesanan Saya
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|-------------------------------------------------------------------------- 
| ADMIN ROUTES
|-------------------------------------------------------------------------- 
*/
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin'])
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // VENDOR MANAGEMENT
        Route::get('/vendors', [AdminVendorController::class, 'index'])->name('vendors.index');
        Route::patch('/vendors/{vendor}/status', [AdminVendorController::class, 'updateStatus'])->name('vendors.update-status');
        Route::delete('/vendors/{vendor}', [AdminVendorController::class, 'destroy'])->name('vendors.destroy');

        // PAYMENT MANAGEMENT (ADMIN VERIFIKASI BUKTI)
        Route::get('/payment-proofs', [PaymentProofController::class, 'index'])->name('paymentproof.index');
        Route::post('/payment-proof/{id}/status', [PaymentProofController::class, 'updateStatus'])->name('paymentproof.status');
        Route::delete('/payment-proof/{id}', [PaymentProofController::class, 'destroy'])->name('paymentproof.destroy');

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
        Route::get('/reviews', [AdminReviewController::class, 'index'])->name('reviews.index');
        Route::patch('/reviews/{id}/approve', [AdminReviewController::class, 'approve'])->name('reviews.approve');
        Route::patch('/reviews/{id}/reject', [AdminReviewController::class, 'reject'])->name('reviews.reject');
        Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
        Route::post('/roles/update', [RoleController::class, 'update'])->name('roles.update');
        Route::get('/static-content', [StaticContentController::class, 'index'])->name('static-content.index');
        Route::post('/static-content', [StaticContentController::class, 'update'])->name('static-content.update');

        // CHAT ADMIN
        Route::get('/chat', function () {
            return Inertia::render('Admin/pages/AdminChatPage');
        })->name('chat.index');
    });

require __DIR__ . '/auth.php';
