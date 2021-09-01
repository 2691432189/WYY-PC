<template>
  <div id="aplayer">
    <!-- 音乐播放页 -->
    <musicPlayerPage
      :drawer="drawer"
      :val="playObj"
      :is-play-pause="controlPlayPause"
      :current-time="currentTime|timeFilters"
      :lyric="lyric"
      :music-comment="musicComment"
    />
    <audio
      :src="playObj.url"
      :loop="playWay===2"
      autoplay
      @ended="endeds"
      @timeupdate="timeupdates"
      ref="aplayer"
      @error="playError"
    />
    <div id="component">
      <!-- 歌曲信息 -->
      <div id="info">
        <!-- 歌曲图片 -->
        <div id="cover">
          <el-image
            style="width: 50px; border-radius: 4px;"
            :src="playObj.cover"
            fit="fit"
          />
          <!-- 打开/关闭播放页按钮 -->
          <div
            id="unfoldMusicPlayerPage"
            @click="unfoldMusicPlayerPage"
          >
            <i :class="drawer?'el-icon-arrow-down':'el-icon-arrow-up'" />
          </div>
        </div>
        <div id="text">
          <!-- 音乐名 -->
          <div id="songName">
            {{ playObj.name }}
          </div>
          <!-- 作者名 -->
          <div id="singer">
            {{ playObj.artist }}
          </div>
        </div>
      </div>
      <!-- 控件 -->
      <div id="control">
        <div id="btn">
          <!-- 上一曲 -->
          <i
            class="el-icon-caret-left"
            @click="changeSong(0)"
          />
          <!-- 暂停/播放 -->
          <i
            :class="[{'el-icon-video-play':!controlPlayPause},{'el-icon-video-pause':controlPlayPause}] "
            @click="isPlayPause"
          />
          <!-- 下一曲 -->
          <i
            class="el-icon-caret-right"
            @click="changeSong(1)"
          />
        </div>
        <!-- 播放进度条 -->
        <div id="schedule">
          <div>{{ currentTime|timeFilters }}</div>
          <div>
            <el-slider
              :show-tooltip="false"
              style="color:#ccc;"
              v-model="currentTime"
              :min="0"
              :max="time"
              :step="1"
              @change="changeCurrentTime"
            />
          </div>
          <div>{{ time|timeFilters }}</div>
        </div>
      </div>
      <!-- 音乐列表 -->
      <div id="queue">
        <!-- 音量控件 -->
        <div id="volume">
          <!-- 音量图标 -->
          <div id="volumeIcon">
            <i class="el-icon-message-solid" />
          </div>
          <!-- 音量条 -->
          <div id="volumeBar">
            <el-slider
              :show-tooltip="false"
              style="color:#ccc;"
              v-model="volumeBar"
              input-size="mini"
              :min="0"
              :max="100"
              :step="1"
              @input="changeVolume"
            />
          </div>
        </div>
        <!-- 单曲循环 -->
        <div id="singleCycle">
          <i
            :class="[{'el-icon-refresh':playWay===1},{'el-icon-refresh-left':playWay===2},{'el-icon-loading':playWay===3}]"
            @click="singleCycle(playWay)"
          />
        </div>
        <!-- 播放队列 -->
        <div id="PlayQueue">
          <el-popover
            placement="top-end"
            title="播放列表"
            width="400"
            trigger="click"
            content="当前播放列表为空哦~"
          >
            <i
              class="el-icon-s-fold"
              slot="reference"
            />
            <el-table
              :data="data"
              :show-header="false"
              stripe
              style="width: 100%;max-height:420px;overflow: auto;"
              @row-click="changeSong"
            >
              <!-- 索引号 -->
              <el-table-column
                type="index"
                width="50"
              />
              <!-- 音乐名 -->
              <el-table-column
                prop="name"
                width="180"
              />
              <!-- 作者名 -->
              <el-table-column
                prop="artist"
              />
            </el-table>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import musicPlayerPage from '../musicPlayerPage/musicPlayerPage.vue'
