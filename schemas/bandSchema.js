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
  formedIn: {
    type: Number,
  },
  description: {
    type: String,
  },
  label: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  logo: {
    type: String,
  },
  photo: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
  },
  country: {
    type: mongoose.SchemaTypes.ObjectId,
  }
}, {
  versionKey: false,
})

const bandModel = mongoose.model('bands', bandSchema)

module.exports = bandModel
