import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/maxui-app.io/', // <- обязательно имя репозитория с "/" на конце
  plugins: [react()],
});
