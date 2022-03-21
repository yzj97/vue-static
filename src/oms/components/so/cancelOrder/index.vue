<template>
  <div>
    <el-button name="showDialog" type="primary" size="mini" @click="showDialog">{{ $t('cancelOrder') }}<!--取消订单--></el-button>
    <ody-dialog :visible.sync="show" :title="$t('cancelOrder')" :before-close="cancel" width="600px"><!--取消订单-->
      <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="120px">
        <el-form-item :label="$t('cancelling_the_cause')+'：'" prop="orderCancelReasonId"><!--取消原因-->
          <el-select v-model="form.orderCancelReasonId" name="form_orderCancelReasonId">
            <el-option
              v-for="item in reasons"
              :key="item.code"
              :label="item.name"
              :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('order_cancel_reason_other')+'：'" prop="orderCsCancelReason"><!--输入其他原因-->
          <el-input
            v-model="form.orderCsCancelReason"
            :rows="2"
            :placeholder="$t('order_cancel_reason_other')"
            name="form_orderCsCancelReason"
            show-word-limit
            maxlength="100"
            type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="commit" size="small" type="primary" @click="commit">{{ $t('确认') }}</el-button>
        <el-button name="cancel" size="small" @click="cancel">{{ $t('取消') }}</el-button>
      </div>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    orderCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      show: false,
      reasons: [],
      form: { orderCsCancelReason: null, orderCancelReasonId: null },
      rules: {
        orderCancelReasonId: [
          { required: true, message: this.$t('请选择取消原因'), trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const self = this
      this.$oms.$api.common.listByCategorysForOrder({ categorys: ['ORDER_CANCEL_REASON_NEW'] }).then(res => {
        self.reasons = res.data.ORDER_CANCEL_REASON_NEW
      })
    },
    cancel() {
      this.$refs['form'].resetFields()
      this.show = false
    },
    showDialog() {
      this.show = true
    },
    commit() {
      const self = this
      this.form.cancelSource = 1
      this.form.orderCanceOperateType = 2
      this.form.orderCode = this.orderCode
      this.$refs['form'].validate((valid) => {
        if (valid) {
          self.$oms.$api.so.soCancelOrder(self.form).then(res => {
            self.$message({
              message: self.$t('操作成功'),
              type: 'success'
            })
            self.onSuccess()
            self.cancel()
          })
        } else {
          console.log('error submit!!')
          return false
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
