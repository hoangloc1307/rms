import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

const eslintConfig = defineConfig(
  {
    ignores: ['dist', 'node_modules'],
  },

  // Các rules khuyên dùng cho JS
  eslint.configs.recommended,

  // Các rules cho file nằm trong src
  {
    files: ['src/**/*.{ts,js}'],

    // Các rules khuyên dùng cho TS và type-checking
    extends: tseslint.configs.recommendedTypeChecked,

    languageOptions: { parser: tseslint.parser, parserOptions: { projectService: true } },

    // Các rules tuỳ chỉnh
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Các rules cho file config
  {
    files: ['*.config.{js,ts}'],

    extends: tseslint.configs.recommended,
  },

  // Tắt các rules không cần thiết hoặc xung đột với Prettier
  eslintConfigPrettier,
);

export default eslintConfig;
