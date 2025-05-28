import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
});

// If you are using Vitest, add the following export:
export const test = {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/setupTests.ts',
};
