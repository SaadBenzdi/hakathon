import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, Clock, User, MapPin, FileText, CreditCard, XCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    location: string;
    type: string;
    image_url: string | null;
    price: number;
  };
  invoice: {
    id: number;
    invoice_number: string;
    amount: number;
    payment_status: string;
  } | null;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface ReservationDetailsProps {
  reservation: Reservation;
}

const ReservationDetails: React.FC<ReservationDetailsProps> = ({ reservation }) => {
  const { post, processing } = useForm();
  
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
  
  const cancelReservation = () => {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      post(route('reservations.update', reservation.id), {
        status: 'cancelled',
        notes: reservation.notes,
      });
    }
  };

  return (
    <>
      <Head title={`Réservation #${reservation.id}`} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
                <Link href="/" className="text-xl font-bold text-gray-900">VenueBook</Link>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link href="/venues" className="text-gray-600 hover:text-gray-900 transition-colors">Venues</Link>
                <Link href="/my-bookings" className="text-gray-600 hover:text-gray-900 transition-colors">Mes Réservations</Link>
                <Link href="/my-invoices" className="text-gray-600 hover:text-gray-900 transition-colors">Mes Factures</Link>
              </nav>
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Tableau de bord
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/my-bookings" className="text-blue-600 hover:text-blue-800">
              ← Retour à mes réservations
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reservation Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Détails de la Réservation #{reservation.id}</CardTitle>
                      <CardDescription>Créée le {formatDate(reservation.date)}</CardDescription>
                    </div>
                    <div>
                      {getStatusBadge(reservation.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-50 rounded-full">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date</p>
                        <p className="font-medium">{formatDate(reservation.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-green-50 rounded-full">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Horaire</p>
                        <p className="font-medium">{formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-purple-50 rounded-full">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Montant total</p>
                        <p className="font-medium">{typeof reservation.total_amount === 'number' ? reservation.total_amount.toFixed(2) : Number(reservation.total_amount).toFixed(2)} MAD</p>
                      </div>
                    </div>
                    
                    {reservation.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium text-gray-500 mb-1">Notes</p>
                        <p className="text-sm">{reservation.notes}</p>
                      </div>
                    )}
                    
                    {/* Action buttons */}
                    {reservation.status === 'pending' && (
                      <div className="mt-6 flex space-x-3">
                        <Button
                          onClick={cancelReservation}
                          variant="outline"
                          className="flex items-center border-red-200 text-red-600 hover:bg-red-50"
                          disabled={processing}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Annuler la réservation
                        </Button>
                        
                        {reservation.invoice && reservation.invoice.payment_status === 'unpaid' && (
                          <Link href={route('invoices.show', reservation.invoice.id)}>
                            <Button className="flex items-center">
                              <CreditCard className="w-4 h-4 mr-2" />
                              Procéder au paiement
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Facture associée */}
              {reservation.invoice && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Facture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Numéro de facture</p>
                        <p className="font-medium">{reservation.invoice.invoice_number}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Montant</p>
                        <p className="font-medium">{typeof reservation.invoice.amount === 'number' ? reservation.invoice.amount.toFixed(2) : Number(reservation.invoice.amount).toFixed(2)} MAD</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Statut</p>
                        {reservation.invoice.payment_status === 'paid' ? (
                          <Badge className="bg-green-100 text-green-800">Payée</Badge>
                        ) : reservation.invoice.payment_status === 'refunded' ? (
                          <Badge className="bg-purple-100 text-purple-800">Remboursée</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">Non payée</Badge>
                        )}
                      </div>
                      <div>
                        <Link href={route('invoices.show', reservation.invoice.id)}>
                          <Button variant="outline" size="sm">
                            Voir la facture
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Venue Information */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations sur le lieu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reservation.venue.image_url && (
                      <div className="rounded-md overflow-hidden">
                        <img 
                          src={reservation.venue.image_url} 
                          alt={reservation.venue.name} 
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-lg font-semibold">{reservation.venue.name}</h3>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-600">{reservation.venue.location}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium text-gray-500 mb-2">Type</p>
                      <div>
                        {reservation.venue.type === 'sport' && (
                          <Badge className="bg-blue-100 text-blue-800">Sport</Badge>
                        )}
                        {reservation.venue.type === 'conference' && (
                          <Badge className="bg-indigo-100 text-indigo-800">Conférence</Badge>
                        )}
                        {reservation.venue.type === 'party' && (
                          <Badge className="bg-pink-100 text-pink-800">Fête</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium text-gray-500 mb-2">Prix horaire</p>
                      <p className="font-semibold">{typeof reservation.venue.price === 'number' ? reservation.venue.price.toFixed(2) : Number(reservation.venue.price).toFixed(2)} MAD / heure</p>
                    </div>
                    
                    <Link href={route('venues.show', reservation.venue.id)}>
                      <Button variant="outline" className="w-full mt-2">
                        Voir les détails du lieu
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationDetails;
