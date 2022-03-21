<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('收款单') + ':'" :space="1" prop="paymentVoucherCode">
            <el-input ref="paymentVoucherCode" v-model="filters.paymentVoucherCode" name="paymentVoucherCode" />
          </ody-search-item>
          <!--<ody-search-item :label="$t('订单')" :space="1" prop="businessOrderCode">
            <el-input ref="businessOrderCode" v-model="filters.businessOrderCode" name="businessOrderCode" />
          </ody-search-item>-->
          <ody-search-item>
            <span slot="label">
              <el-select v-model="searchKey" :clearable="false" name="search_data_searchKey">
                <el-option :label="$t('销售订单')" value="orderCode">{{ $t('销售订单') }}</el-option>
              </el-select>
            </span>
            <el-input ref="businessOrderCode" v-model="filters.businessOrderCode" name="businessOrderCode" />
          </ody-search-item>
          <!--BC-11771<ody-search-item :label="$t('收款对象编码')" :space="1" prop="receiverAccountNo">
            <el-input ref="receiverAccountNo" v-model="filters.receiverAccountNo" name="receiverAccountNo" />
          </ody-search-item>-->
          <ody-search-item :label="$t('商家') + ':'" :space="1">
            <ody-merchant-select ref="merchantId" v-model="filters.merchantId" value-key="merchantId" name="merchantId" @change="doFreshStore"/>
          </ody-search-item>
          <ody-search-item :label="$t('店铺') + ':'" :space="1" prop="storeId">
            <ody-store-select v-if="freshStore" ref="storeId" :item-filter="filterStore" v-model="filters.storeId" value-key="storeId" name="storeId" />
          </ody-search-item>
          <ody-search-item :label="$t('支付方式') + ':'" :space="1" prop="receiverAccountType">
            <el-select v-model="filters.receiverAccountType" :placeholder="$t('请选择')" name="receiverAccountType">
              <el-option v-for="item in accountTypeList" :key="item.code" :label="item.name" :value="item.code"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('转账流水') + ':'" :space="1" prop="payerTransOrderNo">
            <el-input ref="payerTransOrderNo" v-model="filters.payerTransOrderNo" name="payerTransOrderNo" />
          </ody-search-item>
          <ody-search-item :label="$t('创建时间') + ':'" prop="createTimeRange">
            <ody-date-range-picker
              ref="createTimeRange"
              v-model="createTimeRange"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              :range-separator="$t('至')"
              :default="7"
              name="createTimeRange" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="ArPaymentVoucher_listPage_search"
          code="ArPaymentVoucherList01"
          size="small"
          type="primary"
          @click="search"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          name="ArPaymentVoucher_exportData"
          code="ArPaymentVoucherList03"
          size="small"
        >{{ $t('导出') }}</ody-batch-export-button>
        <!--<ody-button name="arPaymentVoucherExport" code="ui" size="small" @click="exportList">{{ $t('common_export') }}</ody-button>-->
        <ody-export-task-button
          :task-type="exportModel.taskType"
          pool="finance"
          name="ArPaymentVoucher_seeExportTask"
          code="ui"
          size="small"
          style="margin-left: 16px"
        >{{ $t('查看任务') }}</ody-export-task-button>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="true"
          name="arPaymentVoucherTable"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.page"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.limit"
          :total.sync="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="search"
          @current-change="search"
        />
      </div>
    </ody-list-table-area>
  </section>
</template>
<script>
export default {
  name: 'ArPaymentVoucherList',
  data() {
    const self = this
    return {
      exportModel: {
        exportApi: ['back-finance-web', 'arOffinePaymentVoucher', 'exportData.do'],
        pool: 'finance',
        taskType: 'arPaymentVoucherExport',
        async: true,
        getExportData: () => {
          this.handleFilters()
          return this.filters
        }
      },
      list: [],
      loading: false,
      freshStore: true,
      businessTypeMap: { 1: self.$t('订单') },
      accountTypeList: [
        { code: 1, name: this.$t('支付宝') },
        { code: 2, name: this.$t('微信') },
        { code: 3, name: this.$t('银行') }
      ],
      columns: [
        {
          label: this.$t('收款单'),
          prop: 'paymentVoucherCode',
          show: true,
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            const toDetail = self.toDetail
            return (
              <el-link underline='true' type='primary' title={params.row.paymentVoucherCode} on-click={(e) => toDetail(params.row.id)}>{params.row.paymentVoucherCode}</el-link>
            )
          }
        },
        {
          label: this.$t('商家'),
          prop: 'merchantName',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('店铺'),
          prop: 'storeName',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('关联单据类型'),
          prop: 'businessTypeText',
          show: true,
          align: 'center',
          minWidth: 124
          // , formatter(row, column) {
          //   return self.businessTypeMap[row.businessType]
          // }
        },
        {
          label: this.$t('关联单据'),
          prop: 'businessOrderCode',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('收款币种'),
          prop: 'currencyCode',
          show: true,
          align: 'center',
          minWidth: 88
        },
        {
          label: this.$t('收款金额'),
          prop: 'paymentAmount',
          show: true,
          align: 'center',
          minWidth: 88
        },
        {
          label: this.$t('支付方式'),
          prop: 'receiverAccountTypeText',
          show: true,
          align: 'center',
          minWidth: 88
          // , formatter(row, column) {
          //   const list = self.accountTypeList.filter(item => item.code === row.receiverAccountType)
          //   return list && list.length > 0 ? list[0].name : ''
          // }
        },
        {
          label: this.$t('转账流水'),
          prop: 'payerTransOrderNo',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('备注'),
          prop: 'remark',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('创建时间'),
          prop: 'createTime',
          show: true,
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.createTime) {
              return this.$portal.parseTime(
                row.createTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        }
      ],
      createTimeRange: [],
      searchKey: 'orderCode',
      filters: {},
      page: {
        page: 1,
        limit: 10
      },
      total: 0
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    async init() {
      this.search()
    },
    search() {
      this.loading = true
      this.handleFilters()
      this.$finance.$api.arPaymentVoucher.queryArPaymentVoucherList({
        currentPage: this.page.page,
        itemsPerPage: this.page.limit,
        obj: this.filters
      }).then(res => {
        this.loading = false
        if (res && res.data) {
          this.list = res.data.listObj
          this.total = res.data.total
        }
      }, () => {
        this.loading = false
      })
    },
    toDetail(id) {
      this.$router.push({
        name: 'ArPaymentVoucherDetail',
        params: { id: id }
      })
    },
    exportList() {
      this.handleFilters()
      this.$portal.downloadFileByPost('/api/back-finance-web/arOffinePaymentVoucher/exportArPaymentVoucherList.do', { ...this.filters })
    },
    doFreshStore() {
      this.freshStore = false
      this.$nextTick(() => {
        this.freshStore = true
      })
    },
    filterStore(store) {
      if (this.filters.merchantId) {
        return this.filters.merchantId === store.merchantId
      }
      return true
    },
    handleFilters() {
      if (this.createTimeRange && this.createTimeRange.length > 1) {
        this.filters.createTimeStart = this.createTimeRange[0]
        this.filters.createTimeEnd = this.createTimeRange[1]
      } else {
        delete this.filters.createTimeStart
        delete this.filters.createTimeEnd
      }
    },
    reset() {
      this.checked = []
      this.filters = {}
      this.createTimeRange = []
      this.$refs.createTimeRange.setDefault(7)
    }
  }
}
</script>
<style lang="scss" scoped>
.popover-container {
  .popover-input {
    margin-bottom: 10px;
  }
}
.btn-popover {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .el-button {
    margin-bottom: 4px;
  }
}
</style>
