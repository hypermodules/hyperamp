# hyperamp Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## 0.5.15 - 2018-05-22
* Update deps
  * "electron": "2.0.2",
  * "electron-builder": "20.14.7",
  * "music-metadata": "^1.1.0",

## 0.5.14 - 2018-05-15
* Update deps
  * `bl@2.0.0`
  * `music-metadata@0.11.5`
  * `electron@2.0.0`
  * `electron-builder@20.13.4`
  * `electron-updater@2.21.10`
  * `standard@11.0.1`

## 0.5.13 - 2018-03-06

### Features
* add genre to columns & search (#307) (#309)

## 0.5.12 - 2018-03-03

### Fixes
* **build**: specify AppImage as linux target (#306)

## 0.5.11 - 2018-02-23

### Fixes
* **menu**: do not strip "bugs" from package (#304) (#305)
  * fixed by bumping electron-builder@20.0.8

## 0.5.10 - 2018-02-14
* Update internal deps:
  * Update music-metadata@0.9.2
  * Update pump@3.0.0
  * Update browserify@16.1.0
  * Update electron@1.8.2
  * Update electron-builder@20.0.4

## 0.5.9 - 2018-01-27
* Update electron due to security fixes

## 0.5.8 - 2017-12-21
* Disable slow duration extraction.  Some songs may lack a duration but this will avoid slow metadata extraction.  We have a solution that is almost done to alleviate this issue, hold tight.
* Better library scan timing.
* Search header is now selectable and wont drag the window.
* feat(playlist): add "Reveal in Finder" context menu option to tracks
* fix(scanning): uncaught TypeError from missing "no" prop (#289)
* fix(sort): send tracks with no artist to bottom
* refactor(log): ignore timeupdate channel
* update add button, refactor button groups
* Fix missing artwork due to a build regression

## 0.5.7 - 2017-12-03
* Fix range sliders getting stuck in a disabled state (🙏nickpeihl🙏)
* Disable nanotiming in production

## 0.5.6 - 2017-11-11
* Report auto update errors to sentry
* Switch to a shared thread sentry for easier importing to unrelated modules

## 0.5.5 - 2017-11-11
* Add sentry
* Expose auto-update events to player
* Fix windows bugs
* Prevent multiple instances of the app


## 0.5.4 - 2017-11-10
* Update choo devtools
* Remove choo log
* Fix header update function
* Update electron

## 0.5.3 - 2017-11-09
* Added this here changelog
* Fix some state transfer bugs

## 0.5.2 - 2017-11-10
* Engage
