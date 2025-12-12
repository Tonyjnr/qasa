import { Bell, CheckCircle2, AlertTriangle } from "lucide-react";
import { useAirQuality } from "../../hooks/useAirQuality";
import { Sidebar } from "../../components/layout/Sidebar";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { apiService, type Notification } from "../../services/apiService";
import { formatDistanceToNow } from "date-fns";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { requestNotificationPermission, subscribeToPush } from "../../services/notifications";

export const NotificationsView = () => {
  const { data, isLoading, setLocation } = useAirQuality({
    enablePolling: true,
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [airQualityAlertsEnabled, setAirQualityAlertsEnabled] = useState(false);
  const [dataUpdatesEnabled, setDataUpdatesEnabled] = useState(false);
  const [userSpecificNotificationsEnabled, setUserSpecificNotificationsEnabled] = useState(false);
  const [isPushSubscribed, setIsPushSubscribed] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const result = await apiService.getNotifications();
        setNotifications(result);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load notifications");
      } finally {
        setLoadingNotifications(false);
      }
    }
    fetchNotifications();

    // Check initial push subscription status
    navigator.serviceWorker.ready.then(registration => {
      registration.pushManager.getSubscription().then(subscription => {
        setIsPushSubscribed(!!subscription);
      });
    });
  }, []);

  const handlePushSubscriptionChange = async (checked: boolean) => {
    if (checked) {
      const permission = await requestNotificationPermission();
      if (permission === "granted") {
        const subscription = await subscribeToPush();
        setIsPushSubscribed(!!subscription);
        if (subscription) {
          toast.success("Subscribed to push notifications!");
        } else {
          toast.error("Failed to subscribe to push notifications.");
        }
      } else {
        toast.error("Notification permission denied.");
        // If permission is denied, revert the switch
        setIsPushSubscribed(false);
      }
    } else {
      // Logic for unsubscribing, not implemented in notifications.ts yet, but placeholder is there
      // await unsubscribeFromPush();
      setIsPushSubscribed(false);
      toast.info("Push notifications disabled.");
    }
  };

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    setLocation(lat, lng);
    toast.success(`Location changed to ${name}`);
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <div className="h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#F8FAFC] lg:flex-row">
      <main className="flex-1 overflow-y-auto p-4 lg:p-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Notifications
        </h1>

        {/* Notification Preferences Section */}
        <section className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-slate-200 max-w-2xl">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Notification Preferences</h2>
          <p className="text-sm text-slate-600 mb-6">
            Manage your notification settings. You can choose which types of alerts you'd like to receive.
          </p>

          <div className="space-y-5">
            {/* Master Push Notification Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                <span className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Enable Push Notifications
                </span>
                <span className="text-sm text-muted-foreground">
                  Receive alerts directly to your device (requires browser permission).
                </span>
              </Label>
              <Switch
                id="push-notifications"
                checked={isPushSubscribed}
                onCheckedChange={handlePushSubscriptionChange}
              />
            </div>

            {/* Individual Notification Type Toggles (enabled only if push is subscribed) */}
            <div className={`space-y-5 ${!isPushSubscribed ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <div className="flex items-center justify-between">
                <Label htmlFor="air-quality-alerts" className="flex flex-col space-y-1">
                  <span className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Air Quality Alerts
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Get notified when air quality in your selected locations changes significantly.
                  </span>
                </Label>
                <Switch
                  id="air-quality-alerts"
                  checked={airQualityAlertsEnabled}
                  onCheckedChange={setAirQualityAlertsEnabled}
                  disabled={!isPushSubscribed}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="data-updates" className="flex flex-col space-y-1">
                  <span className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    New Data Updates
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Receive updates on new data sources or improved air quality models.
                  </span>
                </Label>
                <Switch
                  id="data-updates"
                  checked={dataUpdatesEnabled}
                  onCheckedChange={setDataUpdatesEnabled}
                  disabled={!isPushSubscribed}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="user-specific-notifications" className="flex flex-col space-y-1">
                  <span className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    User-Specific Notifications
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Personalized notifications based on your preferences and activity.
                  </span>
                </Label>
                <Switch
                  id="user-specific-notifications"
                  checked={userSpecificNotificationsEnabled}
                  onCheckedChange={setUserSpecificNotificationsEnabled}
                  disabled={!isPushSubscribed}
                />
              </div>
            </div>
          </div>
        </section>

        <h2 className="text-xl font-bold text-slate-900 mb-4 max-w-2xl">
          Recent Notifications
        </h2>

        <div className="space-y-4 max-w-2xl">
          {loadingNotifications ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 w-full rounded-xl bg-slate-200 animate-pulse"
                />
              ))}
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border ${
                  notification.isRead
                    ? "bg-white border-slate-200"
                    : "bg-blue-50 border-blue-100"
                } flex gap-4 transition-colors hover:shadow-md`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    notification.type === "alert"
                      ? "bg-red-100 text-red-500"
                      : notification.type === "success"
                      ? "bg-green-100 text-green-500"
                      : "bg-blue-100 text-blue-500"
                  }`}
                >
                  {notification.type === "alert" ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : notification.type === "success" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Bell className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900">
                      {notification.title}
                    </h3>
                    <span className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    {notification.message}
                  </p>
                </div>
              </div>
            ))
          )}
          {!loadingNotifications && notifications.length === 0 && (
            <p className="text-slate-500">No new notifications.</p>
          )}
        </div>
      </main>

      <Sidebar
        data={data}
        isLoading={isLoading}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};