export default {
  name: 'Aplayer',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 进度条
      schedule: 20,
      // 音量条
      volumeBar: 20,
      // 音乐索引
      indexs: 0,
      // 播放控制
      controlPlayPause: false,
      playObj: {
        artist: '歌手',
        cover: 'https://p1.music.126.net/9IfO2BG-WwJXRW4tMxoQvA==/109951164973382502.jpg?param=80y80',
        name: '歌曲名',
        url: undefined,
        songId: '',
        index: 0
      },
      lyric: [{
        lyric: ['当前没有播放音乐哦~'],
        time: '00:00'
      }],
      // 歌曲当前播放时间
      currentTime: 0,
      // 歌曲总播放时间
      time: 0,
      drawer: false,
      //  音乐评论
      musicComment: [],
      // 是否开启单曲循环
      playWay: 1
    }
  },
  methods: {
    // 处理播放错误
    playError () {
      // 当前音乐播放错误，自动播放下一首
      this.$message.error('当前音乐播放错误，自动播放下一首~')
      console.log('当前音乐播放错误，自动播放下一首~')
      this.indexs < this.data.length - 1 ? this.indexs++ : this.indexs = 0
    },
    // 更改暂停或播放
    isPlayPause () {
      if (this.playObj.url !== undefined) {
        this.controlPlayPause = !this.controlPlayPause
      } else {
        this.$message.error('当前播放列表为空哦~')
      }
    },
    // 播放音乐
    play (data) {
      this.playObj.artist = data.artist
      this.playObj.cover = data.cover
      this.playObj.name = data.name
      this.playObj.songId = data.songId
      this.playObj.url = data.url
    },
    // 更换音乐
    changeSong (data) {
      if (data === 0) {
        this.indexs > 0 ? this.indexs-- : this.indexs = this.data.length - 1
      } else if (data === 1) {
        this.indexs < this.data.length - 1 ? this.indexs++ : this.indexs = 0
      } else {
        this.indexs = data.index
      }
    },
    // 自动播放音乐列表中的下一首音乐
    endeds () {
      if (this.playWay === 1) {
        this.indexs < this.data.length - 1 ? this.indexs++ : this.indexs = 0
      } else if (this.playWay === 3) {
        this.indexs = Math.floor(Math.random() * this.data.length)
      }
    },
    // 改变音量
    changeVolume (num) {
      this.$refs.aplayer.volume = num / 100
    },
    // 播放时间发生改变时调用
    timeupdates () {
      this.currentTime = this.$refs.aplayer.currentTime
      this.time = this.$refs.aplayer.duration
    },
    // 更改播放时间
    changeCurrentTime () {
      if (this.controlPlayPause) {
        this.$refs.aplayer.currentTime = this.currentTime
      }
    },
    // 展开/关闭音乐播放器页面
    unfoldMusicPlayerPage () {
      this.drawer = !this.drawer
    },
    // 获取歌词
    async getLyrics (id) {
      const { data: res } = await this.$http.getLyrics(id)
      if (res.lrc) {
        const lyric = this.$lyricsProcess(res.lrc.lyric)
        let lyricTranslation = []
        if (res.tlyric.lyric) {
          lyricTranslation = this.$lyricsProcess(res.tlyric.lyric)
        }
        lyric.forEach(item => {
          const lyric = []
          lyric.push(item.lyric)
          for (let i = 0; i < lyricTranslation.length - 1; i++) {
            if (item.time === lyricTranslation[i].time) {
              lyric.push(lyricTranslation[i].lyric)
            }
          }
          item.lyric = lyric
        })
        this.lyric = lyric
      } else {
        this.lyric = [{
          lyric: ['该音乐暂无歌词哦'],
          time: '00:00'
        }]
      }
    },
    // 获取音乐评论
    async getMusicComment (id, page) {
      const { data: res } = await this.$http.getMusicComment(id, page)
      this.musicComment = res.hotComments
    },
    // 更改单曲循环状态
    singleCycle (way) {
      if (way === 1) {
        this.playWay = 2
      } else if (way === 2) {
        this.playWay = 3
      } else if (way === 3) {
        this.playWay = 1
      }
    }
  },
  computed: {
    // 配合watch动态监听两个属性
    changeData () {
      const { data, indexs } = this
      return {
        data,
        indexs
      }
    }
  },
  watch: {
    // 监听暂停/播放按钮的状态
    controlPlayPause (is) {
      if (is) {
        this.$refs.aplayer.play()
      } else {
        this.$refs.aplayer.pause()
      }
    },

    // 监听音乐索引的变化
    index (index) {
      this.indexs = index
    },
    changeData () {
      // 处理音乐列表索引
      for (let i = 0; i < this.data.length; i++) {
        this.data[i].index = i
      }
      // 判断该音乐是否有版权
      this.$http.checkMusic(this.data[this.indexs].songId)
        .then(() => {
          this.play(this.data[this.indexs])
          this.getLyrics(this.data[this.indexs].songId)
          this.getMusicComment(this.data[this.indexs].songId, 0)
          this.controlPlayPause = true
        })
        .catch(() => {
          this.$message.error('该音乐暂无版权哦~')
          // 当前音乐没版权自动播放下一首
          this.indexs < this.data.length - 1 ? this.indexs++ : this.indexs = 0
        })
    }
  },
  components: {
    musicPlayerPage
  },
  filters: {
    // 将秒变为分钟
    timeFilters (value) {
      if (isNaN(value)) {
        value = 0
      }
      const f = Math.floor(value / 60) < 10 ? '0' + Math.floor(value / 60) : Math.floor(value / 60)
      const s = Math.floor(value % 60) < 10 ? '0' + Math.floor(value % 60) : Math.floor(value % 60)
      return f + ':' + s
    }
  }
}
</script>

