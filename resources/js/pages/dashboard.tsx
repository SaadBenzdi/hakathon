import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock, User, MapPin, FileText, CreditCard, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  user: {
    id: number;
    name: string;
    email: string;
    qr_code: string | null;
    role: string;
  };
  stats: {
    upcoming_reservations: number;
    total_reservations: number;
    unpaid_invoices: number;
    total_spent: number;
  };
  upcoming_reservations: {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    status: string;
    venue: {
      id: number;
      name: string;
      location: string;
    };
  }[];
  recent_invoices: {
    id: number;
    invoice_number: string;
    amount: number;
    creation_date: string;
    payment_status: string;
  }[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, stats, upcoming_reservations, recent_invoices }) => {
  const { toast } = useToast();
  const [showQrCode, setShowQrCode] = useState(false);
  
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
  
  const generateQrCode = () => {
    fetch(route('qr.generate', { user_id: user.id }), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
    })
      .then(response => response.json())
      .then(data => {
        setShowQrCode(true);
        toast({
          title: 'QR Code généré',
          description: 'Votre QR code a été généré avec succès.',
        });
      })
      .catch(error => {
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la génération du QR code.',
          variant: 'destructive',
        });
      });
  };

  return (
    <>
      <Head title="Tableau de bord" />
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
                {user && user.role === 'admin' && (
                  <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">Admin</Link>
                )}
              </nav>
              <div className="flex items-center space-x-4">
                <Link href="/profile">
                  <Button variant="outline" size="sm">
                    Mon profil
                  </Button>
                </Link>
                <Link href={route('logout')} method="post" preserveScroll>
                  <Button variant="ghost" size="sm">
                    Déconnexion
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-600 mt-1">Bienvenue, {user && user.name}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link href="/qr-code">
                <Button variant="outline" className="flex items-center">
                  <QrCode className="w-4 h-4 mr-2" />
                  Voir mon QR Code
                </Button>
              </Link>
              
              <Link href="/venues">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Réserver un espace
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Réservations à venir</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats ? stats.upcoming_reservations : 0}</h3>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-full">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/my-bookings" className="text-sm text-blue-600 hover:text-blue-800">
                    Voir toutes mes réservations →
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Factures impayées</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats ? stats.unpaid_invoices : 0}</h3>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-full">
                    <FileText className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/my-invoices" className="text-sm text-blue-600 hover:text-blue-800">
                    Voir toutes mes factures →
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total des réservations</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats ? stats.total_reservations : 0}</h3>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-full">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/my-bookings" className="text-sm text-blue-600 hover:text-blue-800">
                    Historique complet →
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total dépensé</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats ? stats.total_spent : 0} DH</h3>
                  </div>
                  <div className="p-3 bg-green-50 rounded-full">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/my-invoices" className="text-sm text-blue-600 hover:text-blue-800">
                    Voir les détails →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content Tabs */}
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList>
              <TabsTrigger value="upcoming">Réservations à venir</TabsTrigger>
              <TabsTrigger value="invoices">Factures récentes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-4">
              {!upcoming_reservations || upcoming_reservations.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Pas de réservations à venir</h3>
                    <p className="text-gray-600 mb-6">Vous n'avez aucune réservation prévue pour le moment.</p>
                    <Link href="/venues">
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        Réserver un espace
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                upcoming_reservations.map(reservation => (
                  <Card key={reservation.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-6 flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{reservation.venue.name}</h3>
                              <div className="flex items-center text-gray-600 mt-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="text-sm">{reservation.venue.location}</span>
                              </div>
                            </div>
                            {getStatusBadge(reservation.status)}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
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
                          </div>
                        </div>
                        
                        <div className="p-6 bg-gray-50 flex flex-col justify-center items-center md:items-end space-y-3 border-t md:border-t-0 md:border-l border-gray-100">
                          <Link href={"/reservations/" + reservation.id}>
                            <Button>Voir les détails</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="invoices" className="space-y-4">
              {!recent_invoices || recent_invoices.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Pas de factures récentes</h3>
                    <p className="text-gray-600 mb-6">Vous n'avez aucune facture récente.</p>
                    <Link href="/venues">
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        Réserver un espace
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">N° Facture</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Montant</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Statut</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent_invoices.map(invoice => (
                        <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-4 px-4">{invoice.invoice_number}</td>
                          <td className="py-4 px-4">{formatDate(invoice.creation_date)}</td>
                          <td className="py-4 px-4 font-medium">{invoice.amount.toFixed(2)} DH</td>
                          <td className="py-4 px-4">{getPaymentStatusBadge(invoice.payment_status)}</td>
                          <td className="py-4 px-4 text-right">
                            <Link href={"/invoices/" + invoice.id}>
                              <Button size="sm" variant="outline">Voir</Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
