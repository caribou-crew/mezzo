/* eslint-disable */
export default {
  displayName: 'core-client-server-tests',
  preset: '../../jest.preset.js',
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
  coverageDirectory: '../../coverage/libs/core-client-server-tests',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
};
