import type { Options } from 'prettier';

const prettierConfig: Options = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  bracketSpacing: true,
  objectWrap: 'preserve',
  arrowParens: 'always',
  endOfLine: 'auto',
};

export default prettierConfig;
