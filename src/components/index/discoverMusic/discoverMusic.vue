<template>
  <div>
    <el-menu
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
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu{
  border-bottom: 0px !important;
}
</style>
