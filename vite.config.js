import { defineConfig } from "vite";
import { resolve } from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  root: "src",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/game/index.html"),
      },
    },
  },
  server: {
    open: "/game/",
    port: 3000,
  },
  resolve: {
    alias: {
      "@e": resolve(__dirname, "./src/engine"),
      "@g": resolve(__dirname, "./src/game"),
    },
  },
  plugins: [
    nodePolyfills({
      include: ["events"],
    }),
  ],
});
