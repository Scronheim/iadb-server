const {jsonResponse} = require('../utils')

const config = require("../config/auth.config")
const db = require("../models")
const User = db.user
const Role = db.role

const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

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
    ])
    delete user[0].password
    jsonResponse(res, user[0])
  })
}

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      jsonResponse(res, null, err, false, 500)
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            jsonResponse(res, null, err, false, 500)
          }

          user.roles = roles.map(role => role._id)
          user.save(err => {
            if (err) {
              jsonResponse(res, null, err, false, 500)
            }
            jsonResponse(res, user, true, 201)
          })
        }
      );
    } else {
      Role.findOne({ name: 'user' }, (err, role) => {
        if (err) {
          jsonResponse(res, null, err, false, 500)
        }

        user.roles = [role._id]
        user.save(err => {
          if (err) {
            jsonResponse(res, null, err, false, 500)
          }
          jsonResponse(res, user, null, true, 201)
        });
      });
    }
  });
};

exports.signin = async (req, res) => {
  let user = await User.aggregate([
    {
      $match: {
        username: req.body.username
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
  ]).catch((err) => {
    console.log(err)
    jsonResponse(res, null, err)
  })
  user = user[0]
  if (!user) {
    jsonResponse(res, null, 'User no found', false, 404)
  }

  const passwordIsValid = bcrypt.compareSync(
    req.body.password,
    user.password
  );

  if (!passwordIsValid) {
    jsonResponse(res, null, 'Invalid password', false, 401)
  }
  const token = jwt.sign({ id: user._id.toString() }, config.secret, {
    expiresIn: 628000000 // 1 month
  })

  const authorities = []

  for (let i = 0; i < user.roles.length; i++) {
    authorities.push(user.roles[i].name)
  }
  const response = {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
    },
    token: token
  }
  jsonResponse(res, response)
}
