<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Akun ADMIN
        User::updateOrCreate(
            ['email' => 'rama@gmail.com'],
            [
                'name'              => 'Admin WeddingExpo',
                'password'          => Hash::make('password'),
                'role'              => 'ADMIN',
                'phone'             => '081234567890',
                'email_verified_at' => now(),
                'status'            => 'Active',
            ]
        );

        // 2. Akun CUSTOMER
        User::updateOrCreate(
            ['email' => 'customer@weddingexpo.com'],
            [
                'name'              => 'Customer Demo',
                'password'          => Hash::make('password'),
                'role'              => 'CUSTOMER',
                'phone'             => '081298765431',
                'email_verified_at' => now(),
                'status'            => 'Active',
            ]
        );
    }
}
