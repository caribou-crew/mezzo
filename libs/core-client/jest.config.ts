/* eslint-disable */
export default {
  displayName: 'core-client',

  globals: {},
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
  coverageDirectory: '../../coverage/libs/core-client',
  preset: '../../jest.preset.js',
  coveragePathIgnorePatterns: ['/__tests__/'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
};
