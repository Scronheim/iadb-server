const {jsonResponse} = require('../utils')

const express = require('express')
const peopleModel = require("../schemas/peopleSchema")
const bandModel = require("../schemas/bandSchema");
const router = new express.Router()

router.route('/api/people')
  .get(async (req, res) => {
    if (req.query.search) {
      const response = await peopleModel.find({name: {$regex: req.query.search, $options: 'i'}})
      jsonResponse(res, response)
    } else {
      jsonResponse(res)
    }
  })
  .post((req, res) => {
    peopleModel.create(req.body, function (err, response) {
      if (err) jsonResponse(res, null, err.errors, false)
      jsonResponse(res, response)
    })
  })
  .patch((req, res) => {
    peopleModel.findOneAndUpdate({_id: req.body._id}, req.body).then((response) => {
      jsonResponse(res, response)
    })
  })

router.route('/api/people/band')
  .post((req, res) => {
    peopleModel.findById(req.body.personId, function (err, person) {
      person.bandIds.push(req.body.bandId)
      person.save()
      jsonResponse(res, person)
    })
  })
  .delete(async (req, res) => {
    peopleModel.findById(req.body.personId, function (err, person) {
      const index = person.bandIds.indexOf(req.body.bandId)
      person.bandIds.splice(index, 1)
      person.save()
      jsonResponse(res, person)
    })
  })

module.exports = router
