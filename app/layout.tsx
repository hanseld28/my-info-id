import './globals.css';
import Header from '@/components/Header';

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
    <html lang="pt-br">
      <body className="antialiased bg-gray-50">
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}