<style lang="less" scoped>
  #aplayer{
    width: 100%;
    height: 75px;
    background-color: #ffffff;
    z-index: 999;
  }
  #component {
    display: flex;
  }
  // 歌曲信息
  #info {
    flex: 1;
    display: flex;
    align-items: center;
    // 音乐图片
    #cover {
      flex: 2;
      position: relative;
      transform: translate(25px,5px);
      // 打开/关闭播放页按钮
      #unfoldMusicPlayerPage {
        position: absolute;
        top: 0px;
        width: 50px;
        height: 50px;
        border-radius: 4px;
        color: #dfdfdf;
        font-size: 30px;
        text-align: center;
        line-height: 45px;
        opacity: 0;
      }
      #unfoldMusicPlayerPage:hover {
        background-color: rgba(0, 0, 0, .6);
        opacity: 1;
      }
    }
    #text {
      position: relative;
      flex: 6;
      // 歌名
      #songName {
        font-size: 14px;
        color: #373737;
        // 溢出隐藏
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      // 歌手
      #singer {
        font-size: 12px;
        color: #7a7a7a;
        // 溢出隐藏
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }
  }
  // 控件
  #control {
    flex: 2;
    display: flex;
    flex-direction: column;
    // 播放暂停上下曲
    #btn {
      flex: 2;
      font-size: 25px;
      display: flex;
      justify-content: center;
      transform: translateY(6px) ;
      i {
        width: 80px;
        text-align: center;
        padding-top: 10px;
      }
      i:hover {
        color: #ec4141;
        cursor:pointer;
      }
      :nth-child(2){
        width: 40px;
        height: 30px;
        display: inline-block;
        border-radius: 50%;
        line-height: 20px;
        background-color: #f4f4f4;
        transform: translateY(3px) ;
      }
      :nth-child(2):hover {
        color: #000000;
        background-color: #e5e5e5;
        cursor:pointer;
      }
    }
    // 播放进度控件
    #schedule {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0px 70px;
      transform: translateY(4px);
      div {
        text-align: center;
        font-size: 12px;
      }
      :nth-child(1){
        flex: 1;
      }
      :nth-child(2){
        flex: 6;
      }
      :nth-child(3){
        flex: 1;
      }
    }
  }
  // 音乐列表
  #queue{
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 26px;
    // 音量控件
    #volume {
      flex: 4;
      display: flex;
      align-items: center;
      // 音量图标
      #volumeIcon {
        flex: 1;
      }
      // 音量条
      #volumeBar {
        flex: 8;
        padding-left: 15px;
        padding-right: 50px;
      }
    }
    // 单曲循环
    #singleCycle {
      flex: 1;
      text-align: center;
      i {
        cursor:pointer;
      }
    }
    // 播放队列
    #PlayQueue {
      flex: 2;
      text-align: center;
      i {
        cursor:pointer;
      }
    }
  }

</style>
