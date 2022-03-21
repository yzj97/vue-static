<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('receiveOrder_field_merchantName') + ':'" prop="receiveMerchantName">
            <el-input v-model="searchForm.receiveMerchantName" name="searchForm_receiveMerchantName" />
          </ody-search-item>
          <ody-search-item :label="$t('receiveOrder_field_receiveStoreName') + ':'" prop="receiveStoreName">
            <el-input v-model="searchForm.receiveStoreName" name="searchForm_receiveStoreName" />
          </ody-search-item>
          <ody-search-item :label="$t('receiveOrder_field_receiveCode') + ':'" prop="receiveCode">
            <el-input v-model="searchForm.receiveCode" name="searchForm_receiveCode" size="medium" />
          </ody-search-item>
          <ody-search-item :label="$t('receiveOrder_orderStatus') + ':'" prop="receiveStatus">
            <el-select v-model="searchForm.receiveStatus" name="searchForm_receiveStatus">
              <el-option :label="$t('common_status_all')" />
              <el-option
                v-for="item in receiveStatusList"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('purchaseOrder_product_currencyCode') + ':'" prop="currencyCode">
            <el-select v-model="searchForm.currencyCode" name="searchForm_currencyCode">
              <el-option :label="$t('common_status_all')" />
              <el-option
                v-for="item in currencyList"
                :label="item.currencyName"
                :key="item.currencyCode"
                :value="item.currencyCode"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('receiveOrder_receivedDate') + ':'" prop="receivedDate">
            <ody-date-range-picker
              v-model="searchForm.receivedDate"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              type="date"
              name="searchForm_receivedDate"
              value-format="yyyy-MM-dd">range-separator="-"/></ody-date-range-picker>
              <!-- <el-date-picker
              v-model="searchForm.receivedDate"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="searchForm_receivedDate"
              type="daterange"
              range-separator="-"
              value-format="yyyy-MM-dd"
            /> -->
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="OpmsPurchaseReceiveOrder01_handleSearchSubmit"
          size="small"
          type="primary"
          code="OpmsPurchaseReceiveOrder01"
          @click="handleSearchSubmit"
        >{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          name="OpmsPurchaseReceiveOrder02_exportData"
          size="small"
          code="OpmsPurchaseReceiveOrder02"
          @click="exportData"
        >{{ $t('common_export') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table :loading="loading" :data="list" :columns="columns" :operates="operates" name="list634" />
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
  name: 'OpmsPurchaseReceiveOrder',
  data() {
    const vue = this
    return {
      activeName: '0',
      selectedItem: null,
      merchants: [],
      searchForm: getDefaultSearchForm(),
      loading: false,
      currencyList: [],
      receiveStatusList: [],
      list: [],
      productCodeBarcode: null,
      mpName: null,
      receiveDateStart: null,
      receiveDateEnd: null,
      currencyCode: null,
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          label: this.$t('common_operation'),
          align: 'center',
          // formatter: (row, column, cellValue) => {
          //   return `<a style="white-space: nowrap;color: dodgerblue;" href="/#/opms-web/purchasePlan/certificate/order?purchaseOrderId=${
          //     row.id
          //   }&isTrue=1">${vue.$t('supplier_attach_type_qualification')}</a>`
          // },
          render: (h, params) => {
            return (
              <a
                on-click={() => {
                  if (
                    this.$portal.hasPermission('OpmsPurchaseReceiveOrder03')
                  ) {
                    this.forwardToDetail1(params.row)
                  }
                }}
              >
                <span style={'color:#1890FF'}>
                  {vue.$t('supplier_attach_type_qualification')}
                </span>
              </a>
            )
          }
        },
        {
          show: true,
          prop: 'receiveMerchantName',
          label: this.$t('receiveOrder_field_merchantName'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'receiveStoreName',
          label: this.$t('receiveOrder_field_receiveStoreName'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'receiveCode',
          label: this.$t('receiveOrder_field_receiveCode'),
          align: 'center',
          minWidth: 200,
          // formatter: (row, column, cellValue) => {
          //   // 详情页面
          //   return `<a style="white-space: nowrap;color: dodgerblue;" href="/#/opms-web/purchaseReceiveOrder/detailInfo?receiveCode=${row.receiveCode}">${row.receiveCode}</a>`
          // },
          render: (h, params) => {
            return (
              <a
                on-click={() => {
                  if (
                    this.$portal.hasPermission(
                      'OpmsMyOrder0OpmsPurchaseReceiveOrder04'
                    )
                  ) {
                    this.forwardToDetail(params.row)
                  }
                }}
              >
                <span style={'color:#1890FF'}>{params.row.receiveCode}</span>
              </a>
            )
          }
        },
        {
          show: true,
          prop: 'receiveDateText',
          label: this.$t('receiveOrder_receivedDate'),
          align: 'center'
        },
        {
          show: true,
          prop: 'supplierCode',
          label: this.$t('common_supplier_code'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'supplierName',
          label: this.$t('common_supplier_name'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'receiveWarehouseName',
          label: this.$t('receiveOrder_field_receiveWarehouseName'),
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
          prop: 'exchangeRate',
          label: this.$t('purchase_receive_exchangeRate'),
          align: 'center'
        },
        {
          show: true,
          prop: 'saleWithTaxAmt',
          label: this.$t('purchaseOrder_product_costWithTaxAmt'),
          align: 'center'
        },
        {
          show: true,
          prop: 'orderStatusText',
          label: this.$t('common_audit_status'),
          align: 'center'
        },
        {
          show: true,
          prop: 'receiveStatusText',
          label: this.$t('receiveOrder_orderStatus'),
          align: 'center'
        },
        {
          show: true,
          prop: 'auditTimeText',
          label: this.$t('purchaseReturnOrder_field_auditTime'),
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
    _initReceiveStatus() {
      const vue = this
      vue.$opms.$api.code.list({ category: 'RECEIVE_STATUS' }).then(data => {
        if (data.code === '0') {
          vue.receiveStatusList = data.data
        } else {
          this.$message({
            type: 'error',
            message: data.message
          })
        }
      })
    },
    forwardToDetail(row) {
      this.$router.push({
        name: 'OpmsPurchaseReceiveDetailInfo',
        query: { receiveCode: row.receiveCode }
      })
    },
    forwardToDetail1(row) {
      this.$router.push({
        name: 'OpmsPurchaseReceiveOrderProductCertificate',
        query: { purchaseReceiveOrderId: row.id }
      })
    },
    init() {
      this._initCodes()
      this._initReceiveStatus()
      this.updateList()
    }
  }
}
async function exportData(vue) {
  await loadList(vue, true)
}

async function loadList(vue, isExport = false) {
  const filters = JSON.parse(JSON.stringify(vue.searchForm))
  if (filters.receivedDate) {
    filters.receiveDateStart = filters.receivedDate[0]
    filters.receiveDateEnd = filters.receivedDate[1]
    delete filters.receivedDate
  }
  const param = {
    currentPage: vue.page.current,
    itemsPerPage: vue.page.size,
    obj: {
      receiveDateStart: filters.receiveDateStart,
      receiveDateEnd: filters.receiveDateEnd,
      currencyCode: vue.searchForm.currencyCode,
      receiveMerchantName: vue.searchForm.receiveMerchantName,
      receiveStoreName: vue.searchForm.receiveStoreName,
      receiveCode: vue.searchForm.receiveCode,
      receiveStatus: vue.searchForm.receiveStatus,
      isBatch: vue.searchForm.isBatch
    }
  }
  const purchaseReceiveOrder = vue.$opms.$api.purchaseReceiveOrder
  if (!isExport) {
    const res = await purchaseReceiveOrder.queryReceiveOrderList(param)
    console.log(res)
    if (res.code) {
      const data = res.data.listObj
      vue.list = data
      vue.page.total = res.data.total
    }
  } else {
    vue.$portal.downloadFileByGet(
      'api/opms-web/purchaseReceiveOrderAction/exportSupplierReceiveOrderList.do',
      { queryContent: JSON.stringify(param.obj) },
      '采购收货单查询.xlsx'
    )
  }
}

function getDefaultSearchForm() {
  return Object.assign({}, {})
}
</script>

<style lang="scss" scoped>
</style>
