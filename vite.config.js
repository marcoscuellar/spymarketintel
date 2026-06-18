import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite treats .jsx via the React plugin; the prototype files use JSX in .jsx modules.
export default defineConfig({
  plugins: [react()],
});
