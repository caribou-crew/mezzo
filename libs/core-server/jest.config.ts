module.exports = {
  displayName: 'core-server',

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
  coverageDirectory: '../../coverage/libs/core-server',
  preset: '../../jest.preset.ts',
  coveragePathIgnorePatterns: ['/__tests__/'],
};
