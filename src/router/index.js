import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../components/index.vue'
import DiscoverMusic from '../components/index/discoverMusic/discoverMusic.vue' // 发现音乐
import Video from '../components/index/video/video.vue' // 视频
import PrivateFM from '../components/index/privateFM/privateFM.vue' // 私人FM
import Anchor from '../components/index/anchor/anchor.vue' // 直播
import DetailsPage from '../components/index/detailsPage/detailsPage.vue' // 详情页
import PersonalRecommendation from '../components/index/discoverMusic/PersonalRecommendation/PersonalRecommendation.vue' // 个性推荐
import SongList from '../components/index/discoverMusic/songList/songList.vue' // 歌单
import RadioStation from '../components/index/discoverMusic/RadioStation/RadioStation.vue'// 主播电台
import Leaderboard from '../components/index/discoverMusic/Leaderboard/Leaderboard.vue'// 排行榜
import Singer from '../components/index/discoverMusic/singer/singer.vue' // 歌手
import LatestMusic from '../components/index/discoverMusic/LatestMusic/LatestMusic.vue'// 最新音乐
Vue.use(VueRouter)

const routes = [
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
          { path: '/DiscoverMusic/RadioStation', component: RadioStation }, // 主播电台
          { path: '/DiscoverMusic/Leaderboard', component: Leaderboard }, // 排行榜
          { path: '/DiscoverMusic/Singer', component: Singer }, // 歌手
          { path: '/DiscoverMusic/LatestMusic', component: LatestMusic } // 最新音乐
        ]
      },
      // 视频
      { path: '/Video', component: Video },
      // 私人FM
      { path: '/PrivateFM', component: PrivateFM },
      // 直播
      { path: '/Anchor', component: Anchor },
      // 详情页
      { path: '/DetailsPage*', component: DetailsPage }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
