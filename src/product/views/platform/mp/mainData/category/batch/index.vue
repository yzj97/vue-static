<template>
  <UploadFile
    :title="title"
    :import-type="importType"
    :task-type="taskType"
    :file-size-limit="fileSizeLimit"
    :history-visible.sync="historyVisible"
    :check-merchant="false"
    :is-data-task="true"
    :upload-path="importUrl"
    @beforeUpload="beforeUpload"
    @downloadTemplate="downloadTemplate">
    <template slot="top-right">
      <el-link name="showUploadHistory" type="primary" @click="showUploadHistory">{{ title + $t('上传历史') }}</el-link>
    </template>
    <template slot="upload-tip">
      <div>
        <div>{{ $t('温馨提示：') }}</div>
        <div>{{ $t('1. excel格式必须是或者xlsx或者xls，后台类目条数≤10000条。') }}</div>
        <div>{{ $t('2. 必填字段不能为空（必填字段名称前面带') }}<span class="error">*</span>{{ $t('），否则将导入失败。') }}</div>
        <div>{{ $t('3. 类目编码全局唯一，如果导入的编码不存在则新增类目节点；如果导入的编码已存在则执行更新。') }}</div>
        <div v-if="importType === 4">{{ $t('4. 如果类目已经关联了属性或者已经创建过商品，该类目不可以创建下级子类目。') }}</div>
        <div v-if="importType === 5 || importType === 7">{{ $t('4. 如果类目已经关联后台类目或者已经关联过商品，该类目不可以创建下级子类目。') }}</div>
      </div>
    </template>
  </UploadFile>
</template>

<script>

import UploadFile from '@/components/uploadFile'
import categoryTemplate from '@/excelFile/categoryTemplate.xlsx'
import categoryFrontTemplate from '@/excelFile/categoryFrontTemplate.xlsx'
import mpApi from '@/api/mpApi.js'
export default {
  name: 'ProductCategoryBatch',
  components: {
    UploadFile
  },
  data() {
    return {
      title: this.$t('类目'),
      importType: 4,
      taskType: 'categoryImport',
      importUrl: mpApi.importCategory.url,
      fileSizeLimit: 4 * 1024 * 1024,
      historyVisible: false,
      template: null,
      categoryId: null
    }
  },
  async mounted() {
    this.importType = this.$route.query.importType
    this.taskType = this.$route.query.taskType
    this.categoryId = this.$route.query.treeId
    this.template = categoryFrontTemplate
    if (this.importType === 4) {
      this.title = this.$t('后台类目')
      this.template = categoryTemplate
      this.importUrl = mpApi.importCategory.url
    }
    if (this.importType === 5) {
      this.title = this.$t('前台类目')
      this.importUrl = mpApi.importFrontCategory.url
    }
    if (this.importType === 6) {
      this.title = this.$t('商家类目')
      this.importUrl = mpApi.importMerchantCategory.url
    }
    if (this.importType === 7) {
      this.title = this.$t('店铺类目')
      this.importUrl = mpApi.importStoreCategory.url
    }
  },
  methods: {
    showUploadHistory() {
      this.historyVisible = true
    },
    beforeUpload(uploadParam) {
      uploadParam.append('categoryId', this.categoryId)
      uploadParam.append('taskType', this.taskType)
    },
    downloadTemplate() {
      this.$portal.downloadFileByGet(this.template, {}, this.title + '导入模板.xlsx')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
