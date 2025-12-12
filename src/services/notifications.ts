import { urlBase64ToUint8Array } from "../lib/urlBase64ToUint8Array";

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!("Notification" in window)) {
    console.warn("Notifications not supported in this browser.");
    return "denied";
  }
  const result = await Notification.requestPermission();
  return result;
};

export const subscribeToPush = async (): Promise<PushSubscription | null> => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push notifications not supported.");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const existingSubscription = await registration.pushManager.getSubscription();

    if (existingSubscription) {
      console.log("Existing push subscription found:", existingSubscription);
      // Optionally, send the existing subscription to your backend again
      // await sendSubscriptionToServer(existingSubscription);
      return existingSubscription;
    }

    // Ensure VITE_VAPID_PUBLIC_KEY is defined in your .env
    const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!VAPID_PUBLIC_KEY) {
      console.error("VITE_VAPID_PUBLIC_KEY is not defined. Push notifications cannot be subscribed.");
      return null;
    }

    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    });

    console.log("New push subscription created:", subscription);

    // Send subscription to your backend
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
      credentials: 'include',
    });

    return subscription;
  } catch (error) {
    console.error("Failed to subscribe to push notifications:", error);
    return null;
  }
};

// You might want a function to unsubscribe as well
export const unsubscribeFromPush = async () => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return;
  }
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    await subscription.unsubscribe();
    // Optionally, inform your backend to remove this subscription
    await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
      credentials: 'include',
    });
    console.log("Successfully unsubscribed from push notifications.");
  }
};
