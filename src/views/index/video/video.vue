<template>
  <div
    id="video"
    class="video"
  >
    <!-- 回到顶部 -->
    <el-backtop
      target=".video"
      style="right: 6vh; color:red;"
      :bottom="250"
      class="backtop"
    />
    <!-- 回到顶部 -->
    <div id="allvideo">
      全部视频
    </div>
    <!-- 热门分类 -->
    <div class="hotVideoSortNav">
      <div>
        <p>{{ currentSortCat }}</p>
        <i class="el-icon-arrow-right" />
      </div>
      <div>
        <a
          :class="{sortItem:'推荐'===currentSortCat}"
          href="javascript:;"
          @click="changeSort(null,'推荐')"
        >推荐</a>
        <a
          :class="{sortItem:item.name===currentSortCat}"
          href="javascript:;"
          v-for="(item, index) in hotVideoSortList"
          :key="index"
          @click="changeSort(item.id,item.name)"
        >{{ item.name }}</a>
      </div>
    </div>
    <!-- 热门分类 -->
    <!-- 视频列表 -->
    <el-row
      :gutter="80"
      type="flex"
      class="reCommendedPlay"
    >
      <el-col
        :span="4"
        v-for="item in videoList"
        :key="item.id"
      >
        <div>
          <el-image
            style="width: 100%; height: 80%; border-radius: 10px"
            :src="item.data.coverUrl+'?param=160y160'"
            fit="contain"
          />
          <!-- 播放数量 -->
          <div
            id="views"
            class="el-icon-caret-right"
          >
            {{ $arrangement(item.data.praisedCount) }}
          </div>
          <i
            class="el-icon-video-play"
            @click="playVideo(item.data.vid,item.data.title)"
          />
        </div>
        <div
          class="reCommendedPlayName"
          @click="playVideo(item.data.vid,item.data.title)"
        >
          {{ item.data.title }}
        </div>
      </el-col>
    </el-row>
    <!-- 视频列表 -->
    <div
      id="loadMore"
      @click="loadMoreVideo()"
    >
      加载更多...
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 热门歌单分类列表
      hotVideoSortList: [],
      // 当前分类
      currentSortCat: '推荐',
      // 当前分类id
      currentSortId: null,
      // 视频列表
      videoList: [],
      // 视频列表当前页
      videoListage: 0
    }
  },
  methods: {
    // 获取热门视频分类方法
    async  getHotVideoSort () {
      const { data: res } = await this.$http.getHotVideoSort()
      if (res.code !== 200) return this.$message.error('获取热门歌单分类失败')
      this.hotVideoSortList = res.data
    },
    // 获取视频列表方法
    async  getVideoList (id, page) {
      if (id === null) {
        const { data: res } = await this.$http.getVideoList(page)
        if (res.code !== 200) return this.$message.error('获取视频列表失败')
        if (res.datas.length === 0) return this.$message.error('暂无更多推荐')
        this.videoList = [...this.videoList, ...res.datas]
        this.currentSortId = null
        this.videoListage++
      } else {
        const { data: res } = await this.$http.getVideoGroupList(id, page)
        if (res.code !== 200) return this.$message.error('获取视频列表失败')
        if (res.datas.length === 0) return this.$message.error('暂无更多视频')
        this.videoList = [...this.videoList, ...res.datas]
        this.currentSortId = id
        this.videoListage++
      }
    },
    // 加载更多视频方法
    loadMoreVideo () {
      this.getVideoList(this.currentSortId, this.videoListage)
    },
    // 跳转视频播放页
    async  playVideo (id) {
      this.$router.push('/VideoPlayerPage/' + id)
    },
    // 切换分类
    changeSort (id, name) {
      if (name === this.currentSortCat) return this.$message.error(`已经在${name}分类了哦~`)
      this.videoList = []
      this.videoListage = 0
      this.currentSortCat = name
      this.getVideoList(id, this.videoListage)
    }
  },
  created () {
    // 调用获取热门视频分类方法
    this.getHotVideoSort()
    this.getVideoList(null, 0)
  }
}
</script>

<style lang="less" scoped>
#video {
  overflow: auto;
  min-height: 610px;
  height: 88%;
  padding: 0 80px;
}
#allvideo {
  font-size: 18px;
  font-weight: 700;
  margin: 20px 0 10px 0;
}
// 分类样式
.hotVideoSortNav {
  margin-bottom: 60px;
  margin-top: 30px;
  >:nth-child(1) {
    float: left;
    padding: 7px 15px;
    border: 1px #eaeaea solid;
    font-size: 14px;
    line-height: 14px;
    background-color: #f2f2f2;
    border-radius: 19px;
    p {
      display: inline;
    }
  }
  >:nth-child(2) {
    float: right;
    a {
      margin: 0 5px;
      font-size: 12px;
      color: #777777;
    }
    a:hover{
      color:rgb(20, 20, 20);
    }
  }
}
</style>
