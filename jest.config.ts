import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',

  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },

  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
