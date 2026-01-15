'use client';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  hash: string;
  id: string;
}

export default function TagQRCode({ hash, id }: Props) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/view-tag/${hash}`;

  const downloadQR = () => {
    const svg = document.getElementById(`qr-${id}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qrcode-${hash}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="flex flex-col items-center gap-2 p-2 bg-white rounded border">
      <QRCodeSVG id={`qr-${id}`} value={url} size={80} level="H" includeMargin />
      <button onClick={downloadQR} className="text-[10px] text-blue-600 hover:underline">
        Baixar PNG
      </button>
    </div>
  );
}