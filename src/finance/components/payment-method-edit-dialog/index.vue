<template>
  <section>
    <ody-dialog
      :title="$t(type)"
      :visible.sync="visible"
      :before-close="handleBack"
      width="960px"
      @open="init">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="form" >
        <el-form-item :label="$t('支付方式')" prop="methodCode">
          <el-select v-model="form.methodCode" name="form_methodCode" @change="handleMethodCodeSelect">
            <el-option
              v-for="item in methodNameList"
              :key="item.code"
              :label="item.name"
              :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.methodCode === '0'" :label="$t('自定义名称')" prop="methodName">
          <el-input v-model="form.methodName" name="form_methodName" maxlength="100" show-word-limit/>
        </el-form-item>
        <el-form-item :label="$t('业务类型')" prop="businessType">
          <el-select v-model="form.businessType" name="form_businessType">
            <el-option
              v-for="item in businessTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('销售渠道')" prop="saleChannelCode">
          <ody-channel-select ref="channel" v-model="form.saleChannelCode" name="form_saleChannelCode"/>
        </el-form-item>
        <el-form-item :label="$t('状态')" prop="status">
          <el-radio v-model="form.status" name="form_status" label="1">{{ $t('启用') }}</el-radio>
          <el-radio v-model="form.status" name="form_status0" label="0">{{ $t('禁用') }}</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button name="handleBack" size="small" @click="handleBack">{{ $t('返回') }}</el-button>
        <el-button name="handleSave" size="small" type="primary" @click="handleSave">{{ $t('确定') }}</el-button>
      </span>
    </ody-dialog>
  </section>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editInfo: {
      type: Object,
      default: null
    },
    methodNameList: {
      type: Object,
      default: null
    },
    businessTypeList: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      type: '新增',
      form: {
        id: '',
        methodCode: '',
        methodName: '',
        businessType: '',
        saleChannelCode: '',
        status: '1'
      },
      rules: {
        methodCode: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        methodName: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        businessType: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        saleChannelCode: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        status: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init() {
      if (this.editInfo.id) {
        this.form = {
          id: this.editInfo.id,
          methodCode: this.editInfo.methodCode,
          methodName: this.editInfo.methodName,
          parentMethodCode: this.editInfo.parentMethodCode,
          level: this.editInfo.level,
          merchantId: this.editInfo.merchantId,
          terminalType: this.editInfo.terminalType,
          businessType: this.editInfo.businessType + '',
          saleChannelCode: this.editInfo.saleChannelCode,
          status: this.editInfo.status + ''
        }
        this.type = this.$t('编辑')
      } else {
        this.type = this.$t('新增')
      }
    },
    handleBack() {
      this.form = {
        id: '',
        methodCode: '',
        methodName: '',
        businessType: '',
        saleChannelCode: '',
        status: '1'
      }
      this.$refs['form'].resetFields()
      this.$emit('update:visible', !this.visible)
    },
    async handleSave() {
      const vue = this
      vue.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id) {
            vue.$finance.$api.paymentMethod.updatePaymentMethod(this.form).then(res => {
              vue.saveSuccess()
            })
          } else {
            vue.$finance.$api.paymentMethod.savePaymentMethod(this.form).then(res => {
              vue.saveSuccess()
            })
          }
        }
      })
    },
    saveSuccess() {
      const vue = this
      vue.$message.success(vue.$t('保存成功'))
      this.form = {
        id: '',
        methodCode: '',
        methodName: '',
        businessType: '',
        saleChannelCode: '',
        status: '1'
      }
      vue.$refs['form'].resetFields()
      vue.$emit('update:visible', !vue.visible)
      vue.$emit('ok')
    },
    handleMethodCodeSelect(value) {
      for (let i = 0; i < this.methodNameList.length; i++) {
        const item = this.methodNameList[i]
        if (item.code === value) {
          this.form.methodName = item.name
          if (item.code === '0') {
            this.form.methodName = ''
          }
          break
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
