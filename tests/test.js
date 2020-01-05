import mocha from 'mocha'
import chai from 'chai'
import dirtyChai from 'dirty-chai'
import path from 'path'

import { MongoMemoryServer } from 'mongodb-memory-server'

import MongoPlugin, { STORAGE_KEY } from '../src/index'
import service from '../src/services/mongo'

/**
 * @type {Midgar}
 */
import Midgar from '@midgar/midgar'

const MongoService = service.service
const mongod = new MongoMemoryServer()

// fix for TypeError: describe is not a function with mocha-teamcity-reporter
const { describe, it } = mocha
const INVALID_MIGRATION_MSG = 'Invalid migration !'

const expect = chai.expect
chai.use(dirtyChai)

let mid = null
const initMidgar = async () => {
  mid = new Midgar()
  // Mok db
  mid.on('@midgar/mongo:beforeInit', (mongo) => mongod.getConnectionString().then(uri => { mongo.config.default.uri = uri }))
  await mid.start(path.join(__dirname, 'fixtures/config'))
  return mid
}

const migrateShouldResult = [
  {
    plugin: 'test-plugin',
    name: '0.1.0-create-test.js',
    type: 'data'
  },
  {
    plugin: 'test-plugin-2',
    name: '0.1.0-create-test.js',
    type: 'data'
  }
]

function isSameMigation (migration, migration2) {
  if (migration.plugin === migration2.plugin && migration.name === migration2.name &&
    migration.type === migration2.type) {
    return true
  }

  return false
}

/**
 * Test the service plugin
 */
describe('Mongo', function () {
  this.timeout(10000)
  beforeEach(async () => {
    mid = await initMidgar()
  })

  afterEach(async () => {
    // Clean mongoose models
    mid.getService('mid:mongo').getConnexion('default').models = {}
    const migrateService = mid.getService('mid:migrate')
    await migrateService.down(null, STORAGE_KEY)
    await mid.stop()
    mid = null
  })

  /**
   * Test if the plugin is load
   */
  it('test plugin', async () => {
    const plugin = mid.pm.getPlugin('@midgar/mongo')
    expect(plugin).to.be.an.instanceof(MongoPlugin, 'Plugin is not an instance of MongoPlugin')

    const service = mid.getService('mid:mongo')
    expect(service).to.be.an.instanceof(MongoService, 'Service is not an instance of MongoService')
  })

  /**
   * Test if model are loded
   */
  it('test model', async () => {
    const mongoService = mid.getService('mid:mongo')
    const TestModel = mongoService.getModel('mid:test-model')

    // Test schema
    expect(TestModel.prototype.schema.obj).to.have.all.keys(['code', 'name'])

    const TestModel2 = mongoService.getModel('mid:test-model-2')

    // Test schema
    expect(TestModel2.prototype.schema.obj).to.have.all.keys(['description', 'label'])
  })

  it('migrations', async () => {
    const migrateService = mid.getService('mid:migrate')
    const mongoService = mid.getService('mid:mongo')
    const MigrationModel = mongoService.getModel('mid:migration')
    let migrations = await MigrationModel.find()

    expect(migrations.length).to.eql(0)
    await migrateService.up(null, STORAGE_KEY)

    migrations = await MigrationModel.find()
    expect(migrations.length).to.eql(2)

    expect(isSameMigation(migrations[0], migrateShouldResult[0])).to.be.true(INVALID_MIGRATION_MSG)
    expect(isSameMigation(migrations[1], migrateShouldResult[1])).to.be.true(INVALID_MIGRATION_MSG)

    await migrateService.down(1, STORAGE_KEY)

    migrations = await MigrationModel.find()
    expect(migrations.length).to.eql(1)
    expect(isSameMigation(migrations[0], migrateShouldResult[0])).to.be.true(INVALID_MIGRATION_MSG)

    await migrateService.down(1, STORAGE_KEY)

    migrations = await MigrationModel.find()
    expect(migrations.length).to.eql(0)
  })
})
