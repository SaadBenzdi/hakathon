<?php

use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\VenueController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('Index');
})->name('home');

Route::get('/venues', [VenueController::class, 'index'])->name('venues.index');
Route::get('/venues/{venue}', [VenueController::class, 'show'])->name('venues.show');
Route::get('/qr-login', [\App\Http\Controllers\QrCodeController::class, 'showQrLogin'])->name('qr.login');
Route::post('/qr-login', [\App\Http\Controllers\QrCodeController::class, 'authenticateQr'])->name('qr.authenticate');

// Auth routes
require __DIR__.'/auth.php';

// Authenticated user routes
Route::middleware(['auth'])->group(function () {
    // User dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    
    // My bookings
    Route::get('/my-bookings', [ReservationController::class, 'index'])->name('reservations.index');
    Route::get('/reservations/create', [ReservationController::class, 'create'])->name('reservations.create');
    Route::get('/reservations/{reservation}', [ReservationController::class, 'show'])->name('reservations.show');
    Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');
    Route::put('/reservations/{reservation}', [ReservationController::class, 'update'])->name('reservations.update');
    
    // My invoices
    Route::get('/my-invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');
    Route::post('/invoices/{invoice}/payment', [InvoiceController::class, 'processPayment'])->name('invoices.payment');
    Route::get('/invoices/{invoice}/download', [InvoiceController::class, 'downloadPDF'])->name('invoices.download');
    
    // Venue availability check
    Route::post('/venues/{venue}/availability', [VenueController::class, 'checkAvailability'])->name('venues.availability');
    
    // QR Code routes for authenticated users
    Route::get('/my-qr-code', [\App\Http\Controllers\QrCodeController::class, 'showMyQrCode'])->name('qr.show');
    Route::post('/qr-generate', [\App\Http\Controllers\QrCodeController::class, 'generateQrCode'])->name('qr.generate');
    
    // Posts
    Route::resource('posts', PostController::class);
    
    // Admin routes
    Route::middleware(['can:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('AdminDashboard');
        })->name('dashboard');
        
        // Admin venue management
        Route::resource('venues', VenueController::class)->except(['index', 'show']);
        
        // Admin reservation management
        Route::get('/reservations', [ReservationController::class, 'adminIndex'])->name('reservations.index');
        Route::get('/reservations/{reservation}/edit', [ReservationController::class, 'edit'])->name('reservations.edit');
        Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy'])->name('reservations.destroy');
        
        // Admin invoice management
        Route::get('/invoices', [InvoiceController::class, 'adminIndex'])->name('invoices.index');
        
        // Admin QR code management
        Route::get('/users/{user}/qr-code', [\App\Http\Controllers\QrCodeController::class, 'showUserQrCode'])->name('qr.user');
        Route::post('/users/{user}/qr-generate', [\App\Http\Controllers\QrCodeController::class, 'generateUserQrCode'])->name('qr.user.generate');
    });
});

// Catch-all route for SPA
Route::get('/{path}', function () {
    return Inertia::render('Index');
})->where('path', '.*')->name('spa.fallback');

require __DIR__.'/settings.php';
