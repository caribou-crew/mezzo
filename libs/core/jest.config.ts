module.exports = {
  displayName: 'core',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/core',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
  preset: '../../jest.preset.ts',
};
