const jwt = require("jsonwebtoken")
const config = require("../config/auth.config.js")
const db = require("../models")
const {jsonResponse} = require("../utils");
const User = db.user
const Role = db.role

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"]

  if (!token) {
    return res.status(403).send({ message: "No token provided!" })
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" })
    }
    req.userId = decoded.id
    next()
  })
}

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      jsonResponse(res, null, err, false, 500)
    }
    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          jsonResponse(res, null, err, false, 500)
        }
        roles.forEach((r) => {
          if (r.name === 'admin') {
            next()
            return
          } else {
            res.status(403).send({message: 'Admin role required!'})
          }
        })
      }
    )
  })
}

isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      jsonResponse(res, null, err, false, 500)
    }
    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          jsonResponse(res, null, err, false, 500)
        }

        roles.forEach((r) => {
          if (r.name === 'moderator') {
            next()
            return
          } else {
            res.status(403).send({message: 'Moderator role required!'})
          }
        })
      }
    )
  })
}

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
}
module.exports = authJwt
