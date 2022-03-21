<template>
  <section class="pg-orderSummary-list">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>{{ $t('order_aggregate') }}</span> <!-- 支付和结算 -->
      </div>
      <el-form-item :label="$t('order_total_volume_of_commodities')"> <!-- 商品数量合计 -->
        <span>{{ productListNumber }}</span>
      </el-form-item>
      <el-form-item :label="$t('order_total_merchandise_value')"> <!-- 商品金额合计 -->
        <span>{{ $portal.toThousandFilter(formData.productTotalAmount) }}</span>
      </el-form-item>
      <el-form-item v-if="!forDistributor" :label="$t('freight')"> <!-- 运费 -->
        <el-col :span="5" >
          <el-input v-model="formData.orderDeliveryFee" name="formData_orderDeliveryFee" @change="calculateMoney" />
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('order_total_sum_of_orders')"> <!-- 订单金额合计 -->
        <span>{{ $portal.toThousandFilter(formData.totalAmount) }}</span>
      </el-form-item>
    </el-card>
  </section>
</template>
<script>

export default {
  props: {
    collect: {
      type: Object,
      default: null
    },
    formData: {
      type: Object,
      default: null
    },
    forDistributor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      productListNumber: 0
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
          this.formData.productTotalAmount = this.formData.productTotalAmount + ((!data.salePriceWithTax ? 0 : data.salePriceWithTax) * num)
        })
      }
      this.formData.productTotalAmount = Number(this.formData.productTotalAmount).toFixed(2)

      this.formData.totalAmount = parseFloat(this.formData.productTotalAmount)
      if (!this.forDistributor) {
        if (!this.formData.orderDeliveryFee) {
          this.formData.orderDeliveryFee = 0
        }
        this.formData.orderDeliveryFee = parseFloat(this.formData.orderDeliveryFee).toFixed(2)
        if (isNaN(this.formData.orderDeliveryFee) || this.formData.orderDeliveryFee < 0) {
          this.formData.orderDeliveryFee = 0
        }
        this.formData.totalAmount = parseFloat(this.formData.productTotalAmount) + parseFloat(this.formData.orderDeliveryFee)
      }
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
