import { useMemo } from 'react';
import { pollutionOverlayService } from '../services/pollutionOverlayService';

export function usePollutionOverlay(layer: string) {
  const tileUrl = useMemo(() => {
    return pollutionOverlayService.getTileUrl(layer);
  }, [layer]);

  const legendUrl = useMemo(() => {
    return pollutionOverlayService.getLegendUrl(layer);
  }, [layer]);

  return { tileUrl, legendUrl };
}
