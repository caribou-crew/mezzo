## Mezzo

An express powered mocking library that can serve up static or dynamic user mocks.

This documentation is a work in progress.

### Getting Started

```js
import mezzo from `@caribou-crew/mezzo-core`;

// start your mezzo server
await mezzo.start({
  port: 8000,
  mockedDirectory
});

// add your mocks
mezzo
  .route({
    id: 'GET /route1',
    path: '/route1',
    callback: function (req, res) {
      res.json({ someKey: 'A' });
    },
  })
```

### Variants
Variants let you control the response of each mocked endpoint

### Sessions
TODO

### Headers

### Admin UI

### Hosting remotely

### Profiles

