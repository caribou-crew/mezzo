/* eslint-disable */
export default {
  displayName: 'core-server',

  globals: {},
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],

  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/core-server',
  preset: '../../jest.preset.js',
  coveragePathIgnorePatterns: ['/__tests__/'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/lib/utils/env.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
};
