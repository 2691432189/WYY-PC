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

### 待解决的问题1

​     这个歌单列表会在下面展开，暂时还没有好的解决方法，后期完善应该会取消掉这个播放列表，单独做一个播放页

![](C:\Users\KumikoHomae\Desktop\Snipaste_2021-05-19_08-25-24.png)