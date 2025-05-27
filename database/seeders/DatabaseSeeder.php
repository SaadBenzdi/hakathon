<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call seeders in the correct order to handle dependencies
        $this->call([
            UserSeeder::class,
            VenueSeeder::class,
            ReservationSeeder::class,
            InvoiceSeeder::class,
        ]);
    }
}
