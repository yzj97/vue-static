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
            <el-table-column :label="$t('retail_price')" align="center" prop="salePriceWithTax" />
            <el-table-column align="center" prop="groupPrice">
              <template slot="header" slot-scope="scope" :scope="scope"><ody-tip-star :content="$t('group_price')"/></template>
              <template slot-scope="scope">
                <el-form-item
                  :prop="'priceList.' + scope.$index + '.groupPrice'"
                  :rules="groupPrice"
                  label-width="0px"
                >
                  <ody-input-number
                    v-model="scope.row.groupPrice"
                    :decimal="2"
                    :min="0.01"
                    :max="9999999"
                    :placeholder="$t('大于0,保留两位小数')"
                    name="scope_row_groupPrice"
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
    },
    salePriceWithTax: {
      type: Number,
      default: null
    },
    parentMerchantProductId: {
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
        groupPrice: [
          {
            required: true,
            message: this.$t('请输入拼团价'),
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
        this.$product.$api.priceApi.queryMerchantProductPriceInfo(params).then(result => {
          var priceListData = []
          if (result && result.code === '0') {
            priceListData = result.data
            for (var j in priceListData) {
              if (priceListData[j].groupPrice == null && priceListData[j].salePriceWithTax > 1) {
                // priceListData[j].groupPrice = priceListData[j].salePriceWithTax - 1
              }
            }
            // this.multiplyEditPriceForm.priceList = priceListData
          }
          if (this.parentMerchantProductId != null && priceListData.length > 0 && priceListData[0].salePriceWithTax == null) {
            // 默认团购价为销售价 - 1
            this.$product.$api.priceApi.queryMerchantProductPriceInfo({ mpIds: [this.parentMerchantProductId], typeOfProduct: this.typeOfProduct }).then(result => {
              if (result && result.code === '0' && result.data) {
                const refPriceMap = {}
                for (var idx in result.data) {
                  refPriceMap[result.data[idx].refId] = result.data[idx]
                }
                for (var index in priceListData) {
                  const obj = priceListData[index]
                  if (refPriceMap[obj.refId]) {
                    obj.salePriceWithTax = refPriceMap[obj.refId].salePriceWithTax
                    if (obj.groupPrice == null && obj.salePriceWithTax > 1) {
                      // obj.groupPrice = obj.salePriceWithTax - 1
                    }
                  }
                }
              }
              this.multiplyEditPriceForm.priceList = priceListData
            })
          } else {
            this.multiplyEditPriceForm.priceList = priceListData
          }
        })
      }
    },
    submitForm(multiplyEditPriceForm) {
      this.$refs['multiplyEditPriceForm'].validate(valid => {
        if (valid) {
          for (var m in this.multiplyEditPriceForm.priceList) {
            const price = this.multiplyEditPriceForm.priceList[m]
            if (price.groupPrice == null || price.groupPrice <= 0) {
              this.$message.error(this.$t(price.code + ' 请设置拼团价'))
              return
            }
            if (price.salePriceWithTax != null && price.groupPrice > price.salePriceWithTax - 1) {
              this.$message.error(this.$t(price.code + ' 拼团价必须比销售价少一元'))
              return
            }
          }
          this.$product.$api.priceApi.updateMerchantProductPrice(this.multiplyEditPriceForm.priceList).then(result => {
            if (result && result.code === '0') {
              this.$emit('update:visible', !this.visible)
              this.$refs['multiplyEditPriceForm'].resetFields()
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
