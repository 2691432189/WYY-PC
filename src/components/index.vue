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
        Footer
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
        default-active="1"
      >
        <el-menu-item
          index="1"
          @click="ShowLoginOrRegistered=true"
        >
          登录
        </el-menu-item>
        <el-menu-item
          index="2"
          @click="ShowLoginOrRegistered=false"
        >
          注册
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
          :rules="loginFormRules"
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
          label-width="70px"
          class="demo-ruleForm"
          :model="registeredInfo"
        >
          <el-form-item
            label="手机号"
          >
            <el-input v-model="registeredInfo.phone" />
          </el-form-item>
          <el-form-item
            label="验证码"
          >
            <el-input v-model="registeredInfo.captcha" />
          </el-form-item>
          <el-form-item
            label="密码"
          >
            <el-input v-model="registeredInfo.password" />
          </el-form-item>
          <el-form-item
            label="用户名"
          >
            <el-input v-model="registeredInfo.nickname" />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          class="loginBtn"
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
      loginFormRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: phonePass, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 用户歌单列表
      UserSongList: []

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
    // 注册方法
    registered () {

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
.index-page {
  margin: 0 auto;
  width: 100%;
  height: 760px;
  background-color: #ffffff;
}
.el-header {
  background-color: #ec4141;
  color: #fff;
  font-size: 20px;
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
  .login{
  margin-top: 12px;
  }
  .userName{
    font-size: 14px;
    a{
      text-decoration:none;
      color:#fff;
    }
  }
  .sign-out{
    transform: translateY(-13px);
  }
}
.el-aside {
  height: 630px;
  .el-menu {
    height: 100%;
  }
  .findMusic {
    margin: 10px 0 10px 20px;
    color: #ccc;
    font-size: 14px;
  }
}
.el-footer {
  border-top: 1px solid #ccc;
}
.el-menu {
  margin-bottom: 5px;
}
.el-menu-item {
  overflow: hidden;
  white-space: nowrap;
  /*当文本溢出包含元素时，以省略号表示超出的文本*/
  text-overflow: ellipsis;
}
.loginBtn {
  margin-left: 82%;
}
</style>
