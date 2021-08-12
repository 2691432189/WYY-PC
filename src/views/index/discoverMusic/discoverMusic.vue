<template>
  <div
    id="discoverMusic"
    class="discoverMusic"
  >
    <!-- 回到顶部 -->
    <el-backtop
      target=".discoverMusic"
      style="right: 8vh; color:red;"
      :bottom="250"
      class="backtop"
    />
    <!-- 回到顶部 -->
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
    <router-view id="discoverMusicChildren" />
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
#discoverMusic {
  overflow: auto;
  min-height: 600px;
  height: 88%;
}
#discoverMusicChildren {
  padding: 0 80px;
  transform: translateX(-25px);
}
</style>
