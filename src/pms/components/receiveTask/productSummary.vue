<template>
  <section class="pg-paySummary-list">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>{{ $t('供应商商品') }}</span> <!-- 商品信息 -->
      </div>
      <el-row>
        <ody-list-table-area class="remove-shadows">
          <div slot="btn">
            <el-button name="addProduct" size="small" type="primary" @click="addProduct">{{ $t('添加商品') }}</el-button>
            <el-button name="quickAdd" size="small" @click="quickAdd">{{ $t('快速录入') }}</el-button>
            <el-button :disabled="checked.length == 0" name="batchDelProduct" size="small" @click="batchDelProduct">{{ $t('manual_order_batch_delete') }}</el-button>
            <el-button :disabled="checked.length == 0" name="batchSetReceiveNum" size="small" @click="showBatchEditReceiveNum" >{{ $t('批量设置收货数量') }}</el-button>
            <el-button :disabled="checked.length == 0" name="batchSetReceiveNum" size="small" @click="showBatchEditRemark" >{{ $t('批量设置备注') }}</el-button>
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
                :label="$t('商品编码')"
                prop="code"
                align="center"
                min-width="150"/>
              <el-table-column
                :label="$t('商品名称')"
                prop="chineseName"
                align="center"
                min-width="150"/>
              <el-table-column
                :label="$t('条码')"
                prop="barCode"
                align="center"
                min-width="150"/>
              <el-table-column
                :label="$t('SPU编码')"
                prop="productSpuCode"
                align="center"
                min-width="150"/>
              <el-table-column
                :label="$t('货号')"
                prop="artNo"
                align="center"
                min-width="150"/>
              <el-table-column
                :label="this.$t('规格属性')"
                prop="saleAttribute"
                align="center"
                min-width="120"/>
              <el-table-column
                :label="$t('计量单位')"
                prop="mainUnitName"
                align="center"
                min-width="100"/>
              <el-table-column
                :label="$t('收货任务数量')"
                align="center"
                min-width="140">
                <template slot-scope="scope">
                  <ody-input-number
                    v-if="forceUpdate"
                    v-model="scope.row.productItemNum"
                    :step="1"
                    :step-strictly="true"
                    :min="1"
                    :max="999999"
                    name="scope_row_productItemNum"
                    size="small"
                    style="width: 120px;"
                    @blur="changeItemNum(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                :label="this.$t('含税采购单价')"
                align="center"
                min-width="120">
                <template slot-scope="scope">
                  <div>
                    <span>
                      {{ scope.row.purchasePrice == null ? scope.row.salePriceWithTax : scope.row.purchasePrice }}
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                :label="this.$t('小计')"
                align="center"
                min-width="120">
                <template slot-scope="scope">
                  <div>
                    <span>
                      {{ (parseFloat(scope.row.productItemNum) * parseFloat(scope.row.purchasePrice == null ? scope.row.salePriceWithTax : scope.row.purchasePrice)).toFixed(2) }}
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                :label="this.$t('备注')"
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
      <!--修改收货任务数量-->
      <EditReceiveNum :visible.sync="showEditReceiveNumModal" :product.sync="selectedProduct" @ok="refreshTableNew" />
    </el-card>
    <!-- 快速录入弹框 -->
    <ody-dialog :visible.sync="fastInput.showFastInput" :title="$t('快速录入')" width="30%">
      <div>
        <el-radio-group v-model="fastInput.type">
          <el-radio :label="1">{{ $t('商品编码') }}</el-radio>
          <el-radio :label="2">{{ $t('条码') }}</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top: 10px">
        <el-input v-model="fastInput.context" :rows="10" name="context" type="textarea" maxlength="500"/>
        <p>请在下面文本框中输入商品编码,每行一个商品编码，最多500行。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="center">
          <el-button size="small" @click="fastInput.context = '';fastInput.showFastInput = false">{{ $t('取消') }}</el-button>
          <el-button size="small" type="primary" @click="doFastInput">{{ $t('确认') }}</el-button>
        </el-row>
      </span>
    </ody-dialog>
  </section>
