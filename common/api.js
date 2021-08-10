// 导入axios包
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.withCredentials = true // 若跨域请求需要带 cookie 身份识别

export default {

  // 获取热门搜索方法
  getHotMusic: () => {
    return new Promise((resolve) => {
      resolve(axios.get('/search/hot/detail'))
    })
  },

  // 获取搜索建议
  getDefault: (searchinfo) => {
    return new Promise((resolve) => {
      resolve(axios.get('/search/suggest?keywords=' + searchinfo))
    })
  },

  // 登录方法
  login: (loginInfo) => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/login/cellphone', {
          params: loginInfo
        })
      )
    })
  },

  // 获取登录用户信息
  getLoginUserInfo: () => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/user/account')
      )
    })
  },

  // 获取用户歌单方法
  getUserSongList: (uid) => {
    return new Promise((resolve) => {
      resolve(
        axios.get(
          '/user/playlist?uid=' + uid
        )
      )
    })
  },

  // 退出登录方法
  signOut: () => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/logout')
      )
    })
  },

  // 发送验证码
  sendTheVerificationCode: (phone) => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/captcha/sent?phone=' + phone)
      )
    })
  },

  // 注册方法
  registered: (registeredInfo) => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/register/cellphone', {
          params: registeredInfo
        })
      )
    })
  },

  // 获取云盘数据方法
  getMyMusicCloudDisk: (page) => {
    return new Promise((resolve) => {
      resolve(
        axios.get(`/user/cloud?limit=100&offset=${(page - 1) * 100 || 0}`)
      )
    })
  },

  // 获取音乐列表
  getMusicList: (url) => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/song/detail?ids=' + url)
      )
    })
  },

  //  获取音乐url
  getSongUrl: (url) => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/song/url?id=' + url)
      )
    })
  },

  // 获取歌单详细信息方法
  getDetailsPage: (id) => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/playlist/detail?id=' + id)
      )
    })
  },

  // 收藏或取消收藏方法
  favoriteOrUnfavorite: (id, tsId) => {
    return new Promise((resolve) => {
      resolve(
        axios.get(`/playlist/subscribe?t=${id}&id=${tsId}`)
      )
    })
  },

  // 获取喜欢音乐列表方法
  getLikeMusicList: (uid) => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/likelist?uid=' + uid)
      )
    })
  },

  // 喜欢音乐
  collectMusic: (id, whether) => {
    return new Promise((resolve) => {
      resolve(
        axios.get(`/like?id=${id}&like=${whether}`)
      )
    })
  },

  // 获取评论列表
  getCommentList: (id, page) => {
    return new Promise((resolve) => {
      resolve(
        axios.get(`/comment/playlist?id=${id}&limit=50&offset=${(page - 1) * 50 || 0}`)
      )
    })
  },

  // 获取歌单收藏列表
  getCollectorList: (id, page) => {
    return new Promise((resolve) => {
      resolve(
        axios.get(`/playlist/subscribers?id=${id}&limit=51&offset=${(page - 1) * 51 || 0}`)
      )
    })
  },

  // 获取排行榜列表方法
  getLeaderboardList: () => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/toplist')
      )
    })
  },

  // 获取轮播图列表方法
  getCarouselList: () => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/banner?type=0')
      )
    })
  },

  // 获取推荐歌单列表方法
  getReCommendedPlaylist: () => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/personalized?limit=16')
      )
    })
  },

  // 获取推荐新音乐列表方法
  getNewMusicList: () => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/personalized/newsong?limit=60')
      )
    })
  },

  // 获取热门歌单分类方法
  getHotMusicSort: () => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/playlist/hot')
      )
    })
  },

  // 获取歌单方法
  getSongList: (cat, page) => {
    return new Promise((resolve) => {
      resolve(
        axios.get(`/top/playlist?limit=40&order=hot&cat=${cat || '全部'}&offset=${(page - 1) * 40 || 0}`)
      )
    })
  },

  // 获取搜索音乐结果方法
  getSearchMusicResult: (info, page) => {
    return new Promise((resolve) => {
      resolve(
        axios.get(`/cloudsearch?keywords= ${info}&type=1&limit=100&offset=${(page - 1) * 100}`)
      )
    })
  },

  // 获取搜索歌单结果方法
  getSearchmusicDetailsPageResult: (info, page) => {
    return new Promise((resolve) => {
      resolve(
        axios.get(`/cloudsearch?keywords= ${info}&type=1000&limit=100&offset=${(page - 1) * 100}`)
      )
    })
  },

  // 获取热门视频分类方法
  getHotVideoSort: () => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/video/category/list')
      )
    })
  },

  // 获取视频列表方法
  getVideoList: (page) => {
    return new Promise((resolve) => {
      resolve(
        axios.get(`/video/timeline/all?offset=${page * 8}`)
      )
    })
  },

  // 获取分类视频列表方法
  getVideoGroupList: (id, page) => {
    return new Promise((resolve) => {
      resolve(
        axios.get(`/video/group?id=${id}&offset=${page * 8}`)
      )
    })
  },

  // 播放视频
  playVideo: (id) => {
    return new Promise((resolve) => {
      resolve(
        axios.get(`/video/url?id=${id}`)
      )
    })
  },

  // 获取歌词
  getLyrics: (id) => {
    return new Promise((resolve) => {
      resolve(
        axios.get(`/lyric?id=${id}`)
      )
    })
  },

  // 检查音乐是否可用
  checkMusic: (id) => {
    return new Promise((resolve) => {
      resolve(
        axios.get(`/check/music?id=${id}`)
      )
    })
  },

  // 获取音乐评论
  getMusicComment: (id, page) => {
    return new Promise((resolve) => {
      resolve(
        axios.get(`/comment/music?id=${id}&limit=20&offset=${page * 20}`)
      )
    })
  },

  // 获取视频详细信息
  getVideoDetails: (id) => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/video/detail?id=' + id)
      )
    })
  },

  // 获取视频Url
  getVideoUrl: (id) => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/video/url?id=' + id)
      )
    })
  },

  // 获取视频评论
  getVideoComment: (id) => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/comment/video?id=' + id)
      )
    })
  },

  // 获取视频评论
  getRelatedVideo: (id) => {
    return new Promise((resolve) => {
      resolve(
        axios.get('/related/allvideo?id=' + id)
      )
    })
  }
}
