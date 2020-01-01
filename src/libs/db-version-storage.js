
class MoongooseStorage {
  constructor(midgar) {
    this.midgar = midgar
    this.mongooseService = this.midgar.getService('midgar:mongoose')
  }

  async isInstalled() {
    return true
  }

  async getVersions() {
    const DbVersion = this.mongooseService.getModel('midgar:dbVersion')
    return DbVersion.find()
  }

  /**
   * Save executed version in database
   * 
   * @param {string} plugin Plugin name
   * @param {string} name   Version file name
   * @param {string} type   Version type (schema|data)
   * 
   * @returns {Version} Sequelize version model
   */
  async saveVersion(plugin, name, type) {
    const DbVersion = this.mongooseService.getModel('midgar:dbVersion')
    const dbVersion = new DbVersion({ plugin, name, type, date: new Date })
    await dbVersion.save()
  }

  /**
   * Delete executed version in database
   * 
   * @param {string} plugin Plugin name
   * @param {string} name   Version file name
   * @param {string} type   Version type (schema|data)
   * 
   * @returns {Version} Sequelize version model
   */
  async deleteVersion (plugin, name, type) {
    const DbVersion = this.mongooseService.getModel('midgar:dbVersion')
    await DbVersion.deleteOne({ plugin, name, type })
  }

  getCallArgs() {
    return [
      this.mongooseService
    ]
  }
}

module.exports = (midgar) => {
  return new MoongooseStorage(midgar)
}