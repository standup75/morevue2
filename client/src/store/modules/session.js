import pouch from '../../lib/pouch'

export default {
  state: {
    user: null,
  },
  mutations: {
    SESSION_SET_USER (state, { user } = {}) {
      state.user = user
    },
  },
  actions: {
    SESSION_CREATE ({ commit, dispatch }, { email, password }) {
      return new Promise((resolve, reject) => {
        pouch.sync(email, password).then(() => {
          if (pouch.authError) {
            reject(pouch.authError)
            return
          }
          commit('SESSION_SET_USER', { user: email })
          dispatch('TODO_SYNC')
          resolve()
        }).catch(reject)
      })
    },
    SESSION_DESTROY ({ commit }) {
      commit('SESSION_SET_USER')
      commit('TODO_SET')
      pouch.logout()
    },
  },
};
