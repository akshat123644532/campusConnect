import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/events": "http://localhost:5000",
      "/login":  "http://localhost:5000",
      "/signup": "http://localhost:5000",
      "/profile":"http://localhost:5000",
    },
  },
});