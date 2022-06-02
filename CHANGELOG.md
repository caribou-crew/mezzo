# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [0.10.1](https://github.com/caribou-crew/mezzo/compare/v0.10.0...v0.10.1) (2022-06-02)

### Bug Fixes

- export reference to plugins for consumer ([b426b80](https://github.com/caribou-crew/mezzo/commit/b426b80507d4a7f2e3c3ed4ef92c45c7d6520c01))

# [0.10.0](https://github.com/caribou-crew/mezzo/compare/v0.9.0...v0.10.0) (2022-06-02)

### Features

- highlight selected network item on click ([#148](https://github.com/caribou-crew/mezzo/issues/148)) ([f49498f](https://github.com/caribou-crew/mezzo/commit/f49498feb43e7f8b2b33e447a1daed2b381c4a14))
- show pending requests ([#149](https://github.com/caribou-crew/mezzo/issues/149)) ([d33f389](https://github.com/caribou-crew/mezzo/commit/d33f389aaf2cd76c069cadf7c03c0dddb28f8c4c))
- suppress record & profiles if disabled ([#145](https://github.com/caribou-crew/mezzo/issues/145)) ([d37b1d1](https://github.com/caribou-crew/mezzo/commit/d37b1d1151c85253baaeec366cbf58f0d305b535))
- update record screen styling ([#147](https://github.com/caribou-crew/mezzo/issues/147)) ([9ee800f](https://github.com/caribou-crew/mezzo/commit/9ee800fbe327011113d180c5f7ef1b8834054b0c))

# [0.9.0](https://github.com/caribou-crew/mezzo/compare/v0.8.3...v0.9.0) (2022-05-27)

### Bug Fixes

- update host and port defaults ([#142](https://github.com/caribou-crew/mezzo/issues/142)) ([5344c82](https://github.com/caribou-crew/mezzo/commit/5344c82da23e04bd96415eb2065bb2d4c3ab3b16))
- **web sockets:** server detects disconnected clients and closes them ([#143](https://github.com/caribou-crew/mezzo/issues/143)) ([1ca24ab](https://github.com/caribou-crew/mezzo/commit/1ca24ab92205d9b940372ae23ff775bd6c77de38)), closes [#129](https://github.com/caribou-crew/mezzo/issues/129)

### Features

- client refactoring and styling ([#144](https://github.com/caribou-crew/mezzo/issues/144)) ([55f87a1](https://github.com/caribou-crew/mezzo/commit/55f87a19fc39d902cdec9de33fd0f30cd18ab9e9))

## [0.8.3](https://github.com/caribou-crew/mezzo/compare/v0.8.2...v0.8.3) (2022-05-25)

### Bug Fixes

- use relativeUrl in web ([88d26fe](https://github.com/caribou-crew/mezzo/commit/88d26fe8c673de3b688fc71b0f91782d4c2795c4))

## [0.8.2](https://github.com/caribou-crew/mezzo/compare/v0.8.1...v0.8.2) (2022-05-25)

### Bug Fixes

- fix click delay on home screen when changing routes ([784d2c5](https://github.com/caribou-crew/mezzo/commit/784d2c55d8f84e2394348e3e71320c622eb90157))
- improve profiles page load by ~8s with 200 more routes ([9f8cdc4](https://github.com/caribou-crew/mezzo/commit/9f8cdc49bb99cfbd73032a4504d4d525e756a1d3))
- update profile on select ([#141](https://github.com/caribou-crew/mezzo/issues/141)) ([ce946b0](https://github.com/caribou-crew/mezzo/commit/ce946b0776a98ef7b0c742a1a78e69db8785d453))
- useContext instead of creating individual mezzo clients ([004fc13](https://github.com/caribou-crew/mezzo/commit/004fc13eb98920bae3061967648244e15addca14))

## [0.8.1](https://github.com/caribou-crew/mezzo/compare/v0.8.0...v0.8.1) (2022-05-23)

### Bug Fixes

- **mezzo-client:** support relative url path for client connect ([ab475f5](https://github.com/caribou-crew/mezzo/commit/ab475f5887ee421f2efd5316d90c3317f5c366b1)), closes [#127](https://github.com/caribou-crew/mezzo/issues/127)

# [0.8.0](https://github.com/caribou-crew/mezzo/compare/v0.7.1...v0.8.0) (2022-05-20)

### Features

- add theme provided update admin page styling ([#124](https://github.com/caribou-crew/mezzo/issues/124)) ([7072749](https://github.com/caribou-crew/mezzo/commit/707274953af199a5d3a78e75ff9d971139c2b2a4))
- clear recording button ([#125](https://github.com/caribou-crew/mezzo/issues/125)) ([84a548a](https://github.com/caribou-crew/mezzo/commit/84a548add001657379b56152ef2a4300475d809c))

## [0.7.1](https://github.com/caribou-crew/mezzo/compare/v0.7.0...v0.7.1) (2022-05-19)

### Bug Fixes

- **react-native:** fix socket connection in react-native so that it can send ([5122e1b](https://github.com/caribou-crew/mezzo/commit/5122e1bb45135de44f30276673b449fa2771ab52))

# [0.7.0](https://github.com/caribou-crew/mezzo/compare/v0.6.8...v0.7.0) (2022-05-18)

### Bug Fixes

- **dev admin-web:** fix proxy from 4200 react web to 8000 express ([80d1faa](https://github.com/caribou-crew/mezzo/commit/80d1faa9c81bbfbb19761e1b9e4185d86e7bff21))

### Features

- client rework and optimizations ([#119](https://github.com/caribou-crew/mezzo/issues/119)) ([22d0f69](https://github.com/caribou-crew/mezzo/commit/22d0f6963e86ec7b47ffc7485fef34424e0b88d6))
- support local and global profiles ([#116](https://github.com/caribou-crew/mezzo/issues/116)) ([4ee1575](https://github.com/caribou-crew/mezzo/commit/4ee1575130b627cd6d2899569c2ceca5d69db8bc))

## [0.6.8](https://github.com/caribou-crew/mezzo/compare/v0.6.7...v0.6.8) (2022-05-14)

## [0.6.7](https://github.com/caribou-crew/mezzo/compare/v0.6.6...v0.6.7) (2022-05-14)

## [0.6.6](https://github.com/caribou-crew/mezzo/compare/v0.6.5...v0.6.6) (2022-05-13)

## [0.6.5](https://github.com/caribou-crew/mezzo/compare/v0.6.4...v0.6.5) (2022-05-13)

## [0.6.4](https://github.com/caribou-crew/mezzo/compare/v0.6.3...v0.6.4) (2022-05-13)

## [0.6.3](https://github.com/caribou-crew/mezzo/compare/v0.6.2...v0.6.3) (2022-05-13)

## [0.6.3](https://github.com/caribou-crew/mezzo/compare/v0.6.2...v0.6.3) (2022-05-13)

## [0.6.1](https://github.com/caribou-crew/mezzo/compare/v0.6.0...v0.6.1) (2022-05-12)

### Bug Fixes

- fix admin-web ts ([19041fe](https://github.com/caribou-crew/mezzo/commit/19041fe699378f1c98a6a7e86c8bd0369d927701))

# [0.6.0](https://github.com/caribou-crew/mezzo/compare/v0.5.0...v0.6.0) (2022-05-12)

### Features

- forcing feat comment as a ton changed between last release ([3b2a711](https://github.com/caribou-crew/mezzo/commit/3b2a711559d8e9cd4321a72bf2e0f367f791fccc))

# [0.6.0](https://github.com/caribou-crew/mezzo/compare/v0.5.0...v0.6.0) (2022-05-12)

### Bug Fixes

- fix web build ([c6ad4f4](https://github.com/caribou-crew/mezzo/commit/c6ad4f43011e9b08a77ace00e3074d285c6ed772))

### Features

- forcing feat comment as a ton changed between last release ([3b2a711](https://github.com/caribou-crew/mezzo/commit/3b2a711559d8e9cd4321a72bf2e0f367f791fccc))

# [0.6.0](https://github.com/caribou-crew/mezzo/compare/v0.5.0...v0.6.0) (2022-05-12)

### Bug Fixes

- **typescript:** fix admin web ts issues ([03c4423](https://github.com/caribou-crew/mezzo/commit/03c4423bb8eb0fef1ba8aa09d284e1d5c731d7b1))

### Features

- forcing feat comment as a ton changed between last release ([3b2a711](https://github.com/caribou-crew/mezzo/commit/3b2a711559d8e9cd4321a72bf2e0f367f791fccc))

# [0.6.0](https://github.com/caribou-crew/mezzo/compare/v0.5.0...v0.6.0) (2022-05-12)

### Bug Fixes

- **typescript:** fix admin web ts issues ([03c4423](https://github.com/caribou-crew/mezzo/commit/03c4423bb8eb0fef1ba8aa09d284e1d5c731d7b1))

### Features

- forcing feat comment as a ton changed between last release ([3b2a711](https://github.com/caribou-crew/mezzo/commit/3b2a711559d8e9cd4321a72bf2e0f367f791fccc))

## [0.7.1](https://github.com/caribou-crew/mezzo/compare/v0.7.0...v0.7.1) (2022-05-12)

# [0.7.0](https://github.com/caribou-crew/mezzo/compare/v0.6.0...v0.7.0) (2022-05-11)

### Features

- forcing feat comment as a ton changed between last release ([3b2a711](https://github.com/caribou-crew/mezzo/commit/3b2a711559d8e9cd4321a72bf2e0f367f791fccc))
