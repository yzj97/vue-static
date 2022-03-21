<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('importOrder')"
      width="600px"
      @open="init" >
      <section class="pg-orderImport-list">
        <el-form id="form" ref="form" :rules="rules" :model="formData" label-width="100px" class="form">
          <el-form-item :label="$t('do_merchant_name')" prop="merchantId">
            <ody-merchant-choose v-model="formData.merchantId" :selected.sync="merchant" :placeholder="$t('please_choose')" name="formData_merchantId" value-key="merchantId" @ok="fetchSysSource" @clear="fetchSysSource" />
          </el-form-item>
          <el-form-item :label="$t('manual_order_order_syssource')" prop="sysSourceCode"><!--销售渠道-->
            <el-select v-model="formData.sysSourceCode" name="formData_sysSourceCode" @change="fetchStore" >
              <el-option :label="$t('please_choose')" />
              <el-option v-for="item in channelInfoList" :label="item.channelName" :key="item.channelCode" :value="item.channelCode" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('manual_order_store')" prop="storeId"><!--销售店铺-->
            <el-select v-model="formData.storeId" name="formData_store" >
              <el-option :label="$t('please_choose')" />
              <el-option v-for="item in merchantStoreList" :label="item.storeName" :key="item.storeId" :value="item.storeId" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('common_fileUpload')" prop="fileList">
            <el-upload
              :auto-upload="false"
              :on-change="handleChange"
              :on-remove="handleRemove"
              :file-list.sync="fileList"
              accept=".xls,.xlsx"
              name="fileData" >
              <el-button slot="trigger" size="small" type="primary">{{ $t('common_chooseFile') }}</el-button>
            </el-upload>
          </el-form-item>
        </el-form>

      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleDownloadTemplate" size="small" type="primary" @click="handleDownloadTemplate">{{ $t('common_import_fileModel') }}</el-button>
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <el-button :disabled="submiting" name="handleOk" size="small" type="primary" @click="handleOk('form')">{{ $t('ok') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>

const fileName = 'soImportTemplate.xlsx'
import soImportTemplate from '@/excelFile/soImportTemplate.xlsx'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      submiting: false,
      merchant: {},
      sysSourceList: [],
      merchantStoreList: [],
      sysSourceMap: {},
      merchantMap: {},
      merchantStoreMap: {},
      fileList: [],
      formData: getDefaultFormData(),
      limit: 1,
      rules: {
        merchantId: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        sysSourceCode: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        storeId: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        fileList: [
          { validator: this.validateFile, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init() {
      this._initCode()
      this.formData = getDefaultFormData()
      this.fileList = []
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    validateFile(rule, value, callback) {
      if (this.fileList && this.fileList.length > 0) {
        return callback()
      }
      return callback(new Error(this.$t('required')))
    },
    fetchSysSource() {
      this.formData.sysSourceCode = null
      this.sysSourceList = [] // 销售渠道
      this.sysSourceMap = {}
      this.fetchStore()

      if (!this.merchant || !this.merchant.merchantId) {
        return
      }
      this.channelInfoList = this.merchant.channelInfoList
      this.sysSourceMap = this.channelInfoList.reduce((m, i) => { m[i.channelCode] = i; return m }, {})
    },
    fetchStore() {
      const vue = this
      this.formData.storeId = null
      this.merchantStoreList = [] // 销售店铺
      this.merchantStoreMap = {}
      if (!this.formData.sysSourceCode) {
        return
      }
      this.formData.sysn
      var queryParam = {
        merchantId: this.merchant.merchantId,
        channelCode: this.formData.sysSourceCode,
        currentPage: 1,
        itemsPerPage: 500
      }
      this.$oms.$api.common.merchantStoreList(queryParam).then((result) => {
        if (result.data && result.data.listObj) {
          vue.merchantStoreList = result.data.listObj
          vue.merchantStoreMap = vue.merchantStoreList.reduce((m, i) => { m[i.storeId] = i; return m }, {})
        }
      })
    },
    handleChange(file, fileList) {
      if (fileList.length > this.limit) {
        fileList.splice(0, fileList.length - this.limit)
      }
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleDownloadTemplate() {
      this.$portal.downloadFileByGet(soImportTemplate, {}, fileName)
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async handleOk(formName) {
      const vue = this
      if (vue.submiting) {
        return
      }
      vue.submiting = true
      this.$refs[formName].validate(validate => {
        if (validate) {
          const sysSouce = vue.sysSourceMap[vue.formData.sysSourceCode]
          const store = vue.merchantStoreMap[vue.formData.storeId]
          const file = document.getElementsByName('fileData')[0].files[0]
          const uploadParams = new FormData()
          uploadParams.append('fileData', file)
          uploadParams.append('merchantId', vue.merchant.merchantId)
          uploadParams.append('merchantName', vue.merchant.merchantName)
          uploadParams.append('sysSourceCode', sysSouce.channelCode)
          uploadParams.append('sysSourceName', sysSouce.channelName)
          uploadParams.append('storeId', store.storeId)
          uploadParams.append('storeName', store.storeName)

          this.$portal.post('/oms-web/so/import', uploadParams).then(res => {
            vue.$emit('update:visible', !vue.visible)
            vue.$emit('success', res.data)
          }, (res) => {
            if (res.message || res.errorMessage) {
              vue.$message.error(res.message || res.errorMessage)
            }
          }).finally(() => {
            vue.submiting = false
          })
        } else {
          vue.submiting = false
        }
      })
    },
    _initCode() {
      const vue = this
      this.$oms.$api.common.selectCodes({ category: 'CUSTOMER_TYPE' }).then(result => {
        vue.customerTypeList = result.data
        vue.customerTypeMap = vue.customerTypeList.reduce((m, i) => { m[i.code] = i; return m }, {})
      })
    }
  }
}
function getDefaultFormData() {
  return Object.assign({}, {
    merchantId: null,
    sysSourceCode: null,
    storeId: null
  })
}
</script>

<style lang="scss" scoped>

</style>
