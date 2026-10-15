/**
 * Extrae latitud/longitud de un iframe (o URL) de Google Maps.
 * El administrador solo pega el iframe; las coordenadas se derivan de él.
 *
 * Formatos soportados:
 *  - Embed:  ...!2d{lng}!3d{lat}...      (pb= de maps/embed)
 *  - Lugar:  ...!3d{lat}!4d{lng}...      (data= de URLs de lugar)
 *  - Query:  ...?q={lat},{lng} | ll= | center= | @{lat},{lng}
 */
export interface MapCoordinates {
  latitude: number;
  longitude: number;
}

const isValid = (lat: number, lng: number) =>
  Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

export function coordsFromMapsEmbed(input?: string | null): MapCoordinates | null {
  if (!input) return null;
  const text = decodeURIComponent(input.replace(/&amp;/g, '&')).trim();
  const num = '(-?\\d+(?:\\.\\d+)?)';

  const patterns: Array<{ re: RegExp; order: 'lat-lng' | 'lng-lat' }> = [
    { re: new RegExp(`!2d${num}!3d${num}`), order: 'lng-lat' },
    { re: new RegExp(`!3d${num}!4d${num}`), order: 'lat-lng' },
    { re: new RegExp(`[?&](?:q|ll|center)=${num},\\s*${num}`), order: 'lat-lng' },
    { re: new RegExp(`@${num},${num}`), order: 'lat-lng' },
  ];

  for (const { re, order } of patterns) {
    const match = text.match(re);
    if (!match) continue;
    const a = Number(match[1]);
    const b = Number(match[2]);
    const latitude = order === 'lat-lng' ? a : b;
    const longitude = order === 'lat-lng' ? b : a;
    if (isValid(latitude, longitude)) return { latitude, longitude };
  }
  return null;
}

/**
 * Devuelve una URL segura para incrustar a partir de lo que pegó el administrador.
 * Solo se acepta https de Google Maps; nunca se inyecta HTML del usuario en la página.
 */
export function embedSrcFromIframe(input?: string | null): string | null {
  if (!input) return null;
  const match = input.match(/src\s*=\s*["']([^"']+)["']/i);
  const raw = (match ? match[1] : input.trim()).replace(/&amp;/g, '&');
  try {
    const url = new URL(raw);
    const okHost = url.protocol === 'https:' && (url.hostname === 'www.google.com' || url.hostname === 'maps.google.com');
    if (!okHost || !url.pathname.startsWith('/maps')) return null;
    return url.toString();
  } catch {
    return null;
  }
}
