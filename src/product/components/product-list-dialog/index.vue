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
        ref="mpAuditForm"
        :rules="rules"
        :model="mpAuditForm"
        label-position="right"
        label-width="120px"
      >
        <el-form-item :label="$t('findings_of_audit')" prop="status">
          <el-radio-group v-model="mpAuditForm.status" name="mpAuditForm_status">
            <el-radio :label="2">{{ $t('common_audit_pass') }}</el-radio>
            <el-radio :label="3">{{ $t('common_audit_not_pass') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="mpAuditForm.status==3"
          :label="$t('review_of_the_reasons_for_rejection')"
          prop="auditMessage"
        >
          <el-input v-model="mpAuditForm.auditMessage" name="mpAuditForm_auditMessage" type="textarea" maxlength="300" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
        <ody-button name="MerchantProductManageAudit_submitForm" size="small" type="primary" code="MerchantProductManageAudit" @click="submitForm('mpAuditForm')">{{ $t('确认') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>
<script>
export default {
  props: {
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
        status: [
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
      mpAuditForm: {
        mpIdList: [],
        auditMessage: null,
        status: 2
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.$refs['mpAuditForm'].resetFields()
    },
    submitForm(mpAuditForm) {
      this.$refs['mpAuditForm'].validate(valid => {
        if (valid) {
          const productAudit = this.$product.$api.mpApi
          productAudit.auditMerchantProduct(this.mpAuditForm).then(result => {
            if (result && result.code === '0') {
              this.$emit('update:visible', !this.visible)
              this.$refs['mpAuditForm'].resetFields()
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
      this.mpAuditForm.mpIdList = this.ids
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
