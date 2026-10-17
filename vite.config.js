import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // new versions install silently; app opens instantly from cache
      workbox: { globPatterns: ["**/*.{js,css,html,png,svg}"] },
      manifest: {
        name: "Routine & Budget", short_name: "Routine", description: "Daily tasks and budget manager, works offline.",
        theme_color: "#1264d8", background_color: "#f4f8fc", display: "standalone", start_url: "/",
        icons: [{ src: "icon-192.png", sizes: "192x192", type: "image/png" }, { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }],
      },
    }),
  ],
});
