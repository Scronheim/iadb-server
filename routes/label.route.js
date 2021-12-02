const {jsonResponse} = require('../utils')

const express = require('express')
const mongoose = require('mongoose')
const labelModel = require('../models/label.model')
const router = new express.Router()

router.get('/api/label/id/:id', async (req, res) => {
  const ObjectId = mongoose.Types.ObjectId
  const response = await labelModel.aggregate([
    {
      $match: {
        _id: ObjectId(req.params.id)
      }
    },
    {
      $lookup: {
        from: 'bands',
        localField: '_id',
        foreignField: 'labelId',
        as: 'bands'
      }
    },
    {
      $lookup: {
        from: 'albums',
        localField: '_id',
        foreignField: 'labelId',
        pipeline: [
          {$lookup: {
              from: 'bands',
              localField: 'bandId',
              foreignField: '_id',
              as: 'band'
            }},
          {$unwind: '$band'}
        ],
        as: 'albums'
      }
    },
  ])
  jsonResponse(res, response[0])
})

router.route('/api/label')
  .get(async (req, res) => {
    if (req.query.search) {
      const response = await labelModel.aggregate([
        {$match: {
            title: {$regex: `^${req.query.search}`, $options: 'i'}
          }},
      ])
      jsonResponse(res, response)
    } else {
      jsonResponse(res)
    }
  })
  .post((req, res) => {
    labelModel.create(req.body, function (err, response) {
      if (err) jsonResponse(res, null, err.errors, false)
      jsonResponse(res, response)
    })
  })
  .patch((req, res) => {
    labelModel.findOneAndUpdate({_id: req.body._id}, req.body).then((response) => {
      jsonResponse(res, response)
    })
  })

module.exports = router
