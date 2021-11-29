const mongoose = require('mongoose')

const countrySchema = new mongoose.Schema({
  name: String,
  code: String,
}, {
  versionKey: false,
})

const countryModel = mongoose.model('countries', countrySchema, 'countries')

module.exports = countryModel
