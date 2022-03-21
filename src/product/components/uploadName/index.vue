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
import goodsNameImport from '@/excelFile/goodsNameImport.xlsx'
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
      title: this.$t('商品名导入'),
      importType: 11, // 原料导入类型 11
      taskType: 'shopNameImport',
      uploadPath: '/back-product-web/back/mp/product/importName.do',
      fileSizeLimit: 2 * 1024 * 1024,
      historyVisible: false,
      type: null,
      isSuccess: false
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
      this.$portal.downloadFileByGet(goodsNameImport, {}, this.$t('商品名导入模板') + '.xlsx')
    },
    cancel() {
      console.log('2222222')
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
