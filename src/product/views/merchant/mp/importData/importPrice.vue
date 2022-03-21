<template>
  <UploadFile
    :title="title"
    :task-type="taskType"
    :platform-type="platformType"
    :filter-data-auth="dataType === 2"
    :file-size-limit="fileSizeLimit"
    :history-visible.sync="historyVisible"
    :check-merchant="checkMerchant"
    :upload-path="importUrl"
    :is-data-task="true"
    @beforeUpload="beforeUpload"
    @downloadTemplate="downloadTemplate">
    <template slot="top-right">
      <el-link name="showUploadHistory" type="primary" @click="showUploadHistory">{{ $t('批量修改历史') }}</el-link>
    </template>
    <template slot="form-items" slot-scope="scope">
      <el-form-item v-show="scope.active < 2" :label="$t('修改内容')" required>
        <el-col :span="12">
          <el-radio v-model="priceType" :label="1" name="priceType" @change="changePriceType">{{ $t('零售价') }}</el-radio>
          <el-radio v-model="priceType" :label="3" name="priceType" @change="changePriceType">{{ $t('划线价') }}</el-radio>
        </el-col>
      </el-form-item>
    </template>
  </UploadFile>
</template>

<script>

import UploadFile from '@/components/uploadFile'
import importPriceTemplate from '@/excelFile/priceTemplate.xlsx'
import mpApi from '@/api/mpApi.js'
export default {
  name: 'ImportPrice',
  components: {
    UploadFile
  },
  data() {
    return {
      title: this.$t('价格'),
      importUrl: mpApi.importPrice.url,
      fileSizeLimit: 4 * 1024 * 1024,
      historyVisible: false,
      dataType: 1,
      taskType: '',
      priceType: 1,
      platformType: this.$portal.getPlatformId(),
      checkMerchant: false
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    changePriceType() {
      if (this.priceType === 1) {
        this.title = '批量修改零售价'
      } else if (this.priceType === 3) {
        this.title = '批量修改划线价'
      }
    },
    init() {
      this.checkMerchant = Boolean(this.$route.query.checkMerchant)
      this.taskType = this.$route.query.taskType
      this.dataType = parseInt(this.$route.query.dataType)
      this.changePriceType()
    },
    showUploadHistory() {
      this.historyVisible = true
    },
    beforeUpload(uploadParam) {
      uploadParam.append('dataType', this.dataType)
      uploadParam.append('taskType', this.taskType)
      uploadParam.append('priceType', this.priceType)
      uploadParam.append('redevMerchantId', uploadParam.get('merchantId'))
    },
    downloadTemplate() {
      this.$portal.downloadFileByGet(importPriceTemplate, {}, this.title + '导入模板.xlsx')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
