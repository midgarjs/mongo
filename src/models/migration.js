
const name = 'mid:migration'

export default {
  name,
  model: (mongoose) => {
    const schema = mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      plugin: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      date: {
        type: String,
        required: true
      }
    })

    schema.index({ name: 1, plugin: 1, type: 1 }, { unique: true })
    return mongoose.model(name, schema)
  }
}
