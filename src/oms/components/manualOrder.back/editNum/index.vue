<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('order_edit_product_num')"
      width="600px"
      @open="init" > <!-- 修改数量 -->
      <section class="pg-editNum">
        <el-form ref="form" :rules="rules" :model="dataForm" label-width="100px" class="form">
          <el-form-item :label="$t('order_input_product_num')" prop="productItemNum"> <!-- 输入数量 -->
            <el-input-number v-model="dataForm.productItemNum" name="dataForm_productItemNum" />
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <el-button :disabled="submiting" name="handleOk" size="small" type="primary" @click="handleOk('form')">{{ $t('ok') }}</el-button>
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
    product: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      submiting: false,
      dataForm: { },
      rules: {
        productItemNum: [
          { required: true, message: this.$t('required'), trigger: 'change' },
          { validator: this.validateNum, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    validateNum(rule, value, callback) {
      const num = parseInt(value)
      if (!isNaN(num) && num >= 0) {
        if (this.product.orderStartNum && (this.dataForm.productItemNum < this.product.orderStartNum)) {
          return callback(new Error(this.$t('invalid_order_start_num')))
        }
        if (this.product.orderMultipleNum && (this.dataForm.productItemNum % this.product.orderMultipleNum !== 0)) {
          return callback(new Error(this.$t('invalid_order_multiple_num')))
        }
        return callback()
      }
      return callback(new Error(this.$t('invalid_order_item_num')))
    },
    init() {
      this.dataForm = {
        productItemNum: this.product.productItemNum
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
          vue.$emit('update:visible', !this.visible)
          if (parseInt(vue.dataForm.productItemNum) !== parseInt(vue.product.productItemNum)) {
            vue.product.productItemNum = parseInt(vue.dataForm.productItemNum)
            if (vue.product.pricingMode === 2) {
              for (var i = 0; i < vue.product.advancePriceSteps.length; i++) {
                var item = vue.product.advancePriceSteps[i]
                if (vue.product.productItemNum >= item.numberStartRange && vue.product.productItemNum <= item.numberEndRange) {
                  vue.product.marketPrice = item.price
                  vue.product.salePriceWithTax = item.price
                  break
                }
              }
            }
            vue.$emit('ok')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
