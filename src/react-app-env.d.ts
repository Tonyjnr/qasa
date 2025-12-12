/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly VITE_OPENWEATHER_API_KEY: string;
    readonly VITE_WAQI_TOKEN: string;
    readonly VITE_CLERK_PUBLISHABLE_KEY: string;
    readonly VITE_DATABASE_URL: string;
    readonly VITE_API_BASE_URL: string;
    readonly VITE_VAPID_PUBLIC_KEY: string;
    readonly VITE_OPENWEATHER_MAP_LAYERS_API_KEY: string;
  }
}

declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.jpg';
