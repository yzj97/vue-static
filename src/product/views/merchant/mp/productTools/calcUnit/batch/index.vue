<template>
  <UploadFile
    :title="title"
    :import-type="importType"
    :task-type="taskType"
    :file-size-limit="fileSizeLimit"
    :history-visible.sync="historyVisible"
    :check-merchant="false"
    :is-data-task="true"
    :upload-path="uploadPath"
    @beforeUpload="beforeUpload"
    @downloadTemplate="downloadTemplate">
    <template slot="top-right">
      <el-link name="showUploadHistory" type="primary" @click="showUploadHistory">{{ $t('辅计量单位上传历史') }}</el-link>
    </template>
  </UploadFile>
</template>

<script>

import UploadFile from '@/components/uploadFile'
import calcUnitTemplate from '@/excelFile/calcUnitTemplate.xlsx'
import mpApi from '@/api/mpApi.js'
export default {
  name: 'CalcUnitBatch',
  components: {
    UploadFile
  },
  data() {
    return {
      title: this.$t('辅计量单位'),
      importType: 3,
      taskType: 'mpCalcUnitImport',
      uploadPath: mpApi.importCalcUnit.url,
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
      this.$portal.downloadFileByGet(calcUnitTemplate, {}, this.title + this.$t('导入模板') + '.xlsx')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
