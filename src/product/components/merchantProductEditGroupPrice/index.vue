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
          <el-form-item :label="this.$t('group_price')" prop="groupPrice">
            <ody-input-number
              v-model="editPriceForm.groupPrice"
              :decimal="2"
              :min="0.01"
              :max="9999999"
              :placeholder="$t('大于0,保留两位小数')"
              name="editPriceForm_groupPrice"
            >
              <template slot="prepend">￥</template>
            </ody-input-number>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('cancel') }}</el-button>
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
    },
    salePriceWithTax: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      editPriceForm: {
        id: null,
        merchantProductId: this.merchantProductId,
        groupPrice: null
        // groupPrice: this.salePriceWithTax > 1 ? this.salePriceWithTax - 1 : null
      },
      rules: {
        groupPrice: [
          {
            required: true,
            message: this.$t('请输入拼团价'),
            trigger: 'change'
          },
          { validator: this.groupPricePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    groupPricePass(rule, value, callback) {
      if (this.salePriceWithTax != null && value > this.salePriceWithTax - 1) {
        callback(new Error(this.$t('拼团价必须比销售价少一元')))
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
        this.$product.$api.priceApi.queryMerchantProductPriceInfo(params).then(result => {
          if (result && result.code === '0' && result.data && result.data.length > 0) {
            if (result.data[0] && result.data[0].id) {
              this.editPriceForm = result.data[0]
            }
          }
        })
      }
    },
    submitForm() {
      this.$refs['editPriceForm'].validate(valid => {
        if (valid) {
          const paramsList = []
          this.editPriceForm.merchantProductId = this.merchantProductId
          paramsList.push(this.editPriceForm)
          this.$product.$api.priceApi.updateMerchantProductPrice(paramsList)
            .then(result => {
              if (result && result.code === '0') {
                this.$emit('update:visible', !this.visible)
                this.$refs['editPriceForm'].resetFields()
                this.$emit('ok', [])
              }
            })
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
