import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,          
    setupFiles: './vitest.setup.js',
    coverage: {
      reporter: ['text', 'html'],
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
});
