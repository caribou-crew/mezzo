/* eslint-disable */
export default {
  displayName: 'interceptor-react-native-with-reactotron',

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
  coverageDirectory:
    '../../coverage/libs/interceptor-react-native-with-reactotron',
  preset: '../../jest.preset.js',
};
