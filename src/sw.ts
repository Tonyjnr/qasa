/** biome-ignore-all assist/source/organizeImports: <explanation> */
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

declare const self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();
clientsClaim();

self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push Received.");
  const data = event.data?.json() ?? {};
  const title = data.title ?? "QASA Alert";
  const options: NotificationOptions = {
    body: data.body,
    icon: "/qasa-icon.svg",
    badge: "/qasa-icon.svg",
    data: data.url ? { url: data.url } : {},
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Notification click Received.");
  event.notification.close();
  const urlToOpen = event.notification.data?.url ?? "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
        return null;
      })
  );
});

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing Service Worker ...", event);
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating Service Worker ...", event);
});
