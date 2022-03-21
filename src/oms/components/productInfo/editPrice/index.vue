<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('common_update')"
      width="600px"
      @open="init" >
      <section class="pg-editPrice">
        <el-form ref="form" :rules="rules" :model="modifyPriceItem" label-width="100px" class="form">
          <el-form-item :label="$t('percentage')"> <!-- 折扣比例 -->
            <el-col :span="10">
              <el-input v-model="modifyPriceItem.percentage" name="modifyPriceItem_percentage" type="number" @change="changePricePercentage" />
            </el-col>
            <el-col :span="2">
              %
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('newPrice')" prop="newPrice"> <!-- 新价格 -->
            <el-col :span="12">
              <el-input v-model="modifyPriceItem.newPrice" name="modifyPriceItem_newPrice" type="number" @change="changePriceItem" />
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
    item: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      submiting: false,
      modifyPriceItem: {
        percentage: null,
        newPrice: null
      },
      rules: {
        newPrice: [
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
      return callback(new Error(this.$t('errorOrderPrice')))
    },
    init() {
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }

      this.item.newPrice = this.item.productItemAmount / this.item.productItemNum // 新价格
      this.item.percentage = (this.item.newPrice * this.item.productItemNum / this.item.productItemNum) / this.item.productPriceSale * 100 // 折扣比例

      this.modifyPriceItem = Object.assign({}, this.item)
    },
    changePriceItem() {
      var num = (this.modifyPriceItem.newPrice * this.modifyPriceItem.productItemNum / this.modifyPriceItem.productItemNum) / this.modifyPriceItem.productPriceSale * 100 // 折扣比例
      this.modifyPriceItem.percentage = Math.round(num * 100) / 100
    },
    changePricePercentage() {
      var percentage = this.modifyPriceItem.percentage
      var num = this.modifyPriceItem.productPriceSale * (percentage / 100) // 新价格
      this.modifyPriceItem.newPrice = Math.round(num * 100) / 100
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async handleOk(formName) {
      const vue = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const item = vue.modifyPriceItem
          const allNum = item.newPrice * item.productItemNum
          vue.$oms.$api.soItem.modifyPriceItem({
            id: item.id, orderCode: item.orderCode, productItemAmount: allNum, productPriceSale: item.newPrice
          }).then(result => {
            if (result.code === '0') {
              vue.$emit('update:visible', !this.visible)
              vue.$emit('ok')
              vue.$message({
                type: 'sucess',
                message: vue.$t('promptOperateSuccess')
              })
            } else {
              vue.$message({
                type: 'error',
                message: result.message
              })
            }
          }).catch(resp => {
            vue.$message({
              type: 'error',
              message: resp
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
