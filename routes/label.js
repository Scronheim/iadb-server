const {jsonResponse} = require('../utils')

const express = require('express')
const mongoose = require("mongoose")
const labelModel = require("../schemas/labelSchema")
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
        foreignField: 'label',
        as: 'bands'
      }
    },
  ])
  jsonResponse(res, response[0])
})

router.post('/api/label', (req, res) => {
  labelModel.create(req.body, function (err, response) {
    if (err) jsonResponse(res, null, err.errors, false)
    jsonResponse(res, response)
  })
})

module.exports = router
