import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { MapPin, Users, Clock, Calendar, ChevronLeft, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface TimeSlot {
  start: string;
  end: string;
}

interface Venue {
  id: number;
  name: string;
  type: string;
  capacity: number;
  price: number;
  location: string;
  amenities: string[];
  description: string;
  image_url: string;
  status: string;
}

interface VenueDetailsProps {
  venue: Venue;
  availableSlots: Record<string, TimeSlot[]>;
  auth: {
    user: any;
  };
}

const VenueDetails: React.FC<VenueDetailsProps> = ({ venue, availableSlots, auth }) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(Object.keys(availableSlots)[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  
  const { data, setData, post, processing, errors } = useForm({
    venue_id: venue.id,
    date: selectedDate,
    start_time: '',
    end_time: '',
    notes: '',
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
  };
  
  const selectTimeSlot = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setData({
      ...data,
      date: selectedDate,
      start_time: slot.start,
      end_time: slot.end,
    });
  };
  
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    setData({
      ...data,
      date: date,
      start_time: '',
      end_time: '',
    });
  };
  
  const handleSubmit = () => {
    post(route('reservations.store'), {
      onSuccess: () => {
        setIsReservationModalOpen(false);
        toast({
          title: 'Ru00e9servation cru00e9u00e9e',
          description: 'Votre ru00e9servation a u00e9tu00e9 cru00e9u00e9e avec succu00e8s. Veuillez procu00e9der au paiement pour confirmer.',
        });
      },
      onError: () => {
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la cru00e9ation de la ru00e9servation.',
          variant: 'destructive',
        });
      },
    });
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sport':
        return 'Terrain de sport';
      case 'conference':
        return 'Salle de confu00e9rence';
      case 'party':
        return 'Salle de fu00eate';
      default:
        return type;
    }
  };
  
  const calculateTotalPrice = () => {
    if (!selectedTimeSlot) return 0;
    
    const start = parseInt(selectedTimeSlot.start.split(':')[0]);
    const end = parseInt(selectedTimeSlot.end.split(':')[0]);
    const hours = end - start;
    
    return venue.price * hours;
  };

  return (
    <>
      <Head title={venue.name} />
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
                <Link href={route('reservations.index')} className="text-gray-600 hover:text-gray-900 transition-colors">Mes Ru00e9servations</Link>
                <Link href={route('admin.dashboard')} className="text-gray-600 hover:text-gray-900 transition-colors">Admin</Link>
              </nav>
              <div className="flex items-center space-x-4">
                {auth.user ? (
                  <Link href={route('dashboard')}>
                    <Button variant="outline" size="sm">
                      Mon compte
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href={route('login')}>
                      <Button variant="outline" size="sm">
                        Connexion
                      </Button>
                    </Link>
                    <Link href={route('register')}>
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        S'inscrire
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href={route('venues.index')} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Retour aux venues
          </Link>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Venue Images & Info */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-80 bg-gray-200 relative">
                  {venue.image_url ? (
                    <img 
                      src={venue.image_url} 
                      alt={venue.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <span>Image non disponible</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-100 text-blue-800">
                      {getTypeLabel(venue.type)}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{venue.name}</h1>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{venue.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Users className="w-5 h-5 mr-2" />
                      <span>Capacitu: {venue.capacity} personnes</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-2" />
                      <span>Horaires: 8h - 22h</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                    <p className="text-gray-600">{venue.description || 'Aucune description disponible.'}</p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Equipements</h2>
                    <div className="flex flex-wrap gap-2">
                      {venue.amenities && venue.amenities.length > 0 ? (
                        venue.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            {amenity}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500">Aucun u00e9quipement spu00e9cifiu00e9</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Booking Card */}
            <div>
              <Card className="shadow-lg sticky top-8">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Reservation</span>
                    <span className="text-blue-600">{venue.price} DH<span className="text-sm font-normal text-gray-500">/heure</span></span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Selectionnez une date</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.keys(availableSlots).map((date) => (
                        <Button
                          key={date}
                          variant={selectedDate === date ? 'default' : 'outline'}
                          className={selectedDate === date ? 'bg-blue-600' : ''}
                          onClick={() => handleDateChange(date)}
                        >
                          <div className="text-xs">{formatDate(date)}</div>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Time Slot Selection */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Horaires disponibles</h3>
                    {availableSlots[selectedDate]?.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots[selectedDate].map((slot, index) => (
                          <Button
                            key={index}
                            variant={selectedTimeSlot === slot ? 'default' : 'outline'}
                            className={selectedTimeSlot === slot ? 'bg-blue-600' : ''}
                            onClick={() => selectTimeSlot(slot)}
                          >
                            <div className="text-xs">{slot.start} - {slot.end}</div>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p>Aucun cru00e9neau disponible pour cette date</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Reservation Summary */}
                  {selectedTimeSlot && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <h3 className="font-medium">Recapitulatif</h3>
                      <div className="flex justify-between text-sm">
                        <span>Date</span>
                        <span>{formatDate(selectedDate)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Horaire</span>
                        <span>{selectedTimeSlot.start} - {selectedTimeSlot.end}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Durée</span>
                        <span>{parseInt(selectedTimeSlot.end) - parseInt(selectedTimeSlot.start)}h</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2 border-t border-gray-200 mt-2">
                        <span>Total</span>
                        <span className="text-blue-600">{calculateTotalPrice()} DH</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Book Button */}
                  {auth.user ? (
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      disabled={!selectedTimeSlot}
                      onClick={() => setIsReservationModalOpen(true)}
                    >
                      Reserver maintenant
                    </Button>
                  ) : (
                    <Link href={route('login')} className="block w-full">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        disabled={!selectedTimeSlot}
                      >
                        Connectez-vous pour reserver
                      </Button>
                    </Link>
                  )}
                  
                  {!auth.user && (
                    <div className="text-center text-xs text-gray-500">
                      <Link href={route('login')} className="text-blue-600 hover:underline">Connectez-vous</Link> ou <Link href={route('register')} className="text-blue-600 hover:underline">inscrivez-vous</Link> pour effectuer une reservation
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reservation Confirmation Modal */}
      <Dialog open={isReservationModalOpen} onOpenChange={setIsReservationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer votre reservation</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">{venue.name}</h3>
                <Badge className="bg-blue-100 text-blue-800">
                  {getTypeLabel(venue.type)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 block">Date</span>
                  <span>{formatDate(selectedDate)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Horaire</span>
                  <span>{selectedTimeSlot?.start} - {selectedTimeSlot?.end}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Localisation</span>
                  <span>{venue.location}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Capacitu00e9</span>
                  <span>{venue.capacity} personnes</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-200 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total u00e0 payer</span>
                  <span className="text-blue-600">{calculateTotalPrice()} DH</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Notes additionnelles (optionnel)</label>
              <Textarea
                placeholder="Informations supplu00e9mentaires pour votre ru00e9servation..."
                value={data.notes}
                onChange={(e) => setData('notes', e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              <p className="flex items-start">
                <span className="mr-2 mt-0.5"><Clock className="w-4 h-4" /></span>
                <span>Votre reservation restera en attente jusqu'au paiement. Le cru00e9neau sera du00e9finitivement ru00e9servu00e9 une fois le paiement effectuu00e9.</span>
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReservationModalOpen(false)}>
              Annuler
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={handleSubmit}
              disabled={processing}
            >
              Confirmer et payer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VenueDetails;
