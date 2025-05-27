<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Reservation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startHour = $this->faker->numberBetween(8, 20);
        $duration = $this->faker->numberBetween(1, 4);
        $endHour = $startHour + $duration;
        
        // Format times as HH:00:00
        $startTime = sprintf('%02d:00:00', $startHour);
        $endTime = sprintf('%02d:00:00', $endHour);
        
        // Random date between now and 3 months in the future
        $date = $this->faker->dateTimeBetween('now', '+3 months')->format('Y-m-d');
        
        return [
            'user_id' => User::factory(),
            'venue_id' => Venue::factory(),
            'date' => $date,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'total_amount' => function (array $attributes) {
                $venue = Venue::find($attributes['venue_id']);
                $startHour = (int) substr($attributes['start_time'], 0, 2);
                $endHour = (int) substr($attributes['end_time'], 0, 2);
                $hours = $endHour - $startHour;
                
                return $venue ? $venue->price * $hours : $this->faker->numberBetween(300, 2000);
            },
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'confirmed', 'confirmed', 'cancelled']),
            'notes' => $this->faker->optional(0.3)->sentence(),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => function (array $attributes) {
                return $this->faker->dateTimeBetween($attributes['created_at'], 'now');
            },
        ];
    }
    
    /**
     * Indicate that the reservation is confirmed
     */
    public function confirmed(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'confirmed',
            ];
        });
    }
    
    /**
     * Indicate that the reservation is pending
     */
    public function pending(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'pending',
            ];
        });
    }
    
    /**
     * Indicate that the reservation is cancelled
     */
    public function cancelled(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'cancelled',
            ];
        });
    }
}
