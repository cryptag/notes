# CrypTag Notes

![](https://tryingtobeawesome.com/files/screenshot-cryptag-notes-viewmode.png)

![](https://tryingtobeawesome.com/files/screenshot-cryptag-notes-editmode.png)

This is a desktop app made with electron and React.js that talks to a
local server/API/daemon `cryptagd` which is provided by
[CrypTag](https://github.com/cryptag/cryptag).

## Pre-requisites

Install `cryptask-sandstorm` to create and store tasks and store them
in [Sandstorm](https://sandstorm.io/) (once you install
[the CrypTag Sandstorm app](https://apps.sandstorm.io/app/mkq3a9jyu6tqvzf7ayqwg620q95p438ajs02j0yx50w2aav4zra0)
).

### cryptask-sandstorm

Make sure you have Go installed, then run:

    $ go get github.com/cryptag/cryptag/cmd/cryptask-sandstorm
    $ cryptask-sandstorm init <sandstorm_webkey>

To generate a Sandstorm webkey,
[install this](https://apps.sandstorm.io/app/mkq3a9jyu6tqvzf7ayqwg620q95p438ajs02j0yx50w2aav4zra0)
then _click the key icon_ near the top of your screen.

If someone else gave you the Sandstorm webkey along with the decrypt
key needed to access the tasks s/he is sharing with you, also run

    $ cryptask-sandstorm setkey <key>

For more on getting started with `cryptask-sandstorm`, including how
to store and fetch tasks at the command line, simply run

    $ cryptask-sandstorm

### cryptagd

Install the local daemon `cryptagd` that CrypTag Notes talks to:

    $ go get github.com/cryptag/cryptag/servers/cryptagd

Run it in one terminal with

    $ cryptagd

meanwhile, in another terminal, run CrypTag Notes (see next section).

## Installation and Running

You'll need both node (and npm) and (bower)[https://bower.io/] installed.

``` $ npm install ```

``` $ bower install ```

You should also install gulp as a global tool on your system:

``` $ npm install gulp -g ```

then

``` $ npm start ```

## Development

In order to edit the CSS styles, edit the SASS files inside of static/sass. The files in static/css are
generated automatically from the SASS files by running:

``` $ gulp sass ```

If you run the default gulp task:

``` $ gulp ```

gulp will run in the background and recompile the CSS any time you make changes to the SASS files.

In order to add any new bower libraries to the HTML files:

``` $ gulp inject ```

## Testing

There are some placeholder tests included here that test the rendering of the individual components
and the final compiled version of the app. You'll need to build the app first:

``` $ npm run build ```

If you're on Linux, instead run:

``` $ npm run build-linux ```

(TODO: automate this based on system platform detection.)

``` $ npm test ```

## Thank Yous

_Major_ thanks to [@jimmcgaw](https://github.com/jimmcgaw) for writing
the foundations to this app, which began as a clone of
[jimmcgaw/cpassui@d072b0f](https://github.com/jimmcgaw/cpassui/commit/d072b0fa8d9c2442a094cae98bf2acafb28154f3).
