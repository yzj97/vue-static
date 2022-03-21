<template>
  <UploadFile
    ref="uploadFile"
    :title="title"
    :task-type="taskType"
    :platform-type="dataType"
    :filter-data-auth="true"
    :file-size-limit="fileSizeLimit"
    :history-visible.sync="historyVisible"
    :check-merchant="false"
    :check-store="false"
    :is-data-task="true"
    :upload-path="importUrl"
    :input-validated="inputValidated"
    @beforeUpload="beforeUpload"
    @downloadTemplate="downloadTemplate">
    <template slot="top-right">
      <el-link name="showUploadHistory" type="primary" @click="showUploadHistory">{{ $t('批量修改历史') }}</el-link>
    </template>
    <template slot="form-items" slot-scope="scope">
      <el-form-item v-show="scope.active < 2" :label="$t('修改内容')">{{ $t('商品库存预警值') }}</el-form-item>
      <el-form-item v-show="scope.active < 2" :label="$t('商品库存类型')">{{ $t('商品库存预警值') }}</el-form-item>
      <el-form-item v-show="scope.active < 2" :label="$t('店铺')" required>
        <el-col :span="6">
          <ody-store-choose
            v-model="storeId"
            :selected.sync="store"
            :placeholder="$t('请选择店铺')"
            name="upload_storeId"
            value-key="storeId"
          />
        </el-col>
      </el-form-item>
    </template>
  </UploadFile>
</template>

<script>
import UploadFile from '@/components/uploadFile'
import stockWarningImportTemplate from '@/excelFile/stockWarningImportTemplate.xlsx'

export default {
  name: 'ImportstockWarning',
  components: {
    UploadFile
  },
  data() {
    return {
      title: this.$t('批量改库存预警'),
      taskType: 'productStockWarningImport',
      dataType: this.$portal.getPlatformId(),
      storeId: '',
      store: {},
      fileSizeLimit: 4 * 1024 * 1024,
      historyVisible: false,
      importUrl: this.$product.$api.mpApi.redevImportProductStockWarning.url
    }
  },
  computed: {
    inputValidated() {
      return !!this.storeId
    }
  },
  methods: {
    beforeUpload(uploadParam) {
      uploadParam.append('dataType', 3)
      uploadParam.append('taskType', this.taskType)
      uploadParam.append('storeId', this.storeId)
      uploadParam.append('redevMerchantId', this.store.merchantId)
    },
    downloadTemplate() {
      this.$portal.downloadFileByGet(stockWarningImportTemplate, {}, this.title + '导入模板.xlsx')
    },
    showUploadHistory() {
      this.historyVisible = true
    }
  }
}
</script>

<style scoped>

</style>
