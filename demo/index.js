const server = require('../index.js')

server({
  auth: {
    username: 'user',
    password: 'pass',
    realm: 'Demo',
    always: true,
  },
  errors: {
    404: '404.html'
  },
  port: 12345,
  root: 'public',
  static: {
    cache: 0,
    gzip: true
  }
})
