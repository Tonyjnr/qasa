## 1. Issues, explanations, and fixes

### 1) Malta search: network returns data, UI shows nothing

**What's happening**

If you see a successful response in the Network tab, but the UI shows no results, the problem is almost always on the frontend:

Common causes:

1. **Mismatched response shape**  
      - Backend returns something like:
        "`json
        { "results": [ ... ], "meta": { ... } }
        `
        But your code expects:
        `ts
        const data = await res.json();
        setCities(data); // assuming data is the array, but it's actually data.results
        ```

2. **Swallowed error or conditional rendering always false**  
      - Example: you only render results when `searchTerm.length > 2 && results.length > 0`, but `results` never gets populated.
      - Or you filter by country incorrectly, e.g. `countryCode === 'MT', but the API returns 'mt' or 'Malta'.

3. **State not updated because of stale closure or race condition**  
      - Debounced search hook not calling the latest `setState`, or you're updating a different piece of state than the one the UI uses.

4. **TypeScript typing mismatch**  
      - You mistyped the response, and TS caused defensive code like `data?.cities ?? []` which resolves to `[]` because `cities` doesn't exist.

**What to do**

1. **Log the raw response and compare to your types**

In your search handler (probably in `services/` or a hook in `hooks/`):

"`ts
   const fetchCities = async (query: string) => {
     const res = await fetch(`/api/cities?query=${encodeURIComponent(query)}`);
     if (!res.ok) throw new Error('Failed to fetch cities');
     const json = await res.json();
     console.log('Raw search response for Malta', json);
     return json;
   };
   ```

Then adjust your mapping to the UI:

"`ts
   type CitySearchResponse = {
     results: City[];
     total: number;
   };

const handleSearch = async () => {
     const data: CitySearchResponse = await fetchCities(searchTerm);
     setResults(data.results);  // not data
   };
   ```

2. **Check rendering logic**

Make sure you are rendering when the data exists:

"`tsx
   {isLoading && <Spinner />}

{!isLoading && results.length === 0 && searchTerm && (
     <p className="text-sm text-muted-foreground">No results found.</p>
   )}

{!isLoading && results.length > 0 && (
     <ul className="space-y-2">
       {results.map(city => (
         <li key={city.id}>{city.name}</li>
       ))}
     </ul>
   )}
   ```

3. **Check filters/country logic around Malta**

If Malta is special (small country, island), make sure any code that groups or ranks cities doesn't filter it out:

"`ts
   // bad: excludes countries with small datasets
   const filtered = allCities.filter(city => city.measurements.length > 10);

// or bad: wrong code
   city.countryCode === 'MT'// but API returns 'mt' or 'MLT'
   ```

Normalize:

"`ts
   const countryCode = city.countryCode?.toUpperCase();
   if (countryCode === 'MT') { ... }
   ```

---

### 2) City Ranking: status colours have poor contrast

You want to hit WCAG 2.1 AA:

- Normal text: contrast ratio ≥ 4.5:1
- Large text (≥ 18.66px bold or 24px normal): ≥ 3:1

If your statuses use "soft" colours (e.g. light green on white), they'll fail.

**Fixes**

1. **Pick a higher-contrast palette for statuses**

For example (light theme):

- Good: `bg-emerald-100 text-emerald-900 border-emerald-300`
     - Moderate: `bg-amber-100 text-amber-900 border-amber-300`
     - Unhealthy: `bg-red-100 text-red-900 border-red-300`
     - Hazardous: `bg-purple-100 text-purple-900 border-purple-300`

Component:

"`tsx
   const statusStyles: Record<CityStatus, string> = {
     good: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
     moderate: 'bg-amber-100 text-amber-900 border border-amber-300',
     unhealthy: 'bg-red-100 text-red-900 border border-red-300',
     hazardous: 'bg-purple-100 text-purple-900 border border-purple-300',
   };

