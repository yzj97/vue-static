<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('contract_contractTemple')"
      width="60%"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="240px"
      >
        <el-form-item :label="$t('contract_templateCode')">
          <el-input
            v-model="formData.templateCode"
            :placeholder="$t('contract_templateCodeCreateAut')"
            name="formData_templateCode"
            disabled="true"
          />
        </el-form-item>
        <el-form-item :label="$t('common_merchant')" prop="merchantName">
          <el-input v-model="formData.merchantName" name="formData_merchantName" readonly="true" />
        </el-form-item>
        <el-form-item :label="$t('contract_templateType')" prop="contractType">
          <el-select v-model="formData.contractType" :disabled="true" name="formData_contractType">
            <el-option value>{{ $t('please_choose') }}</el-option>
            <el-option
              v-for="item in contractTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('contract_templateName')" prop="templateName">
          <el-input v-model="formData.templateName" name="formData_templateName" maxlength="255" />
        </el-form-item>
        <el-form-item :label="$t('contract_templateAttachment')" prop="fileList">
          <el-upload
            ref="upload"
            :http-request="createAttachment"
            :show-file-list="true"
            :file-list="formData.fileList"
            :limit="1"
            name="file"
            multiple="false"
          >
            <ody-button
              name="OpmsJxContractList34"
              size="mini"
              type="primary"
              code="OpmsJxContractList35"
            >{{ $t('common_choose') }}</ody-button>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('common_remark')">
          <el-input v-model="formData.remark" name="formData_remark" type="textarea" maxlength="255" show-word-limit />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <ody-button
          name="OpmsJxContractList33_handleOk"
          type="primary"
          code="OpmsJxContractList33"
          @click="handleOk"
        >{{ $t('common_confirm') }}</ody-button>
      </span>
    </ody-dialog>
    <MerchantModal :visible.sync="merchantVisible" @ok="selectMerchant" />
  </div>
</template>

<script>
import MerchantModal from '@/components/merchantModal'

export default {
  components: {
    MerchantModal
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    contractId: {
      type: Number,
      default: null
    },
    formData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      merchantVisible: false,
      contractTypeList: [],
      merchant: {},
      rules: {
        merchantName: [
          {
            required: true,
            message: this.$t('please_choose'),
            trigger: 'change'
          }
        ],
        contractType: [
          {
            required: true,
            message: this.$t('please_choose'),
            trigger: 'change'
          }
        ],
        templateName: [
          {
            required: true,
            message: this.$t('please_enter'),
            trigger: 'change'
          }
        ],
        fileList: [
          { required: true, message: this.$t('please_choose'), trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const vue = this
      vue.initCode()
    },
    initCode() {
      const vue = this
      vue.$opms.$api.code
        .listMulti({
          categories: ['CONTRACT_TYPE']
        })
        .then(res => {
          vue.contractTypeList = res.data.CONTRACT_TYPE
        })
    },
    showMerchantModal() {
      this.merchantVisible = true
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      const vue = this
      vue.$refs['formData'].validate(valid => {
        if (valid) {
          const params = new FormData()
          params.append('file', vue.formData.fileList[0])
          params.append('contractType', vue.formData.contractType)
          params.append('merchantName', vue.formData.merchantName)
          params.append('merchantCode', vue.formData.merchantCode)
          params.append('merchantId', vue.formData.merchantId)
          params.append('templateName', vue.formData.templateName)
          params.append('remark', vue.formData.remark)

          if (vue.formData.id) {
            params.append('id', vue.formData.id)
            params.append('templateCode', vue.formData.templateCode)
            vue.$opms.$api.jxContract
              .updateContractTemlpate(params)
              .then(res => {
                if (res && res.code === '0') {
                  vue.$message.success(vue.$t('save_success'))
                  vue.$emit('update:visible', !this.visible)
                  vue.$emit('ok', {})
                }
              })
          } else {
            vue.$opms.$api.jxContract.addContractTemlpate(params).then(res => {
              if (res && res.code === '0') {
                vue.$message.success(vue.$t('save_success'))
                vue.$emit('update:visible', !this.visible)
                vue.$emit('ok', {})
              }
            })
          }
        } else {
          return false
        }
      })
    },
    createAttachment(param) {
      const vue = this
      vue.formData.fileList = [param.file]
    },
    selectMerchant(result) {
      this.formData.merchantName = result.merchantName
      this.formData.merchantId = result.merchantId
      this.formData.merchantCode = result.merchantCode
    }
  }
}
</script>

<style scoped>
</style>
