import { Metadata, Viewport } from 'next';

import './globals.css';
import Header from '@/components/Header';
import CookieBanner from '@/components/legal/CookieBanner';
import Footer from '@/components/Footer';
import { PWAProvider } from './providers';
import { Toaster } from 'sonner';

const APP_NAME = "Meu Info ID";
const APP_DEFAULT_TITLE = "Meu Info ID - Sua Identidade NFC";
const APP_TITLE_TEMPLATE = "%s - Meu Info ID";
const APP_DESCRIPTION = "Gerencie e disponibilize informações importantes com tecnologia NFC.";

export const metadata: Metadata = {  
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon0.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" dir="ltr" className="light" style={{ colorScheme: 'light' }}>
      <head>
        <meta name="apple-mobile-web-app-title" content="Meu Info ID" />
      </head>
      <body className="antialiased bg-gray-50">
        <PWAProvider>
          <Header />
          <main>
            {children}
            <Toaster />
            <CookieBanner />
          </main>
          <Footer />
        </PWAProvider>
      </body>
    </html>
  );
}