<template>
  <div class="body">
    <!-- 回到顶部 -->
    <el-backtop
      target=".body"
      style="right: 40px; color:red;"
      :bottom="90"
    />
    <!-- 回到顶部 -->
    <!-- 信息栏 -->
    <el-row :gutter="20">
      <!-- 歌单头图 -->
      <el-col :span="4">
        <el-image
          style="width: 100%;border-radius: 10px"
          :src="detailsPageInfo.coverImgUrl"
          fit="cover"
        />
        <!-- 歌单头图 -->
      </el-col>
      <el-col
        :span="20"
        class="DetailsPageInfo"
      >
        <!-- 歌单名 -->
        <div><h3>{{ detailsPageInfo.name }}</h3></div>
        <!-- 歌单名 -->
        <!-- 用户名 -->
        <div>
          <el-image
            style="width: 30px; height:30px; border-radius: 30px"
            :src="detailsPageInfo.creator.avatarUrl"
            fit="cover"
          />
          <span>{{ detailsPageInfo.creator.nickname }}</span>
          <span>{{ this.$filter(detailsPageInfo.createTime) +'创建' }}</span>
        </div>
        <!-- 用户名 -->
        <!-- 播放全部/收藏按钮 -->
        <div>
          <!-- 播放全部按钮 -->
          <el-button
            type="danger"
            round
            size="mini"
            @click="toPlayAll"
          >
            <i class="el-icon-caret-right" /> 播放全部 ✚
          </el-button>
          <!-- 播放全部按钮 -->
          <!-- 收藏/已收藏按钮 -->
          <el-button
            type="danger"
            round
            size="mini"
            v-if="detailsPageInfo.subscribed"
            v-show="WhetherToShowFavoritesBtn"
            @click="favoriteOrUnfavorite(2)"
          >
            <i class="el-icon-folder-checked" />  已收藏(326万)
          </el-button>
          <el-button
            v-else
            v-show="WhetherToShowFavoritesBtn"
            round
            size="mini"
            @click="favoriteOrUnfavorite(1)"
          >
            <i class="el-icon-folder-add" />   收藏(326万)
          </el-button>
          <!-- 收藏/已收藏按钮 -->
        </div>
        <!-- 播放全部/收藏按钮 -->
        <!-- 标签 -->
        <div>
          标签 :
          <span
            v-for="(item,index) in detailsPageInfo.tags"
            :key="index"
          >
            {{ item }}
          </span>
        </div>
        <!-- 标签 -->
        <!-- 歌曲/播放 -->
        <div>
          歌曲 :<span>{{ detailsPageInfo.trackCount }}</span>播放:<span>{{ this.$convert(detailsPageInfo.playCount) }}</span>
        </div>
        <!-- 歌曲/播放 -->
        <!-- 简介 -->
        <div>简介 :<span>{{ detailsPageInfo.description }}</span></div>
        <!-- 简介 -->
      </el-col>
    </el-row>
    <!-- 信息栏 -->
    <!-- 切换栏 -->
    <el-tabs
      class="detailsPageTabs"
      value="first"
    >
      <!-- 歌曲列表 -->
      <el-tab-pane
        label="歌曲列表"
        name="first"
      >
        <el-table
          :data="musicList"
          stripe
          style="width: 90%"
          @row-dblclick="doubleClickToPlay"
        >
          <el-table-column
            type="index"
            width="50"
          />
          <el-table-column
            width="70"
          >
            <template slot-scope="scope">
              <button
                @click.stop="collectMusic(scope.row.id,$event)"
                :class="{likeBtn:ifLikeMusic(scope.row.id)}"
              >
                <i class="el-icon-star-on" />
              </button>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="音乐标题"
          />
          <el-table-column
            prop="ar[0].name"
            label="歌手"
            width="250"
          />
          <el-table-column
            prop="al.name"
            label="专辑"
            width="300"
          />
          <el-table-column
            label="时长"
            width="80"
          >
            <template slot-scope="scope">
              {{ $times(scope.row.dt) }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 歌曲列表 -->
      <el-tab-pane
        label="评论"
        name="second"
      >
        配置管理
      </el-tab-pane>
      <el-tab-pane
        label="收藏者"
        name="third"
      >
        角色管理
      </el-tab-pane>
    </el-tabs>
    <!-- 切换栏 -->
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String, // 类型
      default: null // 默认值
    }
  },
  data () {
    return {
      // 歌单信息页面信息
      detailsPageInfo: {},
      // 音乐列表
      musicList: [],
      // 音乐链接列表
      musicUrlList: [],
      // 所有音乐id
      trackIds: [],
      //  用户名
      userName: window.localStorage.getItem('name'),
      // 喜欢音乐列表
      LikeMusicList: []
    }
  },
  methods: {
    // 获取歌单详细信息方法
    async getDetailsPage () {
      const { data: res } = await this.$http.get('/playlist/detail?id=' + this.id)
      if (res.code !== 200) return this.$message.error('获取歌单列表失败')
      this.detailsPageInfo = res.playlist
      this.trackIds = res.playlist.trackIds
      // 调用获取音乐URL方法
      this.getMusicUrl()
    },
    // 收藏或取消收藏方法
    async favoriteOrUnfavorite (id) {
      this.$http.get(`/playlist/subscribe?t=${id}&id=${this.id}`)
        .then((res) => {
          this.detailsPageInfo.subscribed = !this.detailsPageInfo.subscribed
          this.$addStorageEvent(2, 'butCountNum', true)
        })
        .catch((error) => {
          if (error.response) {
            this.$message.error('收藏/取消收藏失败')
          }
        })
    },
    // 获取音乐详细信息方法
    async getMusicUrl () {
      var url = ''
      this.trackIds.forEach((element, index) => {
        if (index === this.trackIds.length - 1) {
          url = url + element.id
        } else {
          url = url + element.id + ','
        }
      })
      const { data: res } = await this.$http.get('/song/detail?ids=' + url)
      if (res.code !== 200) return this.$message.error('获取音乐列表失败')
      const { data: res1 } = await this.$http.get('/song/url?id=' + url)
      if (res1.code !== 200) return this.$message.error('获取音乐URL失败')
      // 处理播放列表，整合url
      this.musicUrlList = []
      res.songs.forEach((element, index) => {
        var audio = {
          name: element.name,
          artist: element.al.name,
          url: '',
          cover: element.al.picUrl
        }
        res.songs[index].index = index
        audio.url = res1.data.find(element1 => {
          return element1.id === element.id
        }).url
        this.musicUrlList.push(audio)
      })
      this.musicList = res.songs
    },
    // 获取喜欢音乐列表方法
    async  getLikeMusicList () {
      const { data: res } = await this.$http.get('/likelist?uid=' + window.localStorage.getItem('uid'))
      if (res.code !== 200) return this.$message.error('获取喜欢的音乐列表失败')
      this.LikeMusicList = res.ids
    },
    // 判断音乐是否已被喜欢
    ifLikeMusic (id) {
      return this.LikeMusicList.includes(id)
    },
    // 双击播放
    doubleClickToPlay (row) {
      window.localStorage.setItem('currentlyPlayingMusic', row.index)
      this.$store.commit('addmusic', this.musicUrlList)
      this.$addStorageEvent(1, 'butCountNum', true)
    },
    // 全部播放
    toPlayAll () {
      this.$store.commit('addmusic', this.musicUrlList)
      this.$addStorageEvent(1, 'butCountNum', true)
    },
    // 喜欢音乐
    async collectMusic (id, event) {
      if (!window.localStorage.getItem('uid')) return this.$message.error('请登录')
      var whether = true
      if (event.path[1].className) {
        whether = false
      } else {
        whether = true
      }
      const { data: res } = await this.$http.get(`/like?id=${id}&like=${whether}`)
      if (res.code !== 200) return this.$message.error('操作失败')
      if (!whether) {
        event.path[1].className = ''
      } else {
        event.path[1].className = 'likeBtn'
      }
      // 调用获取喜欢音乐列表方法
      this.getLikeMusicList()
    }
  },
  watch: {
    id: function name (params) {
      // 调用获取歌单详细信息方法
      this.getDetailsPage()
    }
  },
  computed: {
    // 自动验证当前歌单是否为用户本人创建，并动态显示收藏按钮
    WhetherToShowFavoritesBtn () {
      if (this.detailsPageInfo.creator.nickname === this.userName) return false
      return true
    }
  },
  mounted () {
    // 调用获取歌单详细信息方法
    this.getDetailsPage()
    // 调用获取喜欢音乐列表方法
    this.getLikeMusicList()
  }

}
</script>

