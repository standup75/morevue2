const couch = require('../../couch')
const config = require('../../config')
const utils = require('../../utils')
const base = require('../../baseModel')
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  createdAt: Date,
  updatedAt: Date,
  email: {
    type: String,
    required: true,
    unique: true
  },
  salt: String,
  hash: String,
  dbpwd: String,
  dbname: String,
  dburl: {
    type: String,
    default: config.couchDB.url,
  },
})

userSchema.statics.signup = function(user) {
  return new Promise((resolve, reject) => {
    if (!user.password.match(/^[\w\W]{5,10}$/)) {
      reject({
        message: 'Password must be between 5 and 10 chars',
        field: 'password',
      })
    } else {
      utils.hash(user.password, (err, salt, hash) => {
        if (err) {
          reject(err)
        } else {
          user.hash = hash
          user.salt = salt
          user.dbpwd = utils.randomString(10);
          const res = couch.createDB(user)
          res.then(() => {
            User.create(user, (err, user) => {
              if (err || !user) {
                reject(err || 'unknown error while creating user')
              } else {
                resolve(user)
              }
            })
          }).catch(reject)
        }
      })
    }
  })
}

userSchema.methods.isValidPassword = function(password) {
  return new Promise((resolve, reject) => {
    utils.hash(password, this.salt, (err, hash) => {
      if (err) {
        reject(err)
      } else if (hash.toString() === this.hash) {
        resolve(this)
      } else {
        reject({
          message: 'Incorrect password',
          field: 'password'
        }, false)
      }
    })
  })
}

userSchema.methods.updatePassword = function(newPassword, callback) {
  utils.hash(newPassword, (err, salt, hash) => {
    if (err) {
      callback(err)
    } else {
      this.hash = hash
      this.salt = salt
      this.save(callback)
    }
  })
}

userSchema.methods.newRandomPassword = function(callback) {
  const newPassword = utils.randomString(5)
  this.updatePassword(newPassword, err => {
    callback(err, err ? null : newPassword)
  })
}

userSchema.pre('save', next => {
  if (!this.createdAt) {
    this.createdAt = this.updatedAt = new Date
  } else {
    this.updatedAt = new Date
  }
  next()
})

userSchema.statics.publicFields = [ 'email', 'roles', 'dbpwd', 'dbname', 'dburl' ]
userSchema.statics.names = {
  singular: 'user',
  plural: 'users'
}
const User = base(userSchema)
module.exports = User
