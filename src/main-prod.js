import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import api from './common/api'
import { play } from './common/play'
import utils from './common/utils'

Vue.prototype.$http = api
Vue.prototype.$play = play

// 时间格式处理
Vue.prototype.$timeFilter = utils.timeFilter

// 播放数处理
Vue.prototype.$arrangement = utils.arrangement

// 将数字转成以万结尾
Vue.prototype.$convert = utils.convert

// 将毫秒转为分秒
Vue.prototype.$times = utils.times

// 获取年龄
Vue.prototype.$getAstro = utils.getAstro

// 歌词处理
Vue.prototype.$lyricsProcess = utils.lyricsProcess

// 歌词时间转化成秒
Vue.prototype.$formatTimeToSec = utils.formatTimeToSec

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
