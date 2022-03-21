<template>
  <div>
    <ody-dialog
      :visible="sureModalVisible"
      :before-close="handleClose"
      :title="$t('plan_sure')"
      width="60%"
    >
      <el-form :modal="form" label-position="right" label-width="80px">
        <div
          style="text-align:center;margin-bottom: 20px"
        >{{ $t('purchase_plan_sure_confirm') + planCode + $t('purchase_plan_plan') }}</div>
        <el-form-item :label="$t('common_remark')">
          <el-input v-model="form.remark" name="form_remark" type="textarea" maxlength="50" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <el-button name="handlePass" type="primary" @click="handlePass">{{ $t('common_confirm') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    sureModalVisible: {
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
      this.$emit('update:sureModalVisible', !this.sureModalVisible)
      this.form.remark = ''
    },
    handlePass() {
      const vue = this
      const purchasePlan = vue.$opms.$api.purchasePlan
      vue.$emit('audit', {
        remark: vue.form.remark,
        isPass: true
      })
      vue.form.id = vue.merchantCode
      purchasePlan.confirmPurchasePlan(vue.form).then(result => {
        if (result && result.code === '0') {
          vue.$emit('update:sureModalVisible', !this.sureModalVisible)
          vue.$emit('audit', {
            remark: vue.form.remark
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
