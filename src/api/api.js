// 导入axios包
import axios from 'axios'
const url = 'http://localhost:3000'
// http://localhost:3000
// http://47.97.106.32:8889
axios.defaults.baseURL = url
axios.defaults.withCredentials = true // 若跨域请求需要带 cookie 身份识别

export default {

  // 获取热门搜索方法
  getHotMusic: () => {
    return axios.get('/search/hot/detail')
  },

  // 获取搜索建议
  getDefault: (searchinfo) => {
    return axios.get('/search/suggest?keywords=' + searchinfo)
  },

  // 登录方法
  login: (loginInfo) => {
    return axios.get(`/login/cellphone?time=${new Date()}`, {
      params: loginInfo
    })
  },

  // 获取登录用户信息
  getLoginUserInfo: () => {
    return axios.get(`/user/account?time=${new Date()}`)
  },

  // 获取用户歌单方法
  getUserSongList: (uid, limit) => {
    return axios.get(`/user/playlist?uid=${uid}&limit=${limit || 99}&time=${new Date()}`)
  },

  // 退出登录方法
  signOut: () => {
    return axios.get(`/logout?time=${new Date()}`)
  },

  // 发送验证码
  sendTheVerificationCode: (phone) => {
    return axios.get('/captcha/sent?phone=' + phone)
  },

  // 注册方法
  registered: (registeredInfo) => {
    return axios.get('/register/cellphone', {
      params: registeredInfo
    })
  },

  // 获取云盘数据方法
  getMyMusicCloudDisk: (page) => {
    return axios.get(`/user/cloud?limit=200&offset=${(page - 1) * 200 || 0}&time=${new Date()}`)
  },

  // 上传网盘
  UploadCloud (formData) {
    return axios.post(`${url}/cloud?time=${Date.now()}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 获取音乐列表
  getMusicList: (url) => {
    return axios.get('/song/detail?ids=' + url)
  },

  //  获取音乐url
  getSongUrl: (url) => {
    return axios.get('/song/url?id=' + url)
  },

  // 获取歌单详细信息方法
  getDetailsPage: (id) => {
    return axios.get(`/playlist/detail?id=${id}&time=${new Date()}`)
  },

  // 收藏或取消收藏方法
  favoriteOrUnfavorite: (id, tsId) => {
    return axios.get(`/playlist/subscribe?t=${id}&id=${tsId}`)
  },

  // 获取喜欢音乐列表方法
  getLikeMusicList: (uid) => {
    return axios.get(`/likelist?uid=${uid}&time=${new Date()}`)
  },

  // 喜欢音乐
  collectMusic: (id, whether) => {
    return axios.get(`/like?id=${id}&like=${whether}`)
  },

  // 获取评论列表
  getCommentList: (id, page) => {
    return axios.get(`/comment/playlist?id=${id}&limit=50&offset=${(page - 1) * 50 || 0}`)
  },

  // 获取歌单收藏者列表
  getCollectorList: (id, page) => {
    return axios.get(`/playlist/subscribers?id=${id}&limit=51&offset=${(page - 1) * 51 || 0}`)
  },

  // 获取排行榜列表方法
  getLeaderboardList: () => {
    return axios.get('/toplist')
  },

  // 获取轮播图列表方法
  getCarouselList: () => {
    return axios.get('/banner?type=0')
  },

  // 获取推荐歌单列表方法
  getReCommendedPlaylist: () => {
    return axios.get('/personalized?limit=36')
  },

  // 获取推荐新音乐列表方法
  getNewMusicList: () => {
    return axios.get('/personalized/newsong?limit=60')
  },

  // 获取热门歌单分类方法
  getHotMusicSort: () => {
    return axios.get('/playlist/hot')
  },

  // 获取歌单方法
  getSongList: (cat, page) => {
    return axios.get(`/top/playlist?limit=40&order=hot&cat=${cat || '全部'}&offset=${(page - 1) * 40 || 0}`)
  },

  // 获取搜索结果方法
  getSearchResult: (info, page, type) => {
    return axios.get(`/cloudsearch?keywords= ${info}&type=${type}&limit=50&offset=${(page - 1) * 50}`)
  },

  // 获取热门视频分类方法
  getHotVideoSort: () => {
    return axios.get('/video/category/list')
  },

  // 获取视频列表方法
  getVideoList: (page) => {
    return axios.get(`/video/timeline/all?offset=${page * 8}`)
  },

  // 获取分类视频列表方法
  getVideoGroupList: (id, page) => {
    return axios.get(`/video/group?id=${id}&offset=${page * 8}`)
  },

  // 播放视频
  playVideo: (id) => {
    return axios.get(`/video/url?id=${id}`)
  },

  // 获取歌词
  getLyrics: (id) => {
    return axios.get(`/lyric?id=${id}`)
  },

  // 检查音乐是否可用
  checkMusic: (id) => {
    return axios.get(`/check/music?id=${id}`)
  },

  // 获取音乐评论
  getMusicComment: (id, page) => {
    return axios.get(`/comment/music?id=${id}&limit=20&offset=${page * 20}`)
  },

  // 获取视频详细信息
  getVideoDetails: (id) => {
    return axios.get('/video/detail?id=' + id)
  },

  // 获取视频Url
  getVideoUrl: (id) => {
    return axios.get('/video/url?id=' + id)
  },

  // 获取视频评论
  getVideoComment: (id) => {
    return axios.get('/comment/video?id=' + id)
  },

  // 获取视频评论
  getRelatedVideo: (id) => {
    return axios.get('/related/allvideo?id=' + id)
  },

  // 获取用户信息
  getUserInfo: (userId) => {
    return axios.get('/user/detail?uid=' + userId)
  },

  // 获取用户动态
  getUserEvent: (userId, lasttime) => {
    return axios.get(`/user/event?uid=${userId}&limit=20&lasttime=${lasttime || -1}`)
  },

  // 获取MV列表
  getMvList: (area, type, order, offset) => {
    return axios.get(`/mv/all?limit=30&area=${area}&type=${type}&order=${order}&offset=${offset}`)
  },

  // 获取Mv详情
  getMvDetails: (mvId) => {
    return axios.get('/mv/detail?mvid=' + mvId)
  },

  // 获取MVUrl
  getMvUrl: (mvId) => {
    return axios.get('/mv/url?id=' + mvId)
  },

  // 获取MV评论
  getMvComment: (mvId) => {
    return axios.get('/comment/mv?id=' + mvId)
  },

  // 获取相关MV
  getRelatedMv: (mvId) => {
    return axios.get('/simi/mv?mvid=' + mvId)
  }
}
