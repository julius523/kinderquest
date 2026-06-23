import { defineConfig, devices } from "@playwright/test";

// Service worker / offline behavior only applies to the production build,
// not the dev server, so this runs against `vite preview` instead of
// `vite dev`. Run with: npm run test:e2e:offline
export default defineConfig({
  testDir: "./e2e-offline",
  fullyParallel: false,
  webServer: {
    command: "npm run build && npm run preview -- --port 4322",
    url: "http://localhost:4322",
    reuseExistingServer: true,
    timeout: 60_000,
  },
  use: {
    baseURL: "http://localhost:4322",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
