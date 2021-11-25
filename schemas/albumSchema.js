const mongoose = require('mongoose')

const albumSchema = new mongoose.Schema({
  bandId: mongoose.SchemaTypes.ObjectId,
  title: String,
  cover: String,
  type: String,
  label: mongoose.SchemaTypes.ObjectId,
  releaseDate: {
    type: mongoose.SchemaTypes.Date,
  },
  trackList: Array,
  rating: Number
}, {
  versionKey: false,
})

const albumModel = mongoose.model('albums', albumSchema)

module.exports = albumModel
