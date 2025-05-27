<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QrCodeController extends Controller
{
    /**
     * Show the QR code login page
     */
    public function showQrLogin()
    {
        return Inertia::render('QrLogin');
    }
    
    /**
     * Authenticate user via QR code
     */
    public function authenticateQr(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|string',
        ]);
        
        $user = User::where('qr_code', $request->qr_code)->first();
        
        if (!$user) {
            return back()->withErrors([
                'qr_code' => 'Invalid QR code.',
            ]);
        }
        
        Auth::login($user);
        
        return redirect()->intended(route('dashboard'));
    }
    
    /**
     * Generate a new QR code for a user
     */
    public function generateQrCode(Request $request)
    {
        // Only admins can generate QR codes for other users
        if (!Auth::user()->isAdmin() && Auth::id() !== $request->user_id) {
            abort(403);
        }
        
        $user = User::findOrFail($request->user_id);
        
        // Generate a new QR code
        $qrCode = Str::random(32);
        $user->update(['qr_code' => $qrCode]);
        
        // Generate QR code image
        $qrCodeImage = QrCode::format('svg')
            ->size(300)
            ->errorCorrection('H')
            ->generate($qrCode);
        
        return response()->json([
            'qr_code' => $qrCode,
            'qr_image' => base64_encode($qrCodeImage),
        ]);
    }
    
    /**
     * Show user's QR code
     */
    public function showMyQrCode()
    {
        $user = Auth::user();
        
        // If user doesn't have a QR code, generate one
        if (!$user->qr_code) {
            $qrCode = Str::random(32);
            $user->update(['qr_code' => $qrCode]);
        }
        
        // Generate QR code image
        $qrCodeImage = QrCode::format('svg')
            ->size(300)
            ->errorCorrection('H')
            ->generate($user->qr_code);
        
        return Inertia::render('MyQrCode', [
            'qrImage' => base64_encode($qrCodeImage),
        ]);
    }
}
