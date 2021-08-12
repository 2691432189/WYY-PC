import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 歌曲列表
    audioList: [],
    // 歌曲索引
    songIndex: {}
  },
  mutations: {
    // 更改歌曲列表
    addmusic (state, data) {
      state.audioList = data
    },
    // 向歌曲列表添加歌曲
    pushMusic (state, data) {
      state.audioList.unshift(data)
    },
    // 更改歌曲索引
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
