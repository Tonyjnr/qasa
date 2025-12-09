import { TileLayer } from 'react-leaflet';
import { usePollutionOverlay } from '../../../hooks/usePollutionOverlay';

interface PollutionLayerProps {
  layer: string; // e.g., 'pressure_new', 'precipitation_new', 'clouds_new', 'temp_new', 'wind_new'
  opacity?: number;
}

export const PollutionLayer = ({ layer, opacity = 0.6 }: PollutionLayerProps) => {
  const { tileUrl } = usePollutionOverlay(layer);

  if (!tileUrl) return null;

  return (
    <TileLayer
      url={tileUrl}
      opacity={opacity}
      zIndex={10} // Ensure it sits above base map but below markers
    />
  );
};
