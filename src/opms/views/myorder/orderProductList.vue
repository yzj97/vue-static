<template>
  <section class="myorder-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <!-- 收货商家 -->
          <ody-search-item :label="$t('purchaseOrder_field_purchaseOrg') + ':'" prop="receiveMerchantName">
            <el-input v-model="searchForm.receiveMerchantName" name="searchForm_receiveMerchantName" maxlength="100" />
          </ody-search-item>
          <!-- 收货店铺 -->
          <ody-search-item :label="$t('purchaseOrder_field_purchaseOrgStore') + ':'" maxlength="100" prop="receiveStoreName">
            <el-input v-model="searchForm.receiveStoreName" name="searchForm_receiveStoreName" />
          </ody-search-item>
          <!-- 商品编码/条码 -->
          <ody-search-item :label="$t('distributionOrder_goodCode') + ':'" maxlength="120" prop="mpCodeOrBarcode">
            <el-input v-model="searchForm.mpCodeOrBarcode" name="searchForm_mpCodeOrBarcode" />
          </ody-search-item>
          <!-- 商品品牌 -->
          <ody-search-item :label="$t('plMpConfig_mpBrandName') + ':'" maxlength="120" prop="mpBrandName">
            <el-input v-model="searchForm.mpBrandName" name="searchForm_mpBrandName" />
          </ody-search-item>
          <!-- 商品类目 -->
          <ody-search-item :label="$t('supplier_product_categoryName') + ':'" maxlength="120" prop="categoryName">
            <el-input v-model="searchForm.categoryName" name="searchForm_categoryName" />
          </ody-search-item>
          <!-- 单据单号 -->
          <ody-search-item :label="$t('common_purchase_order_code') + ':'" maxlength="120" prop="purchaseCode">
            <el-input v-model="searchForm.purchaseCode" name="searchForm_purchaseCode" />
          </ody-search-item>
          <!-- 采购日期 -->
          <ody-search-item
            :label="$t('purchaseOrder_field_purchaseDate') + ':'"
            class="register"
            prop="purchaseDate">
            <ody-date-range-picker
              v-model="searchForm.purchaseDate"
              type="date"
              name="searchForm_purchaseDate"
              value-format="yyyy-MM-dd">range-separator=" ~ "/></ody-date-range-picker>

              <!-- <el-date-picker
              v-model="searchForm.purchaseDate"
              name="searchForm_purchaseDate"
              type="daterange"
              range-separator=" ~ "
            /> -->
          </ody-search-item>
          <!-- 交易币别 -->
          <ody-search-item :label="$t('common_currency') + ':'" prop="currencyCode">
            <el-select v-model="searchForm.currencyCode" name="searchForm_currencyCode">
              <el-option :label="$t('common_status_all')" :key="''" :value="''" />
              <el-option
                v-for="item in currencys"
                :label="item.currencyName"
                :key="item.currencyCode"
                :value="item.currencyCode"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="OpmsPurchaseOrderProductList01_handleSearchSubmit"
          size="small"
          type="primary"
          code="OpmsPurchaseOrderProductList01"
          @click="handleSearchSubmit"
        >{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          name="OpmsPurchaseOrderProductList02_exportData"
          size="small"
          code="OpmsPurchaseOrderProductList02"
          @click="exportData"
        >{{ $t('common_export') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table :loading="loading" :data="list" :columns="columns" :can-filter="false" name="list696" />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>
export default {
  name: 'OpmsPurchaseOrderProductList',
  data() {
    return {
      searchForm: getDefaultSearchForm(),
      loading: false,
      list: [],
      currencys: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'receiveMerchantName', // 收货商家
          label: this.$t('purchaseOrder_field_purchaseOrg'),
          align: 'center'
        },
        {
          show: true,
          prop: 'receiveStoreName', // 收货店铺
          label: this.$t('purchaseOrder_field_purchaseOrgStore'),
          align: 'center'
        },
        {
          show: true,
          prop: 'purchaseDateText', // 采购日期
          label: this.$t('purchaseOrder_field_purchaseDate'),
          align: 'center'
        },
        {
          show: true,
          prop: 'purchaseCode', // 采购单号
          label: this.$t('common_purchase_order_code'),
          align: 'center',
          minWidth: 200
          /*, formatter: (row, column, cellValue) => {
            // 详情页面
            return `<a style="white-space: nowrap;color: dodgerblue;" href="/#/opms-web/myorder/detailInfo?purchaseCode=${row.purchaseCode}">${row.purchaseCode}</a>`
          }*/
        },
        {
          show: true,
          prop: 'orderStatusText', // 单据状态
          label: this.$t('distributionOrder_status'),
          align: 'center'
        },
        {
          show: true,
          prop: 'supplierCode', // 供应商编码
          label: this.$t('common_supplier_code'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'supplierName', // 供应商名称
          label: this.$t('common_supplier_name'),
          align: 'center'
        },
        {
          show: true,
          prop: 'currencyCode', // 交易币别
          label: this.$t('common_currency'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'mpCode', // 商品编码
          label: this.$t('common_product_code'),
          align: 'center'
        },
        {
          show: true,
          prop: 'mpName', // 商品名称
          label: this.$t('common_product_name'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'mpSpec', // 商品规格
          label: this.$t('common_mp_spec'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'mpMeasureUnit', // 主计量单位
          label: this.$t('common_mp_unit'),
          align: 'center'
        },
        {
          show: true,
          prop: 'mpConversionRate', // 转换率
          label: this.$t('common_mp_purchaseUnitRate'),
          align: 'center',
          minWidth: 88,
          formatter: (row, column, cellValue) => {
            return row.mpConversionRate != null
              ? row.mpConversionRate
              : '1'
          }
        },
        {
          show: true,
          prop: 'mpPurchaseUnit', // 采购单位
          label: this.$t('common_mp_purchaseUnit'),
          align: 'center',
          width: 88
        },
        {
          show: true,
          prop: 'purchaseCount', // 采购数量
          label: this.$t('purchaseOrder_product_quantity'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          // prop: 'saleWithoutTaxUnitAmt', // 采购金额 取 未税协议金额（不乘数量）
          label: this.$t('purchaseOrderProduct_costWithTaxAmt'),
          align: 'center',
          minWidth: 88,
          formatter: (row, column, cellValue) => {
            // 协议价乘以数量
            return toFixed(
              (row.saleWithoutTaxUnitAmt != null
                ? row.saleWithoutTaxUnitAmt
                : row.costWithoutTaxUnitAmt) *
              (row.purchaseCount != null
                ? row.purchaseCount
                : row.receiveCount),
              6
            )
          }
        },
        {
          show: true,
          prop: 'receiveCount', // 收货数量
          label: this.$t('quantity_of_receipt'),
          align: 'center'
        },
        {
          show: true,
          prop: 'receiveAmount', // 收货金额 取 未税协议金额（乘以数量）
          label: this.$t('purchaseOrderProduct_receiveAmount'),
          align: 'center'
          // ,formatter: (row, column, cellValue) => {
          // (未税协议价 != null ? 未税协议价 : 未税采购价) * 数量
          // return (row.saleWithoutTaxUnitAmt != null ? row.saleWithoutTaxUnitAmt : row.costWithoutTaxUnitAmt) * row.receiveCount
          // }
        },
        {
          show: true,
          prop: 'returnCount', // 退货数量
          label: this.$t('purchaseOrderProduct_returnCount'),
          align: 'center'
        },
        {
          show: true,
          prop: 'returnAmount', // 退货金额
          label: this.$t('purchaseOrderProduct_returnAmount'),
          align: 'center'
        },
        {
          show: true,
          prop: 'mpBarcode', // 商品条码
          label: this.$t('purchaseOrderProduct_mpBarcode'),
          align: 'center'
        },
        {
          show: true,
          prop: 'categoryName', // 商品类目
          label: this.$t('supplier_product_categoryName'),
          align: 'center'
        },
        {
          show: true,
          prop: 'mpBrandName', // 商家品牌
          label: this.$t('purchaseOrderProduct_mpBrandName'),
          align: 'center'
        }
      ]
    }
  },
  async mounted() {
    try {
      this.updateList()
      const res = await this.$opms.$api.common.queryCurrencyList()
      if (res) {
        this.currencys = res.data
      }
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
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
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async exportData() {
      try {
        await exportData(this)
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
    },
    handlePageSizeChange() {
      this.handleSearchSubmit()
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    }
  }
}

async function loadList(vue, isExport = false) {
  const param = {
    currentPage: vue.page.current,
    itemsPerPage: vue.page.size,
    obj: {
      receiveMerchantName: vue.searchForm.receiveMerchantName,
      receiveStoreName: vue.searchForm.receiveStoreName,
      purchaseCode: vue.searchForm.purchaseCode,
      categoryName: vue.searchForm.categoryName,
      mpCodeOrBarcode: vue.searchForm.mpCodeOrBarcode,
      mpBrandName: vue.searchForm.mpBrandName,
      currencyCode: vue.searchForm.currencyCode,
      startPurchaseDate: null,
      endPurchaseDate: null
    }
  }
  if (vue.searchForm.purchaseDate != null) {
    if (vue.searchForm.purchaseDate.length > 0) {
      param.obj.startPurchaseDate = vue.searchForm.purchaseDate[0]
    }
    if (vue.searchForm.purchaseDate.length > 1) {
      param.obj.endPurchaseDate = vue.searchForm.purchaseDate[1]
    }
  }
  const myorder = vue.$opms.$api.myorder
  if (!isExport) {
    const res = await myorder.purchaseOrderProductList(param)
    if (res) {
      vue.list = res.data.listObj
      vue.page.total = res.data.total
    }
  } else {
    // 导出exel
    vue.$portal.downloadFileByGet(
      'api/opms-web/purchaseOrder/exportPurchaseOrderProductList.do',
      { queryContent: JSON.stringify(param.obj) },
      '供应商商品销售明细查询.xlsx'
    )
  }
}

async function exportData(vue) {
  await loadList(vue, true)
}
function toFixed(number, count) {
  if (number != null && (number + '').indexOf('.') > -1) {
    return number.toFixed(count)
  } else {
    return number
  }
}
function getDefaultSearchForm() {
  return {
    receiveMerchantName: '',
    receiveStoreName: '',
    purchaseCode: '',
    categoryName: '',
    mpCodeOrBarcode: '',
    mpBrandName: '',
    purchaseDate: [],
    currencyCode: ''
  }
}
</script>

<style lang="scss" scoped>
</style>
