import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/max-ui-app/', // <-- имя репозитория
  plugins: [react()]
});
