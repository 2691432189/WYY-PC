import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    audioList: [],
    songIndex: {}
  },
  mutations: {
    addmusic (state, data) {
      state.audioList = data
    },
    pushMusic (state, data) {
      state.audioList.unshift(data)
    },
    changeSongIndex (state, data) {
      state.songIndex = data
    }
  },
  getters: {
  },
  actions: {

  },
  modules: {
  }
})
