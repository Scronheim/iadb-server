const mongoose = require('mongoose')

const labelSchema = new mongoose.Schema({
  title: String,
  country: String,
  address: String,
  phone: String,
  status: String,
  styles: String,
  site: String,
  foundingDate: Number,
  parentLabel: mongoose.SchemaTypes.ObjectId
}, {
  versionKey: false,
})

const labelModel = mongoose.model('labels', labelSchema)

module.exports = labelModel