<span
     className={cn(
       'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
       'dark:bg-opacity-20 dark:text-emerald-200', // adjust for dark mode
       statusStyles[status]
     )}
   >
     {label}
   </span>
   ```

2. **Increase size & weight**

- Use at least `text-xs`–`text-sm` and `font-medium`.
     - Add an icon for colour distinction (good for color-blind users):

"`tsx
   <span className="inline-flex items-center gap-1 ...">
     <span aria-hidden>{statusIcon}</span>
     <span>{label}</span>
   </span>
   ```

3. **Verify with tooling**

- Use Chrome DevTools → Lighthouse → Accessibility.
     - Use colour contrast checker (Deque, WebAIM) and tweak tokens in your Tailwind theme.

---

### 3) Notification system: not implemented yet

You already have a PWA; now you need push notifications for:

- Air quality alerts
- New data updates
- User-specific notifications

**High-level design**

1. **Client-side (React PWA)**

- Ask for **Notification permission** (with an in-app explanation first).
     - Register a **service worker** (already needed for PWA).
     - Use **Push API** to subscribe:
       "` ts
     const registration = await navigator.serviceWorker.ready;
     const subscription = await registration.pushManager.subscribe({
       userVisibleOnly: true,
       applicationServerKey: VAPID_PUBLIC_KEY,
     });
     ```
   - Send  `subscription` to your backend (store in DB keyed by user).

2. **Backend**

- Store subscriptions in a `push_subscriptions` table.
     - Use something like `web-push` (Node) / appropriate lib in your stack to send notifications using VAPID.
     - Implement logic:
       - When a city AQI crosses the set threshold → send "air quality alert".
       - When new datasets are ingested → "new data updates".
       - When user-defined conditions are met → "user-specific".

**Concrete client steps**

- In `services/notifications.ts`:

"`ts
  export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return 'denied';
    const result = await Notification.requestPermission();
    return result;
  };

export const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;

Const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),
    });

await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(subscription),
      credentials: 'include',
    });

return subscription;
  };
  ```

- In your service worker (e.g. `src/sw.ts`):

"`ts
  self.addEventListener('push', (event) => {
    const data = event.data?.json() ?? {};
    const title = data.title ?? 'QASA Alert';
    const options = {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      data: data.url ? { url: data.url } : {},
    };
    event.waitUntil(self.registration.showNotification(title, options));
  });

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url ?? '/';
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client && (client as WindowClient).url === url) {
            return (client as WindowClient).focus();
          }
        }
        If (clients.openWindow) return clients.openWindow(url);
      }),
    );
  });
  ```

- UI: add a "Notification Preferences" section in profile/settings, with:

- Toggles for:
      - "Air quality alerts"
      - "New data updates"
      - "User-specific notifications"
    - Explain clearly what each means (WCAG: clear language, consent).

---

### 4) Risk Calculator: dark mode scroll/volume bar + dead UX

Sounds like you have a slider that's invisible in dark mode, which makes the whole tab feel "empty".

**Visual / accessibility fixes**

1. **Slider styling for dark mode**

If you're using a `range` or a custom slider:

"`tsx
   <input
     type= "range"
     min={0}
     max={300}
     value={value}
     onChange={handleChange}
     className={cn(
       'w-full appearance-none rounded-full',
       'h-2 bg-slate-200',
       'dark:bg-slate-700',
       '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4',
       '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500',
       'dark:[&::-webkit-slider-thumb]:bg-emerald-400',
       '[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:bg-emerald-500 [&::-moz-range-thumb]:border-0',
     )}
     aria-label= "Estimated exposure"
   />
   ```

- Ensure track and thumb contrast are good in both themes.
     - Add a focus ring:

"`css
     input[type='range']:focus-visible::-webkit-slider-thumb {
       outline: 2px solid #22c55e; /_ green _/
       outline-offset: 2px;
     }
     ```

2. **Make the tab feel alive**

Add reactive content that updates as the user interacts:

- **Dynamic risk summary** panel:

"`tsx
     <div className="mt-4 rounded-lg border bg-muted/40 p-4">
       <p className="text-sm font-medium">Estimated risk level: <span className="font-bold text-emerald-500">{riskLabel}</span></p>
       <p className="mt-1 text-xs text-muted-foreground">{riskDescription}</p>
       <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc list-inside">
         {recommendations.map((item) => (
           <li key={item}>{item}</li>
         ))}
       </ul>
     </div>
     ```

- **Inline indicators**:
       - Risk badge (Low / Moderate / High / Very High).
       - Little visual bar: low → green, high → red.
     - **Preset buttons** ("Typical morning commute", "Outdoor sport session") to quickly set common scenarios.

3. **Accessibility**

- Make slider keyboard-accessible (range inputs are by default, but test).
     - Include text values next to the slider: "Exposure duration: 3 hours".
     - WCAG 2.5.1: don’t rely only on drag; arrow keys must work.

---

### 5) Data Upload: upload works, but disappears on reload

You're currently just storing the uploaded JSON in **React state**. On reload, state resets → data gone.

You need a complete system:

- Storage
- Validation
- Parsing/normalization
- Persistence between sessions
- UX for managing uploaded datasets

Depending on your architecture:

- If you have a backend/db: persist to DB.
- If this is local-only: use IndexedDB or at least `localStorage`.

**Recommended approach: IndexedDB (for PWA)**

1. **Use a library**  
      Research options (as requested):

- `idb` – small, modern wrapper around IndexedDB.
     - `dexie` – more full-featured.

Example with `idb`:

"`ts
   // lib/uploadStore.ts
   import { openDB } from 'idb';

