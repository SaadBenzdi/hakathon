import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, Users, CreditCard } from 'lucide-react';

interface IndexProps {
  auth: {
    user: {
      name: string;
      email: string;
      role: string;
    } | null;
  };
}

const Index: React.FC<IndexProps> = ({ auth }) => {
  const isLoggedIn = auth.user !== null;

  return (
    <>
      <Head title="Accueil - VenueBook" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="size-25">
                  <img src="7ajz.svg" alt="" />
                </div>
                {/* <Link href="/" className="text-xl font-bold text-gray-900">7jez Daba</Link> */}
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link href="/venues" className="text-gray-600 hover:text-gray-900 transition-colors">Venues</Link>
                {isLoggedIn && (
                  <>
                    <Link href="/my-bookings" className="text-gray-600 hover:text-gray-900 transition-colors">Mes Réservations</Link>
                    <Link href="/reservations" className="text-gray-600 hover:text-gray-900 transition-colors">Mes Factures</Link>
                  </>
                )}
              </nav>
              <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="outline" size="sm">
                        Tableau de bord
                      </Button>
                    </Link>
                    <Link href={route('logout')} method="post" preserveScroll>
                      <Button variant="ghost" size="sm">
                        Déconnexion
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" size="sm">
                        Connexion
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm">
                        Inscription
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-green-600 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="md:w-2/3">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Réservez le lieu idéal pour vos événements
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-100">
                Trouvez et réservez facilement des espaces sportifs, salles de conférence et salles des fêtes partout au Maroc.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/venues">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                    Explorer les venues
                  </Button>
                </Link>
                {!isLoggedIn && (
                  <Link href="/register">
                    <Button size="lg" variant="outline" className="border-white text-green-700 hover:bg-green-50">
                      Créer un compte
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
          {/* <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24 fill-current text-slate-50">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
            </svg>
          </div> */}
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comment ça fonctionne</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Notre plateforme facilite la recherche et la réservation d'espaces pour tous vos besoins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-blue-50 rounded-full mb-4">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Trouvez un lieu</h3>
                  <p className="text-gray-600">
                    Explorez notre sélection de venues et trouvez celle qui correspond à vos besoins.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-green-50 rounded-full mb-4">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Choisissez une date</h3>
                  <p className="text-gray-600">
                    Sélectionnez la date et l'heure qui vous conviennent pour votre événement.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-amber-50 rounded-full mb-4">
                    <CreditCard className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Réservez en ligne</h3>
                  <p className="text-gray-600">
                    Effectuez votre réservation et le paiement en quelques clics via notre plateforme sécurisée.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-purple-50 rounded-full mb-4">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Profitez de votre événement</h3>
                  <p className="text-gray-600">
                    Rendez-vous sur place et profitez de votre événement en toute tranquillité.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Venue Types Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Types d'espaces disponibles</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Découvrez notre large sélection d'espaces adaptés à tous vos besoins.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-blue-600 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">Espaces Sportifs</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    Terrains de football, basketball, tennis et autres installations sportives pour vos activités physiques.
                  </p>
                  <Link href="/venues?type=sport">
                    <Button variant="outline" className="w-full">Voir les espaces sportifs</Button>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-indigo-600 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">Salles de Conférence</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    Espaces professionnels équipés pour vos réunions, formations et événements d'entreprise.
                  </p>
                  <Link href="/venues?type=conference">
                    <Button variant="outline" className="w-full">Voir les salles de conférence</Button>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-pink-600 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">Salles des Fêtes</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    Lieux conviviaux pour vos célébrations, mariages, anniversaires et autres événements festifs.
                  </p>
                  <Link href="/venues?type=party">
                    <Button variant="outline" className="w-full">Voir les salles des fêtes</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à organiser votre prochain événement ?</h2>
            <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui font confiance à VenueBook pour leurs réservations d'espaces.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/venues">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                  Explorer les venues
                </Button>
              </Link>
              {!isLoggedIn && (
                <Link href="/register">
                  <Button size="lg" variant="outline" className="border-white text-green-700 hover:bg-white/10">
                    Créer un compte
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white text-lg font-semibold mb-4">VenueBook</h3>
                <p className="text-sm text-gray-400">
                  La plateforme de réservation d'espaces numéro 1 au Maroc pour tous vos événements et activités.
                </p>
              </div>
              <div>
                <h4 className="text-white text-md font-medium mb-4">Liens rapides</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/venues" className="hover:text-white transition-colors">Tous les espaces</Link></li>
                  <li><Link href="/venues?type=sport" className="hover:text-white transition-colors">Espaces sportifs</Link></li>
                  <li><Link href="/venues?type=conference" className="hover:text-white transition-colors">Salles de conférence</Link></li>
                  <li><Link href="/venues?type=party" className="hover:text-white transition-colors">Salles des fêtes</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white text-md font-medium mb-4">Assistance</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="hover:text-white transition-colors">Centre d'aide</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Nous contacter</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white text-md font-medium mb-4">Légal</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="hover:text-white transition-colors">Conditions d'utilisation</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Mentions légales</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} VenueBook. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
