<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('please_choose')"
      width="960px"
      @open="init"
      @change-max-height="handleMaxHeight">
      <section class="pg-productModal-list">
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" class="form">
              <ody-search-item :label="$t('manual_order_product_code')" prop="code">
                <el-input v-model="searchForm.code" name="searchForm_code" />
              </ody-search-item>
              <ody-search-item :label="$t('manual_order_product_name')" prop="chineseName">
                <el-input v-model="searchForm.chineseName" name="searchForm_chineseName"/>
              </ody-search-item>
              <ody-search-item :label="$t('brand')" prop="brandName">
                <el-input v-model="searchForm.brandName" name="searchForm_brandName" />
              </ody-search-item>
              <ody-search-item :label="$t('distributor_product_category')" style="width:100%" prop="categoryId">
                <CategorySelect ref="categorySelect" :display-full-name="false" v-model="searchForm.categoryId" name="searchForm_categoryId" @clean="cleanSelected" @select="selectedCategory" />
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn" style="position: relative; z-index: 2;">
            <el-button name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_select') }}</el-button>
            <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area style="margin-top: -80px;">
          <div slot="table">
            <el-table
              v-loading="loading"
              :data="list"
              :max-height="tableMaxHeight"
              name="list039"
              style="width: 100%">
              <el-table-column
                :label="$t('order_ports_product_name')"
                prop="chineseName"
                align="center"
                min-width="150"/>
              <el-table-column
                :label="$t('order_ports_product_code')"
                prop="code"
                align="center"
                min-width="150"/>
              <el-table-column
                :label="$t('do_art_no')"
                prop="artNo"
                align="center"
                min-width="100"/>
              <el-table-column
                :label="$t('brand')"
                prop="brandName"
                align="center"
                min-width="100"/>
              <el-table-column
                :label="this.$t('manual_order_product_attr')"
                prop="saleAttribute"
                align="center"
                min-width="120">
                <!--<template slot-scope="scope">
                  <span>
                    {{ !scope.row.attributeList ? '' : scope.row.attributeList.map((item, index) => {
                      return item['attName'] + ':' + item['attValue']
                    }).join(";") }}
                  </span>
                </template>-->
              </el-table-column>
              <el-table-column
                :label="$t('manual_order_salable_stock')"
                prop="virtualAvailableStockNum"
                align="center"
                min-width="100"/>
              <el-table-column
                :label="$t('do_unit')"
                prop="mainUnitName"
                align="center"
                min-width="100"/>
              <el-table-column
                v-if="!isGiftMode"
                :label="$t('order_start_num')"
                prop="orderStartNum"
                align="center"
                min-width="100"/>
              <el-table-column
                v-if="!isGiftMode"
                :label="$t('order_multiple_num')"
                prop="orderMultipleNum"
                align="center"
                min-width="100"/>
              <el-table-column
                v-if="!isGiftMode"
                :label="$t('manual_order_quantity')"
                align="center"
                min-width="140">
                <template slot-scope="scope">
                  <el-input-number
                    v-if="scope.row.typeOfProduct !== 3"
                    v-model="scope.row.productItemNum"
                    :step="isNaN(Number(scope.row.orderMultipleNum)) || !Number(scope.row.orderMultipleNum) ? 1 : Number(scope.row.orderMultipleNum)"
                    :step-strictly="true"
                    :min="isNaN(Number(scope.row.orderStartNum)) ? 1 : Number(scope.row.orderStartNum)"
                    :max="isNaN(Number(scope.row.virtualAvailableStockNum)) ? 0 : Number(scope.row.virtualAvailableStockNum)"
                    name="scope_row_productItemNum"
                    size="small"
                    controls-position="right"
                    style="width: 120px;" />
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('common_operations')"
                fixed="right"
                align="center"
                width="80">
                <template slot-scope="scope">
                  <div
                    v-if="scope.row.typeOfProduct === 3 || (scope.row.virtualAvailableStockNum && scope.row.virtualAvailableStockNum >= scope.row.validOrderStartNum)">
                    <el-link v-if="scope.row.typeOfProduct === 3" name="showSerialProduct" type="primary" @click="showSerialProduct(scope.row)">{{ $t('common_append') }}</el-link> <!-- 虚品需要根据虚品查子品 -->
                    <el-link v-if="scope.row.typeOfProduct !== 3" name="handleOk" type="primary" @click="handleOk(scope.row,1)">{{ $t('common_append') }}</el-link>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div slot="page">
            <div class="block">
              <ody-pagination
                v-if="list && list.length"
                :current-page.sync="page.current"
                :page-sizes="[10, 20, 30, 50, 100]"
                :page-size.sync="page.size"
                :total.sync="page.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handlePageSizeChange"
                @current-change="handlePageCurrentChange"/>
            </div>
          </div>
        </ody-list-table-area>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_back') }}</el-button>
      </span>
    </ody-dialog>
    <SerialProduct
      ref="SerialProduct"
      :is-gift-mode.sync="isGiftMode"
      :visible.sync="showSerialProductModal"
      :loading.sync="loadingSerialProduct"
      :product.sync="selectedProduct"
      :serial-product-list.sync="serialProductList"
      @ok="addSerialProduct" />
  </div>