<style lang="less" scoped>
.body{
  height: 90%;
  overflow-x: hidden;
  padding: 30px 30px;
  .DetailsPageInfo{
    div{
      margin-bottom: 5px;
    }
    // 用户名
    div:nth-child(2){
      span{
        display: inline-block;
        transform: translateY(-14px);
        padding-left: 15px;
        font-size: 12px;
        color: #218ac7;
      }
      span:nth-child(3){
        color: #ccc;
      }
    }
    // 标签
    div:nth-child(4){
      font-size: 13px;
      span{
        color: #218ac7;
        padding:5px;
      }
    }
    // 歌曲/播放
    div:nth-child(5){
      font-size: 13px;
      span{
        color: rgb(100, 100, 100);
        padding-left: 8px;
      }
      span:nth-child(1){
        padding-right: 20px;
      }
    }
    // 简介
    div:nth-child(6){
      font-size: 13px;
      span{
        display: inline-block;
        transform: translate(35px,-16px);
        width: 80%;
        padding-left: 8px;
        color: rgb(100, 100, 100);
        // 多行溢出隐藏
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
  // 切换栏距离顶部距离
  .el-tabs{
    margin-top: 20px;
    button {
      border:0px;
      cursor:pointer;
    }
    .likeBtn {
      color:red;
    }
  }
}
</style>
