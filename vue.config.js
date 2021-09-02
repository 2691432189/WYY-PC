module.exports = {
  css: {
    extract: false
  },
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      // entry找到默认的打包入口，调用clear则是删除默认的打包入口
      // add添加新的打包入口
      config.entry('app').clear().add('./src/main-prod.js')
      // 使用externals设置排除项
      config.set('externals', {
        vue: 'Vue',
        axios: 'axios',
        'element-ui': 'ELEMENT',
        'vue-router': 'VueRouter',
        vuex: 'Vuex'
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      config.set('externals', {
        vue: 'Vue',
        axios: 'axios',
        'element-ui': 'ELEMENT',
        'vue-router': 'VueRouter',
        vuex: 'Vuex'
      })
    })
  }
}
