<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('common_audit')"
      width="600px"
      @open="init" >
      <section class="pg-apSupplierInvoice-list">
        <el-form ref="form" :rules="rules" :model="dataForm" label-width="100px" class="form">
          <el-form-item :label="$t('invoice_status')" prop="status">
            <el-select v-model="dataForm.status" name="dataForm_status">
              <el-option :label="$t('common_audit_pass')" value="2" />
              <el-option :label="$t('common_audit_not_pass')" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('common_remark')" prop="remark">
            <el-input v-model="dataForm.remark" name="dataForm_remark" type="textarea" maxlength="100" />
          </el-form-item>
        </el-form>

      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <ody-button :disabled="submiting" code="PurchaseInvoiceAudit" name="handleOk" size="small" type="primary" @click="handleOk('form')">{{ $t('ok') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    },
    remark: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      submiting: false,
      dataForm: {},
      rules: {
        status: [
          { required: true, type: 'string', message: this.$t('required'), trigger: 'change' }
        ],
        remark: [
          { required: true, type: 'string', message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init() {
      this.dataForm = {
        remark: this.remark,
        id: this.id
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async handleOk(formName) {
      const vue = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          vue.submiting = true
          const promise = vue.$finance.$api.apSupplierInvoice.auditInvoice
          const form = Object.assign({}, vue.dataForm)
          promise(form).then((res) => {
            if (res.code === '0') {
              vue.$message({
                type: 'success',
                message: this.$t('common_success')
              })
              vue.$emit('update:visible', !this.visible)
              vue.$emit('ok')
            } else {
              vue.$message({
                type: 'error',
                message: res.message
              })
            }
          }).finally(() => {
            vue.submiting = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
