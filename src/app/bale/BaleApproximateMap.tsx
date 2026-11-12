"use client";

import { CircleMarker, MapContainer, TileLayer } from "react-leaflet";
import type { BaleApproximateLocation } from "@/lib/types";

export default function BaleApproximateMap({
  location,
  compact = false,
}: {
  location: BaleApproximateLocation;
  compact?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-secondary-200 bg-secondary-100 ${compact ? "h-44" : "h-48 sm:h-72"}`}
      role="region"
      aria-label="Approximate estate location map"
    >
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={compact ? 12 : 13}
        scrollWheelZoom={false}
        dragging={!compact}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker
          center={[location.lat, location.lng]}
          radius={compact ? 8 : 10}
          pathOptions={{
            color: "#ffffff",
            weight: 3,
            fillColor: "#dc2626",
            fillOpacity: 1,
          }}
        />
      </MapContainer>
    </div>
  );
}
