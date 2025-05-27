<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Define the admin gate to restrict access to admin areas
        Gate::define('admin', function (User $user) {
            return $user->role === 'admin';
        });
        
        // Define a gate for client-only areas
        Gate::define('client', function (User $user) {
            return $user->role === 'client';
        });
        
        // Define access control for reservations - users can only see their own reservations, admins can see all
        Gate::define('view-reservation', function (User $user, $reservation) {
            return $user->id === $reservation->user_id || $user->isAdmin();
        });
        
        // Define access control for invoices - users can only see their own invoices, admins can see all
        Gate::define('view-invoice', function (User $user, $invoice) {
            return $user->id === $invoice->reservation->user_id || $user->isAdmin();
        });
    }
}
