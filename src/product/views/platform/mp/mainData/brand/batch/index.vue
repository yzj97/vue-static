<template>
  <UploadFile
    :title="title"
    :filter-data-auth="false"
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
      <el-link name="showUploadHistory" type="primary" @click="showUploadHistory">{{ $t('品牌上传历史') }}</el-link>
    </template>
    <template slot="upload-tip">
      <div>
        <div>{{ $t('温馨提示：') }}</div>
        <div>{{ $t('1. excel格式必须是或者xlsx或者xls，品牌条数≤10000条') }}</div>
        <div>{{ $t('2. 品牌名称必填，否则将导入失败。') }}</div>
      </div>
    </template>
  </UploadFile>
</template>

<script>

import UploadFile from '@/components/uploadFile'
import brandTemplate from '@/excelFile/brandTemplate.xlsx'
import mpApi from '@/api/mpApi.js'
export default {
  name: 'BrandBatch',
  components: {
    UploadFile
  },
  data() {
    return {
      title: this.$t('品牌'),
      importType: 1,
      taskType: 'brandImport',
      uploadPath: mpApi.importBrand.url,
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
      this.$portal.downloadFileByGet(brandTemplate, {}, this.title + this.$t('导入模板') + '.xlsx')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
