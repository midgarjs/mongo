
import path from 'path'
import os from 'os'
import uid from 'uid-safe'
import mkdirp from 'mkdirp'

const resolve = (p) => {
  return path.join(__dirname, p)
}

function getTmpDir (name) {
  const dirname = path.join(os.tmpdir(), uid.sync(8), name)

  mkdirp.sync(dirname, { mode: parseInt('0700', 8) })

  return dirname
}

export default {
  web: {
    port: 4000,
    host: 'localhost',
    ssl: false,
    sslCert: '',
    sslKey: ''
  },
  log: {
    dir: getTmpDir('logs'),
    stdout: false,
    level: 'error'
  },
  plugin: {
    dir: resolve('../plugins')
  },
  mongo: {
    default: {
      uri: process.env.MONGO_CONNEXION_STR ? process.env.MONGO_CONNEXION_STR : 'mongodb://localhost:27017/midgar?connectTimeoutMS=1000',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }
  }
}
