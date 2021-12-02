const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  roles: [
    {
      type: mongoose.SchemaTypes.ObjectId,
    }
  ],
  avatar: {
    type: String,
  },
  ratingIds: [
    {
      albumId: {
        type: mongoose.SchemaTypes.ObjectId
      },
      rating: {
        type: Number,
      },
      createdAt: {
        type: mongoose.SchemaTypes.Date
      }
    }
  ]
}, {
  versionKey: false,
})

const User = mongoose.model('users', userSchema, 'users')

module.exports = User
