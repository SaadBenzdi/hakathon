<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class InvoicePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin(); // Only admins can view all invoices
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Invoice $invoice): bool
    {
        return $user->id === $invoice->reservation->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Invoice $invoice): bool
    {
        return $user->isAdmin(); // Only admins can update invoice details
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Invoice $invoice): bool
    {
        return $user->isAdmin(); // Only admins can delete invoices
    }

    /**
     * Determine whether the user can pay the invoice.
     */
    public function pay(User $user, Invoice $invoice): bool
    {
        // Can only pay unpaid invoices
        if ($invoice->payment_status !== 'unpaid') {
            return false;
        }
        
        // Only the invoice owner can pay it
        return $user->id === $invoice->reservation->user_id;
    }

    /**
     * Determine whether the user can download the invoice.
     */
    public function download(User $user, Invoice $invoice): bool
    {
        return $user->id === $invoice->reservation->user_id || $user->isAdmin();
    }
}
