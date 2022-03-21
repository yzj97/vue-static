<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('common_product_codeOrBarcode') + ':'" prop="productCodeBarcode">
            <el-input v-model="searchForm.productCodeBarcode" name="searchForm_productCodeBarcode" maxlength="25" />
          </ody-search-item>

          <ody-search-item :label="$t('common_product_name') + ':'" prop="mpName">
            <el-input v-model="searchForm.mpName" name="searchForm_mpName" maxlength="25" />
          </ody-search-item>
          <ody-search-item :label="$t('contractProduct_field_effectiveTime') + ':'" prop="effectiveTime">
            <ody-date-range-picker
              v-model="searchForm.effectiveTime"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              type="date"
              name="searchForm_effectiveTime"
              value-format="yyyy-MM-dd">range-separator="-"/></ody-date-range-picker>

              <!-- <el-date-picker
              v-model="searchForm.effectiveTime"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="searchForm_effectiveTime"
              type="daterange"
              range-separator="-"
              value-format="yyyy-MM-dd"
            /> -->
          </ody-search-item>
          <ody-search-item :label="$t('contractProduct_field_expireTime') + ':'" prop="expireTime">
            <ody-date-range-picker
              v-model="searchForm.expireTime"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              type="date"
              name="searchForm_expireTime"
              value-format="yyyy-MM-dd">range-separator="-"/></ody-date-range-picker>
              <!-- <el-date-picker
              v-model="searchForm.expireTime"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="searchForm_expireTime"
              type="daterange"
              range-separator="-"
              value-format="yyyy-MM-dd"
            /> -->
          </ody-search-item>
          <ody-search-item :label="$t('purchaseOrder_product_currencyCode') + ':'" prop="currencyCode">
            <el-select v-model="searchForm.currencyCode" name="searchForm_currencyCode">
              <el-option :label="$t('common_status_all')" :key="''" :value="''" />
              <el-option
                v-for="item in currencyList"
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
          name="OpmsContractProductPriceView01_handleSearchSubmit"
          size="small"
          type="primary"
          code="OpmsContractProductPriceView01"
          @click="handleSearchSubmit"
        >{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeName" name="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('生效数据')" name="0"/>
          <el-tab-pane :label="$t('失效数据')" name="1"/>
        </el-tabs>
      </div>
      <div slot="btn-bottom">
        <template v-if="activeName === '0'">
          <ody-button
            name="OpmsContractProductPriceView02_exportData"
            size="small"
            code="OpmsContractProductPriceView02"
            @click="exportData"
          >{{ $t('common_export') }}</ody-button>
        </template>
        <template v-if="activeName === '1'">
          <ody-button
            name="OpmsContractProductPriceView03_exportData"
            size="small"
            code="OpmsContractProductPriceView03"
            @click="exportData"
          >{{ $t('common_export') }}</ody-button>
        </template>
      </div>
      <div slot="table">
        <ody-table :loading="loading" :data="list" :columns="columns" :operates="operates" name="list497" />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
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
  name: 'OpmsContractProductPriceView',
  data() {
    return {
      activeName: '0',
      selectedItem: null,
      merchants: [],
      searchForm: getDefaultSearchForm(),
      loading: false,
      currencyList: [],
      list: [],
      productCodeBarcode: null,
      mpName: null,
      startEffectiveTime: null,
      endEffectiveTime: null,
      startExpireTime: null,
      endExpireTime: null,
      currencyCode: null,
      page: {
        size: 10,
        current: 1,
        total: 0
      },

      columns: [
        {
          show: true,
          prop: 'supplierCode',
          label: this.$t('purchaseOrderProduct_supplierCode'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'supplierName',
          label: this.$t('purchaseOrderProduct_supplierName'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('purchaseOrderProduct_receiveMerchantName'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'mpCode',
          label: this.$t('purchaseOrderProduct_mpCode'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'mpName',
          label: this.$t('purchaseOrderProduct_mpName'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'mpSpec',
          label: this.$t('purchaseOrderProduct_mpSpec'),
          align: 'center'
        },
        {
          show: true,
          prop: 'categoryName',
          label: this.$t('purchaseOrderProduct_categoryName'),
          align: 'center'
        },
        {
          show: true,
          prop: 'mpMeasurementUnit',
          label: this.$t('purchaseOrderProduct_mpMeasureUnit'),
          align: 'center'
        },
        {
          show: true,
          prop: 'minOrderQuantity',
          label: this.$t('purchaseOrder_product_minCount'),
          align: 'center'
        },
        {
          show: true,
          prop: 'settlementPartyTypeText',
          label: this.$t('purchaseOrder_product_settlementPartyType'),
          align: 'center'
        },
        {
          show: true,
          prop: 'effectiveTimeText',
          label: this.$t('contractProduct_field_effectiveTime'),
          align: 'center'
        },
        {
          show: true,
          prop: 'expireTimeText',
          label: this.$t('contractProduct_field_expireTime'),
          align: 'center'
        },
        {
          show: true,
          prop: 'currencyCode',
          label: this.$t('purchaseOrder_product_currencyCode'),
          align: 'center'
        },
        {
          show: true,
          prop: 'costWithTaxUnitAmt',
          label: this.$t('purchaseOrder_product_saleWithTaxUnitAmt'),
          align: 'center'
        },
        {
          show: true,
          prop: 'costTaxRate',
          label: this.$t('supplier_product_costTaxRate'),
          align: 'center'
        },
        {
          show: true,
          prop: 'costWithoutTaxUnitAmt',
          label: this.$t('purchaseOrder_product_saleWithoutTaxUnitAmt'),
          align: 'center'
        },
        {
          show: true,
          prop: 'distributionChannelText',
          label: this.$t('purchaseOrder_product_distributionChannel'),
          align: 'center'
        },
        {
          show: true,
          prop: 'isIncludingDeliveryFeeText',
          label: this.$t('purchaseOrder_product_includingShippingFee'),
          align: 'center'
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
    handleClick(tab, event) {
      console.log(tab, event)
      this.activeName = tab.name
      this.updateList()
    },
    async handleTabsClick() {
      try {
        this.currentTab = this.tabs[this.activeState]
        this.searchForm.pickStatus = this.currentTab.pickStatus
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
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
    },
    _initCodes() {
      const vue = this
      vue.$opms.$api.common.queryCurrencyList({}).then(data => {
        if (data.code === '0') {
          vue.currencyList = data.data
        } else {
          this.$message({
            type: 'error',
            message: data.message
          })
        }
      })
    },
    init() {
      this._initCodes()
      this.updateList()
    }
  }
}
async function exportData(vue) {
  await loadList(vue, true)
}

async function loadList(vue, isExport = false) {
  const filters = JSON.parse(JSON.stringify(vue.searchForm))
  console.log(filters)
  if (filters.effectiveTime) {
    filters.startEffectiveTime = filters.effectiveTime[0]
    filters.endEffectiveTime = filters.effectiveTime[1]
    delete filters.effectiveTime
  }
  if (filters.expireTime) {
    filters.startExpireTime = filters.expireTime[0]
    filters.endExpireTime = filters.expireTime[1]
    delete filters.expireTime
  }
  console.log(filters.startExpireTime + '...' + filters.endExpireTime)
  const param = {
    currentPage: vue.page.current,
    itemsPerPage: vue.page.size,
    obj: {
      startEffectiveTime: filters.startEffectiveTime,
      endEffectiveTime: filters.endEffectiveTime,
      startExpireTime: filters.startExpireTime,
      endExpireTime: filters.endExpireTime,
      flag: vue.activeName,
      currencyCode: vue.searchForm.currencyCode,
      productCodeBarcode: vue.searchForm.productCodeBarcode,
      mpName: vue.searchForm.mpName
    }
  }
  const contractProductPrice = vue.$opms.$api.contractProductPrice
  if (!isExport) {
    const res = await contractProductPrice.querySupplierProductView(param)
    if (res.code) {
      const data = res.data.listObj
      vue.list = data
      vue.page.total = res.data.total
    }
  } else {
    vue.$portal.downloadFileByGet(
      'api/opms-web/contractProductPrice/exportContractProductPrice.do',
      { queryContent: JSON.stringify(param.obj) },
      '供应商商品查看.xlsx'
    )
  }
}

function getDefaultSearchForm() {
  return Object.assign({}, {})
}
</script>

<style lang="scss" scoped>
</style>
