<template>
  <section class="pg-paySummary-list">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>{{ $t('manual_order_product_info') }}</span> <!-- 商品信息 -->
      </div>
      <el-row>
        <ody-list-table-area>
          <div slot="btn">
            <el-button :disabled="checked.length == 0" name="batchDelProduct" size="small" type="primary" @click="batchDelProduct">{{ $t('manual_order_batch_delete') }}</el-button>
            <el-button name="addProduct" size="small" type="primary" @click="addProduct">{{ $t('manual_order_add_product') }}</el-button>
          </div>
          <div slot="table">
            <ody-table
              :loading="loading"
              :data="formData.productList"
              :columns="columns"
              :operates="operates"
              :multiple="true"
              :can-filter="false"
              :checked.sync="checked"
              name="formData_productList912"
            />
          </div>
        </ody-list-table-area>
      </el-row>
      <!-- 选择商品模态框 -->
      <ProductModal :visible.sync="showProductModal" :form-data.sync="formData" :collect.sync="collect" @ok="saveProduct" />
      <!-- 显示阶梯价模态框 -->
      <AdvancePrice :visible.sync="showAdvancePriceDetailModal" :product.sync="selectedProduct" />
      <!-- 修改商品数量模态框 -->
      <EditNum :visible.sync="showEditNumModal" :product.sync="selectedProduct" @ok="updateProductNum" />
      <!-- 修改价格模态框 -->
      <EditPrice :visible.sync="showEditPriceModal" :product.sync="selectedProduct" @ok="updateProductPrice" />
    </el-card>
  </section>
