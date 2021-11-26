const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')
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

const app = express()
const router = new express.Router()

router.use(bodyParser.json({ limit: '50mb' }))
router.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))

app.use(cors())
app.use(fileUpload({ createParentPath: true }))

router.use(require('./routes/band'))
router.use(require('./routes/album'))
router.use(require('./routes/label'))
router.use(require('./routes/country'))
router.use(require('./routes/people'))


app.use(router)

const port = process.env.PORT || 3000

app.listen(port, function () {
  console.log('Express server listening on port ' + port)
})
