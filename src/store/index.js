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
    },
    pushMusic (state, data) {
      state.audioList.unshift(data)
    }
  },
  getters: {
  },
  actions: {

  },
  modules: {
  }
})