</template>
<script>
import ProductModal from '@/components/productModal'
import AdvancePrice from './advancePrice'
import EditNum from './editNum'
import EditPrice from './editPrice'
export default {
  components: {
    ProductModal,
    AdvancePrice,
    EditNum,
    EditPrice
  },
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
      checked: [],
      showProductModal: false,
      showAdvancePriceDetailModal: false,
      showEditNumModal: false,
      showEditPriceModal: false,
      selectedProduct: { },
      columns: [
        {
          show: true,
          prop: 'mainPictureUrl',
          label: this.$t('manual_order_product_pic'),
          align: 'center',
          minWidth: 80,
          render: (h, params) => {
            return (
              <img src={ params.row.mainPictureUrl } style='width: 60px; height: 60px;'/>
            )
          }
        },
        {
          show: true,
          prop: 'chineseName',
          label: this.$t('manual_order_product_name'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'code',
          label: this.$t('manual_order_product_code'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'attributeList',
          label: this.$t('manual_order_product_attr'),
          align: 'center',
          minWidth: 100,
          formatter: (row, column) => {
            let result = ''
            if (row.attributeList) {
              for (var i = 0; i < row.attributeList.length; i++) {
                var obj = row.attributeList[i]
                result = result + obj['attName'] + ':' + obj['attValue'] + ';'
              }
            }
            return result
          }
        },
        {
          show: true,
          prop: 'artNo',
          label: this.$t('do_art_no'),
          align: 'center',
          minWidth: 100,
          formatter: (row, column) => {
            if (row.artNo) {
              return row.artNo
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'barcode',
          label: this.$t('do_bar_code'),
          align: 'center',
          minWidth: 120,
          formatter: (row, column) => {
            if (row.barcode) {
              return row.barcode
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'brandName',
          label: this.$t('manual_order_product_category'),
          align: 'center',
          minWidth: 180,
          formatter: (row, column) => {
            let result = ''
            if (row.brandName) {
              result += row.brandName
            }
            if (row.fullNamePath) {
              result += row.fullNamePath
            }
            return result
          }
        },
        {
          show: true,
          prop: 'mainUnitName',
          label: this.$t('manual_order_bar_code_unit'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column) => {
            if (row.mainUnitName) {
              return row.mainUnitName
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'virtualAvailableStockNum',
          label: this.$t('manual_order_salable_stock'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'orderStartNum',
          label: this.$t('order_start_num'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'orderMultipleNum',
          label: this.$t('order_multiple_num'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'productItemNum',
          label: this.$t('manual_order_quantity'),
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return (
              <div>
                <span >{ params.row.productItemNum }
                  <i class='el-icon-edit' on-click={() => {
                    this.showEditNum(params.row)
                  }} />
                </span>
              </div>
            )
          }
        },
        {
          show: true,
          prop: 'pricingMode',
          label: this.$t('pricing_mode'),
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return (
              <div>
                <span >{ this.collect.ADVANCE_PRICE_TYPE[params.row.pricingMode] }</span>
                <el-button icon='el-icon-info' v-show={params.row.pricingMode === 2} type='text' on-click={() => {
                  this.showAdvancePriceDetail(params.row)
                }} />
              </div>
            )
          }
        },
        {
          show: true,
          prop: 'marketPrice',
          label: this.$t('manual_order_sales_unit_price'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column) => {
            if (row.marketPrice) {
              return this.$portal.toThousandFilter(row.marketPrice)
            } else {
              return 0
            }
          }
        },
        {
          show: true,
          prop: 'salePriceWithTax',
          label: this.$t('manual_order_purchase_price'),
          align: 'center',
          minWidth: 80,
          render: (h, params) => {
            return (
              <div>
                <span>{ params.row.salePriceWithTax ? this.$portal.toThousandFilter(params.row.salePriceWithTax) : 0 }
                  <i class='el-icon-edit' v-show={params.row.salePriceWithTax != null} on-click={() => {
                    this.showEditPrice(params.row)
                  }}/>
                </span>
              </div>
            )
          }
        },
        {
          show: true,
          label: this.$t('manual_order_purchase_amount'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column) => {
            if (row.salePriceWithTax) {
              return this.$portal.toThousandFilter(Number(row.salePriceWithTax * row.productItemNum).toFixed(2))
            } else {
              return 0
            }
          }
        },
        {
          show: true,
          prop: 'productItemCurrency',
          label: this.$t('currencyType'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'contractCode',
          label: this.$t('contractNo'),
          align: 'center',
          minWidth: 160
        },
        {
          show: true,
          label: this.$t('order_ports_operation'),
          align: 'center',
          minWidth: 80,
          render: (h, params) => {
            return (
              <el-button on-click={() => {
                this.delProduct(params.row)
              }}> {this.$t('order_delete')} </el-button>
            )
          }
        }
      ]
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
    eventUpdateProductNum() {
      this.$emit('updateProductNum')
    },
    eventUpdateProductPrice() {
      this.$emit('updateProductPrice')
    },
    cleanProduct() {
      console.info('子组件-清空商品')
      this.formData.productList = []
      this.eventUpdateProductNum()
    },
    addProduct() { // 显示商品模态框
      const messageCode = this.preAddProduct()
      if (messageCode) {
        this.$message({
          type: 'warn',
          message: this.$t(messageCode)
        })
        return
      }
      this.showProductModal = true
    },
    preAddProduct() { // 添加商品前，校验必填项
      // check value
      if (!this.formData.merchantId) {
        return 'please_choose_merchant'
      }
      if (!this.forDistributor) {
        if (!this.formData.orderSysSource) {
          return 'oms.customer_manage_detail_please_choose_saleChannelName'
        }
        if (!this.formData.userId && !this.formData.customerId) {
          return 'oms.pleaseSelectTheCustomerInformation'
        }
      } else {
        if (!this.formData.customerId) {
          return 'oms.please_choose_distributor'
        }
      }
      if (!this.formData.storeId) {
        return 'oms.please_choose_store'
      }

      if (!this.formData.goodReceiverAreaCode) {
        return 'oms.please_choose_receiver_address'
      }
      if (!this.formData.coinType) {
        return 'oms.pleaseSelectTheCurrencyType'
      }
    },
    batchDelProduct() { // 批量删除商品行
      this.checked.forEach(item => {
        this.formData.productList.splice(this.formData.productList.indexOf(item), 1)
      })
      this.checked = []
      this.eventUpdateProductNum()
    },
    delProduct(item) { // 删除商品行
      this.formData.productList.splice(this.formData.productList.indexOf(item), 1)
      this.eventUpdateProductNum()
    },
    async saveProduct(itemList) { // 添加商品行
      const addedList = []
      itemList.forEach(item => {
        item.productItemNum = item.validOrderStartNum
        if (!getProductById(item, this.formData.productList)) {
          const extInfoArr = []
          if (item.attributeList && item.attributeList.length > 0) { // 保存规格属性信息到扩展字段
            for (let index = 0; index < item.attributeList.length; index++) {
              const attr = item.attributeList[index]
              if (attr.attName && attr.attValue) {
                extInfoArr.push({
                  name: attr.attName,
                  value: attr.attValue
                })
              }
            }
          }
          if (extInfoArr.length > 0) {
            item.extInfo = JSON.stringify(extInfoArr)
          }
          addedList.push(item)
        }
      })

      if (addedList.length > 0) {
        await this.getMerchantProductPrice(addedList)
        addedList.forEach(element => {
          this.formData.productList.push(element)
        })
        this.eventUpdateProductNum()
      }
    },
    async getMerchantProductPrice(itemList) { // 获取商品的价格
      // 客户下单，同时保存 customerCode
      var merchantProductList = []
      for (var i = 0; i < itemList.length; i++) {
        if (this.formData.customerId) {
          merchantProductList.push({ customerCode: this.formData.customerCode, merchantProductId: itemList[i]['id'], dataType: 3, currencyCode: this.formData.coinType, contractCode: itemList[i]['contractCode'] })
        } else {
          merchantProductList.push({ merchantProductId: itemList[i]['id'], dataType: 3, currencyCode: '', customerCode: '', contractCode: '' })
        }
      }
      const params = {
        channelCode: this.formData.orderSysSource,
        isOnLine: 1,
        dataType: 3,
        merchantProductList: merchantProductList
      }
      const result = await this.$oms.$api.common.merchantProductPriceList(params)
      if (result.code === '0') {
        for (var index = 0; index < itemList.length; index++) {
          var obj = itemList[index]
          // 基准价格  取商品售价含税价格   销售价格 ：售价含税价格-减去促销本次无
          for (var j = 0; j < result.data.length; j++) {
            var productPrice = result.data[j]
            // 商品主键Id一致  获取价格信息
            if (obj['id'] === productPrice['id']) {
              // 市场价
              obj['marketPrice'] = productPrice['marketPrice']
              // 售价含税
              obj['salePriceWithTax'] = productPrice['salePriceWithTax']

              await this.getPricingMode(obj)
            }
          }
        }
      }
    },
    async getPricingMode(product) { // 查询定价方式和定价信息
      var params = {
        conditionMap: {
          channelCode: this.formData.orderSysSource
        },
        mpId: product.mpId,
        merchantId: product.merchantId,
        count: product.validOrderStartNum
      }
      const result = await this.$oms.$api.common.getAdvancePriceByParam(params)
      if (result.code === '0') {
        product.pricingMode = result.data.type === 0 ? 1 : result.data.type
        product.priceSheetId = result.data.priceSheetId

        if (result.data.type === 2) { // 阶梯价
          const priceDetailParams = {
            priceSheetId: product.priceSheetId
          }
          const res = await this.$oms.$api.common.getPriceSheetDetailByParam(priceDetailParams) // 查询阶梯价格
          if (res.code === '0' && res.data.priceSheetStrategyList) {
            var advancePriceStepList = []
            res.data.priceSheetStrategyList.forEach((priceSheet) => {
              if (priceSheet.calcType === 2 && priceSheet.merchantProductCode === product.code) { // 阶梯价
                priceSheet.priceSheetStrategyStepList.forEach(priceSheetStep => {
                  if (product.validOrderStartNum >= priceSheetStep.numberStartRange && product.validOrderStartNum <= priceSheetStep.numberEndRange) {
                    product.marketPrice = priceSheetStep.price
                    product.salePriceWithTax = priceSheetStep.price
                  }
                  advancePriceStepList.push({
                    numberStartRange: priceSheetStep.numberStartRange,
                    numberEndRange: priceSheetStep.numberEndRange,
                    price: priceSheetStep.price
                  })
                })
              }
            })
            product.advancePriceSteps = advancePriceStepList
          }
        } else if (result.data.type === 1) { // 固定价
          product.marketPrice = result.data.price
          product.salePriceWithTax = result.data.price
        }
      }
    },
    showEditNum(item) {
      console.info('显示修改数量模态框')
      this.selectedProduct = item
      this.showEditNumModal = true
    },
    showAdvancePriceDetail(item) {
      console.info('显示阶梯价格')
      this.selectedProduct = item
      this.showAdvancePriceDetailModal = true
    },
    showEditPrice(item) {
      console.info('显示修改价格输入框')
      this.selectedProduct = item
      this.showEditPriceModal = true
    },
    calculateAmount() { // 更新价格或者数量，重新计算商品行总价，同时需要强制刷新当前行视图
      this.selectedProduct.productItemAmount = this.selectedProduct.productItemNum * this.selectedProduct.salePriceWithTax
      const index = this.formData.productList.indexOf(this.selectedProduct)
      // 刷新视图
      this.$set(this.formData.productList, index, this.selectedProduct)
    },
    updateProductNum() { // 更新商品行数量回调
      this.calculateAmount()
      this.eventUpdateProductNum()
    },
    updateProductPrice() { // 更新商品价格回调
      this.calculateAmount()
      this.eventUpdateProductPrice()
    },
    async _initCode() {
      const queryParam = {
        categorys: [
          'ADVANCE_PRICE_TYPE'
        ]
      }
      const result = await this.$oms.$api.common.listByCategorysForOrder(queryParam)
      if (result.code === '0' && result.data.ADVANCE_PRICE_TYPE) {
        this.collect.ADVANCE_PRICE_TYPE = result.data.ADVANCE_PRICE_TYPE.reduce((m, i) => { m[i['code']] = i['name']; return m }, {})
      }
    },
    init() {
      this._initCode()
    }
  }
}

function getProductById(item, productList) {
  for (let i = 0; i < productList.length; i++) {
    if (productList[i].id === item.id) {
      return productList[i]
    }
  }
  return null
}

</script>

<style lang="scss" scoped>

</style>
