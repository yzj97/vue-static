<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :modal-append-to-body="false"
      width="50%"
      @open="init"
    >
      <section>
        <el-form
          ref="editPriceForm"
          :model="editPriceForm"
          :rules="rules"
          label-width="120px"
          class="form"
        >
          <el-form-item :label="this.$t('retail_price')" prop="salePriceWithTax">
            <ody-input-number
              v-model="editPriceForm.salePriceWithTax"
              :decimal="2"
              :min="0.01"
              :max="9999999"
              :placeholder="$t('大于0,保留两位小数')"
              name="editPriceForm_salePriceWithTax"
            >
              <template slot="prepend">￥</template>
            </ody-input-number>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('cancel') }}</el-button>
        <ody-button
          v-if="dataType===1"
          name="PlatformMerchantProductUpdatePrice_submitForm"
          size="small"
          type="primary"
          code="PlatformMerchantProductUpdatePrice"
          @click="submitForm('editPriceForm')"
        >{{ $t('common_confirm_search') }}</ody-button>
        <ody-button
          v-if="dataType===2"
          name="MerchantProductManageUpdatePrice_submitForm"
          size="small"
          type="primary"
          code="MerchantProductManageUpdatePrice"
          @click="submitForm('editPriceForm')"
        >{{ $t('common_confirm_search') }}</ody-button>
        <ody-button
          v-if="dataType===3"
          name="StoreProductListUpdatePrice_submitForm"
          size="small"
          type="primary"
          code="StoreProductListUpdatePrice"
          @click="submitForm('editPriceForm')"
        >{{ $t('common_confirm_search') }}</ody-button>
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
    merchantProductId: {
      type: Number,
      default: null
    },
    typeOfProduct: {
      type: Number,
      default: null
    },
    dataType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      editPriceForm: {
        id: null,
        salePriceWithTax: null
      },
      rules: {
        salePriceWithTax: [
          {
            required: true,
            message: this.$t('请输入零售价'),
            trigger: 'change'
          },
          { validator: this.salePricePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    salePricePass(rule, value, callback) {
      if (this.typeOfProduct === 4 && value > this.editPriceForm.marketPrice) {
        callback(new Error(this.$t('组合商品总价不能大于市场价') + this.editPriceForm.marketPrice))
      } else {
        callback()
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.$refs['editPriceForm'].resetFields()
    },
    init() {
      if (this.merchantProductId) {
        const params = {}
        params.mpIds = []
        params.mpIds.push(this.merchantProductId)
        params.typeOfProduct = this.typeOfProduct
        this.$product.$api.priceApi
          .queryMerchantProductPriceInfo(params)
          .then(result => {
            if (result && result.code === '0') {
              this.editPriceForm = Object.assign(this.editPriceForm, result.data[0])
            }
          })
      }
    },
    submitForm(editPriceForm) {
      this.$refs['editPriceForm'].validate(valid => {
        if (valid) {
          const paramsList = []
          paramsList.push(this.editPriceForm)
          if (this.dataType === 1) {
            this.$product.$api.priceApi
              .batchUpdatePlatformProductPriceById(paramsList)
              .then(result => {
                if (result && result.code === '0') {
                  this.$emit('update:visible', !this.visible)
                  this.$refs['editPriceForm'].resetFields()
                  this.$emit('ok', [])
                }
              })
          } else {
            paramsList.forEach(item => {
              item.modifyType = 1
            })
            this.$product.$api.priceApi
              .updateMerchantProductPrice(paramsList)
              .then(result => {
                if (result && result.code === '0') {
                  this.$emit('update:visible', !this.visible)
                  this.$refs['editPriceForm'].resetFields()
                  this.$emit('ok', [])
                }
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
