import Vuex from 'vuex'
import defaultState from './state/state'
import mutations from './mutations/mutations'
import getters from './getters/getters'
import actions from './actions/actions'

const store = new Vuex.Store({
  state: defaultState,
  mutations,
  getters,
  actions
})

export default store
