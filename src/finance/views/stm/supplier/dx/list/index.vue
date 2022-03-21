<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('common_merchant_name') + ':'" prop="obj.payerMerchantName">
            <el-input v-model="queryContent.obj.payerMerchantName" name="queryContent_obj_payerMerchantName" />
          </ody-search-item>
          <ody-search-item :label="$t('paymentStatus') + ':'" prop="obj.status">
            <el-select v-model="queryContent.obj.status" :placeholder="$t('common_all')" name="queryContent_obj_status">
              <!-- 收款单状态 0未保存 1未确认 2待审核 3已审核待收款 4部分收款 5已收款 6收款失败 7已取消 -->
              <!--
              <el-option :label="$t('paymentStatus_0')" value="0"/>
              <el-option :label="$t('paymentStatus_1')" value="1"/>
              <el-option :label="$t('paymentStatus_2')" value="2"/>
              <el-option :label="$t('paymentStatus_3')" value="3"/>
              <el-option :label="$t('paymentStatus_4')" value="4"/>
              <el-option :label="$t('paymentStatus_5')" value="5"/>
              <el-option :label="$t('paymentStatus_6')" value="6"/>
              <el-option :label="$t('paymentStatus_7')" value="7"/>
              -->
              <!-- 已审核待付款 -->
              <el-option :label="$t('jxPaymentStatus_3')" value="3" />
              <!-- 已付款 -->
              <el-option :label="$t('jxPaymentStatus_5')" value="5" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('paymentCode') + ':'" prop="obj.paymentCode">
            <el-input v-model="queryContent.obj.paymentCode" name="queryContent_obj_paymentCode" />
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
          name="FinanceStmSupplierDxListList"
          code="FinanceStmSupplierDxListList"
          size="small"
          type="primary"
          @click.native="handleSearchSubmit"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button name="FinanceStmSupplierDxListExport_handleSearchExport" code="FinanceStmSupplierDxListExport" size="small" @click="handleSearchExport">{{ $t('common_export') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="false"
          name="list821"
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
  name: 'FinanceStmSupplierDxList',
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
          prop: 'payeeSupplierName',
          label: this.$t('common_supplier_name'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'payerMerchantName',
          label: this.$t('common_merchant_name'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'paymentCode',
          label: this.$t('paymentCode'),
          align: 'center',
          minWidth: 200,
          render: function(h, params) {
            const to = {
              name: 'FinanceStmSupplierDxDeatil',
              query: params.row
            }
            return (
              <router-link to={to} class='link-type'>
                <span>{params.row.paymentCode}</span>
              </router-link>
            )
          }
        },
        {
          show: true,
          prop: 'statusText',
          label: this.$t('paymentStatus'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'currencyCode',
          label: this.$t('paymentCurrency'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'payableAmt',
          label: this.$t('payableAmt'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'advancePayAmt',
          label: this.$t('advancePayAmt'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column) => {
            const advancePayAmt = row.advancePayAmt
            if (!isNaN(Number(advancePayAmt))) {
              return Number(advancePayAmt)
            } else {
              return 0
            }
          }
        },
        {
          show: true,
          prop: 'offlinePayAmt',
          label: this.$t('offlinePayAmt'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column) => {
            const offlinePayAmt = row.offlinePayAmt
            if (!isNaN(Number(offlinePayAmt))) {
              return Number(offlinePayAmt)
            } else {
              return 0
            }
          }
        },
        {
          show: true,
          prop: 'remark',
          label: this.$t('remarkText'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'paymentMethodText',
          label: this.$t('paymentMethodText'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'payerAccountTypeText',
          label: this.$t('payerAccountTypeText'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'payerAccountNo',
          label: this.$t('payerAccountNo'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'paymentSerial',
          label: this.$t('paymentSerial'),
          align: 'center',
          minWidth: 124
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
          prop: 'createTime',
          label: this.$t('paymentCreateTime'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            return dateFormat(row.createTime, this)
          }
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
          payerMerchantName: '',
          status: '',
          paymentCode: '',
          createTime: [],
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
      payerMerchantName: searchForm.payerMerchantName,
      status: searchForm.status,
      paymentCode: searchForm.paymentCode,
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
    const res = await api.queryApSupplierPaymentList(param)
    if (res) {
      vue.list = res.data.listObj
      vue.queryContent.total = res.data.total
    }
  } else {
    // 导出exel
    vue.$portal.downloadFileByGet(
      'api/back-finance-web/apSupplierPayment/exportApSupplierPayment.do',
      { queryContent: JSON.stringify(param.obj) },
      '付款申请单.xlsx'
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
