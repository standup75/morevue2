const express = require('express')
const router = express.Router()
const utils = require('../../utils')
const User = require('./model')
const config = require('../../config')

router.post('/', (req, res) => {
  if (utils.checkParams(req, 'email', 'password')) {
    User.count({
      email: req.body.email
    }, (err, count) => {
      if (count === 0) {
        User.signup(req.body).then(user => {
          res.status(201).send(user)
        }).catch(err => {
          res.status(401).send(err || 'unknown error while signing up')
        })
      } else {
        User.findOne({ email: req.body.email }).exec((err, user) => {
          if (err) {
            res.status(500).send(err)
            return
          }
          user.isValidPassword(req.body.password).then(user => {
            res.status(200).send(user)
          }).catch(err => {
            res.status(401).send(err || 'unknown error while validating password')
          })
        })
      }
    })
  } else {
    res.sendStatus(401, 'email and/or password not found in body')
  }
})

router.put('/', (req, res) => {
  if (utils.checkParams(req, 'email', 'password', 'newPassword')) {
    const user = User.findOne({ email: req.body.email }).exec((err, user) => {
      if (err) {
        res.status(400).send('email not found')
      } else {
        if (user.isValidPassword(req.body.password)) {
          user.updatePassword(req.body.newPassword, err => {
            if (err) {
              res.status(500).send('error while updating password')
            } else {
              res.sendStatus(201)
            }
          })
        } else {
          res.status(401).send('bad password')
        }
      }
    })
  } else {
    res.status(400).send('bad params. Required: email, password, newPassword')
  }
})

router.post('/forgot', (req, res) => {
  if (utils.checkParams(req, 'email')) {
    const user = User.findOne({ email: req.body.email }).exec((err, user) => {
      if (err) {
        res.status(400).send('email not found')
      } else {
        user.newRandomPassword((err, newPassword) => {
          if (err) {
            res.status(500).send('error while generating new password')
          } else {
            utils.sendEmail({
              to: user.email,
              from: config.email.from,
              subject: 'Your new password',
              text: `You can now log in with ${newPassword}`
            }).then(() => {
              res.sendStatus(201)
            }).catch((err) => {
              console.log(`password for ${user.email} is now ${newPassword}`)
              res.status(500).send(`sendgrid error: ${err}`)
            })
          }
        })
      }
    })
  } else {
    res.send('bad params. Required: email, password, newPassword').status(400)
  }
})

module.exports = router
