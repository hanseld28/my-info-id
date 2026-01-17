import { Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
};

export const metadata = {
  title: 'Meu Info ID - Sua Identidade NFC',
  description: 'Gerencie e disponibilize informações importantes com tecnologia NFC.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="light" style={{ colorScheme: 'light' }}>
      <head>
        <meta name="apple-mobile-web-app-title" content="Meu Info ID" />
      </head>
      <body className="antialiased bg-gray-50">
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}