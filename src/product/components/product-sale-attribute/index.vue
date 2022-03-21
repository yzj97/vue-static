<template>
  <section class="section">
    <el-card>
      <div slot="header" class="clearfix">
        <strong>{{ $t('销售属性') }}</strong>
      </div>
      <div v-if="loading && mp.productInfoVO.type !== '31'">
        <product-spec-card
          ref="productCard"
          :type-of-product="typeOfProduct"
          :sale-attribute-edit-vos="saleAttributeEditVOS"
          :barcode-price-vos="barcodePriceVOS"
          :tax-list="taxList"
          :mp="mp"
          :mp-id="$route.query.id"
          :is-view.sync="isView"
        />
      </div>
      <div v-if="loading && mp.productInfoVO.type === '31'">
        <product-spec-weight
          ref="productWeight"
          :barcode-price-vos="barcodePriceVOS"
          :tax-list="taxList"
          :mp="mp"
          :mp-id="$route.query.id"
          :is-view.sync="isView"
        />
      </div>
    </el-card>
  </section>
</template>

<script>
import productSpecCard from '@/components/product-spec-card'
import productSpecWeight from '@/components/product-spec-weight'
export default {
  components: {
    productSpecCard,
    productSpecWeight
  },
  props: {
    mp: {
      type: Object,
      required: true,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      service: this.$product.$api.productApi,
      typeOfProduct: this.mp.productVO.typeOfProduct,
      saleAttributeEditVOS: this.mp.saleAttributeEditVOS,
      barcodePriceVOS: this.mp.barcodePriceVOS,
      loading: false,
      taxList: []
    }
  },
  mounted() {
    this.init()
    // console.log(this.mp, 'shanhaohui', this.$route.query.id)
  },
  methods: {
    init() {
      // this.loading = true
      Promise.all([this.getSpecList(), this.getStringValue()]).then(res => {
        this.loading = true

        // 销税属性
        var taxObj = JSON.parse(res[1].data)
        var taxList = []
        for (const i in taxObj) {
          taxList.push({ saleTaxRateId: i, saleTaxRate: taxObj[i] })
        }
        this.taxList = taxList

        // 类目表格 编辑的时候请求
        if (
          !this.$route.query.id ||
          !(this.saleAttributeEditVOS && this.saleAttributeEditVOS.length !== 0)
        ) {
          this.saleAttributeEditVOS = res[0].data
        }
      })
    },
    getStringValue() {
      const params = {
        key: 'saleTaxRateConfig',
        pool: 'product'
      }
      return new Promise((resolve, reject) => {
        this.service.getStringValue(params).then(res => {
          resolve(res)
        })
      })
    },

    getSpecList() {
      const params = {
        categoryId: this.mp.productInfoVO.categoryId,
        attType: 2
      }
      return new Promise((resolve, reject) => {
        this.service.queryCategoryAttribute(params).then(res => {
          resolve(res)
        })
      })
    },
    getData(emit) {
      const data = this.$refs.productCard.toParentData()
      var flag = false
      if (data.typeOfProduct === 3) {
        this.$refs.productCard.$refs.specChoose.$refs.dynamicValidateForm.validate(
          valid => {
            if (valid) {
              if (emit) {
                this.$set(
                  this.mp.productVO,
                  'typeOfProduct',
                  data.typeOfProduct
                )
                this.$set(this.mp, 'barcodePriceVOS', data.barcodePriceVOS)
                this.$set(
                  this.mp,
                  'saleAttributeEditVOS',
                  data.saleAttributeEditVOS
                )
                this.$set(this.mp, 'taxRateVO', data.taxRateVO)
                this.$set(this.mp.productInfoVO, 'taxCode', data.taxCode)
              }
              flag = true
            } else {
              flag = false
            }
          }
        )
      } else if (data.typeOfProduct === 0) {
        this.$refs.productCard.$refs.ruleForm.validate(valid => {
          if (valid) {
            if (emit) {
              this.$set(this.mp.productVO, 'typeOfProduct', data.typeOfProduct)
              this.$set(this.mp, 'barcodePriceVOS', data.barcodePriceVOS)
              this.$set(this.mp, 'taxRateVO', data.taxRateVO)
              this.$set(this.mp.productInfoVO, 'taxCode', data.taxCode)

              if (data.giftInfo) {
                if (data.giftInfo.faceValue) {
                  this.$set(
                    this.mp.productInfoVO,
                    'faceValue',
                    data.giftInfo.faceValue
                  )
                }
                if (data.giftInfo.relationProductId) {
                  this.$set(
                    this.mp,
                    'relationProductId',
                    data.giftInfo.relationProductId
                  )
                }
              }
            }
            flag = true
          } else {
            flag = false
          }
        })
      }
      return flag
    },
    getWeightData(emit) {
      var flag = false
      try {
        this.$refs.productWeight.$refs.ruleForm.validate(valid => {
          flag = valid
          if (valid && emit) {
            var data = this.$refs.productWeight.toParentData()
            this.$set(this.mp, 'barcodePriceVOS', data.barcodePriceVOS)
            this.$set(this.mp, 'taxRateVO', data.taxRateVO)
            this.$set(this.mp.productInfoVO, 'taxCode', data.taxCode)
          }
        })
      } catch (ex) {
        console.log(ex)
      }
      return flag
    },
    validate() {
      if (this.mp.productInfoVO.type === '31') {
        return this.getWeightData()
      } else {
        return this.getData()
      }
    },
    preSubmit() {
      if (this.mp.productInfoVO.type === '31') {
        this.getWeightData(true)
      } else {
        this.getData(true)
      }
    }
  }
}
</script>
<style scoped>
</style>
