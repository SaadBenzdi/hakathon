import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, Clock, User, MapPin, FileText, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Venue {
  id: number;
  name: string;
  location: string;
  type: string;
  image_url: string | null;
  price: number;
  capacity: number;
  amenities: string[];
  description: string | null;
}

interface ReservationFormProps {
  venue: Venue | null;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  errors: {
    venue_id?: string;
    date?: string;
    start_time?: string;
    end_time?: string;
    notes?: string;
    time?: string;
  };
}

const ReservationForm: React.FC<ReservationFormProps> = ({ venue, date, start_time, end_time, errors }) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(date || '');
  const [selectedStartTime, setSelectedStartTime] = useState(start_time || '');
  const [selectedEndTime, setSelectedEndTime] = useState(end_time || '');
  const [totalAmount, setTotalAmount] = useState(0);
  
  const { data, setData, post, processing } = useForm({
    venue_id: venue ? venue.id : '',
    date: selectedDate,
    start_time: selectedStartTime,
    end_time: selectedEndTime,
    notes: '',
  });
  
  useEffect(() => {
    // Calculate total amount when time changes
    if (venue && selectedStartTime && selectedEndTime) {
      const startHour = parseInt(selectedStartTime.split(':')[0]);
      const endHour = parseInt(selectedEndTime.split(':')[0]);
      
      if (endHour > startHour) {
        const hours = endHour - startHour;
        setTotalAmount(venue.price * hours);
      } else {
        setTotalAmount(0);
      }
    }
  }, [selectedStartTime, selectedEndTime, venue]);
  
  useEffect(() => {
    // Update form data when selections change
    setData({
      venue_id: venue ? venue.id : '',
      date: selectedDate,
      start_time: selectedStartTime,
      end_time: selectedEndTime,
      notes: data.notes,
    });
  }, [selectedDate, selectedStartTime, selectedEndTime]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('reservations.store'));
  };
  
  // Generate time options from 8:00 to 22:00
  const timeOptions = [];
  for (let hour = 8; hour <= 22; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  return (
    <>
      <Head title="Réserver un espace" />
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
            <Link href="/venues" className="text-blue-600 hover:text-blue-800">
              ← Retour aux venues
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reservation Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Réserver un espace</CardTitle>
                  <CardDescription>
                    Veuillez remplir les informations pour réserver votre espace.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {!venue && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-700 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <p>Veuillez d'abord sélectionner un lieu à partir de la page des venues.</p>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="date">Date de réservation</Label>
                        <Input 
                          id="date" 
                          type="date" 
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                          className="mt-1"
                        />
                        {errors.date && (
                          <p className="text-sm text-red-600 mt-1">{errors.date}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="start_time">Heure de début</Label>
                          <select
                            id="start_time"
                            value={selectedStartTime}
                            onChange={(e) => setSelectedStartTime(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md mt-1"
                          >
                            <option value="">Sélectionner une heure</option>
                            {timeOptions.slice(0, -1).map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                          {errors.start_time && (
                            <p className="text-sm text-red-600 mt-1">{errors.start_time}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="end_time">Heure de fin</Label>
                          <select
                            id="end_time"
                            value={selectedEndTime}
                            onChange={(e) => setSelectedEndTime(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md mt-1"
                          >
                            <option value="">Sélectionner une heure</option>
                            {timeOptions.slice(1).map(time => (
                              <option 
                                key={time} 
                                value={time}
                                disabled={selectedStartTime && time <= selectedStartTime}
                              >
                                {time}
                              </option>
                            ))}
                          </select>
                          {errors.end_time && (
                            <p className="text-sm text-red-600 mt-1">{errors.end_time}</p>
                          )}
                        </div>
                      </div>
                      
                      {errors.time && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                          {errors.time}
                        </div>
                      )}
                      
                      <div>
                        <Label htmlFor="notes">Notes (optionnel)</Label>
                        <Textarea 
                          id="notes" 
                          value={data.notes}
                          onChange={(e) => setData('notes', e.target.value)}
                          placeholder="Informations supplémentaires pour votre réservation..."
                          className="mt-1"
                        />
                        {errors.notes && (
                          <p className="text-sm text-red-600 mt-1">{errors.notes}</p>
                        )}
                      </div>
                    </div>
                    
                    {totalAmount > 0 && (
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                        <p className="text-sm font-medium text-blue-700">Détails du prix</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Prix horaire</span>
                            <span>{venue?.price ? (typeof venue.price === 'number' ? venue.price.toFixed(2) : Number(venue.price).toFixed(2)) : '0.00'} MAD</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Durée</span>
                            <span>
                              {selectedStartTime && selectedEndTime ? 
                                `${parseInt(selectedEndTime) - parseInt(selectedStartTime)} heure(s)` : 
                                '-'}
                            </span>
                          </div>
                          <div className="flex justify-between font-medium pt-2 border-t border-blue-200 mt-2">
                            <span>Total</span>
                            <span>{typeof totalAmount === 'number' ? totalAmount.toFixed(2) : Number(totalAmount).toFixed(2)} MAD</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        disabled={processing || !venue || !selectedDate || !selectedStartTime || !selectedEndTime}
                      >
                        {processing ? 'Traitement en cours...' : 'Réserver maintenant'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Venue Information */}
            {venue && (
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations sur le lieu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {venue.image_url && (
                        <div className="rounded-md overflow-hidden">
                          <img 
                            src={venue.image_url} 
                            alt={venue.name} 
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-lg font-semibold">{venue.name}</h3>
                        <div className="flex items-center space-x-1 mt-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-600">{venue.location}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium text-gray-500 mb-2">Type</p>
                        <div>
                          {venue.type === 'sport' && (
                            <Badge className="bg-blue-100 text-blue-800">Sport</Badge>
                          )}
                          {venue.type === 'conference' && (
                            <Badge className="bg-indigo-100 text-indigo-800">Conférence</Badge>
                          )}
                          {venue.type === 'party' && (
                            <Badge className="bg-pink-100 text-pink-800">Fête</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium text-gray-500 mb-2">Capacité</p>
                        <p className="font-semibold">{venue.capacity} personnes</p>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium text-gray-500 mb-2">Prix horaire</p>
                        <p className="font-semibold">{typeof venue.price === 'number' ? venue.price.toFixed(2) : Number(venue.price).toFixed(2)} MAD / heure</p>
                      </div>
                      
                      {venue.amenities && venue.amenities.length > 0 && (
                        <div className="pt-4 border-t">
                          <p className="text-sm font-medium text-gray-500 mb-2">Équipements</p>
                          <div className="flex flex-wrap gap-2">
                            {venue.amenities.map((amenity, index) => (
                              <Badge key={index} className="bg-gray-100 text-gray-800">{amenity}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {venue.description && (
                        <div className="pt-4 border-t">
                          <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                          <p className="text-sm">{venue.description}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationForm;
