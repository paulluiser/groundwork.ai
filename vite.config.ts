import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Relative base so the built files work from any path; one bundle so the service worker can precache it.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: { outDir: "dist", assetsDir: "assets", chunkSizeWarningLimit: 4000, rollupOptions: { output: { inlineDynamicImports: true } } }
});
