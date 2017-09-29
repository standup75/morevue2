import Vuex from 'vuex'
import sessionModule from './modules/session'
import todoModule from './modules/todo'

export default function initStore() {
  return new Vuex.Store({
    modules: {
      session: sessionModule,
      todo: todoModule,
    },
  })
}
