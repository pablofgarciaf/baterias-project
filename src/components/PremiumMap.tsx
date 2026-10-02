'use client';

import React, { useEffect, useRef } from 'react';

interface PremiumMapProps {
  latitude: number;
  longitude: number;
  agencyName: string;
  isDark?: boolean;
}

export default function PremiumMap({ latitude, longitude, agencyName, isDark = false }: PremiumMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  // Load Leaflet CSS once
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(link);

    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;

        // Create map with premium dark theme
        map.current = L.map(mapContainer.current, {
          center: [latitude, longitude],
          zoom: 15,
          zoomControl: true,
          attributionControl: false,
          dragging: true,
          touchZoom: true,
          scrollWheelZoom: false,
        });

        // CartoDB Dark tiles (premium look)
        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          {
            maxZoom: 19,
            subdomains: 'abcd',
            opacity: 0.95,
          }
        ).addTo(map.current);

        // Premium marker with custom styling
        const markerIcon = L.divIcon({
          html: `
            <div style="position: relative; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); box-shadow: 0 0 20px rgba(37, 99, 235, 0.6); animation: pulse 2s infinite;"></div>
              <svg style="width: 28px; height: 28px; color: white; position: relative; z-index: 1;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
            </div>
            <style>@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.8; } }</style>
          `,
          iconSize: [48, 48],
          iconAnchor: [24, 48],
          popupAnchor: [0, -48],
          className: 'custom-marker',
        });

        const marker = L.marker([latitude, longitude], { icon: markerIcon }).addTo(map.current);

        // Premium popup
        marker.bindPopup(
          `<div style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%); padding: 16px; border-radius: 12px; border: 1px solid rgba(148, 163, 184, 0.2); backdrop-filter: blur(10px); min-width: 200px;"><div style="color: #e2e8f0; font-weight: 700; font-size: 14px; margin-bottom: 8px; letter-spacing: 0.5px;">${agencyName}</div><div style="color: #94a3b8; font-size: 12px; line-height: 1.5;">📍 Lat: ${latitude.toFixed(4)}<br/>Lon: ${longitude.toFixed(4)}</div></div>`,
          {
            className: 'premium-popup',
            closeButton: false,
            autoClose: false,
          }
        );

        marker.openPopup();
      } catch (error) {
        console.error('Error loading map:', error);
      }
    };

    initMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, agencyName]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '0',
      }}
    />
  );
}
