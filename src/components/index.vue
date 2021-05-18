<template>
  <div class="index-page">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <el-row>
          <!-- logo -->
          <el-col :span="3">
            <i class="el-icon-video-play icon" />
            云音乐
          </el-col>
          <!-- logo -->
          <el-col :span="16">
            <!-- 前后退 -->
            <el-button
              size="mini"
              type="danger"
              class="el-icon-arrow-left btn-go"
              circle
              @click="btnGo('go')"
            />
            <el-button
              size="mini"
              type="danger"
              class="el-icon-arrow-right btn-go"
              circle
              @click="btnGo('down')"
            />
            <!-- 前后退 -->
            <!-- 搜索 -->
            <el-input
              placeholder="搜索"
              clearable
              v-popover:popover
              @focus="getHotMusic"
              size="mini"
              v-model="searchinfo"
            >
              <i
                slot="prefix"
                class="el-input__icon el-icon-search"
              />
            </el-input>
            <!-- 搜索关键词 -->
            <el-popover
              ref="popover"
              placement="bottom-start"
              width="200"
              trigger="focus"
              heigth="200"
            >
              <h4>{{ ifShow?'热搜榜':'关键词' }}</h4>
              <div v-if="ifShow">
                <el-row
                  v-for="(item, index) in hotMusicList"
                  :key="index"
                >
                  <el-col :span="24">
                    <el-link
                      target="_red"
                      @click="search(item.searchWord)"
                    >
                      <div>{{ (index + 1 )+ ' . '+ item.searchWord }}</div>
                    </el-link>
                  </el-col>
                </el-row>
              </div>
              <div v-else>
                <el-row
                  v-for="(item, index) in lefaultList"
                  :key="index"
                >
                  <el-col :span="24">
                    <el-link
                      target="_blank"
                      @click="search(item.name)"
                    >
                      <div>{{ (index +1 )+ '.'+ item.name }}</div>
                    </el-link>
                  </el-col>
                </el-row>
              </div>
            </el-popover>
            <!-- 搜索关键词 -->
            <!-- 搜索 -->
          </el-col>
          <!-- 登录 -->
          <el-col
            :span="1"
            class="login"
          >
            <el-avatar :src="userInfo.img?userInfo.img:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" />
          </el-col>
          <el-col
            :span="3"
            class="userName"
          >
            <a
              href="javascript:;"
              @click="whetherShowLoginDialogBox=true"
            > {{ userInfo.name?userInfo.name:'未登录' }}</a>
          </el-col>
          <!-- 登录 -->
          <el-col
            :span="1"
            class="login"
          >
            <el-button
              type="danger"
              size="mini"
              class="sign-out"
              v-if="userInfo.name!==''"
              @click="signOut()"
            >
              登出
            </el-button>
          </el-col>
        </el-row>
      </el-header>
      <!-- 头部 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <el-menu
            :default-active="sidebarIndex"
            class="el-menu-vertical-demo"
            active-text-color="#ec4141"
            @select="select"
            :router="true"
          >
            <el-menu-item index="/DiscoverMusic">
              <span slot="title">发现音乐</span>
            </el-menu-item>
            <el-menu-item index="/Video">
              <span slot="title">视频</span>
            </el-menu-item>
            <el-menu-item index="/Anchor">
              <span slot="title">直播</span>
            </el-menu-item>
            <el-menu-item index="/PrivateFM">
              <span slot="title">私人FM</span>
            </el-menu-item>
            <div class="findMusic">
              我的歌单
              <i class="el-icon-arrow-down" />
            </div>
            <el-menu-item
              :index="'/DetailsPage'+item.id"
              v-for="item in UserSongList"
              :key="item.id"
            >
              <span slot="title">{{ item.name }}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <!-- 侧边栏 -->
        <!-- 主体 -->
        <el-main>
          <router-view />
        </el-main>
        <!-- 主体 -->
      </el-container>
      <!-- 下播放栏 -->
      <el-footer>
        <aplayer
          :audio="audio"
          :lrc-type="3"
        />
      </el-footer>
      <!-- 下播放栏 -->
    </el-container>
    <!-- 登录对话框 -->
    <el-dialog
      :visible.sync="whetherShowLoginDialogBox"
      width="30%"
    >
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        :default-active="ShowLoginOrRegistered+''"
      >
        <el-menu-item
          index="true"
          @click="ShowLoginOrRegistered=true"
        >
          登录
        </el-menu-item>
        <el-menu-item
          index="false"
          @click="ShowLoginOrRegistered=false"
        >
          注册/修改密码用户名
        </el-menu-item>
      </el-menu>
      <!-- 登录卡片 -->
      <el-card
        class="box-card"
        v-if="ShowLoginOrRegistered"
      >
        <el-form
          size="mini"
          label-width="70px"
          class="demo-ruleForm"
          :model="loginInfo"
          ref="loginFormRef"
          :rules="formRules"
        >
          <el-form-item
            label="手机号"
            prop="phone"
          >
            <el-input v-model="loginInfo.phone" />
          </el-form-item>
          <el-form-item
            prop="password"
            label="密码"
          >
            <el-input
              type="password"
              v-model="loginInfo.password"
            />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          class="loginBtn"
          @click="login"
        >
          登录
        </el-button>
      </el-card>
      <!-- 登录卡片 -->
      <!-- 注册卡片 -->
      <el-card
        class="box-card"
        v-else
      >
        <el-form
          size="mini"
          ref="registeredFormRef"
          label-width="70px"
          class="demo-ruleForm"
          :model="registeredInfo"
          :rules="formRules"
        >
          <el-form-item
            label="手机号"
            prop="phone"
          >
            <el-input
              v-model="registeredInfo.phone"
              class="input-with-select"
            >
              <el-button
                slot="append"
                @click="SendTheVerificationCode"
                :disabled="WhetherToDisableSendTheVerificationCodeBtn"
              >
                发送验证码
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item
            label="验证码"
          >
            <el-input v-model="registeredInfo.captcha" />
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
          >
            <el-input v-model="registeredInfo.password" />
          </el-form-item>
          <el-form-item
            label="用户名"
            prop="nickname"
          >
            <el-input v-model="registeredInfo.nickname" />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          class="loginBtn"
          :disabled="WhetherToDisableRegistrationBtn"
          @click="registered"
        >
          注册
        </el-button>
      </el-card>
      <!-- 注册卡片 -->
    </el-dialog>
    <!-- 登录对话框 -->
  </div>
