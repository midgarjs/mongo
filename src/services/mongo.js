import mongoose from 'mongoose'
import utils from '@midgar/utils'

const DEFAULT_CONNEXION_NAME = 'default'
const serviceName = 'mid:mongo'

/**
 * MongoService class
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
     * @type {object}
     */
    this.config = utils.assignRecursive({}, this.mid.config.mongo || {}, {})

    /**
     * Connexions dictionary
     * @type {object}
     */
    this.connexions = {}

    /**
     * Models dictionary
     * @type {object}
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
      if (!connexionConfig.uri) throw new Error(`@midgar/mongo: Invalid db config for ${connexion} connexion !`)

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
    this.mid.debug(`@midgar/mongo: Mongoose init in ${time} ms`)
  }

  /**
   * load plugins models
   */
  async loadModels () {
    this.mid.debug('@midgar/mongo: Load models...')

    const mongoosePlugin = this.mid.pm.getPlugin('@midgar/mongo')
    // Get models files content

    const files = await this.mid.pm.importModules(mongoosePlugin.moduleTypeKey)
    // Create the models object
    await utils.asyncMap(files, async (file) => {
      if (!file.export.model) throw new Error(`@midgar/mongo: Missing model entry in model : ${file.path} !`)
      if (!file.export.name) throw new Error(`@midgar/mongo: Missing name entry in model : ${file.path} !`)

      const modelName = file.export.name

      this.mid.debug(`@midgar/mongo: Load model ${file.path}.`)

      const connexionName = file.export.connexion || DEFAULT_CONNEXION_NAME
      const connexion = this.getConnexion(connexionName)
      const Model = await file.export.model(connexion, this.mid)

      this.addModel(modelName, Model)
    }, true)

    this.mid.debug('@midgar/mongo: Load models finish')
  }

  /**
   * Add a model
   *
   * @param {string} name Model name
   * @param {Model} Model Mogoose model
   */
  addModel (name, Model) {
    this.models[name] = Model
  }

  /**
   * Return a Mongoose instance
   *
   * @param {string} name Connexion name
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
   * @param {string} name Model name
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
