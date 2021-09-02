export default {

  // 时间格式处理
  timeFilter: (timestamp) => {
    function format (number) {
      return number.toString().padStart(2, '0')
    }
    const date = new Date(Number.parseInt(timestamp, 10))
    const YYYY = date.getFullYear()
    const MM = date.getMonth() + 1
    const DD = date.getDate()
    return `${YYYY}-${format(MM)}-${format(DD)}`
  },

  // 播放数处理
  arrangement: (data) => {
    if (data > 100000000) {
      return parseInt(data / 100000000) + '亿'
    } else if (data > 10000) {
      return parseInt(data / 10000) + '万'
    } else {
      return data
    }
  },

  // 将数字转成以万结尾
  convert: (nums) => {
    var num = nums * 1
    num = Number(num)
    if (num === 0) {
      return num + ''
    } else
    if (num > 1 && num < 10000) {
      return num + ''
    } else {
      return (num / 10000).toFixed(2) + '万'
    }
  },

  // 将毫秒转为分秒
  times: (number) => {
    number = number / 1000
    var minute = parseInt(number / 60)
    var second = parseInt(number % 60)
    if ((second + '').length !== 2) { second = second + '0' }
    return minute + ':' + second
  },

  // 获取年龄
  getAstro (timestamp) {
    const newDate = new Date()
    newDate.setTime(timestamp)
    const birthday = newDate.toLocaleDateString(timestamp)
    const birthdayArr = birthday.split('/')
    const year = birthdayArr[0].substring(birthdayArr[0].length - 2) + '后'
    const month = birthdayArr[1]
    const day = birthdayArr[2]
    return (
      year +
      ' - ' +
      '魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯'.substr(
        month * 2 - (day < '102223444433'.charAt(month - 1) - -19) * 2,
        2
      ) +
      '座'
    )
  },

  // 歌词时间转化成秒
  formatTimeToSec (time) {
    // 分钟和秒分隔开后存放到数组中
    var arr = time.split('.')
    // 先把数字进行操作，再进行toFixed转换，最后返回转换成秒的结果
    return arr[0]
  },

  // 歌词处理
  lyricsProcess (lyrics) {
    const re = /\[([^\]]+)\]([^[]+)/g
    const lyric = []
    if (lyrics === '') return
    lyrics.replace(re, ($0, $1, $2) => {
      if ($2 !== '\n') {
        lyric.push({ time: this.$formatTimeToSec($1), lyric: $2 })
      }
    })
    return lyric
  }
}
