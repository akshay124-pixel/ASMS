import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/auth": {
        target: "https://asmserver.onrender.com",
        changeOrigin: true,
      },
      "/user": {
        target: "https://asmserver.onrender.com",
        changeOrigin: true,
      },
      "/api": {
        target: "https://asmserver.onrender.com",
        changeOrigin: true,
      },
      "/salary_slips": {
        target: "https://asmserver.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
