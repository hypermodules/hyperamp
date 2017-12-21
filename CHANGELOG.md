# hyperamp Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

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
