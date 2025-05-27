<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .invoice-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .invoice-header h1 {
            color: #2563eb;
            margin-bottom: 5px;
        }
        .invoice-header p {
            margin: 0;
            color: #666;
        }
        .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .invoice-info-block {
            width: 45%;
        }
        .invoice-info-block h3 {
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .invoice-table th {
            background-color: #f3f4f6;
            text-align: left;
            padding: 10px;
        }
        .invoice-table td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }
        .invoice-total {
            text-align: right;
            margin-top: 20px;
        }
        .invoice-total .total-row {
            font-weight: bold;
            font-size: 1.2em;
            color: #2563eb;
        }
        .invoice-footer {
            margin-top: 50px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
        .status-paid {
            color: #059669;
            font-weight: bold;
        }
        .status-unpaid {
            color: #dc2626;
            font-weight: bold;
        }
        .status-refunded {
            color: #9333ea;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="invoice-header">
        <h1>{{ $company['name'] }}</h1>
        <p>{{ $company['address'] }}</p>
        <p>Tél: {{ $company['phone'] }} | Email: {{ $company['email'] }}</p>
    </div>
    
    <div class="invoice-info">
        <div class="invoice-info-block">
            <h3>Facturé à</h3>
            <p><strong>{{ $user->name }}</strong></p>
            <p>{{ $user->email }}</p>
        </div>
        <div class="invoice-info-block">
            <h3>Détails de la facture</h3>
            <p><strong>Facture N°:</strong> {{ $invoice->invoice_number }}</p>
            <p><strong>Date:</strong> {{ date('d/m/Y', strtotime($invoice->creation_date)) }}</p>
            <p><strong>Statut:</strong> 
                @if($invoice->payment_status == 'paid')
                    <span class="status-paid">Payée</span>
                @elseif($invoice->payment_status == 'unpaid')
                    <span class="status-unpaid">Non payée</span>
                @else
                    <span class="status-refunded">Remboursée</span>
                @endif
            </p>
            @if($invoice->payment_method)
                <p><strong>Méthode de paiement:</strong> {{ ucfirst($invoice->payment_method) }}</p>
            @endif
        </div>
    </div>
    
    <table class="invoice-table">
        <thead>
            <tr>
                <th>Description</th>
                <th>Date</th>
                <th>Horaire</th>
                <th>Prix unitaire</th>
                <th>Durée</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $venue->name }}</td>
                <td>{{ date('d/m/Y', strtotime($reservation->date)) }}</td>
                <td>{{ date('H:i', strtotime($reservation->start_time)) }} - {{ date('H:i', strtotime($reservation->end_time)) }}</td>
                <td>{{ number_format($venue->price, 2) }} DH</td>
                <td>{{ $reservation->getDurationInHours() }} h</td>
                <td>{{ number_format($invoice->amount, 2) }} DH</td>
            </tr>
        </tbody>
    </table>
    
    <div class="invoice-total">
        <p><strong>Sous-total:</strong> {{ number_format($invoice->amount, 2) }} DH</p>
        <p><strong>TVA (20%):</strong> {{ number_format($invoice->amount * 0.2, 2) }} DH</p>
        <p class="total-row"><strong>Total:</strong> {{ number_format($invoice->amount * 1.2, 2) }} DH</p>
    </div>
    
    <div class="invoice-footer">
        <p>Merci pour votre réservation!</p>
        <p>Pour toute question concernant cette facture, veuillez contacter notre service client.</p>
    </div>
</body>
</html>