</template>
<script>
import CategorySelect from '@/components/categorySelect'
import SerialProduct from './serialProduct'

export default {
  components: {
    CategorySelect,
    SerialProduct
  },
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
    },
    visible: {
      type: Boolean,
      default: false
    },
    isGiftMode: { // 赠品，只是隐藏最小起订量，订货倍数，订购数量字段，不查询组合品
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogMaxHeight: 0,
      tableMaxHeight: 0,
      searchForm: {},
      loading: false,
      showSerialProductModal: false,
      loadingSerialProduct: false,
      selectedProduct: {}, // 选中的虚品
      serialProductList: [],
      list: [],
      page: getDefaultPage()
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
    handleMaxHeight(maxHeight) {
      this.dialogMaxHeight = maxHeight

      if (maxHeight === 0) {
        this.tableMaxHeight = 1000
        return false
      }

      const dialogHeight = 48
      const dialogPaddingTop = 24
      const dialogTitleHeight = 200
      const dialogPaddingBottom = 12
      const tableMaxHeight =
        maxHeight -
        dialogHeight -
        dialogPaddingTop -
        dialogTitleHeight -
        dialogPaddingBottom -
        90
      // console.log(111)
      this.tableMaxHeight = tableMaxHeight
    },
    async initSelected(codes) {
      this.searchForm = getDefaultSearchForm(this)
      await loadList(this, codes)
      this.list.forEach(it => this.handleOk(it, 2, true))
    },
    async updateList() {
      try {
        this.loading = true
        await loadList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    async handleSearchSubmit() {
      try {
        this.page = getDefaultPage()
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm(this)
      this.page = getDefaultPage()
      try {
        this.$refs.categorySelect.cleanSelected()
        // eslint-disable-next-line no-empty
      } catch (e) {
      }
    },
    async handlePageSizeChange(size) {
      try {
        this.$nextTick(function() {
          this.updateList()
        })
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    init() {
      this.handleSearchReset()
      this.searchForm = getDefaultSearchForm(this)
      this.handleSearchSubmit()
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleOk(item, operationType, isInit) {
      this.$emit('ok', item, operationType, isInit)
    },
    cleanSelected() {
      this.searchForm.categoryIds = []
      this.searchForm.categoryName = null
    },
    selectedCategory(nodes) {
      this.searchForm.categoryIds = []
      let selectedNode = null
      if (Array.isArray(nodes) && nodes.length > 0) {
        selectedNode = nodes[0]
      } else {
        selectedNode = nodes
      }

      if (selectedNode) {
        this.searchForm.categoryIds.push(selectedNode.id)
        this.searchForm.categoryName = selectedNode.fullNamePath
      }
    },
    // 查询虚品子品
    async showSerialProduct(row) {
      this.selectedProduct = row
      this.loadingSerialProduct = true
      await this.loadSerialProduct(row)
    },
    async loadSerialProduct(row) {
      // 加载系列子品
      const params = {
        mpId: row.id,
        canSale: 1
      }
      this.serialProductList = []
      // 先获取虚品对应的店铺商品id
      const res = await this.$oms.$api.common.getSerialProductByParam(params)
      if (res.code === '0' && res.data) {
        const data = res.data
        const mpIdList = data.map((item, index) => {
          return item.mpid
        })
        const serialParams = {
          itemIds: mpIdList,
          currentPage: 1,
          itemsPerPage: mpIdList.length,
          type: 1,
          warehouseType: this.formData.warehouseType,
          channelCode: this.formData.orderSysSource,
          goodReceiverAreaCode: this.formData.goodReceiverAreaCode,
          merchantId: this.formData.merchantId,
          customerId: this.formData.customerId,
          currencyCode: this.formData.coinType,
          storeIds: [this.formData.storeId],
          dataType: 3
        }

        // 根据店铺商品id，获取店铺商品
        const result = await this.$oms.$api.common.merchantProductList(serialParams)
        if (result.code === '0') {
          if (result.data.total && result.data.total !== 0) {
            await queryContractByParam(this, result.data.listObj)
            await getMerchantStore(this, result.data.listObj)
            this.serialProductList = result.data.listObj
          }
        }
      }
      if (this.serialProductList && this.serialProductList.length > 0) {
        this.showSerialProductModal = true
      } else {
        this.$message({
          type: 'warn',
          message: this.$t('manual_order_no_serial_product')
        })
      }
      this.loadingSerialProduct = false
    },
    addSerialProduct() {
      const addProductArray = []
      for (let index = 0; index < this.serialProductList.length; index++) {
        const serialProduct = this.serialProductList[index]
        if (!serialProduct.productItemNum) { // 数量为0，不添加
          continue
        }
        const addProduct = Object.assign({}, this.selectedProduct)
        delete addProduct.mainPictureUrl
        for (const p in addProduct) {
          if (serialProduct[p]) {
            addProduct[p] = serialProduct[p]
          }
        }
        // 添加原商品没有的属性
        for (const q in serialProduct) {
          if (!addProduct[q]) {
            addProduct[q] = serialProduct[q]
          }
        }
        addProductArray.push(addProduct)
      }
      this.handleOk(addProductArray)
    }
  }
}
async function loadList(vue, codes) {
  if (vue.searchForm.brandName) {
    var brandParams = {
      name: vue.searchForm.brandName,
      currentPage: 1,
      itemsPerPage: 100
    }
    vue.searchForm.brandIds = [-1]
    const result = await vue.$oms.$api.common.merchantBrandList(brandParams)
    if (result.code === '0' && result.data.listObj) {
      const branList = result.data.listObj
      branList.forEach(element => {
        vue.searchForm.brandIds.push(element.id)
      })
      await queryProductInner(vue, codes)
    }
  } else {
    vue.searchForm.brandIds = []
    await queryProductInner(vue, codes)
  }
}
async function queryProductInner(vue, codes) {
  const searchInfo = {}
  for (const p in vue.searchForm) {
    if (p && vue.searchForm[p] !== null) {
      searchInfo[p] = vue.searchForm[p]
    }
  }
  const param = {
    itemsPerPage: vue.page.size,
    currentPage: vue.page.current,
    ...searchInfo
  }
  if (codes && codes.length > 0) {
    param.codes = codes
    param.typeOfProducts = [0, 2]
  }
  const res = await vue.$oms.$api.common.merchantProductList(param)
  if (res.code === '0') {
    if (res.data.total && res.data.total !== 0) {
      await queryContractByParam(vue, res.data.listObj)
      await getMerchantStore(vue, res.data.listObj)
    }
    vue.list = res.data.listObj
    vue.page.total = res.data.total
  }
}
// 查询合同 账期
async function queryContractByParam(vue, productList) {
  const productMpIdList = []
  for (var i = 0; i < productList.length; i++) {
    var obj = productList[i]
    // if (vue.searchForm.currencyCode === 'CNY') {
    // 如果用户选择的是人民币，则不管是否有合同编号，本质上都是RMB的价格，所以这种情况加上符号为CNY
    obj['productItemCurrency'] = vue.searchForm.currencyCode
    obj['productItemCurrencyName'] = vue.collect.coinTypeMap[obj['productItemCurrency']]
    obj['coinTypeSign'] = vue.collect.coinTypeSignMap[obj['productItemCurrency']] // 符号
    // obj['coinSign'] = $scope.coinSignMap[$scope.queryProductContent.currencyCode];
    // }
    var catePath = obj['fullIdPath']
    if (catePath !== null && catePath !== '') {
      var indexArr = catePath.split('-')
      catePath = indexArr[1]
    }
    productMpIdList.push({
      mpId: obj.mpId,
      categoryId: Number(catePath),
      brandId: obj.brandId
    })
  }
  // 如果拿到的是userId的话，说明是普通用户下单，或者是非分销商渠道下单，不查询合同接口
  if (!vue.searchForm.customerId || !vue.isDistribution) {
    return
  }
  const result = await vue.$oms.$api.thirdData.getContract({
    currencyCode: vue.searchForm.currencyCode,
    merchantId: vue.searchForm.merchantId,
    customerId: vue.searchForm.customerId,
    contractProducts: productMpIdList
  })
  if (result.code === '0' && Array.isArray(result.data)) {
    var cproduct = result.data
    for (var index = 0; index < productList.length; index++) {
      var item = productList[index]
      for (var j = 0; j < cproduct.length; j++) {
        var cproductObj = cproduct[j]
        if (item['mpId'] === cproductObj['mpId']) {
          item['productItemCurrency'] = cproductObj['currencyCode']
          if (item['productItemCurrency'] != null) {
            item['productItemCurrencyName'] = vue.collect.coinTypeMap[item['productItemCurrency']]
            item['coinTypeSign'] = vue.collect.coinTypeSignMap[item['productItemCurrency']] // 符号
          }
          item['contractCode'] = cproductObj['contractCode']
          item['paymentMethod'] = cproductObj['paymentMethod']
          item['saleTaxRate'] = cproductObj['saleTaxRate']
        }
      }
    }
  }
}
// 查询虚拟库存
async function getMerchantStore(vue, productList) {
  var productStoreList = [] // 查询库存

  productList.forEach(data => {
    data.validOrderStartNum = getValidOrderStartNum(data)
    data.productItemNum = data.validOrderStartNum
    var storeObj = {}
    storeObj['areaCode'] = vue.searchForm.goodReceiverAreaCode // 区域code
    storeObj['itemId'] = data.id // 商品id
    productStoreList.push(storeObj)
  })
  const result = await vue.$oms.$api.thirdData.merchantProductVirtualStore(JSON.stringify(productStoreList))
  if (result.code === '0' && Array.isArray(result.data)) {
    var arr = result.data
    for (var i = 0; i < productList.length; i++) {
      var obj = productList[i]
      for (var j = 0; j < arr.length; j++) {
        var productStore = arr[j]
        if (obj['id'] === productStore['itemId']) {
          obj['virtualAvailableStockNum'] = productStore['virtualAvailableStockNum']
          obj['storeId'] = productStore['storeId']
          obj['storeName'] = productStore['storeName']
          obj['storeCode'] = productStore['storeCode']
          obj['warehouseId'] = productStore['warehouseId']
          obj['warehouseName'] = productStore['warehouseName']
        }
      }
    }
  }
}
function getValidOrderStartNum(product) {
  var orderStartNum = product.orderStartNum ? product.orderStartNum : 1
  var orderMultipleNum = product.orderMultipleNum ? product.orderMultipleNum : 1
  var validOrderStartNum = 0

  if (orderStartNum % orderMultipleNum === 0) {
    validOrderStartNum = orderStartNum
  } else {
    validOrderStartNum = (Math.ceil(Number(orderStartNum / orderMultipleNum))) * orderMultipleNum
  }

  return validOrderStartNum
}
function getDefaultSearchForm(vue) {
  return Object.assign(
    {},
    {
      type: 1,
      warehouseType: vue.formData.warehouseType,
      channelCode: vue.formData.orderSysSource,
      goodReceiverAreaCode: vue.formData.goodReceiverAreaCode,
      merchantId: vue.formData.merchantId,
      customerId: vue.formData.customerId,
      currencyCode: vue.formData.coinType,
      storeIds: [vue.formData.storeId],
      // typeOfProducts: [0, 2],
      typeOfProducts: !vue.isGiftMode ? [0, 3] : [0, 3],
      dataType: 3,
      frontCanSale: 1, // 上架商品
      brandIds: [],
      code: null,
      chineseName: null
    }
  )
}

function getDefaultPage() {
  return {
    size: 10,
    current: 1,
    total: 0
  }
}

</script>

<style lang="less" scoped>
  .pg-productModal-list{
    .cp-search-item{
      width: 33.33333%;
    }
  }
</style>
