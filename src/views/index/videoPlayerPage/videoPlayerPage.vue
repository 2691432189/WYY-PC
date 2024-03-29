<template>
  <div id="videoPlayerPage">
    <div id="videoPlayerPageMain">
      <!-- 视频播放器页面左  -->
      <div id="videoPlayerPageLeft">
        <!-- 返回至父页面 -->
        <div id="returnVideoPage">
          <span @click="returnVideoPage()">
            <i class="el-icon-arrow-left" /> {{ title }}
          </span>
        </div>
        <!-- 播放区 -->
        <div id="playArea">
          <video-player
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
          />
        </div>
        <!-- 视频信息 -->
        <div id="videoInfo">
          <!-- 用户信息  -->
          <div id="userInfo">
            <span id="avatar">
              <el-image
                style="width: 40px; height: 40px; border-radius: 40px;vertical-align: middle"
                :src="title === '视频' ? videoInfo.creator.avatarUrl : videoInfo.cover + '?param=40y40'"
                fit="cover"
              />
            </span>
            <span id="userName">
              {{ title === '视频' ? videoInfo.creator.nickname :videoInfo.artistName }}
            </span>
          </div>
          <!-- 标题 -->
          <div id="title">
            {{ title === '视频' ? videoInfo.title : videoInfo.name }}
          </div>
          <!-- 时间 -->
          <div id="time">
            发布：{{ $timeFilter(videoInfo.publishTime) }}
          </div>
          <!-- 标签 -->
          <div id="tag">
            标签：
            <span
              v-for="(item, index) in videoInfo.videoGroup"
              :key="index"
            >
              {{ item.name }}
            </span>
          </div>
          <!-- 介绍 -->
          <div id="introduce">
            {{ title === '视频' ? videoInfo.description : videoInfo.desc }}
          </div>
        </div>
      </div>
      <!-- 视频播放器页面右  -->
      <div id="videoPlayerPageRight">
        <!-- 相关推荐 -->
        <div id="recommend">
          相关推荐
        </div>
        <div
          id="relatedVideo"
          v-for="(item) in relatedVideo"
          :key="item.vid"
          @click="goRelatedVideo(title === '视频' ? item.vid : item.id)"
        >
          <!-- 相关视频推荐封面 -->
          <div id="relatedVideoImg">
            <el-image
              style="width: 140px; height: 80px; border-radius: 5px;vertical-align: middle"
              :src="title === '视频' ? item.coverUrl : item.cover + '?param=150y80'"
              fit="cover"
            />
            <!-- 播放数量 -->
            <div
              id="views"
              class="el-icon-caret-right"
            >
              {{ $arrangement(title === '视频' ? item.durationms : item.duration) }}
            </div>
          </div>
          <!-- 相关视频推荐信息 -->
          <div id="relatedVideoInfo">
            <div id="title">
              {{ title === '视频' ? item.title : item.name }}
            </div>
            <div id="userName">
              {{ title === '视频' ? item.creator[0].userName : item.artistName }}
            </div>
          </div>
        </div>
        <div id="videoComment">
          精彩评论
        </div>
        <!-- 评论列表 -->
        <div
          class="commentList"
          v-for="(item) in videoComment"
          :key="item.commentId"
        >
          <!-- 评论者头像 -->
          <el-image
            style="width: 40px; height: 40px; border-radius: 40px;"
            :src="item.user.avatarUrl+'?param=40y40'"
            fit="cover"
          />
          <!-- 评论者头像 -->
          <span>
            <!-- 评论 -->
            <div class="comment">
              <span @click="goUserInfo(item.user.userId)">{{ item.user.nickname }}: </span>
              <span>{{ item.content }}</span>
            </div>
            <!-- 评论 -->
            <!-- 时间 -->
            <div class="time">{{ $timeFilter(item.time) }}</div>
            <!-- 时间 -->
          </span>
        </div>
        <div
          v-show="videoComment.length === 0?true:false"
        >
          当前评论为空哦~
        </div>
        <!-- 评论列表 -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 视频信息
      videoInfo: {
        creator: {
          avatarUrl: ''
        }
      },
      // 相关视频
      relatedVideo: [],
      //  视频评论
      videoComment: [],
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
    // 获取视频详情
    async getVideoDetails () {
      const { data: res } = this.title === '视频' ? await this.$http.getVideoDetails(this.id) : await this.$http.getMvDetails(this.id)
      if (res.code !== 200) return this.$message.error('获取视频详情失败')
      this.videoInfo = res.data
    },
    // 获取视频Url
    async getVideoUrl () {
      const { data: res } = this.title === '视频' ? await this.$http.getVideoUrl(this.id) : await this.$http.getMvUrl(this.id)
      if (res.code !== 200) return this.$message.error('获取视频播放地址失败')
      this.playerOptions.sources[0].src = this.title === '视频' ? res.urls[0].url : res.data.url
    },
    // 获取视频评论
    async getVideoComment () {
      const { data: res } = this.title === '视频' ? await this.$http.getVideoComment(this.id) : await this.$http.getMvComment(this.id)
      if (res.code !== 200) return this.$message.error('获取视视频评论失败')
      this.videoComment = res.hotComments
    },
    // 获取相关视频
    async getRelatedVideo () {
      const { data: res } = this.title === '视频' ? await this.$http.getRelatedVideo(this.id) : await this.$http.getRelatedMv(this.id)
      if (res.code !== 200) return this.$message.error('获取相关视频失败')
      if (this.title === '视频' ? res.data.length : res.mvs.length > 4) {
        this.title === '视频' ? res.data.length = 4 : res.mvs.length = 4
      }
      this.relatedVideo = this.title === '视频' ? res.data : res.mvs
    },
    // 返回至父页面
    returnVideoPage () {
      this.$router.push(this.title === '视频' ? '/Video' : '/Mv')
    },
    //  跳转至相关视频
    goRelatedVideo (vid) {
      this.$router.replace('/VideoPlayerPage/' + vid + '/' + this.title)
    },
    // 跳转用户信息页
    goUserInfo (userId) {
      this.$router.replace('/UserInfo/' + userId)
    }

  },
  watch: {
    id: {
      handler: function () {
        // 获取视频详细信息
        this.getVideoDetails()
        // 获取视频Url
        this.getVideoUrl()
        // 获取视频评论
        this.getVideoComment()
        // 获取相关视频
        this.getRelatedVideo()
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
  #videoPlayerPage {
    height: 100%;
  }
  // 视频播放器页面主体
  #videoPlayerPageMain {
    display: flex;
    width: 95%;
    height: 100%;
    margin: 0 auto;
  }
  // 视频播放器页面左
  #videoPlayerPageLeft {
    flex: 30;
    overflow: auto;
    height: 100%;
    // 返回至父页面
    #returnVideoPage {
      height: 60px;
      line-height: 60px;
      font-weight: 700;
      span {
        cursor:pointer;
      }
    }
    // 用户信息
    #userInfo {
      padding: 20px 0 0 0;
      height: 40px;
      //  用户名
      #userName {
        font-size: 14px;
        padding-left: 10px;
      }
    }
    // 标题
    #title {
      padding: 15px 0 0 0;
      font-size: 20px;
      font-weight: 700;
    }
    #time {
      padding: 10px 0 0 0;
      font-size: 13px;
      color: #b8b8b8;
    }
    // 标签
    #tag {
      padding: 15px 0 0 0;
      font-size: 14px;
      span {
        padding-right: 15px;
        color: #218ac7;
      }
    }
    #introduce {
      padding: 15px 0 15px 0;
      color: #414445;
      font-size: 14px;
    }
  }
  // 视频播放器页面右
  #videoPlayerPageRight {
    flex: 20;
    overflow: auto;
    height: 100%;
    transform: translateX(50px);
    // 相关推荐
    #recommend {
      height: 60px;
      line-height: 60px;
      font-weight: 700;
    }
    // 相关视频
    #relatedVideo {
      display: flex;
      margin-bottom: 20px;
      cursor:pointer;
      // 相关视频推荐封面
      #relatedVideoImg{
        width: 140px;
        position: relative;
      }
      #views {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 12px;
        padding: 3px 6px;
        color: rgb(230, 230, 230);
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 0 5px 0 10px;
      }
      // 相关视频推荐信息
      #relatedVideoInfo {
        flex: 1;
        padding: 5px 0 0 15px;
        #title {
          width: 250px;
          padding-bottom: 5px;
          font-size: 14px;
          color: #3d3d3d;
          // 多行溢出隐藏
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        #userName {
          font-size: 12px;
          color: #888888;
          // 多行溢出隐藏
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }
    #videoComment {
      font-weight: 700;
    }
    // 评论列表
    .commentList{
      width: 300px;
      padding: 20px 0;
      position: relative;
      // 评论者头像
      .el-image{
        position: absolute;
        top: 20px;
      }
      >span{
        width: 100%;
        display: inline-block;
        padding-left: 55px;
        // 评论
        .comment{
          font-size: 13px;
          span:nth-child(1){
            color: #537eaf;
            cursor: pointer;
          }
           span:nth-child(2){
            color: #52504e;
            line-height: 20px;
          }
        }
        // 评论时间
        .time{
          padding-top: 10px;
          color: #ccc;
          font-size: 13px;
        }
      }
    }
  }
</style>
