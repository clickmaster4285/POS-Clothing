import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // allows access via localhost and LAN IP
    port: 5173,      // optional, default Vite port
    strictPort: false, // if true, will fail if port is taken
  },
});
