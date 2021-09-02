<template>
  <div>
    <!-- 用户 -->
    <div id="user">
      <!-- 头像 -->
      <div id="avatar">
        <img
          style="width: 40px;border-radius: 50%"
          :src="movingDatas.user.avatarUrl+'?param=60y60'"
        >
      </div>
      <div id="info">
        <!-- 昵称 -->
        <p>{{ movingDatas.user.nickname }}  <span>{{ type }}</span></p>
        <!-- 发布时间 -->
        <p>{{ $timeFilter(movingDatas.eventTime) }}</p>
      </div>
    </div>
    <!-- 分享歌单/动态 -->
    <div id="moving">
      <!-- 动态说明 -->
      <div
        id="text"
        v-html="movingJson.msg"
      />
      <!-- type 18 -->
      <div
        v-if="movingDatas.type===39"
        id="video"
      >
        <!-- 播放区 -->
        <div id="playArea">
          <video-player
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
          />
        </div>
      </div>
      <!-- type 57 -->
      <div v-if="movingDatas.type===57">
        <!-- 分享的歌曲 -->
        <div id="song">
          <el-image
            style="width: 60px; border-radius: 10px"
            :src="song.coverUrl+'?param=80y80'"
            @dblclick="playMusic(song.id)"
          />
          <div
            class="newMusicUserInFo"
            @dblclick="playMusic(song.id)"
          >
            <div>{{ song.albumName }}</div>
            <div>{{ song.artists[0].artistName }}</div>
          </div>
        </div>
        <!-- 分享的图片 -->
        <div id="image">
          <el-image
            v-for="(item, index) in image"
            :key="index"
            style="width: 100px; height: 100px;border-radius: 8px;"
            :src="item.imageUrl+'?param=100y100'"
            fit="cover"
            :preview-src-list="[item.imageUrl]"
          />
        </div>
      </div>
      <!-- type 18 -->
      <div v-if="movingDatas.type===18">
        <!-- 分享的歌曲 -->
        <div id="song">
          <el-image
            style="width: 60px; border-radius: 10px"
            :src="song.album.picUrl+'?param=80y80'"
            @dblclick="playMusic(song.id)"
          />
          <div
            class="newMusicUserInFo"
            @dblclick="playMusic(song.id)"
          >
            <div>{{ song.name }}</div>
            <div>{{ song.album.artists[0].name }}</div>
          </div>
        </div>
        <!-- 分享的图片 -->
        <div id="image">
          <el-image
            v-for="(item, index) in image"
            :key="index"
            style="width: 100px; height: 100px;border-radius: 8px;"
            :src="item.pcRectangleUrl+'?param=100y100'"
            fit="cover"
            :preview-src-list="[item.pcRectangleUrl]"
          />
        </div>
      </div>
      <!-- type 18 -->
      <div v-if="movingDatas.type===35">
        <!-- 分享的图片 -->
        <div id="image">
          <el-image
            v-for="(item, index) in image"
            :key="index"
            style="width: 100px; height: 100px;border-radius: 8px;"
            :src="item.pcRectangleUrl+'?param=100y100'"
            fit="cover"
            :preview-src-list="[item.pcRectangleUrl]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>// 导入视频组件
import { videoPlayer } from 'vue-video-player'
export default {
  name: 'Moving',
  props: {
    movingData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      // 动态详情
      movingJson: {},
      // 动态数据
      movingDatas: {
        user: {
          avatarUrl: ''
        },
        eventTime: 0
      },
      // 动态类型
      type: '',
      // 分享的图片
      image: [],
      // 分享的歌曲
      song: {
        artists: [{ artistName: '' }]
      },
      // 播放器配置
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
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
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true // 是否显示全屏按钮
        }
      }
    }
  },
  methods: {
    // 判断动态类型
    judgeType () {
      if (this.movingDatas.type === 35) {
        this.type = '发布动态'
        this.image = this.movingData.pics
      } else if (this.movingDatas.type === 57) {
        this.type = '发布动态'
        this.image = this.movingJson.resource.mlogDetail.content.image
        this.song = this.movingJson.resource.mlogDetail.content.song
      } else if (this.movingDatas.type === 18) {
        this.type = '分享单曲'
        this.image = this.movingData.pics
        this.song = this.movingJson.song
      } else if (this.movingDatas.type === 39) {
        this.type = '发布视频'
        this.playerOptions.poster = this.movingJson.video.coverUrl
        this.getVideoUrl()
      }
    },
    // 获取视频Url
    async getVideoUrl () {
      const { data: res } = await this.$http.getVideoUrl(this.movingJson.video.videoId)
      if (res.code !== 200) return this.$message.error('获取视频播放地址失败')
      this.playerOptions.sources[0].src = res.urls[0].url
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
    }
  },
  components: {
    videoPlayer
  },
  created () {
    this.movingDatas = this.movingData
    const dataJson = JSON.parse(this.movingData.json)
    dataJson.msg = dataJson.msg.replace(/\n/g, '<br>')
    this.movingJson = dataJson
    this.judgeType()
  }
}
</script>

<style lang="less" scoped>
  // 用户
  #user {
    // 头像
    #avatar {
      display: inline-block;
    }
    #info {
      display: inline-block;
      padding-left: 15px;
      // 昵称
      :nth-child(1) {
        color: #5380b1;
        font-size: 14px;
        span {
          color: #4b4b4b;
        }
      }
      // 发布时间
      :nth-child(2) {
        color: #6e6e6e;
        font-size: 12px;
      }
    }
  }
  #moving {
    padding-left: 55px;
    // 动态说明
    #text {
      padding: 15px 0 15px 0;
      box-sizing: border-box;
      color: #4b4b4b;
      font-size: 14px;
      line-height: 25px;
    }
    // 视频
    #video {
      width: 50%;
      border-radius: 8px;
      overflow: hidden;
    }

    #song {
      margin: 20px 0;
      height: 60px;
      position: relative;
      border-radius: 10px;
      background-color: #ebebeb;
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
        background-color: #c4c4c4;
      }
    }
    // 图片
    #image {
      width: 360px;
      .el-image {
        margin:0 20px 10px 0;
      }
    }
  }
</style>
