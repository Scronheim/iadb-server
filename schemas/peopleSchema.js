const mongoose = require('mongoose')

const peopleSchema = new mongoose.Schema({
  name: String,
  bandIds: [mongoose.SchemaTypes.ObjectId],
  birthDate: mongoose.SchemaTypes.Date,
  country: mongoose.SchemaTypes.ObjectId,
  instruments: String,
  photo: String,
}, {
  versionKey: false,
})

const peopleModel = mongoose.model('people', peopleSchema, 'people')

module.exports = peopleModel
