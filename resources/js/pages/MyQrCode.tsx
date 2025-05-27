import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { QrCode, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface MyQrCodeProps {
  qrImage: string;
  user: {
    name: string;
    email: string;
  };
}

const MyQrCode: React.FC<MyQrCodeProps> = ({ qrImage, user }) => {
  const { toast } = useToast();
  
  const downloadQrCode = () => {
    const link = document.createElement('a');
    link.href = `data:image/svg+xml;base64,${qrImage}`;
    link.download = `qrcode-${user.email}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'QR Code téléchargé',
      description: 'Votre QR code a été téléchargé avec succès.',
    });
  };
  
  const regenerateQrCode = () => {
    fetch(route('qr.generate', { user_id: null }), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
    })
      .then(response => response.json())
      .then(data => {
        // Reload the page to show the new QR code
        window.location.reload();
        
        toast({
          title: 'QR Code régénéré',
          description: 'Votre QR code a été régénéré avec succès.',
        });
      })
      .catch(error => {
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la régénération du QR code.',
          variant: 'destructive',
        });
      });
  };

  return (
    <>
      <Head title="Mon QR Code" />
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
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
              ← Retour au tableau de bord
            </Link>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="w-5 h-5 mr-2" />
                  Mon QR Code d'Accès
                </CardTitle>
                <CardDescription>
                  Utilisez ce QR code pour vous connecter rapidement à votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white p-4 rounded-lg border flex items-center justify-center">
                  <div className="w-64 h-64" dangerouslySetInnerHTML={{ __html: atob(qrImage) }} />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  <p>
                    <strong>Comment utiliser :</strong> Présentez ce QR code à la caméra lors de la connexion ou partagez-le avec le personnel autorisé pour une identification rapide.
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={downloadQrCode}
                    variant="outline" 
                    className="flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                  
                  <Button 
                    onClick={regenerateQrCode}
                    variant="outline" 
                    className="flex items-center text-amber-600 border-amber-200 hover:bg-amber-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Régénérer
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500 border-t pt-4 mt-2">
                  <p>
                    <strong>Sécurité :</strong> Ce QR code est unique à votre compte. Ne le partagez pas avec des personnes non autorisées. Pour des raisons de sécurité, régénérez-le régulièrement ou si vous soupçonnez une utilisation non autorisée.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyQrCode;
