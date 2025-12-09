import { createContext } from 'react';
import type { DashboardSettings, DashboardSettingsActions } from './DashboardSettingsContext';

interface DashboardSettingsContextValue extends DashboardSettings {
  actions: DashboardSettingsActions;
}

export const DashboardSettingsContext = createContext<DashboardSettingsContextValue | undefined>(undefined);
