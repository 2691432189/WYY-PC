### bug1

```js
mounted () {
    // 监听本地储存的值变化
    // 注:主要用于收藏/取消歌单后重新获取歌单列表，但因为某种原因重新获取的歌单没有变化,应该是
    // 服务器延迟的原因，暂时并没有什么好的解决方法
    window.addEventListener('setItem', (e) => {
      if (e.key === 'butCountNum') {
        // 调用获取用户歌单方法
        console.log('111111')
        this.getUserSongList()
      }
    })
  }
```

### bug2

```js
mounted () {
    // 因为一进入歌单页面需要获取歌单信息进行渲染，每次渲染页面{{插值表达式}}所需的数据都会因为数     // 据请求延时而报错，但是好像没有一跳转但当前组件就调用的钩子，只能退而求其次的用mounted
    //[Vue warn]: Error in render: "TypeError: Cannot read property '**' of undefined"
    // found in
    // ---> <DetailsPage> at src/components/index/detailsPage/detailsPage.vue
    //   	<ElMain> at packages/main/src/main.vue
    //      <ElContainer> at packages/container/src/main.vue... (1 recursive calls)
    //       <Anonymous>
    //         <App> at src/App.vue
    //           <Root>
    // 调用获取歌单详细信息方法
    this.getDetailsPage()
  }
```

### 待解决的问题1（已解决）

​     歌单列表会在下面展开，暂时还没有好的解决方法，后期完善应该会取消掉这个播放列表，单独做一个播放页

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

