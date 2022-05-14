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
    networking: false, // set networking to false if using react native
  })
  .use(
    mezzoAndReactotronNetworking({
      mezzoPort: 8000,
    })
  ) // and use mezzo & reactotron networking
  .connect();
```
