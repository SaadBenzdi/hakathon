<?php

namespace Database\Seeders;

use App\Models\Venue;
use Illuminate\Database\Seeder;

class VenueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some predefined venues
        $venues = [
            [
                'name' => 'Terrain de Football Premium',
                'type' => 'sport',
                'capacity' => 22,
                'price' => 500,
                'location' => 'Casablanca Centre',
                'amenities' => ['Éclairage LED', 'Vestiaires', 'Parking'],
                'description' => 'Terrain en gazon synthétique de haute qualité avec éclairage professionnel.',
                'image_url' => 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400',
                'status' => 'active',
            ],
            [
                'name' => 'Salle de Conférence Executive',
                'type' => 'conference',
                'capacity' => 50,
                'price' => 800,
                'location' => 'Rabat Business District',
                'amenities' => ['Projecteur 4K', 'Wifi Haut Débit', 'Catering'],
                'description' => 'Salle moderne équipée pour vos réunions et présentations professionnelles.',
                'image_url' => 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400',
                'status' => 'active',
            ],
            [
                'name' => 'Grande Salle de Réception',
                'type' => 'party',
                'capacity' => 200,
                'price' => 1200,
                'location' => 'Marrakech',
                'amenities' => ['Cuisine Équipée', 'Jardin', 'Système Audio'],
                'description' => 'Espace élégant pour vos événements privés et célébrations.',
                'image_url' => 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400',
                'status' => 'active',
            ],
        ];
        
        foreach ($venues as $venue) {
            Venue::create($venue);
        }
        
        // Create additional random venues
        Venue::factory(8)->create();
    }
}
