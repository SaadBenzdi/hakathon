<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'venue_id',
        'date',
        'start_time',
        'end_time',
        'total_amount',
        'status',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'total_amount' => 'decimal:2',
    ];

    /**
     * Get the user that owns the reservation
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the venue that is reserved
     */
    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    /**
     * Get the invoice for this reservation
     */
    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    /**
     * Calculate the duration of the reservation in hours
     */
    public function getDurationInHours(): float
    {
        $start = strtotime($this->start_time);
        $end = strtotime($this->end_time);
        
        return ($end - $start) / 3600; // Convert seconds to hours
    }
}
