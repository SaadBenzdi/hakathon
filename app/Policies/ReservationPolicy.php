<?php

namespace App\Policies;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReservationPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin(); // Only admins can view all reservations
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Reservation $reservation): bool
    {
        return $user->id === $reservation->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Any authenticated user can create reservations
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Reservation $reservation): bool
    {
        // Only admins can update any reservation, users can only update their own reservations
        return $user->id === $reservation->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can cancel the model.
     */
    public function cancel(User $user, Reservation $reservation): bool
    {
        // Reservations can only be cancelled if they are not already cancelled
        if ($reservation->status === 'cancelled') {
            return false;
        }
        
        // Only admins or the reservation owner can cancel
        return $user->id === $reservation->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Reservation $reservation): bool
    {
        return $user->isAdmin(); // Only admins can delete reservations
    }
}
