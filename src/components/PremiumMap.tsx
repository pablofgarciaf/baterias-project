// estado: ""
'use client';

import { useCallback, useEffect, useRef } from 'react';
import type * as Leaflet from 'leaflet';

export interface MapLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  /** Si es verdadero, la ruta se calcula por coordenadas y no por el texto de la dirección. */
  routeByCoordinates?: boolean;
}

interface PremiumMapProps {
  latitude?: number;
  longitude?: number;
  agencyName?: string;
  locations?: MapLocation[];
  selectedLocationId?: string | null;
  isDark?: boolean;
  onSelectLocation?: (locationId: string) => void;
}

const ECUADOR_CENTER: [number, number] = [-1.8312, -78.1834];

export default function PremiumMap({
  latitude = ECUADOR_CENTER[0],
  longitude = ECUADOR_CENTER[1],
  agencyName = 'Puntos de atención',
  locations = [],
  selectedLocationId,
  isDark = false,
  onSelectLocation,
}: PremiumMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const leafletRef = useRef<typeof Leaflet | null>(null);
  const markerLayerRef = useRef<Leaflet.LayerGroup | null>(null);
  const tileLayerRef = useRef<Leaflet.TileLayer | null>(null);
  const onSelectRef = useRef(onSelectLocation);
  onSelectRef.current = onSelectLocation;

  const renderLocations = useCallback(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const markerLayer = markerLayerRef.current;
    if (!L || !map || !markerLayer) return;

    markerLayer.clearLayers();
    const validLocations = locations.filter((location) =>
      Number.isFinite(location.latitude) && Number.isFinite(location.longitude),
    );

    validLocations.forEach((location) => {
      const marker = L.marker([location.latitude, location.longitude], {
        icon: L.divIcon({
          className: '',
          html: '<span aria-hidden="true" style="display:block;width:25px;height:25px;border:3px solid white;border-radius:50% 50% 50% 0;background:#f7901e;box-shadow:0 3px 12px #1e1e1d88;transform:rotate(-45deg)"></span>',
          iconSize: [30, 38],
          iconAnchor: [15, 34],
          popupAnchor: [0, -32],
        }),
        title: `${location.name}, ${location.city}`,
        alt: `${location.name}, ${location.city}`,
      }).addTo(markerLayer);

      const popup = document.createElement('div');
      popup.className = 'maresa-map-popup';
      popup.style.cssText = 'display:grid;gap:6px;max-width:240px;font:13px/1.45 system-ui,sans-serif;color:#242423';
      const title = document.createElement('strong');
      title.textContent = location.name;
      const address = document.createElement('span');
      address.textContent = `${location.address}, ${location.city}`;
      const route = document.createElement('a');
      route.textContent = 'Cómo llegar';
      route.style.cssText = 'font-weight:700;color:#b84700;text-decoration:underline';
      route.href = `https://www.google.com/maps/dir/?api=1&destination=${location.routeByCoordinates ? `${location.latitude},${location.longitude}` : encodeURIComponent(`${location.address}, ${location.city}, Ecuador`)}`;
      route.target = '_blank';
      route.rel = 'noopener noreferrer';
      popup.append(title, address, route);
      marker.bindPopup(popup);
      marker.on('click', () => onSelectRef.current?.(location.id));
    });

    const selected = validLocations.find((location) => location.id === selectedLocationId);
    if (selected) {
      map.setView([selected.latitude, selected.longitude], 14, { animate: true, duration: 0.45 });
      markerLayer.eachLayer((layer) => {
        const marker = layer as Leaflet.Marker;
        if (marker.getLatLng().lat === selected.latitude && marker.getLatLng().lng === selected.longitude) {
          marker.openPopup();
        }
      });
    } else if (validLocations.length > 1) {
      const bounds = L.latLngBounds(validLocations.map((location) => [location.latitude, location.longitude]));
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 13, animate: true });
    } else if (validLocations.length === 1) {
      map.setView([validLocations[0].latitude, validLocations[0].longitude], 14, { animate: true });
    } else {
      map.setView([latitude, longitude], 7, { animate: true });
    }
  }, [latitude, longitude, locations, selectedLocationId]);

  useEffect(() => {
    let cancelled = false;
    const stylesheetId = 'maresa-leaflet-styles';
    let stylesheet = document.getElementById(stylesheetId) as HTMLLinkElement | null;
    if (!stylesheet) {
      stylesheet = document.createElement('link');
      stylesheet.id = stylesheetId;
      stylesheet.rel = 'stylesheet';
      stylesheet.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(stylesheet);
    }

    import('leaflet').then((module) => {
      if (cancelled || !containerRef.current || mapRef.current) return;
      const L = module.default;
      leafletRef.current = L;
      const map = L.map(containerRef.current, {
        center: ECUADOR_CENTER,
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: false,
        preferCanvas: true,
      });
      mapRef.current = map;
      markerLayerRef.current = L.layerGroup().addTo(map);
      tileLayerRef.current = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' },
      ).addTo(map);
      renderLocations();
      window.setTimeout(() => map.invalidateSize(), 80);
    }).catch(() => {
      if (containerRef.current) {
        containerRef.current.dataset.mapError = 'true';
      }
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
      tileLayerRef.current = null;
      leafletRef.current = null;
    };
    // Map instance is created once; subsequent data and view updates are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    renderLocations();
  }, [renderLocations]);

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label={agencyName}
      className={`maresa-leaflet-map h-full w-full${isDark ? ' is-dark' : ''}`}
    />
  );
}
