<template>
  <section class="pg-manualOrder-list">
    <el-form ref="manualOrderForm" :model="formData" :rules="rules" label-width="240px">
      <!-- 基本信息 -->
      <BasicSummary
        ref="basicSummary"
        :form-data.sync="formData"
        :collect.sync="collect"
        :for-customer.sync="forCustomer"
        @cleanProduct="cleanProduct"
        @changeMerchant="changeMerchant"
      />
      <!-- 下单账户信息 -->
      <UserSummary
        v-if="!forCustomer"
        ref="userSummary"
        :form-data.sync="formData"
        :collect.sync="collect"
        @changeUser="changeUser"
      />
      <!-- 下单账户信息（客户下单） -->
      <CustomerSummary
        v-if="forCustomer"
        ref="customerSummary"
        :form-data.sync="formData"
        :collect.sync="collect"
        @cleanProduct="cleanProduct"
      />
      <!-- 收货信息 -->
      <ReceiverSummary
        ref="receiverSummary"
        :form-data.sync="formData"
        :collect.sync="collect"
        :for-customer.sync="forCustomer"
        @cleanProduct="cleanProduct"
      />
      <!-- 发运计划 -->
      <DeliverySummary ref="deliverySummary" :form-data.sync="formData" :collect.sync="collect" />
      <!-- 支付和结算 -->
      <PaySummary
        ref="paySummary"
        :form-data.sync="formData"
        :collect.sync="collect"
        :for-customer.sync="forCustomer"
        @cleanProduct="cleanProduct"
      />
      <!-- 商品信息 -->
      <ProductSummary
        ref="productSummary"
        :form-data.sync="formData"
        :collect.sync="collect"
        @updateProductNum="updateProductNum"
        @updateProductPrice="updateProductPrice"
      />
      <!-- 订单合计 -->
      <OrderSummary ref="orderSummary" :form-data.sync="formData" :collect.sync="collect" />
    </el-form>
    <ody-fixed>
      <el-button
        :disabled="submiting"
        name="handleSubmit"
        size="small"
        type="primary"
        @click="handleSubmit('manualOrderForm')"
      >{{ $t('common_save') }}</el-button>
      <el-button name="returnBack" size="small" @click="returnBack">{{ $t('common_back') }}</el-button>
    </ody-fixed>
  </section>
</template>
<script>
import BasicSummary from '@/components/manualOrder.back/basicSummary.vue'
import UserSummary from '@/components/manualOrder.back/userSummary.vue'
// import CustomerSummary from '@/components/manualOrderCustomer/customerSummary.vue'
import ReceiverSummary from '@/components/manualOrder.back/receiverSummary.vue'
import DeliverySummary from '@/components/manualOrder.back/deliverySummary.vue'
import PaySummary from '@/components/manualOrder.back/paySummary.vue'
import ProductSummary from '@/components/manualOrder.back/productSummary.vue'
import OrderSummary from '@/components/manualOrder.back/orderSummary.vue'

export default {
  components: {
    BasicSummary,
    UserSummary,
    // CustomerSummary,
    ReceiverSummary,
    DeliverySummary,
    PaySummary,
    ProductSummary,
    OrderSummary
  },
  data() {
    return {
      collect: {}, // 所有子组件的对象
      loading: false,
      submiting: false,
      forCustomer: false,
      formData: {
        merchantId: null,
        orderSysSource: null,
        storeId: null,
        productList: [],
        userId: null,
        userName: null,
        mobile: null,
        email: null,
        customerId: null,
        customerName: null,

        goodReceiverProvinceCode: null,
        goodReceiverCityCode: null,
        goodReceiverAreaCode: null,
        goodReceiverAddress: null,

        manualOrderAttachmentVOList: [],

        deliveryDate: null,

        productTotalAmount: 0,
        totalAmount: 0
      },
      rules: {}
    }
  },
  computed: {},
  watch: {
    formData: {
      handler: (value, oldValue, e) => {},
      deep: true
    }
  },
  async mounted() {
    try {
      this.forCustomer = !!this.$route.meta.forCustomer
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async handleSubmit(formName) {
      // 确认下单
      this.submiting = true
      this.loading = true
      const vue = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          // vue.submiting = true
          var productTil = ''
          for (var i = 0; i < vue.formData.productList.length; i++) {
            // 检查商品是否有价格
            var productItem = vue.formData.productList[i]
            if (
              !productItem.salePriceWithTax &&
              Number(productItem.salePriceWithTax).toFixed(2) !==
                Number(0).toFixed(2)
            ) {
              productTil += productItem.chineseName + ','
            }
          }
          if (productTil !== '') {
            // 商品不存在价格
            vue.$message({
              type: 'error',
              message: productTil + vue.$t('thereIsNoPriceForGoods')
            })
            vue.submiting = false
            return
          }
          const submitObject = vue.$portal.deepClone(vue.formData)
          submitObject.deliveryDate = vue.$portal.parseTime(
            vue.formData.deliveryDate,
            '{y}-{m}-{d}'
          )
          submitObject.manualOrderItemVOList = submitObject.productList
          submitObject.currency = submitObject.coinType

          submitObject.currencyName =
            vue.collect.coinTypeMap[submitObject.coinType]
          // submitObject.currencySymbol = vue.collect.coinTypeSignMap[submitObject.coinType]
          submitObject.exchangRate =
            vue.collect.coinExchangeMap[submitObject.coinType]
          if (!submitObject.orderDeliveryFee) {
            submitObject.orderDeliveryFee = 0
          }
          delete submitObject.productList
          delete submitObject.totalAmount
          console.log('提交对象:' + JSON.stringify(submitObject))
          vue.$oms.$api.manualOrder
            .manualOrderCreateOrder(submitObject)
            .then(result => {
              if (result.code === '0') {
                let successMessage = ''
                if (
                  result.data.childOrderCodeList &&
                  result.data.childOrderCodeList.length > 0
                ) {
                  var orderCodes = result.data.childOrderCodeList.join(';')
                  successMessage =
                    vue.$t('successfulOrderCreationGeneration') +
                    result.data.childOrderCodeList.length +
                    vue.$t('ordersChildMore') +
                    orderCodes
                } else {
                  successMessage =
                    vue.$t('createOrderSuccessce') + result.data.orderCode
                }
                vue.$message({
                  type: 'success',
                  message: successMessage
                })
                // TODO 跳转到 订单列表
                vue.$portal.delActiveView()
              } else {
                let responeErrorMessage = ''
                if (result.data && result.data.resultMsg) {
                  responeErrorMessage = result.data.resultMsg
                }
                vue.$message({
                  type: 'error',
                  message: vue.$t('failureCreateOrder') + responeErrorMessage
                })
              }
            })
            .finally(() => {
              vue.submiting = false
              vue.loading = false
            })
        } else {
          vue.submiting = false
          vue.loading = false
        }
        console.info(valid)
      })
    },
    returnBack() {
      this.$portal.delActiveView()
    },
    cleanProduct() {
      this.$refs['productSummary'].cleanProduct()
    },
    calculateMoney() {
      this.$refs['orderSummary'].calculateMoney()
    },
    updateProductNum() {
      this.$refs['orderSummary'].updateProductNum()
    },
    updateProductPrice() {
      this.$refs['orderSummary'].updateProductPrice()
    },
    changeUser() {
      this.$refs['paySummary'].modifyCoinTypeList()
    },
    changeMerchant() {
      if (this.$refs['customerSummary']) {
        this.$refs['customerSummary'].changeMerchant()
      }
    },
    init() {}
  }
}
</script>

<style lang="scss" scoped>
</style>
