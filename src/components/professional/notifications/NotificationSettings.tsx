import { useState, useEffect } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { Switch } from "../../ui/switch";
import { Label } from "../../../components/ui/label"; // Fixed path
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { toast } from "sonner";
import { requestNotificationPermission, subscribeToPush, unsubscribeFromPush } from "../../../services/notifications";

export const NotificationSettings = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    airQualityAlerts: true,
    dailyDigest: false,
    newDatasets: true,
  });

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
    
    // Check if already subscribed
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then(async (registration) => {
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      });
    }
  }, []);

  const handleEnable = async () => {
    setIsLoading(true);
    try {
      const perm = await requestNotificationPermission();
      setPermission(perm);

      if (perm === "granted") {
        const sub = await subscribeToPush();
        if (sub) {
          setIsSubscribed(true);
          toast.success("Notifications enabled!");
        } else {
          toast.error("Failed to subscribe to push service.");
        }
      } else {
        toast.error("Notification permission denied.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    setIsLoading(true);
    try {
      await unsubscribeFromPush();
      setIsSubscribed(false);
      toast.info("Notifications disabled.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to disable notifications.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Manage how you receive alerts and updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-1">
            <Label htmlFor="push-notifications" className="font-medium">
              Push Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive alerts directly to your device.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {isSubscribed ? (
              <Button variant="outline" size="sm" onClick={handleDisable} disabled={isLoading}>
                <BellOff className="mr-2 h-4 w-4" />
                Disable
              </Button>
            ) : (
              <Button size="sm" onClick={handleEnable} disabled={isLoading}>
                <Bell className="mr-2 h-4 w-4" />
                Enable
              </Button>
            )}
          </div>
        </div>

        {isSubscribed && (
          <div className="space-y-4 border-t pt-4 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="aq-alerts">Air Quality Alerts</Label>
              <Switch
                id="aq-alerts"
                checked={preferences.airQualityAlerts}
                onCheckedChange={(c: boolean) => setPreferences((p) => ({ ...p, airQualityAlerts: c }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="new-datasets">New Data Updates</Label>
              <Switch
                id="new-datasets"
                checked={preferences.newDatasets}
                onCheckedChange={(c: boolean) => setPreferences((p) => ({ ...p, newDatasets: c }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-digest">Daily Digest</Label>
              <Switch
                id="daily-digest"
                checked={preferences.dailyDigest}
                onCheckedChange={(c: boolean) => setPreferences((p) => ({ ...p, dailyDigest: c }))}
              />
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              * Preferences are saved locally for this demo.
            </p>
          </div>
        )}
        
        {permission === 'denied' && (
           <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
             Notifications are blocked by your browser. Please reset permissions in your browser settings to enable them.
           </div>
        )}
      </CardContent>
    </Card>
  );
};
