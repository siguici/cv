import { defineConfig } from "vite-plus";
import v, { refreshPaths } from "v-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    v({
      input: ["assets/global.css", "assets/main.ts"],
      refresh: [...refreshPaths, "**/*.{v,ts}"],
    }),
    tailwindcss(),
  ],
  preview: {
    headers: {
      "Cache-Control": "public, max-age=600",
    },
  },
  resolve: {
    alias: {
      "@/": "/src/",
    },
  },
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
