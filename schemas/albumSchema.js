const mongoose = require('mongoose')

const albumSchema = new mongoose.Schema({
  bandId: mongoose.SchemaTypes.ObjectId,
  title: String,
  year: Number,
  cover: String,
}, {
  versionKey: false,
})

const albumModel = mongoose.model('albums', albumSchema)

module.exports = albumModel
