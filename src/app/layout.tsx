import type { Metadata } from 'next';
import { Inter, Kantumruy_Pro } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/context/LanguageContext';
import { CurrencyProvider } from '@/lib/context/CurrencyContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const kantumruy = Kantumruy_Pro({
  subsets: ['khmer', 'latin'],
  variable: '--font-kantumruy',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HOME SPORT | Football Boots, Jerseys & Sports Gear in Cambodia',
  description: 'Cambodia premier sports catalog for football boots, club jerseys, goalkeeper gloves, and athletic accessories. Top brands: Nike, Adidas, Puma, Mizuno, Joma.',
  keywords: 'football boots cambodia, soccer shoes phnom penh, football jerseys, home sport, nike mercurial, adidas predator',
  openGraph: {
    title: 'HOME SPORT - Your Game. Your Style.',
    description: 'Discover premium football boots, jerseys, and accessories in Cambodia.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="km" className={`${inter.variable} ${kantumruy.variable}`}>
      <body className="font-sans antialiased text-slate-900 bg-slate-50 flex flex-col min-h-screen">
        <LanguageProvider>
          <CurrencyProvider>
            {children}
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
