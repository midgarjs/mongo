import Midgar from "@midgar/midgar"

const MIGRATION_MODEL = 'mid:migration'

/**
 * MongoMigrateStorage class
 * Migration storage for MongoPlugin
 */
class MongoMigrateStorage {
  /**
   * @param {Midgar} mid Midgar instance
   */
  constructor (mid) {
    /**
     * Midgar instance
     * @type {Midgar}
     */
    this.mid = mid
    this.mongoService = this.mid.getService('mid:mongo')
  }

  async isInstalled () {
    return true
  }

  async getMigrations () {
    const MigrationModel = this.mongoService.getModel(MIGRATION_MODEL)
    return MigrationModel.find()
  }

  /**
   * Save executed version in database
   *
   * @param {string} plugin Plugin name
   * @param {string} name   Migration file name
   * @param {string} type   Migration type (schema|data)
   *
   * @returns {Migration} Sequelize version model
   */
  async saveMigration (plugin, name, type) {
    const MigrationModel = this.mongoService.getModel(MIGRATION_MODEL)
    const migration = new MigrationModel({ plugin, name, type, date: new Date() })
    await migration.save()
  }

  /**
   * Delete executed version in database
   *
   * @param {string} plugin Plugin name
   * @param {string} name   Migration file name
   * @param {string} type   Migration type (schema|data)
   *
   * @returns {Migration} Sequelize version model
   */
  async deleteMigration (plugin, name, type) {
    const MigrationModel = this.mongoService.getModel(MIGRATION_MODEL)
    await MigrationModel.deleteOne({ plugin, name, type })
  }

  getCallArgs () {
    return [
      this.mongoService
    ]
  }
}

export default MongoMigrateStorage