</template>

<script>
export default {
  data () {
    // 手机号自定义验证
    var phoneTest = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    var phonePass = (rule, value, callback) => {
      var is = phoneTest.test(value)
      if (!is) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      // 热门搜索列表
      hotMusicList: [],
      // 搜索信息
      searchinfo: '',
      // 判断显示热搜还是关键词
      ifShow: true,
      // 搜索建议列表
      lefaultList: [],
      // 用户信息
      userInfo: {
        img: window.localStorage.getItem('img') || '',
        name: window.localStorage.getItem('name') || ''
      },
      // 侧边栏索引
      sidebarIndex: '',
      // 是否显示登录/注册对话框
      whetherShowLoginDialogBox: false,
      // 判断显示登录/注册页面
      ShowLoginOrRegistered: true,
      // 登录信息
      loginInfo: {
        phone: '',
        password: ''
      },
      // 注册信息
      registeredInfo: {
        captcha: '',
        phone: '',
        password: '',
        nickname: ''
      },
      // 表单验证
      formRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: phonePass, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 用户歌单列表
      UserSongList: [],
      // 是否禁用注册按钮
      WhetherToDisableRegistrationBtn: true,
      // 是否禁用发送验证码按钮
      WhetherToDisableSendTheVerificationCodeBtn: true,
      // 音乐播放控件
      audio: [
        {
          name: 'STYX HELIX',
          artist: '纳豆',
          url: 'http://m7.music.126.net/20210518102441/1d91f532c903bc987ed2430ead8fb07f/ymusic/db2e/5e0f/6072/102f828049576789c4746b705da293cc.mp3',
          cover: 'https://p2.music.126.net/zS92B4iboeu50sEkXBeLfA==/1400777824444934.jpg', // prettier-ignore
          lrc: 'https://cdn.moefe.org/music/lrc/thing.lrc'
        },
        {
          name: 'Stay Alive',
          artist: '泠鸢yousa',
          url: 'http://m8.music.126.net/20210518102745/4a6b583b08f2235922caa37ca051bd26/ymusic/97b1/ed24/31d6/c63abbf19bebc007a06c973ce06281d1.mp3',
          cover: 'https://p2.music.126.net/AAq1qOhfyrClGK1mg3mGYQ==/18776360067593424.jpg', // prettier-ignore
          lrc: 'https://cdn.moefe.org/music/lrc/kyoukiranbu.lrc'
        },
        {
          name: 'Redo',
          artist: 'Hanser',
          url: 'http://m8.music.126.net/20210518102939/6da72f1342f03dbfe9caea22c2f3bfe8/ymusic/37f5/6b21/87b2/24a2352671a3208cdd0dd63bfbc65f10.mp3',
          cover: 'https://p1.music.126.net/UE0lZwuiYahnGO_JT_dddQ==/1377688078403834.jpg', // prettier-ignore
          lrc: 'https://cdn.moefe.org/music/lrc/kiss.lrc'
        }
      ]

    }
  },
  methods: {
    // 页面前进后退方法
    btnGo (info) {
      if (info === 'go') {
        this.$router.go(1)
      } else {
        this.$router.go(-1)
      }
    },
    // 获取热门搜索方法
    async getHotMusic () {
      const { data: res } = await this.$http.get('/search/hot/detail')
      if (res.code !== 200) return this.$message.error('获取热搜失败')
      this.hotMusicList = res.data
    },
    // 获取搜索建议
    async  getDefault () {
      this.ifShow = false
      const { data: res } = await this.$http.get('/search/suggest?keywords=' + this.searchinfo)
      if (res.code !== 200) return this.$message.error('获取搜索建议失败')
      this.lefaultList = res.result.songs
    },
    // 搜索方法
    async search (info) {
      const res = await this.$http.get('/cloudsearch?keywords= ' + info || this.searchinfo)
      this.searchinfo = ''
      console.log(res)
    },
    // 储存侧边栏索引，防止刷新
    select (index) {
      localStorage.setItem('index', '/' + index.split('/')[1])
      // 储存发现音乐页面路由，实现切换左侧边栏重设发现音乐页面侧边栏
      localStorage.setItem('DiscoverMusicPageIndex', '/DiscoverMusic/PersonalRecommendation')
    },
    // 获取侧边栏索引
    getSidebarIndex () {
      this.sidebarIndex = localStorage.getItem('index')
    },
    // 登录方法
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (valid) {
          // 请求登录
          const { data: res } = await this.$http.get('/login/cellphone', {
            params: this.loginInfo
          })
          console.log(res)
          if (res.code !== 200) return this.$message.error('登录失败')
          this.loginInfo.phone = ''
          this.loginInfo.password = ''
          this.whetherShowLoginDialogBox = false
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          // 调用获取登录用户信息
          this.getLoginUserInfo()
        }
      })
    },
    // 获取登录用户信息
    async  getLoginUserInfo () {
      const { data: res } = await this.$http.get('/user/account')
      if (res.profile) {
        window.localStorage.setItem('uid', res.profile.userId)
        window.localStorage.setItem('img', res.profile.avatarUrl)
        window.localStorage.setItem('name', res.profile.nickname)
        this.userInfo.img = res.profile.avatarUrl
        this.userInfo.name = res.profile.nickname
        // 调用获取用户歌单方法
        this.getUserSongList()
      }
    },
    // 获取用户歌单方法
    async getUserSongList () {
      const { data: res } = await this.$http.get('/user/playlist?uid=' + window.localStorage.getItem('uid'))
      this.UserSongList = res.playlist
    },
    // 退出登录方法
    async  signOut () {
      const { data: res } = await this.$http.get('/logout')
      if (res.code !== 200) return this.$message.error('退出失败')
      this.UserSongList = []
      this.userInfo.img = ''
      this.userInfo.name = ''
      window.localStorage.removeItem('uid')
      window.localStorage.removeItem('img')
      window.localStorage.removeItem('name')
    },
    // 发送验证码
    async  SendTheVerificationCode () {
      const { data: res } = await this.$http.get('/captcha/sent?phone=' + this.registeredInfo.phone)
      if (res.code !== 200) return this.$message.error('发送验证码失败')
      this.$message({
        message: '发送验证码成功',
        type: 'success'
      })
    },
    // 注册方法
    registered () {
      this.$refs.registeredFormRef.validate(async (valid) => {
        var res = {}
        if (valid) {
          this.$http.get('/register/cellphone', {
            params: this.registeredInfo
          })
            .then((res) => {
              this.$message({
                message: '注册成功',
                type: 'success'
              })
              this.ShowLoginOrRegistered = true
            })
            .catch((error) => {
              if (error.response) {
                this.$message.error(error.response.data.message)
              }
            })

          // if (res.code !== 200) return this.$message.error('退出失败')
        }
        console.log(res)
      })
    }

  },
  watch: {
    // 监听搜索框，判断显示推荐或者关键词
    searchinfo: function (params) {
      if (params.length !== 0) {
        this.getDefault()
      } else {
        this.ifShow = true
      }
    },
    // 监听注册信息，当验证码为4位时，启用注册按钮
    'registeredInfo.captcha': {
      handler: function (captcha) {
        if (captcha.length === 4) {
          this.WhetherToDisableRegistrationBtn = false
        } else {
          this.WhetherToDisableRegistrationBtn = true
        }
      }
    },
    // 监听注册信息，当手机号为11位时，启用发送验证码按钮
    'registeredInfo.phone': {
      handler: function (phone) {
        if (phone.length === 11) {
          this.WhetherToDisableSendTheVerificationCodeBtn = false
        } else {
          this.WhetherToDisableSendTheVerificationCodeBtn = true
        }
      }
    }
  },
  updated () {
    // 调用储存侧边栏索引方法
    this.select(this.$route.path)
    // 调用获取侧边栏索引方法
    this.getSidebarIndex()
  },
  created () {
    this.getUserSongList()
  }
}
</script>

