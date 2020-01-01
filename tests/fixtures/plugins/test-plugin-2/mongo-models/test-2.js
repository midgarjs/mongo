
const name = 'mid:test-model-2'
export default {
  name,
  getModel (mongoose) {
    const schema = mongoose.Schema({
      label: {
        type: String,
        required: true,
        lowercase: true,
        index: true
      },
      description: {
        type: String,
        required: true
      }
    }, {
      timestamps: true
    })

    return mongoose.model(name, schema)
  }
}
