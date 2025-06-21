

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import rollupNodePolyFill from "rollup-plugin-node-polyfills";
// import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       // Polyfill Node.js modules
//       buffer: "buffer",
//       stream: "stream-browserify",
//       util: "util",
//     },
//   },
//   optimizeDeps: {
//     include: ["buffer", "stream", "util"],
//     exclude: ["lucide-react", "@xmtp/user-preferences-bindings-wasm"],
//     esbuildOptions: {
//       define: {
//         global: "globalThis", // Required for XMTP and some polyfills
//       },
//       plugins: [
//         NodeGlobalsPolyfillPlugin({
//           buffer: true,
//           process: true,
//         }),
//       ],
//     },
//   },
//   build: {
//     rollupOptions: {
//       plugins: [rollupNodePolyFill()],
//     },
//     commonjsOptions: {
//       transformMixedEsModules: true,
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'stream', 'util', 'process'],
      globals: {
        Buffer: true,
        process: true,
      }
    })
  ],
  define: {
    'process.env': {},
    global: 'window'
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
});