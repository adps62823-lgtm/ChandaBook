import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'रौज़ा रोड दुर्गा पूजा चंदा बुक | Sasaram ChandaBook',
  description: 'Durga Puja Pandal Chanda (Donation) Collection & Realtime Map Logbook for Rouza Road, Sasaram',
  keywords: ['Durga Puja', 'Sasaram', 'Rouza Road', 'Chanda Book', 'Pandal Donation', 'Bihar'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body className="bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30 text-stone-800 min-h-screen">
        {children}
      </body>
    </html>
  );
}
