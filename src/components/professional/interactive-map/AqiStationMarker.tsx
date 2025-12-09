import { Marker, Popup, useMap } from 'react-leaflet';
import { getAqiColor, getAqiCategory } from '../../../lib/aqiUtils';
import type { MonitoringStation } from '../../../types/maps';
import { divIcon } from 'leaflet';

interface AqiStationMarkerProps {
  station: MonitoringStation;
  onClick?: (station: MonitoringStation) => void;
}

export const AqiStationMarker = ({ station, onClick }: AqiStationMarkerProps) => {
  const map = useMap();

  const handleClick = () => {
    if (onClick) onClick(station);
    map.flyTo([station.lat, station.lng], 13);
  };

  const aqi = station.currentAqi || 0;
  const color = getAqiColor(aqi);
  
  const customIcon = divIcon({
    className: 'custom-aqi-marker',
    html: `<div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      font-weight: bold;
      color: ${aqi > 100 ? 'white' : 'black'};
      font-size: 12px;
    ">${aqi}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  return (
    <Marker 
      position={[station.lat, station.lng]} 
      icon={customIcon}
      eventHandlers={{
        click: handleClick,
      }}
    >
      <Popup>
        <div className="p-2 min-w-[150px]">
          <h3 className="font-bold text-sm mb-1">{station.name}</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">AQI</span>
            <span className="font-bold" style={{ color }}>{aqi}</span>
          </div>
          <div className="text-xs bg-slate-100 p-1 rounded text-center">
            {getAqiCategory(aqi)}
          </div>
          <div className="text-[10px] text-muted-foreground mt-2 text-right">
            Source: {station.source || 'Unknown'}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
