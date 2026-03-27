import { homedir } from "node:os";
import { join } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  cacheDir: join(homedir(), ".cache", "web-pos-vite"),
  plugins: [react()],
});
