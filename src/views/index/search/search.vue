<template>
  <div id="search">
    <el-tabs
      class="detailsPageTabs"
      value="first"
    >
      <!-- 歌曲列表 -->
      <el-tab-pane
        label="歌曲列表"
        name="first"
      >
        <h4>共找到{{ musicList.songCount ||0 }}条音乐</h4>
        <el-table
          :data="musicList.songs"
          stripe
          style="width: 90%"
          @row-dblclick="dblclickPlayMusic"
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
        <!-- 分页 -->
        <el-pagination
          layout="prev, pager, next"
          :total="musicList.songCount ||0"
          :page-size="50"
          :current-page="musicListPage"
          @current-change="musicListCurrentChange"
        />
      <!-- 分页 -->
      </el-tab-pane>
      <!-- 歌曲列表 -->
      <!-- 歌单列表 -->
      <el-tab-pane
        label="歌单列表"
        name="two"
      >
        <h4>共找到{{ musicDetailsPageList.playlistCount ||0 }}条歌单</h4>
        <el-row
          :gutter="80"
          type="flex"
          class="reCommendedPlay"
        >
          <el-col
            :span="4"
            v-for="item in musicDetailsPageList.playlists"
            :key="item.id"
          >
            <div>
              <el-image
                style="width: 100%; height: 80%; border-radius: 10px"
                :src="item.coverImgUrl+'?param=160y160'"
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
        <!-- 分页 -->
        <el-pagination
          layout="prev, pager, next"
          :total="musicDetailsPageList.playlistCount ||0"
          :page-size="50"
          :current-page="musicDetailsPage"
          @current-change="musicDetailsCurrentChange"
        />
        <!-- 分页 -->
      </el-tab-pane>
      <!-- 歌单列表 -->
    </el-tabs>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: String, // 类型
      default: null // 默认值
    }
  },
  data () {
    return {
      // 音乐搜索结果
      musicList: {},
      // 歌单搜索结果
      musicDetailsPageList: {},
      // 喜欢音乐列表
      LikeMusicList: [],
      // 当前音乐页数
      musicListPage: 1,
      // 当前歌单页数
      musicDetailsPage: 1
    }
  },
  methods: {
    // 获取搜索音乐结果方法
    async  getSearchMusicResult (page) {
      page = page || 1
      const { data: res } = await this.$http.getSearchResult(this.info, page, 1)
      this.musicList = res.result
    },
    // 获取搜索歌单结果方法
    async  getSearchmusicDetailsPageResult (page) {
      page = page || 1
      const { data: res } = await this.$http.getSearchResult(this.info, page, 1000)
      this.musicDetailsPageList = res.result
    },
    // 获取喜欢音乐列表方法
    async  getLikeMusicList () {
      const { data: res } = await this.$http.getLikeMusicList(window.localStorage.getItem('uid'))
      if (res.code !== 200) return this.$message.error('获取喜欢的音乐列表失败')
      this.LikeMusicList = res.ids
    },
    // 判断音乐是否已被喜欢
    ifLikeMusic (id) {
      return this.LikeMusicList.includes(id)
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
      const { data: res } = await this.$http.collectMusic(id, whether)
      if (res.code !== 200) return this.$message.error('操作失败')
      if (!whether) {
        event.path[1].className = ''
      } else {
        event.path[1].className = 'likeBtn'
      }
      // 调用获取喜欢音乐列表方法
      this.getLikeMusicList()
    },
    // 双击播放音乐
    async dblclickPlayMusic (row) {
      this.$play(this, [{ id: row.id }])
        .then((res) => {
          this.$store.commit('pushMusic', res.musicUrlList[0])
          this.$store.commit('changeSongIndex', {
            index: 0,
            random: Math.random()
          })
        })
    },
    // 音乐翻页
    musicListCurrentChange (page) {
      this.getSearchMusicResult(page)
    },
    // 歌单翻页
    musicDetailsCurrentChange (page) {
      this.getSearchmusicDetailsPageResult(page)
    },
    // 跳转歌单详情页
    goInfoPage (id) {
      this.$router.push('/DetailsPage*/' + id)
    }
  },
  watch: {
    info: {
      handler: function () {
        this.musicListPage = 1
        this.musicDetailsPage = 1
        this.getSearchMusicResult()
        this.getSearchmusicDetailsPageResult()
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
#search {
  height: 100%;
  overflow: auto;
}
.el-tabs {
  margin-top: 20px;
  button {
    border:0px;
    cursor:pointer;
  }
  .likeBtn {
    color:red;
  }
  .el-pagination {
    margin-top: 30px;
  }
}
  // 推荐歌单
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
        line-height: 140px;
        color: rgb(230, 230, 230);
        font-size: 30px;
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
