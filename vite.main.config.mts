import { resolvePath } from "./common";
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      "@main": resolvePath("./main", import.meta.url),
    },
  },
});
