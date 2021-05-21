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
      <h3>推荐歌单<i class="el-icon-arrow-right" /></h3>
      <el-row
        :gutter="80"
        type="flex"
        class="reCommendedPlay"
      >
        <el-col
          :span="6"
          v-for="item in ReCommendedPlaylist"
          :key="item.id"
        >
          <div>
            <el-image
              style="width: 100%; height: 80%; border-radius: 10px"
              :src="item.picUrl+'?param=200y200'"
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
      <!-- 推荐歌单 -->
      <!-- 最新音乐 -->
      <h3 class="newMusicTab">
        最新音乐<i class="el-icon-arrow-right" />
      </h3>
      <el-row
        class="newMusic"
      >
        <el-col
          :span="7"
          v-for="(item, index) in NewMusicList"
          :key="index"
          @dblclick="dblclickPlayMusic(item)"
        >
          <el-image
            style="width: 60px; border-radius: 10px"
            :src="item.picUrl+'?param=80y80'"
            @dblclick="dblclickPlayMusic(item)"
          />
          <div
            class="newMusicUserInFo"
            @dblclick="dblclickPlayMusic(item)"
          >
            <div>{{ item.name }}</div>
            <div>{{ item.song.artists[0].name }}</div>
          </div>
        </el-col>
      </el-row>
      <!-- 最新音乐 -->
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
      ReCommendedPlaylist: [],
      // 推荐新音乐列表
      NewMusicList: []
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
      const { data: res } = await this.$http.get('/personalized?limit=16')
      if (res.code !== 200) return this.$message.error('获取推荐歌单失败')
      this.ReCommendedPlaylist = res.result
    },
    // 跳转歌单详情页
    goInfoPage (id) {
      this.$router.push('/DetailsPage*/' + id)
    },
    // 获取推荐新音乐列表方法
    async  getNewMusicList () {
      const { data: res } = await this.$http.get('/personalized/newsong?limit=60')
      if (res.code !== 200) return this.$message.error('获取推荐新音乐失败')
      this.NewMusicList = res.result
    },
    // 双击播放音乐
    async dblclickPlayMusic (row) {
      const { data: res } = await this.$http.get('/song/url?id=' + row.id)
      if (res.code !== 200) return this.$message.error('获取音乐URL失败')
      var audio = {
        name: row.name,
        artist: row.song.artists[0].name,
        url: res.data[0].url,
        cover: row.picUrl + '?param=80y80'
      }
      window.localStorage.setItem('currentlyPlayingMusic', 0)
      this.$store.commit('pushMusic', audio)
      this.$addStorageEvent(1, 'butCountNum', true)
    }
  },
  created () {
    // 调用获取轮播图列表方法
    this.getCarouselList()
    // 调用获取推荐歌单列表方法
    this.getReCommendedPlaylist()
    // 调用获取推荐新音乐列表方法
    this.getNewMusicList()
  }
}
</script>

<style lang="less" scoped>
  // 推荐歌单
.reCommendedPlay{
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
    div:nth-child(1){
      // 鼠标变小手
      cursor:pointer;
      position: relative;
      // 图片遮罩层
      i{
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
// 最新音乐
.newMusicTab{
  margin-top: 20px;
}
.newMusic{
  .el-col{
    margin: 40px 44px 0 0;
    height: 60px;
    position: relative;
    border-radius: 10px;
    // 鼠标变小手
    cursor:pointer;
    .newMusicUserInFo{
      position: absolute;
      top: 5px;
      left: 70px;
      width: 100%;
      >div{
        width: 80%;
        // 文字溢出隐藏
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      :nth-child(1){
        margin-bottom: 8px;
        font-size: 14px;
        color: rgb(71, 71, 71);
      }
       :nth-child(2){
        margin-bottom: 8px;
        font-size: 12px;
        color: rgb(122, 122, 122);
      }
    }
    &:hover{
      background-color: #eaeaea;
    }
  }
}
</style>
