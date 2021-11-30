const mongoose = require('mongoose')

const peopleSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  birthDate: {
    type: mongoose.SchemaTypes.Date,
  },
  countryId: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  instruments: {
    type: String,
  },
  photo: {
    type: String
  },
}, {
  versionKey: false,
})

const peopleModel = mongoose.model('people', peopleSchema, 'people')

module.exports = peopleModel
