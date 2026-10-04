import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/prot-tipo/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../../../prot-tipo',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('recharts') || id.includes('d3-') || id.includes('victory')) return 'charts';
          if (id.includes('motion')) return 'motion';
          if (id.includes('react') || id.includes('scheduler')) return 'react';
        },
      },
    },
  },
});