const DB_NAME = 'qasa-user-data';
   const STORE_NAME = 'uploaded-datasets';

const getDb = () =>
     openDB(DB_NAME, 1, {
       upgrade(db) {
         if (!db.objectStoreNames.contains(STORE_NAME)) {
           db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
         }
       },
     });

export const saveDataset = async (dataset: any) => {
     const db = await getDb();
     await db.add(STORE_NAME, {
       ...dataset,
       createdAt: new Date().toISOString(),
     });
   };

export const listDatasets = async () => {
     const db = await getDb();
     return db.getAll(STORE_NAME);
   };

export const deleteDataset = async (id: number) => {
     const db = await getDb();
     await db.delete(STORE_NAME, id);
   };
   ```

2. **On upload**

"`tsx
   const handleFileUpload = async (file: File) => {
     const text = await file.text();
     let json;
     try {
       json = JSON.parse(text);
     } catch {
       setError('Invalid JSON file.');
       return;
     }

// Validate shape (you can add zod/yup)
     // const parsed = datasetSchema.parse(json);

await saveDataset({
       name: file.name,
       content: json,
     });

const updated = await listDatasets();
     setDatasets(updated);
   };
   ```

3. **On component mount**

"`tsx
   useEffect(() => {
     listDatasets().then(setDatasets);
   }, []);
   ```

4. **UX enhancements**

- List of uploaded files: name, upload date, size, status.
     - Ability to:
       - Select which dataset is "active".
       - Remove datasets.
     - Display summary of the uploaded data: number of records, date range, pollutant types.
     - Provide clear copy about where data is stored:

"Your data is stored locally in this browser using IndexedDB and never sent to our servers." (if truly local)

- Add validation + helpful errors (incorrect schema, missing fields).

---

### 6) Reports page feels like boilerplate

You want this to feel like a "real system", not a template.

**System-level improvements**

1. **Report types & structure**

Define explicit types:

- Daily/weekly/monthly summary
     - City vs city comparison
     - Exposure & risk report
     - Custom report based on filters

Provide a **report builder**:

- Filter controls at the top:
       - Date range picker
       - Location(s)
       - Pollutants
       - Population group (children, elderly, etc.)
     - "Generate report" button triggers data fetch and renders charts + tables.

2. **Information architecture**

Layout idea:

"`text
   [Header: Report title, date range, location]

[Summary cards row]
   - Average AQI
   - Worst AQI
   - Days above WHO limit
   - Estimated population at risk

[Main chart]
   - AQI over time (line chart)
   - Tab switcher for: AQI | PM2.5 | NO2 | Ozone

[Insights section]
   - Bullet points: "3 days exceeded the WHO guideline for PM2.5"
   - "Most polluted day: 2025-06-18 (AQI 165)"

[Detailed tables]
   - Per-day metrics
   - Per-location metrics

