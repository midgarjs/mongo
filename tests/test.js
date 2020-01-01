import mocha from 'mocha'
import chai from 'chai'
import dirtyChai from 'dirty-chai'
import path from 'path'
import MongoPlugin from '../src/index'

/**
 * @type {Midgar}
 */
import Midgar from '@midgar/midgar'

// fix for TypeError: describe is not a function with mocha-teamcity-reporter
const { describe, it } = mocha

const expect = chai.expect
chai.use(dirtyChai)

let mid = null
const initMidgar = async () => {
  mid = new Midgar()
  await mid.start(path.join(__dirname, 'fixtures/config'))
  return mid
}

/**
 * Test the service plugin
 */
describe('Mongo', function () {
  beforeEach(async () => {
    mid = await initMidgar()
  })

  afterEach(async () => {
    await mid.stop()
    mid = null
  })

  /**
   * Test if the plugin id load
   */
  it('plugin is load', async () => {
    const plugin = mid.pm.getPlugin('@midgar/mongo')
    expect(plugin).to.be.an.instanceof(MongoPlugin, 'Plugin is not an instance of MongoPlugin')
  })
})
