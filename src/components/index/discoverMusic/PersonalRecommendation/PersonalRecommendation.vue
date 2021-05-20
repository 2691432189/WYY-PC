<template>
  <div>
    <div class="mainBody">
      <!-- 轮播图 -->
      <el-carousel
        :interval="5000"
        type="card"
        height="200px"
      >
        <el-carousel-item
          v-for="item in carouselList"
          :key="item.imageUrl"
        >
          <el-image
            style="width: 100%; height: 100% ; border-radius: 15px"
            :src="item.imageUrl"
          />
        </el-carousel-item>
      </el-carousel>
      <!-- 轮播图 -->
      <!-- 推荐歌单 -->
      <h4>推荐歌单<i class="el-icon-arrow-right" /></h4>
      <el-row
        :gutter="80"
        type="flex"
        class="ReCommendedPlay"
      >
        <el-col
          :span="6"
          v-for="item in ReCommendedPlaylist"
          :key="item.id"
        >
          <el-image
            style="width: 100%; height: 80%; border-radius: 10px"
            :src="item.picUrl"
            @click="goInfoPage(item.id)"
          />
          <div
            class="reCommendedPlayName"
            @click="goInfoPage(item.id)"
          >
            {{ item.name }}
          </div>
        </el-col>
      </el-row>
      <!-- 推荐歌单 -->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 轮播图列表
      carouselList: [],
      // 推荐歌单列表
      ReCommendedPlaylist: []

    }
  },
  methods: {
    // 获取轮播图列表方法
    async getCarouselList () {
      const { data: res } = await this.$http.get('/banner?type=0')
      if (res.code !== 200) return this.$message.error('获取banner图失败')
      this.carouselList = res.banners
    },
    // 获取推荐歌单列表方法
    async getReCommendedPlaylist () {
      const { data: res } = await this.$http.get('/personalized?limit=8')
      if (res.code !== 200) return this.$message.error('获取推荐歌单失败')
      this.ReCommendedPlaylist = res.result
    },
    // 跳转歌单详情页
    goInfoPage (id) {
      this.$router.push('/DetailsPage*/' + id)
    }
  },
  created () {
    // 调用获取轮播图列表方法
    this.getCarouselList()
    // 调用获取推荐歌单列表方法
    this.getReCommendedPlaylist()
  }
}
</script>

<style lang="less" scoped>
  // 推荐歌单
  .ReCommendedPlay{
    flex-wrap: wrap;
    // 歌单名
    .el-col{
      margin-top: 30px;
      .reCommendedPlayName{
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
     .el-image{
      // 鼠标变小手
      cursor:pointer;
     }
    }

}
</style>
