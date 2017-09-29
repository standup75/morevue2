const express = require('express')
const config = require('./config')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')

function initApp() {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(allowCrossDomain)
  app.use('/users', require('./resources/users/router'))
  app.get('/', (req, res) => {
    res.send('Hashtag API server')
  })

  app.listen(config.port, () => {
    console.log(`Hashtag API server running on port ${config.port}`)
  })
}

function allowCrossDomain (req, res, next) {
  const origin = req.header('Origin')
  if (config.origins.indexOf(origin) > -1) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
  }
  next()
}

mongoose.Promise = global.Promise
mongoose.connect(config.db, {
  useMongoClient: true
}).then(()  => initApp())
  .catch(err => { throw err })

mongoose.connection.on("connected", function() {
  return console.log("Mongoose default connection open to " + config.db)
})

mongoose.connection.on("error", function(err) {
  return console.log("Mongoose default connection error: " + err)
})

mongoose.connection.on("disconnected", function() {
  return console.log("Mongoose default connection disconnected")
})

process.on("SIGINT", function() {
  return mongoose.connection.close(function() {
    console.log("Mongoose default connection disconnected through app termination")
    return process.exit(0)
  })
})
