const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    ref: 'users'
  },
}, {
  versionKey: false,
})

const Role = mongoose.model('role', roleSchema, 'role')

module.exports = Role
