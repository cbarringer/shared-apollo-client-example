import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "index.mjs"),
      name: "SharedClient",
      // the proper extensions will be added
      fileName: "shared-client",
      formats: ["es"],
    },
    outDir: resolve(__dirname, "../../static/build/shared-client"),
    emptyOutDir: true,
  },
});
