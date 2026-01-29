<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Jalankan seeder.
     */
    public function run(): void
    {
        // Akun ADMIN utama
        User::updateOrCreate(
            [
                'email' => 'rama@gmail.com', // email unik
            ],
            [
                'name'              => 'Admin WeddingExpo',
                'password'          => Hash::make('password'), 
                'role'              => 'ADMIN', 
                'phone'             => '081234567890', 
                'email_verified_at' => now(), 
            ]
        );

        // (opsional) contoh akun VENDOR nanti
        // User::updateOrCreate(
        //     ['email' => 'vendor@weddingexpo.test'],
        //     [
        //         'name'              => 'Vendor Demo',
        //         'password'          => Hash::make('password123'),
        //         'role'              => 'VENDOR',
        //         'phone'             => '081298765432',
        //         'email_verified_at' => now(),
        //     ]
        // );
    }
}
