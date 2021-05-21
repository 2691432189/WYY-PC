<template>
  <div>
    <el-menu
      :default-active="sidebarIndex"
      class="el-menu-demo"
      mode="horizontal"
      :router="true"
    >
      <el-menu-item index="/DiscoverMusic/PersonalRecommendation">
        个性推荐
      </el-menu-item>
      <el-menu-item index="/DiscoverMusic/SongList">
        歌单
      </el-menu-item>
      <el-menu-item index="/DiscoverMusic/Leaderboard">
        排行榜
      </el-menu-item>
    </el-menu>
    <router-view />
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 侧边栏索引
      sidebarIndex: ''
    }
  },
  methods: {
    // 储存侧边栏索引，防止刷新
    select (index) {
      localStorage.setItem('DiscoverMusicPageIndex', index)
    },
    // 获取侧边栏索引
    getSidebarIndex () {
      this.sidebarIndex = localStorage.getItem('DiscoverMusicPageIndex')
    }
  },
  created () {
    // 调用获取侧边栏索引方法
    this.getSidebarIndex()
  },
  updated () {
    // 调用储存侧边栏索引方法
    this.select(this.$route.path)
    // 调用获取侧边栏索引方法
    this.getSidebarIndex()
  }
}
</script>

<style lang="less" scoped>
.el-menu{
  border-bottom: 0px !important;
}
</style>