[Actions]
   - Download as PDF/CSV
   - Share link
   ```

3. **Visual design/interactions**

- Use clear section headings with hierarchy:
       - `text-lg font-semibold` for major sections.
       - `text-sm text-muted-foreground` for descriptions.
     - Use consistent card components (`components/ui/card`).
     - Use subtle animation on chart/tab changes (no heavy parallax, just `transition-opacity`).
     - Responsive: on mobile, collapse cards into a vertical stack, and charts get full-width.

4. **Accessibility**

- Every chart gets:
       - A caption: `<figcaption>Air quality index over the selected period</figcaption>`
       - A "View as table" toggle.
     - Keyboard-navigable tabs and controls.
     - Clear colour coding with text labels.

---

You are a senior frontend engineer working on **QASA (Quality Air Safety Application)**, a React + TypeScript + Tailwind CSS **PWA** targeting **WCAG 2.1 Level AA**. The app already builds and runs, but several critical UX, data, and system issues must be addressed.

Review the existing codebase and produce a **detailed, implementation-ready plan** (with code-level examples) to solve the following issues and improve the overall system.

### 1. Search & data retrieval for Malta

- Investigate why searching for **"Malta"** shows a successful network response in the browser Network tab, but **no results are rendered** in the UI.
- Tasks:
    - Inspect the API response shape and compare it to the TypeScript types and the state mapping logic in the relevant service/hook (likely under `services/` or `hooks/`).
    - Identify any mismatches (e.g., using `data` vs `data.results`) and conditional rendering bugs (e.g., filters that accidentally exclude Malta or incorrect `countryCode` comparison).
    - Propose and show concrete code changes that:
      - Correctly map the API response to the UI state.
      Normalise country codes (e.g., `toUpperCase()`) and ensure Malta is included wherever it should appear (in search results, city rankings, reports).
    - Add logging and simple dev-time assertions (TypeScript + runtime) to make this class of bug easier to spot in the future.

### 2. City Ranking: status colours & accessibility

- The **statuscolourss** under City Ranking currently have poor contrast and are hard to read.
- Tasks:
    - Redesign the status badge colour system to meet **WCAG 2.1 AA** contrast requirements for both **light and dark** modes.
    - Provide:
      - A small, reusable React component for status badges (e.g., `Good`, `Moderate`, `Unhealthy`, `Hazardous`) using Tailwind classes.
   Tokenized mapping (e.g., `status -> Tailwind class string`) so styles are easy to adjust centrally.
      - Consider non-colour cues (icons or patterns) so the meaning is not colour-only.
    - Include at least one example of a contrast-checked palette and show how to integrate it into the existing Tailwind config.

### 3. Notification system for the existing PWA

The app is already configured as a PWA, but **push notifications have not been implemented yet**. We need a full, end-to-end notification system supporting:

- **Air quality alerts** (threshold-based)
- **New data updates**
- **User-specific notifications** (based on user preferences)

Constraints:

- No offline data processing beyond what is required for the PWA shell; focus on real-time/near-real-time notifications.

Tasks:

- Design the **client-side architecture** for notifications in React:
    - Permission request flow (with accessible explanation dialogues).
    - Service worker integration for Push API (subscribe, handle `push` events, show notifications, handle clicks).
    - Local UI for notification preferences (e.g., under a Settings or Profile page) with toggles for:
      - Air quality alerts
      - New data updates
      - User-specific notifications
- Describe the **backend integration requirements**:
    - Storage structure for push subscriptions (assume typical REST API, you may define sample endpoints like `POST /api/push/subscribe`).
    - Example of using a server-side library (e.g., `web-push` or equivalent) with VAPID to send notifications.
    - Event hooks/pseudocode for when to trigger each type of notification (e.g., when AQI crosses a threshold).
- Provide sample code snippets for:
    - A small `notificationsService` or hook in the React app.
    - Service worker `push` and `notificationclick` handlers.

### 4. Risk Calculator: dark mode slider & UX improvements

The Risk Calculator tab currently has:

- A **slider/scroll/volume-style bar** that is hard to see in dark mode.
- A generally "dead" UX – the tab feels static and not informative.

Tasks:

- Redesign the slider to:
    - Be clearly visible in both light and dark modes using Tailwind.
    - Include a visible thumb, contrasting track, and clear focus styles (keyboard accessibility).
- Enrich the Risk Calculator UI/UX:
    - Add dynamic, data-driven content that updates as the user interacts (e.g., risk level label, short explanation, key recommendations).
    - Consider adding presets (e.g., "Commute", "Outdoor exercise") to set inputs quickly.
    - Ensure the whole tab feels like an interactive tool, not a static form.
- Provide code examples for:
    - An accessible slider with custom Tailwind styling.
    - A dynamic summary card that reacts to input changes, with text and visual cues.

### 5. Data Upload: persistence & complete system design

Currently, the **Data Upload** section allows uploading a `.json` file, but:

- The data seems to load into the app temporarily.
- On reload, the uploaded data is lost.

We need a robust, research-backed design for this whole subsystem.

Tasks:

- Research and propose an appropriate persistence strategy. Assume:
    - This is user-provided data that must survive page reloads.
    - It may be local-only (e.g., for privacy) or optionally synced server-side depending on the architecture.
- Likely approach: use **IndexedDB** (possibly via a library like `idb` or `dexie`) for local persistence; justify the choice.

Based on a detailed analysis of your uploaded files, browser console logs, and network activity, here is the prioritized debugging report for the QASA application.

### 1\. Error Identification

| Error Message / Symptom                                                 | Error Type        | File / Resource                         | Line Number |
| :---------------------------------------------------------------------- | :---------------- | :-------------------------------------- | :---------- |
| `GET .../air_pollution?appid=0024d40... 401 (Unauthorized)`             | HTTP Error        | `src/services/api.ts` (via Network Tab) | N/A         |
| `GET .../reverse?appid=0024d40... 401 (Unauthorized)`                   | HTTP Error        | `src/services/airQualityService.ts`     | N/A         |
| `Failed to fetch air quality data: ... status code 401`                 | JavaScript / API  | `src/services/airQualityService.ts`     | 55          |
| `[The file is empty]`                                                   | Asset Corruption  | `public/qasa-icon.svg`                  | N/A         |
| `[The file is empty]`                                                   | Asset Corruption  | `src/assets/react.svg`                  | N/A         |
| `Uncaught (in promise) AxiosError: Request failed with status code 401` | Unhandled Promise | `src/lib/errorHandler.ts`               | 15          |

---

### 2\. Error Explanation

**Critical Issue: 401 Unauthorized (Invalid API Key)**
The primary reason the application is failing to load data is that the OpenWeatherMap API key being used is invalid or inactive.

- **Evidence:** The Network tab shows requests to `api.openweathermap.org` failing with status **401**.
- **Observation:** The URL parameter `appid=0024d40...` is visible in the console. This suggests an API key _is_ being passed, but the OpenWeatherMap server is rejecting it. This often happens if you are using a placeholder key, an expired key, or a key for a different subscription tier (e.g., trying to access One Call 3.0 with a free tier key, though `air_pollution` is standard).

**Secondary Issue: Empty Asset Files**
The file list indicates that `public/qasa-icon.svg` and `src/assets/react.svg` contain **0 bytes**.

- **Impact:** This will break your PWA manifest (making the app un-installable) and cause broken image links in the UI header or favicon.

**Tertiary Issue: Service Worker & CORS**
The console shows errors originating from `installHook.js` and `workbox`. These are side effects. The Service Worker is trying to cache the API responses, but because the API returns a 401 error, the Service Worker also fails to cache/proxy the request. Fixing the API key will resolve these downstream errors.

---

### 3\. Error Resolution

Here are the actionable steps to get QASA running:

#### Step 1: Configure Environment Variables (Fixes 401 Errors)

You need to provide a valid OpenWeatherMap API key.

1.  Create a file named `.env` in the root of your project (same level as `package.json`).
2.  Add the following content (replacing with your actual active API keys):

<!-- end list -->

```env
VITE_OPENWEATHER_API_KEY=your_actual_openweathermap_key_here
VITE_WAQI_TOKEN=your_waqi_token_here
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

