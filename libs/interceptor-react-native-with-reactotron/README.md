# interceptor-react-native-with-reactotron

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test interceptor-react-native-with-reactotron` to execute the unit tests via [Jest](https://jestjs.io).

## Running lint

Run `nx lint interceptor-react-native-with-reactotron` to execute the lint via [ESLint](https://eslint.org/).

## Usage

This assumes you've already setup Reactotron.

To use the plugin install the package

### npm

```shell
npm install @caribou-crew/mezzo-interceptor-react-native-with-reactotron
```

### yarn

```shell
yarn add @caribou-crew/mezzo-interceptor-react-native-with-reactotron
```

Then use the plugin in your Reactotron config

```js
import Reactotron from 'reactotron-react-native';
import mezzoAndReactotronNetworking from '@caribou-crew/mezzo-interceptor-react-native-with-reactotron';

Reactotron.configure({
  name: 'React Native Demo',
})
  .useReactNative({
    asyncStorage: false,
    networking: false, // set networking to false if using react native
    editor: false,
    overlay: false,
  })
  .use(mezzoAndReactotronNetworking()) // and use mezzo & reactotron networking
  .connect();
```
