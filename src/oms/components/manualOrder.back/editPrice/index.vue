<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('order_edit_product_price')"
      width="600px"
      @open="init" > <!-- 修改单价 -->
      <section class="pg-editPrice">
        <el-form ref="form" :rules="rules" :model="dataForm" label-width="100px" class="form">
          <el-form-item :label="$t('order_input_product_price')" prop="salePriceWithTax"> <!-- 输入单价 -->
            <el-col :span="12">
              <el-input v-model="dataForm.salePriceWithTax" name="dataForm_salePriceWithTax" />
            </el-col>
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
        salePriceWithTax: [
          { required: true, message: this.$t('required'), trigger: 'change' },
          { validator: this.validateAmount, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    validateAmount(rule, value, callback) {
      const num = Number(value).toFixed(2)
      if (!isNaN(num) && num >= 0) {
        return callback()
      }
      return callback(new Error(this.$t('invalid_number_tip')))
    },
    init() {
      this.dataForm = {
        salePriceWithTax: this.product.salePriceWithTax
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
          if (Number(vue.dataForm.salePriceWithTax).toFixed(2) !== Number(vue.product.salePriceWithTax).toFixed(2)) {
            vue.product.salePriceWithTax = Number(vue.dataForm.salePriceWithTax).toFixed(2)
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
