
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

const config = {
  log: {
    dir: getTmpDir('logs'),
    stdout: true,
    level: 'error'
  },
  pluginsLocalPath: resolve('../plugins'),
  mongo: {
    default: {
      uri: process.env.MONGO_CONNEXION_URI ? process.env.MONGO_CONNEXION_URI : 'mongodb://localhost:27017/midgar-test?connectTimeoutMS=1000',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }
  }
}


// Set Auth options
if (process.env.MONGO_CONNEXION_USER && process.env.MONGO_CONNEXION_PASSWORD) {
  config.mongo.default.options = {
    auth: { authSource: 'admin' },
    user: process.env.MONGO_CONNEXION_USER,
    pass: process.env.MONGO_CONNEXION_PASSWORD
  }
}

export default config