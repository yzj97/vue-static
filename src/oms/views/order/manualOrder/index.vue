<template>
  <section class="pg-manualOrder-list">
    <el-row class="order-batch-create">
      <ody-button name="OmsManualOrder_Batch_forwardToBatch" code="OmsManualOrder_Batch" @click="forwardToBatch">{{ $t('manual_order_batch_create') }}</ody-button>
    </el-row>
    <el-card shadow="never" class="basic-summary">
      <div slot="header" class="clearfix">
        <span>{{ $t('manual_order_base_info') }}</span> <!-- 基本信息 -->
      </div>

      <ody-list-search-area>
        <div slot="content">
          <el-form ref="manualOrderForm" :model="formData" :rules="rules" label-width="120px">
            <!-- 下单信息 -->
            <BasicSummary ref="basicSummary" :form-data.sync="formData" :collect.sync="collect" @cleanProduct="cleanProduct" @changeMerchant="changeMerchant" @changeChannel="changeChannel" @changeUser="changeUser"/>
          </el-form>
        </div>
      </ody-list-search-area>
    </el-card>
    <el-form ref="manualOrderForm" :model="formData" :rules="rules" label-width="150px">
      <!-- 收货信息 -->
      <ReceiverSummary ref="receiverSummary" :form-data.sync="formData" :collect.sync="collect" :for-customer.sync="forCustomer" @cleanProduct="cleanProduct"/>
      <!-- 商品信息 -->
      <ProductSummary ref="productSummary" :form-data.sync="formData" :collect.sync="collect" :for-customer.sync="forCustomer" @updateProductNum="updateProductNum" @updateProductPrice="updateProductPrice" />
      <!-- 订单合计 -->
      <OrderSummary ref="orderSummary" :form-data.sync="formData" :collect.sync="collect" />
    </el-form>
    <el-row>&nbsp;</el-row>
    <ody-fixed>
      <el-button name="returnBack" @click="returnBack">{{ $t('common_cancel') }}</el-button>
      <ody-button :disabled="submiting" name="OmsManualOrder_Submit_confirmDialog" code="OmsManualOrder_Submit" type="primary" @click="confirmDialog('manualOrderForm')">{{ $t('manual_order_submit') }}</ody-button>
    </ody-fixed>
  </section>
</template>
<script>

import BasicSummary from '@/components/manualOrder/basicSummary.vue'
import ReceiverSummary from '@/components/manualOrder/receiverSummary.vue'
import ProductSummary from '@/components/manualOrder/productSummary.vue'
import OrderSummary from '@/components/manualOrder/orderSummary.vue'

