const mongoose = require('mongoose')

const albumSchema = new mongoose.Schema({
  bandId: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  title: {
    type: String,
  },
  cover: {
    type: String,
  },
  type: {
    type: String,
  },
  labelId: {
    type: mongoose.SchemaTypes.ObjectId
  },
  releaseDate: {
    type: mongoose.SchemaTypes.Date,
  },
  trackList: {
    type: Array,
  },
  rating: {
    type: Number,
  },
  tags: {
    type: Array,
  },
  lineUpIds: {
    type: Array,
  },
  catalogNumber: {
    type: String,
  }
}, {
  versionKey: false,
})

const albumModel = mongoose.model('albums', albumSchema, 'albums')

module.exports = albumModel
