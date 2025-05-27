<?php

namespace Database\Seeders;

use App\Models\Invoice;
use App\Models\Reservation;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create an invoice for each reservation
        $reservations = Reservation::all();
        
        foreach ($reservations as $reservation) {
            // Set payment status based on reservation status
            $paymentStatus = 'unpaid';
            $paymentMethod = null;
            
            if ($reservation->status === 'confirmed') {
                $paymentStatus = 'paid';
                $paymentMethod = ['card', 'paypal', 'bank_transfer'][rand(0, 2)];
            } elseif ($reservation->status === 'cancelled') {
                // Some cancelled reservations were paid and then refunded
                if (rand(0, 1)) {
                    $paymentStatus = 'refunded';
                    $paymentMethod = ['card', 'paypal', 'bank_transfer'][rand(0, 2)];
                }
            }
            
            Invoice::create([
                'reservation_id' => $reservation->id,
                'amount' => $reservation->total_amount,
                'creation_date' => $reservation->created_at,
                'payment_status' => $paymentStatus,
                'payment_method' => $paymentMethod,
                'invoice_number' => 'INV-' . date('Ymd', strtotime($reservation->created_at)) . '-' . str_pad($reservation->id, 4, '0', STR_PAD_LEFT),
                'pdf_path' => $paymentStatus === 'paid' ? 'invoices/invoice-' . $reservation->id . '.pdf' : null,
                'created_at' => $reservation->created_at,
                'updated_at' => $reservation->updated_at,
            ]);
        }
    }
}
