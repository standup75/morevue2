const sendgrid = require('sendgrid')
const crypto = require("crypto")

module.exports = {
  hash: (() => {
    const iterations = 12000
    const len = 128
    return (pwd, salt, fn) => {
      if (fn) {
        return crypto.pbkdf2(pwd, salt, iterations, len, 'sha1', fn)
      } else {
        fn = salt
        return crypto.randomBytes(len, (err, salt) => {
          if (err) {
            return fn(err)
          }
          salt = salt.toString("base64")
          return crypto.pbkdf2(pwd, salt, iterations, len, 'sha1', (err, hash) => {
            if (err) {
              return fn(err)
            }
            return fn(null, salt, hash)
          })
        })
      }
    }
  })(),
  randomString(len) {
    const buf = []
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"
    const charlen = chars.length
    let i = 0
    while (i < len) {
      buf.push(chars[getRandomInt(0, charlen - 1)])
      ++i
    }
    return buf.join("")
  },
  checkParams(req, ...params) {
    return params.filter(param => req.body[param]).length === params.length
  },
  sendEmail(email) {
    return new Promise((resolve, reject) => {
      if (!process.env.SENDGRID_API_KEY) {
      return reject('no sendgrid available')
      }
      const helper = sendgrid.mail
      const fromEmail = new helper.Email(email.from)
      const toEmail = new helper.Email(email.to)
      const content = new helper.Content('text/plain', email.text)
      const mail = new helper.Mail(fromEmail, email.subject, toEmail, content)
      const sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
      const request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
      })

      sg.API(request, function(error, response) {
        if (error) {
          reject(error)
        } else {
          resolve(response)
        }
      })
    })
  },
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
