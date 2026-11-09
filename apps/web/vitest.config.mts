import { coverageConfigDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
    coverage: {
      exclude: [
        "**/components/**",
        "**/containers/**",
        "src/app/**",
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
});
