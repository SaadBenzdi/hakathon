import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const QrLogin = () => {
  const { toast } = useToast();
  const [scanActive, setScanActive] = useState(false);
  const qrScannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  
  const { data, setData, post, processing, errors } = useForm({
    qr_code: '',
  });

  useEffect(() => {
    // Nettoyer le scanner lorsque le composant est démonté
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(error => console.error('Erreur lors de l\'arrêt du scanner:', error));
      }
    };
  }, []);

  const startScanner = () => {
    if (!qrScannerRef.current) return;
    
    setScanActive(true);
    
    const qrScanner = new Html5Qrcode('qr-reader');
    html5QrCodeRef.current = qrScanner;
    
    qrScanner.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText) => {
        // Succès du scan
        setData('qr_code', decodedText);
        stopScanner();
        handleSubmit();
      },
      (errorMessage) => {
        // Erreur silencieuse pendant le scan (pas besoin de l'afficher)
        console.log(errorMessage);
      }
    ).catch(error => {
      // Erreur lors du démarrage du scanner
      console.error(error);
      toast({
        title: 'Erreur de scan',
        description: 'Impossible d\'accéder à la caméra ou de scanner le code QR.',
        variant: 'destructive',
      });
      setScanActive(false);
    });
  };

  const stopScanner = () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      html5QrCodeRef.current.stop().then(() => {
        setScanActive(false);
      }).catch(error => {
        console.error('Erreur lors de l\'arrêt du scanner:', error);
      });
    } else {
      setScanActive(false);
    }
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData('qr_code', e.target.value);
  };

  const handleSubmit = () => {
    post(route('qr.authenticate'), {
      onSuccess: () => {
        toast({
          title: 'Connexion réussie',
          description: 'Vous êtes maintenant connecté.',
        });
      },
      onError: () => {
        toast({
          title: 'Erreur de connexion',
          description: 'QR code invalide ou expiré.',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <>
      <Head title="Connexion par QR Code" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Connexion par QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            {scanActive ? (
              <div className="mb-6">
                <div id="qr-reader" ref={qrScannerRef} className="w-full rounded-lg overflow-hidden" style={{ maxWidth: '100%' }}></div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={stopScanner}
                >
                  Annuler le scan
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-6">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={startScanner}
                  >
                    Scanner un QR Code
                  </Button>
                </div>
                
                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-gray-500">ou</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                  <div className="mb-4">
                    <Input
                      type="text"
                      placeholder="Entrez votre code QR manuellement"
                      value={data.qr_code}
                      onChange={handleManualInput}
                      className="w-full"
                    />
                    {errors.qr_code && (
                      <p className="text-sm text-red-600 mt-1">{errors.qr_code}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={processing}
                  >
                    Se connecter
                  </Button>
                </form>
                
                <div className="text-center mt-4">
                  <a href={route('login')} className="text-sm text-blue-600 hover:underline">
                    Retour à la connexion classique
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default QrLogin;
