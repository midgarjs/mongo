import { Plugin } from '@midgar/midgar'
import MongoMigrateStorage from './libs/migrate-storage.js'

const STORAGE_KEY = 'mid:mongo'
const MODELS_DIR_KEY = 'midgar-mongo-models'

export { STORAGE_KEY, MODELS_DIR_KEY }

/**
 * MongoPlugin
 */
class MongoPlugin extends Plugin {
  constructor (...args) {
    super(...args)
    /**
     * Model dir key
     * @type {String}
     */
    this.modelsDirKey = MODELS_DIR_KEY
    this.migrateStorageKey = STORAGE_KEY
  }

  /**
   * Init plugin
   */
  async init () {
    // Declare models dir
    this.pm.addPluginDir(this.modelsDirKey, 'mongo-models')

    // Add migration storage
    this.mid.on('@midgar/migrate:init', (migrateService) => {
      migrateService.addStorage(STORAGE_KEY, MongoMigrateStorage)
    })
  }
}

export default MongoPlugin
