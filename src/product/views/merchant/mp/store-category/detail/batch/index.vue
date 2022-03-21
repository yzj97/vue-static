<template>
  <UploadFile
    :title="title"
    :import-type="importType"
    :task-type="taskType"
    :file-size-limit="fileSizeLimit"
    :history-visible.sync="historyVisible"
    :check-merchant="false"
    :upload-path="importUrl"
    :is-data-task="true"
    :check-store="true"
    @beforeUpload="beforeUpload"
    @downloadTemplate="downloadTemplate">
    <template slot="top-right">
      <el-link name="showUploadHistory" type="primary" @click="showUploadHistory">{{ title + $t('上传历史') }}</el-link>
    </template>
    <template slot="upload-tip">
      <div>
        <div>温馨提示：</div>
        <div>1、excel格式必须是或者xlsx或者xls，前台类目关联≤10000条。</div>
        <div>2、必填字段不能为空（必填字段名称前面带<span class="error">*</span>），否则将导入失败。</div>
      </div>
    </template>
  </UploadFile>
</template>

<script>

import UploadFile from '@/components/uploadFile'
import categoryMappingTemplate from '@/excelFile/categoryMappingTemplate.xlsx'
import mpApi from '@/api/mpApi.js'
export default {
  name: 'ProductStoreCategoryMappingBatch',
  components: {
    UploadFile
  },
  data() {
    return {
      title: this.$t('店铺类目关联'),
      importUrl: mpApi.importMerchantCategoryMapping.url,
      importType: 9,
      taskType: 'storeRelCategoryMapping',
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
      this.$portal.downloadFileByGet(categoryMappingTemplate, {}, this.title + '导入模板.xlsx')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
