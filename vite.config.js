import { existsSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
  server: {
    watch: {
      ignored: ["**/button/**", "**/graphify-out/**"],
    },
  },
  build: {
    rollupOptions: {
      // Production ships the gallery only. Atlas screenshots stay local.
      input:
        !process.env.VERCEL && existsSync(resolve("atlas/index.html"))
          ? {
              main: resolve("index.html"),
              atlas: resolve("atlas/index.html"),
            }
          : { main: resolve("index.html") },
    },
  },
});
