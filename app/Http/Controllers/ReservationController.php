<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Reservation;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reservations = Auth::user()->reservations()
            ->with(['venue', 'invoice'])
            ->orderByDesc('created_at')
            ->get();
            
        return Inertia::render('MyBookings', [
            'reservations' => $reservations,
        ]);
    }
    
    /**
     * Display a listing of all reservations (admin only).
     */
    public function adminIndex(Request $request)
    {
        $this->authorize('viewAny', Reservation::class);
        
        $query = Reservation::query()
            ->with(['user', 'venue', 'invoice']);
            
        // Apply filters if they exist
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('venue_id')) {
            $query->where('venue_id', $request->venue_id);
        }
        
        if ($request->has('date')) {
            $query->where('date', $request->date);
        }
        
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
            
        $reservations = $query->orderByDesc('created_at')->paginate(10)->withQueryString();
        
        return Inertia::render('Admin/Reservations', [
            'reservations' => $reservations,
            'filters' => $request->only(['status', 'venue_id', 'date', 'user_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $venue = null;
        if ($request->has('venue_id')) {
            $venue = Venue::findOrFail($request->venue_id);
        }
        
        return Inertia::render('ReservationForm', [
            'venue' => $venue,
            'date' => $request->date ?? null,
            'start_time' => $request->start_time ?? null,
            'end_time' => $request->end_time ?? null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'venue_id' => 'required|exists:venues,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'notes' => 'nullable|string',
        ]);
        
        $venue = Venue::findOrFail($validated['venue_id']);
        
        // Check if venue is available for the requested time slot
        if (!$venue->isAvailable($validated['date'], $validated['start_time'], $validated['end_time'])) {
            return back()->withErrors(['time' => 'The venue is not available for the selected time slot.'])->withInput();
        }
        
        // Calculate total amount
        $startHour = (int) substr($validated['start_time'], 0, 2);
        $endHour = (int) substr($validated['end_time'], 0, 2);
        $hours = $endHour - $startHour;
        $totalAmount = $venue->price * $hours;
        
        // Create reservation
        $reservation = Reservation::create([
            'user_id' => Auth::id(),
            'venue_id' => $validated['venue_id'],
            'date' => $validated['date'],
            'start_time' => $validated['start_time'] . ':00',
            'end_time' => $validated['end_time'] . ':00',
            'total_amount' => $totalAmount,
            'status' => 'pending',
            'notes' => $validated['notes'] ?? null,
        ]);
        
        // Create invoice
        $invoice = Invoice::create([
            'reservation_id' => $reservation->id,
            'amount' => $totalAmount,
            'payment_status' => 'unpaid',
            'invoice_number' => Invoice::generateInvoiceNumber(),
        ]);
        
        return redirect()->route('reservations.show', $reservation)
            ->with('success', 'Reservation created successfully. Please proceed with payment to confirm.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Reservation $reservation)
    {
        // Check if user is authorized to view this reservation
        if (Auth::id() !== $reservation->user_id && !Auth::user()->isAdmin()) {
            abort(403);
        }
        
        $reservation->load(['venue', 'invoice', 'user']);
        
        return Inertia::render('ReservationDetails', [
            'reservation' => $reservation,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reservation $reservation)
    {
        // Only admins can update reservations, or users can only cancel their own reservations
        if (!Auth::user()->isAdmin() && (Auth::id() !== $reservation->user_id || $request->status !== 'cancelled')) {
            abort(403);
        }
        
        // Validate request
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled',
            'notes' => 'nullable|string',
        ]);
        
        // Update reservation
        $reservation->update($validated);
        
        // If cancelled, update invoice status to refunded if it was paid
        if ($validated['status'] === 'cancelled' && $reservation->invoice && $reservation->invoice->payment_status === 'paid') {
            $reservation->invoice->update([
                'payment_status' => 'refunded',
            ]);
        }
        
        return back()->with('success', 'Reservation updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation)
    {
        $this->authorize('delete', $reservation);
        
        // Delete invoice first
        if ($reservation->invoice) {
            $reservation->invoice->delete();
        }
        
        $reservation->delete();
        
        return redirect()->route('admin.reservations.index')
            ->with('success', 'Reservation deleted successfully.');
    }
    
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reservation $reservation)
    {
        // Only admins can edit reservations
        $this->authorize('update', $reservation);
        
        $reservation->load(['venue', 'user', 'invoice']);
        
        return Inertia::render('Admin/EditReservation', [
            'reservation' => $reservation,
            'venues' => Venue::where('status', 'active')->get(),
        ]);
    }
}
