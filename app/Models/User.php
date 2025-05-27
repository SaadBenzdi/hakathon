<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    // ...
    protected static function booted()
    {
        parent::booted();
        static::creating(function ($user) {
            if (empty($user->qr_code)) {
                $user->qr_code = encrypt(uniqid('qr_', true) . '-' . \Illuminate\Support\Str::random(16));
            }
        });
    }
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'qr_code',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    
    /**
     * Get all reservations for this user
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
    
    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
    
    /**
     * Get all invoices for this user through reservations
     */
    public function invoices()
    {
        return $this->hasManyThrough(Invoice::class, Reservation::class);
    }
}
