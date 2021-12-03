const mongoose = require('mongoose')
const {jsonResponse} = require('../utils')
const jwt = require('jsonwebtoken')
const config = require('../config/auth.config')
const db = require("../models")
const User = db.user

const ObjectId = mongoose.Types.ObjectId

exports.saveUser = (req, res) => {
  User.findByIdAndUpdate(req.body._id, req.body, {new: true}).then((user) => {
    jsonResponse(res, user)
  })
}

exports.aboutMe = (req, res) => {
  const token = req.headers['x-access-token']
  if (!token) return jsonResponse(res, null, ['Не указан токен'], false, 401)

  jwt.verify(token, config.secret, async function(err, decoded) {
    if (err) return jsonResponse(res, null, 'Invalid token', false, 500)
    const user = await User.aggregate([
      {
        $match: {
          _id: ObjectId(decoded.id)
        }
      },
      {
        $lookup: {
          from: 'role',
          localField: 'roles',
          foreignField: '_id',
          as: 'roles'
        }
      },
      {
        $lookup: {
          from: 'albums',
          localField: 'likedAlbumIds.albumId',
          foreignField: '_id',
          as: 'likedAlbums'
        }
      },
      {
        $lookup: {
          from: 'albums',
          localField: 'listenListIds',
          foreignField: '_id',
          as: 'listenList'
        }
      },
    ])
    delete user[0].password
    jsonResponse(res, user[0])
  })
}


exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.")
}

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.")
}

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.")
}

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.")
}
