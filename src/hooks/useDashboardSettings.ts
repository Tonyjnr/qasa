import { useContext } from 'react';
import { DashboardSettingsContext } from '../contexts/DashboardContext';

export function useDashboardSettings() {
  const context = useContext(DashboardSettingsContext);
  if (!context) {
    throw new Error('useDashboardSettings must be used within a DashboardSettingsProvider');
  }
  return context;
}
