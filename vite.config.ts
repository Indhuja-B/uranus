import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import esbuild from "esbuild";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    /* jsxInject: `import React from 'react'`, */
  },
  build: {
    rollupOptions: {
      plugins: [
        {
          name: "jsx-in-js",
          transform(code, id) {
            if (/\.js$/.test(id)) {
              // Using regex to check if the file ends with .js
              let result = esbuild.transformSync(code, {
                loader: "jsx",
                jsxFactory: "React.createElement",
                jsxFragment: "React.Fragment",
              });
              return result.code;
            }
          },
        },
      ],
    },
  },
});
