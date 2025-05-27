<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    /**
     * Display a listing of invoices for the logged in user.
     */
    public function index()
    {
        $invoices = Auth::user()->invoices()
            ->with(['reservation', 'reservation.venue'])
            ->orderByDesc('created_at')
            ->get();
        
        return Inertia::render('MyInvoices', [
            'invoices' => $invoices,
        ]);
    }
    
    /**
     * Display a listing of all invoices (admin only).
     */
    public function adminIndex(Request $request)
    {
        $this->authorize('viewAny', Invoice::class);
        
        $query = Invoice::with(['reservation', 'reservation.user', 'reservation.venue']);
        
        // Apply filters if they exist
        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }
        
        if ($request->has('min_amount')) {
            $query->where('amount', '>=', $request->min_amount);
        }
        
        if ($request->has('max_amount')) {
            $query->where('amount', '<=', $request->max_amount);
        }
        
        if ($request->has('date_from')) {
            $query->whereDate('creation_date', '>=', $request->date_from);
        }
        
        if ($request->has('date_to')) {
            $query->whereDate('creation_date', '<=', $request->date_to);
        }
        
        $invoices = $query->orderByDesc('creation_date')->paginate(10)->withQueryString();
        
        return Inertia::render('Admin/Invoices', [
            'invoices' => $invoices,
            'filters' => $request->only(['payment_status', 'min_amount', 'max_amount', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Display the specified invoice.
     */
    public function show(Invoice $invoice)
    {
        // Check if user is authorized to view this invoice
        if (Auth::id() !== $invoice->reservation->user_id && !Auth::user()->isAdmin()) {
            abort(403);
        }
        
        $invoice->load(['reservation', 'reservation.venue', 'reservation.user']);
        
        return Inertia::render('InvoiceDetails', [
            'invoice' => $invoice,
        ]);
    }

    /**
     * Process payment for an invoice.
     */
    public function processPayment(Request $request, Invoice $invoice)
    {
        // Check if user is authorized to pay this invoice
        if (Auth::id() !== $invoice->reservation->user_id) {
            abort(403);
        }
        
        // Validate the payment request
        $validated = $request->validate([
            'payment_method' => 'required|in:card,paypal,bank_transfer',
        ]);
        
        // In a real application, you would integrate with a payment gateway here
        // For this example, we'll simulate a successful payment
        
        // Update invoice status
        $invoice->update([
            'payment_status' => 'paid',
            'payment_method' => $validated['payment_method'],
        ]);
        
        // Confirm the reservation
        $invoice->reservation->update([
            'status' => 'confirmed',
        ]);
        
        // Generate PDF invoice
        $this->generatePDF($invoice);
        
        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Payment processed successfully. Your reservation is now confirmed.');
    }

    /**
     * Download the invoice as PDF.
     */
    public function downloadPDF(Invoice $invoice)
    {
        // Check if user is authorized to download this invoice
        if (Auth::id() !== $invoice->reservation->user_id && !Auth::user()->isAdmin()) {
            abort(403);
        }
        
        // Check if PDF exists, if not generate it
        if (!$invoice->pdf_path || !Storage::exists('public/' . $this->getCleanPath($invoice->pdf_path))) {
            $this->generatePDF($invoice);
        }
        
        $path = $this->getCleanPath($invoice->pdf_path);
        $filename = 'facture-' . $invoice->invoice_number . '.pdf';
        
        return Storage::download('public/' . $path, $filename);
    }
    
    /**
     * Generate PDF invoice and save it to storage.
     */
    private function generatePDF(Invoice $invoice)
    {
        $invoice->load(['reservation', 'reservation.venue', 'reservation.user']);
        
        // Prepare data for PDF
        $data = [
            'invoice' => $invoice,
            'reservation' => $invoice->reservation,
            'venue' => $invoice->reservation->venue,
            'user' => $invoice->reservation->user,
            'company' => [
                'name' => 'VenueBook',
                'address' => '123 Booking Street, Casablanca, Morocco',
                'phone' => '+212 5XX XX XX XX',
                'email' => 'contact@venuebook.ma',
                'logo' => '/logo.svg',
            ],
        ];
        
        // Generate PDF using Laravel-DOMPDF
        $pdf = PDF::loadView('pdf.invoice', $data);
        
        // Define file path
        $path = 'invoices/' . $invoice->invoice_number . '.pdf';
        
        // Save to storage
        Storage::put('public/' . $path, $pdf->output());
        
        // Update invoice record with PDF path
        $invoice->update([
            'pdf_path' => Storage::url($path),
        ]);
        
        return $pdf;
    }
    
    /**
     * Helper to clean the storage path
     */
    private function getCleanPath($path)
    {
        if (empty($path)) {
            return '';
        }
        
        // Remove /storage/ prefix if present
        return str_replace('/storage/', '', $path);
    }
}
