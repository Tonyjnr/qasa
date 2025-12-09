import { createContext, useContext, useState, useCallback, type ReactNode, useMemo } from 'react';

export interface DashboardSettings {
  selectedStationId: string | null;
  globalDateRange: { start: Date; end: Date; };
  activeMapLayers: string[];
}

export interface DashboardSettingsActions {
  setSelectedStationId: (id: string | null) => void;
  setGlobalDateRange: (range: { start: Date; end: Date; }) => void;
  toggleMapLayer: (layerId: string) => void;
}

interface DashboardSettingsContextValue extends DashboardSettings {
  actions: DashboardSettingsActions;
}

const DashboardSettingsContext = createContext<DashboardSettingsContextValue | undefined>(undefined);

export function DashboardSettingsProvider({ children }: { children: ReactNode }) {
  const [selectedStationId, setSelectedStationIdState] = useState<string | null>(null);
  const [globalDateRange, setGlobalDateRangeState] = useState<{ start: Date; end: Date; }>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)), // Default last month
    end: new Date(),
  });
  const [activeMapLayers, setActiveMapLayersState] = useState<string[]>(['aqi_stations']);

  const setSelectedStationId = useCallback((id: string | null) => {
    setSelectedStationIdState(id);
  }, []);

  const setGlobalDateRange = useCallback((range: { start: Date; end: Date; }) => {
    setGlobalDateRangeState(range);
  }, []);

  const toggleMapLayer = useCallback((layerId: string) => {
    setActiveMapLayersState(prev =>
      prev.includes(layerId) ? prev.filter(id => id !== layerId) : [...prev, layerId]
    );
  }, []);

  const actions = useMemo(() => ({
    setSelectedStationId,
    setGlobalDateRange,
    toggleMapLayer,
  }), [setSelectedStationId, setGlobalDateRange, toggleMapLayer]);

  const value = useMemo(() => ({
    selectedStationId,
    globalDateRange,
    activeMapLayers,
    actions,
  }), [selectedStationId, globalDateRange, activeMapLayers, actions]);

  return (
    <DashboardSettingsContext.Provider value={value}>
      {children}
    </DashboardSettingsContext.Provider>
  );
}

export function useDashboardSettings() {
  const context = useContext(DashboardSettingsContext);
  if (!context) {
    throw new Error('useDashboardSettings must be used within a DashboardSettingsProvider');
  }
  return context;
}
