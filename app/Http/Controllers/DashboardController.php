<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with user stats.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get upcoming reservations (future date with status confirmed or pending)
        $upcomingReservations = $user->reservations()
            ->with('venue')
            ->where('date', '>=', now()->format('Y-m-d'))
            ->whereIn('status', ['confirmed', 'pending'])
            ->orderBy('date')
            ->orderBy('start_time')
            ->take(5)
            ->get();
        
        // Get recent invoices
        $recentInvoices = $user->invoices()
            ->orderByDesc('creation_date')
            ->take(5)
            ->get();
        
        // Calculate stats
        $stats = [
            'upcoming_reservations' => $user->reservations()
                ->where('date', '>=', now()->format('Y-m-d'))
                ->whereIn('status', ['confirmed', 'pending'])
                ->count(),
                
            'total_reservations' => $user->reservations()->count(),
            
            'unpaid_invoices' => $user->invoices()
                ->where('payment_status', 'unpaid')
                ->count(),
                
            'total_spent' => $user->invoices()
                ->where('payment_status', 'paid')
                ->sum('amount'),
        ];
        
        return Inertia::render('Dashboard', [
            'user' => $user,
            'stats' => $stats,
            'upcoming_reservations' => $upcomingReservations,
            'recent_invoices' => $recentInvoices,
        ]);
    }

    /**
     * Display the admin dashboard with global stats.
     */
    public function adminIndex()
    {
        $this->authorize('admin');
        
        // Admin dashboard stats
        $todayStart = now()->startOfDay();
        $todayEnd = now()->endOfDay();
        $thisMonthStart = now()->startOfMonth();
        $thisMonthEnd = now()->endOfMonth();
        
        $stats = [
            'total_venues' => \App\Models\Venue::count(),
            'active_venues' => \App\Models\Venue::where('status', 'active')->count(),
            
            'total_reservations' => Reservation::count(),
            'pending_reservations' => Reservation::where('status', 'pending')->count(),
            'confirmed_reservations' => Reservation::where('status', 'confirmed')->count(),
            
            'total_revenue' => Invoice::where('payment_status', 'paid')->sum('amount'),
            'unpaid_invoices' => Invoice::where('payment_status', 'unpaid')->count(),
            
            'today_reservations' => Reservation::whereBetween('created_at', [$todayStart, $todayEnd])->count(),
            'today_revenue' => Invoice::where('payment_status', 'paid')
                ->whereBetween('created_at', [$todayStart, $todayEnd])
                ->sum('amount'),
                
            'month_reservations' => Reservation::whereBetween('created_at', [$thisMonthStart, $thisMonthEnd])->count(),
            'month_revenue' => Invoice::where('payment_status', 'paid')
                ->whereBetween('created_at', [$thisMonthStart, $thisMonthEnd])
                ->sum('amount'),
        ];
        
        // Recent activity
        $recentReservations = Reservation::with(['user', 'venue'])
            ->orderByDesc('created_at')
            ->take(10)
            ->get();
            
        $recentInvoices = Invoice::with(['reservation', 'reservation.user', 'reservation.venue'])
            ->orderByDesc('created_at')
            ->take(10)
            ->get();
        
        // Upcoming reservations for today
        $todayReservations = Reservation::with(['user', 'venue'])
            ->where('date', now()->format('Y-m-d'))
            ->orderBy('start_time')
            ->get();
        
        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recent_reservations' => $recentReservations,
            'recent_invoices' => $recentInvoices,
            'today_reservations' => $todayReservations,
        ]);
    }
}
