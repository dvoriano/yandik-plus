import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.mjs",
  use: { headless: true, browserName: "chromium", trace: "on-first-retry" },
  workers: 1,
  retries: 0,
  reporter: "list"
});
