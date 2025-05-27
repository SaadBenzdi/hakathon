import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock, User, MapPin, FileText, CreditCard, Users, Building, BarChart, CurrencyDollar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdminDashboardProps {
  stats: {
    total_venues: number;
    active_venues: number;
    total_reservations: number;
    pending_reservations: number;
    confirmed_reservations: number;
    total_revenue: number;
    unpaid_invoices: number;
    today_reservations: number;
    today_revenue: number;
    month_reservations: number;
    month_revenue: number;
  };
  recent_reservations: {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    status: string;
    created_at: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
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
    payment_status: string;
    created_at: string;
    reservation: {
      id: number;
      date: string;
      user: {
        id: number;
        name: string;
      };
      venue: {
        id: number;
        name: string;
      };
    };
  }[];
  today_reservations: {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    status: string;
    user: {
      id: number;
      name: string;
    };
    venue: {
      id: number;
      name: string;
      location: string;
    };
  }[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  stats, 
  recent_reservations, 
  recent_invoices, 
  today_reservations 
}) => {
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
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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

  return (
    <>
      <Head title="Tableau de bord Admin" />
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
                <Link href="/admin/venues" className="text-gray-600 hover:text-gray-900 transition-colors">Venuesiii</Link>
                <Link href="/admin/reservations" className="text-gray-600 hover:text-gray-900 transition-colors">Réservations</Link>
                <Link href="/admin/invoices" className="text-gray-600 hover:text-gray-900 transition-colors">Factures</Link>
              </nav>
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Vue utilisateur
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
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
              <p className="text-gray-600 mt-1">Gérez tous les aspects de la plateforme</p>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Venues actives</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.active_venues} / {stats.total_venues}</h3>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-full">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/admin/venues" className="text-sm text-blue-600 hover:text-blue-800">
                    Gérer les venues →
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Réservations en attente</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.pending_reservations}</h3>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-full">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/admin/reservations" className="text-sm text-blue-600 hover:text-blue-800">
                    Voir toutes les réservations →
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Factures impayées</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.unpaid_invoices}</h3>
                  </div>
                  <div className="p-3 bg-red-50 rounded-full">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/admin/invoices" className="text-sm text-blue-600 hover:text-blue-800">
                    Voir toutes les factures →
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Revenu total</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.total_revenue)}</h3>
                  </div>
                  <div className="p-3 bg-green-50 rounded-full">
                    <CurrencyDollar className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/admin/invoices" className="text-sm text-blue-600 hover:text-blue-800">
                    Voir les détails →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Today's Activity */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Activité d'aujourd'hui</CardTitle>
              <CardDescription>
                Réservations pour aujourd'hui: {stats.today_reservations} | Revenu: {formatCurrency(stats.today_revenue)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {today_reservations.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {today_reservations.map((reservation) => (
                    <div key={reservation.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{reservation.venue.name}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}</span>
                          <User className="w-4 h-4 ml-3 mr-1" />
                          <span>{reservation.user.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(reservation.status)}
                        <Link href={`/admin/reservations/${reservation.id}`}>
                          <Button variant="outline" size="sm">Voir</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">Aucune réservation pour aujourd'hui</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Activity Tabs */}
          <Tabs defaultValue="reservations" className="mb-8">
            <TabsList>
              <TabsTrigger value="reservations">Réservations récentes</TabsTrigger>
              <TabsTrigger value="invoices">Factures récentes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reservations">
              <Card>
                <CardContent className="pt-6">
                  {recent_reservations.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {recent_reservations.map((reservation) => (
                        <div key={reservation.id} className="py-4 flex justify-between items-center">
                          <div>
                            <div className="flex items-center">
                              <Link 
                                href={`/admin/reservations/${reservation.id}`}
                                className="font-medium text-blue-600 hover:text-blue-800"
                              >
                                Réservation #{reservation.id}
                              </Link>
                              <span className="mx-2 text-gray-500">•</span>
                              <span className="text-gray-500">{formatDate(reservation.date)}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Building className="w-4 h-4 mr-1" />
                              <span>{reservation.venue.name}</span>
                              <User className="w-4 h-4 ml-3 mr-1" />
                              <span>{reservation.user.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(reservation.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">Aucune réservation récente</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="invoices">
              <Card>
                <CardContent className="pt-6">
                  {recent_invoices.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {recent_invoices.map((invoice) => (
                        <div key={invoice.id} className="py-4 flex justify-between items-center">
                          <div>
                            <div className="flex items-center">
                              <Link 
                                href={`/admin/invoices/${invoice.id}`}
                                className="font-medium text-blue-600 hover:text-blue-800"
                              >
                                {invoice.invoice_number}
                              </Link>
                              <span className="mx-2 text-gray-500">•</span>
                              <span className="font-medium">{formatCurrency(invoice.amount)}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{formatDate(invoice.reservation.date)}</span>
                              <User className="w-4 h-4 ml-3 mr-1" />
                              <span>{invoice.reservation.user.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getPaymentStatusBadge(invoice.payment_status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">Aucune facture récente</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance mensuelle</CardTitle>
                <CardDescription>
                  {stats.month_reservations} réservations ce mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Revenu ce mois</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.month_revenue)}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="flex items-center text-sm">
                      <BarChart className="w-4 h-4 text-blue-600 mr-2" />
                      <p className="text-blue-800">
                        {stats.month_reservations > 0 
                          ? `Revenu moyen par réservation: ${formatCurrency(stats.month_revenue / stats.month_reservations)}` 
                          : 'Pas de données pour ce mois'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Répartition des réservations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="w-4/5">
                      <p className="text-sm font-medium">Confirmées</p>
                      <div className="h-2 bg-gray-100 rounded-full mt-1">
                        <div 
                          className="h-2 bg-green-500 rounded-full" 
                          style={{ 
                            width: `${stats.total_reservations > 0 
                              ? (stats.confirmed_reservations / stats.total_reservations) * 100 
                              : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <p className="font-medium">{stats.confirmed_reservations}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="w-4/5">
                      <p className="text-sm font-medium">En attente</p>
                      <div className="h-2 bg-gray-100 rounded-full mt-1">
                        <div 
                          className="h-2 bg-yellow-500 rounded-full" 
                          style={{ 
                            width: `${stats.total_reservations > 0 
                              ? (stats.pending_reservations / stats.total_reservations) * 100 
                              : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <p className="font-medium">{stats.pending_reservations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/admin/venues/create">
                    <Button variant="outline" className="w-full justify-start">
                      <Building className="w-4 h-4 mr-2" />
                      Ajouter une nouvelle venue
                    </Button>
                  </Link>
                  
                  <Link href="/admin/reservations?status=pending">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Voir les réservations en attente
                    </Button>
                  </Link>
                  
                  <Link href="/admin/invoices?payment_status=unpaid">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Voir les factures impayées
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
