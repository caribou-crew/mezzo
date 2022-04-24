# Mezzo

### Build & Run dev project

- Install all dependencies
  - `npm i`
- Run dev project
  - `npm run dev`

In development web runs on `http://localhost:4200/` while API runs on `http://localhost:8000/`

Idea is once packaged both run from same endponit.

This project was generated using [Nx](https://nx.dev).

# Building

The only non-intuitive piece during building vs development is in development the admin website and core APIs exist on two separate ports by 2 separate projects.
When building to publish to npm the web project is actually injected into the core project so that it is served by the same express server powering the core module.
This is done under the hood by the `nx prepare core` step powered bythe buildCoreWithWeb/impl file.
If changes are made to that file compile it `npx tsc tools/executors/buildCoreWithWeb/impl` via `npm build:executor`

# Publishing

Run `npm publish dist/libs/core --access public` from the root of the project.

# Test

- Run tests
  - `npm test`
