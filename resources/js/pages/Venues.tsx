import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Calendar, MapPin, Users, Clock, Star, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface Venue {
  id: number;
  name: string;
  type: string;
  location: string;
  price: number;
  capacity: number;
  amenities: string[];
  image_url: string;
  status: string;
}

interface VenuesProps {
  venues: {
    data: Venue[];
    links: any[];
  };
  filters: {
    type?: string;
    location?: string;
    min_capacity?: number;
    max_price?: number;
  };
  auth: {
    user: {
      name: string;
      email: string;
      role: string;
    } | null;
  };
}

const Venues: React.FC<VenuesProps> = ({ venues, filters, auth }) => {
  const [localFilters, setLocalFilters] = useState({
    type: filters.type || '',
    location: filters.location || '',
    min_capacity: filters.min_capacity || 0,
    max_price: filters.max_price || 3000,
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  const handleFilterChange = (name: string, value: any) => {
    setLocalFilters({
      ...localFilters,
      [name]: value,
    });
  };
  
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (localFilters.type) params.append('type', localFilters.type);
    if (localFilters.location) params.append('location', localFilters.location);
    if (localFilters.min_capacity > 0) params.append('min_capacity', localFilters.min_capacity.toString());
    if (localFilters.max_price < 3000) params.append('max_price', localFilters.max_price.toString());
    
    window.location.href = `/venues?${params.toString()}`;
  };
  
  const resetFilters = () => {
    setLocalFilters({
      type: '',
      location: '',
      min_capacity: 0,
      max_price: 3000,
    });
    
    window.location.href = '/venues';
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sport':
        return 'bg-blue-100 text-blue-800';
      case 'conference':
        return 'bg-purple-100 text-purple-800';
      case 'party':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sport':
        return 'Sport';
      case 'conference':
        return 'Conférence';
      case 'party':
        return 'Fête';
      default:
        return type;
    }
  };

  return (
    <>
      <Head title="Venues disponibles" />
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
                <Link href={route('venues.index')} className="text-blue-600 font-medium">Venues</Link>
                {auth.user && (
                  <Link href={route('reservations.index')} className="text-gray-600 hover:text-gray-900 transition-colors">Mes Réservations</Link>
                )}
                {auth.user && auth.user.role === 'admin' && (
                  <Link href={route('admin.dashboard')} className="text-gray-600 hover:text-gray-900 transition-colors">Admin</Link>
                )}
              </nav>
              <div className="flex items-center space-x-4">
                {auth.user ? (
                  <>
                    <Link href={route('dashboard')}>
                      <Button variant="outline" size="sm">
                        Mon compte
                      </Button>
                    </Link>
                    <Link href={route('logout')} method="post" as="button" preserveScroll>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        Déconnexion
                      </Button>
                    </Link>
                  </>
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
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filter Sidebar */}
            <div className={`md:w-64 bg-white p-6 rounded-xl shadow-md ${showFilters ? 'block' : 'hidden md:block'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Filtres</h2>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Réinitialiser
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="type">Type de local</Label>
                  <Select value={localFilters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="sport">Terrains de sport</SelectItem>
                      <SelectItem value="conference">Salles de conférence</SelectItem>
                      <SelectItem value="party">Salles de fêtes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    type="text"
                    placeholder="Ville ou quartier"
                    value={localFilters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="min_capacity">Capacité minimum</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={localFilters.min_capacity}
                      onChange={(e) => handleFilterChange('min_capacity', parseInt(e.target.value) || 0)}
                    />
                    <span className="text-gray-500"><Users size={16} /></span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="max_price">Prix maximum</Label>
                    <span className="text-sm text-gray-500">{localFilters.max_price} DH</span>
                  </div>
                  <Slider
                    value={[localFilters.max_price]}
                    min={0}
                    max={3000}
                    step={100}
                    onValueChange={([value]) => handleFilterChange('max_price', value)}
                    className="my-2"
                  />
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={applyFilters}
                >
                  Appliquer les filtres
                </Button>
              </div>
            </div>
            
            {/* Venues List */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Venues disponibles</h1>
                <Button variant="outline" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
                  <Filter size={16} className="mr-2" />
                  Filtres
                </Button>
              </div>
              
              {venues.data.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
                  <p className="text-gray-600 mb-4">Essayez d'ajuster vos filtres ou recherchez d'autres critères.</p>
                  <Button variant="outline" onClick={resetFilters}>Réinitialiser les filtres</Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {venues.data.map((venue) => (
                    <Link key={venue.id} href={route('venues.show', venue.id)}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                        <div className="h-48 bg-gray-200 relative overflow-hidden">
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
                            <Badge className={getTypeColor(venue.type)}>
                              {getTypeLabel(venue.type)}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-5">
                          <h3 className="text-xl font-bold mb-2 text-gray-900">{venue.name}</h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">{venue.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600 mb-3">
                            <Users className="w-4 h-4 mr-1" />
                            <span className="text-sm">{venue.capacity} personnes</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {venue.amenities && venue.amenities.slice(0, 3).map((amenity, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                              >
                                {amenity}
                              </span>
                            ))}
                            {venue.amenities && venue.amenities.length > 3 && (
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">+{venue.amenities.length - 3}</span>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-bold text-blue-600">{venue.price} DH<span className="text-sm font-normal text-gray-500">/heure</span></p>
                            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                              Réserver
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              {venues.links && venues.links.length > 3 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    {venues.links.map((link, index) => (
                      <Link
                        key={index}
                        href={link.url || '#'}
                        className={`px-3 py-1 rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Venues;
