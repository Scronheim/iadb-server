const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const db = require('./models')

db.mongoose.connect('mongodb://192.168.2.2/iadb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const app = express()
const router = new express.Router()

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))

app.use(cors())
app.use(fileUpload({ createParentPath: true }))

router.use(require('./routes/band.route'))
router.use(require('./routes/album.route'))
router.use(require('./routes/label.route'))
router.use(require('./routes/country.route'))
router.use(require('./routes/people.route'))
require('./routes/auth.route')(app)
require('./routes/user.route')(app)


app.use(router)

const port = process.env.PORT || 3000

app.listen(port, function () {
  console.log('Express server listening on port ' + port)
})
