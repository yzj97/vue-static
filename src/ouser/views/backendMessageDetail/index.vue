<template>
  <div>
    <section>
      <div style="width: 50%; text-align: center; margin-left: 20%;">
        <el-form>
          <!--标题-->
          <el-form-item :label="$t('公告标题')">
            <div style="text-align: center;">
              <label>{{ detailData.title }}</label><br>
              <!--发布时间-->
              <label style="float: right; margin-right: 20px;">{{ detailData.publicTimeStr }}</label>

              <!--公告类型-->
              <label style="float: right; margin-right: 20px;">{{ detailData.parentType }}</label>
              <label/>
            </div>
          </el-form-item>
          <!--内容-->
          <el-form-item :label="$t('公告内容')">
            <div style="width: 100%; margin-left: 30px; margin-top: 70px;">
              <!--<ody-tinymce :height="300" :disabled=true style="" v-model="detailDialog.detailData.content"/>-->
              <p style="word-wrap: break-word;" v-html = "detailData.content"/>
            </div>
          </el-form-item>
          <!--附件fileUrl-->

          <el-form-item :label="$t('公告附件')">
            <div>
              <el-button @click.prevent="handleDownloadFileByGet">Get开始下载</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import util from '@/utils/util'

export default {
  name: 'OuserBackendMessageDetail',
  data() {
    return {
      detailData: {}
    }
  },
  mounted() {
    this.init(1)
  },
  methods: {
    async init(currentPage) {
      // 初始化
      const self = this
      const backendMessageService = this.$ouser.$api.backendMessageService

      console.log(self.$route.query.id)

      // 1、获取路由过来的backendMessageId
      var backendMessageId = self.$route.query.id
      // 如果没获取到则不加载
      if (backendMessageId === undefined || backendMessageId === null || backendMessageId === '') {
        return
      }
      // 2、获取用户站内信详情
      var postObj = { id: backendMessageId }
      backendMessageService.getMessageDetail4User(util.copy(postObj)).then(res => {
        var dt = new Date(res.data.publicTime)
        res.data.publicTimeStr = self.formate(dt, 'yyyy-MM-dd hh:mm:ss')
        self.detailData = res.data
      })
    },
    handleDownloadFileByGet() {
      const self = this
      var fileUrl = self.detailData.fileUrl
      if (fileUrl) {
        this.$portal.downloadFileByGet(fileUrl)
      } else {
        self.$message('没有附件')
      }
    },
    formate(date, fmt) { // author: meizz
      var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
      }
      return fmt
    }
  }
}
</script>
