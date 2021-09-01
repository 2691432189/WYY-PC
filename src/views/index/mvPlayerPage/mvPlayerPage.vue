<template>
  <div id="mvPlayerPage">
    <div id="mvPlayerPageMain">
      <!-- MV播放器页面左  -->
      <div id="mvPlayerPageLeft">
        <!-- 返回至父页面 -->
        <div id="returnMvPage">
          <span @click="returnMvPage()">
            <i class="el-icon-arrow-left" /> MV详情
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
        <!-- MV信息 -->
        <div id="mvInfo">
          <!-- 用户信息  -->
          <div id="userInfo">
            <span id="avatar">
              <el-image
                style="width: 40px; height: 40px; border-radius: 40px;vertical-align: middle"
                :src="mvInfo.cover+'?param=60y60'"
                fit="cover"
              />
            </span>
            <span id="userName">
              {{ mvInfo.artistName }}
            </span>
          </div>
          <!-- 标题 -->
          <div id="title">
            {{ mvInfo.name }}
          </div>
          <!-- 时间 -->
          <div id="time">
            发布：{{ mvInfo.publishTime }}
          </div>
          <!-- 标签 -->
          <div id="tag">
            标签：
            <span
              v-for="(item, index) in mvInfo.videoGroup"
              :key="index"
            >
              {{ item.name }}
            </span>
          </div>
          <!-- 介绍 -->
          <div id="introduce">
            {{ mvInfo.desc }}
          </div>
        </div>
      </div>
      <!-- MV播放器页面右  -->
      <div id="mvPlayerPageRight">
        <!-- 相关推荐 -->
        <div id="recommend">
          相关推荐
        </div>
        <div
          id="relatedMv"
          v-for="(item) in relatedMv"
          :key="item.vid"
          @click="goRelatedMv(item.id)"
        >
          <!-- 相关MV推荐封面 -->
          <div id="relatedVideoImg">
            <el-image
              style="width: 140px; height: 80px; border-radius: 5px;vertical-align: middle"
              :src="item.cover+'?param=150y80'"
              fit="cover"
            />
            <!-- 播放数量 -->
            <div
              id="views"
              class="el-icon-caret-right"
            >
              {{ $arrangement(item.duration) }}
            </div>
          </div>
          <!-- 相关MV推荐信息 -->
          <div id="relatedMvInfo">
            <div id="title">
              {{ item.name }}
            </div>
            <div id="userName">
              {{ item.artistName }}
            </div>
          </div>
        </div>
        <div id="mvComment">
          精彩评论
        </div>
        <!-- 评论列表 -->
        <div
          class="commentList"
          v-for="(item) in mvComment"
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
          v-show="mvComment.length===0?true:false"
        >
          当前评论为空哦~
        </div>
        <!-- 评论列表 -->
      </div>
    </div>
  </div>
</template>

<script>
// 导入MV组件
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
export default {
  props: {
    mvId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // MV信息
      mvInfo: {
        cover: ''
      },
      // 相关MV
      relatedMv: [],
      //  MV评论
      mvComment: [],
      mvIds: this.mvId,
      // 播放器配置
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否MV一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载MV数据。auto浏览器选择最佳行为,立即开始加载MV（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'video/mp4', // 类型
          src: '' // url地址
        }],
        poster: '', // 封面地址
        notSupportedMessage: '此MV暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
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
    // 获取MV详情
    async getMvDetails () {
      const { data: res } = await this.$http.getMvDetails(this.mvIds)
      if (res.code !== 200) return this.$message.error('获取MV详情失败')
      this.mvInfo = res.data
    },
    // 获取MVUrl
    async getMvUrl () {
      const { data: res } = await this.$http.getMvUrl(this.mvIds)
      if (res.code !== 200) return this.$message.error('获取MV播放地址失败')
      this.playerOptions.sources[0].src = res.data.url
    },
    // 获取MV评论
    async getMvComment () {
      const { data: res } = await this.$http.getMvComment(this.mvIds)
      if (res.code !== 200) return this.$message.error('获取视MV评论失败')
      this.mvComment = res.hotComments
    },
    // 获取相关MV
    async getRelatedMv () {
      const { data: res } = await this.$http.getRelatedMv(this.mvIds)
      if (res.code !== 200) return this.$message.error('获取相关MV失败')
      if (res.mvs.length > 4) {
        res.mvs.length = 4
      }
      this.relatedMv = res.mvs
    },
    // 返回至父页面
    returnMvPage () {
      this.$router.push('/Mv')
    },
    //  跳转至相关MV
    goRelatedMv (mvId) {
      this.mvIds = mvId
    },
    // 跳转用户信息页
    goUserInfo (userId) {
      this.$router.push('/UserInfo/' + userId)
    }

  },
  components: {
    videoPlayer
  },
  watch: {
    mvIds: {
      handler: function () {
      // 获取MV详细信息
        this.getMvDetails()
        // 获取MVUrl
        this.getMvUrl()
        // 获取MV评论
        this.getMvComment()
        // 获取相关MV
        this.getRelatedMv()
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
  #mvPlayerPage {
    height: 100%;
  }
  // MV播放器页面主体
  #mvPlayerPageMain {
    display: flex;
    width: 95%;
    height: 100%;
    margin: 0 auto;
  }
  // MV播放器页面左
  #mvPlayerPageLeft {
    flex: 30;
    overflow: auto;
    height: 100%;
    // 返回至父页面
    #returnMvPage {
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
  // MV播放器页面右
  #mvPlayerPageRight {
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
    // 相关MV
    #relatedMv {
      display: flex;
      margin-bottom: 20px;
      cursor:pointer;
      // 相关MV推荐封面
      #relatedVideoImg{
        flex: 10;
        position: relative;
      }
      #views {
        position: absolute;
        top: 0;
        right: 25px;
        font-size: 12px;
        padding: 3px 6px;
        color: rgb(230, 230, 230);
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 0 5px 0 10px;
      }
      // 相关MV推荐信息
      #relatedMvInfo {
        flex: 20;
        padding-top: 5px;
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
    #mvComment {
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
