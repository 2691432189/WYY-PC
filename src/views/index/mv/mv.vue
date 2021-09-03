<template>
  <div
    id="mv"
    class="mv"
    v-infinite-scroll="loadMoreMv"
    :infinite-scroll-distance="20"
    :infinite-scroll-delay="200"
  >
    <!-- 回到顶部 -->
    <el-backtop
      target=".mv"
      style="right: 6vh; color:red;"
      :bottom="250"
      class="backtop"
    />
    <!-- 回到顶部 -->
    <div id="allMv">
      全部MV
    </div>
    <!-- 全部分类 -->
    <div class="mvSortNav">
      <div id="area">
        地区:
        <span
          v-for="(item, index) in area"
          :key="index"
          :class="{sortItem:item === currentArea}"
          @click="changeSort (0, item)"
        >
          {{ item }}
        </span>
      </div>
      <div id="type">
        类型:
        <span
          v-for="(item, index) in type"
          :key="index"
          :class="{sortItem:item === currentType}"
          @click="changeSort (1, item)"
        >
          {{ item }}
        </span>
      </div>
      <div id="order">
        排序:
        <span
          v-for="(item, index) in order"
          :key="index"
          :class="{sortItem:item === currentOrder}"
          @click="changeSort (2, item)"
        >
          {{ item }}
        </span>
      </div>
    </div>
    <!-- 全部分类 -->
    <!-- MV列表 -->
    <el-row
      :gutter="80"
      type="flex"
      class="reCommendedPlay"
    >
      <el-col
        :span="4"
        v-for="item in mvList"
        :key="item.id"
      >
        <div>
          <el-image
            style="width: 100%; height: 80%; border-radius: 10px"
            :src="item.cover+'?param=160y160'"
            fit="contain"
          />
          <!-- 播放数量 -->
          <div
            id="views"
            class="el-icon-caret-right"
          >
            {{ $arrangement(item.playCount) }}
          </div>
          <i
            class="el-icon-video-play"
            @click="playMv(item.id)"
          />
        </div>
        <div
          class="reCommendedPlayName"
          @click="playMv(item.id)"
        >
          {{ item.name }}
        </div>
      </el-col>
    </el-row>
    <!-- MV列表 -->
    <div id="loadMore">
      加载更多...
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // MV列表
      mvList: [],
      // MV列表当前页
      mvListage: 0,
      currentArea: '全部',
      currentType: '全部',
      currentOrder: '最热',
      area: ['全部', '内地', '港台', '欧美', '日本', '韩国'],
      type: ['全部', '原生', '官方版', '现场版', '网易出品'],
      order: ['最热', '最新', '上升最快']
    }
  },
  methods: {
    // 获取MV列表方法
    async  getMvList () {
      const { data: res } = await this.$http.getMvList(this.currentArea, this.currentType, this.currentOrder, this.mvListage)
      if (res.code !== 200) return this.$message.error('获取MV列表失败')
      this.mvList = [...this.mvList, ...res.data]
    },
    // 加载更多MV方法
    loadMoreMv () {
      this.mvListage += 30
      this.getMvList()
    },
    loadMoreMvs () {
      console.log(11111111111111)
    },
    // 跳转MV播放页
    playMv (id) {
      this.$router.push('/MvPlayerPage/' + id)
    },
    // 切换分类
    changeSort (id, name) {
      if (id === 0) {
        if (name === this.currentArea) return this.$message.error(`已经在${name}分类了哦~`)
        this.currentArea = name
      } else if (id === 1) {
        if (name === this.currentType) return this.$message.error(`已经在${name}分类了哦~`)
        this.currentType = name
      } else if (id === 2) {
        if (name === this.currentOrder) return this.$message.error(`已经在${name}分类了哦~`)
        this.currentOrder = name
      }
      this.mvList = []
      this.mvListage = 0
      this.getMvList()
    }
  },
  created () {
    // 调用获取热门MV分类方法
    this.getMvList()
  }
}
</script>

<style lang="less" scoped>
#mv {
  overflow: auto;
  min-height: 610px;
  height: 100%;
  padding: 0 80px;
}
#allMv {
  font-size: 18px;
  font-weight: 700;
  margin: 20px 0 10px 0;
}
// 分类样式
.mvSortNav {
  color: #252525;
  font-size: 14px;
  div {
    padding: 20px 0 0 36px;
  }
  span {
    margin-left: 30px;
    padding: 0 10px;
    color: #797979;
    cursor: pointer;
  }
}
</style>
