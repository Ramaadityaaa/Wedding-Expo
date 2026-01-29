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
                'email' => 'ullulazmia.l@gmail.com', // email unik
            ],
            [
                'name'              => 'Admin WeddingExpo',
                'password'          => Hash::make('password'), 
                'role'              => 'ADMIN', 
                'phone'             => '081234567890', 
                'email_verified_at' => now(), 
            ]
        );


        User::updateOrCreate(
            ['email' => 'vendor@weddingexpo.com'],
            [
                'name'              => 'Vendor Demo',
                'password'          => Hash::make('password'),
                'role'              => 'VENDOR',
                'phone'             => '081298765432',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'customer@weddingexpo.com'],
            [
                'name'              => 'Customer Demo',
                'password'          => Hash::make('password'),
                'role'              => 'CUSTOMER',
                'phone'             => '081298765431',
                'email_verified_at' => now(),
            ]
        );
    }
}
