import { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { AqiStationMarker } from "./AqiStationMarker";
import { PollutionLayer } from "./PollutionLayer";
import { MapControls } from "./MapControls"; // Import the new component
import { useMonitoringStations } from "../../../hooks/useMonitoringStations";
import { Loader2 } from "lucide-react";
import type { MonitoringStation } from "../../../types/maps";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

const MapController = ({ center }: { center?: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 10);
    }
  }, [center, map]);
  return null;
};

export const InteractiveMapProfessional = () => {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] =
    useState<MonitoringStation | null>(null);

  const { data: stations, isLoading } = useMonitoringStations();

  const toggleLayer = (layer: string) => {
    setActiveLayer((prev) => (prev === layer ? null : layer));
  };

  return (
    <div className="relative h-[600px] w-full rounded-xl overflow-hidden border border-border bg-muted">
      <MapContainer
        center={[6.5244, 3.3792]} // Default to Lagos
        zoom={6}
        className="h-full w-full"
        scrollWheelZoom={true}
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

        <MapController
          center={
            selectedStation
              ? [selectedStation.lat, selectedStation.lng]
              : undefined
          }
        />
      </MapContainer>

      {/* New Modular Controls */}
      <MapControls 
        activeLayer={activeLayer} 
        onLayerChange={toggleLayer} 
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-[500]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};