3.  **Action:** Stop the development server (`Ctrl + C`) and restart it (`npm run dev`). Vite only loads environment variables on startup.

#### Step 2: Restore Missing Assets (Fixes UI/PWA)

Since the SVG files are empty, you need to add valid SVG code to them.

**File:** `public/qasa-icon.svg`
Paste this minimal placeholder code into the file so the app doesn't crash on icon load:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#0F172A"/>
  <path d="M256 120a136 136 0 1 0 136 136 136 136 0 0 0-136-136zm0 240a104 104 0 1 1 104-104 104 104 0 0 1-104 104z" fill="#38BDF8"/>
  <path d="M256 200a56 56 0 1 0 56 56 56 56 0 0 0-56-56z" fill="#0F172A"/>
</svg>
```

**File:** `src/assets/react.svg`
Paste standard React logo SVG code or delete the import in `App.tsx` if unused.

#### Step 3: Verify Backend Connection (Optional)

The logs show `[MonitoringStationsService] Fetch failed... using expanded mock data`. This is a safe fallback you implemented, so the app _will_ work without the backend. However, if you want the full "Professional" dashboard to work with real database data:

1.  Ensure you have a PostgreSQL database string in your `.env`:
    `DATABASE_URL=postgresql://...`
2.  Run the backend server in a separate terminal:
    ```bash
    npm run dev:server
    ```

