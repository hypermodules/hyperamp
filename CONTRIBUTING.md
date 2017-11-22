# Contributing Guidelines

Thanks for wanting to help make Hyperamp better! Here are some general guidelines for helping out.

## Code of Conduct

This project is intended to be a safe, welcoming space for collaboration. All contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct. Thank you for being kind to each other!

## Contributions welcome!

**Before spending lots of time on something, ask for feedback on your idea first!**

Please search [issues](../../issues/) and [pull requests](../../pulls/) before adding something new! This helps avoid duplicating efforts and conversations.

This project welcomes any kind of contribution! Here are a few suggestions:

- **Ideas**: participate in an issue thread or start your own to have your voice heard.
- **Writing**: contribute your expertise in an area by helping expand the included content.
- **Copy editing**: fix typos, clarify language, and generally improve the quality of the content.
- **Formatting**: help keep content easy to read with consistent formatting.
- **Code**: help maintain and improve the project codebase.

## Code Style

[![standard][standard-image]][standard-url]

This repository uses [`standard`][standard-url] to maintain code style and consistency, and to avoid style arguments.

[standard-image]: https://cdn.rawgit.com/feross/standard/master/badge.svg
[standard-url]: https://github.com/feross/standard

## Developing

Hyperamp is an experimental audio player built with web technologies ([choo](https://github.com/yoshuawuyts/choo) + [electron](https://github.com/electron/electron)). We recommend getting familiar with JavaScript, HTML, and CSS before jumping into coding.

### Install

This project is a [module party](http://module.party). That just means everything you should need to get it up and running after cloning the repository is summed up by these three lines:

```
npm install
npm test
npm start
```

**TL;DR:** before getting started, make sure to run `npm install`.

### Scripts

- `start` - start the app in development mode
- `prod` - start the app in production mode
- `test` - run all tests
- `build` - create a test build of the app for debugging purposes
- `pkg` - package the production version of the app for release

### Directory Structure

- `dist` - this is where the app gets built to when packaging the app
- `main` - files for the main electron process
- `renderer` - files for the renderer processes (player & audio)
- `scripts` - miscellaneous scripts for development tasks
- `static` - static assets (icons, screenshots, documents, etc.)
- `test` - files for testing the application

## Project Governance

**This is an [OPEN Open Source Project](http://openopensource.org/).**

Individuals making significant and valuable contributions are given commit access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

### Rules

There are a few basic ground rules for collaborators:

1. **No `--force` pushes to master** or modifying the Git history in any way.
1. **Non-master branches** ought to be used for ongoing work.
1. **External API changes and significant modifications** ought to be subject to an **internal pull request** to solicit feedback from other contributors.
1. Internal pull requests to solicit feedback are *encouraged* for any other non-trivial contribution but left to the discretion of the contributor.
1. Contributors should attempt to adhere to the prevailing code style.

### Releases

Declaring formal releases remains the prerogative of the project maintainer.

### Changes to this arrangement

This is an experiment and feedback is welcome! This document may also be subject to pull requests or changes by contributors where you believe you have something valuable to add or change.
