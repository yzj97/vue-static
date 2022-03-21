<template>
  <section class="pg-paySummary-list">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>{{ $t('manual_order_product_info') }}</span> <!-- 商品信息 -->
      </div>
      <el-row>
        <ody-list-table-area class="remove-shadows">
          <div slot="btn">
            <el-button name="addProduct" size="small" type="primary" @click="addProduct">{{ $t('manual_order_add_product') }}</el-button>
            <el-button :disabled="checked.length == 0" name="batchDelProduct" size="small" @click="batchDelProduct">{{ $t('manual_order_batch_delete') }}</el-button>
          </div>
          <div slot="table">
            <el-table
              v-loading="loading"
              :data="formData.productList"
              :multiple="true"
              name="formData_productList190"
              style="width: 100%"
              @selection-change="selectionChange">
              <el-table-column
                type="selection"
                width="55" />
              <el-table-column
                :label="this.$t('manual_order_product_pic')"
                align="center"
                min-width="80">
                <template slot-scope="scope">
                  <el-image v-if="scope.row.mainPictureUrl" :src="scope.row.mainPictureUrl" style="width: 60px; height: 60px;" />
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('order_ports_product_name')"
                prop="chineseName"
                align="center"
                min-width="150">
                <template slot-scope="scope">
                  <span><el-tag v-if="scope.row.productSaleType === 4" type="warning">{{ $t('赠') }}</el-tag>&nbsp;&nbsp;{{ scope.row.chineseName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('order_ports_product_code')"
                prop="code"
                align="center"
                min-width="150"/>
              <el-table-column
                :label="this.$t('manual_order_product_attr')"
                prop="saleAttribute"
                align="center"
                min-width="120">
                <!--<template slot-scope="scope">
                  <span>
                    {{ !scope.row.attributeList ? '' : scope.row.attributeList.map((item, index) => {
                      return item['attValue']
                    }).join(",") }}
                  </span>
                </template>-->
              </el-table-column>
              <el-table-column
                :label="$t('manual_order_bar_code_unit')"
                prop="mainUnitName"
                align="center"
                min-width="100"/>
              <el-table-column
                :label="this.$t('manual_order_salable_stock')"
                align="center"
                min-width="120">
                <template slot-scope="scope">
                  <div>
                    <span>
                      {{ scope.row.virtualAvailableStockNum }}
                      <el-tooltip v-if="scope.row.orderStartNum !== null && scope.row.orderStartNum !== undefined && scope.row.orderMultipleNum !== null && scope.row.orderMultipleNum !== undefined" placement="top">
                        <div slot="content">
                          <div v-if="scope.row.orderStartNum !== null && scope.row.orderStartNum !== undefined" >{{ $t('order_start_num') }} {{ scope.row.orderStartNum }}</div>
                          <div v-if="scope.row.orderMultipleNum !== null && scope.row.orderMultipleNum !== undefined">{{ $t('order_multiple_num') }} {{ scope.row.orderMultipleNum }}</div>
                        </div>
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('manual_order_quantity')"
                align="center"
                min-width="140">
                <template slot-scope="scope">
                  <el-input-number
                    v-if="forceUpdate"
                    v-model="scope.row.productItemNum"
                    :step="isNaN(Number(scope.row.orderMultipleNum)) || !Number(scope.row.orderMultipleNum) ? 1 : Number(scope.row.orderMultipleNum)"
                    :step-strictly="true"
                    :min="isNaN(Number(scope.row.orderStartNum)) ? 1 : (Number(scope.row.orderStartNum) > 0 ?Number(scope.row.orderStartNum):1 )"
                    name="scope_row_productItemNum"
                    size="small"
                    controls-position="right"
                    style="width: 120px;"
                    @change="changeItemNum(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                :label="this.$t('manual_order_sales_unit_price')"
                align="center"
                min-width="80">
                <template slot-scope="scope">
                  <div>
                    <span>
                      <span v-if="scope.row.salePriceWithTax !== null && scope.row.salePriceWithTax !== undefined" class="error">{{ scope.row.coinTypeSign }}</span>
                      {{ scope.row.salePriceWithTax }}
                      <el-tooltip v-if="scope.row.advancePriceSteps" v-show="scope.row.pricingMode === 2" placement="top">
                        <div slot="content">
                          <div>
                            <el-row v-for="item in scope.row.advancePriceSteps" :key="item">
                              {{ item.numberStartRange + $t('order_to') + item.numberEndRange }} &nbsp; {{ scope.row.coinTypeSign }} {{ Number(item.price).toFixed(2) }}
                            </el-row>
                          </div>
                        </div>
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('manual_order_purchase_price')"
                align="center"
                min-width="140">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.salePriceWithTax"
                    :disabled="scope.row.productSaleType === 4"
                    name="scope_row_salePriceWithTax"
                    @change="changePrice(scope.row)"
                  >
                    <div slot="prefix"><span class="error" style="line-height:32px !important;">{{ scope.row.coinTypeSign }}</span></div>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                :label="this.$t('manual_order_purchase_amount')"
                align="center"
                min-width="120">
                <template slot-scope="scope">
                  <div>
                    <span>
                      <span class="error">{{ scope.row.coinTypeSign }}</span>
                      {{ Number(scope.row.productItemAmount).toFixed(2) }}
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                :label="this.$t('supplier_purchase_price')"
                align="center"
                min-width="120">
                <template slot-scope="scope">
                  <div>
                    <span>
                      <span class="error">{{ scope.row.coinTypeSign }}</span>
                      {{ Number(scope.row.purchasePrice).toFixed(2) }}
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('supplier_name')"
                prop="supplierName"
                align="center"
                min-width="120"/>
              <el-table-column
                :label="this.$t('common_remark')"
                align="center"
                min-width="120"
                max-width="120">
                <template slot-scope="scope">
                  <div>
                    <el-link name="showEditRemark" @click="showEditRemark(scope.row)">
                      {{ scope.row.remark }}
                      <i class="el-icon-edit-outline" />
                    </el-link>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('common_operations')"
                align="center"
                fixed="right"
                min-width="80">
                <template slot-scope="scope">
                  <div>
                    <el-link name="delProduct" type="primary" @click="delProduct(scope.row)">{{ $t('order_delete') }}</el-link>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </ody-list-table-area>
      </el-row>
      <!-- 选择商品模态框 -->
      <div v-show="showProductModal">
        <ProductModal
          ref="productModal"
          :visible.sync="showProductModal"
          :form-data.sync="formData"
          :collect.sync="collect"
          @ok="saveProduct" />
      </div>
      <!-- 修改备注模态框 -->
      <EditRemark :visible.sync="showEditRemarkModal" :product.sync="selectedProduct" @ok="refreshTable" />
    </el-card>
  </section>
</template>
<script>
import ProductModal from '@/components/productModal'
import EditRemark from './editRemark'
export default {
  components: {
    ProductModal,
    EditRemark
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
    forCustomer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      forceUpdate: true,
      checked: [],
      showProductModal: false,
      showEditRemarkModal: false,
      selectedProduct: { },
      gifts: [],
      soItems: [],
      initCodes: [],
      initItemNums: null // {code:num}
    }
  },
  computed: {
    isDistribution: function() {
      return this.formData.orderSysSource + '' === '110004'
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
    async initSelected(codes, gifts, soItems, initItemNums) {
      Object.assign(this.gifts, gifts)
      Object.assign(this.soItems, soItems)
      if (codes && codes.length > 0) {
        this.initItemNums = initItemNums
        this.initCodes = codes
        await this.$refs.productModal.initSelected(codes)
      }
    },
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
      if (this.forCustomer) {
        if (!this.formData.customerId) {
          return 'pleaseSelectTheCustomerInformation'
        }
      } else {
        if (!this.formData.merchantId) {
          return 'please_choose_merchant'
        }
      }
      if (!this.formData.storeId) {
        return 'please_choose_store'
      }
      if (!this.formData.coinType) {
        return 'pleaseSelectTheCurrencyType'
      }
      if (!this.formData.goodReceiverAreaCode) {
        return 'please_choose_receiver_address'
      }
      if (!this.formData.orderPaymentType) {
        return 'please_choose_payment_type'
      }
      if (!this.formData.orderDeliveryId) {
        return 'please_choose_the_way_of_distribution'
      }
      if (!this.formData.deliveryDate) {
        return 'pleaseSelectExpectedDeliveryDate'
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
    async saveProduct(products, operationType, isInit = false) { // 添加商品行
      const addedList = []
      if (!Array.isArray(products)) {
        products = [products]
      }
      const existCodes = []
      if (isInit) {
        const temp = []
        for (let productIndex = 0; productIndex < products.length; productIndex++) {
          const item = products[productIndex]
          let index = -1
          do {
            // 赠品A和普通品B为同一个商品时，不能合并成一条
            index = this.initCodes.findIndex(it => it === item.code)
            if (index >= 0 && operationType === 2) {
              const tempItem = Object.assign({}, item)
              tempItem.productSaleType = this.gifts[index]
              tempItem.productItemNum = this.initItemNums[index]
              temp.push(tempItem)
              delete this.initCodes[index]
              delete this.gifts[index]
              delete this.initItemNums[index]
            }
          } while (index >= 0)
        }
        products = temp
      }

      for (let productIndex = 0; productIndex < products.length; productIndex++) {
        const item = products[productIndex]
        if (!getProductById(item, this.formData.productList, isInit)) {
          const extInfoArr = []
          if (item.saleAttribute) {
            var indexArr = item.saleAttribute.split(';')
            for (let index = 0; index < indexArr.length; index++) {
              var indexChildArr = indexArr[index].split(':')
              extInfoArr.push({
                name: indexChildArr[0],
                value: indexChildArr[1]
              })
            }
          }
          if (extInfoArr.length > 0) {
            item.extInfo = JSON.stringify(extInfoArr)
          }
          item.remark = ''
          addedList.push(Object.assign({}, item))
        } else {
          existCodes.push(item.code)
        }
      }

      if (existCodes.length !== 0) {
        this.$message({
          type: 'warn',
          message: this.$t('manual_order_same_product') + existCodes.join(',')
        })
      }
      if (addedList.length > 0) {
        await this.getMerchantProductPrice(addedList)
        addedList.forEach(element => {
          if (element.productSaleType === 4) {
            element.salePriceWithTax = 0
            element.productItemAmount = 0
          }
          this.formData.productList.push(element)
          this.selectedProduct = element
          this.updateProductNum()
        })
      }
    },
    async getMerchantProductPrice(itemList) { // 获取商品的价格
      // 客户下单，同时保存 customerCode
      var merchantProductList = []
      for (var i = 0; i < itemList.length; i++) {
        if (this.formData.customerId && this.isDistribution) {
          merchantProductList.push({ customerId: this.formData.customerId, merchantProductId: itemList[i]['id'], dataType: 3, currencyCode: this.formData.coinType, contractCode: itemList[i]['contractCode'] })
        } else {
          merchantProductList.push({ merchantProductId: itemList[i]['id'], dataType: 3, currencyCode: '', customerId: '', contractCode: '' })
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
              // 采购价
              obj['purchasePrice'] = productPrice['purchasePriceWithTax']
              await this.getPricingMode(obj)
            }
          }
        }
      }
    },
    async getPricingMode(product) { // 查询定价方式和定价信息
      var params = {
        conditionMap: {
          channelCode: this.formData.orderSysSource,
          storeCode: this.formData.storeId, // 匹配商品线接口，storeCode实际应该穿storeId
          customerCode: this.formData.customerCode
        },
        mpId: product.id,
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
    selectionChange(selection) {
      if (selection) {
        if (Array.isArray(selection)) {
          this.checked = selection
        } else {
          this.checked = [selection]
        }
      } else {
        this.checked = []
      }
    },
    changeItemNum(row) {
      if (row.productItemNum === undefined) {
        row.productItemNum = isNaN(Number(row.orderStartNum)) ? 1 : (Number(row.orderStartNum) > 0 ? Number(row.orderStartNum) : 1)
        this.forceUpdate = false
        // 此处赋值的数据不能自动回显到页面上，使用v-if重新渲染
        setTimeout(() => {
          this.forceUpdate = true
        }, 5)
      }
      this.selectedProduct = row
      if (row.pricingMode === 2) {
        for (var i = 0; i < row.advancePriceSteps.length; i++) {
          var item = row.advancePriceSteps[i]
          if (row.productItemNum >= item.numberStartRange && row.productItemNum <= item.numberEndRange) {
            row.marketPrice = item.price
            row.salePriceWithTax = item.price
            break
          }
        }
      }
      this.updateProductNum()
    },
    changePrice(row) {
      this.selectedProduct = row
      row.salePriceWithTax = Number(row.salePriceWithTax).toFixed(2)
      if (isNaN(row.salePriceWithTax) || row.salePriceWithTax < 0) {
        row.salePriceWithTax = 0
      }
      this.updateProductPrice()
    },
    showEditRemark(item) {
      console.info('显示修改备注输入框')
      this.selectedProduct = item
      this.showEditRemarkModal = true
    },
    calculateAmount() { // 更新价格或者数量，重新计算商品行总价，同时需要强制刷新当前行视图
      this.selectedProduct.productItemAmount = this.selectedProduct.productItemNum * this.selectedProduct.salePriceWithTax
      this.refreshTable()
    },
    refreshTable() {
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

function getProductById(item, productList, inInit = false) {
  for (let i = 0; i < productList.length; i++) {
    if (productList[i].id === item.id && !inInit) {
      return productList[i]
    }
  }
  return null
}

</script>

<style scoped>
  .remove-shadows{
    box-shadow: none;
  }
</style>
