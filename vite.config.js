import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/maxui-app.io/',  // <-- указываем имя репозитория
  plugins: [react()],
});
