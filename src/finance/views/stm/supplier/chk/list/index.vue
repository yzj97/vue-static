<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('common_merchant_name') + ':'" prop="obj.merchantName">
            <el-input v-model="queryContent.obj.merchantName" name="queryContent_obj_merchantName" />
          </ody-search-item>
          <ody-search-item :label="$t('common_store_name') + ':'" prop="obj.storeName">
            <el-input v-model="queryContent.obj.storeName" name="queryContent_obj_storeName" />
          </ody-search-item>
          <ody-search-item :label="$t('chk_order_code') + ':'" prop="obj.chkOrderCode">
            <el-input v-model="queryContent.obj.chkOrderCode" name="queryContent_obj_chkOrderCode" />
          </ody-search-item>
          <ody-search-item :label="$t('refOrderCode') + ':'" prop="obj.refOrderCode">
            <el-input v-model="queryContent.obj.refOrderCode" name="queryContent_obj_refOrderCode" />
          </ody-search-item>
          <ody-search-item :label="$t('chkOrderType') + ':'" prop="obj.chkOrderType">
            <el-select v-model="queryContent.obj.chkOrderType" :placeholder="$t('common_all')" name="queryContent_obj_chkOrderType">
              <el-option :label="$t('chkOrderType_1')" value="1" />
              <el-option :label="$t('chkOrderType_2')" value="2" />
              <el-option :label="$t('chkOrderType_3')" value="3" />
              <el-option :label="$t('chkOrderType_4')" value="4" />
              <el-option :label="$t('chkOrderType_5')" value="5" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('settleStatus') + ':'" prop="obj.settleStatus">
            <el-select v-model="queryContent.obj.settleStatus" :placeholder="$t('common_all')" name="queryContent_obj_settleStatus">
              <el-option :label="$t('settleStatus_1')" value="1" />
              <el-option :label="$t('settleStatus_2')" value="2" />
              <el-option :label="$t('settleStatus_3')" value="3" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('chkStatusText') + ':'" prop="obj.chkStatus">
            <el-select v-model="queryContent.obj.chkStatus" :placeholder="$t('common_all')" name="queryContent_obj_chkStatus">
              <el-option :label="$t('chkStatus_1')" value="1" />
              <el-option :label="$t('chkStatus_2')" value="2" />
              <el-option :label="$t('chkStatus_3')" value="3" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('refOrderCreateTime') + ':'" class="register" prop="obj.refOrderCreateTime">
            <ody-date-range-picker
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              v-model="queryContent.obj.refOrderCreateTime"
              name="queryContent_obj_refOrderCreateTime"
              value-format="yyyy-MM-dd"
              type="date"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :label="$t('payPlanDate') + ':'" class="register" prop="obj.payPlanDate">
            <ody-date-range-picker
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              v-model="queryContent.obj.payPlanDate"
              name="queryContent_obj_payPlanDate"
              value-format="yyyy-MM-dd"
              type="date"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :label="$t('accountExpireDate') + ':'" class="register" prop="obj.accountExpireDate">
            <ody-date-range-picker
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              v-model="queryContent.obj.accountExpireDate"
              name="queryContent_obj_accountExpireDate"
              value-format="yyyy-MM-dd"
              type="date"
              range-separator="-"
            />
          </ody-search-item>
          <!-- 交易币别 -->
          <ody-search-item :label="$t('common_currency') + ':'" prop="obj.currencyCode">
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
          name="FinanceStmSupplierChkListList"
          code="FinanceStmSupplierChkListList"
          size="small"
          type="primary"
          @click.native="handleSearchSubmit"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="FinanceStmSupplierChkListExport_handleSearchExport" code="FinanceStmSupplierChkListExport" size="small" @click="handleSearchExport">{{ $t('common_export') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="false"
          name="list624"
        />
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
  name: 'FinanceStmSupplierChkList',
  data() {
    const self = this
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
          prop: 'storeName',
          label: this.$t('common_store_name'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'chkOrderCode',
          label: this.$t('chkOrderCode'),
          align: 'center',
          minWidth: 200,
          render: function(h, params) {
            const to = {
              name: 'FinanceStmSupplierChkDeatil',
              query: params.row
            }
            return (
              <router-link to={to} class='link-type'>
                <span>{params.row.chkOrderCode}</span>
              </router-link>
            )
          }
        },
        {
          show: true,
          prop: 'chkOrderTypeText',
          label: this.$t('chkOrderType'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'refOrderCreateTime',
          label: this.$t('refOrderCreateTime'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            if (row.refOrderCreateTime) {
              return self.$portal.parseTime(
                row.refOrderCreateTime,
                '{y}-{m}-{d}'
              )
            }
          }
        },
        {
          show: true,
          prop: 'refOrderName',
          label: this.$t('receipt_name'),
          align: 'center'
        },
        {
          show: true,
          prop: 'refOrderCode',
          label: this.$t('refOrderCode'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'currencyCode',
          label: this.$t('commonCurrency'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'exchangeRate',
          label: this.$t('common_exchangeRate'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'payableAmt',
          label: this.$t('costWithTaxAmt'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'payPlanDate',
          label: this.$t('payPlanDate'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            if (row.accountExpireDate) {
              return self.$portal.parseTime(row.payPlanDate, '{y}-{m}-{d}')
            }
          }
        },
        {
          show: true,
          prop: 'accountExpireDate',
          label: this.$t('accountExpireDate'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            if (row.accountExpireDate) {
              return self.$portal.parseTime(
                row.accountExpireDate,
                '{y}-{m}-{d}'
              )
            }
          }
        },
        {
          show: true,
          prop: 'chkStatusText',
          label: this.$t('chkStatusText'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'chkUsername',
          label: this.$t('chkUsername'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'chkTime',
          label: this.$t('chkTime'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            if (row.chkTime) {
              return self.$portal.parseTime(row.chkTime, '{y}-{m}-{d}')
            }
          }
        },
        {
          show: true,
          prop: 'settleStatusText',
          label: this.$t('settleStatus'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'settleOrderCode',
          label: this.$t('settleOrderCode'),
          align: 'center',
          minWidth: 200
        }
        // ,{ 'show': true, 'prop': '', 'label': this.$t('cheOpenNum'), 'align': 'center' }
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
    async updateList() {
      try {
        this.loading = true
        await loadList(this, false)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    async handleSearchSubmit() {
      // this.page.current = 1
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
        currentPage: 1,
        itemsPerPage: 10,
        total: 0,
        obj: {
          // 平台对账状态 1待对账 2对账成功 3对账失败
          // chkStatus: 2
          chkOrderType: '',
          chkStatus: '',
          settleStatus: '',
          currencyCode: ''
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
      storeName: searchForm.storeName,
      chkOrderCode: searchForm.chkOrderCode,
      refOrderCode: searchForm.refOrderCode,
      chkOrderType: searchForm.chkOrderType,
      chkStatus: searchForm.chkStatus,
      settleStatus: searchForm.settleStatus,
      currencyCode: searchForm.currencyCode,
      refOrderCreateTimeStart: null,
      refOrderCreateTimeEnd: null,
      payPlanDateStart: null,
      payPlanDateEnd: null,
      accountExpireDateStart: null,
      accountExpireDateEnd: null
    }
  }
  if (searchForm.refOrderCreateTime != null) {
    if (searchForm.refOrderCreateTime.length > 0) {
      param.obj.refOrderCreateTimeStart = searchForm.refOrderCreateTime[0]
    }
    if (searchForm.refOrderCreateTime.length > 1) {
      param.obj.refOrderCreateTimeEnd = searchForm.refOrderCreateTime[1]
    }
  }
  if (searchForm.payPlanDate != null) {
    if (searchForm.payPlanDate.length > 0) {
      param.obj.payPlanDateStart = searchForm.payPlanDate[0]
    }
    if (searchForm.payPlanDate.length > 1) {
      param.obj.payPlanDateEnd = searchForm.payPlanDate[1]
    }
  }
  if (searchForm.accountExpireDate != null) {
    if (searchForm.accountExpireDate.length > 0) {
      param.obj.accountExpireDateStart = searchForm.accountExpireDate[0]
    }
    if (searchForm.accountExpireDate.length > 1) {
      param.obj.accountExpireDateEnd = searchForm.accountExpireDate[1]
    }
  }
  const api = vue.$finance.$api.stmSupplier
  if (!isExport) {
    const res = await api.queryChkSupplierPurchaseList(param)
    if (res) {
      vue.list = res.data.listObj
      vue.queryContent.total = res.data.total
    }
  } else {
    // 导出exel
    vue.$portal.downloadFileByGet(
      'api/back-finance-web/chkSupplierPurchase/exportChkSupplierPurchaseList.do',
      { queryContent: JSON.stringify(param.obj) },
      '收货对账.xlsx'
    )
  }
}
</script>

<style lang="scss" scoped>
</style>
