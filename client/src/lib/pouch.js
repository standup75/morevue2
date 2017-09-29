import 'whatwg-fetch'

let Pouch, localDB, remoteDB, serviceUrl
let liveFinds = {}
let loginTryCount = 0
const MAX_RETRY = 3

export default {
  checkSession() {
    if (this.session) {
      return this.session
    }
    let dbInfo = window.localStorage.getItem('dbInfo')
    if (!dbInfo) { return null }
    dbInfo = JSON.parse(dbInfo)
    localDB = new Pouch(dbInfo.localDBName)
    remoteDB = new Pouch(dbInfo.remoteDBName)
    login(dbInfo)
    sync()
    return dbInfo.email
  },
  init(options) {
    Pouch = options.pouch
    serviceUrl = options.serviceUrl
    installSelectorReplicationPlugin()
  },
  sync(email, password) {
    return fetch(`${serviceUrl}/users`, { // eslint-disable-line
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({ email, password }),
    })
    .then(checkStatus)
    .then(response => response.json())
    .then((response) => {
      const dbInfo = {
        remoteDBName: `${response.dburl}/${response.dbname}`,
        localDBName: response.dbname,
        email,
        key: response.dbpwd,
      }
      window.localStorage.setItem('dbInfo', JSON.stringify(dbInfo))
      remoteDB = new Pouch(`${response.dburl}/${response.dbname}`)
      localDB = new Pouch(response.dbname)
      return remoteDB.login(email, response.dbpwd)
    })
    .then(() => {
      console.log(0)
      this.session = email
      sync()
      console.log(1)
    })
    .catch((error) => {
      this.logout()
      this.authError = error
    })
  },
  put(object, options) { commit('put', object, options) },
  remove(object, options) { commit('remove', object, options) },
  get(object, options) { commit('get', object, options) },
  logout() {
    this.session = null
    this.authError = null
    Object.values(liveFinds).forEach((lf) => { lf.cancel() })
    window.localStorage.removeItem('dbInfo')
    remoteDB.logout()
    liveFinds = {}
  },
  listenUpdates(docType, onUpdate, query = {}) {
    query.selector = query.selector || {}
    const { selector, sort, skip, limit } = query
    selector.type = docType
    if (liveFinds[docType]) liveFinds[docType].cancel()
    liveFinds[docType] = localDB.liveFind({
      selector,
      sort,
      skip,
      limit,
      aggregate: true,
    }).on('update', (update, aggregate) => {
      onUpdate(aggregate)
    })
  },
  session: null,
  errors: {},
  authError: null,
}

function sync() {
  Pouch.sync(localDB, remoteDB, { live: true, retry: true })
  .on('paused', () => {
    console.log('sync paused callback')
  })
  .on('active', () => {
    console.log('sync active callback')
  })
  .on('denied', () => {
    console.log('sync denied callback')
  })
  .on('complete', () => {
    console.log('sync complete callback')
  })
  .on('error', () => {
    console.log('sync error callback')
  })
}

function commit(method, object, options = {}) {
  if (!object.type) {
    return console.error(`${method}: object needs a type`, object)
  }
  console.log('object, options', object, options, localDB, method)
  return localDB[method](object, options)
}

function login(dbInfo) {
  return remoteDB.login(dbInfo.email, dbInfo.key).then((res) => {
    loginTryCount = 0
    console.log('res', res)
  }).catch((err) => {
    if (loginTryCount++ < MAX_RETRY) {
      setTimeout(() => {
        login(dbInfo)
      }, 300)
    } else {
      console.log('err', err)
    }
  })
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

function installSelectorReplicationPlugin() {
  // This plugin enables selector-based replication
  Pouch.plugin((pouch) => {
    const oldReplicate = pouch.replicate
    pouch.replicate = (source, target, repOptions) => {
      const sourceAjax = source._ajax
      source._ajax = (ajaxOps, callback) => {
        if (ajaxOps.url.includes('_selector')) {
          ajaxOps.url = ajaxOps.url.replace('filter=_selector%2F_selector', 'filter=_selector')
          ajaxOps.method = 'POST'
          ajaxOps.body = {
            selector: repOptions.selector,
          }
        }
        return sourceAjax(ajaxOps, callback)
      }
      return oldReplicate(source, target, repOptions)
    }
  })
}
