import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    audioList: []
  },
  mutations: {
    addmusic (state, data) {
      state.audioList = data
    }
  },
  getters: {
  },
  actions: {

  },
  modules: {
  }
})
