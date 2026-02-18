import type { Configuration } from 'lint-staged';

const lintStagedConfig: Configuration = {
  '*.{ts,js}': ['prettier --write', 'eslint --fix'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};

export default lintStagedConfig;
