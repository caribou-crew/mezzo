module.exports = {
  displayName: 'core-client',

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
  coverageDirectory: '../../coverage/libs/core-client',
  preset: '../../jest.preset.ts',
  coveragePathIgnorePatterns: ['/__tests__/'],
};
