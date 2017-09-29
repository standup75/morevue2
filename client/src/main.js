import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource';
import VueNotifications from 'vue-notifications'
import notie from 'notie'
import PouchDB from 'pouchdb-browser'
import pouchDBFind from 'pouchdb-find'
import pouchDBLiveFind from 'pouchdb-live-find'
import pouchDBAuthentication from 'pouchdb-authentication'
import pouch from './lib/pouch'
import initStore from './store'
import App from './App'
import Home from './components/Home'
import Login from './components/session/Login'
import Forgot from './components/session/Forgot'
import Update from './components/session/Update'
import CreateDoc from './components/CreateDoc'

// Setup notifications
function toast({ type, message, timeout }) {
  return notie.alert(type, message, timeout / 1000)
}
const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast,
}

PouchDB.plugin(pouchDBFind)
PouchDB.plugin(pouchDBLiveFind)
PouchDB.plugin(pouchDBAuthentication)
pouch.init({
  pouch: PouchDB,
  serviceUrl: SERVICE_URL, // eslint-disable-line
})

Vue.use(VueNotifications, options)
Vue.use(VueResource);
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.http.options.root = SERVICE_URL; // eslint-disable-line
Vue.http.options.credentials = true;

new Vue({ // eslint-disable-line
  el: '#app',
  template: '<App/>',
  store: initStore(),
  router: new VueRouter({
    routes: [
      { path: '/', component: Home },
      { path: '/login', component: Login },
      { path: '/forgot', component: Forgot },
      { path: '/update', component: Update },
      { path: '/createDoc', component: CreateDoc },
    ],
  }),
  created() {
    const user = pouch.checkSession()
    if (user) {
      this.$store.commit('SESSION_SET_USER', { user })
      this.$store.dispatch('TODO_SYNC')
    }
  },
  components: { App },
})
