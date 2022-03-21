<template>
  <section class="pg-paySummary-list">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>{{ $t('payment_and_settlement') }}</span> <!-- 支付和结算 -->
      </div>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('currencyType')" :rules="rules.coinType" prop="coinType"> <!-- 币别码 -->
            <el-select v-model="formData.coinType" name="formData_coinType" @change="cleanProduct">
              <el-option :label="$t('please_choose')" />
              <el-option v-for="item in coinTypeListTemp" :label="item.targetCurrencyName" :key="item.targetCurrencyCode" :value="item.targetCurrencyCode" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('manual_order_payment_type')" :rules="rules.orderPaymentType" prop="orderPaymentType"> <!-- 付款方式 -->
            <el-select v-model="formData.orderPaymentType" name="formData_orderPaymentType">
              <el-option :label="$t('please_choose')" />
              <el-option v-for="item in orderPaymentTypeList" :label="item.value" :key="item.key" :value="item.key" />
            </el-select>
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
      default: null
    },
    formData: {
      type: Object,
      default: null
    },
    forCustomer: {
      type: Boolean,
      default: false
    },
    forDistributor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      coinTypeList: [],
      coinTypeListTemp: [],
      orderPaymentTypeList: [],
      rules: {
        coinType: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        orderPaymentType: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
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
    async _initCoinTypeList() { // 初始化币种信息
      const result = await this.$oms.$api.common.getCurrencies({})
      if (result.code === '0') {
        this.coinTypeList = result.data
        this.coinTypeListTemp = this.coinTypeList
        this.collect.coinTypeMap = result.data.reduce((m, i) => { m[i.targetCurrencyCode] = i.targetCurrencyName; return m }, {})
        this.collect.coinTypeSignMap = result.data.reduce((m, i) => { m[i.targetCurrencyCode] = i.targetSymbol; return m }, {})
        this.collect.coinExchangeMap = result.data.reduce((m, i) => { m[i.targetCurrencyCode] = i.exchangeRate; return m }, {})
      }
    },
    async _initOrderPaymentType() { // 初始化支付方式
      const queryParam = {
        categorys: [
          'PAY_METHOD'
        ]
      }
      const result = await this.$oms.$api.common.listByCategorysForOrder(queryParam)
      if (result.code === '0') {
        result.data['PAY_METHOD'].forEach((item) => {
          if (this.forCustomer || this.forDistributor) {
            // 代客下单只有线下支付
            if (Number(item.code) === 2) {
              this.orderPaymentTypeList.push({
                key: item['code'],
                value: item['name']
              })
            }
          } else {
            this.orderPaymentTypeList.push({
              key: item['code'],
              value: item['name']
            })
          }
        })
      }
    },
    modifyCoinTypeList() {
      const result = []
      for (let index = 0; index < this.coinTypeList.length; index++) {
        if (this.coinTypeList[index].targetCurrencyCode === 'CNY') {
          result.push(this.coinTypeList[index])
        }
      }

      if (result.length === 0) {
        result.push({
          targetCurrencyCode: 'CNY',
          targetCurrencyName: '人民币'
        })
      }
      this.coinTypeListTemp = result
    },
    cleanProduct() {
      this.$emit('cleanProduct')
    },
    init() {
      this._initCoinTypeList()
      this._initOrderPaymentType()
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
