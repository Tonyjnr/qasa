export interface MonitoringStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country?: string | null;
  city?: string | null;
  source?: string | null;
  currentAqi?: number | null;
  lastUpdated?: string | Date | null;
}

export interface MapBounds {
  lat1: number;
  lng1: number;
  lat2: number;
  lng2: number;
}
