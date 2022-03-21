<template>
  <section class="pg-manualOrder-list">
    <el-card shadow="never" class="basic-summary">
      <div slot="header" class="clearfix">
        <span>{{ $t('收货任务信息') }}</span>
      </div>

      <ody-list-search-area>
        <div slot="content">
          <el-form ref="manualOrderForm" :model="formData" :rules="rules" label-width="150px">
            <BasicSummary ref="basicSummary" :form-data.sync="formData" :collect.sync="collect" @cleanProduct="cleanProduct" @changeMerchant="changeMerchant" @changeChannel="changeChannel" @initWarehouse="initWarehouse"/>
          </el-form>
        </div>
      </ody-list-search-area>
    </el-card>
    <el-form ref="manualOrderForm" :model="formData" :rules="rules" label-width="150px">
      <!-- 收货信息 -->
      <ReceiverSummary ref="receiverSummary" :form-data.sync="formData" :collect.sync="collect" :for-customer.sync="forCustomer" @cleanProduct="cleanProduct"/>
      <!-- 商品信息 -->
      <ProductSummary ref="productSummary" :form-data.sync="formData" :collect.sync="collect" :for-customer.sync="forCustomer" @updateProductNum="updateProductNum" @updateProductPrice="updateProductPrice" />
      <!-- 统计信息 -->
      <OrderSummary ref="orderSummary" :form-data.sync="formData" :collect.sync="collect" />
    </el-form>
    <el-row>&nbsp;</el-row>
    <ody-fixed>
      <ody-button :disabled="submiting" name="OmsManualOrder_Submit_confirmDialog" code="OmsManualOrder_Submit" type="primary" @click="confirmDialog('manualOrderForm')">{{ $t('common_save') }}</ody-button>
      <el-button name="returnBack" @click="returnBack">{{ $t('common_cancel') }}</el-button>
    </ody-fixed>
  </section>
</template>
<script>

import BasicSummary from '@/components/receiveTask/basicSummary.vue'
import ReceiverSummary from '@/components/receiveTask/receiverSummary.vue'
import ProductSummary from '@/components/receiveTask/productSummary.vue'
import OrderSummary from '@/components/receiveTask/orderSummary.vue'

