<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('付款单号') + ':'" prop="code">
            <el-input v-model="search.code" name="search_code" />
          </ody-search-item>
          <ody-search-item :label="$t('手机号') + ':'" prop="mobile">
            <el-input v-model="search.mobile" name="search_mobile" />
          </ody-search-item>
          <ody-search-item :label="$t('付款状态') + ':'" prop="status">
            <el-select v-model="search.status" :placeholder="$t('全部')" name="search_status">
              <el-option
                v-for="item in statusList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
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
          <ody-search-item :label="$t('付款单类型') + ':'" prop="type">
            <el-select v-model="search.type" :placeholder="$t('全部')" name="search_type">
              <el-option
                v-for="item in typeList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('付款时间') + ':'" prop="createTime">
            <ody-date-range-picker
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              :default="0"
              v-model="search.createTime"
              name="search_createTime"
              range-separator="-"
              type="datetimer" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="FinanceCashOutRecords01_handleQuery"
          size="small"
          code="FinanceCashOutRecords01"
          type="primary"
          @click="handleQuery"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          name="FinanceCashOutRecords02_handleExport"
          size="small"
          code="FinanceCashOutRecords02"
          type="primary"
          @click="handleExport"
        >{{ $t('导出') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :data="data"
          :columns="columns"
          :loading="loading"
          :multiple="false"
          :operates="operates"
          :can-filter="false"
          name="data572"
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
  </div>
</template>

<script>
export default {
  name: 'FinanceCashOutRecords',
  data() {
    return {
      loading: false,
      receiptTypeList: [],
      statusList: [],
      typeList: [],
      search: {
        code: '',
        mobile: '',
        status: '',
        receiptType: '',
        type: '',
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
          label: this.$t('付款单号'),
          prop: 'code',
          show: true,
          align: 'center',
          minWidth: 180
        },
        {
          label: this.$t('付款时间'),
          prop: 'createTimeStr',
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
          label: this.$t('付款渠道'),
          prop: 'receiptTypeStr',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('付款金额'),
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
          label: this.$t('付款单类型'),
          prop: 'typeStr',
          show: true,
          align: 'center',
          minWidth: 124
        },
        {
          label: this.$t('付款状态'),
          prop: 'statusStr',
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
          label: this.$t('银行名称'),
          prop: 'bankName',
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
        }
      ],
      operates: {
        width: 124,
        fixed: 'right',
        align: 'center',
        list: [
          {
            label: this.$t('重新付款'),
            code: 'FinanceCashOutRecords03',
            hidden: (index, row) => {
              if (row.status !== 3) {
                return true
              }
              const time = new Date()
              time.setTime(time.getTime() - 24 * 60 * 60 * 1000 * 3)
              if (row.failureTime) {
                const failureTime = new Date(row.failureTime)
                if (failureTime < time) {
                  return true
                }
              }
              return false
            },
            method: (index, row) => {
              this.handleRepay(row)
            }
          },
          {
            label: this.$t('放弃'),
            code: 'FinanceCashOutRecords04',
            hidden: (index, row) => {
              return row.status !== 3
            },
            method: (index, row) => {
              this.handleGiveUp(row)
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
    async init() {
      await this.initCodes()
      this.handleQuery()
    },
    async initCodes() {
      const vue = this
      this.$finance.$api.common
        .codeListMulti({
          categories: [
            'CASH_OUT_RECORDS_STATUS',
            'DISTRIBUTOR_RECEIPT_CHANNEL',
            'CASH_OUT_TYPE'
          ]
        })
        .then(res => {
          if (res.data.CASH_OUT_RECORDS_STATUS) {
            vue.statusList = res.data.CASH_OUT_RECORDS_STATUS
          }
          if (res.data.DISTRIBUTOR_RECEIPT_CHANNEL) {
            vue.receiptTypeList = res.data.DISTRIBUTOR_RECEIPT_CHANNEL
          }
          if (res.data.CASH_OUT_TYPE) {
            vue.typeList = res.data.CASH_OUT_TYPE
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
        const res = await vue.$finance.$api.cashOut.listRecordsPage(params)
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
        '/api/back-finance-web/cashOutRecords/export.do',
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
    handleRepay(item) {
      const vue = this
      vue
        .$confirm(vue.$t('确定重新付款？'), vue.$t('提示'), {
          confirmButtonText: vue.$t('确定'),
          cancelButtonText: vue.$t('取消'),
          type: 'warning'
        })
        .then(() => {
          vue.$finance.$api.cashOut.repayRecords(item.id).then(res => {
            vue.$message.success(vue.$t('操作成功'))
            vue.handleQuery()
          })
        })
    },
    handleGiveUp(item) {
      const vue = this
      vue
        .$confirm(vue.$t('确定放弃付款？'), vue.$t('提示'), {
          confirmButtonText: vue.$t('确定'),
          cancelButtonText: vue.$t('取消'),
          type: 'warning'
        })
        .then(() => {
          vue.$finance.$api.cashOut.giveUpRecords(item.id).then(res => {
            vue.$message.success(vue.$t('操作成功'))
            vue.handleQuery()
          })
        })
    }
  }
}
</script>

<style scoped>
</style>
