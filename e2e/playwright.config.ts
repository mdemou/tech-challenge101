import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { TEST_BACKEND_PORT } from "./config";

dotenv.config({ path: path.resolve(__dirname, "../backend/.env") });

const agentMode = !!process.env.E2E_AGENT;

export default defineConfig({
  testDir: "./tests",
  globalSetup: "./global-setup",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: agentMode ? 0 : process.env.CI ? 1 : 0,
  reporter: agentMode
    ? [["./reporters/agent-summary-reporter.ts"]]
    : [
        [
          "html",
          {
            outputFolder: "playwright-report",
            open: process.env.CI ? "never" : "on-failure",
          },
        ],
        ["list"],
      ],
  use: {
    baseURL: `http://localhost:${TEST_BACKEND_PORT}`,
    trace: agentMode ? "off" : "on-first-retry",
  },
  projects: [
    {
      name: "api",
    },
  ],
  webServer: [
    {
      command: "npm run dev",
      cwd: path.resolve(__dirname, "../backend"),
      url: `http://localhost:${TEST_BACKEND_PORT}/api/__health/liveness`,
      timeout: 60_000,
      reuseExistingServer: false,
      ...(agentMode
        ? { stdout: "ignore" as const, stderr: "ignore" as const }
        : {}),
      env: {
        ...process.env,
        PORT: String(TEST_BACKEND_PORT),
        LOG_LEVEL: "warn",
        BACKEND_URL: `http://localhost:${TEST_BACKEND_PORT}`,
        E2E_TEST_HOOKS: "true",
        RATE_LIMIT_DEFAULT_MAX: "5000",
        RATE_LIMIT_DEFAULT_WINDOW_MS: "3600000",
      },
    },
  ],
});
