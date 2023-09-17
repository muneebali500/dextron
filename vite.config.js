import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": "/src/components",
      "@api": "/src/api",
      "@assets": "/src/assets",
      "@utils": "/src/utils",
      "@context": "/src/context",
      "@store": "/src/store",
      "@helpers": "/src/helpers",
    },
  },
});
