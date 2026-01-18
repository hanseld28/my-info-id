'use client';

import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface ShareLocationProps {
  phone: string;
  ownerName: string;
}

export default function ShareLocation({ phone, ownerName }: ShareLocationProps) {
  const [loading, setLoading] = useState(false);

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
        
        const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`;
        
        window.open(whatsappUrl, '_blank');
        setLoading(false);
      },
      (_error) => {
        setLoading(false);
        alert("Não foi possível obter a sua localização. Por favor, verifique as permissões do seu GPS.");
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  return (
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
  );
}