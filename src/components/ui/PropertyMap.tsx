"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface PropertyMapProps {
  lat: number;
  lng: number;
  title?: string;
  className?: string;
}

export default function PropertyMap({ lat, lng, title, className }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 15,
      scrollWheelZoom: false,
    });

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Custom marker icon (red pin matching brand)
    const customIcon = L.divIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fd0100" width="36" height="36">
        <path d="M12 0C7.03 0 3 4.03 3 9c0 6.75 9 15 9 15s9-8.25 9-15c0-4.97-4.03-9-9-9zm0 12.75c-2.07 0-3.75-1.68-3.75-3.75S9.93 5.25 12 5.25 15.75 6.93 15.75 9 14.07 12.75 12 12.75z"/>
      </svg>`,
      className: "custom-map-marker",
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });

    // Add marker
    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

    if (title) {
      marker.bindPopup(
        `<div style="font-family: var(--font-sans); font-weight: 600; font-size: 14px; padding: 4px 0;">${title}</div>`,
        { closeButton: false, offset: [0, -10] }
      );
    }

    mapInstanceRef.current = map;

    // Fix map rendering issue (common with dynamic containers)
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng, title]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-map-marker { background: none !important; border: none !important; }
        .leaflet-popup-content-wrapper { border-radius: 12px !important; box-shadow: 0 4px 20px rgba(0,0,0,0.12) !important; }
        .leaflet-popup-tip { display: none; }
      `}} />
      <div
        ref={mapRef}
        className={`w-full rounded-xl overflow-hidden ${className || "h-[350px]"}`}
      />
    </>
  );
}
