import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { QrReader } from 'react-qr-reader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const QrLogin = () => {
  const { toast } = useToast();
  const [scanActive, setScanActive] = useState(false);
  
  const { data, setData, post, processing, errors } = useForm({
    qr_code: '',
  });

  const handleQrScan = (result: any) => {
    if (result) {
      setData('qr_code', result?.text);
      setScanActive(false);
      handleSubmit();
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
                <QrReader
                  constraints={{ facingMode: 'environment' }}
                  onResult={handleQrScan}
                  className="w-full rounded-lg overflow-hidden"
                />
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setScanActive(false)}
                >
                  Annuler le scan
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-6">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={() => setScanActive(true)}
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
