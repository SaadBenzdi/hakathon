<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Factories\Factory;

class InvoiceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Invoice::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reservation_id' => Reservation::factory(),
            'amount' => function (array $attributes) {
                $reservation = Reservation::find($attributes['reservation_id']);
                return $reservation ? $reservation->total_amount : $this->faker->numberBetween(300, 2000);
            },
            'creation_date' => function (array $attributes) {
                $reservation = Reservation::find($attributes['reservation_id']);
                return $reservation ? $reservation->created_at : $this->faker->dateTimeBetween('-1 year', 'now');
            },
            'payment_status' => $this->faker->randomElement(['paid', 'unpaid', 'unpaid', 'refunded']),
            'payment_method' => $this->faker->optional(0.7)->randomElement(['card', 'paypal', 'bank_transfer']),
            'invoice_number' => function () {
                return Invoice::generateInvoiceNumber();
            },
            'pdf_path' => function (array $attributes) {
                return 'invoices/invoice-' . $attributes['invoice_number'] . '.pdf';
            },
            'created_at' => function (array $attributes) {
                return $attributes['creation_date'];
            },
            'updated_at' => function (array $attributes) {
                return $this->faker->dateTimeBetween($attributes['created_at'], 'now');
            },
        ];
    }
    
    /**
     * Indicate that the invoice is paid
     */
    public function paid(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'payment_status' => 'paid',
                'payment_method' => $this->faker->randomElement(['card', 'paypal', 'bank_transfer']),
            ];
        });
    }
    
    /**
     * Indicate that the invoice is unpaid
     */
    public function unpaid(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'payment_status' => 'unpaid',
                'payment_method' => null,
            ];
        });
    }
}
