# Mezzo

Mezzo is REST API mocking library powered by Express.  The intended use case is to create a det

This documentation is a work in progress.

## Getting Started

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
    callback: (req, res) => {
      res.json({ someKey: 'A' });
    },
  })
```

## Variants
Variants let you setup alternate responses to your routes.
```js
someRoute..variant({
  id: 'variantId1',
  callback: (req, res) => {
      res.json({ someKey: 'B' });
  },
})
```

### Set variant for route

The active variant can be selected via Admin UI at `http://localhost:8000/mezzo` by clicking on the desired variant button.

Variants can also be set programmatically. 

```js
await mezzo.setMockVariant({ [routeId]: 'variantId1' });
```

## Sessions
When mezzo has multiple simultaneous consumers there is often a need for "sessions" to scope variants to specific consumers.  For example given 2 consumers, it's possible they want different variants for the same API at the same time.

This can be solved by using sessions.  As a consumer you can pass a session ID `x-request-session` in the request header and out of the box all responses will be the default variant unless set otherwise and scoped to this session ID.  Session ID can be any string.

### Set/Update session variant
The admin UI is not currently supported for multiple concurrent sessions but there are some utility methods.

`mezzo.setMockVariantForSession` and `mezzo.updateMockVariantForSession` can be used to change variants for a specified session ID.

`set` will leave all variants in a `default` state that are not part of the `setMockVariantForSession` call, `updateMockVariantForSession` only changes the variants specified.

#### Examples 

All routes except for `route1` and `route2` will be set to default variants.
```js
await mezzo.setMockVariantForSession(sessionId, {
  [route1]: variant1,
  [route2]: variant2,
});
```
and

`route1` and `route2` variants will be updated, all other routes will be whatever they were previously set to.
```js
await mezzo.updateMockVariantForSession(sessionId, {
  [route1]: variant1,
  [route2]: variant2,
});
```

### Get custom variant despite not being set

If you want to receive a specified variant without changing the route state simply add the `x-request-variant` header with the desired variant ID for the rouet you're requesting.

## Headers

Per the prior sections, `x-request-variant` and `x-request-session` can be used to drive different behavior.

## Admin UI
The admin UI at `http://localhost:8000/mezzo` is great if using this locally to set routes and variants in global scope.  It has a handy GUI to set variants, make requests, and view responses.

## Hosting remotely
At the end of the day this is a node API that can be hosted anywhere node runs.  A typical use case is to host remotely and have multiple consumers connect each defining their own session ID using variants to drive deterministic behavior.

## Profiles

TODO - Coming soon.  The idea is to support a permutation of variants that you can easily swap between.

## Icons

You can add titleIcons to a route menu item or icons to a specific variant button.  Any icons listed [on gogle font icons](https://fonts.google.com/icons?selected=Material+Icons&icon.style=Outlined) can be used.

Example
```js
const dynamicFeed = { name: 'dynamic_feed' };
const link = { name: 'link' };
const database = { name: 'storage' };
mezzo
  .route({
    id: 'GET /api/food/meat',
    path: '/api/food/meat',
    titleIcons: [ // this shows an icon in the route item even when collapsed
      {
        name: 'code',
        link: 'https://github.com/caribou-crew/mezzo',
      },
    ],
    icons: [database, dynamicFeed, link], // these icons appear on the specific variant button when the route is expanded, in this case the default button
    callback: function (req, res) {
      res.json({ someKey: 'A' });
    },
  })
```

## Redirects
If you want endpoint A to map to redirect to endpoint B you can use this code snippet
```js
mezzo.redirect(`/oldPath`, `/newPath`)
```