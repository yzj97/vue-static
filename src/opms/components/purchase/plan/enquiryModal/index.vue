<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('purchase_plan_button_enquiry')"
      width="60%">
      <el-form :modal="form" label-position="right" label-width="80px">
        <div style="text-align:center;margin-bottom: 20px">{{ $t('purchase_plan_confirm_enquiry_pass') + planCode + $t('purchase_plan_plan') }}</div>
        <el-form-item :label="$t('common_remark')">
          <el-input v-model="form.remark" name="form_remark" type="textarea" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <el-button name="handleOk" type="primary" @click="handleOk">{{ $t('common_confirm') }}</el-button>
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
    handleOk() {
      this.$emit('ok', {
        remark: this.form.remark
      })
      this.$emit('update:visible', !this.visible)
      this.form.remark = ''
    }
  }
}
</script>

<style scoped>

</style>
