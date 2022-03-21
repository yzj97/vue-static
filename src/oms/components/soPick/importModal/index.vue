<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('导入物流单')"
      width="600px"
      @open="init" >
      <section class="pg-orderImport-list">
        <el-form id="form" ref="form" :rules="rules" :model="formData" label-width="100px" class="form">
          <el-form-item :label="$t('do_merchant_name')" prop="merchantId">
            <ody-merchant-choose v-model="formData.merchantId" :selected.sync="merchant" :placeholder="$t('please_choose')" name="formData_merchantId" value-key="merchantId" @ok="fetchSysSource" @clear="fetchSysSource" />
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

const fileName = 'soDeliveryImportTemplate.xlsx'
import uploadAndDownload from '@/utils/uploadAndDownload'
import soDeliveryImportTemplate from '@/excelFile/soDeliveryImportTemplate.xlsx'
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
      sysSourceMap: {},
      fileList: [],
      formData: getDefaultFormData(),
      limit: 1,
      rules: {
        merchantId: [
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
      this.$portal.downloadFileByGet(soDeliveryImportTemplate, {}, fileName)
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async handleOk(formName) {
      const vue = this
      this.$refs[formName].validate(validate => {
        if (validate) {
          vue.submiting = true
          const uploadParams = {
            'merchantId': vue.merchant.merchantId,
            'merchantName': vue.merchant.merchantName,
            'taskActionType': 1,
            'taskType': 10
          }
          const form = document.getElementById(formName)
          form.action = '/api/oms-web/soPick/importDelivery'

          const callback = function(result) {
            if (result.code === '0') {
              vue.$emit('update:visible', !vue.visible)
              vue.$emit('success', result.data)
            } else {
              vue.$message({
                type: 'error',
                message: result.message
              })
            }
          }
          try {
            uploadAndDownload(form, uploadParams, null, callback)
          } catch (e) {
            vue.$message({
              type: 'error',
              message: e.message
            })
          } finally {
            vue.submiting = false
          }
        }
      })
    }
  }
}
function getDefaultFormData() {
  return Object.assign({}, {
    merchantId: null
  })
}
</script>

<style lang="scss" scoped>

</style>
