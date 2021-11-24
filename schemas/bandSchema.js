const mongoose = require('mongoose')

const bandSchema = new mongoose.Schema({
  title: String,
  origin: String,
  description: String,
  albums: Array
})

const bandModel = mongoose.model('bands', bandSchema)

module.exports = bandModel
