import { useState } from 'react';
import { useAlerts } from '../../../hooks/useAlerts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Trash2, BellRing, Plus } from 'lucide-react';
import { Skeleton } from '../../ui/skeleton';

// Temporary simple input if UI component missing
const SimpleInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...props} />
);

export const AlertSettings = () => {
  const { alerts, isLoading, createAlert, deleteAlert } = useAlerts();
  const [newThreshold, setNewThreshold] = useState('150');

  const handleAdd = async () => {
    // Hardcoded example for demo
    await createAlert({
      userId: 'current-user', // In real app, get from auth context
      type: 'aqi',
      threshold: parseInt(newThreshold),
      operator: 'gt',
      isActive: true,
      notificationMethod: 'in_app'
    });
  };

  if (isLoading) return <Skeleton className="h-[200px] w-full" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-5 w-5" /> Alert Settings
        </CardTitle>
        <CardDescription>
          Get notified when air quality exceeds safe limits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="grid gap-2 flex-1">
              <label className="text-sm font-medium">AQI Threshold</label>
              <SimpleInput 
                type="number" 
                value={newThreshold}
                onChange={(e) => setNewThreshold(e.target.value)}
              />
            </div>
            <Button onClick={handleAdd}><Plus className="h-4 w-4 mr-2" /> Add Alert</Button>
          </div>

          <div className="space-y-2 mt-6">
            {alerts.length === 0 && <p className="text-sm text-muted-foreground">No alerts configured.</p>}
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg bg-accent/20">
                <div className="text-sm">
                  Notify when <span className="font-bold uppercase">{alert.type}</span> is {alert.operator === 'gt' ? 'above' : 'below'} <span className="font-bold">{alert.threshold}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteAlert(alert.id)} className="text-destructive hover:text-destructive/90">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
