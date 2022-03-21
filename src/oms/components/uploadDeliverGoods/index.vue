<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="1200px"
    title="商品名导入"
    @close="cancel"
  >
    <UploadFile
      :title="title"
      :import-type="importType"
      :platform-type="dataType"
      :task-type="taskType"
      :file-size-limit="fileSizeLimit"
      :history-visible.sync="historyVisible"
      :upload-path="uploadPath"
      :check-merchant="false"
      :is-data-task="true"
      @beforeUpload="beforeUpload"
      @downloadTemplate="downloadTemplate"
      @success="success"
    />
  </el-dialog>

</template>

<script>

import UploadFile from '@/components/uploadFile'
import importPackageTemplate from '@/excelFile/importPackageTemplate.xlsx'
import importDoTemplate from '@/excelFile/importDoTemplate.xlsx'
export default {
  components: {
    UploadFile
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dataType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      title: this.$t('批量发货导入'),
      importType: 11, // 原料导入类型 11
      uploadPath: 'oms-web/redevImportPackage/importData',
      fileSizeLimit: 2 * 1024 * 1024,
      historyVisible: false,
      isSuccess: false
    }
  },
  computed: {
    taskType() {
      return this.dataType === 1 ? 'soPackageImport' : 'redevDoImport'
    },
    type() {
      return this.dataType
    }
  },
  async mounted() {},
  methods: {
    showUploadHistory() {
      this.historyVisible = true
    },
    beforeUpload(uploadParam) {
      uploadParam.append('type', this.type)
    },
    downloadTemplate() {
      if (this.dataType === 1) {
        this.$portal.downloadFileByGet(importPackageTemplate, {}, this.$t('无仓商品发货导入模板') + '.xlsx')
      } else {
        this.$portal.downloadFileByGet(importDoTemplate, {}, this.$t('有仓商品发货导入模板') + '.xlsx')
      }
    },
    cancel() {
      this.$emit('update:dialogVisible', false)
      if (this.isSuccess) {
        this.$emit('uploadSuccess')
        this.isSuccess = false
      }
    },
    deter() {},
    success() {
      console.log('1111111')
      this.isSuccess = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
