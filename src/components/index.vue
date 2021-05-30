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
              @keyup.enter.native="search()"
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
      <el-container :class="{bodyHeight:onListShowHide}">
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
            <div class="findMusic">
              我的歌单
              <i class="el-icon-arrow-down" />
            </div>
            <el-menu-item
              :index="'/DetailsPage'+index+'/'+item.id"
              v-for="(item,index) in UserSongList"
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
          :lrc-type="0"
          ref="aplayer"
          :list-max-height="150"
          @listShow="handleEvent"
          @listHide="handleEvent"
          :list-folded="true"
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
        :default-active="showLoginOrRegistered+''"
      >
        <el-menu-item
          index="true"
          @click="showLoginOrRegistered=true"
        >
          登录
        </el-menu-item>
        <el-menu-item
          index="false"
          @click="showLoginOrRegistered=false"
        >
          注册/修改密码用户名
        </el-menu-item>
      </el-menu>
      <!-- 登录卡片 -->
      <el-card
        class="box-card"
        v-if="showLoginOrRegistered"
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
                @click="sendTheVerificationCode"
                :disabled="whetherToDisableSendTheVerificationCodeBtn"
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
          :disabled="whetherToDisableRegistrationBtn"
          @click="registered"
        >
          注册
        </el-button>
        {{ audioList }}
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
      showLoginOrRegistered: true,
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
      whetherToDisableRegistrationBtn: true,
      // 是否禁用发送验证码按钮
      whetherToDisableSendTheVerificationCodeBtn: true,
      // 音乐播放控件
      audio: [],
      onListShowHide: false
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
    search (info) {
      var infos = info || this.searchinfo || null
      this.searchinfo = ''
      this.$router.push('/Search/' + infos)
    },
    aaaaa () {
      console.log(111111111111111111)
    },
    // 储存侧边栏索引，防止刷新
    select (index) {
      if (index === '/DiscoverMusic/PersonalRecommendation' || index === '/DiscoverMusic/SongList' || index === '/DiscoverMusic/Leaderboard') {
        index = '/' + index.split('/')[1]
      }
      localStorage.setItem('index', index)
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
        window.localStorage.setItem('login', true)
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
      window.localStorage.removeItem('login')
    },
    // 发送验证码
    async  sendTheVerificationCode () {
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
        if (valid) {
          this.$http.get('/register/cellphone', {
            params: this.registeredInfo
          })
            .then((res) => {
              this.$message({
                message: '注册成功',
                type: 'success'
              })
              this.showLoginOrRegistered = true
            })
            .catch((error) => {
              if (error.response) {
                this.$message.error(error.response.data.message)
              }
            })

          // if (res.code !== 200) return this.$message.error('退出失败')
        }
      })
    },
    // 控制播放栏展开/关闭
    handleEvent () {
      this.onListShowHide = !this.onListShowHide
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
          this.whetherToDisableRegistrationBtn = false
        } else {
          this.whetherToDisableRegistrationBtn = true
        }
      }
    },
    // 监听注册信息，当手机号为11位时，启用发送验证码按钮
    'registeredInfo.phone': {
      handler: function (phone) {
        if (phone.length === 11) {
          this.whetherToDisableSendTheVerificationCodeBtn = false
        } else {
          this.whetherToDisableSendTheVerificationCodeBtn = true
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
    // 调用获取用户歌单
    this.getUserSongList()
  },
  mounted () {
    this.$refs.aplayer.hideList()
    // 监听本地储存的值变化
    // 注:主要用于收藏/取消歌单后重新获取歌单列表，但因为某种原因重新获取的歌单没有变化,应该是
    // 服务器延迟的原因，暂时并没有什么好的解决方法
    window.addEventListener('setItem', (e) => {
      if (e.key === 'butCountNum') {
        var music = window.localStorage.getItem('currentlyPlayingMusic')
        this.audio = this.$store.state.audioList
        window.setTimeout(() => {
          if (music) {
            this.$refs.aplayer.switch(music * 1)
            window.localStorage.removeItem('currentlyPlayingMusic')
          } else {
            this.$refs.aplayer.switch(0)
          }
        }, 200)
      }
      this.$refs.aplayer.play()
    })
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
  height: 82vh;
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
    margin: 5px 0;
    width: 100%;
    z-index: 999;
  }
}
// 登录注册按钮
.loginBtn {
  margin-left: 82%;
}
// 注意内容区域
.el-main{
  padding: 0px 20px 0px;
  overflow: auto;
  height: 82vh;
}
.bodyHeight{
  height: 62vh !important;
}
</style>