export default {
  name: 'OmsManualOrder',
  components: {
    BasicSummary,
    ReceiverSummary,
    ProductSummary,
    OrderSummary
  },
  data() {
    return {
      collect: { }, // 所有子组件的对象
      loading: false,
      submiting: false,
      forCustomer: false,
      formData: {
        merchantId: null,
        orderSysSource: null,
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
        salesmanId: null,
        salesmanName: null,

        productTotalAmount: 0,
        totalAmount: 0,
        orderDeliveryFee: 0
      },
      rules: {}
    }
  },
  computed: {
  },
  watch: {
    formData: {
      handler: (value, oldValue, e) => {
      },
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
    forwardToBatch() {
      let message
      if (!this.formData.merchantId) {
        message = 'please_choose_merchant'
      }
      if (message) {
        this.$message({
          type: 'warn',
          message: this.$t(message)
        })
        return
      }
      this.$router.push({
        name: 'OmsManualOrderBatch',
        params: {
          menuName: this.$route.name,
          merchantId: this.formData.merchantId,
          merchantName: this.formData.merchantName
        }
      })
    },
    async confirmDialog(formName) {
      const confirm = await this.$confirm(this.$t('manual_submit_order_confirm'), this.$t('prompt'))
      if (confirm) {
        return this.handleSubmit(formName)
      }
    },
    async handleSubmit(formName) { // 确认下单
      if (this.formData.productList.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('goodsLineNotEmpty')
        })
        return
      }
      const vue = this
      const valid = await this.$refs[formName].validate()
      if (valid) {
        vue.submiting = true
        var productTil = ''
        var warehouseTypeSameFlag = true
        var warehouseType = null
        for (var i = 0; i < vue.formData.productList.length; i++) {
          // 检查商品是否有价格
          var productItem = vue.formData.productList[i]
          if (!productItem.salePriceWithTax && (Number(productItem.salePriceWithTax).toFixed(2) !== Number(0).toFixed(2))) {
            productTil += productItem.chineseName + ','
          }
          if (warehouseType === null) {
            warehouseType = productItem.warehouseType
          } else {
            if (warehouseType !== productItem.warehouseType) {
              warehouseTypeSameFlag = false
            }
          }
        }
        if (!warehouseTypeSameFlag) {
          // 不能同时添加无仓和有仓商品！
          vue.$message({
            type: 'error',
            message: vue.$t('不能同时添加无仓和有仓商品！')
          })
          vue.submiting = false
          return
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
        submitObject.deliveryDate = vue.$portal.parseTime(vue.formData.deliveryDate, '{y}-{m}-{d}')
        submitObject.manualOrderItemVOList = submitObject.productList
        submitObject.manualOrderItemVOList.forEach(item => {
          if (typeof item.extInfo !== 'undefined' && Object.keys(item.extInfo).length !== 0) {
            const info = JSON.parse(item.extInfo)
            if (info instanceof Array) {
              item.extInfo = JSON.stringify({ attributeList: info })
            }
          }
        })
        submitObject.currency = submitObject.coinType

        submitObject.currencyName = vue.collect.coinTypeMap[submitObject.coinType]
        submitObject.currencySymbol = vue.collect.coinTypeSignMap[submitObject.coinType]
        submitObject.exchangRate = vue.collect.coinExchangeMap[submitObject.coinType]
        if (!submitObject.orderDeliveryFee) {
          submitObject.orderDeliveryFee = 0
        }
        delete submitObject.productList
        delete submitObject.totalAmount
        console.log('提交对象:' + JSON.stringify(submitObject))
        return vue.$oms.$api.manualOrder.manualOrderCreateOrder(submitObject).then((result) => {
          if (result.code === '0') {
            let successMessage = ''
            if (result.data.childOrderCodeList && result.data.childOrderCodeList.length > 0) {
              var orderCodes = result.data.childOrderCodeList.join(';')
              successMessage = vue.$t('successfulOrderCreationGeneration') + result.data.childOrderCodeList.length + vue.$t('ordersChildMore') + orderCodes
            } else {
              successMessage = vue.$t('successfulOrderCreationGeneration') + 1 + vue.$t('ordersChildMore') + result.data.orderCode
            }
            // vue.$message({
            //   type: 'success',
            //   message: successMessage
            // })
            // 关闭当前tab
            // vue.$portal.delActiveView()
            vue.$router.push({
              name: 'OmsManualOrderSuccess',
              params: {
                menuName: 'OmsManualOrder',
                message: successMessage
              }
            })
            // vue.$portal.delViewByName('OmsManualOrder')
          } else {
            let responeErrorMessage = ''
            if (result.data && result.data.resultMsg) {
              responeErrorMessage = result.data.resultMsg
            }
            vue.$alert(vue.$t('failureCreateOrder') + responeErrorMessage, vue.$t('common_tip'), {
              callback: action => { }
            })
          }
        }).finally(() => {
          vue.submiting = false
        })
      }
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
      this.$refs['receiverSummary'].changeUser()
    },
    changeChannel() {
      this.$refs['receiverSummary'].changeChannel()
    },
    changeMerchant() {
    },
    init() {
    }
  }
}
</script>

<style lang="less" scoped>
  .pg-manualOrder-list{
    .order-batch-create{
      text-align:right;
      margin-bottom: 10px;
    }
    .cp-box{
      box-shadow: none;
    }

    /deep/ .basic-summary{
      margin-bottom: 15px;
      overflow: unset !important;

      .el-card__body{
        padding: 0 20px;
      }

      .cp-list-search-area{
        margin-bottom: 0;
        padding-bottom: 0;
      }
    }
  }
</style>
