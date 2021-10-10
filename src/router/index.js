import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const Index = () => import('../views/index.vue') // 起始页
const DiscoverMusic = () => import('../views/index/discoverMusic/discoverMusic.vue') // 发现音乐
const Video = () => import('../views/index/video/video.vue') // 视频
const VideoPlayerPage = () => import('../views/index/videoPlayerPage/videoPlayerPage.vue') // 视频播放页
const DetailsPage = () => import('../views/index/detailsPage/detailsPage.vue') // 歌单详情页
const PersonalRecommendation = () => import('../views/index/discoverMusic/PersonalRecommendation/PersonalRecommendation.vue') // 个性推荐
const SongList = () => import('../views/index/discoverMusic/songList/songList.vue') // 歌单
const Leaderboard = () => import('../views/index/discoverMusic/Leaderboard/Leaderboard.vue')// 排行榜
const Search = () => import('../views/index/search/search.vue') // 搜索页
const CloudDisk = () => import('../views/index/cloudDisk/cloudDisk.vue')// 音乐云盘
const UserInfo = () => import('../views/index//userInfo/userInfo.vue') //  用户信息
const MV = () => import('../views/index/mv/mv.vue') // MV

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
      { path: '/VideoPlayerPage/:id/:title', component: VideoPlayerPage, props: true },
      // 歌单详情页
      { path: '/DetailsPage*/:id', component: DetailsPage, props: true },
      // 搜索页
      { path: '/Search/:info', component: Search, props: true },
      // 音乐云盘
      { path: '/CloudDisk', component: CloudDisk },
      //  用户信息
      { path: '/UserInfo/:userId', component: UserInfo, props: true },
      // MV
      { path: '/Mv', component: MV }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.fullPath === '/Video' || to.fullPath === '/CloudDisk' || to.fullPath === '/Mv') {
    const login = window.localStorage.getItem('login')
    if (login) return next()
    next('/DiscoverMusic')
  } else if (to.fullPath !== from.fullPath) {
    next()
  }
})

export default router
