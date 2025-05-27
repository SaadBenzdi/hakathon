<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Venue;
use Illuminate\Auth\Access\HandlesAuthorization;

class VenuePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Everyone can view venues
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Venue $venue): bool
    {
        return true; // Everyone can view venues
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin(); // Only admins can create venues
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Venue $venue): bool
    {
        return $user->isAdmin(); // Only admins can update venues
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Venue $venue): bool
    {
        return $user->isAdmin(); // Only admins can delete venues
    }
}
