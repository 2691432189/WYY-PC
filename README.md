### 请自行指定音乐完整上传地址（音乐云盘）

```js
// 上传音乐
    async  httpRequest (file) {
      var formData = new FormData()
      formData.append('songFile', file.file)
      this.$http({
        method: 'post',
        // 请自行指定完整上传地址
        url: `http://localhost:3000/cloud?time=${Date.now()}`,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      }).then(res => {
        this.$message({
          message: '上传成功,可能会有延迟，请稍后尝试刷新',
          type: 'success'
        })
        // 调用获取云盘数据方法
        this.getMyMusicCloudDisk()
      }).catch(async err => {
        this.$message.error('上传失败')
        console.log(err)
      })
    },
```

### 2021/8/9

##### 1.样式改版，整体ui进行了优化

##### 2.播放组件进行更换，纯手写，相较之前的第三方组件极大的提升性能并减少bug

##### 3.数据传递全面从缓存方式升级成vuex

##### 4.增加了音乐播放详情页




### 2021/8/10

##### 1.UI微调

##### 2.删除了大量冗余代码

##### 3.对所有组件进行整合优化，较少了维护成本

##### 4.对视频页重新布局

##### 5.增加了视频播放详情页



### 2021/9/1

##### 1.UI微调

##### 2.删除冗余代码

##### 3.增加单曲循环播放

##### 4.增加歌词翻译


