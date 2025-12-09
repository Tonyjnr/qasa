import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { server } from './mocks/server';

afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.VITE_OPENWEATHER_API_KEY = 'test-owm-api-key';
process.env.VITE_WAQI_TOKEN = 'test-waqi-token';
process.env.VITE_CLERK_PUBLISHABLE_KEY = 'test-clerk-publishable-key';

// MSW Setup
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock crypto.randomUUID
global.crypto = {
  ...global.crypto,
  randomUUID: vi.fn(() => 'test-uuid'),
};