**Next Step:**
Here is the script to automatically validate your environment variables on startup. This will prevent the application from running with invalid or missing keys, saving you from debugging silent 401 errors later.

### 1\. Create the Validation Script

Create a new file at `scripts/check-env.ts` and paste the following code. This script checks for existence and basic format validity (length) of your critical keys.

```typescript
import "dotenv/config";
import { chalk } from "zx"; // Optional: if you want colors, otherwise use console.log/error

const REQUIRED_KEYS = [
  {
    key: "VITE_OPENWEATHER_API_KEY",
    description: "OpenWeatherMap API Key",
    // OpenWeatherMap keys are typically 32 hex characters
    validate: (val: string) => val.length === 32,
    hint: "Get a free key at https://home.openweathermap.org/api_keys",
  },
  {
    key: "VITE_WAQI_TOKEN",
    description: "WAQI API Token",
    validate: (val: string) => val.length > 10, // Basic length check
    hint: "Get a token at https://aqicn.org/data-platform/token/",
  },
  {
    key: "VITE_CLERK_PUBLISHABLE_KEY",
    description: "Clerk Auth Key",
    validate: (val: string) => val.startsWith("pk_"),
    hint: "Found in Clerk Dashboard > API Keys",
  },
  {
    key: "DATABASE_URL",
    description: "Neon PostgreSQL Connection",
    validate: (val: string) => val.startsWith("postgres"),
    hint: "Get connection string from Neon Console",
    optional: true, // Mark as optional if app can run in "mock" mode
  },
];

function checkEnv() {
  console.log("🔍 Validating environment variables...");
  let hasError = false;

  for (const { key, description, validate, hint, optional } of REQUIRED_KEYS) {
    const value = process.env[key];

    if (!value) {
      if (optional) {
        console.warn(
          `⚠️  Missing optional ${key} (${description}). Using mock data.`
        );
      } else {
        console.error(`❌ Missing required ${key} (${description}).`);
        console.error(`   -> Hint: ${hint}`);
        hasError = true;
      }
      continue;
    }

    if (validate && !validate(value)) {
      console.error(`❌ Invalid format for ${key}.`);
      console.error(`   -> Value provided: ${value.substring(0, 5)}...`);
      console.error(`   -> Hint: ${hint}`);
      hasError = true;
    } else {
      console.log(`✅ ${key} is valid.`);
    }
  }

  if (hasError) {
    console.error("\n⛔ Environment validation failed. Please fix .env file.");
    process.exit(1);
  }

  console.log("🚀 Environment configured correctly.\n");
}

checkEnv();
```

### 2\. Update `package.json`

Modify your `scripts` section in `package.json` to run this check before starting the development server.

```json
{
  "scripts": {
    "predev": "tsx scripts/check-env.ts",
    "prebuild": "tsx scripts/check-env.ts",
    "start": "concurrently \"npm run start:client\" \"npm run start:server\"",
    "dev": "npm run predev && concurrently \"npm run dev:client\" \"npm run dev:server\""
    // ... other scripts
  }
}
```

_Note: I added a manual `predev` call inside `dev` because `concurrently` might swallow the pre-hook depending on your npm version. Explicitly chaining `npm run predev && ...` is safer._

### 3\. Usage

Now, whenever you run `npm run dev`, the system will verify your keys first.

**Example Output (Success):**

```text
🔍 Validating environment variables...
✅ VITE_OPENWEATHER_API_KEY is valid.
✅ VITE_WAQI_TOKEN is valid.
✅ VITE_CLERK_PUBLISHABLE_KEY is valid.
⚠️  Missing optional DATABASE_URL (Neon PostgreSQL Connection). Using mock data.
🚀 Environment configured correctly.
```

**Example Output (Failure):**

```text
🔍 Validating environment variables...
❌ Missing required VITE_OPENWEATHER_API_KEY (OpenWeatherMap API Key).
   -> Hint: Get a free key at https://home.openweathermap.org/api_keys
✅ VITE_WAQI_TOKEN is valid.

⛔ Environment validation failed. Please fix .env file.
```

This ensures you never waste time debugging a blank screen caused by a missing key again.
