<template>
  <div>
    <div>
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
            @click="playMusic(item.targetId)"
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
          :span="4"
          v-for="item in ReCommendedPlaylist"
          :key="item.id"
        >
          <div>
            <el-image
              style="width: 100%; height: 80%; border-radius: 10px"
              :src="item.picUrl+'?param=100y100'"
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
          @dblclick="playMusic(item.id)"
        >
          <el-image
            style="width: 60px; border-radius: 10px"
            :src="item.picUrl+'?param=80y80'"
            @dblclick="playMusic(item.id)"
          />
          <div
            class="newMusicUserInFo"
            @dblclick="playMusic(item.id)"
          >
            <div>{{ item.name }}</div>
            <div>
              {{ item.song.artists[0].name }}
              <span
                id="MvIcon"
                v-if="item.song.mvid!==0"
                @click="playMv(item.song.mvid)"
              >
                MV
              </span>
            </div>
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
      const { data: res } = await this.$http.getCarouselList()
      if (res.code !== 200) return this.$message.error('获取banner图失败')
      this.carouselList = res.banners
    },
    // 获取推荐歌单列表方法
    async getReCommendedPlaylist () {
      const { data: res } = await this.$http.getReCommendedPlaylist()
      if (res.code !== 200) return this.$message.error('获取推荐歌单失败')
      this.ReCommendedPlaylist = res.result
    },
    // 跳转歌单详情页
    goInfoPage (id) {
      this.$router.push('/DetailsPage*/' + id)
    },
    // 获取推荐新音乐列表方法
    async  getNewMusicList () {
      const { data: res } = await this.$http.getNewMusicList()
      if (res.code !== 200) return this.$message.error('获取推荐新音乐失败')
      this.NewMusicList = res.result
    },
    // 播放音乐
    async playMusic (id) {
      // 判断id是否合法
      if (id === 0) return this.$message.error('当前暂无音乐哦~')
      this.$play(this, [{ id }])
        .then((res) => {
          // 判断响应数据是否合法
          if (res.musicUrlList.length === 0) return this.$message.error('当前暂无音乐哦~')
          this.$store.commit('pushMusic', res.musicUrlList[0])
          this.$store.commit('changeSongIndex', {
            index: 0,
            random: Math.random()
          })
        })
    },
    // 跳转MV播放页
    playMv (id) {
      this.$router.push('/VideoPlayerPage/' + id + '/' + 'Mv')
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
.el-carousel {
  margin: 30px auto 0;
  max-width: 1100px;
}
// 最新音乐
.newMusicTab {
  margin-top: 20px;
}
.newMusic {
  transform: translateX(50px);
  padding-bottom: 20px;
  .el-col {
    margin: 40px 44px 0 0;
    height: 60px;
    position: relative;
    border-radius: 10px;
    // 鼠标变小手
    cursor:pointer;
    .newMusicUserInFo {
      position: absolute;
      top: 5px;
      left: 70px;
      width: 100%;
      >div {
        width: 80%;
        // 文字溢出隐藏
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      :nth-child(1) {
        margin-bottom: 8px;
        font-size: 14px;
        color: rgb(71, 71, 71);
      }
       :nth-child(2) {
        margin-bottom: 8px;
        font-size: 12px;
        color: rgb(122, 122, 122);
      }
    }
    &:hover {
      background-color: #eaeaea;
    }
  }
}
</style>
