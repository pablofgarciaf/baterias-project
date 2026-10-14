// estado: ""
'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';

const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-RN96LPERCF';
const preferenceKey = 'maresa_analytics_consent';

type Preference = 'accepted' | 'rejected' | null;

export default function AnalyticsConsent() {
  const pathname = usePathname();
  const [preference, setPreference] = useState<Preference>(null);
  const [ready, setReady] = useState(false);
  const [showChoice, setShowChoice] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(preferenceKey);
    if (saved === 'accepted' || saved === 'rejected') setPreference(saved);
    else setShowChoice(true);
  }, []);

  useEffect(() => {
    if (preference !== 'accepted' || !ready) return;
    const analyticsWindow = window as typeof window & { gtag?: (...args: unknown[]) => void };
    analyticsWindow.gtag?.('event', 'page_view', {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    });
  }, [pathname, preference, ready]);

  const savePreference = (choice: Exclude<Preference, null>) => {
    const wasAccepted = preference === 'accepted';
    window.localStorage.setItem(preferenceKey, choice);
    if (choice === 'rejected' && wasAccepted) {
      const analyticsWindow = window as typeof window & { gtag?: (...args: unknown[]) => void };
      analyticsWindow.gtag?.('consent', 'update', { analytics_storage: 'denied' });
      window.location.reload();
      return;
    }
    setPreference(choice);
    setShowChoice(false);
  };

  return (
    <>
      {preference === 'accepted' && (
        <Script
          id="maresa-google-analytics"
          src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          strategy="afterInteractive"
          onReady={() => {
            const analyticsWindow = window as typeof window & {
              dataLayer?: unknown[];
              gtag?: (...args: unknown[]) => void;
            };
            analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
            analyticsWindow.gtag = (...args: unknown[]) => {
              analyticsWindow.dataLayer?.push(args);
            };
            analyticsWindow.gtag('js', new Date());
            analyticsWindow.gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
            });
            analyticsWindow.gtag('consent', 'update', { analytics_storage: 'granted' });
            analyticsWindow.gtag('config', measurementId, { send_page_view: false });
            setReady(true);
          }}
        />
      )}
      {showChoice ? (
        <div role="dialog" aria-label="Preferencias de medición" className="fixed bottom-4 left-4 right-4 z-[100] max-w-xl rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-2xl sm:right-auto">
          <p className="text-sm font-semibold">Medición del sitio</p>
          <p className="mt-1 text-sm leading-relaxed">Con tu permiso usamos Google Analytics para conocer el uso de esta web. Puedes rechazarlo o cambiar tu elección después. <a className="underline" href="/privacidad">Más información</a>.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => savePreference('rejected')} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100">Rechazar cookies opcionales</button>
            <button type="button" onClick={() => savePreference('accepted')} className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800">Aceptar medición</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setShowChoice(true)} className="mx-auto my-4 block rounded-full border border-primary-300 bg-white px-4 py-2 text-xs font-medium text-primary-800 shadow-sm hover:bg-primary-50">Privacidad y medición</button>
      )}
    </>
  );
}
