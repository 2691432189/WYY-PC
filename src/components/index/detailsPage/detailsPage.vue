<template>
  <div class="body">
    <!-- 回到顶部 -->
    <el-backtop
      target=".body"
      style="right: 8vh; color:red;"
      :bottom="250"
      class="backtop"
    />
    <!-- 回到顶部 -->
    <div id="pageBody">
      <!-- 信息栏 -->
      <el-row :gutter="20">
        <!-- 歌单头图 -->
        <el-col :span="4">
          <el-image
            style="width: 100%;border-radius: 10px"
            :src="detailsPageInfo.coverImgUrl+'?param=200y200'"
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
              :src="detailsPageInfo.creator.avatarUrl+'?param=50y50'"
              fit="cover"
            />
            <span>{{ detailsPageInfo.creator.nickname }}</span>
            <span>{{ this.$timeFilter(detailsPageInfo.createTime) +'创建' }}</span>
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
          :label="`评论(${commentList.total})`"
          name="cover"
        >
          <!-- 评论列表 -->
          <div
            class="commentList"
            v-for="(item,index) in commentList.comments"
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
              <!-- 回复 -->
              <div
                class="comment comments"
                v-for="(item1,index1) in item.beReplied"
                :key="index1"
              >
                <span>@{{ item1.user.nickname }}: </span>
                <span>{{ item1.content }}</span>
              </div>
              <!-- 回复 -->
              <!-- 时间 -->
              <div class="time">{{ $timeFilter(item.time) }}</div>
            <!-- 时间 -->
            </span>
          </div>
          <div
            v-show="commentList.total===0?true:false"
            class="commentIsAir"
          >
            当前评论为空哦~
          </div>
          <!-- 评论列表 -->
          <!-- 分页 -->
          <el-pagination
            v-show="commentList.total===0?false:true"
            layout="prev, pager, next"
            :total="commentList.total"
            :page-size="50"
            :current-page="commentPage"
            @current-change="commentCurrentChange"
          />
        <!-- 分页 -->
        </el-tab-pane>
        <el-tab-pane
          label="收藏者"
          name="third"
        >
          <el-row :gutter="20">
            <el-col
              :span="8"
              v-for="(item, index) in collectorList.subscribers"
              :key="index"
              class="collectorList"
            >
              <!-- 歌单收藏者头像 -->
              <el-image
                style="width: 100px; height: 100px; border-radius: 100px;"
                :src="item.avatarUrl+'?param=100y100'"
                fit="cover"
              />
              <!-- 歌单收藏者头像 -->
              <div>
                <div>{{ item.nickname }}: </div>
                <div>{{ item.signature }}</div>
              </div>
            </el-col>
          </el-row>
          <div
            v-show="collectorList.total===0?true:false"
            class="commentIsAir"
          >
            当前没有人收藏该歌单哦~
          </div>
          <!-- 分页 -->
          <el-pagination
            v-show="collectorList.total===0?false:true"
            layout="prev, pager, next"
            :total="collectorList.total"
            :page-size="51"
            :current-page="collectorPage"
            @current-change="collectorCurrentChange"
          />
        <!-- 分页 -->
        </el-tab-pane>
      </el-tabs>
    <!-- 切换栏 -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String, // 类型
      default: '' // 默认值
    }
  },
  data () {
    return {
      // 歌单信息页面信息
      detailsPageInfo: {
        creator: {
          avatarUrl: 'placeholder'
        }
      },
      // 音乐列表
      musicList: [],
      // 音乐链接列表
      musicUrlList: [],
      // 所有音乐id
      trackIds: [],
      //  用户名
      userName: window.localStorage.getItem('name'),
      // 喜欢音乐列表
      LikeMusicList: [],
      // 评论列表
      commentList: [],
      // 评论列表当前页
      commentPage: 1,
      // 歌单收藏者列表
      collectorList: {},
      // 歌单收藏者当前页
      collectorPage: 1

    }
  },
  methods: {
    // 获取歌单详细信息方法
    async getDetailsPage () {
      const { data: res } = await this.$http.getDetailsPage(this.id)
      if (res.code !== 200) return this.$message.error('获取歌单列表失败')
      this.detailsPageInfo = res.playlist
      this.trackIds = res.playlist.trackIds
      // 调用获取音乐URL方法
      this.getMusicUrl()
    },
    // 收藏或取消收藏方法
    favoriteOrUnfavorite (id) {
      this.$http.favoriteOrUnfavorite(id, this.id)
        .then(() => {
          this.detailsPageInfo.subscribed = !this.detailsPageInfo.subscribed
        })
        .catch((error) => {
          if (error.response) {
            this.$message.error('收藏/取消收藏失败')
          }
        })
    },
    // 获取音乐详细信息方法
    async getMusicUrl () {
      this.$play(this, this.trackIds)
        .then((res) => {
          this.musicUrlList = res.musicUrlList
          this.musicList = res.songs
        })
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
    // 双击播放
    doubleClickToPlay (row) {
      this.$store.commit('addmusic', this.musicUrlList)
      this.$store.commit('changeSongIndex', {
        index: row.index,
        random: Math.random()
      })
    },
    // 全部播放
    toPlayAll () {
      this.$store.commit('addmusic', this.musicUrlList)
      this.$store.commit('changeSongIndex', {
        index: 0,
        random: Math.random()
      })
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
    // 获取评论列表
    async  getCommentList (page) {
      const { data: res } = await this.$http.getCommentList(this.id, page)
      if (res.code !== 200) return this.$message.error('获取歌单评论列表失败')
      // 反转评论列表数组
      res.comments.reverse()
      this.commentList = res
      this.commentPage = page
    },
    // 获取歌单收藏列表
    async  getCollectorList (page) {
      const { data: res } = await this.$http.getCollectorList(this.id, page)
      if (res.code !== 200) return this.$message.error('获取歌单列表失败')
      this.collectorList = res
      this.collectorPage = page
    },
    // 评论翻页
    commentCurrentChange (page) {
      this.getCommentList(page)
      // 翻页后自动回到顶部
      window.document.querySelector('.backtop').click()
    },
    // 歌单收藏者翻页
    collectorCurrentChange (page) {
      this.getCollectorList(page)
      // 翻页后自动回到顶部
      window.document.querySelector('.backtop').click()
    }
  },
  watch: {
    id: function () {
      // 调用获取歌单详细信息方法
      this.getDetailsPage()
      // 调用获取评论列表
      this.getCommentList()
      // 调用获取喜欢音乐列表方法
      this.getLikeMusicList()
      // 调用获取歌单收藏列表
      this.getCollectorList()
      // 切换歌单后自动回到顶部
      if (window.document.querySelector('.backtop')) {
        window.document.querySelector('.backtop').click()
      }
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
    // 调用获取评论列表
    this.getCommentList()
    // 调用获取喜欢音乐列表方法
    this.getLikeMusicList()
    // 调用获取歌单收藏列表
    this.getCollectorList()
  }
}
</script>

<style lang="less" scoped>
.body{
  height: 90%;
  overflow-x: hidden;
  padding: 30px 0 0 0 ;
  box-sizing: border-box;
  #pageBody {
    transform: translateX(40px);
  }
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
// 评论列表
.commentList{
  border-bottom: 1px #ccc solid;
  padding: 20px 0;
  position: relative;
  margin-bottom: 30px;
  // 评论者头像
  .el-image{
    position: absolute;
    top: 20px;
  }
  >span{
    width: 90%;
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
    // 评论回复
    .comments{
      margin: 5px 0 0 10px;
      padding:5px;
      background-color: #f4f4f4;
      border-radius: 5px;
      font-size: 12px;
    }
    // 评论时间
    .time{
      padding-top: 10px;
      color: #ccc;
      font-size: 13px;
    }
  }
}
// 歌单收藏者列表
.collectorList{
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  >div{
    >div{
      padding-left: 15px;
      width: 260px;
      // 歌单收藏者姓名
      &:nth-child(1){
      font-size: 14px;
      color: #000000;
      }
      // 歌单收藏者签名
      &:nth-child(2){
        padding-top: 10px;
        font-size: 12px;
        color: #6b6b6b;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }
}
</style>