export default {
  name: 'ReceiveTaskAdd',
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
        coinType: null,
        productList: [],
        mobile: null,
        receiver: null,
        receiverMobile: null,
        receiveType: null,
        goodReceiverProvinceCode: null,
        goodReceiverProvince: null,
        goodReceiverCityCode: null,
        goodReceiverCity: null,
        goodReceiverAreaCode: null,
        goodReceiverArea: null,
        receiveDetailAddress: null,
        goodReceiverAddress: null,
        purchaseOrderCode: null,
        receiveTaskItemList: [],
        receiveAttachmentList: [],
        expectReceiveDate: null,
        supplierId: null,
        supplierName: null,
        supplierContact: null,
        supplierMobile: null,
        remark: null,
        productTotalAmount: 0,
        totalAmount: 0
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
    async confirmDialog(formName) {
      const confirm = await this.$confirm(this.$t('确定保存收货信息？'), this.$t('prompt'))
      if (confirm) {
        this.handleSubmit(formName)
      }
    },
    preAddCheck() { // 添加商品前，校验必填项
      // check value
      if (!this.formData.merchantId) {
        return 'please_choose_merchant'
      }
      if (!this.formData.supplierId) {
        return 'please_select_the_supplier'
      }
      if (!this.formData.coinType) {
        return 'pleaseSelectTheCurrencyType'
      }
      if (!this.formData.receiveType) {
        return '请选择任务类型'
      }
      if (!this.formData.goodReceiverAreaCode) {
        return 'please_choose_receiver_address'
      }
      if (!this.formData.receiveDetailAddress) {
        return '请填写详细地址'
      }
      if (!this.formData.warehouseId) {
        return '请选择收货仓库'
      }
      if (!this.formData.expectReceiveDate) {
        return 'pleaseSelectExpectedDeliveryDate'
      }
    },
    async handleSubmit(formName) { // 确认提交
      const messageCode = this.preAddCheck()
      if (messageCode) {
        this.$message({
          type: 'warn',
          message: this.$t(messageCode)
        })
        return
      }
      if (this.formData.productList.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('goodsLineNotEmpty')
        })
        return
      }
      this.submiting = true
      this.loading = true
      const vue = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // vue.submiting = true
          var productTil = ''
          for (var i = 0; i < vue.formData.productList.length; i++) {
            // 检查商品是否有价格
            var productItem = vue.formData.productList[i]
            if (!productItem.purchasePrice && (Number(productItem.purchasePrice).toFixed(2) !== Number(0).toFixed(2))) {
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
          submitObject.expectReceiveDate = vue.$portal.parseTime(vue.formData.expectReceiveDate, '{y}-{m}-{d}')
          submitObject.receiveTaskItemList = submitObject.productList
          submitObject.receiveTaskItemList.forEach(item => {
            item.productPicPath = item.mainPictureUrl
            item.productId = item.mpId
            item.productCname = item.chineseName
            item.productCode = item.code
            item.productBarCode = item.barCode
            item.productArtNo = item.artNo
            item.productAttribute = item.saleAttribute
            item.productUnit = item.mainUnitName
            item.productPrice = item.purchasePrice
          })
          submitObject.currency = submitObject.coinType
          submitObject.currencyName = vue.collect.coinTypeMap[submitObject.coinType]
          // submitObject.currencySymbol = vue.collect.coinTypeSignMap[submitObject.coinType]
          submitObject.exchangRate = vue.collect.coinExchangeMap[submitObject.coinType]
          submitObject.receiverAddress = vue.formData.goodReceiverProvince + vue.formData.goodReceiverCity + vue.formData.goodReceiverArea + vue.formData.receiveDetailAddress
          if (vue.collect.selected) {
            submitObject.supplierName = vue.collect.selected.orgName
            submitObject.supplierId = vue.collect.selected.orgId
            submitObject.supplierCode = vue.collect.selected.orgCode
            submitObject.supplierMobile = vue.collect.selected.enterpriseTel
            submitObject.supplierAddress = ''
            if (vue.collect.selected.registeredProvinceName) {
              submitObject.supplierAddress += vue.collect.selected.registeredProvinceName
            }
            if (vue.collect.selected.registeredCityName) {
              submitObject.supplierAddress += vue.collect.selected.registeredCityName
            }
            if (vue.collect.selected.registeredRegionName) {
              submitObject.supplierAddress += vue.collect.selected.registeredRegionName
            }
            if (vue.collect.selected.registeredDetailAddress) {
              submitObject.supplierAddress += vue.collect.selected.registeredDetailAddress
            }
          }
          delete submitObject.productList
          delete submitObject.totalAmount
          console.log('提交对象:' + JSON.stringify(submitObject))
          vue.$pms.$api.receiveTask.add(submitObject).then((result) => {
            if (result.code === '0') {
              let successMessage = ''
              successMessage = result.data
              // vue.$message({
              //   type: 'success',
              //   message: successMessage
              // })
              // 关闭当前tab
              // vue.$portal.delActiveView()
              vue.$router.push({
                name: 'AddReceiveTaskSuccess',
                params: {
                  menuName: 'ReceiveTaskAdd',
                  message: successMessage
                }
              })
              // vue.$portal.delViewByName('OmsManualOrder')
            } else {
              let responeErrorMessage = ''
              if (result.data && result.data.resultMsg) {
                responeErrorMessage = result.data.resultMsg
              }
              vue.$alert(vue.$t('新增收货任务单失败') + responeErrorMessage, vue.$t('common_tip'), {
                callback: action => { }
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
        console.info(valid)
      })
    },
    async returnBack() {
      const confirm = await this.$confirm(
        this.$t('取消会导致录入的页面信息丢失，确认取消?'),
        this.$t('common_prompt')
      )
      if (confirm) {
        this.$portal.delActiveView()
      }
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
    initWarehouse() {
      this.$refs['receiverSummary'].initWarehouse()
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
