import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

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
      input: process.env.VERCEL
        ? { main: resolve("index.html") }
        : {
            main: resolve("index.html"),
            atlas: resolve("atlas/index.html"),
          },
    },
  },
});
