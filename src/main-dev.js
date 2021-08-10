import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import api from '../common/api'
import { play } from '../common/play'

Vue.prototype.$http = api
Vue.prototype.$play = play

// 时间格式处理
Vue.prototype.$timeFilter = timestamp => {
  function format (number) {
    return number.toString().padStart(2, '0')
  }
  const date = new Date(Number.parseInt(timestamp, 10))
  const YYYY = date.getFullYear()
  const MM = date.getMonth() + 1
  const DD = date.getDate()
  return `${YYYY}-${format(MM)}-${format(DD)}`
}

// 侦听本地储存变化
Vue.prototype.$addStorageEvent = function (type, key, data) {
  var newStorageEvent = ''
  if (type === 1) {
  // 创建一个StorageEvent事件
    newStorageEvent = document.createEvent('StorageEvent')
    const storage = {
      setItem: function (k, val) {
        localStorage.setItem(k, val)
        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null)
        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, data)
  } else {
  // 创建一个StorageEvent事件
    newStorageEvent = document.createEvent('StorageEvent')
    const storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val)
        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null)
        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, data)
  }
}

// 将数字转成以万结尾
Vue.prototype.$convert = nums => {
  var num = nums * 1
  num = Number(num)
  if (num === 0) {
    return num + ''
  } else
  if (num > 1 && num < 10000) {
    return num + ''
  } else {
    return (num / 10000).toFixed(2) + '万'
  }
}

// 将毫秒转为分秒
Vue.prototype.$times = number => {
  number = number / 1000
  var minute = parseInt(number / 60)
  var second = parseInt(number % 60)
  if ((second + '').length !== 2) { second = second + '0' }
  return minute + ':' + second
}
// import 'vue-video-player/src/custom-theme.css'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
