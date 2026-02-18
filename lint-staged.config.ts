import type { Configuration } from 'lint-staged';

const lintStagedConfig: Configuration = { '*.{ts,js}': ['eslint --fix'], '*.json': ['prettier --write'] };

export default lintStagedConfig;
