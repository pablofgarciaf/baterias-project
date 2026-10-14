// estado: ""
import type { Metadata } from 'next';
import '@fontsource/open-sans/latin-400.css';
import '@fontsource/open-sans/latin-500.css';
import '@fontsource/open-sans/latin-600.css';
import '@fontsource/open-sans/latin-700.css';
import '@fontsource/montserrat/latin-600.css';
import '@fontsource/montserrat/latin-700.css';
import '@fontsource/montserrat/latin-800.css';
import './globals.css';
import '@/styles/easing.css';
import '@/styles/leaflet.css';
import { Providers } from './providers';

const siteUrl = process.env.SITE_URL?.replace(/\/$/, '');
const publicContentApproved = process.env.SITE_CONTENT_VERIFIED === 'true';
const isIndexable = Boolean(siteUrl && publicContentApproved);

export const metadata: Metadata = {
  title: { default: 'Baterías Maresa | Encuentra la batería para tu vehículo', template: '%s | Baterías Maresa' },
  description: 'Explora tecnologías de baterías, consulta compatibilidad y encuentra direcciones de locales Maresa.',
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
      <body className="bg-brand-canvas text-brand-slate antialiased selection:bg-secondary-500 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
