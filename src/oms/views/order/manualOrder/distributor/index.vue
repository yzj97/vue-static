<template>
  <section class="pg-distributorOrder-list">
    <el-form ref="distributorOrderForm" :model="formData" :rules="rules" label-width="240px">
      <!-- 基本信息 -->
      <BasicSummary
        ref="basicSummary"
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
      <!-- 商品信息 -->
      <ProductSummary
        ref="productSummary"
        :form-data.sync="formData"
        :collect.sync="collect"
        :for-customer.sync="forCustomer"
        @updateProductNum="updateProductNum"
        @updateProductPrice="updateProductPrice"
      />
      <!-- 订单合计 -->
      <OrderSummary ref="orderSummary" :form-data.sync="formData" :collect.sync="collect" />
    </el-form>
    <ody-fixed>
      <ody-button
        :disabled="submiting"
        name="OmsManualOrderDistributorSave_handleSubmit"
        size="small"
        code="OmsManualOrderDistributorSave"
        type="primary"
        @click="handleSubmit('distributorOrderForm')"
      >{{ $t('common_save') }}</ody-button>
      <el-button name="returnBack" size="small" @click="returnBack">{{ $t('common_back') }}</el-button>
    </ody-fixed>
  </section>
</template>
<script>
import BasicSummary from '@/components/manualOrder/distributor/basicSummary.vue'
import ReceiverSummary from '@/components/manualOrder/receiverSummary.vue'
import ProductSummary from '@/components/manualOrder/productSummary.vue'
import OrderSummary from '@/components/manualOrder/orderSummary.vue'

export default {
  name: 'OmsManualOrderDistributor',
  components: {
    BasicSummary,
    ReceiverSummary,
    ProductSummary,
    OrderSummary
  },
  data() {
    return {
      collect: {}, // 所有子组件的对象
      loading: false,
      submiting: false,
      forCustomer: true,
      formData: {
        merchantId: null,
        orderSysSource: 110004,
        forDistributor: true,
        storeId: null,
        coinType: null,
        productList: [],
        userId: null,
        userName: null,
        mobile: null,
        email: null,
        customerId: null,
        customerName: null,
        consigneeName: null,
        consigneePhone: null,
        goodReceiverProvinceCode: null,
        goodReceiverProvince: null,
        goodReceiverCityCode: null,
        goodReceiverCity: null,
        goodReceiverAreaCode: null,
        goodReceiverArea: null,
        receiveDetailAddress: null,
        goodReceiverAddress: null,

        manualOrderAttachmentVOList: [],

        orderPaymentType: null,
        orderDeliveryId: null,
        deliveryDate: null,

        productTotalAmount: 0,
        totalAmount: 0,
        orderDeliveryFee: 0
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
    init() {}
  }
}
</script>

<style lang="scss" scoped>
</style>
