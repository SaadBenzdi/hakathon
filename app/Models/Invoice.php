<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'amount',
        'creation_date',
        'payment_status',
        'payment_method',
        'invoice_number',
        'pdf_path',
    ];

    protected $casts = [
        'creation_date' => 'datetime',
        'amount' => 'decimal:2',
    ];

    /**
     * Get the reservation that this invoice belongs to
     */
    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    /**
     * Generate a unique invoice number
     */
    public static function generateInvoiceNumber(): string
    {
        $prefix = 'INV-';
        $date = date('Ymd');
        $randomNumber = mt_rand(1000, 9999);
        
        return $prefix . $date . '-' . $randomNumber;
    }

    /**
     * Get the user associated with this invoice through the reservation
     */
    public function user()
    {
        return $this->reservation ? $this->reservation->user : null;
    }
}
