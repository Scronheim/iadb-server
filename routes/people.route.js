const {jsonResponse} = require('../utils')

const express = require('express')
const peopleModel = require('../models/people.model')
const albumModel = require('../models/album.model')
const bandModel = require('../models/band.model')
const {authJwt} = require('../middlewares')

const ObjectId = require('mongoose').Types.ObjectId

const router = new express.Router()

router.get('/api/person/id/:id', async (req, res) => {
  const response = await peopleModel.aggregate([
    {
      $match: {
        _id: ObjectId(req.params.id)
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
      $lookup: {
        from: 'bands',
        localField: '_id',
        foreignField: 'lineUpIds',
        as: 'bands'
      }
    },
    {$unwind: '$country'}
  ])
  jsonResponse(res, response[0])
})

router.route('/api/people')
  .get(async (req, res) => {
    if (req.query.search) {
      const response = await peopleModel.find({name: {$regex: req.query.search, $options: 'i'}})
      jsonResponse(res, response)
    } else {
      jsonResponse(res)
    }
  })
  .post([authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
    peopleModel.create(req.body, function (err, response) {
      if (err) jsonResponse(res, null, err.errors, false)
      jsonResponse(res, response)
    })
  })
  .patch([authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
    peopleModel.findOneAndUpdate({_id: req.body._id}, req.body).then((response) => {
      jsonResponse(res, response)
    })
  })

router.route('/api/people/band')
  .post([authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
    bandModel.findById(req.body.bandId, function (err, band) {
      band.lineUpIds.push(ObjectId(req.body.personId))
      band.save()
      jsonResponse(res, band)
    })
  })
  .delete([authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
    bandModel.findById(req.body.bandId, function (err, band) {
      const index = band.lineUpIds.indexOf(req.body.personId)
      band.lineUpIds.splice(index, 1)
      band.save()
      jsonResponse(res, band)
    })
  })

router.route('/api/people/album')
  .post([authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
    albumModel.findById(req.body.albumId, function (err, album) {
      if (err) jsonResponse(res, null, err.errors, false)
      album.lineUpIds.push(ObjectId(req.body.personId))
      album.save()
      jsonResponse(res, album)
    })
  })
  .delete([authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
    albumModel.findById(req.body.albumId, function (err, album) {
      const index = album.lineUpIds.indexOf(req.body.personId)
      album.lineUpIds.splice(index, 1)
      album.save()
      jsonResponse(res, album)
    })
  })


module.exports = router
