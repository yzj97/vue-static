<template>
  <div class>
    <ody-box :title="$t('试用报告查看')">
      <el-form ref="form" :model="form" label-width="240px">
        <ody-title :title="$t('试用商品详情')" />
        <el-form-item :label="$t('商品名称：')">{{ reportInfo.mpName }}</el-form-item>
        <el-form-item :label="$t('价 格：')">{{ reportInfo.price | currency('¥', 2) }}</el-form-item>
        <el-form-item :label="$t('图片：')">
          <img :src="reportInfo.pic" width="150" >
        </el-form-item>
        <ody-title :title="$t('试用报告详情')" />
        <el-form-item :label="$t('用户：')">
          <img
            :src="reportInfo.socialUUserVo.headPicUrl"
            style="width: 50px; height: 50px;border-radio: 50%;"
          >
          <div style="word-wrap: normal">{{ reportInfo.socialUUserVo.nickname }}</div>
        </el-form-item>
        <el-form-item :label="variables.experience.label +':'">{{ variables.experience.value }}</el-form-item>
        <el-form-item :label="variables.process.label+':'">{{ variables.process.value }}</el-form-item>
        <el-form-item :label="variables.image.label+':'">
          <div v-for="(src, index) in variables.image.value" :key="index">
            <img :src="src" width="300" >
          </div>
        </el-form-item>
        <ody-fixed>
          <ody-button
            v-if="reportInfo.status === 3"
            name="showNoPassModal"
            type="primary"
            size="small"
            code="button004"
            @click="showNoPassModal(reportInfo)"
          >{{ $t('审核未通过') }}</ody-button>
          <ody-button
            v-if="reportInfo.status === 4"
            name="hanleCanclePublish"
            type="primary"
            size="small"
            code="button005"
            @click="hanleCanclePublish(reportInfo)"
          >{{ $t('取消发布') }}</ody-button>
          <ody-button
            v-if="reportInfo.status === 3"
            name="handlePublish"
            type="primary"
            size="small"
            code="button006"
            @click="handlePublish(reportInfo)"
          >{{ $t('发布') }}</ody-button>
        </ody-fixed>
      </el-form>
    </ody-box>
  </div>
</template>

<script>
export default {
  name: 'PromTrialReportDetail',
  data() {
    return {
      reportInfo: {
        socialUUserVo: {}
      },
      variables: {
        experience: {},
        process: {},
        image: {}
      }
    }
  },
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    await this.init()
  },
  methods: {
    async hanleCanclePublish(reportInfo) {
      const res = await this.$confirm(
        '确定要取消发布该试用报告？',
        '取消发布',
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      )
      if (!res) {
        return false
      }
      await this.updateReport(reportInfo, 3)
    },
    async handlePublish(reportInfo) {
      const res = await this.$confirm('确定要发布该试用报告？', '发布', {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
      if (!res) {
        return false
      }
      await this.updateReport(reportInfo, 4)
      await this.query()
      this.$message.success('发布提交成功')
    },
    async init() {
      const { id } = this.$route.params
      const { data: reportInfo } = await this.promotionAPI.trialReportDetail({
        id
      })
      this.reportInfo = reportInfo
      this.variables = JSON.parse(decodeURIComponent(reportInfo.variables))
    },
    async updateReport(reportInfo, status) {
      await this.promotionAPI.trialReportUpdateStatus({
        id: reportInfo.id,
        status: status || 4 // 发布
      })
      await this.init()
      if (status === 3) {
        this.$message.success('取消发布提交成功')
      } else {
        this.$message.success('发布成功')
      }
    },
    async showNoPassModal(reportInfo) {
      const msgTitle = this.$t('审核未通过')
      const { value: msgContent, action } = await this.$prompt('', msgTitle, {
        inputValue: this.$t(
          '请补充描述试用体验细节后再次提交试用报告，感谢您的配合'
        ),
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消')
      })

      if (action !== 'confirm') {
        return
      }
      await await this.updateReport(reportInfo, 2)
      await this.promotionAPI.sendMessageTrial({
        recevier: [reportInfo.userId],
        msgTitle,
        msgContent
      })

      await this.init()
      this.$message.success('审核未通过提交成功')
    }
  },
  noPass() {}
}
</script>

<style lang="scss" scoped>
</style>
