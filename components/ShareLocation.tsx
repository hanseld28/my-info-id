'use client';

import { useEffect, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface ShareLocationProps {
  phone: string;
  ownerName: string;
}

export default function ShareLocation({ phone, ownerName }: ShareLocationProps) {
  const [loading, setLoading] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  useEffect(() => {
    if (whatsappUrl) {
      setTimeout(() => {
        document.getElementById('whatsapp-share-location-link')?.click();
      }, 500);
    }
  }, [whatsappUrl]);

  const handleShare = () => {
    if (!navigator.geolocation) {
      alert("O seu navegador não suporta geolocalização.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        const message = encodeURIComponent(
          `Olá! Encontrei o/a *${ownerName}* através do Meu Info ID.\n\nMinha localização atual é:\n${googleMapsUrl}`
        );
        
        const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`;

        setWhatsappUrl(url);
        setLoading(false);
      },
      (_error) => {
        setLoading(false);
        alert("Não foi possível obter a sua localização. Por favor, verifique as permissões do seu GPS.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return (
    <>
      <button
        onClick={handleShare}
        disabled={loading}
        className="mt-4 flex items-center gap-2 text-blue-600 font-semibold text-xs bg-white px-6 py-3 rounded-full shadow-xs border border-blue-100"
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <MapPin size={22} />
            <span>Enviar Localização</span>
          </>
        )}
      </button>
      <a 
        id="whatsapp-share-location-link"
        href={whatsappUrl} 
        target="_blank"
        hidden
      ></a>
    </>
  );
}