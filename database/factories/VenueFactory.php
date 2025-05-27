<?php

namespace Database\Factories;

use App\Models\Venue;
use Illuminate\Database\Eloquent\Factories\Factory;

class VenueFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Venue::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['sport', 'conference', 'party']);
        
        $sportVenues = ['Terrain de Football', 'Terrain de Basketball', 'Court de Tennis', 'Piscine', 'Salle de Gym'];
        $conferenceVenues = ['Salle de Conférence', 'Salle de Réunion', 'Auditorium', 'Espace de Co-working', 'Salle de Formation'];
        $partyVenues = ['Salle de Fête', 'Salle de Mariage', 'Espace Événementiel', 'Terrasse Panoramique', 'Jardin'];
        
        $amenities = [];
        if ($type === 'sport') {
            $name = $this->faker->randomElement($sportVenues) . ' ' . $this->faker->word;
            $amenities = $this->faker->randomElements(['Vestiaires', 'Douches', 'Éclairage LED', 'Parking', 'Gradins', 'Matériel Sportif'], $this->faker->numberBetween(2, 4));
            $capacity = $this->faker->numberBetween(10, 50);
            $price = $this->faker->numberBetween(300, 800);
        } elseif ($type === 'conference') {
            $name = $this->faker->randomElement($conferenceVenues) . ' ' . $this->faker->word;
            $amenities = $this->faker->randomElements(['Projecteur', 'Wifi Haut Débit', 'Tableau Blanc', 'Système Audio', 'Climatisation', 'Catering'], $this->faker->numberBetween(2, 4));
            $capacity = $this->faker->numberBetween(20, 100);
            $price = $this->faker->numberBetween(500, 1200);
        } else {
            $name = $this->faker->randomElement($partyVenues) . ' ' . $this->faker->word;
            $amenities = $this->faker->randomElements(['Cuisine Équipée', 'Système Audio', 'Piste de Danse', 'Décoration', 'Bar', 'Terrasse'], $this->faker->numberBetween(2, 4));
            $capacity = $this->faker->numberBetween(50, 300);
            $price = $this->faker->numberBetween(1000, 2500);
        }
        
        $cities = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir'];
        $locations = ['Centre', 'Quartier des Affaires', 'Zone Industrielle', 'Nouvelle Ville', 'Ancien Quartier'];
        $location = $this->faker->randomElement($cities) . ' - ' . $this->faker->randomElement($locations);
        
        return [
            'name' => $name,
            'type' => $type,
            'capacity' => $capacity,
            'price' => $price,
            'location' => $location,
            'amenities' => $amenities,
            'description' => $this->faker->paragraph(),
            'image_url' => 'https://source.unsplash.com/random/400x300?venue=' . $this->faker->numberBetween(1, 100),
            'status' => $this->faker->randomElement(['active', 'active', 'active', 'maintenance', 'inactive']),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => function (array $attributes) {
                return $this->faker->dateTimeBetween($attributes['created_at'], 'now');
            },
        ];
    }
}
