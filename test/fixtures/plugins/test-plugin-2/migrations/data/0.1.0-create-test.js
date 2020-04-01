export default {
  up: async (mid, mongoService) => {
    const Test2Model = mongoService.getModel('mid:test-model-2')
    const test = new Test2Model({ label: 'test-label', description: 'test-desciption' })
    await test.save()
  },
  down: async (mid, mongoService) => {
    const Test2Model = mongoService.getModel('mid:test-model-2')
    Test2Model.deleteOne({ label: 'test-label' })
  }
}
