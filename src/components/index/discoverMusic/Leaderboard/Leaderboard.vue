<template>
  <div class="mainBody">
    <!-- 歌单 -->
    <el-row
      :gutter="80"
      type="flex"
      class="reCommendedPlay"
    >
      <el-col
        :span="6"
        v-for="item in leaderboardList"
        :key="item.id"
      >
        <div>
          <el-image
            style="width: 100%; height: 80%; border-radius: 10px"
            :src="item.coverImgUrl+'?param=160y160'"
          />
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
    <!-- 歌单 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 排行榜列表
      leaderboardList: []
    }
  },
  methods: {
    // 获取排行榜列表方法
    async getLeaderboardList () {
      const { data: res } = await this.$http.getLeaderboardList()
      if (res.code !== 200) return this.$message.error('获取排行榜失败')
      this.leaderboardList = res.list
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

<style lang="less" scoped>
// 歌单
.reCommendedPlay {
  flex-wrap: wrap;
  // 歌单名
  .el-col{
    margin-top: 30px;
    .reCommendedPlayName {
      margin-bottom: 20px;
      font-size: 13px;
      // 鼠标变小手
      cursor:pointer;
      // 多行溢出隐藏
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    div:nth-child(1) {
      // 鼠标变小手
      cursor:pointer;
      position: relative;
      // 图片遮罩层
      i {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 98%;
        border-radius: 8px;
        background-color: rgba(#000, .3);
        z-index: 10;
        text-align: center;
        line-height: 220px;
        color: rgb(230, 230, 230);
        font-size: 50px;
        opacity: 0;
        transition: all .5s;
      }
      &:hover i {
        opacity: 1;
      }
    }
  }
}
</style>
