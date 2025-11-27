<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import Controllers
use App\Http\Controllers\VendorController; // Controller Publik
// Hapus import AdminVendorController dan PaymentProofController yang kini di web.php
// use App\Http\Controllers\Admin\AdminVendorController; 
// use App\Http\Controllers\PaymentProofController; 


/*
|--------------------------------------------------------------------------
| Public API Routes (Vendor Browsing)
|--------------------------------------------------------------------------
*/

// Mengambil daftar semua vendor yang sudah di-approve
Route::get('vendors', [VendorController::class, 'index']);
// Mengambil detail satu vendor
Route::get('vendors/{vendor}', [VendorController::class, 'show']);


/*
|--------------------------------------------------------------------------
| Admin API Routes (Telah dipindahkan ke web.php)
|--------------------------------------------------------------------------
| Rute ini telah dipindahkan ke routes/web.php di dalam middleware 'auth' 
| untuk mengatasi masalah 401 Unauthorized pada aplikasi Inertia/Session-based.
*/
// Rute ini dihapus:
/*
Route::middleware(['auth:sanctum', 'can:view-admin-area'])->prefix('admin')->group(function () {
    // ... semua rute admin api
});
*/


/*
|--------------------------------------------------------------------------
| Private API Routes (Vendor & Customer Actions - Memerlukan Auth:Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    
    // Rute default user info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
});