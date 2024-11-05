import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_CONFIG_BASE ?? "/",
  plugins: [react()],
  build: {
    outDir: process.env.VITE_CONFIG_DIST ?? "dist",
  },
});
