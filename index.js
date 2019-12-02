const auth = require('basic-auth')
const fs = require('fs')
const http = require('http')
const https = require('https')
const nodeStatic = require('node-static')

module.exports = config => {
  const fileServer = new nodeStatic.Server(config.root, config.static)
  const port = process.env.PORT || config.port || 54321
  const handler = (req, res) => {
    if (config.auth && config.auth.username && config.auth.password) {
      const credentials = auth(req)
      const unauthenticated = !credentials
        || credentials.name !== config.auth.username
        || credentials.pass !== config.auth.password
      if (unauthenticated && (process.env.NODE_ENV === 'production' || config.auth.always)) {
        res.writeHead(401, {'WWW-Authenticate': `Basic realm="${config.auth.realm || 'Private'}"`})
        res.end()
        return
      }
    }
    req.addListener('end', () => {
      fileServer.serve(req, res, err => {
        if (err && config.errors && config.errors[err.status]) {
          fileServer.serveFile(config.errors[err.status], err.status, {}, req, res)
        } else {
          res.end()
        }
      })
    }).resume()
  }

  function createServer (secure) {
    if (secure) {
      server = https.createServer({
        cert: fs.readFileSync(config.tls.cert),
        key: fs.readFileSync(config.tls.key)
      }, handler)
    } else {
      server = http.createServer(handler)
    }
    return server
  }

  function isSecure () {
    if (
      process.env.NODE_ENV !== 'production' &&
      !!config.tls && !!config.tls.cert && !!config.tls.key &&
      fs.existsSync(config.tls.cert) &&
      fs.existsSync(config.tls.key)
    ) return true
    return false
  }

  createServer(isSecure()).listen(port, '0.0.0.0', () => {
    console.log(`Server running at ${isSecure() ? 'https' : 'http'}://localhost:${port}`)
  })
}
