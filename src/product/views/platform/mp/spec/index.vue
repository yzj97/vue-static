<template>
  <div>
    <product-spec-card
      ref="productCard"
      :type-of-product="typeOfProduct"
      :sale-attribute-edit-vos="saleAttributeEditVOS"
      :barcode-price-vos="barcodePriceVOS"
      :mp-id="mpId"/>
    <el-button name="getData" type="primary" size="small" @click="getData">{{ $t('得到组件中的值') }}</el-button>
  </div>
</template>
<script>
import productSpecCard from '@/components/product-spec-card'
export default {
  components: {
    productSpecCard
  },
  data() {
    return {
      service: this.$product.$api.productApi,
      typeOfProduct: -1,
      saleAttributeEditVOS: [],
      barcodePriceVOS: [],
      mpId: '1234',
      categoryId: '1909250000062883'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      Promise.all([this.getSpecList(), this.getTableListApi()]).then(res => {
        console.log(this.$portal.deepClone(res), 'init')
        // 规格数据
        this.saleAttributeEditVOS = res[0].data
        // 列表字段
        this.barcodePriceVOS = res[1].data
        // 是否开启多规格
        this.typeOfProduct = 3
      })
    },
    getSpecList() {
      const params = {
        categoryId: this.categoryId,
        mpId: this.mpId,
        attType: 2
      }
      return new Promise((resolve, reject) => {
        this.service.queryCategoryAttribute(params).then(res => {
          resolve(res)
        })
      })
    },
    getTableListApi() {
      const params = {
        mpId: this.mpId
      }
      return new Promise((resolve, reject) => {
        this.service.queryBarcodePriceList(params).then(res => {
          resolve(res)
        })
      })
    },
    getData() {
      console.log(this.$refs.productCard)
      const data = this.$refs.productCard.toParentData()
      console.log(data)
      if (data.typeOfProduct === 3) {
        this.$refs.productCard.$refs.specChoose.$refs.dynamicValidateForm.validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else if (data.typeOfProduct === 0) {
        this.$refs.productCard.$refs.ruleForm.validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
