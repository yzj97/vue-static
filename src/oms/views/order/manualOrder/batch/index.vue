<template>
  <UploadFile
    :title="title"
    :task-type="taskType"
    :history-visible.sync="historyVisible"
    :filter-data-auth="false"
    :upload-path="uploadPath"
    @beforeUpload="beforeUpload"
    @downloadTemplate="downloadTemplate">
    <template slot="top-right">
      <el-link name="showUploadHistory" type="primary" @click="showUploadHistory">{{ $t('manual_order_batch_history') }}</el-link>
    </template>
  </UploadFile>
</template>

<script>

import UploadFile from '@/components/uploadFile'

import soImportCustomerTemplate from '@/excelFile/orderImportTemplateCustomer.xlsx'
import soImportUserTemplate from '@/excelFile/orderImportTemplateMember.xlsx'

export default {
  name: 'OmsManualOrderBatch',
  components: {
    UploadFile
  },
  data() {
    return {
      title: this.$t('下单'),
      taskType: 'manualOrderImport',
      uploadPath: '/oms-web/manualOrder/import',
      fileSizeLimit: 2 * 1024 * 1024,
      historyVisible: false,
      type: null
    }
  },
  computed: {

  },
  async mounted() {
    this.init()
  },
  methods: {
    init() {
      this.forCustomer = this.$route.params.forCustomer
    },
    showUploadHistory() {
      this.historyVisible = true
    },
    beforeUpload(uploadParam) {
      uploadParam.append('merchantId', this.$route.params.merchantId)
      uploadParam.append('merchantName', this.$route.params.merchantName)
      uploadParam.append('forCustomer', this.forCustomer ? this.forCustomer : null)
    },
    downloadTemplate() {
      if (this.forCustomer) {
        this.$portal.downloadFileByGet(soImportCustomerTemplate, {}, '订单导入模板-客户.xlsx')
      } else {
        this.$portal.downloadFileByGet(soImportUserTemplate, {}, '订单导入模板-会员.xlsx')
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
