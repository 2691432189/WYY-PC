export async function play (ts, songInfo) {
  var url = ''
  const musicUrlList = []
  songInfo.forEach((element, index) => {
    if (index === songInfo.length - 1) {
      url += element.songId ? element.songId : element.id
    } else {
      url += element.songId ? element.songId + ',' : element.id + ','
    }
  })
  // 获取音乐列表
  const { data: res } = await ts.$http.getMusicList(url)
  if (res.code !== 200) return ts.$message.error('获取音乐列表失败')
  //  获取音乐url
  const { data: req } = await ts.$http.getSongUrl(url)
  if (req.code !== 200) return ts.$message.error('获取音乐URL失败')
  // 处理播放列表，整合url
  res.songs.forEach((element, index) => {
    var audio = {
      name: element.name,
      artist: element.pc ? element.pc.ar : element.ar[0].name,
      url: '',
      cover: element.al.picUrl + '?param=200y200',
      songId: element.id
    }
    res.songs[index].index = index
    audio.url = req.data.find(element1 => {
      return element1.id === element.id
    }).url
    musicUrlList.push(audio)
  })
  return {
    musicUrlList,
    songs: res.songs
  }
}
