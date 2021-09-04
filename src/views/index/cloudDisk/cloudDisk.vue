<template>
  <div id="cloudDisk">
    <h3 class="myMusicCloudDisk">
      我的音乐云盘
    </h3>
    <!-- 云磁盘容量 -->
    <div class="cloudDiskCapacity">
      <span>云盘容量</span>
      <span>
        <el-progress
          :text-inside="true"
          :stroke-width="10"
          :percentage="countCapacityRatio||0"
          :show-text="false"
          status="exception"
        />
      </span>
      <span>
        {{ myMusicCloudDiskInfo.size|byteConversion('G') }}/{{ myMusicCloudDiskInfo.maxSize|byteConversion('G') }}
      </span>
      <span>
        歌曲永久保存，随时多端畅听
      </span>
    </div>
    <!-- 云磁盘容量 -->
    <!-- 播放全部/上传音乐 -->
    <div class="btns">
      <el-button
        type="danger"
        round
        size="mini"
        @click="toPlayAll"
        class="PlayAll"
      >
        <i class="el-icon-caret-right" /> 播放全部 ✚
      </el-button>
      <el-upload
        class="upload-demo"
        :show-file-list="false"
        action=""
        accept=".mp3"
        :http-request="httpRequest"
        v-loading="loading"
      >
        <el-button
          round
          size="mini"
        >
          <i class="el-icon-folder-add" /> 上传音乐
        </el-button>
      </el-upload>
    </div>
    <!-- 播放全部/上传音乐 -->
    <el-table
      :data="myMusicCloudDiskInfo.data"
      stripe
      style="width: 90%"
      @row-dblclick="doubleClickToPlay"
    >
      <el-table-column
        type="index"
        width="50"
      />
      <el-table-column
        prop="songName"
        label="音乐标题"
      />
      <el-table-column
        prop="artist"
        label="歌手"
        width="150"
      />
      <el-table-column
        prop="album"
        label="专辑"
        width="150"
      />
      <el-table-column
        label="格式"
        width="80"
      >
        MP3
      </el-table-column>
      <el-table-column
        label="大小"
        width="80"
      >
        <template slot-scope="scope">
          {{ scope.row.fileSize|byteConversion('M') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="al.name"
        label="上传时间"
        width="100"
      >
        <template slot-scope="scope">
          {{ $timeFilter(scope.row.addTime) }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      layout="prev, pager, next"
      :total="myMusicCloudDiskInfo.count"
      :page-size="200"
      :current-page="myMusicCloudDiskPage"
      @current-change="myMusicCloudDiskCurrentChange"
    />
    <!-- 分页 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 我的音乐云盘信息
      myMusicCloudDiskInfo: {},
      // 音乐链接列表
      musicUrlList: [],
      // 我的音乐云盘当前页
      myMusicCloudDiskPage: 1,
      // 上传文件
      uploadFile: {},
      // 控制是否显示上传加载等待
      loading: false
    }
  },
  methods: {
    // 获取云盘数据方法
    async getMyMusicCloudDisk (page) {
      const { data: res } = await this.$http.getMyMusicCloudDisk(page)
      if (res.code !== 200) return this.$message.error('获取音乐列表失败')
      res.data.forEach((element, index) => {
        element.index = index
      })
      this.myMusicCloudDiskInfo = res
      // 调用获取音乐URL方法
      this.getMusicUrl()
    },
    // 上传音乐
    async  httpRequest (file) {
      // 控制是否显示上传加载等待
      this.loading = true
      const formData = new FormData()
      formData.append('songFile', file.file)
      this.$http.UploadCloud(formData)
        .then(res => {
          this.$message({
            message: '上传成功,可能会有延迟，请稍后尝试刷新',
            type: 'success'
          })
          this.loading = false
        }).catch(err => {
          this.$message.error('上传失败')
          console.log(err)
          // 控制是否显示上传加载等待
          this.loading = false
        })
    },
    // 双击播放
    doubleClickToPlay (row) {
      this.$store.commit('addmusic', this.musicUrlList)
      this.$store.commit('changeSongIndex', {
        index: row.index,
        random: Math.random()
      })
    },
    // 播放全部方法
    toPlayAll () {
      this.$store.commit('addmusic', this.musicUrlList)
      this.$store.commit('changeSongIndex', 0)
    },
    // 翻页方法
    myMusicCloudDiskCurrentChange (page) {
      this.getMyMusicCloudDisk(page)
    },
    // 获取音乐详细信息方法
    async getMusicUrl () {
      this.$play(this, this.myMusicCloudDiskInfo.data)
        .then((res) => {
          this.musicUrlList = res.musicUrlList
        })
    }
  },
  computed: {
    // 云盘容量比例动态计算
    countCapacityRatio () {
      const Ratio = this.myMusicCloudDiskInfo.size / this.myMusicCloudDiskInfo.maxSize * 100
      if (Ratio < 1) {
        return 1
      } else {
        return parseInt(Ratio)
      }
    }
  },
  filters: {
    // 字节过滤器
    byteConversion (value, set) {
      if (set === 'G') {
        let GB = (value / 1024 / 1024 / 1024).toFixed(2)
        if (GB < 0.1) {
          GB = 0.10
        }
        return GB + 'G'
      } else if (set === 'M') {
        let GB = (value / 1024 / 1024).toFixed(1)
        if (GB < 0.1) {
          GB = 0.10
        }
        return GB + 'M'
      }
    }
  },
  created () {
    // 调用获取云盘数据方法
    this.getMyMusicCloudDisk()
  }
}
</script>

<style lang="less" scoped>
#cloudDisk {
  overflow: auto;
  min-height: 610px;
  height: 100%;
  padding: 0 80px;
}
.myMusicCloudDisk {
  margin: 30px 0 0 0;
}
.cloudDiskCapacity {
  margin: 20px 0 0 0;
   font-size: 14px;
  color: #7e7f7f;
  // 容量进度条
  .el-progress {
  width: 150px;
  display: inline-block;
  }
  :nth-child(2){
    padding: 0 10px;
  }
  :nth-child(4){
    padding-left: 30px;
  }
}
// 按钮组
.btns {
  margin: 20px 0 0 0;
  .PlayAll {
    margin-right: 10px;
  }
  .upload-demo {
    display: inline-block;
  }
}
// 歌曲列表
.el-table {
  margin: 20px 0 0 0;
}
// 分页
.el-pagination {
  margin: 30px 0 0 0;
}
</style>
