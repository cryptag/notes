# CrypTag Notes

![](https://tryingtobeawesome.com/files/screenshot-cryptag-notes-viewmode.png)

![](https://tryingtobeawesome.com/files/screenshot-cryptag-notes-editmode.png)

CrypTag Notes is a secure note-taking app.  It encrypts your notes
(which are stored as Markdown files) and allows you to store them just
about anywhere -- a local folder, Dropbox, Sandstorm, or your own
server running `cryptag-webserver`.

You can also securely share these folders full of (encrypted) notes
with others!

CrypTag Notes is a desktop app made with
[Electron](https://github.com/electron/electron) and React.js that
talks to a local server/API/daemon, `cryptagd`, which is run by the
Electron app if `cryptagd` is not running already.

(If you would also like to store snippets of websites you visit as
notes,
[install the CrypTag Clip Chrome extension](https://chrome.google.com/webstore/detail/cryptag-clip/kiakdfalhdbjkllkobeoheekddcomchb)
and make sure Notes is also running.)


## Installing from Binaries

**For announcements of newly-released versions of CrypTag Notes**,
including links to conveniently pre-built versions of this app, please
[see these posts on my Patreon!](https://www.patreon.com/cryptag/posts?tag=notes)


## Pre-requisites

Install the `cryptag` command line tool.


### cryptag

Make sure you have Go installed and `$GOPATH` set.  Then run:

    $ go get github.com/cryptag/cryptag/cmd/cryptag

If you'd like to securely store your notes in a local folder, create a
local filesystem Backend called "notes" and make it the default like
this:

    $ cryptag init filesystem notes ~/.cryptag/backends/notes
    $ cryptag setdefaultbackend notes

Or, if you'd like to securely store your notes in Sandstorm, [install the CrypTag Sandstorm app](https://apps.sandstorm.io/app/mkq3a9jyu6tqvzf7ayqwg620q95p438ajs02j0yx50w2aav4zra0),
_click the key icon_ near the top of your screen to generate a web key, then run:

    $ cryptag init sandstorm notes <sandstorm_web_key>
    $ cryptag setdefaultbackend notes

If someone else gave you the Sandstorm webkey _and the decryption key_
needed to access the notes (and perhaps other data) that s/he is
sharing with you, also run:

    $ cryptag -b notes setkey <key>

For more on getting started with `cryptag`, including how to store and
fetch files and other data at the command line, simply run

    $ cryptag


### cryptagd

Install the local daemon `cryptagd` that CrypTag Notes talks to:

    $ go get github.com/cryptag/cryptag/servers/cryptagd

Run it in one terminal with

    $ cryptagd

Meanwhile, in another terminal, run CrypTag Notes (see next section).


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
[jimmcgaw/cpassui@d072b0f](https://github.com/jimmcgaw/cpassui/commit/d072b0fa8d9c2442a094cae98bf2acafb28154f3),
and for his many contributions since!
