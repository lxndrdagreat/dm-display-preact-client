# DM Display

[dmdisplay.app](https://dmdisplay.app) is a free, open source tool for tabletop
RPG groups. Currently, it allows a DM/GM to use an admin interface to control
state while a 2nd screen displays the information. Currently, it is only a
combat tracker, but more features are on the [roadmap](https://github.com/lxndrdagreat/dm-display-preact-client/issues/23).

The tool is hosted and available for free at [dmdisplay.app](https://dmdisplay.app),
or you can build and host it yourself using the source code. This repo is the
web-based single page app, which functions as the client. The server is located
in [its own repo](https://github.com/lxndrdagreat/dm-display-server).

## Using the source code

- Node/npm required.
- Clone this repo.
- Clone the [server repo](https://github.com/lxndrdagreat/dm-display-server)
and follow its documentation to get it running.
- `npm install` to get dependencies.
- `npm start` will build and run the client via [snowpack](https://www.snowpack.dev/).
- `npm build` will create a production-ready build.
