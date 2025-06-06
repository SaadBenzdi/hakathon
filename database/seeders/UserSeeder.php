<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'email_verified_at' => now(),
            'password' => Hash::make('admin@gmail.com'),
            'qr_code' => Str::random(32),
            'role' => 'admin',
            'remember_token' => Str::random(10),
        ]);
        
        // Create regular users
        User::factory(10)->create([
            'qr_code' => fn() => Str::random(32),
            'role' => 'client',
        ]);
    }
}
