import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

const eslintConfig = defineConfig(
  // Các rules khuyên dùng cho JS
  eslint.configs.recommended,

  // Các rules cho file nằm trong src
  {
    files: ['src/**/*.{ts,js}'],

    // Các rules khuyên dùng cho TS và type-checking
    extends: tseslint.configs.recommendedTypeChecked,

    languageOptions: { parser: tseslint.parser, parserOptions: { projectService: true } },

    // Các rules tuỳ chỉnh
    rules: { 'no-console': 'error' },
  },

  // Các rules cho file config
  {
    files: ['*.config.{js,ts}'],

    extends: tseslint.configs.recommended,
  },

  // Tích hợp Prettier vào ESLint
  eslintPluginPrettierRecommended,
);

export default eslintConfig;
