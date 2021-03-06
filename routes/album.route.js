const {jsonResponse} = require('../utils')

const express = require('express')
const mongoose = require("mongoose")
const albumModel = require("../models/album.model")
const {authJwt} = require('../middlewares')
const router = new express.Router()

router.get('/api/album/id/:id', async (req, res) => {
  const ObjectId = mongoose.Types.ObjectId
  const response = await albumModel.aggregate([
    {
      $match: {
        _id: ObjectId(req.params.id)
      }
    },
    {
      $lookup: {
        from: 'bands',
        localField: 'bandId',
        foreignField: '_id',
        as: 'band'
      }
    },
    {
      $unwind: '$band'
    },
    {
      $lookup: {
        from: 'labels',
        localField: 'labelId',
        foreignField: '_id',
        as: 'label'
      }
    },
    {
      $lookup: {
        from: 'people',
        localField: 'lineUpIds',
        foreignField: '_id',
        as: 'lineUp'
      }
    },
    {
      $unwind: '$label'
    },
  ])
  jsonResponse(res, response[0])
})
router.route('/api/album')
  .get(async (req, res) => {
    if (req.query.search) {
      const response = await albumModel.aggregate([
        {$match: {
            title: {$regex: `^${req.query.search}`, $options: 'i'}
          }},
        {
          $lookup: {
            from: 'bands',
            localField: 'bandId',
            foreignField: '_id',
            as: 'band'
          }
        },
        {
          $unwind: '$band'
        },
      ])
      jsonResponse(res, response)
    } else {
      jsonResponse(res)
    }
  })
  .post([authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
    albumModel.create(req.body, function (err, response) {
      if (err) jsonResponse(res, null, err.errors, false)
      jsonResponse(res, response)
    })
  })
  .patch([authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
    albumModel.findOneAndUpdate({_id: req.body._id}, req.body).then((response) => {
      jsonResponse(res, response)
    })
  })

module.exports = router
