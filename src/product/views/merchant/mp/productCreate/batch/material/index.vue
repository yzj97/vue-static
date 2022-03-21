<template>
  <UploadFile
    :title="title"
    :import-type="importType"
    :platform-type="dataType"
    :task-type="taskType"
    :file-size-limit="fileSizeLimit"
    :history-visible.sync="historyVisible"
    :upload-path="uploadPath"
    :input-validated.sync="validated"
    :is-data-task="true"
    :check-merchant="checkMerchant"
    @beforeUpload="beforeUpload"
    @downloadTemplate="downloadTemplate">
    <template slot="top-right">
      <el-link name="showUploadHistory" type="primary" @click="showUploadHistory">{{ $t('原料上传历史') }}</el-link>
    </template>
    <template slot="form-items" slot-scope="scope">
      <el-form-item v-show="scope.active < 2" :label="$t('商品类型')" required>
        <el-col :span="8">
          <el-select v-model="type" name="type" >
            <el-option v-for="(value, key) in typeMap" :key="key" :label="value" :value="key" />
          </el-select>
        </el-col>
      </el-form-item>
    </template>
  </UploadFile>
</template>

<script>

import UploadFile from '@/components/uploadFile'
import materialTemplate from '@/excelFile/materialTemplate.xlsx'
export default {
  name: 'MaterialBatch',
  components: {
    UploadFile
  },
  data() {
    const vue = this
    return {
      title: this.$t('原料'),
      importType: 11, // 原料导入类型 11
      dataType: 1,
      taskType: 'materialImport',
      uploadPath: '/back-product-web/back/mp/product/material/importData.do',
      fileSizeLimit: 2 * 1024 * 1024,
      historyVisible: false,
      checkMerchant: false,
      type: null,
      typeMap: {
        1: vue.$t('内贸商品'),
        50: vue.$t('跨境商品')
      }
    }
  },
  computed: {
    validated() {
      return !!this.type
    }
  },
  async mounted() {
    this.dataType = this.$route.query.dataType
    this.checkMerchant = this.dataType > 1
  },
  methods: {
    showUploadHistory() {
      this.historyVisible = true
    },
    beforeUpload(uploadParam) {
      uploadParam.append('type', this.type)
    },
    downloadTemplate() {
      this.$portal.downloadFileByGet(materialTemplate, {}, this.title + this.$t('导入模板') + '.xlsx')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
