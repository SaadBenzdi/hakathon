import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, Clock, MapPin, FileText, Download, CreditCard, Banknote, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Invoice {
  id: number;
  amount: number;
  creation_date: string;
  payment_status: string;
  payment_method: string | null;
  invoice_number: string;
  pdf_path: string | null;
  reservation: {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    status: string;
    venue: {
      id: number;
      name: string;
      type: string;
      location: string;
    };
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

interface InvoiceDetailsProps {
  invoice: Invoice;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice }) => {
  const { toast } = useToast();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  
  const { data, setData, post, processing, errors } = useForm({
    payment_method: 'card',
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };
  
  const calculateDuration = () => {
    const startHour = parseInt(invoice.reservation.start_time.split(':')[0]);
    const endHour = parseInt(invoice.reservation.end_time.split(':')[0]);
    return endHour - startHour;
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Payée</Badge>;
      case 'unpaid':
        return <Badge className="bg-yellow-100 text-yellow-800">Non payée</Badge>;
      case 'refunded':
        return <Badge className="bg-purple-100 text-purple-800">Remboursée</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  const handleSubmitPayment = () => {
    post(route('invoices.payment', invoice.id), {
      onSuccess: () => {
        setPaymentDialogOpen(false);
        toast({
          title: 'Paiement réussi',
          description: 'Votre paiement a été traité avec succès. Votre réservation est maintenant confirmée.',
        });
      },
      onError: () => {
        toast({
          title: 'Erreur de paiement',
          description: 'Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer.',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <>
      <Head title={`Facture ${invoice.invoice_number}`} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
                <Link href={route('home')} className="text-xl font-bold text-gray-900">VenueBook</Link>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link href={route('venues.index')} className="text-gray-600 hover:text-gray-900 transition-colors">Venues</Link>
                <Link href={route('reservations.index')} className="text-gray-600 hover:text-gray-900 transition-colors">Mes Réservations</Link>
                <Link href={route('invoices.index')} className="text-blue-600 font-medium">Mes Factures</Link>
              </nav>
              <div className="flex items-center space-x-4">
                <Link href={route('dashboard')}>
                  <Button variant="outline" size="sm">
                    Mon compte
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <Link href={route('invoices.index')} className="inline-flex items-center text-blue-600 hover:text-blue-800 mr-4">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Retour aux factures
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Facture {invoice.invoice_number}</h1>
            </div>
            
            {invoice.pdf_path && (
              <Link href={route('invoices.download', invoice.id)}>
                <Button variant="outline" className="flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PDF
                </Button>
              </Link>
            )}
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Invoice Details */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex justify-between items-center">
                    <span>Détails de la facture</span>
                    {getStatusBadge(invoice.payment_status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-500 mb-2">Information de facturation</h3>
                      <p className="font-medium">{invoice.reservation.user.name}</p>
                      <p className="text-gray-600">{invoice.reservation.user.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-500 mb-2">Détails</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Numéro</span>
                          <span>{invoice.invoice_number}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date d'émission</span>
                          <span>{formatDate(invoice.creation_date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Statut</span>
                          <span>{invoice.payment_status === 'paid' ? 'Payée' : invoice.payment_status === 'unpaid' ? 'Non payée' : 'Remboursée'}</span>
                        </div>
                        {invoice.payment_method && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Méthode de paiement</span>
                            <span>{invoice.payment_method === 'card' ? 'Carte bancaire' : 
                                   invoice.payment_method === 'paypal' ? 'PayPal' : 'Virement bancaire'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-medium text-gray-500 mb-4">Détails de la réservation</h3>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 font-medium text-gray-600">Description</th>
                          <th className="text-left py-3 font-medium text-gray-600">Date</th>
                          <th className="text-left py-3 font-medium text-gray-600">Horaire</th>
                          <th className="text-left py-3 font-medium text-gray-600">Prix unitaire</th>
                          <th className="text-left py-3 font-medium text-gray-600">Quantité</th>
                          <th className="text-right py-3 font-medium text-gray-600">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-4">
                            <div className="font-medium">{invoice.reservation.venue.name}</div>
                            <div className="text-gray-500 text-sm">{invoice.reservation.venue.location}</div>
                          </td>
                          <td className="py-4">{formatDate(invoice.reservation.date)}</td>
                          <td className="py-4">{formatTime(invoice.reservation.start_time)} - {formatTime(invoice.reservation.end_time)}</td>
                          <td className="py-4">{(typeof invoice.amount === 'number' ? (invoice.amount / calculateDuration()).toFixed(2) : (Number(invoice.amount) / calculateDuration()).toFixed(2))} DH</td>
                          <td className="py-4">{calculateDuration()} heure(s)</td>
                          <td className="py-4 text-right font-medium">{typeof invoice.amount === 'number' ? invoice.amount.toFixed(2) : Number(invoice.amount).toFixed(2)} DH</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={5} className="text-right py-4 font-medium">Sous-total</td>
                          <td className="text-right py-4 font-medium">{typeof invoice.amount === 'number' ? invoice.amount.toFixed(2) : Number(invoice.amount).toFixed(2)} DH</td>
                        </tr>
                        <tr>
                          <td colSpan={5} className="text-right py-2 text-gray-600">TVA (20%)</td>
                          <td className="text-right py-2 text-gray-600">{typeof invoice.amount === 'number' ? (invoice.amount * 0.2).toFixed(2) : (Number(invoice.amount) * 0.2).toFixed(2)} DH</td>
                        </tr>
                        <tr>
                          <td colSpan={5} className="text-right py-4 font-bold text-lg">Total</td>
                          <td className="text-right py-4 font-bold text-lg text-blue-600">{typeof invoice.amount === 'number' ? (invoice.amount * 1.2).toFixed(2) : (Number(invoice.amount) * 1.2).toFixed(2)} DH</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Payment Info & Actions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Paiement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {invoice.payment_status === 'paid' ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                      <p className="font-medium mb-1">Paiement effectué</p>
                      <p>Cette facture a été payée le {formatDate(invoice.creation_date)}.</p>
                      <p className="mt-2">Méthode: {invoice.payment_method === 'card' ? 'Carte bancaire' : 
                                invoice.payment_method === 'paypal' ? 'PayPal' : 'Virement bancaire'}</p>
                    </div>
                  ) : invoice.payment_status === 'refunded' ? (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-purple-800">
                      <p className="font-medium mb-1">Remboursement effectué</p>
                      <p>Cette facture a été remboursée suite à une annulation.</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                        <p className="font-medium mb-1">Paiement en attente</p>
                        <p>Cette facture est en attente de paiement. Votre réservation sera confirmée après paiement.</p>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        onClick={() => setPaymentDialogOpen(true)}
                      >
                        Payer maintenant
                      </Button>
                    </>
                  )}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3">Récapitulatif</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sous-total</span>
                        <span>{typeof invoice.amount === 'number' ? invoice.amount.toFixed(2) : Number(invoice.amount).toFixed(2)} DH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">TVA (20%)</span>
                        <span>{typeof invoice.amount === 'number' ? (invoice.amount * 0.2).toFixed(2) : (Number(invoice.amount) * 0.2).toFixed(2)} DH</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2 border-t border-gray-200 mt-2">
                        <span>Total</span>
                        <span className="text-blue-600">{typeof invoice.amount === 'number' ? (invoice.amount * 1.2).toFixed(2) : (Number(invoice.amount) * 1.2).toFixed(2)} DH</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Procéder au paiement</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Choisissez votre méthode de paiement</h3>
              <RadioGroup value={data.payment_method} onValueChange={value => setData('payment_method', value)} className="space-y-3">
                <div className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center cursor-pointer">
                    <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                    <span>Carte bancaire</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center cursor-pointer">
                    <svg className="w-5 h-5 mr-2 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.384a.77.77 0 0 1 .757-.645h6.251c2.849 0 4.863.624 5.981 1.853.52.572.881 1.185 1.073 1.857.202.703.231 1.543.089 2.566l-.006.055v.49c-.049 3.356-1.527 5.68-4.338 6.868-.9.382-1.904.637-3.067.77-.479.053-1.911.088-2.326.088H7.988l-.119.63-.511 2.254-.146.639c-.067.292-.329.528-.636.528h-.011Z" />
                      <path d="M20.365 6.87a6.349 6.349 0 0 0-.674-1.228c-1.357-1.935-3.944-2.642-7.2-2.642H6.24c-.545 0-1.006.396-1.09.935L2.047 21.047a.654.654 0 0 0 .644.752h4.602l1.092-4.835-.034.219a1.08 1.08 0 0 1 1.09-.935h2.269c4.45 0 7.93-1.809 8.95-7.04.031-.16.058-.313.08-.46.272-1.756.014-2.944-.78-4.014" />
                    </svg>
                    <span>PayPal</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                  <Label htmlFor="bank_transfer" className="flex items-center cursor-pointer">
                    <Banknote className="w-5 h-5 mr-2 text-blue-600" />
                    <span>Virement bancaire</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Récapitulatif de paiement</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Réservation</span>
                  <span>{invoice.reservation.venue.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span>{formatDate(invoice.reservation.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horaire</span>
                  <span>{formatTime(invoice.reservation.start_time)} - {formatTime(invoice.reservation.end_time)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span>{typeof invoice.amount === 'number' ? invoice.amount.toFixed(2) : Number(invoice.amount).toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TVA (20%)</span>
                  <span>{typeof invoice.amount === 'number' ? (invoice.amount * 0.2).toFixed(2) : (Number(invoice.amount) * 0.2).toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-gray-200 mt-2">
                  <span>Total à payer</span>
                  <span className="text-blue-600">{typeof invoice.amount === 'number' ? (invoice.amount * 1.2).toFixed(2) : (Number(invoice.amount) * 1.2).toFixed(2)} DH</span>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              <p>En procédant au paiement, vous acceptez nos conditions générales de vente et notre politique de confidentialité.</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={handleSubmitPayment}
              disabled={processing}
            >
              Payer {typeof invoice.amount === 'number' ? (invoice.amount * 1.2).toFixed(2) : (Number(invoice.amount) * 1.2).toFixed(2)} DH
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvoiceDetails;
