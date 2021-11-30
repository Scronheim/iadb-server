const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    ref: 'users'
  },
})

const Role = mongoose.model('role', roleSchema, 'role')

module.exports = Role
