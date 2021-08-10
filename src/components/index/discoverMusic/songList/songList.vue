<template>
  <div class="songList">
    <!-- 热门分类 -->
    <div class="hotMusicSortNav">
      <div>
        <p>{{ musicList.cat }}</p>
        <i class="el-icon-arrow-right" />
      </div>
      <div>
        <a
          href="javascript:;"
          @click="getSongList('全部')"
        >全部</a>
        <a
          href="javascript:;"
          v-for="(item, index) in hotMusicSortList"
          :key="index"
          @click="getSongList(item.name)"
        >{{ item.name }}</a>
      </div>
    </div>
    <!-- 热门分类 -->
    <!-- 歌单 -->
    <el-row
      :gutter="80"
      type="flex"
      class="reCommendedPlay"
    >
      <el-col
        :span="6"
        v-for="item in musicList.playlists"
        :key="item.id"
      >
        <div>
          <el-image
            style="width: 100%; height: 80%; border-radius: 10px"
            :src="item.coverImgUrl+'?param=160y160'"
          />
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
    <!-- 歌单 -->
    <!-- 分页 -->
    <el-pagination
      layout="prev, pager, next"
      :total="musicList.total"
      :page-size="40"
      :current-page="musicListage"
      @current-change="musicListCurrentChange"
    />
    <!-- 分页 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 热门歌单分类列表
      hotMusicSortList: [],
      // 热门音乐排行榜
      musicList: {},
      // 歌单列表当前页
      musicListage: 1,
      cat: ''
    }
  },
  methods: {
    // 获取热门歌单分类方法
    async  getHotMusicSort () {
      const { data: res } = await this.$http.getHotMusicSort()
      if (res.code !== 200) return this.$message.error('获取热门歌单分类失败')
      this.hotMusicSortList = res.tags
    },
    // 获取歌单方法
    async  getSongList (cat, page) {
      if (this.cat !== cat) {
        this.musicListage = 1
        this.cat = cat
      }
      const { data: res } = await this.$http.getSongList(cat, page)
      if (res.code !== 200) return this.$message.error('获取歌单失败')
      this.musicList = res
    },
    // 跳转歌单详情页
    goInfoPage (id) {
      this.$router.push('/DetailsPage*/' + id)
    },
    // 翻页方法
    musicListCurrentChange (page) {
      // 调用获取歌单方法
      this.getSongList(this.musicList.cat, page)
    }
  },
  created () {
    // 调用获取热门歌单分类方法
    this.getHotMusicSort()
    // 调用获取歌单方法
    this.getSongList()
  }
}
</script>

<style lang="less" scoped>
  // 分类样式
  .hotMusicSortNav {
    height: 30px;
    padding-top: 30px;
    position: relative;
    >:nth-child(1) {
      position: absolute;
      left: 0px;
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
      position: absolute;
      right: 0px;
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
