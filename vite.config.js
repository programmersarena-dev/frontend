import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ckeditor5 from "@ckeditor/vite-plugin-ckeditor5";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 👇 recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    ckeditor5({
      theme: path.join(
        __dirname,
        "node_modules",
        "@ckeditor",
        "ckeditor5-theme-lark"
      ),
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
