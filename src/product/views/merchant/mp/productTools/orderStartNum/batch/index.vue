<template>
  <UploadFile
    :title="title"
    :import-type="importType"
    :task-type="taskType"
    :file-size-limit="fileSizeLimit"
    :history-visible.sync="historyVisible"
    :check-merchant="false"
    :upload-path="uploadPath"
    :is-data-task="true"
    @beforeUpload="beforeUpload"
    @downloadTemplate="downloadTemplate">
    <template slot="top-right">
      <el-link name="showUploadHistory" type="primary" @click="showUploadHistory">{{ $t('起订量上传历史') }}</el-link>
    </template>
  </UploadFile>
</template>

<script>

import UploadFile from '@/components/uploadFile'
import orderStartNumTemplate from '@/excelFile/orderStartNumTemplate.xlsx'
import mpApi from '@/api/mpApi.js'
export default {
  name: 'OrderStartNumBatch',
  components: {
    UploadFile
  },
  data() {
    return {
      title: this.$t('起订量'),
      importType: 10,
      taskType: 'mpPurchaseControl',
      uploadPath: mpApi.importOrderStartNum.url,
      fileSizeLimit: 4 * 1024 * 1024,
      historyVisible: false
    }
  },
  async mounted() {
  },
  methods: {
    showUploadHistory() {
      this.historyVisible = true
    },
    beforeUpload(uploadParam) {
    },
    downloadTemplate() {
      this.$portal.downloadFileByGet(orderStartNumTemplate, {}, this.title + this.$t('导入模板') + '.xlsx')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
