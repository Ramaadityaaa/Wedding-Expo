<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

// --- KONTROLER UMUM ---
use App\Http\Controllers\HomeController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\PaymentProofController;
use App\Http\Controllers\ChatController;

// --- KONTROLER CUSTOMER ---
use App\Http\Controllers\Customer\BookingController;
use App\Http\Controllers\Customer\CustomerPaymentFlowController;
use App\Http\Controllers\Customer\CustomerOrderController;
use App\Http\Controllers\Customer\FavoriteController;
use App\Http\Controllers\Customer\CustomerReviewController;

// --- KONTROLER ADMIN ---
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AdminVendorController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Admin\UserStatsController;
use App\Http\Controllers\Admin\PaymentSettingsController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\StaticContentController;
use App\Http\Controllers\Admin\PackagePlanController;
use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;

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
use App\Http\Controllers\Vendor\NotificationController as VendorNotificationController;

// --- MODELS ---
use App\Models\User;
use App\Models\Vendor;
use App\Models\Package;
use App\Models\Review;
use App\Models\Favorite;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');

/**
 * HALAMAN SEMUA VENDOR (PUBLIC)
 */
Route::get('/vendors', [VendorController::class, 'publicIndexPage'])->name('vendors.index');

/**
 * FAVORITES
 */
Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites');

Route::post('/favorites/{vendor}/toggle', [FavoriteController::class, 'toggle'])
    ->middleware('auth')
    ->name('favorites.toggle');

Route::delete('/favorites/{vendor}', [FavoriteController::class, 'destroy'])
    ->middleware('auth')
    ->name('favorites.destroy');

/**
 * VENDOR DETAILS (CUSTOMER)
 */
Route::get('/vendors/{vendor}', function (Vendor $vendor) {
    $userId = auth()->id();

    $vendor->load([
        'packages',
        'portfolios',
        'reviews' => function ($q) use ($userId) {
            $q->with('user')
                ->when($userId, function ($qq) use ($userId) {
                    $qq->where(function ($w) use ($userId) {
                        $w->where('status', Review::STATUS_APPROVED)
                            ->orWhere('user_id', $userId);
                    });
                }, function ($qq) {
                    $qq->where('status', Review::STATUS_APPROVED);
                })
                ->orderByDesc('created_at');
        }
    ]);

    $avgRating = Review::where('vendor_id', $vendor->id)
        ->where('status', Review::STATUS_APPROVED)
        ->avg('rating');

    $reviewCount = Review::where('vendor_id', $vendor->id)
        ->where('status', Review::STATUS_APPROVED)
        ->count();

    $myReview = null;
    if ($userId) {
        $myReview = Review::where('vendor_id', $vendor->id)
            ->where('user_id', $userId)
            ->first();
    }

    $isFavorited = false;
    if ($userId) {
        $isFavorited = Favorite::where('user_id', $userId)
            ->where('vendor_id', $vendor->id)
            ->exists();
    }

    return Inertia::render('Customer/VendorDetails', [
        'vendor' => $vendor,
        'avgRating' => $avgRating ? round($avgRating, 1) : 0,
        'reviewCount' => $reviewCount,
        'myReview' => $myReview,
        'isFavorited' => $isFavorited,
    ]);
})->name('vendors.details');

/**
 * PACKAGE DETAIL (CUSTOMER)
 */
Route::get('/vendors/{vendor}/package/{package}', function (Vendor $vendor, $packageId) {
    $package = Package::with([
        'images' => function ($q) {
            $q->where('is_published', 1)
                ->orderBy('sort_order')
                ->orderBy('id', 'desc');
        }
    ])
        ->where('id', $packageId)
        ->where('vendor_id', $vendor->id)
        ->firstOrFail();

    $package->setAttribute(
        'gallery',
        $package->images->map(fn($img) => Storage::url($img->path))->values()
    );

    return Inertia::render('Customer/PackageDetail', [
        'pkg' => $package,
        'vendor' => $vendor,
    ]);
})->name('package.detail');

/**
 * Register Vendor (Public)
 */
Route::get('/register/vendor', [HomeController::class, 'vendorRegister'])->name('vendor.register');
Route::post('/register/vendor', [HomeController::class, 'vendorStore'])->name('vendor.store');

/**
 * API Vendors (PUBLIC)
 */
Route::prefix('api')->group(function () {
    Route::get('/vendors', [VendorController::class, 'index'])->name('api.vendors.index');
    Route::get('/vendors/{vendor}', [VendorController::class, 'show'])->name('api.vendors.show');
});

