<template>
  <div>
    <div class="body">
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
              @click="favoriteOrUnfavorite(2)"
            >
              <i class="el-icon-folder-checked" />  已收藏(326万)
            </el-button>
            <el-button
              v-else
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
    </div>
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
      musicList: []
    }
  },
  methods: {
    // 获取歌单详细信息方法
    async getDetailsPage () {
      const { data: res } = await this.$http.get('/playlist/detail?id=' + this.id)
      if (res.code !== 200) return this.$message.error('获取歌单列表失败')
      this.detailsPageInfo = res.playlist
      this.musicList = res.privileges
    },

    async favoriteOrUnfavorite (id) {
      this.$http.get(`/playlist/subscribe?t=${id}&id=${this.id}`)
        .then((res) => {
          this.detailsPageInfo.subscribed = !this.detailsPageInfo.subscribed
          this.$addStorageEvent(2, 'butCountNum', !this.detailsPageInfo.subscribed)
        })
        .catch((error) => {
          if (error.response) {
            this.$message.error('收藏/取消收藏失败')
          }
        })
    }
  },
  watch: {
    id: function name (params) {
      // 调用获取歌单详细信息方法
      this.getDetailsPage()
    }
  },
  mounted () {
    // 调用获取歌单详细信息方法
    this.getDetailsPage()
  }

}
</script>

<style lang="less" scoped>
.body{
  padding: 30px 10px;
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
}
</style>
