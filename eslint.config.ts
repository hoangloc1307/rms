import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import type { Linter } from 'eslint'

const config: Linter.FlatConfig[] = [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // ===== Clean backend rules =====
      'no-console': 'warn',
      'no-debugger': 'warn',

      // ===== TypeScript strict =====
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',

      // ===== Best practice =====
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  prettier,
]

export default config