/*
|--------------------------------------------------------------------------
| AUTH ROUTES (GENERAL)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {

    /**
     * API Check Availability (AUTH)
     */
    Route::prefix('api')->group(function () {
        Route::post('/check-availability', [BookingController::class, 'checkAvailability'])
            ->name('api.checkAvailability');
    });

    /**
     * CUSTOMER REVIEW
     */
    Route::post('/vendors/{vendor}/reviews', [CustomerReviewController::class, 'upsert'])
        ->name('customer.reviews.upsert');

    Route::delete('/vendors/{vendor}/reviews', [CustomerReviewController::class, 'destroy'])
        ->name('customer.reviews.destroy');

    /**
     * Booking / Order / Payment (Customer)
     */
    Route::get('/order/select-date/{vendorId}/{packageId}', [BookingController::class, 'selectDate'])
        ->name('order.selectDate');

    Route::post('/order', [BookingController::class, 'store'])->name('order.store');

    Route::get('/payment/{orderId}', [BookingController::class, 'showPaymentPage'])
        ->name('payment.page');

    /**
     * Chat
     */
    Route::get('/chat/conversations', [ChatController::class, 'getConversations'])->name('chat.conversations');
    Route::get('/chat/{userId}', [ChatController::class, 'getMessages'])->name('chat.get');
    Route::post('/chat', [ChatController::class, 'sendMessage'])->name('chat.send');

    /**
     * Admin contact helper
     */
    Route::get('/admin/contact', function () {
        $admin = User::where('role', 'ADMIN')->first();

        return response()->json([
            'id' => $admin ? $admin->id : null,
            'name' => 'Admin Support',
            'avatar' => 'https://ui-avatars.com/api/?name=Admin+Support&background=0D8ABC&color=fff'
        ]);
    })->name('admin.contact');

    /**
     * Customer Dashboard
     */
    Route::get('/customer/dashboard', [HomeController::class, 'index'])->name('customer.dashboard');

    /**
     * Customer Payment Flow
     */
    Route::prefix('customer')->as('customer.')->group(function () {
        Route::get('/payment/upload', [CustomerPaymentFlowController::class, 'uploadProofPage'])->name('payment.proof.page');
        Route::post('/payment/upload', [CustomerPaymentFlowController::class, 'uploadProof'])->name('payment.proof.store');
        Route::get('/payment/loading', [CustomerPaymentFlowController::class, 'paymentLoadingPage'])->name('payment.loading');
        Route::get('/payment/{orderId}', [BookingController::class, 'showPaymentPage'])->name('payment.page');
        Route::get('/payment/{orderId}/invoice', [BookingController::class, 'showPaymentInvoice'])->name('payment.invoice');
    });

    /**
     * Customer Orders
     */
    Route::get('/customer/orders', [CustomerOrderController::class, 'index'])->name('customer.orders.index');
    Route::get('/customer/orders/{orders}', [CustomerOrderController::class, 'show'])->name('customer.orders.show');
});

