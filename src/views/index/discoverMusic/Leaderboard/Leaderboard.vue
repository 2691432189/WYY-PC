<template>
  <div>
    <!-- 官方榜 -->
    <div id="leaderboardNav">
      官方榜
    </div>
    <el-row
      :gutter="80"
      type="flex"
      class="reCommendedPlay"
    >
      <el-col
        :span="4"
        v-for="item in officialLeaderboard"
        :key="item.id"
      >
        <div>
          <el-image
            style="width: 100%; height: 80%; border-radius: 10px"
            :src="item.coverImgUrl+'?param=100y100'"
          />
          <!-- 播放数量 -->
          <div
            id="views"
            class="el-icon-caret-right"
          >
            {{ $arrangement(item.playCount) }}
          </div>
          <i
            class="el-icon-video-play"
            @click="goInfoPage(item.id)"
          />
        </div>
        <div
          class="reCommendedPlayName"
          @click="goInfoPage(item.id)"
        >
          {{ item.name }}
        </div>
      </el-col>
    </el-row>
    <!-- 官方榜 -->
    <!-- 全球榜 -->
    <div id="leaderboardNav">
      全球榜
    </div>
    <el-row
      :gutter="80"
      type="flex"
      class="reCommendedPlay"
    >
      <el-col
        :span="4"
        v-for="item in globalLeaderboard"
        :key="item.id"
      >
        <div>
          <el-image
            style="width: 100%; height: 80%; border-radius: 10px"
            :src="item.coverImgUrl+'?param=100y100'"
          />
          <!-- 播放数量 -->
          <div
            id="views"
            class="el-icon-caret-right"
          >
            {{ $arrangement(item.playCount) }}
          </div>
          <i
            class="el-icon-video-play"
            @click="goInfoPage(item.id)"
          />
        </div>
        <div
          class="reCommendedPlayName"
          @click="goInfoPage(item.id)"
        >
          {{ item.name }}
        </div>
      </el-col>
    </el-row>
    <!-- 全球榜 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 官方排行榜
      officialLeaderboard: [],
      // 全球排行榜
      globalLeaderboard: []
    }
  },
  methods: {
    // 获取排行榜列表方法
    async getLeaderboardList () {
      const { data: res } = await this.$http.getLeaderboardList()
      if (res.code !== 200) return this.$message.error('获取排行榜失败')
      this.officialLeaderboard = res.list.slice(0, 4)
      this.globalLeaderboard = res.list.slice(4, res.list.length)
    },
    // 跳转歌单详情页
    goInfoPage (id) {
      this.$router.push('/DetailsPage*/' + id)
    }
  },
  created () {
    // 调用获取排行榜列表方法
    this.getLeaderboardList()
  }
}
</script>

<style lang="less" >
  #leaderboardNav {
    padding-top: 20px;
    font-weight: 700;
    font-size: 18px;
  }
</style>
