<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('common_audit')"
      width="60%"
    >
      <el-form :modal="form" label-position="right" label-width="80px">
        <div
          style="text-align:center;margin-bottom: 20px"
        >{{ $t('purchase_plan_audit_confirm') + planCode + $t('purchase_plan_plan') }}</div>
        <el-form-item :label="$t('common_remark')">
          <el-input v-model="form.remark" name="form_remark" type="textarea" maxlength="50" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ody-button
          name="OpmsPurchasePlanAuditNotPass_handleNotPass"
          code="OpmsPurchasePlanAuditNotPass"
          @click="handleNotPass"
        >{{ $t('common_audit_not_pass') }}</ody-button>
        <ody-button
          name="OpmsPurchasePlanAuditPass_handlePass"
          type="primary"
          code="OpmsPurchasePlanAuditPass"
          @click="handlePass"
        >{{ $t('common_audit_pass') }}</ody-button>
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
    merchantCode: {
      type: Number,
      default: null
    },
    planCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      form: {
        remark: ''
      }
    }
  },
  methods: {
    handleClose() {
      this.form.remark = ''
      this.$emit('update:visible', !this.visible)
    },
    handlePass() {
      const vue = this
      const purchasePlan = vue.$opms.$api.purchasePlan
      vue.form.approvalStatus = 3
      vue.form.id = vue.merchantCode
      vue.form.planCode = vue.planCode
      purchasePlan.auditPurchasePlan(vue.form).then(result => {
        vue.$emit('update:visible', !this.visible)
        vue.$emit('audit', {
          remark: vue.form.remark,
          isPass: true
        })
        vue.form.remark = ''
      })
    },
    handleNotPass() {
      const vue = this
      const purchasePlan = vue.$opms.$api.purchasePlan
      if (vue.form.remark === '' || vue.form.remark === undefined) {
        vue.$message({
          type: 'error',
          message: vue.$t('please_input_audit_not_pass_reason')
        })
        return
      }
      vue.form.approvalStatus = 4
      vue.form.id = vue.merchantCode
      vue.form.planCode = vue.planCode
      purchasePlan.auditPurchasePlan(vue.form).then(result => {
        if (result && result.code === '0') {
          this.$emit('update:visible', !this.visible)
          vue.$emit('audit', {
            remark: vue.form.remark,
            isPass: false
          })
          vue.form.remark = ''
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