/*
|--------------------------------------------------------------------------
| VENDOR ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    Route::get('/vendor/verification-status', function () {
        $vendor = auth()->user()->vendor;

        return Inertia::render('Auth/Vendor/VerificationStatus', [
            'status' => $vendor ? $vendor->isApproved : 'PENDING',
            'rejectionReason' => $vendor ? $vendor->rejection_reason : null,
        ]);
    })->name('vendor.verification');
});

Route::prefix('vendor')
    ->name('vendor.')
    ->middleware(['auth', 'vendor_approved'])
    ->group(function () {

        Route::get('/dashboard', [VendorDashboard::class, 'index'])->name('dashboard');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/password', [PasswordController::class, 'update'])->name('password.update');

        Route::get('/bank-settings', [BankSettingsController::class, 'edit'])->name('bank.edit');
        Route::patch('/bank-settings', [BankSettingsController::class, 'update'])->name('bank.update');

        Route::get('/membership', [MembershipController::class, 'index'])->name('membership.index');
        Route::post('/membership/subscribe', [MembershipController::class, 'subscribe'])->name('membership.subscribe');

        Route::get('/packages', [VendorPackageController::class, 'index'])->name('packages.index');
        Route::post('/packages', [VendorPackageController::class, 'store'])->name('packages.store');
        Route::put('/packages/{id}', [VendorPackageController::class, 'update'])->name('packages.update');
        Route::delete('/packages/{id}', [VendorPackageController::class, 'destroy'])->name('packages.destroy');

        Route::get('/portfolio', [VendorPortfolioController::class, 'index'])->name('portfolio.index');
        Route::post('/portfolio', [VendorPortfolioController::class, 'store'])->name('portfolio.store');
        Route::delete('/portfolio/{id}', [VendorPortfolioController::class, 'destroy'])->name('portfolio.destroy');

        Route::get('/reviews', [VendorReviewController::class, 'index'])->name('reviews.index');
        Route::post('/reviews/{id}/reply', [VendorReviewController::class, 'reply'])->name('reviews.reply');

        Route::get('/chat-page', function () {
            return Inertia::render('Vendor/pages/ChatPage');
        })->name('chat.index');

        Route::get('/payment-proofs', [PaymentProofController::class, 'vendorIndex'])->name('paymentproof.index');

        /**
         * FIX: vendor payments index agar sesuai file yang ada
         * resources/js/Pages/Vendor/pages/PaymentManagementPage.jsx
         */
        Route::prefix('payments')->as('payment.')->group(function () {
            Route::get('/', function () {
                return Inertia::render('Vendor/pages/PaymentManagementPage');
            })->name('index');

            Route::get('/loading', [VendorPaymentFlowController::class, 'paymentLoadingPage'])->name('loading');
            Route::get('/upload', [VendorPaymentFlowController::class, 'uploadProofPage'])->name('proof.upload');
            Route::post('/upload', [VendorPaymentFlowController::class, 'uploadProof'])->name('proof.store');
            Route::get('/{invoiceId}', [VendorPaymentFlowController::class, 'create'])->name('create');
        });

        Route::get('/orders', [VendorOrderController::class, 'index'])->name('orders.index');
        Route::post('/orders/{id}/verify', [VendorOrderController::class, 'verifyPayment'])->name('orders.verify');
        Route::patch('/orders/{id}/complete', [VendorOrderController::class, 'completeOrder'])->name('orders.complete');

        /*
        |--------------------------------------------------------------------------
        | VENDOR NOTIFICATIONS
        |--------------------------------------------------------------------------
        */
        Route::get('/notifications', [VendorNotificationController::class, 'index'])->name('notifications.index');
        Route::post('/notifications/{id}/read', [VendorNotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::post('/notifications/read-all', [VendorNotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

        Route::get('/notifications-page', function () {
            return Inertia::render('Vendor/pages/NotificationsPage');
        })->name('notifications.page');
    });

/*
|--------------------------------------------------------------------------
| DASHBOARD REDIRECTOR
|--------------------------------------------------------------------------
*/
Route::get('/dashboard', function () {
    $user = auth()->user();

    if (!$user) return redirect()->route('home');

    if ($user->role === 'ADMIN') return redirect()->route('admin.dashboard');

    if ($user->role === 'VENDOR') {
        $vendor = $user->vendor;
        if (!$vendor || $vendor->isApproved !== 'APPROVED') {
            return redirect()->route('vendor.verification');
        }
        return redirect()->route('vendor.dashboard');
    }

    return redirect()->route('home');
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

        Route::get('/vendors', [AdminVendorController::class, 'index'])->name('vendors.index');
        Route::patch('/vendors/{vendor}/status', [AdminVendorController::class, 'updateStatus'])->name('vendors.update-status');
        Route::delete('/vendors/{vendor}', [AdminVendorController::class, 'destroy'])->name('vendors.destroy');

        Route::get('/payment-proofs', [PaymentProofController::class, 'index'])->name('paymentproof.index');
        Route::post('/payment-proof/{id}/status', [PaymentProofController::class, 'updateStatus'])->name('paymentproof.status');
        Route::delete('/payment-proof/{id}', [PaymentProofController::class, 'destroy'])->name('paymentproof.destroy');

        Route::get('/payment-settings', [PaymentSettingsController::class, 'index'])->name('payment-settings.index');
        Route::post('/payment-settings', [PaymentSettingsController::class, 'update'])->name('payment-settings.update');

        Route::get('/users', [UserStatsController::class, 'index'])->name('user-stats.index');
        Route::patch('/users/{id}/status', [UserStatsController::class, 'updateStatus'])->name('users.update-status');
        Route::delete('/users/{id}', [UserStatsController::class, 'destroy'])->name('users.destroy');

        Route::get('/package-plans', [PackagePlanController::class, 'index'])->name('package-plans.index');
        Route::post('/package-plans', [PackagePlanController::class, 'storeOrUpdate'])->name('package-plans.store-update');
        Route::delete('/package-plans/{id}', [PackagePlanController::class, 'destroy'])->name('package-plans.destroy');

        Route::get('/reviews', [AdminReviewController::class, 'index'])->name('reviews.index');
        Route::patch('/reviews/{id}/approve', [AdminReviewController::class, 'approve'])->name('reviews.approve');
        Route::patch('/reviews/{id}/reject', [AdminReviewController::class, 'reject'])->name('reviews.reject');

        Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
        Route::post('/roles/update', [RoleController::class, 'update'])->name('roles.update');

        Route::get('/static-content', [StaticContentController::class, 'index'])->name('static-content.index');
        Route::post('/static-content', [StaticContentController::class, 'update'])->name('static-content.update');

        /*
        |--------------------------------------------------------------------------
        | ADMIN NOTIFICATIONS
        |--------------------------------------------------------------------------
        */
        Route::get('/notifications', [AdminNotificationController::class, 'index'])->name('notifications.index');
        Route::get('/notifications/latest', [AdminNotificationController::class, 'index'])->name('notifications.latest');

        Route::get('/notifications/unread-count', function (\Illuminate\Http\Request $request) {
            return response()->json([
                'unread_count' => $request->user()->unreadNotifications()->count(),
            ]);
        })->name('notifications.unread-count');

        Route::post('/notifications/{id}/read', [AdminNotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::post('/notifications/read-all', [AdminNotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

        Route::get('/notifications-page', function () {
            return Inertia::render('Admin/pages/NotificationsPage');
        })->name('notifications.page');

        Route::get('/chat', function () {
            return Inertia::render('Admin/pages/AdminChatPage');
        })->name('chat.index');
    });

require __DIR__ . '/auth.php';
