<template>
  <div id="userInfo">
    <div id="userInfoMain">
      <!-- 动态区 -->
      <div id="eventCount">
        <div id="eventCountNav">
          {{ userInfo.nickname }}的动态
        </div>
        <!-- 动态组件 -->
        <moving
          id="moving"
          :moving-data="item"
          v-for="(item, index) in userEvent"
          :key="index"
        />
        <!-- 空动态 -->
        <el-empty
          :image-size="300"
          description="当前没有动态哦~"
          v-show="userEvent.length===0?true:false"
        />
        <!-- 加载更多 -->
        <div
          id="loadMore"
          @click="loadMore()"
          v-show="userEvent.length===0?false:true"
        >
          加载更多...
        </div>
      </div>
      <!-- 个人信息 -->
      <div id="user">
        <div id="userMain">
          <el-card>
            <!-- 用户背景图 -->
            <div id="backImage">
              <el-image
                style="width: 100%; height: 100%;border-radius: 3px;"
                :src="userInfo.backgroundUrl+'?param=800y300'||''"
                fit="cover"
              />
            </div>
            <!-- 用户头像昵称 -->
            <div id="userDetails">
              <div id="avatar">
                <img
                  style="width: 50px;"
                  :src="userInfo.avatarUrl"
                >
                {{ userInfo.nickname }}
              </div>
              <div>
                等级：8级
              </div>
              <div>
                年龄：{{ $getAstro(userInfo.birthday) }}
              </div>
              <div id="signature">
                <p> 介绍：</p><p>{{ userInfo.signature }}</p>
              </div>
            </div>
            <!-- 动态统计 -->
            <div id="statistics">
              <div>
                <p>动态</p>
                <p>{{ userInfo.eventCount }}</p>
              </div>
              <div>
                <p>关注</p>
                <p>{{ userInfo.newFollows }}</p>
              </div>
              <div>
                <p>粉丝</p>
                <p>{{ userInfo.followeds }}</p>
              </div>
            </div>
          </el-card>
          <!-- 我的歌单 -->
          <el-card id="mySongList">
            <div>
              我创建的歌单
            </div>
            <!-- 歌单 -->
            <el-row
              :gutter="80"
              type="flex"
              class="reCommendedPlay"
            >
              <el-col
                :span="12"
                v-for="item in mySongList"
                :key="item.id"
              >
                <div>
                  <el-image
                    style="width: 100%; height: 80%; border-radius: 10px;"
                    :src="item.coverImgUrl+'?param=100y100'"
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
            <!-- 歌单 -->
          </el-card>
          <el-card id="collectSongList">
            <div>
              我收藏的歌单
            </div>
            <!-- 歌单 -->
            <el-row
              :gutter="80"
              type="flex"
              class="reCommendedPlay"
            >
              <el-col
                :span="12"
                v-for="item in collectSongList"
                :key="item.id"
              >
                <div>
                  <el-image
                    style="width: 100%; height: 80%; border-radius: 10px"
                    :src="item.coverImgUrl+'?param=100y100'"
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
            <!-- 歌单 -->
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moving from '../../../components/moving.vue'
export default {
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 用户信息
      userInfo: {
        backgroundUrl: ''
      },
      //  用户创建的歌单
      mySongList: [],
      //  用户收藏的歌单
      collectSongList: [],
      // 用户动态
      userEvent: [],
      // 上一次获取动态返回的值,用于获取下一页动态
      lasttime: -1,
      // 本次获取动态的数量
      num: 0
    }
  },
  methods: {
    // 获取用户信息方法
    async getUserInfo () {
      const { data: res } = await this.$http.getUserInfo(this.userId)
      if (res.code !== 200) return this.$message.error('获取用户信息失败')
      this.userInfo = res.profile
    },
    // 获取用户歌单方法
    async getUserSongList () {
      const { data: res } = await this.$http.getUserSongList(this.userId)
      const mySongList = []
      const collectSongList = []
      if (res.playlist) {
        res.playlist.forEach(item => {
          if (item.userId === parseInt(this.userInfo.userId)) {
            mySongList.push(item)
          } else {
            collectSongList.push(item)
          }
        })
      }
      this.mySongList = mySongList
      this.collectSongList = collectSongList
    },
    // 获取用户动态
    async getUserEvent () {
      const { data: res } = await this.$http.getUserEvent(this.userId, this.lasttime)
      if (res.code !== 200) return this.$message.error('获取用户动态失败')
      this.num = res.events.length
      const userEvent = []
      res.events.forEach(item => {
        if (item.type === 35 || item.type === 57 || item.type === 18 || item.type === 39) {
          userEvent.push(item)
        }
      })
      this.userEvent = [...this.userEvent, ...userEvent]
      this.lasttime = res.lasttime
    },
    // 跳转歌单详情页
    goInfoPage (id) {
      this.$router.push('/DetailsPage*/' + id)
    },
    // 加载更多动态方法
    loadMore () {
      if (this.num % 20 === 0) {
        this.getUserEvent()
      } else {
        return this.$message.error('没有更多哟~')
      }
    }
  },
  components: {
    moving
  },
  created () {
    // 调用获取用户信息方法
    this.getUserInfo()
    // 调用获取用户歌单方法
    this.getUserSongList()
    // 获取用户动态
    this.getUserEvent()
  }
}
</script>

<style lang="less" scoped>
  #userInfo {
    height: 100%;
  }
  #userInfoMain {
    display: flex;
    padding-top: 30px;
    height: 100%;
    box-sizing: border-box;
    // 动态区
    #eventCount {
      flex: 50;
      height: 100%;
      overflow: auto;
      // 动态Nav
      #eventCountNav {
        font-size: 18px;
        font-weight: 700;
      }
      #moving {
        padding:  20px;
        border-bottom: 1px solid #c9c9c9;
      }
      .el-empty {
        height: 90%;
      }
    }
    // 个人信息
    #user {
      position: relative;
      flex: 35;
      height: 100%;
      overflow: auto;
      #userMain {
        position: absolute;
        left: 50px;
        width: 400px;
        height: 100%;
         // 用户背景图
        #backImage {
          height: 150px;
          img {
            width: 100%;
          }
        }
        #userDetails {
          padding-left: 30px;
          border-bottom: 1px solid rgb(211, 211, 211);
          font-size: 14px;
          color: rgb(131, 130, 130);
          div {
            padding-bottom: 10px;
          }
          // 介绍
          #signature {
            display: flex;
            :nth-child(1) {
              flex: 5;
            }
            :nth-child(2) {
              flex: 33;
            }
          }
          // 用户头像昵称
          #avatar {
            font-weight: 700;
            font-size: 16px;
            color: #000;
            img {
              margin-right: 10px;
              border-radius: 3px;
              vertical-align: middle;
              transform: translateY(-15px);
              z-index: 9999;
            }
          }
        }
        // 统计数据
        #statistics {
          display: flex;
          margin-top: 20px;
          div {
            flex:1;
            text-align: center;
            font-size: 14px;
            color: #9a93be;
            p {
              padding-bottom: 10px;
            }
          }
        }
        .el-card {
          margin-bottom: 20px;
        }
      }
    }
  }
</style>
