import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../components/index.vue'
import DiscoverMusic from '../components/index/discoverMusic/discoverMusic.vue' // 发现音乐
import Video from '../components/index/video/video.vue' // 视频
import PrivateFM from '../components/index/privateFM/privateFM.vue' // 私人FM
import Anchor from '../components/index/anchor/anchor.vue' // 直播
import DetailsPage from '../components/index/detailsPage/detailsPage.vue' // 歌单详情页
import PersonalRecommendation from '../components/index/discoverMusic/PersonalRecommendation/PersonalRecommendation.vue' // 个性推荐
import SongList from '../components/index/discoverMusic/songList/songList.vue' // 歌单
import Leaderboard from '../components/index/discoverMusic/Leaderboard/Leaderboard.vue'// 排行榜
import Search from '../components/index/search/search.vue' // 搜索页
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
      // 私人FM
      { path: '/PrivateFM', component: PrivateFM },
      // 直播
      { path: '/Anchor', component: Anchor },
      // 歌单详情页
      { path: '/DetailsPage*/:id', component: DetailsPage, props: true },
      // 搜索页
      { path: '/Search/:info', component: Search, props: true }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
