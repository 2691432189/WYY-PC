<template>
  <div>
    <el-drawer
      :visible.sync="drawers"
      direction="btt"
      :modal="false"
      :wrapper-closable="false"
      size="100%"
      :show-close="false"
      :close-on-press-escape="false"
      :with-header="false"
      id="drawer"
    >
      <div id="musicPlayerPage">
        <!-- 音乐信息 -->
        <div id="songInfo">
          <!-- 音乐名 -->
          <div id="songName">
            {{ value.name }}
          </div>
          <!-- 作者名 -->
          <div id="singer">
            {{ value.artist }}
          </div>
        </div>
        <!-- 播放区 -->
        <div id="playArea">
          <!-- 歌曲图片 -->
          <div id="songImage">
            <div
              id="songImage-1"
              :class="{songImageSpin:!isPlayPause}"
            >
              <div id="songImage-2">
                <div id="songImage-3">
                  <img :src="value.cover">
                </div>
              </div>
            </div>
          </div>
          <!-- 歌词 -->
          <div id="lyrics">
            <ul
              :style="{ top: -lyricTopNum + 'px' }"
              ref="lyricsUl"
            >
              <li
                v-for="(item, index) in lyric"
                :key="index"
                id="lyrics-item"
                :class="{'current-lyrics-item':index === lyricIndex}"
              >
                <div
                  v-for="(lyrics, indexs) in item.lyric"
                  :key="indexs"
                >
                  {{ lyrics }}
                </div>
              </li>
            </ul>
          </div>
          <!-- 评论区 -->
          <div id="comment">
            <div id="commentNav">
              热门评论
            </div>
            <div id="commentMain">
              <div>
                <!-- 评论列表 -->
                <div
                  class="commentList"
                  v-for="(item,index) in musicComment"
                  :key="index"
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
                      <span>{{ item.user.nickname }}: </span>
                      <span>{{ item.content }}</span>
                    </div>
                    <!-- 评论 -->
                    <!-- 时间 -->
                    <div class="time">{{ $timeFilter(item.time) }}</div>
                  <!-- 时间 -->
                  </span>
                </div>
                <div
                  v-show="musicComment.length===0?true:false"
                >
                  当前评论为空哦~
                </div>
                <!-- 评论列表 -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'MusicPlayerPage',
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    val: {
      type: Object,
      default: () => {}
    },
    isPlayPause: {
      type: Boolean,
      default: false
    },
    currentTime: {
      type: String,
      default: '00:00'
    },
    lyric: {
      type: Array,
      default: () => []
    },
    musicComment: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      drawers: false,
      lyricIndex: 0,
      currentTimes: 0,
      value: this.val,
      lyricTopNum: 0
    }
  },
  watch: {
    // 侦听播放暂停
    drawer (drawer) {
      this.drawers = drawer
    },
    // 侦听音乐当前播放时间
    currentTime (currentTime) {
      this.currentTimes = currentTime
    },
    // 动态显示歌词
    currentTimes (currentTimes) {
      if (this.lyric !== []) {
        for (let i = 0; i < this.lyric.length; i++) {
          if (currentTimes === this.lyric[i].time) {
            this.lyricIndex = i
          }
        }
      }
    },
    lyric () {
      this.lyricIndex = 0
    },
    lyricIndex () {
      this.lyricTopNum = (this.lyricIndex - 1) * 85.6
    }
  }
}
</script>

<style lang="less" scoped>
  #drawer{
    overflow: auto;
  }

  #musicPlayerPage {
    display: flex;
    flex-direction:column;
    height: 100%;
    min-height: 660px;
  }

  // 音乐信息
  #songInfo {
    flex: 5;
    // 音乐名
    #songName {
      width: 500px;
      margin: 40px auto 10px;
      color: #000000;
      font-size: 25px;
      text-align: center;
      /*当文本溢出包含元素时，以省略号表示超出的文本*/
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    // 作者名
    #singer {
      width: 500px;
      margin: 0px auto;
      color: #363636;
      font-size: 16px;
      text-align: center;
      /*当文本溢出包含元素时，以省略号表示超出的文本*/
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  // 播放区
  #playArea {
    flex: 15;
    display: flex;
    // 歌曲图片
    #songImage {
      flex: 4;
      @keyframes imgAnimation {
        0%{
          transform: rotate(0deg);
        }
        100%{
          transform: rotate(360deg);
        }
      }
      #songImage-1 {
        position: relative;
        left: 100px;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, .3);
        animation: imgAnimation 10s linear infinite;
      }
      #songImage-2 {
        position: absolute;
        top: 15px;
        left: 15px;
        width: 270px;
        height: 270px;
        border-radius: 50%;
        background-color: #000000;

      }
      #songImage-3 {
        position: absolute;
        top: 35px;
        left: 35px;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        overflow: hidden;
      }
      img {
        width: 100%;
      }
      // 控制歌曲图片是否旋转
      .songImageSpin {
        animation-play-state: paused !important;
      }
    }
    // 歌词
    #lyrics {
      flex: 5;
      height: 444px;
      overflow: hidden;
      ul {
        transition: all 1s;
        position: relative;
      }
      #lyrics-item {
        padding: 22px 40px;
        text-align: center;
        font-size: 16px;
        color: #5e5e5e;
        height: 41.6px;
      }
      // 当前播放时间对应的歌词
      .current-lyrics-item {
        font-size: 22px !important;
        color: #000000 !important;
      }
    }
    // 评论区
    #comment {
      flex: 4;
      display: flex;
      flex-direction: column;
      transform: translateX(90px);
      #commentNav {
        flex: 5;
        font-size: 18px;
      }
      #commentMain{
        flex: 50;
        >div {
          height: 370px;
          overflow: auto;
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
            width: 78%;
            display: inline-block;
            padding-left: 55px;
            // 评论
            .comment{
              font-size: 13px;
              span:nth-child(1){
                color: #537eaf;
              }
               span:nth-child(2){
                color: #52504e;
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
    }
  }
</style>
