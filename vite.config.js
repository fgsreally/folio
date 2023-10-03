// vite.config.js
import glslify from "vite-plugin-glslify";
import { defineConfig } from "vite";
export default defineConfig({
    resolve: {
        alias: [
            // {
            //     find: /^three\//,
            //     replacement: "https://unpkg.com/three@0.142.0/",
            // },
        ],
    },
    plugins: [glslify()],
    build: {
        lib: {
            entry: "./src/javascript/index.js",
            name: "matcapWorld",
            formats: ["es", "cjs", "umd", "iife"],
        },
    },
    rollupOptions: {
        external: [],
    },
});
