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
          ref="multiplyEditPriceForm"
          :model="multiplyEditPriceForm"
          :rules="rules"
          label-width="120px"
          class="form"
        >
          <el-table v-loading="loading" :data="multiplyEditPriceForm.priceList" name="multiplyEditPriceForm_priceList800" width="100%">
            <el-table-column :label="$t('SKU编码')" align="center" prop="code" />
            <el-table-column :label="$t('销售属性')" align="center" prop="saleAttribute" />
            <el-table-column align="center" prop="salePriceWithTax">
              <template slot="header" slot-scope="scope" :scope="scope"><ody-tip-star :content="$t('retail_price')"/></template>
              <template slot-scope="scope">
                <el-form-item
                  :prop="'priceList.' + scope.$index + '.salePriceWithTax'"
                  :rules="salePriceWithTax"
                  label-width="0px"
                >
                  <ody-input-number
                    v-model="scope.row.salePriceWithTax"
                    :decimal="2"
                    :min="0.01"
                    :max="9999999"
                    :placeholder="$t('大于0,保留两位小数')"
                    name="scope_row_salePriceWithTax"
                  >
                    <template slot="prepend">￥</template>
                  </ody-input-number>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
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
          @click="submitForm('multiplyEditPriceForm')"
        >{{ $t('common_confirm_search') }}</ody-button>
        <ody-button
          v-if="dataType===2"
          name="MerchantProductManageUpdatePrice_submitForm"
          size="small"
          type="primary"
          code="MerchantProductManageUpdatePrice"
          @click="submitForm('multiplyEditPriceForm')"
        >{{ $t('common_confirm_search') }}</ody-button>
        <ody-button
          v-if="dataType===3"
          name="StoreProductListUpdatePrice_submitForm"
          size="small"
          type="primary"
          code="StoreProductListUpdatePrice"
          @click="submitForm('multiplyEditPriceForm')"
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
      multiplyEditPriceForm: {
        priceList: []
      },
      rules: {
        salePriceWithTax: [
          {
            required: true,
            message: this.$t('请输入零售价'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.$refs['multiplyEditPriceForm'].resetFields()
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
              this.multiplyEditPriceForm.priceList = result.data
            }
          })
      }
    },
    submitForm(multiplyEditPriceForm) {
      this.$refs['multiplyEditPriceForm'].validate(valid => {
        if (valid) {
          if (this.dataType === 1) {
            this.$product.$api.priceApi
              .batchUpdatePlatformProductPriceById(
                this.multiplyEditPriceForm.priceList
              )
              .then(result => {
                if (result && result.code === '0') {
                  this.$emit('update:visible', !this.visible)
                  this.$refs['multiplyEditPriceForm'].resetFields()
                  this.$emit('ok', [])
                }
              })
          } else {
            this.multiplyEditPriceForm.priceList.forEach(item => {
              item.modifyType = 1
            })
            this.$product.$api.priceApi
              .updateMerchantProductPrice(this.multiplyEditPriceForm.priceList)
              .then(result => {
                if (result && result.code === '0') {
                  this.$emit('update:visible', !this.visible)
                  this.$refs['multiplyEditPriceForm'].resetFields()
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
