<template>
  <section class="pg-orderSummary-list">
    <el-card shadow="never">
      <el-row>
        <el-col :span="14">
          <span>{{ $t('order_aggregate') }}</span> <!-- 支付和结算 -->
        </el-col>
        <el-col :span="4">
          <el-form-item :label="$t('order_total_volume_of_commodities')"> <!-- 商品数量合计 -->
            <span>{{ productListNumber }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('order_total_merchandise_value')"> <!-- 商品金额合计 -->
            <span><span class="error">{{ formData.coinType && collect.coinTypeSignMap ? collect.coinTypeSignMap[formData.coinType] : '' }} </span>{{ formData.productTotalAmount | toThousandFilter }}</span>
          </el-form-item>
          <el-form-item :label="$t('freight')"> <!-- 运费 -->
            <el-col :span="22">
              <el-input v-model="formData.orderDeliveryFee" name="formData_orderDeliveryFee" maxlength="10" @change="calculateMoney">
                <div slot="prefix"><span class="error">{{ formData.coinType && collect.coinTypeSignMap ? collect.coinTypeSignMap[formData.coinType] : '' }}</span></div>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('order_total_sum_of_orders')"> <!-- 订单金额合计 -->
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
      if (!this.formData.orderDeliveryFee) {
        this.formData.orderDeliveryFee = 0
      }
      this.formData.orderDeliveryFee = parseFloat(this.formData.orderDeliveryFee).toFixed(2)
      if (isNaN(this.formData.orderDeliveryFee) || this.formData.orderDeliveryFee < 0) {
        this.formData.orderDeliveryFee = 0
      }
      this.formData.totalAmount = parseFloat(this.formData.productTotalAmount) + parseFloat(this.formData.orderDeliveryFee)

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
