<template>
  <section>
    <el-card shadow="never" class="basic-summary">
      <div slot="header" class="clearfix">
        <span>{{ $t('manual_order_base_info') }}</span> <!-- 基本信息 -->
      </div>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="manualOrderForm" :model="formData" :rules="{}" label-width="150px">
            <!-- 下单信息 -->
            <BasicSummary
              ref="basicSummary"
              :form-data.sync="formData"
              :collect.sync="collect"
              @cleanProduct="cleanProduct"
              @changeChannel="changeChannel"
              @changeUser="changeUser"/>
          </el-form>
        </div>
      </ody-list-search-area>
    </el-card>
    <el-form ref="copyOrderForm" :model="formData" :rules="{}" label-width="150px">
      <!-- 收货信息 -->
      <ReceiverSummary
        ref="receiverSummary"
        :form-data.sync="formData"
        :collect.sync="collect"
        :for-customer.sync="forCustomer"
        @cleanProduct="cleanProduct"/>
      <!-- 商品信息 -->
      <ProductSummary
        ref="productSummary"
        :form-data.sync="formData"
        :collect.sync="collect"
        :for-customer.sync="forCustomer"
        @updateProductNum="updateProductNum"
        @updateProductPrice="updateProductPrice"/>
      <!-- 订单合计 -->
      <OrderSummary ref="orderSummary" :form-data.sync="formData" :collect.sync="collect"/>
    </el-form>
    <el-row>&nbsp;</el-row>
    <ody-fixed>
      <el-button name="returnBack" @click="returnBack">{{ $t('common_cancel') }}</el-button>
      <el-button :disabled="submiting" name="confirmDialog" type="primary" @click="confirmDialog('copyOrderForm')">
        {{ $t('manual_order_submit') }}
      </el-button>
    </ody-fixed>
  </section>
</template>

<script>
import BasicSummary from '@/components/manualOrder/basicSummary.vue'
import ReceiverSummary from '@/components/manualOrder/receiverSummary.vue'
import ProductSummary from '@/components/manualOrder/productSummary.vue'
import OrderSummary from '@/components/manualOrder/orderSummary.vue'

export default {
  name: 'OmsOrderCopy',
  components: {
    BasicSummary,
    ReceiverSummary,
    ProductSummary,
    OrderSummary
  },
  data() {
    return {
      formData: {
        merchantId: null,
        orderSysSource: null, //
        storeId: null,
        coinType: null, // 默认第一个
        productList: [], //
        userId: null,
        userName: null,
        mobile: null, // X goodReceiverMobile
        email: null, // X
        customerId: null,
        customerName: null,
        consigneeName: null, // 收货人姓名
        consigneePhone: null, // 收货人姓名
        goodReceiverProvinceCode: null,
        goodReceiverProvince: null,
        goodReceiverCityCode: null,
        goodReceiverCity: null,
        goodReceiverAreaCode: null,
        goodReceiverArea: null,
        receiveDetailAddress: null, //
        goodReceiverAddress: null,
        manualOrderAttachmentVOList: [], //
        orderPaymentType: null,
        orderDeliveryId: null, //
        deliveryDate: null, // 预计发货时间，默认当前
        productTotalAmount: 0, //
        totalAmount: 0, // orderTotalAmount
        orderDeliveryFee: 0
      },
      forCustomer: false,
      collect: {},
      submiting: false,
      loading: false,
      prevUserId: null, // 会显示收货人信息被清空的问题
      gifts: [], // 赠品标记
      soItems: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    returnBack() {
      this.$portal.delActiveView()
    },
    changeChannel() {
      this.$refs['receiverSummary'].changeChannel()
    },
    changeUser() {
      if (this.prevUserId !== this.formData.userId) {
        this.$refs['receiverSummary'].changeUser()
      }
    },
    cleanProduct() {
      this.$refs['productSummary'].cleanProduct()
    },
    updateProductNum() {
      this.$refs['orderSummary'].updateProductNum()
    },
    updateProductPrice() {
      this.$refs['orderSummary'].updateProductPrice()
    },
    async init() {
      const [soDetail, soItems] = await Promise.all([
        this.$oms.$api.so.soDetailGet({ orderCode: this.$route.params.fromOrderCode }),
        this.$oms.$api.soItem.orderSoItemListPage({ joinFields: ['productItemOutNum'], filters: { orderCode: this.$route.params.fromOrderCode }})
      ])
      this.prevUserId = soDetail.data.so.userId
      soDetail.data.so.orderPaymentType += ''
      soDetail.data.so.coinType = soDetail.data.so.currency || 'CNY'
      soDetail.data.so.orderDeliveryId = soDetail.data.so.orderDeliveryMethodId
      soDetail.data.so.consigneeName = soDetail.data.so.goodReceiverName
      soDetail.data.so.consigneePhone = soDetail.data.so.goodReceiverMobile
      soDetail.data.so.orderSysSource = soDetail.data.so.sysSource
      soDetail.data.so.deliveryDate = soDetail.data.so.expectDeliverDate // 重置为今天
      soDetail.data.so.receiveDetailAddress = soDetail.data.so.goodReceiverAddress
      Object.assign(this.formData, soDetail.data.so)
      this.$refs.basicSummary.initSelected({
        merchantId: soDetail.data.so.merchantId,
        storeId: soDetail.data.so.storeId
      })
      const selectedCodes = soItems.data.map(it => it.code)
      const itemNum = []
      soItems.data.forEach(it => {
        this.gifts[this.gifts.length] = it.productSaleType
        this.soItems.push(it)
        itemNum[itemNum.length] = it.productItemNum
      })
      this.$refs.productSummary.initSelected(selectedCodes, this.gifts, this.soItems, itemNum)
    },

    async confirmDialog(formName) {
      const confirm = await this.$confirm(this.$t('manual_submit_order_confirm'), this.$t('prompt'))
      if (confirm) {
        this.formData.copyOrderCode = this.formData.orderCode
        delete this.formData.id
        delete this.formData.orderCode
        delete this.formData.parentOrderCode
        this.handleSubmit(formName)
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

      for (let ii = 0; ii < this.formData.productList.length; ii++) {
        var productItem = this.formData.productList[ii]
        if (productItem.virtualAvailableStockNum <= 0) {
          this.$message({
            type: 'error',
            message: productItem.chineseName + this.$t('无可售库存')
          })
          return
        }
      }

      this.submiting = true
      this.loading = true
      const vue = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // vue.submiting = true
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

          vue.$oms.$api.manualOrder.manualOrderCreateOrder(submitObject).then((result) => {
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
              vue.$portal.delActiveView()
              // vue.$portal.delViewByName(vue.$route.name)
            } else {
              let responeErrorMessage = ''
              if (result.data && result.data.resultMsg) {
                responeErrorMessage = result.data.resultMsg
              }
              vue.$alert(vue.$t('failureCreateOrder') + responeErrorMessage, vue.$t('common_tip'), {
                callback: action => {
                }
              })
            }
          }).finally(() => {
            vue.submiting = false
            vue.loading = false
          })
        } else {
          vue.submiting = false
          vue.loading = false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
