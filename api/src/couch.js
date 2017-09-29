const config = require('./config')
const Slouch = require('couch-slouch')
const slouch = new Slouch(config.couchDB.url)

module.exports = {
  createDB(user) {
    user.dbname = `user_${config.couchDBBaseName}_${user.email}`.toLowerCase().replace(/@/g, '_').replace(/\./g, '-')
    const getAuthDB = (path = '') => nano({
      url: `${config.couchDB.url}${path}`,
      cookie: auth
    })
    return slouch.user.logIn(config.couchDB.username, config.couchDB.password)
      .then(() => slouch.user.create(user.email, user.dbpwd, [ user.email ]))
      .then(() => slouch.db.create(user.dbname))
      .then(() => slouch.security.onlyRoleCanView(user.dbname, user.email))
      .then(() => new Promise(resolve => resolve(user)))
  }
}

