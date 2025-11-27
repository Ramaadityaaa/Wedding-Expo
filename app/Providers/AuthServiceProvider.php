<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate; // WAJIB: Import Gate Facade
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\User; // WAJIB: Import model User

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // 1. DEFINISI GATE UNTUK ADMIN
        // Gate 'view-admin-area' akan mengizinkan akses HANYA jika peran pengguna adalah ADMIN.
        Gate::define('view-admin-area', function (User $user) {
            return $user->role === 'ADMIN';
        });

        // 2. DEFINISI GATE UNTUK VENDOR
        // Gate 'view-vendor-area' akan mengizinkan akses HANYA jika peran pengguna adalah VENDOR.
        Gate::define('view-vendor-area', function (User $user) {
            return $user->role === 'VENDOR';
        });
        
        // 3. (Opsional, tapi disarankan) Definisi Super Admin (jika ada peran super admin)
        Gate::define('manage-all', function (User $user) {
            return $user->role === 'ADMIN'; // ADMIN bisa mengelola semuanya
        });
    }
}