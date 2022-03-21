<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('商家') + ':'" :space="1" prop="merchantId">
            <ody-merchant-select ref="merchantId" v-model="filters.merchantId" value-key="merchantId" name="merchantId" />
          </ody-search-item>
          <ody-search-item :label="$t('渠道') + ':'" :space="1" prop="sysSource">
            <ody-channel-select ref="sysSource" v-model="filters.sysSource" name="sysSource" />
          </ody-search-item>
          <ody-search-item :label="$t('店铺') + ':'" :space="1" prop="storeId">
            <ody-store-select ref="storeId" v-model="filters.storeId" value-key="storeId" name="storeId" />
          </ody-search-item>
          <ody-search-item :label="$t('订单编号') + ':'" :space="1" prop="orderCode">
            <el-input v-model="filters.orderCode" :placeholder="$t('请输入') + $t('订单编号')" name="searchForm_filters_orderCode" />
          </ody-search-item>
          <ody-search-item :label="$t('订单类型') + ':'" prop="orderType">
            <el-select v-model="filters.orderType" name="search_param_orderType">
              <el-option :value="null" :label="$t('common_status_all')"/>
              <el-option v-for="item in orderTypeList" :label="item.name" :key="item.code" :value="item.code" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('订单状态') + ':'" :space="1" prop="orderStatus">
            <ody-dict-select ref="orderStatus" v-model="filters.orderStatus" :is-number="false" pool="oms" category="ORDER_STATUS" name="orderStatus" />
          </ody-search-item>
          <ody-search-item :label="$t('支付方式') + ':'" :space="1" prop="orderPaymentType">
            <ody-dict-select ref="orderPaymentType" v-model="filters.orderPaymentType" :is-number="false" pool="oms" category="PAY_METHOD" name="PAY_METHOD" />
          </ody-search-item>
          <ody-search-item :label="$t('state_of_payment') + ':'" :space="1">
            <ody-dict-select ref="orderPaymentStatus" v-model="filters.orderPaymentStatus" :is-number="false" pool="oms" category="ORDER_PAYMENT_STATUS" name="orderPaymentStatus" />
          </ody-search-item>
          <ody-search-item :label="$t('orderCreateTime') + ':'" :space="2">
            <ody-date-range-picker
              ref="orderCreateTime"
              v-model="orderCreateTimeRange"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              :default="7"
              :range-separator="$t('至')"
              type="datetimer"
              name="orderCreateTime" />
          </ody-search-item>
          <ody-search-item :label="$t('paymentTime') + ':'" :space="2">
            <ody-date-range-picker
              ref="orderPaymentConfirmDate"
              v-model="orderPaymentConfirmDateRange"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              :default="7"
              :range-separator="$t('至')"
              type="datetimer"
              name="orderPaymentConfirmDate" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="FinSo_listPage_search"
          code="FinSo_listPage"
          size="small"
          type="primary"
          @click="search"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="FinSo_exportData"
          code="FinSo_add"
          size="small"
          @click="add"
        >{{ $t('newly_added') }}</ody-button>
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          name="FinSo_exportData"
          code="FinSo_exportData"
          size="small"
          style="margin-left: 16px"
        >{{ $t('export') }}</ody-batch-export-button>
        <el-popover placement="bottom" with="160" trigger="hover">
          <div class="btn-popover">
            <ody-export-task-button
              pool="finance"
              task-type="finSoExport"
              name="FinSo_seeExportTask"
              code="FinSo_exportData"
              size="small"
            >{{ $t('seeExportTask') }}</ody-export-task-button>
          </div>
          <el-button slot="reference" style="margin-left: 16px" size="small">
            {{ $t('seeTask') }}
            <i class="el-icon-arrow-down" />
          </el-button>
        </el-popover>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :checked.sync="checked"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="true"
          name="finSoTable"
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
  name: 'FinSoList',
  data() {
    return {
      checked: [],
      exportModel: {
        exportApi: ['back-finance-web', 'finSo', 'exportData'],
        pool: 'finance',
        taskType: 'finSoExport',
        async: true,
        getExportData: () => {
          this.handleFilters()
          return { filters: this.filters }
        }
      },
      loading: false,
      orderTypeList: [],
      list: [],
      columns: [
        {
          label: this.$t('订单编号'),
          prop: 'orderCode',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('订单类型'),
          prop: 'orderTypeStr',
          show: true,
          align: 'right',
          minWidth: 124
        },
        {
          label: this.$t('商家'),
          prop: 'merchantName',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('渠道'),
          prop: 'sysSourceStr',
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
          label: this.$t('下单用户账号'),
          prop: 'userName',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('结算币种'),
          prop: 'currencyName',
          show: true,
          align: 'center',
          minWidth: 88
        },
        {
          label: this.$t('订单销售金额'),
          prop: 'productAmount',
          show: true,
          align: 'right',
          minWidth: 124
        },
        {
          label: this.$t('促销优惠金额'),
          prop: 'orderPromotionDiscount',
          show: true,
          align: 'right',
          minWidth: 124
        },
        {
          label: this.$t('优惠劵/码优惠金额'),
          prop: 'orderPaidByCoupon',
          show: true,
          align: 'right',
          minWidth: 124,
          formatter(row, column) {
            return (parseFloat(row.orderPaidByCoupon == null ? 0 : row.orderPaidByCoupon) + parseFloat(row.orderReferralAmount == null ? 0 : row.orderReferralAmount)).toFixed(2)
          }
        },
        {
          label: this.$t('freight'),
          prop: 'orderDeliveryFee',
          show: true,
          align: 'right',
          minWidth: 124
        },
        {
          label: this.$t('礼品卡抵扣'),
          prop: 'pmGiftCardAmount',
          show: true,
          align: 'right',
          minWidth: 124
        },
        {
          label: this.$t('佣金抵扣'),
          prop: 'pmPaidByAccount',
          show: true,
          align: 'right',
          minWidth: 88
        },
        {
          label: this.$t('积分抵扣'),
          prop: 'pmUsedMoney',
          show: true,
          align: 'right',
          minWidth: 88
        },
        {
          label: this.$t('订单实付金额'),
          prop: 'orderAmount',
          show: true,
          align: 'right',
          minWidth: 124
        },
        {
          label: this.$t('支付方式'),
          prop: 'orderPaymentTypeStr',
          show: true,
          align: 'right',
          minWidth: 124
        },
        {
          label: this.$t('state_of_payment'),
          prop: 'orderPaymentStatusStr',
          show: true,
          align: 'right',
          minWidth: 124
        },
        {
          label: this.$t('订单状态'),
          prop: 'orderStatusStr',
          show: true,
          align: 'right',
          minWidth: 88
        },
        {
          label: this.$t('orderCreateTime'),
          prop: 'orderCreateTime',
          show: true,
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.orderCreateTime) {
              return this.$portal.parseTime(
                row.orderCreateTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        },
        {
          label: this.$t('paymentTime'),
          prop: 'orderPaymentConfirmDate',
          show: true,
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.orderPaymentConfirmDate) {
              return this.$portal.parseTime(
                row.orderPaymentConfirmDate,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        }
      ],
      operates: {
        fixed: 'right',
        width: 124,
        align: 'center',
        list: [
          {
            label: this.$t('查看'),
            code: 'FinSo_getById',
            method: (index, row) => {
              this.$router.push({
                name: 'FinSoDetail',
                query: {
                  id: row.id,
                  readonly: true
                }
              })
            }
          },
          {
            label: this.$t('编辑'),
            code: 'FinSo_update',
            method: (index, row) => {
              this.$router.push({
                name: 'FinSoEdit',
                query: {
                  id: row.id,
                  readonly: false
                }
              })
            }
          },
          {
            label: this.$t('删除'),
            code: 'FinSo_delete',
            method: (index, row) => {
              this.delete(row)
            }
          }
        ]
      },
      orderCreateTimeRange: [],
      orderPaymentConfirmDateRange: [],
      filters: {
        isLeaf: 1
      },
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
      this._listOrderTypeList(this)
      this.search()
    },
    async initCodes() {
    },
    _listOrderTypeList(vm) {
      vm.$finance.$api.common.soTypeList({}).then((result) => {
        vm.orderTypeList = result.data
      })
    },
    search() {
      this.loading = true

      this.handleFilters()
      const args = { filters: this.filters, ...this.page }
      this.$finance.$api.finSo.listPage(args).then(
        res => {
          this.loading = false
          this.list = res.data
          this.total = res.total
          this.list.forEach(item => {
            if (!item.orderPromotionDiscount) {
              item.orderPromotionDiscount = 0
            }
            if (!item.pmGiftCardAmount) {
              item.pmGiftCardAmount = 0
            }
          })
        },
        () => {
          this.loading = false
        }
      )
    },
    handleFilters() {
      if (this.orderCreateTimeRange && this.orderCreateTimeRange.length > 1) {
        this.filters.startOrderCreateTime = this.orderCreateTimeRange[0]
        this.filters.endOrderCreateTime = this.orderCreateTimeRange[1]
      } else {
        delete this.filters.startOrderCreateTime
        delete this.filters.endOrderCreateTime
      }
      if (this.orderPaymentConfirmDateRange && this.orderPaymentConfirmDateRange.length > 1) {
        this.filters.startOrderPaymentConfirmDate = this.orderPaymentConfirmDateRange[0]
        this.filters.endOrderPaymentConfirmDate = this.orderPaymentConfirmDateRange[1]
      } else {
        delete this.filters.startOrderPaymentConfirmDate
        delete this.filters.endOrderPaymentConfirmDate
      }
    },
    reset() {
      this.checked = []
      this.filters = {
        isLeaf: 1
      }
      this.orderCreateTimeRange = []
      this.$refs.orderCreateTime.setDefault(7)
      this.orderPaymentConfirmDateRange = []
      this.$refs.orderPaymentConfirmDate.setDefault(7)
    },
    add() {
      this.$router.push({
        name: 'FinSoAdd',
        query: {
          readonly: false
        }
      })
    },
    async batchDelete() {
      if (this.checked.length === 0) {
        return this.$message(this.$t('至少选择一条数据'))
      }
      const confirm = await this.$confirm(
        this.$t('是否删除选中的') + this.$t('原始订单表'),
        this.$t('common_prompt')
      )
      if (confirm) {
        if (this.checked && this.checked.length > 0) {
          const ids = this.checked.map(x => x['id'])
          const result = await this.$finance.$api.finSo.delete(ids)
          if (result && result.code === '0') {
            this.checked = []
            this.search()
            this.$message({
              type: 'success',
              message: this.$t('common_delete_success')
            })
          }
        }
      }
    },
    async delete(row) {
      const confirm = await this.$confirm(
        this.$t('是否删除当前') + this.$t('原始订单表'),
        this.$t('common_prompt')
      )
      if (confirm) {
        const ids = []
        ids.push(row.id)
        const result = await this.$finance.$api.finSo.delete(
          ids
        )
        if (result && result.code === '0') {
          this.search()
          this.$message({
            type: 'success',
            message: this.$t('common_delete_success')
          })
        }
      }
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
/deep/ .cp-list-search-area{
  height: 275px !important;
}
</style>
