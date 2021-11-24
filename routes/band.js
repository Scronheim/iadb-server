const {jsonResponse} = require('../utils')

const express = require('express')
const bandModel = require("../schemas/bandSchema");
const mongoose = require("mongoose");
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

router.post('/api/band', (req, res) => {
  bandModel.create(req.body, function (err, response) {
    if (err) jsonResponse(res, null, err.errors, false)
    jsonResponse(res, response)
  })
})

module.exports = router