</template>
<script>
import ProductModal from '@/components/productModal'
import EditRemark from './editRemark'
import EditReceiveNum from './editReceiveNum'
export default {
  components: {
    ProductModal,
    EditRemark,
    EditReceiveNum
  },
  props: {
    collect: {
      type: Object,
      default: null
    },
    formData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      batchOperation: false,
      fastInput: {
        type: 1, // 1 商品编码，2 条码
        context: '',
        showFastInput: false
      },
      batchOperationNum: false,
      forceUpdate: true,
      checked: [],
      showProductModal: false,
      showEditRemarkModal: false,
      showEditReceiveNumModal: false,
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
      if (!this.formData.merchantId) {
        return 'please_choose_merchant'
      }
      if (!this.formData.coinType) {
        return 'pleaseSelectTheCurrencyType'
      }
      if (!this.formData.goodReceiverAreaCode) {
        return 'please_choose_receiver_address'
      }
      if (!this.formData.expectReceiveDate) {
        return 'pleaseSelectExpectedReceiveDate'
      }
      if (!this.formData.receiveType) {
        return '请选择任务类型'
      }
    },
    // 快速录入
    quickAdd() {
      const vue = this
      const messageCode = vue.preAddProduct()
      if (messageCode) {
        this.$message({
          type: 'warn',
          message: vue.$t(messageCode)
        })
        return
      }
      vue.fastInput.showFastInput = true
    },
    async doFastInput() {
      // 快速录入
      if (!this.fastInput.context) {
        this.$message(this.$t('数据不能为空'))
        return
      }
      const fastInputText = this.fastInput.context.replace(/\n/g, '|').replace(/\s+/g, '').replace(/\|+/g, '|')
      if (fastInputText === '' || fastInputText === '|') {
        this.$message(this.$t('数据不能为空'))
        return
      }
      const codes = fastInputText.split('|')
      const params = {
        currentPage: 1,
        itemsPerPage: 500,
        merchantId: this.formData.merchantId,
        warehouseType: 0,
        goodReceiverAreaCode: this.formData.goodReceiverAreaCode,
        channelCode: this.formData.orderSysSource,
        storeIds: [this.formData.storeId],
        typeOfProducts: [0, 3],
        dataType: 2,
        status: 2,
        frontCanSale: 1 // 上架商品
      }
      if (this.fastInput.type === 1) {
        // 商品编码
        params.codes = codes
      } else if (this.fastInput.type === 2) {
        // 条码
        params.barCodes = codes
      } else {
        this.$message('this.fastInput.type error => ' + this.fastInput.type)
        return
      }
      // const res = await this.stockApi.listInventoryMerchantProductPage(params)
      const res = await this.$pms.$api.common.merchantProductList(params)
      if (res && res.data && res.data.listObj) {
        const list = res.data.listObj
        list.forEach(data => {
          data.productItemNum = 1
        })
        const count = await this.saveProduct(list, 1)
        this.$alert('本次录入：' + codes.length + '条\n成功录入：' + count + '条', this.$t('提示'), { confirmButtonText: this.$t('确定') })
      } else {
        this.$message.error('录入失败')
      }
      this.fastInput.context = ''
      this.fastInput.showFastInput = false
    },
    async batchDelProduct() { // 批量删除商品行 todo 删除提醒
      const confirm = await this.$confirm(
        this.$t('确认删除选择的数据吗?'),
        this.$t('common_prompt')
      )
      if (confirm) {
        this.checked.forEach(item => {
          this.formData.productList.splice(this.formData.productList.indexOf(item), 1)
        })
        this.checked = []
        this.eventUpdateProductNum()
      }
    },
    async delProduct(item) { // 删除商品行
      const confirm = await this.$confirm(
        this.$t('你确定要删除这行内容吗?'),
        this.$t('common_prompt')
      )
      if (confirm) {
        this.formData.productList.splice(this.formData.productList.indexOf(item), 1)
        this.eventUpdateProductNum()
      }
    },
    async saveProduct(products, operationType, isInit = false) { // 添加商品行
      let count = 0
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
          count++
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
            element.purchasePrice = 0
            element.salePriceWithTax = 0
            element.productItemAmount = 0
          }
          if (!element.spuCode) {
            element.spuCode = element.code
          }
          element.id = null
          if (element.purchasePrice === null) {
            element.purchasePrice = element.salePriceWithTax
          }
          this.formData.productList.push(element)
          this.selectedProduct = element
          this.updateProductNum()
        })
      }
      return count
    },
    async getMerchantProductPrice(itemList) { // 获取商品的价格
      var merchantProductList = []
      for (var i = 0; i < itemList.length; i++) {
        merchantProductList.push({ merchantProductId: itemList[i]['id'], dataType: 2, currencyCode: '', customerId: '', contractCode: '' })
      }
      const params = {
        channelCode: this.formData.orderSysSource,
        isOnLine: 1,
        dataType: 2,
        merchantProductList: merchantProductList
      }
      const result = await this.$pms.$api.common.merchantProductPriceList(params)
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
            }
          }
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
      this.batchOperationNum = false
      if (row.productItemNum === undefined || row.productItemNum <= 0) {
        row.productItemNum = isNaN(Number(row.orderStartNum)) ? 1 : (Number(row.orderStartNum) > 0 ? Number(row.orderStartNum) : 1)
        this.forceUpdate = false
        // 此处赋值的数据不能自动回显到页面上，使用v-if重新渲染
        setTimeout(() => {
          this.forceUpdate = true
        }, 5)
      }
      this.selectedProduct = row
      this.updateProductNum()
    },
    showBatchEditReceiveNum() {
      this.selectedProduct = {}
      this.batchOperationNum = true
      this.batchOperation = false
      this.showEditReceiveNumModal = true
    },
    showBatchEditRemark() {
      this.selectedProduct = {}
      this.batchOperation = true
      this.batchOperationNum = false
      this.showEditRemarkModal = true
    },
    showEditRemark(item) {
      this.batchOperation = false
      this.selectedProduct = item
      this.showEditRemarkModal = true
    },
    calculateAmount() { // 更新价格或者数量，重新计算商品行总价，同时需要强制刷新当前行视图
      if (this.batchOperationNum) {
        this.checked.forEach(item => {
          if (item.purchasePrice) {
            item.productItemAmount = this.selectedProduct.receiveNum * item.salePriceWithTax
          } else {
            item.productItemAmount = this.selectedProduct.receiveNum * item.purchasePrice
          }
        })
      } else {
        if (this.selectedProduct.purchasePrice) {
          this.selectedProduct.productItemAmount = this.selectedProduct.productItemNum * this.selectedProduct.purchasePrice
        } else {
          this.selectedProduct.productItemAmount = this.selectedProduct.productItemNum * this.selectedProduct.salePriceWithTax
        }
      }
      this.refreshTable()
    },
    refreshTable() {
      const index = this.formData.productList.indexOf(this.selectedProduct)
      if (this.batchOperation) {
        this.checked.forEach(item => {
          item.remark = this.selectedProduct.remark
        })
      }
      // 刷新视图
      this.$set(this.formData.productList, index, this.selectedProduct)
    },
    refreshTableNew() {
      if (this.batchOperationNum) {
        this.checked.forEach(item => {
          item.productItemNum = this.selectedProduct.receiveNum
          this.updateProductNum()
        })
      }
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
    },
    init() {
      this._initCode()
    }
  }
}

function getProductById(item, productList, inInit = false) {
  for (let i = 0; i < productList.length; i++) {
    if (productList[i].code === item.code && !inInit) {
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
