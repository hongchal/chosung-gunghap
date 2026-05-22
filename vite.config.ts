import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import aitDevtools from "@ait-co/devtools/unplugin";

export default defineConfig({
  plugins: [react(), aitDevtools.vite()],
});
