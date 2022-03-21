<template>
  <section class="pg-orderSummary-list">
    <el-card shadow="never">
      <el-row>
        <el-col :span="14">
          <span>{{ $t('合计') }}</span>
        </el-col>
        <el-col :span="4">
          <el-form-item :label="$t('商品个数')">
            <span>{{ productNumber }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('收货任务数量')">
            <span>{{ productListNumber }}</span>
          </el-form-item>
          <el-form-item :label="$t('总计金额')">
            <span><span class="error">{{ formData.coinType && collect.coinTypeSignMap ? collect.coinTypeSignMap[formData.coinType] : '' }} </span> {{ formData.totalAmount | toThousandFilter }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
  </section>
</template>
<script>

export default {
  props: {
    collect: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      productListNumber: 0,
      productNumber: 0
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    calculateProductNum() {
      if (this.formData && this.formData.productList) {
        this.productNumber = this.formData.productList.length
        let number = 0
        for (let i = 0; i < this.formData.productList.length; i++) {
          const obj = this.formData.productList[i]
          number = parseInt(number) + parseInt(obj['productItemNum'])
        }
        this.productListNumber = number
      }
    },
    updateProductNum() { // 更新商品数量
      this.calculateProductNum()
      this.calculateMoney()
    },
    updateProductPrice() { // 更新商品价格
      this.calculateMoney()
    },
    calculateMoney() { // 计算金额
      console.info('子组件-计算金额')
      this.formData.productTotalAmount = 0
      if (this.formData.productList) {
        this.formData.productList.forEach((data) => {
          let num = parseFloat(data.productItemNum)
          if (isNaN(num)) {
            data.productItemNum = 1
            num = 1
          }
          this.formData.productTotalAmount = this.formData.productTotalAmount + ((!(data.purchasePrice == null ? data.salePriceWithTax : data.purchasePrice) ? 0 : (data.purchasePrice == null ? data.salePriceWithTax : data.purchasePrice)) * num)
        })
      }
      this.formData.productTotalAmount = Number(this.formData.productTotalAmount).toFixed(2)

      this.formData.totalAmount = parseFloat(this.formData.productTotalAmount)

      this.formData.totalAmount = Number(this.formData.totalAmount).toFixed(2)
    },
    init() {
      this.calculateMoney()
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
