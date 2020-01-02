export default {
  up: async (mid, mongoService) => {
    const TestModel = mongoService.getModel('mid:test-model')
    const test = new TestModel({ code: 'test-code', name: 'test-name' })
    await test.save()
  },
  down: async (mid, mongoService) => {
    const TestModel = mongoService.getModel('mid:test-model')
    TestModel.deleteOne({ code: 'test-code' })
  }
}
