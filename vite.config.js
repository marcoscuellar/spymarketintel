import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// Vite treats .jsx via the React plugin; the prototype files use JSX in .jsx modules.
// SINGLEFILE=1 inlines everything into one openable index.html (for sharing a preview).
const singlefile = process.env.SINGLEFILE === "1";

export default defineConfig({
  plugins: [react(), ...(singlefile ? [viteSingleFile()] : [])],
});
