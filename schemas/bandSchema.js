const mongoose = require('mongoose')

const bandSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
}, {
  versionKey: false,
})

const bandModel = mongoose.model('bands', bandSchema)

module.exports = bandModel
