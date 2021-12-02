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
  labelId: {
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
  countryId: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  officialSite: {
    type: String,
  },
  links: {
    type: Array,
  },
  lineUpIds: {
    type: Array,
  }
}, {
  versionKey: false,
})

const bandModel = mongoose.model('bands', bandSchema, 'bands')

module.exports = bandModel
