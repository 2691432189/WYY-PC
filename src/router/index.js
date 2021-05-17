import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../components/index.vue'
import DiscoverMusic from '../components/index/discoverMusic/discoverMusic.vue' // 发现音乐
import Video from '../components/index/video/video.vue' // 视频
import PrivateFM from '../components/index/privateFM/privateFM.vue' // 私人FM
import Anchor from '../components/index/anchor/anchor.vue' // 直播
import DetailsPage from '../components/index/detailsPage/detailsPage.vue' // 详情页
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Index,
    children: [
      { path: '/DiscoverMusic', component: DiscoverMusic },
      { path: '/Video', component: Video },
      { path: '/PrivateFM', component: PrivateFM },
      { path: '/Anchor', component: Anchor },
      { path: '/DetailsPage*', component: DetailsPage }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
