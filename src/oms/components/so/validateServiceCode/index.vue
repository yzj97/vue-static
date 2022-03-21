<template>
  <div>
    <el-button name="validate" type="primary" size="mini" @click="visible = true">{{ $t('服务核销') }}</el-button>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('服务核销')"
      width="600px"
      @open="init" > <!-- 修改备注 -->
      <section class="pg-editRemark">
        <el-form ref="form" :rules="rules" :model="dataForm" label-width="100px" class="form" @submit.native.prevent>
          <el-form-item :label="$t('服务码：')" :rules="rules.serviceCode" prop="serviceCode"> <!-- 服务码 -->
            <el-input
              v-model="dataForm.serviceCode"
              name="dataForm_serviceCode"
              maxlength="20"
              show-word-limit />
          </el-form-item>
          <el-form-item :label="$t('备注：')" > <!-- 备注 -->
            <el-input
              v-model="dataForm.orderRemarkMerchant2user"
              name="dataForm_remark"
              type="textarea"
              maxlength="100"
              show-word-limit />
          </el-form-item>
        </el-form>

      </section>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="submiting" name="handleOk" size="small" type="primary" @click="handleOk('form')">{{ $t('ok') }}</el-button>
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    orderId: {
      type: Number,
      default: null
    }
  },
  data: function() {
    return {
      submiting: false,
      visible: false,
      dataForm: {
        orderRemarkMerchant2user: null,
        serviceCode: null
      },
      rules: {
        serviceCode: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    eventQueryOrderRemark() {
      this.$emit('queryOrderRemark')
    },
    init() {
      this.dataForm = {
        orderRemarkMerchant2user: null,
        serviceCode: null
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    handleClose() {
      this.visible = !this.visible
    },
    async handleOk(formName) {
      const self = this
      this.submiting = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dataForm.id = this.orderId
          self.$oms.$api.so.validateServiceCode(this.dataForm).then(res => {
            self.$message({
              message: self.$t('订单核销成功，同时订单状态更新为：已签收'),
              type: 'success'
            })
            self.onSuccess()
            self.eventQueryOrderRemark()
            self.handleClose()
          }).finally((res) => {
            self.submiting = false
          })
        } else {
          self.submiting = false
        }
      })
    },
    onSuccess() {
      this.$emit('onSuccess')
    }
  }
}
</script>

<style scoped>

</style>
