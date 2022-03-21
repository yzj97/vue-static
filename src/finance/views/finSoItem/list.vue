<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('商家') + ':'" :space="1" prop="merchantId">
            <ody-merchant-select ref="merchantId" v-model="filters.merchantId" value-key="merchantId" name="merchantId" />
          </ody-search-item>
          <ody-search-item :label="$t('店铺') + ':'" :space="1" prop="storeId">
            <ody-store-select ref="storeId" v-model="filters.storeId" value-key="storeId" name="storeId" />
          </ody-search-item>
          <ody-search-item :label="$t('订单编号') + ':'" :space="1" prop="orderCode">
            <el-input v-model="filters.orderCode" :placeholder="$t('请输入') + $t('订单编号')" name="searchForm_filters_orderCode" />
          </ody-search-item>
          <ody-search-item :label="$t('商品编号') + ':'" :space="1" prop="code">
            <el-input v-model="filters.code" :placeholder="$t('请输入') + $t('商品编号')" name="searchForm_filters_code" />
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
            <ody-dict-select ref="orderPaymentType" v-model="filters.orderPaymentType" :is-number="false" pool="oms" category="PAY_METHOD" name="orderPaymentType" />
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
          name="FinSoItem_listPage_search"
          code="FinSoItem_listPage"
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
          name="FinSoItem_exportData"
          code="FinSoItem_exportData"
          size="small"
        >{{ $t('export') }}</ody-batch-export-button>
        <el-popover placement="bottom" with="160" trigger="hover">
          <div class="btn-popover">
            <ody-export-task-button
              pool="finance"
              task-type="finSoItemExport"
              name="FinSoItem_seeExportTask"
              code="FinSoItem_exportData"
              size="small"
            >{{ $t('seeExportTask') }}</ody-export-task-button>
          </div>
          <el-button slot="reference" size="small" style="margin-left: 16px">
            {{ $t('seeTask') }}
            <i class="el-icon-arrow-down" />
          </el-button>
        </el-popover>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="true"
          name="finSoItemTable"
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
  name: 'FinSoItemList',
  data() {
    return {
      exportModel: {
        exportApi: ['back-finance-web', 'finSoItem', 'exportData'],
        pool: 'finance',
        taskType: 'finSoItemExport',
        async: true,
        getExportData: () => {
          this.handleFilters()
          return { filters: this.filters }
        }
      },
      loading: false,
      orderTypeList: [],
      orderTypeMap: {},
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
          label: this.$t('商家名称'),
          prop: 'merchantName',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('店铺名称'),
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
          minWidth: 124
        },
        {
          label: this.$t('结算币种'),
          prop: 'productItemCurrencyName',
          show: true,
          align: 'center',
          minWidth: 88
        },
        {
          label: this.$t('商品编码'),
          prop: 'code',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('商品名称'),
          prop: 'productCname',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('do_standard'),
          prop: 'standard',
          show: true,
          align: 'center',
          minWidth: 124,
          formatter(row, column) {
            if (row.standard) {
              var props = JSON.parse(row.standard)
              var val = ''
              props.forEach(o => {
                val = val + o.name + ':' + o.value + ';'
              })
              return val.length === 0 ? val : val.substring(0, val.length - 1)
            }
            return ''
          }
        },
        {
          label: this.$t('计量单位'),
          prop: 'unit',
          show: true,
          align: 'center',
          minWidth: 88
        },
        {
          label: this.$t('条码'),
          prop: 'barCode',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('SPU编码'),
          prop: 'spuCode',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('货号'),
          prop: 'artNo',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('manual_order_sales_unit_price'),
          prop: 'productPriceOriginal',
          show: true,
          align: 'right',
          minWidth: 124
        },
        {
          label: this.$t('促销优惠金额'),
          prop: 'amountSharePromotion',
          show: true,
          align: 'right',
          minWidth: 124
        },
        {
          label: this.$t('优惠劵/码优惠金额'),
          prop: 'amountShareCoupon',
          show: true,
          align: 'right',
          minWidth: 124,
          formatter(row, column) {
            return (parseFloat(row.amountShareCoupon == null ? 0 : row.amountShareCoupon) + parseFloat(row.orderReferralAmount == null ? 0 : row.orderReferralAmount)).toFixed(2)
          }
        },
        {
          label: this.$t('freight'),
          prop: 'amountShareDeliveryFee',
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
          label: this.$t('purchase_price'),
          prop: 'productPriceSale',
          show: true,
          align: 'right',
          minWidth: 124
        },
        {
          label: this.$t('purchase_quantity'),
          prop: 'productItemNum',
          show: true,
          align: 'right',
          minWidth: 124
        },
        {
          label: this.$t('purchase_amount'),
          prop: 'productItemAmount',
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
      orderCreateTimeRange: [],
      orderPaymentConfirmDateRange: [],
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
      this.initCodes()
      this._listOrderTypeList(this)
      this.search()
    },
    async initCodes() {
    },
    _listOrderTypeList(vm) {
      vm.$finance.$api.common.soTypeList({}).then((result) => {
        vm.orderTypeList = result.data
        vm.orderTypeMap = result.data.reduce((m, i) => { m[i.code] = i.name; return m }, {})
      })
    },
    search() {
      this.loading = true

      this.handleFilters()
      const args = { filters: this.filters, ...this.page }
      this.$finance.$api.finSoItem.listPage(args).then(
        res => {
          this.loading = false
          this.list = res.data
          this.list.forEach(item => {
            if (!item.pmGiftCardAmount) {
              item.pmGiftCardAmount = 0
            }
            if (!item.spuCode) {
              item.spuCode = item.code
            }
          })
          this.total = res.total
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
      this.filters = {}
      this.orderCreateTimeRange = []
      this.$refs.orderCreateTime.setDefault(7)
      this.orderPaymentConfirmDateRange = []
      this.$refs.orderPaymentConfirmDate.setDefault(7)
    },
    add() {
      this.$router.push({
        name: 'FinSoItemAdd',
        query: {
          readonly: false
        }
      })
    },
    async delete(row) {
      const confirm = await this.$confirm(
        this.$t('是否删除当前') + this.$t('销售订单明细'),
        this.$t('common_prompt')
      )
      if (confirm) {
        const ids = []
        ids.push(row.id)
        const result = await this.$finance.$api.finSoItem.delete(
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
