import pouch from '../../lib/pouch'

export default {
  state: {
    all: [],
  },
  mutations: {
    TODO_SET (state, { todos } = {}) {
      state.all = todos
    },
  },
  actions: {
    TODO_ADD (noop, { todo }) {
      todo._id = todo._id || `${Date.now()}`
      todo.type = 'todos'
      pouch.put(todo)
    },
    TODO_REMOVE (noop, { todo }) {
      pouch.remove(todo)
    },
    TODO_SYNC ({ commit }) {
      pouch.listenUpdates('todos', (todos) => {
        commit('TODO_SET', { todos })
      })
    },
  },
};
