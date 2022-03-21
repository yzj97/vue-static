<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('提现单号') + ':'" prop="cashOutCode">
            <el-input v-model="search.cashOutCode" name="search_cashOutCode" />
          </ody-search-item>
          <ody-search-item :label="$t('手机号') + ':'" prop="mobile">
            <el-input v-model="search.mobile" name="search_mobile" />
          </ody-search-item>
          <ody-search-item :label="$t('付款渠道') + ':'" prop="receiptType">
            <el-select v-model="search.receiptType" :placeholder="$t('全部')" name="search_receiptType">
              <el-option
                v-for="item in receiptTypeList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('提现状态') + ':'" prop="auditStatus">
            <el-select v-model="search.auditStatus" :placeholder="$t('全部')" name="search_auditStatus">
              <el-option
                v-for="item in auditStatusList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('申请提现时间') + ':'" prop="createTime">
            <ody-date-range-picker
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              :default="0"
              v-model="search.createTime"
              range-separator="-"
              name="search_createTime"
              type="datetimer" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="FinanceCashOut01_handleQuery"
          size="small"
          code="FinanceCashOut01"
          type="primary"
          @click="handleQuery"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <!-- GJZT-1231: 不显示批量 -->
        <!-- <ody-button
          name="FinanceCashOut02_handleBatchAudit"
          size="small"
          code="FinanceCashOut02"
          type="primary"
          @click="handleBatchAudit"
        >{{ $t('批量审核') }}</ody-button>-->
        <ody-button
          name="FinanceCashOut03_handleExport"
          size="small"
          code="FinanceCashOut03"
          type="primary"
          @click="handleExport"
        >{{ $t('导出') }}</ody-button>
      </div>
      <div slot="table">
        <!-- :multiple="true" -->
        <ody-table
          :data="data"
          :columns="columns"
          :loading="loading"
          :checked.sync="checked"
          :selectable="checkedSelectable"
          :operates="operates"
          :can-filter="false"
          name="data558"
        >
          <template slot="orderCode" slot-scope="scope">
            <span style="white-space: pre-line">{{ scope.row.orderCode }}</span>
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="data"
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
    <audit-dialog :visible.sync="auditDialogVisible" :items.sync="items" @ok="handleQuery" />
  </div>
</template>

<script>
import AuditDialog from '@/components/cash-out-audit-dialog'

export default {
  name: 'FinanceCashOut',
  components: {
    AuditDialog
  },
  data() {
    return {
      loading: false,
      receiptTypeList: [],
      auditStatusList: [],
      cashOutType: [],
      cashOutTypeMap: {},
      auditDialogVisible: false,
      items: [],
      search: {
        cashOutCode: '',
        mobile: '',
        receiptType: '',
        auditStatus: '',
        createTime: []
      },
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      data: [],
      columns: [
        {
          label: this.$t('提现单号'),
          prop: 'cashOutCode',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('手机号'),
          prop: 'mobile',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('提现金额'),
          prop: 'cashAmount',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('手续费'),
          prop: 'poundage',
          show: true,
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            if (!row.poundage) {
              return 0
            } else {
              return row.poundage
            }
          }
        },
        {
          label: this.$t('提现状态'),
          prop: 'auditStatusStr',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('申请提现时间'),
          prop: 'createTimeStr',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('操作时间'),
          prop: 'auditTimeStr',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('common_operationUser'),
          prop: 'auditUsername',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('提现类型'),
          prop: 'typeStr',
          show: true,
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            if (row.typeStr) {
              return row.typeStr
            }
            return this.cashOutTypeMap[row.type]
          }
        },
        {
          label: this.$t('付款渠道'),
          prop: 'receiptTypeStr',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('付款流水号'),
          prop: 'serialNumber',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('支付宝账号'),
          prop: 'accountNo',
          show: true,
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            if (row.receiptType !== 3) {
              // 不是银行卡
              return row.accountNo
            } else {
              return ''
            }
          }
        },
        {
          label: this.$t('支付宝姓名'),
          prop: 'accountName',
          show: true,
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            if (row.receiptType !== 3) {
              // 不是银行卡
              return row.accountName
            } else {
              return ''
            }
          }
        },
        {
          label: this.$t('银行名称'),
          prop: 'bankName',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('银行卡号'),
          prop: 'accountNo',
          show: true,
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.receiptType === 3) {
              // 银行卡
              return row.accountNo
            } else {
              return ''
            }
          }
        },
        {
          label: this.$t('持卡人姓名'),
          prop: 'accountName',
          show: true,
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            if (row.receiptType === 3) {
              // 是银行卡
              return row.accountName
            } else {
              return ''
            }
          }
        },

        {
          label: this.$t('备注'),
          prop: 'remark',
          show: true,
          align: 'center',
          minWidth: 124
        }
      ],
      operates: {
        width: 124,
        fixed: 'right',
        align: 'center',
        list: [
          {
            label: this.$t('审核'),
            code: 'FinanceCashOut02',
            hidden: (index, row) => {
              return row.auditStatus !== 0
            },
            method: (index, row) => {
              this.handleAudit(row)
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.initCodes()
      this.handleQuery()
    },
    initCodes() {
      const vue = this
      this.$finance.$api.common
        .codeListMulti({
          categories: ['CASH_OUT_STATUS', 'DISTRIBUTOR_RECEIPT_CHANNEL', 'CASH_OUT_TYPE']
        })
        .then(res => {
          if (res.data.CASH_OUT_STATUS) {
            vue.auditStatusList = res.data.CASH_OUT_STATUS
          }
          if (res.data.DISTRIBUTOR_RECEIPT_CHANNEL) {
            vue.receiptTypeList = res.data.DISTRIBUTOR_RECEIPT_CHANNEL
          }
          if (res.data.CASH_OUT_TYPE) {
            vue.cashOutType = res.data.CASH_OUT_TYPE
            var codeMap = new Map()
            for (var i = 0; i < vue.cashOutType.length; i++) {
              var obj = vue.cashOutType[i]
              codeMap.set(obj.code, obj.name)
            }
            vue.cashOutTypeMap = codeMap
          }
        })
    },
    async handleQuery() {
      const vue = this
      vue.loading = true
      const params = {
        page: vue.page.current,
        limit: vue.page.size,
        filters: vue.$portal.deepClone(vue.search)
      }
      if (params.filters.createTime) {
        params.filters.startCreateTime =
          params.filters.createTime[0] + ' 00:00:01'
        params.filters.endCreateTime =
          params.filters.createTime[1] + ' 23:59:59'
        delete params.filters.createTime
      }

      try {
        const res = await vue.$finance.$api.cashOut.listPage(params)
        if (res.data) {
          vue.data = res.data
        } else {
          vue.data = []
        }
        vue.page.total = res.total
      } finally {
        vue.loading = false
      }
    },
    handleReset() {
      this.formReset('search')
    },
    handleExport() {
      const vue = this
      const params = vue.$portal.deepClone(vue.search)
      if (params.createTime) {
        params.startCreateTime = params.createTime[0] + ' 00:00:01'
        params.endCreateTime = params.createTime[1] + ' 23:59:59'
        delete params.createTime
      }
      const filters = JSON.parse(JSON.stringify(params))
      this.$portal.downloadFileByPost(
        '/api/back-finance-web/cashOut/export.do',
        filters
      )
    },
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
        await this.handleQuery()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.handleQuery()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleAudit(item) {
      const vue = this
      vue.items = []
      vue.items.push(item)
      vue.auditDialogVisible = true
    }
  }
}
</script>

<style scoped>
</style>
