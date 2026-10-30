import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Debe coincidir con el nombre del repositorio en GitHub Pages (gaston1x.github.io/vibe-events/).
export default defineConfig({
  base: "/vibe-events/",
  plugins: [react()],
  build: {
    // three.js ocupa ~510 kB por sí solo; queda en su propio archivo cacheable.
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        // Separa three.js (escena 3D) y las librerías de React del código de la app.
        codeSplitting: {
          groups: [
            { name: "three", test: /node_modules[\\/]three/ },
            { name: "vendor", test: /node_modules/ },
          ],
        },
      },
    },
  },
});
