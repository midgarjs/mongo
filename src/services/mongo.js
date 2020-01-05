import mongoose from 'mongoose'
import utils from '@midgar/utils'

const DEFAULT_CONNEXION_NAME = 'default'
const serviceName = 'mid:mongo'

/**
 * Mongo service
 */
class MongoService {
  constructor (mid) {
    /**
     * Midgar instance
     * @type {Midgar}
     */
    this.mid = mid

    /**
     * Config
     * @type {Object}
     */
    this.config = utils.assignRecursive({}, this.mid.config.mongo || {}, {})

    /**
     * Connexions indexed by name
     * @type {Object}
     */
    this.connexions = {}

    /**
     * Models indexed by name
     * @type {Object}
     */
    this.models = {}
  }

  /**
   * Int db connexions
   */
  async init () {
    utils.timer.start('midgar-init-mongo')
    this.mid.debug('@midgar/mongo: start init Mongoose')

    /**
     * beforeInit event.
     *
     * @event @midgar/mongo:beforeInit
     */
    await this.mid.emit('@midgar/mongo:beforeInit', this)

    const connexions = Object.keys(this.config)

    if (!connexions.length) throw new Error('@midgar/mongo: No connexion found in config !')

    // List connection set in config
    await utils.asyncMap(connexions, async connexion => {
      const connexionConfig = this.config[connexion]
      if (!connexionConfig.uri) throw new Error('@midgar/mongo: Invalid db config for ' + connexion + ' connexion !')

      this.connexions[connexion] = await mongoose.connect(connexionConfig.uri, connexionConfig.options ? connexionConfig.options : {})
    })

    await this.loadModels()

    /**
     * afterLoadModels event.
     *
     * @event @midgar/mongo:afterLoadModels
     */
    await this.mid.emit('@midgar/mongo:afterLoadModels', this)

    const time = utils.timer.getTime('midgar-init-mongo')
    this.mid.debug('@midgar/mongo: Mongoose init in ' + time[0] + 's, ' + time[1] + 'ms')
  }

  /**
   * load plugins models
   */
  async loadModels () {
    this.mid.debug('@midgar/mongo: Load models...')

    const mongoosePlugin = this.mid.pm.getPlugin('@midgar/mongo')
    const modelsDirKey = mongoosePlugin.modelsDirKey
    // Get models files content

    const files = await this.mid.pm.importDir(modelsDirKey)
    // Create the models object
    await utils.asyncMap(files, async (file) => {
      this.mid.silly('@midgar/mongo: Load model ' + file)
      if (!file.export.getModel || !file.export.name) {
        throw new Error('@midgar/mongo: Invalide mongoose model: ' + file.path + ' !')
      }

      const modelName = file.export.name

      this.mid.debug('@midgar/mongo: Load model ' + file.path)

      const connexionName = file.export.connexion || DEFAULT_CONNEXION_NAME
      const connexion = this.getConnexion(connexionName)
      const Model = await file.export.getModel(connexion, this.mid)

      this.addModel(modelName, Model)
    }, true)

    this.mid.debug('@midgar/mongo: Load models finish')
  }

  /**
   * Add a model
   *
   * @param {String} name Model name
   * @param {Model} Model Mogoose model
   */
  addModel (name, Model) {
    this.models[name] = Model
  }

  /**
   * Return a Mongoose instance
   *
   * @param {String} name Connexion name
   *
   * @return {Mongoose}
   */
  getConnexion (name = DEFAULT_CONNEXION_NAME) {
    if (!this.connexions[name]) throw new Error(`@midgar/mongo: Invalid connexion name ${name} !`)
    return this.connexions[name]
  }

  /**
   * Return a Mongo model by name
   *
   * @param {String} name Model name
   *
   * @return {Model}
   */
  getModel (name) {
    if (!this.models[name]) throw new Error(`@midgar/mongo: Invalid model name ${name} !`)
    return this.models[name]
  }
}

export default {
  service: MongoService,
  name: serviceName
}
