<template>
  <div class="mainBody">
    <!-- 热门分类 -->
    <div class="hotVideoSortNav">
      <div>
        <p>{{ cideoSortCat }}</p>
        <i class="el-icon-arrow-right" />
      </div>
      <div>
        <a
          href="javascript:;"
          @click="getVideoList(null,'全部')"
        >全部</a>
        <a
          href="javascript:;"
          v-for="(item, index) in hotVideoSortList"
          :key="index"
          @click="getVideoList(item.id,item.name)"
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
        :span="6"
        v-for="item in videoList"
        :key="item.id"
      >
        <div>
          <el-image
            style="width: 100%; height: 80%; border-radius: 10px"
            :src="item.data.coverUrl+'?param=160y160'"
            fit="contain"
          />
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
    <!-- 分页 -->
    <el-pagination
      layout="prev, pager, next"
      :total="1000"
      :page-size="8"
      :current-page="videoListage"
      @current-change="videoListCurrentChange"
    />
    <!-- 分页 -->
    <!-- 视频播放弹出框 -->
    <el-dialog
      :title="videoTitle"
      :visible.sync="dialogTableVisible"
      @close="close"
    >
      <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
      />
    </el-dialog>
    <!-- 视频播放弹出框 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 热门歌单分类列表
      hotVideoSortList: [],
      // 当前分类
      cideoSortCat: '全部',
      // 当前分类id
      cideoSortId: 1,
      // 视频列表
      videoList: [],
      // 视频列表当前页
      videoListage: 1,
      // 是否显示视频播放弹出框
      dialogTableVisible: false,
      // 视频组件设置
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: true, // 是否视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'video/mp4', // 类型
          src: '' // url地址
        }],
        poster: '', // 封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: true, // 是否显示剩余时间功能
          fullscreenToggle: true // 是否显示全屏按钮
        }
      },
      // 当前播放视频标题
      videoTitle: ''
    }
  },
  methods: {
    // 获取热门视频分类方法
    async  getHotVideoSort () {
      const { data: res } = await this.$http.get('/video/category/list')
      if (res.code !== 200) return this.$message.error('获取热门歌单分类失败')
      this.hotVideoSortList = res.data
    },
    // 获取视频列表方法
    async  getVideoList (id, cat, page) {
      if (id === null) {
        const { data: res } = await this.$http.get(`/video/timeline/all?offset=${(page - 1) * 40 || 0}`)
        if (res.code !== 200) return this.$message.error('获取视频列表失败')
        this.videoList = res.datas
        this.cideoSortId = null
      } else {
        const { data: res } = await this.$http.get(`/video/group?id=${id}&offset=${(page - 1) * 40 || 0}`)
        if (res.code !== 200) return this.$message.error('获取视频列表失败')
        this.videoList = res.datas
        this.cideoSortId = id
      }
      this.cideoSortCat = cat
    },
    // 翻页方法
    videoListCurrentChange (page) {
      this.getVideoList(this.cideoSortId, this.cideoSortCat, page)
    },
    // 播放视频方法
    async  playVideo (id, title) {
      const { data: res } = await this.$http.get(`/video/url?id=${id}`)
      if (res.code !== 200) return this.$message.error('获取视频播放地址失败')
      this.dialogTableVisible = true
      this.videoTitle = title
      this.playerOptions.sources[0].src = res.urls[0].url
    },
    // 视频播放弹出框
    close () {
      this.playerOptions.sources[0].src = ''
    }
  },
  created () {
    // 调用获取热门视频分类方法
    this.getHotVideoSort()
    this.getVideoList(null, '全部')
  }
}
</script>

<style lang="less" scoped>
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
