import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock, MapPin, FileText, AlertTriangle, Ban, CheckCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Reservation {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  total_amount: number;
  status: string;
  notes: string | null;
  venue: {
    id: number;
    name: string;
    type: string;
    location: string;
    image_url: string | null;
  };
  invoice: {
    id: number;
    amount: number;
    payment_status: string;
    invoice_number: string;
  } | null;
}

interface MyBookingsProps {
  reservations: Reservation[];
}

const MyBookings: React.FC<MyBookingsProps> = ({ reservations }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<number | null>(null);
  
  const filteredReservations = activeTab === 'all' 
    ? reservations 
    : reservations.filter(res => res.status === activeTab);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  const getPaymentStatusBadge = (status: string) => {
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
  
  const handleCancelReservation = (id: number) => {
    setReservationToCancel(id);
    setCancelDialogOpen(true);
  };
  
  const confirmCancelReservation = () => {
    console.log('confirmCancelReservation called', reservationToCancel);
    if (!reservationToCancel) {
      console.log('No reservation to cancel');
      return;
    }
    
    fetch(route('reservations.update', reservationToCancel), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify({
        status: 'cancelled',
      }),
    })
      .then(response => response.json())
      .then(data => {
        toast({
          title: 'Réservation annulée',
          description: 'Votre réservation a été annulée avec succès.',
        });
        
        // Reload the page to refresh data
        window.location.reload();
      })
      .catch(error => {
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de l\'annulation de la réservation.',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setCancelDialogOpen(false);
        setReservationToCancel(null);
      });
  };

  return (
    <>
      <Head title="Mes Réservations" />
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
                <Link href={route('reservations.index')} className="text-blue-600 font-medium">Mes Réservations</Link>
                <Link href={route('invoices.index')} className="text-gray-600 hover:text-gray-900 transition-colors">Mes Factures</Link>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Mes Réservations</h1>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="all" className="px-6">
                Toutes
              </TabsTrigger>
              <TabsTrigger value="confirmed" className="px-6">
                Confirmées
              </TabsTrigger>
              <TabsTrigger value="pending" className="px-6">
                En attente
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="px-6">
                Annulées
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="space-y-6">
              {filteredReservations.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation trouvée</h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === 'all' 
                      ? 'Vous n\'avez pas encore effectué de réservation.'
                      : `Vous n'avez pas de réservation avec le statut "${activeTab}".`}
                  </p>
                  <Link href={route('venues.index')}>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      Explorer les venues
                    </Button>
                  </Link>
                </div>
              ) : (
                filteredReservations.map(reservation => (
                  <Card key={reservation.id} className="overflow-hidden hover:shadow-md transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="md:col-span-1 h-full">
                          <div className="h-48 md:h-full bg-gray-200 relative">
                            {reservation.venue.image_url ? (
                              <img 
                                src={reservation.venue.image_url} 
                                alt={reservation.venue.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                <span>Image non disponible</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="md:col-span-3 p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div>
                              <h2 className="text-xl font-bold text-gray-900">{reservation.venue.name}</h2>
                              <div className="flex items-center text-gray-600 mt-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="text-sm">{reservation.venue.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-2 md:mt-0">
                              {getStatusBadge(reservation.status)}
                              {reservation.invoice && (
                                getPaymentStatusBadge(reservation.invoice.payment_status)
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-start">
                              <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-medium">{formatDate(reservation.date)}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <Clock className="w-5 h-5 mr-2 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-500">Horaire</p>
                                <p className="font-medium">{formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <FileText className="w-5 h-5 mr-2 text-gray-500" />
                              <div>
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="font-medium">{reservation.total_amount} DH</p>
                              </div>
                            </div>
                          </div>
                          
                          {reservation.notes && (
                            <div className="bg-gray-50 p-3 rounded-md mb-4">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Notes:</span> {reservation.notes}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-3">
                            <Link href={route('reservations.show', reservation.id)}>
                              <Button variant="outline">
                                Détails
                              </Button>
                            </Link>
                            
                            {reservation.invoice && reservation.invoice.payment_status === 'unpaid' && (
                              <Link href={route('invoices.show', reservation.invoice.id)}>
                                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                  Payer maintenant
                                </Button>
                              </Link>
                            )}
                            
                            {reservation.invoice && reservation.invoice.payment_status === 'paid' && (
                              <Link href={route('invoices.download', reservation.invoice.id)}>
                                <Button variant="outline">
                                  Télécharger la facture
                                </Button>
                              </Link>
                            )}
                            
                            {reservation.status !== 'cancelled' && (
                              <Button 
                                variant="outline" 
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleCancelReservation(reservation.id)}
                              >
                                Annuler
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Cancel Reservation Dialog */}
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'annulation</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex items-start space-x-3 text-amber-700 bg-amber-50 p-4 rounded-lg">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Êtes-vous sûr de vouloir annuler cette réservation ?</h4>
                <p className="text-sm mt-1">Cette action ne peut pas être annulée. Si vous avez déjà payé, un remboursement sera initié selon notre politique.</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Non, garder ma réservation
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                console.log('Cancel button clicked');
                confirmCancelReservation();
              }}
            >
              Oui, annuler la réservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyBookings;
