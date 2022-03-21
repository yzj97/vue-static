<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('common_merchant_name') + ':'" prop="obj.merchantName">
            <el-input v-model="queryContent.obj.merchantName" name="queryContent_obj_merchantName" />
          </ody-search-item>
          <ody-search-item :label="$t('paymentCreateTime') + ':'" class="register" prop="obj.createTime">
            <ody-date-range-picker
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              v-model="queryContent.obj.createTime"
              name="queryContent_obj_createTime"
              value-format="yyyy-MM-dd"
              type="date"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :label="$t('currentState') + ':'" prop="obj.status">
            <el-select v-model="queryContent.obj.status" :placeholder="$t('common_all')" name="queryContent_obj_status">
              <!-- 已审核待付款 -->
              <el-option :label="$t('jxPaymentStatus_3')" value="3" />
              <!-- 已付款 -->
              <el-option :label="$t('jxPaymentStatus_5')" value="5" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('settleOrderCode') + ':'" prop="obj.settlementCode">
            <el-input v-model="queryContent.obj.settlementCode" name="queryContent_obj_settlementCode" />
          </ody-search-item>
          <ody-search-item :label="$t('settlementCurrencyCode') + ':'" prop="obj.currencyCode">
            <el-select v-model="queryContent.obj.currencyCode" :placeholder="$t('common_all')" name="queryContent_obj_currencyCode">
              <el-option
                v-for="item in currencys"
                :label="item.currencyCode"
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
          name="FinanceStmSupplierJxListList_handleSearchSubmit"
          code="FinanceStmSupplierJxListList"
          size="small"
          type="primary"
          @click="handleSearchSubmit"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="FinanceStmSupplierJxListExport_handleSearchExport" code="FinanceStmSupplierJxListExport" size="small" @click="handleSearchExport">{{ $t('common_export') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table :loading="loading" :data="list" :columns="columns" :can-filter="false" name="list466" />
        <!-- :operates="operates" -->
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="queryContent.currentPage"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="queryContent.itemsPerPage"
          :total.sync="queryContent.total"
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
  name: 'FinanceStmSupplierJxList',
  data() {
    return {
      activeState: '-1',
      loading: false,
      list: [],
      currencys: [],
      queryContent: this.defaultSearch(),
      columns: [
        {
          show: true,
          prop: 'supplierName',
          label: this.$t('common_supplier_name'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('common_merchant_name'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'settlementCode',
          label: this.$t('settleOrderCode'),
          align: 'center',
          minWidth: 200,
          render: function(h, params) {
            const to = {
              name: 'FinanceStmSupplierJxDeatil',
              query: params.row
            }
            return (
              <router-link to={to} class='link-type'>
                <span>{params.row.settlementCode}</span>
              </router-link>
            )
          }
        },
        {
          show: true,
          prop: 'currencyCode',
          label: this.$t('settlementCurrency'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'chkBillWithTaxAmt',
          label: this.$t('chkBillWithTaxAmt'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            return row.chkBillWithTaxAmt != null
              ? row.chkBillWithTaxAmt
              : '0'
          }
        },
        {
          show: true,
          prop: 'feeReceiptAmt',
          label: this.$t('feeReceiptAmt'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            return row.feeReceiptAmt != null
              ? row.feeReceiptAmt
              : '0'
          }
        },
        {
          show: true,
          prop: 'feePaymentAmt',
          label: this.$t('feePaymentAmt'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            return row.feePaymentAmt != null
              ? row.feePaymentAmt
              : '0'
          }
        },
        {
          show: true,
          prop: 'settleWithTaxAmt',
          label: this.$t('settleWithTaxAmt'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            return row.settleWithTaxAmt != null
              ? row.settleWithTaxAmt
              : '0'
          }
        },
        {
          show: true,
          prop: 'paidAmt',
          label: this.$t('jx_paidAmt'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            return row.paidAmt != null
              ? row.paidAmt
              : '0'
          }
        },
        {
          show: true,
          prop: 'statusText',
          label: this.$t('currentState'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'createTime',
          label: this.$t('paymentCreateTime'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            return dateFormat(row.createTime, this)
          }
        },
        {
          show: true,
          prop: 'createUsername',
          label: this.$t('paymentCreateUsername'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'auditTime',
          label: this.$t('auditTime'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            return dateFormat(row.auditTime, this)
          }
        },
        {
          show: true,
          prop: 'auditUsername',
          label: this.$t('auditUsername'),
          align: 'center',
          minWidth: 124
        }
      ]
    }
  },
  async mounted() {
    await this.updateList()
    const res = await this.$finance.$api.common.queryCurrencyList()
    if (res) {
      this.currencys = res.data
    }
  },
  methods: {
    async handleTabsClick() {
      await this.updateList()
    },
    async updateList() {
      try {
        this.loading = true
        await loadList(this, false)
        this.loading = false
      } catch (ex) {
        console.log(ex)
      }
    },
    async handleSearchSubmit() {
      this.queryContent.currentPage = 1
      await this.updateList()
    },
    async handleSearchReset() {
      this.queryContent = this.defaultSearch()
      await this.updateList()
    },
    handlePageSizeChange() {
      this.handleSearchSubmit()
    },
    async handlePageCurrentChange() {
      await this.updateList()
    },
    async handleSearchExport() {
      // 导出
      await loadList(this, true)
    },
    defaultSearch() {
      return {
        itemsPerPage: 10,
        currentPage: 1,
        total: 0,
        obj: {
          settlementType: 1,
          currencyCode: '',
          paymentStatus: '',
          createTime: []
        }
      }
    }
  }
}

async function loadList(vue, isExport = false) {
  const searchForm = vue.queryContent.obj
  const param = {
    currentPage: vue.queryContent.currentPage,
    itemsPerPage: vue.queryContent.itemsPerPage,
    obj: {
      merchantName: searchForm.merchantName,
      status: searchForm.status,
      settlementCode: searchForm.settlementCode,
      currencyCode: searchForm.currencyCode,
      createTimeStart: null,
      createTimeEnd: null
    }
  }
  if (searchForm.createTime != null) {
    if (searchForm.createTime.length > 0) {
      param.obj.createTimeStart = searchForm.createTime[0]
    }
    if (searchForm.createTime.length > 1) {
      param.obj.createTimeEnd = searchForm.createTime[1]
    }
  }
  const api = vue.$finance.$api.stmSupplier
  if (!isExport) {
    const res = await api.queryStmSupplierSettlementList(param)
    if (res) {
      vue.list = res.data.listObj
      vue.queryContent.total = res.data.total
    }
  } else {
    // 导出exel
    // 结算类型为经销
    param.obj.settlementType = 1
    vue.$portal.downloadFileByGet(
      'api/back-finance-web/stmSupplierSettlement/exportStmSupplierSettlementList.do',
      { queryContent: JSON.stringify(param.obj) },
      '经销结算.xlsx'
    )
  }
}

function dateFormat(time, vue) {
  if (!time) {
    return ''
  }
  return vue.$portal.parseTime(time, '{y}-{m}-{d}')
}
</script>

<style lang="scss" scoped>
</style>
