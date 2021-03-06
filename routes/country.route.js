const {jsonResponse} = require('../utils')

const express = require('express')
const countryModel = require('../models/country.model')
const {authJwt} = require('../middlewares')
const router = new express.Router()

router.route('/api/country')
  .get(async (req, res) => {
    if (req.query.search) {
      const response = await countryModel.aggregate([
        {$match: {
            name: {$regex: `^${req.query.search}`, $options: 'i'}
          }},
      ])
      jsonResponse(res, response)
    } else {
      jsonResponse(res)
    }
  })
  .post([authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
    countryModel.create(req.body, function (err, response) {
      if (err) jsonResponse(res, null, err.errors, false)
      jsonResponse(res, response)
    })
  })
  .patch([authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
    countryModel.findOneAndUpdate({_id: req.body._id}, req.body).then((response) => {
      jsonResponse(res, response)
    })
  })

module.exports = router
