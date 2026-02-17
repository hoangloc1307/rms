import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  // Import các rule mặc định của eslint và typescript
  eslint.configs.recommended,
  tseslint.configs.recommended,

  // Tạo một rule block
  {
    // Chỉ áp dụng rule này cho file .ts
    files: ['**/*.ts'],

    // Các rule custom
    rules: { 'no-console': 'error', 'no-debugger': 'warn' },
  },

  // Tắt các rule của eslint có thể xung đột với Prettier
  eslintPluginPrettierRecommended
);
