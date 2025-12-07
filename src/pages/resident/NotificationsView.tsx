import { Bell, CheckCircle2, AlertTriangle } from "lucide-react";
import { useAirQuality } from "../../hooks/useAirQuality";
import { Sidebar } from "../../components/layout/Sidebar";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { apiService, type Notification } from "../../services/apiService";
import { formatDistanceToNow } from "date-fns";

export const NotificationsView = () => {
  const { data, isLoading, setLocation } = useAirQuality({
    enablePolling: true,
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

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
  }, []);

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
