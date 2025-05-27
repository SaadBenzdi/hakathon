<?php

namespace Database\Seeders;

use App\Models\Reservation;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get users and venues IDs for seeding
        $userIds = User::where('role', 'client')->pluck('id')->toArray();
        $venueIds = Venue::pluck('id')->toArray();
        
        // Create 20 random reservations
        for ($i = 0; $i < 20; $i++) {
            $userId = $userIds[array_rand($userIds)];
            $venueId = $venueIds[array_rand($venueIds)];
            $venue = Venue::find($venueId);
            
            $startHour = rand(8, 20);
            $duration = rand(1, 3);
            $endHour = $startHour + $duration;
            
            $startTime = sprintf('%02d:00:00', $startHour);
            $endTime = sprintf('%02d:00:00', $endHour);
            
            // Random date between -30 days and +60 days
            $date = now()->addDays(rand(-30, 60))->format('Y-m-d');
            
            // Calculate total amount
            $totalAmount = $venue->price * $duration;
            
            // Random status with confirmed being more common
            $status = ['pending', 'confirmed', 'confirmed', 'confirmed', 'cancelled'][rand(0, 4)];
            
            Reservation::create([
                'user_id' => $userId,
                'venue_id' => $venueId,
                'date' => $date,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'total_amount' => $totalAmount,
                'status' => $status,
                'notes' => rand(0, 1) ? 'Lorem ipsum dolor sit amet' : null,
                'created_at' => now()->subDays(rand(1, 30)),
                'updated_at' => now(),
            ]);
        }
    }
}
