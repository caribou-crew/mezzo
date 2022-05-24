module.exports = {
  displayName: 'core-server',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],

  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/core-server',
  preset: '../../jest.preset.ts',
  coveragePathIgnorePatterns: ['/__tests__/'],
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
};
