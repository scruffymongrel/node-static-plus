# node-static-plus

A super-simple static web server with optional HTTP Basic Auth and local HTTPS via self-signed certificates.

`node-static-plus` makes it super-simple to add a static server to a client-side project for working with secure services and privileged JavaScript APIs. Once you're ready to deploy it to [Dokku](https://github.com/dokku/dokku), [Heroku](https://www.heroku.com), [now](https://now.sh), or whatever, add any platform-specific files (e.g. `echo 'web: node .' > Procfile` for Dokku/Heroku) and you're good to go.

`node-static-plus` is built on top of the tried and tested foundation of [`node-static`](https://github.com/cloudhead/node-static).

## Usage

`$ npm i -s node-static-plus` to add the module as a dependency, then create an `index.js` as follows:

```js
// index.js

const nodeStaticPlus = require('node-static-plus')
const config = {
  // see next section for config options
}

nodeStaticPlus(config)
```

### Configuration

`node-static-plus` can be configured as follows:

```js
const config = {
  auth: { // Optional
    username: 'user', // Required if `auth` is specified
    password: 'pass', // Required if `auth` is specified
    realm: 'Demo', // Optional. Displayed in authentication prompt is some browsers. Default is `'Private'`
    always: true, // Optional. Enforces authentication even when `process.env.NODE_ENV !== 'production'`. Default is `false`
  },
  errors: { // Optional
    404: '404.html' // If you don't specify a 404, a blank page will be shown instead
  },
  port: 12345, // Optional. Default is `process.env.PORT` or `54321`
  root: 'public', // Optional. Default is `'.'`
  static: {}, // Optional. Provides configuration for `node-static`. See `node-static` documentation for valid options
  tls: { // Optional. Swaps the server to HTTPS (unless `process.env.NODE_ENV === 'production'`)
    cert: 'path/to/cert.pem',
    key: 'path/to/cert-key.pem'
  }
}
```

Of course you can also set any property to use environment variables, etc.

## TLS support

`node-static-plus` turns into an HTTPS server if you feed it a valid SSL certificate and key.

If you need to create locally-trusted development certificates, check out [`mkcert`](https://github.com/FiloSottile/mkcert).

### TLS in production

**TLS support is intended for local dev use only**, and the configuration is automatically ignored in production, where you should be using something more robust. Many platforms will provide SSL out-of-the-box. If you're using `dokku`, then [`dokku-letsencrypt`](https://github.com/dokku/dokku-letsencrypt) is your friend.

## Demo

`$ npm run demo` and open <http://localhost:12345> in your browser. Username is `user` and password is `pass`.

Unresolved URLs such as <http://localhost:12345/unicorns> get a 404 page as per the `config` in `demo/index.js`.
