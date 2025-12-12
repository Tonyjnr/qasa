/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');
  const data = event.data?.json() ?? {};
  const title = data.title ?? 'QASA Alert';
  const options: NotificationOptions = {
    body: data.body,
    icon: '/qasa-icon.svg', // Ensure this path is correct
    badge: '/qasa-icon.svg', // PWA badge icon
    data: data.url ? { url: data.url } : {},
    // vibrate: [200, 100, 200], // Removed to avoid TS error
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();

  const urlToOpen = event.notification.data?.url ?? '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a client (window) open with the target URL
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, or if focus failed, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
      return null;
    })
  );
});

// Optional: basic install and activate listeners for debugging
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker ...', event);
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker ...', event);
  event.waitUntil(self.clients.claim());
});
