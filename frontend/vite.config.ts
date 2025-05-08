import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ["pglite-"].includes(tag),
        },
      },
    }),
    tailwindcss(),
  ],
  optimizeDeps: {
    exclude: ["@electric-sql/pglite"],
  },
  server: {
    host: true,
  },
});
