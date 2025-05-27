<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class VenueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Venue::query();
        
        // Apply filters if they exist
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }
        
        if ($request->has('min_capacity')) {
            $query->where('capacity', '>=', $request->min_capacity);
        }
        
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        
        // Only show active venues to clients
        if (!auth()->user() || !auth()->user()->isAdmin()) {
            $query->where('status', 'active');
        }
        
        $venues = $query->paginate(9)->withQueryString();
        
        return Inertia::render('Venues', [
            'venues' => $venues,
            'filters' => $request->only(['type', 'location', 'min_capacity', 'max_price']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Venue::class);
        
        return Inertia::render('Admin/VenueForm', [
            'venue' => null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Venue::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => ['required', Rule::in(['sport', 'conference', 'party'])],
            'capacity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'location' => 'required|string|max:255',
            'amenities' => 'nullable|array',
            'description' => 'nullable|string',
            'status' => ['required', Rule::in(['active', 'maintenance', 'inactive'])],
            'image' => 'nullable|image|max:2048',
        ]);
        
        // Handle image upload if provided
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('venues', 'public');
            $validated['image_url'] = Storage::url($path);
        }
        
        $venue = Venue::create($validated);
        
        return redirect()->route('admin.venues.index')
            ->with('success', 'Venue created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Venue $venue)
    {
        // Check if the venue is active or if the user is an admin
        if ($venue->status !== 'active' && (!auth()->user() || !auth()->user()->isAdmin())) {
            abort(404);
        }
        
        // Get available time slots for the next 7 days
        $availableSlots = [];
        $startDate = now()->startOfDay();
        
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $availableSlots[$date->format('Y-m-d')] = $this->getAvailableTimeSlots($venue, $date);
        }
        
        return Inertia::render('VenueDetails', [
            'venue' => $venue,
            'availableSlots' => $availableSlots,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Venue $venue)
    {
        $this->authorize('update', $venue);
        
        return Inertia::render('Admin/VenueForm', [
            'venue' => $venue,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Venue $venue)
    {
        $this->authorize('update', $venue);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => ['required', Rule::in(['sport', 'conference', 'party'])],
            'capacity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'location' => 'required|string|max:255',
            'amenities' => 'nullable|array',
            'description' => 'nullable|string',
            'status' => ['required', Rule::in(['active', 'maintenance', 'inactive'])],
            'image' => 'nullable|image|max:2048',
        ]);
        
        // Handle image upload if provided
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($venue->image_url && Storage::exists(str_replace('/storage', 'public', $venue->image_url))) {
                Storage::delete(str_replace('/storage', 'public', $venue->image_url));
            }
            
            $path = $request->file('image')->store('venues', 'public');
            $validated['image_url'] = Storage::url($path);
        }
        
        $venue->update($validated);
        
        return redirect()->route('admin.venues.index')
            ->with('success', 'Venue updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Venue $venue)
    {
        $this->authorize('delete', $venue);
        
        // Delete the venue image if it exists
        if ($venue->image_url && Storage::exists(str_replace('/storage', 'public', $venue->image_url))) {
            Storage::delete(str_replace('/storage', 'public', $venue->image_url));
        }
        
        $venue->delete();
        
        return redirect()->route('admin.venues.index')
            ->with('success', 'Venue deleted successfully.');
    }
    
    /**
     * Check venue availability for a specific date and time
     */
    public function checkAvailability(Request $request, Venue $venue)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);
        
        $isAvailable = $venue->isAvailable(
            $request->date,
            $request->start_time,
            $request->end_time
        );
        
        return response()->json(['available' => $isAvailable]);
    }
    
    /**
     * Get available time slots for a venue on a specific date
     */
    private function getAvailableTimeSlots(Venue $venue, $date)
    {
        $openingHour = 8; // 8 AM
        $closingHour = 22; // 10 PM
        
        $bookedSlots = $venue->reservations()
            ->where('date', $date->format('Y-m-d'))
            ->where('status', '!=', 'cancelled')
            ->get()
            ->map(function ($reservation) {
                return [
                    'start' => (int) substr($reservation->start_time, 0, 2),
                    'end' => (int) substr($reservation->end_time, 0, 2),
                ];
            });
        
        $availableSlots = [];
        
        for ($hour = $openingHour; $hour < $closingHour; $hour++) {
            $slotStart = $hour;
            $slotEnd = $hour + 1;
            
            $isAvailable = true;
            
            foreach ($bookedSlots as $bookedSlot) {
                if ($slotStart < $bookedSlot['end'] && $slotEnd > $bookedSlot['start']) {
                    $isAvailable = false;
                    break;
                }
            }
            
            if ($isAvailable) {
                $availableSlots[] = [
                    'start' => sprintf('%02d:00', $slotStart),
                    'end' => sprintf('%02d:00', $slotEnd),
                ];
            }
        }
        
        return $availableSlots;
    }
}
