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
                'email' => 'admin@weddingexpo.com', // email unik
            ],
            [
                'name'              => 'Admin WeddingExpo',
                'password'          => Hash::make('password123'), // password login
                'role'              => 'ADMIN', // SESUAI ENUM DI MIGRASI
                'phone'             => '081234567890', // opsional
                'email_verified_at' => now(), // supaya lolos middleware "verified"
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
