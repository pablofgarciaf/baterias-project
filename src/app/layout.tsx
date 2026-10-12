import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Sora } from 'next/font/google';
import './globals.css';
import '@/styles/easing.css';
import '@/styles/leaflet.css';
import { Providers } from './providers';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'], weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans', display: 'swap',
});
const sora = Sora({
  subsets: ['latin'], weight: ['600', '700', '800'],
  variable: '--font-sora', display: 'swap',
});

const siteUrl = process.env.SITE_URL?.replace(/\/$/, '');
const publicContentApproved = process.env.SITE_CONTENT_VERIFIED === 'true';
const isIndexable = Boolean(siteUrl && publicContentApproved);

export const metadata: Metadata = {
  title: { default: 'Baterías Maresa | Encuentra la batería para tu vehículo', template: '%s | Baterías Maresa' },
  description: 'Explora opciones de baterías, consulta compatibilidad, conoce los puntos de atención y solicita información para tu negocio.',
  applicationName: 'Baterías Maresa',
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  alternates: siteUrl ? { canonical: '/' } : undefined,
  robots: { index: isIndexable, follow: isIndexable },
  openGraph: {
    type: 'website',
    siteName: 'Baterías Maresa',
    title: 'Baterías Maresa',
    description: 'Información sobre baterías, compatibilidad vehicular y opciones de contacto.',
    locale: 'es_EC',
    ...(siteUrl ? { images: [{ url: `${siteUrl}/hero-desktop.webp`, width: 1920, height: 800, alt: 'Baterías Maresa' }] } : {}),
  },
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-EC" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} ${sora.variable} bg-white text-slate-800 antialiased selection:bg-blue-600 selection:text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
