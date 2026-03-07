'use client';
import { useState } from 'react';
import { getBaseUrl } from '@/lib/utils/get-url';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Download, X, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  hash: string;
  id: string;
}

export default function TagQRCode({ hash, id }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/${hash}`;

  const downloadQR = () => {
    const svg = document.getElementById(`qr-${id}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const padding = 40;
      canvas.width = img.width + padding;
      canvas.height = img.height + padding;
      
      if (ctx) {
        ctx.fillStyle = "#white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, padding / 2, padding / 2);
      }

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qrcode-${hash}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center p-2 text-xs cursor-pointer tracking-widest text-slate-500 bg-slate-100 hover:bg-blue-100 hover:text-blue-500 rounded-full transition-all"
        title="Gerar QR Code"
      >
        <QrCode size={16} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-black text-slate-700 uppercase text-sm">QR Code de Ativação</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 flex flex-col items-center">
              <div className="p-4 bg-white border-2 border-slate-100 rounded-4xl shadow-inner mb-6">
                <QRCodeSVG
                  id={`qr-${id}`}
                  value={url}
                  size={200}
                  level="H"
                  marginSize={2}
                />
              </div>

              <div className="w-full space-y-3">
                <button
                  onClick={downloadQR}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  <Download size={18} /> Baixar PNG Alta Resolução
                </button>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(url);
                    toast.info('Link copiado!');
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  <Copy size={16} /> Copiar Link da URL
                </button>
              </div>
            </div>

            <div className="px-8 py-4 bg-slate-50 text-center">
              <a 
                href={url} 
                target="_blank" 
                className="text-[10px] font-black text-blue-500 hover:underline inline-flex items-center gap-1"
              >
                TESTAR REDIRECIONAMENTO <ExternalLink size={10} />
              </a>
            </div>
          </div>
          
          <div className="fixed inset-0 -z-10" onClick={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}