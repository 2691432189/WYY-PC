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

