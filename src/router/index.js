import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index.vue'
import DiscoverMusic from '../views/index/discoverMusic/discoverMusic.vue' // 发现音乐
import Video from '../views/index/video/video.vue' // 视频
import VideoPlayerPage from '../views/index/videoPlayerPage/videoPlayerPage.vue' // 视频播放页
import DetailsPage from '../views/index/detailsPage/detailsPage.vue' // 歌单详情页
import PersonalRecommendation from '../views/index/discoverMusic/PersonalRecommendation/PersonalRecommendation.vue' // 个性推荐
import SongList from '../views/index/discoverMusic/songList/songList.vue' // 歌单
import Leaderboard from '../views/index/discoverMusic/Leaderboard/Leaderboard.vue'// 排行榜
import Search from '../views/index/search/search.vue' // 搜索页
import CloudDisk from '../views/index/cloudDisk/cloudDisk.vue' // 音乐云盘
import UserInfo from '../views/index//userInfo/userInfo.vue' //  用户信息
import MV from '../views/index/mv/mv.vue' // MV
import MvPlayerPage from '../views/index/mvPlayerPage/mvPlayerPage.vue' // MV播放页
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/DiscoverMusic' },
  {
    path: '/',
    component: Index,
    children: [
      // 发现音乐
      {
        path: '/DiscoverMusic',
        component: DiscoverMusic,
        children: [
          { path: '/DiscoverMusic', redirect: '/DiscoverMusic/PersonalRecommendation' },
          { path: '/DiscoverMusic/PersonalRecommendation', component: PersonalRecommendation }, // 个性推荐
          { path: '/DiscoverMusic/SongList', component: SongList }, // 歌单
          { path: '/DiscoverMusic/Leaderboard', component: Leaderboard } // 排行榜
        ]
      },
      // 视频
      { path: '/Video', component: Video },
      // 视频播放页
      { path: '/VideoPlayerPage/:videoId', component: VideoPlayerPage, props: true },
      // 歌单详情页
      { path: '/DetailsPage*/:id', component: DetailsPage, props: true },
      // 搜索页
      { path: '/Search/:info', component: Search, props: true },
      // 音乐云盘
      { path: '/CloudDisk', component: CloudDisk },
      //  用户信息
      { path: '/UserInfo/:userId', component: UserInfo, props: true },
      // MV
      { path: '/Mv', component: MV },
      // MV播放页
      { path: '/MvPlayerPage/:mvId', component: MvPlayerPage, props: true }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.fullPath === '/Video' || to.fullPath === '/CloudDisk') {
    const login = window.localStorage.getItem('login')
    if (login) return next()
    next('/DiscoverMusic')
    // this.$message.error('请登录')
  } else {
    next()
  }
})

export default router
