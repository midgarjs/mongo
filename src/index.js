import { Plugin } from '@midgar/midgar'
import MongoMigrateStorage from './libs/mongo-migrate-storage.js'

const STORAGE_KEY = 'mid:mongo'
const MODULE_TYPE_KEY = 'midgar-mongo-model'

export { STORAGE_KEY, MODULE_TYPE_KEY }

/**
 * MongoPlugin
 */
class MongoPlugin extends Plugin {
  constructor (...args) {
    super(...args)
    /**
     * Model dir key
     * @type {string}
     */
    this.moduleTypeKey = MODULE_TYPE_KEY
    this.migrateStorageKey = STORAGE_KEY
  }

  /**
   * Init plugin
   */
  async init () {
    // Declare models dir
    this.pm.addModuleType(this.moduleTypeKey, 'mongo-models')

    // Add migration storage
    this.mid.on('@midgar/migrate:init', (migrateService) => {
      migrateService.addStorage(STORAGE_KEY, MongoMigrateStorage)
    })
  }
}

export default MongoPlugin

export const dependencies = [
  '@midgar/service',
  '@midgar/migrate'
]

export const config = {
  moduleTypes: {
    'midgar-mongo-model': 'models'
  }
}
