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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role'
    }
  ]
})

const User = mongoose.model('users', userSchema, 'users')

module.exports = User
