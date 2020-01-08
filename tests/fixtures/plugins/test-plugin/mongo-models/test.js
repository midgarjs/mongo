
const name = 'mid:test-model'
export default {
  name,
  model: (mongoose) => {
    const schema = mongoose.Schema({
      code: {
        type: String,
        required: true,
        lowercase: true,
        index: true
      },
      name: {
        type: String,
        required: true
      }
    }, {
      timestamps: true
    })

    return mongoose.model(name, schema)
  }
}
