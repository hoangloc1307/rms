import type { UserConfig } from '@commitlint/types';

const commitlintConfig: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    name: 'conventional-changelog-conventionalcommits',
    parserOpts: {
      headerPattern: /^(\S*\s*)([\w-]+)(?:\(([^)]+)\))?!?: (.+)$/,
      headerCorrespondence: ['emoji', 'type', 'scope', 'subject'],
    },
  },
};

export default commitlintConfig;
