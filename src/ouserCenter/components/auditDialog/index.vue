<template>
  <div>
    <ody-dialog
      :visible.sync="visible"
      :before-close="handleClose"
      :title=" $t('审核')"
      class="product-list-dialog"
      width="600px"
      @open="init"
    >
      <el-form
        ref="accountAuditForm"
        :rules="rules"
        :model="accountAuditForm"
        label-position="right"
        label-width="100px"
      >
        <el-form-item :label="$t('findings_of_audit')" prop="auditStatus">
          <el-radio-group v-model="accountAuditForm.auditStatus" name="accountAuditForm_auditStatus">
            <el-radio :label="2">{{ $t('purchaseInfo_auditStatus_2') }}</el-radio>
            <el-radio :label="3">{{ $t('audit_failed_to_pass') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="accountAuditForm.auditStatus==3"
          :label="$t('review_of_the_reasons_for_rejection')"
          prop="auditMessage"
        >
          <el-input v-model="accountAuditForm.auditMessage" name="accountAuditForm_auditMessage" type="textarea" maxlength="300" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
        <ody-button :code="type === 2 ? 'GrowthManualOperationAuditSubmit' : 'ManualOperationAuditSubmit'" name="submitForm" size="small" type="primary" @click="submitForm('accountAuditForm')">{{ $t('确认') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: Number,
      default: 1
    },
    ids: {
      type: Array,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {
        auditStatus: [
          {
            required: true,
            message: this.$t('please_select_the_audit_status'),
            trigger: 'blur'
          }
        ],
        auditMessage: [
          {
            required: true,
            message: this.$t('请输入审核拒绝原因'),
            trigger: 'change'
          }
        ]
      },
      accountAuditForm: {
        ids: [],
        auditMessage: null,
        auditStatus: 2
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.$refs['accountAuditForm'].resetFields()
    },
    submitForm(accountAuditForm) {
      this.$refs['accountAuditForm'].validate(valid => {
        if (valid) {
          const accountAudit = this.$ouserCenter.$api.crmService
          accountAudit.batchAuditAccount(this.accountAuditForm).then(result => {
            if (result && result.code === '0') {
              if (result.data) {
                this.$message({
                  type: 'warn',
                  message: this.$t(result.data)
                })
              } else {
                this.$message({
                  type: 'success',
                  message: this.$t('操作成功')
                })
              }
              this.$emit('update:visible', !this.visible)
              this.$refs['accountAuditForm'].resetFields()
              this.$emit('ok', [])
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    init() {
      this.accountAuditForm.ids = this.ids
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
