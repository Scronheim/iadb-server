const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const moment = require('moment')
const fileUpload = require('express-fileupload')
const axios = require('axios')
const mongoose = require('mongoose')
mongoose.connect('mongodb://192.168.2.2/iadb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.Promise = global.Promise
const mongo = mongoose.connection

mongo.on('error', function (err) {
  console.log(err)
})

const bandModel = require('./schemas/bandSchema')
const albumModel = require('./schemas/albumSchema')

const { jsonResponse } = require('./utils')

const app = express()
const router = new express.Router()

router.use(bodyParser.json({ limit: '50mb' }))
router.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))

app.use(cors())
app.use(fileUpload({ createParentPath: true }))

router.get('/api', async (req, res) => {
  if (req.query.band) {
    const regex = new RegExp(["^", req.query.band, "$"].join(""), "i")
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
  } else if (req.query.album) {
    const regex = new RegExp(["^", req.query.album, "$"].join(""), "i")
    const response = await albumModel.aggregate([
      {
        $match: {
          title: regex
        }
      },
      {
        $lookup: {
          from: 'bands',
          localField: 'bandId',
          foreignField: '_id',
          as: 'band'
        }
      }
    ])
    jsonResponse(res, response)
  } else {
    jsonResponse(res)
  }
})

router.post('/api/band', (req, res) => {
  bandModel.create(req.body, function (err, response) {
    if (err) jsonResponse(res, null, err.errors, false)
    jsonResponse(res, response)
  })
})

router.post('/api/album', (req, res) => {
  albumModel.create(req.body, function (err, response) {
    if (err) jsonResponse(res, null, err.errors, false)
    jsonResponse(res, response)
  })
})

app.use(router)

const port = process.env.PORT || 3000

app.listen(port, function () {
  console.log('Express server listening on port ' + port)
})