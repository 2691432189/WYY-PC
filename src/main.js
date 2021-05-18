import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'

import APlayer from '@moefe/vue-aplayer'

// 导入axios包
import axios from 'axios'

Vue.use(APlayer, {
  defaultCover: 'https://github.com/u3u.png',
  productionTip: true
})

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.withCredentials = true // 若跨域请求需要带 cookie 身份识别
// 请求拦截向请求头中添加token验证信息
// axios.interceptors.request.use(fig => {
//   fig.headers.Authorization = window.sessionStorage.getItem('token')
//   return fig
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
