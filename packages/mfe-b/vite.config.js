import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "bundle.jsx"),
      name: "MFE-A",
      // the proper extensions will be added
      fileName: "bundle",
      formats: ["es"],
    },
    outDir: resolve(__dirname, "../../static/build/mfe-b"),
    emptyOutDir: true,
    rollupOptions: {
      external: ["shared-client"],
    },
    sourcemap: true,
  },
  define: {
    "process.env.NODE_ENV": '"development"',
  },
});
