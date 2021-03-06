const {jsonResponse} = require('../utils')

const express = require('express')
const mongoose = require('mongoose')
const bandModel = require('../models/band.model')
const {authJwt} = require('../middlewares')
const router = new express.Router()

router.get('/api/band/name/:name', async (req, res) => {
  const regex = new RegExp(["^", req.params.name, "$"].join(""), "i")
  const response = await bandModel.aggregate([
    {
      $match: {
        title: regex
      }
    },
    {
      $lookup: {
        from: 'albums',
        localField: '_id',
        foreignField: 'bandId',
        as: 'albums'
      }
    }
  ])
  jsonResponse(res, response)
})

router.get('/api/band/id/:id', async (req, res) => {
  const ObjectId = mongoose.Types.ObjectId
  const response = await bandModel.aggregate([
    {
      $match: {
        _id: ObjectId(req.params.id)
      }
    },
    {
      $lookup: {
        from: 'albums',
        localField: '_id',
        foreignField: 'bandId',
        as: 'albums'
      }
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
      $lookup: {
        from: 'countries',
        localField: 'countryId',
        foreignField: '_id',
        as: 'country'
      }
    },
    {
      $unwind: '$label'
    },
    {
      $unwind: '$country'
    }
  ])
  jsonResponse(res, response[0])
})

router.route('/api/band')
  .get(async (req, res) => {
    if (req.query.search) {
      const response = await bandModel.aggregate([
        {$match: {
            title: {$regex: req.query.search, $options: 'i'}
          }},
        {
          $lookup: {
            from: 'countries',
            localField: 'countryId',
            foreignField: '_id',
            as: 'country'
          }
        },
        {
          $unwind: '$country'
        },
      ])
      jsonResponse(res, response)
    }
  })
  .post([authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
    bandModel.create(req.body, (err, response) => {
      if (err) jsonResponse(res, null, err.errors, false)
      jsonResponse(res, response)
    })
  })
  .patch([authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
    bandModel.findOneAndUpdate({_id: req.body._id}, req.body).then((response) => {
      jsonResponse(res, response)
    })
  })

module.exports = router
