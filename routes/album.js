const {jsonResponse} = require('../utils')

const express = require('express')
const mongoose = require("mongoose")
const albumModel = require("../schemas/albumSchema")
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
        localField: 'label',
        foreignField: '_id',
        as: 'label'
      }
    },
    {
      $unwind: '$label'
    }
  ])
  jsonResponse(res, response[0])
})

router.post('/api/album', (req, res) => {
  albumModel.create(req.body, function (err, response) {
    if (err) jsonResponse(res, null, err.errors, false)
    jsonResponse(res, response)
  })
})

module.exports = router
