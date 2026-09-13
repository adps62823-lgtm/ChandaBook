import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'माँ भगवती पूजन कला संघ | ChandaBook सासाराम',
  description: 'माँ भगवती पूजन कला संघ (ESTD-2001), कम्पनी सराय, रौज़ा रोड, सासाराम - दुर्गा पूजा चंदा संग्रह बहीखाता एवं मानचित्र',
  keywords: ['माँ भगवती पूजन कला संघ', 'Durga Puja', 'Sasaram', 'कम्पनी सराय', 'रौज़ा रोड', 'Chanda Book', 'Pandal Donation', 'Bihar'],
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
