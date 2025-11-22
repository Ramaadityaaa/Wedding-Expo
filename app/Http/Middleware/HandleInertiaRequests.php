<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\WeddingOrganizer; // Import model WeddingOrganizer
use App\Models\User; // Import model User (asumsi ada)

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Ambil user yang sedang login
        $auth = $request->user();
        $sharedUser = null;
        $sharedRole = null;

        if ($auth) {
            if ($auth instanceof WeddingOrganizer) {
                // Jika yang login adalah Vendor (WeddingOrganizer)
                $sharedUser = [
                    'id'    => $auth->id,
                    // Di sini kita pakai 'name' dari vendor (nama bisnis)
                    'name'  => $auth->name, 
                    // Gunakan contact_email sebagai email login
                    'email' => $auth->contact_email, 
                    'type'  => $auth->type,
                    'isApproved' => $auth->isApproved,
                    // Tambahkan properti lain yang diperlukan di frontend
                ];
                $sharedRole = 'vendor';

            } else if ($auth instanceof User) {
                // Jika yang login adalah User (Customer/Admin)
                $sharedUser = [
                    'id'    => $auth->id,
                    'name'  => $auth->name,
                    'email' => $auth->email,
                    'role'  => $auth->role, // Asumsi User memiliki kolom role
                ];
                $sharedRole = $auth->role;
            }
        }
        
        return array_merge(parent::share($request), [
            // Kirim data user yang sudah diolah dan role-nya
            'auth' => [
                'user' => $sharedUser,
                'role' => $sharedRole,
            ],
            
            // Tambahkan flash message jika ada (untuk notifikasi sukses/gagal)
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}