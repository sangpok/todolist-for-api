import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@API', replacement: '/src/API' },
      { find: '@Constants', replacement: '/src/Constants' },
      { find: '@Hooks', replacement: '/src/Hooks' },
      { find: '@Pages', replacement: '/src/Pages' },
      { find: '@Store', replacement: '/src/Store' },
      { find: '@Types', replacement: '/src/Types' },
      { find: '@Utils', replacement: '/src/Utils' },
      { find: '@', replacement: '/src' },
    ],
  },
});
