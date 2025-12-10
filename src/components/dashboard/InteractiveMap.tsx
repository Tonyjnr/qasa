import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// Pull images from CDN or local setup if available.
// For Vite, explicit imports usually work best, or using a CDN for the icon fix.
// We'll use the import method which works with the assets plugin.

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

import type { AQIData } from "../../types";
import { useEffect } from "react";

// Fix Leaflet's default icon path issues with webpack/vite
const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(L.Marker.prototype.options.icon as any) = DefaultIcon;

interface InteractiveMapProps {
  data: AQIData | null;
  onLocationChange: (lat: number, lng: number) => void;
}

import type { LeafletMouseEvent } from "leaflet";

const MapEvents = ({
  onLocationChange,
}: {
  onLocationChange: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

export const InteractiveMap = ({
  data,
  onLocationChange,
}: InteractiveMapProps) => {
  if (!data) return null;

  // Key forces re-render when location changes, preventing map from sticking to old center
  const center: [number, number] = [data.location.lat, data.location.lng];

  return (
    <div className="h-full w-full">
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={center}>
          <Popup>
            <div className="text-center font-sans text-slate-800">
              <span className="font-bold text-sm">{data.location.name}</span>
              <div className="mt-1 text-xs">
                AQI: <b>{data.aqi}</b>
              </div>
            </div>
          </Popup>
        </Marker>
        <MapEvents onLocationChange={onLocationChange} />
        <MapUpdater center={center} />
      </MapContainer>
    </div>
  );
};
