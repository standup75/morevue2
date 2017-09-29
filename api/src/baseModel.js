mongoose = require('mongoose')

// Abstract properties:
// schema.statics.names.plural
// schema.statics.names.singular
// schema.statics.publicFields

module.exports = (schema) => {
  const schemaName = schema.statics.names.plural
  console.log('initializing model "' + schemaName + '"')

  schema.methods.assign = (newModel) => {
    for (field in newModel) {
      if (schema.statics.publicFields.indexOf(field) > -1) {
        this[field] = newModel[field]
      }
    }
  }
  if (!schema.options.toJSON) {
    schema.options.toJSON = {}
  }
  schema.options.toJSON.transform = (doc, ret, options) => {
    const jsonRepresentation = {
      id: ret._id
    }
    schema.statics.publicFields.forEach(field => jsonRepresentation[field] = ret[field])
    return jsonRepresentation
  }
  return mongoose.model(schemaName, schema)
}
