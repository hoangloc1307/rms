import type { Options } from 'prettier';

const prettierConfig: Options = {
  printWidth: 120,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  bracketSpacing: true,
  objectWrap: 'preserve',
  arrowParens: 'always',
  endOfLine: 'lf',
};

export default prettierConfig;