<style lang="less" scoped>
// 主体页面
.index-page {
  margin: 0 auto;
  width: 100%;
  height: 730px;
  background-color: #ffffff;
}
// 头部
.el-header {
  background-color: #ec4141;
  color: #fff;
  font-size: 20px;
  // 前进后退和搜索
  .el-col {
    height: 60px;
    line-height: 60px;
    .icon {
      font-size: 30px;
      vertical-align: -3px;
    }
    .btn-go{
      color: #ff9898;
      background-color: #e63f3f;
    }
    .el-input{
      margin-left: 20px;
      width: 240px;
    }
  }
  .tableLimit tr td .cell{
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  // 登录
  .login{
  margin-top: 12px;
  }
  // 用户名
  .userName{
    font-size: 14px;
    a{
      text-decoration:none;
      color:#fff;
    }
  }
  // 退出登录按钮
  .sign-out{
    transform: translateY(-13px);
  }
}
// 侧边栏
.el-aside {
  height: 620px;
  border-right: solid 1px #e6e6e6;
  .el-menu {
    overflow:hidden;
    border-right: 0px;
  }
  .findMusic {
    margin: 10px 0 10px 20px;
    color: #ccc;
    font-size: 14px;
  }
  // 每一个标签
  .el-menu-item {
  overflow: hidden;
  white-space: nowrap;
  /*当文本溢出包含元素时，以省略号表示超出的文本*/
  text-overflow: ellipsis;
  }
}
// 播放栏控件
.el-footer {
  box-sizing: border-box;
  border-top: 1px solid #ccc;
  .aplayer {
    width: 100%;
  }
}
// 登录注册按钮
.loginBtn {
  margin-left: 82%;
}
// 注意内容区域
.el-main{
  padding: 0px 20px 0px;
}
</style>
