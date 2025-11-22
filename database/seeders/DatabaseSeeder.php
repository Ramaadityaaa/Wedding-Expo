<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // panggil semua seeder yang kamu punya di sini
        $this->call([
            UserSeeder::class,   // ← seeder admin yang tadi kita buat
            // Kalau nanti ada seeder lain, tinggal tambah di sini
            // VendorSeeder::class,
            // WeddingOrganizerSeeder::class,
        ]);
    }
}
