const {readFileSync} = require('fs');
const {version} = JSON.parse(readFileSync('package.json').toString());
require('dotenv').config();

process.env.SNOWPACK_PUBLIC_SERVER_HOST = process.env.SERVER_HOST ?? 'ws://localhost:3090';
process.env.SNOWPACK_PUBLIC_APP_VERSION = version;

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: {url: '/', static: true},
    src: {url: '/dist'},
  },
  alias: {
    "react": "preact/compat",
    "react-dom": "preact/compat",
    '@store': './src/store'
  },
  plugins: [
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-typescript',
    '@prefresh/snowpack',
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    "bundle": true,
    minify: true
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
