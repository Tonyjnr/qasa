import { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { AqiStationMarker } from "./AqiStationMarker";
import { PollutionLayer } from "./PollutionLayer";
import { MapControls } from "./MapControls";
import { useMonitoringStations } from "../../../hooks/useMonitoringStations";
import { Loader2 } from "lucide-react";
import type { MonitoringStation } from "../../../types/maps";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// Component to handle map flying when center prop changes
const MapController = ({ center }: { center?: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 10, {
        animate: true,
        duration: 1.5
      });
    }
  }, [center, map]);
  return null;
};

// Component to handle map clicks
const MapEvents = ({ onLocationChange }: { onLocationChange?: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      if (onLocationChange) {
        onLocationChange(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

interface InteractiveMapProfessionalProps {
  center?: [number, number];
  onLocationChange?: (lat: number, lng: number) => void;
}

export const InteractiveMapProfessional = ({ center, onLocationChange }: InteractiveMapProfessionalProps) => {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<MonitoringStation | null>(null);

  const { data: stations, isLoading } = useMonitoringStations();

  const toggleLayer = (layer: string) => {
    setActiveLayer((prev) => (prev === layer ? null : layer));
  };

  // Determine effective center: either selected station or prop passed from search
  const effectiveCenter = selectedStation 
    ? [selectedStation.lat, selectedStation.lng] as [number, number]
    : center;

  return (
    <div className="relative h-[600px] w-full rounded-xl overflow-hidden border border-border bg-muted z-0">
      <MapContainer
        center={center || [6.5244, 3.3792]} 
        zoom={6}
        className="h-full w-full z-0"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {activeLayer && <PollutionLayer layer={activeLayer} />}

        <MarkerClusterGroup>
          {stations?.map((station) => (
            <AqiStationMarker
              key={station.id}
              station={station}
              onClick={setSelectedStation}
            />
          ))}
        </MarkerClusterGroup>

        <MapController center={effectiveCenter} />
        <MapEvents onLocationChange={onLocationChange} />
      </MapContainer>

      <MapControls 
        activeLayer={activeLayer} 
        onLayerChange={toggleLayer} 
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-[100]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};