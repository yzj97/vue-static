<template>
  <section class="pg-soError-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('order_code') + ':'" prop="orderCode">
            <el-input v-model="searchForm.orderCode" name="searchForm_orderCode" maxlength="25" />
          </ody-search-item>
          <ody-search-item :label="$t('orderCreateUsername') + ':'" prop="userName">
            <el-input v-model="searchForm.userName" name="searchForm_userName" maxlength="25" />
          </ody-search-item>
          <ody-search-item :label="$t('manual_order_receiver_name') + ':'" prop="goodReceiverName">
            <el-input v-model="searchForm.goodReceiverName" name="searchForm_goodReceiverName" maxlength="25" />
          </ody-search-item>
          <ody-search-item :label="$t('manual_order_receiver_mobile') + ':'" prop="goodReceiverMobile">
            <el-input v-model="searchForm.goodReceiverMobile" name="searchForm_goodReceiverMobile" maxlength="25" />
          </ody-search-item>
          <ody-search-item :label="$t('audit_status') + ':'" prop="status">
            <el-select
              v-model="searchForm.status"
              :disabled="statusReadonly"
              :placeholder="$t('common_all')"
              name="searchForm_status"
            >
              <el-option
                v-for="item in auditStatus"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('order_status') + ':'" prop="orderStatus">
            <el-select v-model="searchForm.orderStatus" :placeholder="$t('common_all')" name="searchForm_orderStatus">
              <el-option
                v-for="item in orderStatus"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('so_error_time') + ':'" :space="2" class="register" prop="auditCreateTime">
            <ody-date-range-picker
              v-model="searchForm.auditCreateTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="searchForm_auditCreateTime"
              value-format="yyyy-MM-dd"
              type="datetimer"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :label="$t('do_order_type') + ':'" prop="orderType">
            <el-select v-model="searchForm.orderType" :placeholder="$t('common_all')" name="searchForm_orderType">
              <el-option
                v-for="item in orderType"
                :label="item.name"
                :key="item.id"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('order_approve_rule_reason') + ':'" prop="reason">
            <el-select v-model="searchForm.reason" :placeholder="$t('common_all')" name="searchForm_reason">
              <el-option
                v-for="item in reason"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('order_date') + ':'" :space="2" class="register" prop="orderCreateTime">
            <ody-date-range-picker
              v-model="searchForm.orderCreateTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="searchForm_orderCreateTime"
              value-format="yyyy-MM-dd"
              type="datetimer"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :label="$t('manual_order_order_syssource') + ':'" prop="sysSource">
            <el-select v-model="searchForm.sysSource" :placeholder="$t('common_all')" name="searchForm_sysSource">
              <el-option
                v-for="item in sysSource"
                :label="item.channelName"
                :key="item.channelCode"
                :value="item.channelCode"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('do_merchant_name') + ':'" prop="merchantId">
            <el-select
              v-model="searchForm.merchantId"
              :placeholder="$t('common_all')"
              :popper-append-to-body="false"
              name="searchForm_merchantId"
              @change="_getSource"
            >
              <el-option
                v-for="item in merchants"
                :label="item.merchantName"
                :key="item.merchantId"
                :value="item.merchantId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('auditTime') + ':'" :space="2" class="register" prop="auditTime">
            <ody-date-range-picker
              v-model="searchForm.auditTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="searchForm_auditTime"
              value-format="yyyy-MM-dd"
              type="datetimer"
              range-separator="-"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button name="OmsSoAuditList_Reset_handleSearchReset" code="OmsSoAuditList_Reset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</ody-button>
        <ody-button
          name="OmsSoAuditList_Query_handleSearchSubmit"
          code="OmsSoAuditList_Query"
          size="small"
          type="primary"
          @click="handleSearchSubmit"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" @tab-click="chooseTab">
          <el-tab-pane :label="$t('common_all')" />
          <el-tab-pane v-for="tab in auditStatus" :label="tab.name" :key="tab.code" />
        </el-tabs>
        <div slot="btn">
          <ody-button
            v-if="!enableAppdflow"
            :disabled="checked.length == 0"
            name="OmsSoAuditList_Audit_auditPass"
            code="OmsSoAuditList_Audit"
            size="small"
            @click="auditPass()"
          >{{ $t('batchAudit') }}</ody-button>
        </div>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :multiple="multiple"
          :checked.sync="checked"
          name="list336"
        />
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

    <ody-dialog :visible.sync="dialogFormVisible" :title="$t('orderAuditResult')" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item :label="$t('orderAuditResult')">
          <el-radio-group v-model="reviewData.status" name="reviewData_status">
            <el-radio
              v-for="item in auditStatusPassOrNot"
              :key="item.code"
              :label="item.code"
            >{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="reviewData.status == '3' ">
          <el-input :rows="2" v-model="reviewData.remark" :placeholder="$t('请输入内容')" name="reviewData_remark" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="dialogFormVisible" size="small" @click="dialogFormVisible = false">{{ $t('common_cancel') }}</el-button>
        <el-button name="reviewSubmit" size="small" type="primary" @click="reviewSubmit">{{ $t('common_confirm') }}</el-button>
      </div>
    </ody-dialog>
  </section>
</template>

<script>
import ToOrderDetail from '@/components/so/toDetail'

export default {
  name: 'OmsSoAuditList',
  components: {
    ToOrderDetail
  },
  data() {
    return {
      enableAppdflow: false,
      dialogFormVisible: false,
      statusReadonly: false,
      reviewData: {
        ids: [],
        status: '',
        remark: ''
      },
      checked: [],
      merchants: [],
      statusList: [
        { code: 0, name: 'so_error_need_handle' },
        { code: 1, name: 'so_error_handled' }
      ],
      typeList: [],
      searchForm: getDefaultSearchForm(),
      loading: false,
      multiple: true,
      sysSource: [],
      activeState: '',
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },

      columns: [
        {
          show: true,
          prop: 'orderCode',
          label: this.$t('orderCode'),
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            return (
              <ToOrderDetail order-code={params.row.orderCode}>
                <span>{params.row.orderCode}</span>
              </ToOrderDetail>
            )
          }
        },
        {
          show: true,
          prop: 'orderType',
          label: this.$t('order_ports_type'),
          align: 'center',
          minWidth: 88,
          render: (h, params) => {
            var str = this.orderTypeMap[params.row.orderType]
            return <span>{str}</span>
          }
        },
        {
          show: true,
          prop: 'userName',
          label: this.$t('orderCreateUsername'),
          align: 'center'
        },
        {
          show: true,
          prop: 'orderTotalAmount',
          label: this.$t('orderAmount'),
          align: 'center',
          minWidth: 88,
          render: (h, params) => {
            var orderAmount = params.row.orderAmount
            var orderDeliveryFee = params.row.orderDeliveryFee
            var taxAmount = params.row.taxAmount
            var orderTotalAmount =
              (orderAmount || 0) + (taxAmount || 0) + (orderDeliveryFee || 0)
            orderTotalAmount = Number(orderTotalAmount).toFixed(2)
            return <span>{orderTotalAmount}</span>
          }
        },
        {
          show: true,
          prop: 'orderStatusStr',
          label: this.$t('order_status'),
          align: 'center'
        },
        {
          show: true,
          prop: 'orderCreateTime',
          label: this.$t('order_date'),
          align: 'center'
        },
        {
          show: true,
          prop: 'orderRemarkUser',
          label: this.$t('买家备注'),
          align: 'center'
        },
        {
          show: true,
          prop: 'orderRemarkMerchant2user',
          label: this.$t('商家备注')
        },
        {
          show: true,
          prop: 'auditCreateTime',
          label: this.$t('so_error_time'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'reasonStr',
          label: this.$t('order_approve_rule_reason'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'statusStr',
          label: this.$t('audit_status'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'auditTime',
          label: this.$t('auditTime'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'remark',
          label: this.$t('orderAuditRemark'),
          align: 'center',
          render: (h, params) => {
            if (params.row.remark) {
              return (
                <el-tooltip
                  class='item'
                  effect='dark'
                  content={params.row.remark}
                  placement='left-start'
                >
                  <span>{params.row.remark}</span>
                </el-tooltip>
              )
            }
            return ''
          }
        }
      ],
      operates: {
        align: 'center',
        fixed: 'right',
        list: [
          {
            label: this.$t('common_review'),
            hidden: (index, row) => {
              if (row.status !== 1 || row.orderStatus === '9000' || this.$portal.enableAppdflow('so', row.merchantId)) {
                return true
              } else {
                return false
              }
            },
            method: (index, row) => {
              this.auditPass(row)
            },
            code: 'OmsSoAuditList_Audit'
          }
        ]
      }
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
    auditPass(row) {
      this.reviewData.ids = []
      this.reviewData.status = '2'
      this.reviewData.remark = ''
      if (row) {
        this.reviewData.ids.push(row.id)
      } else if (this.checked) {
        for (let i = 0; i < this.checked.length; i++) {
          if (this.checked[i].status !== 1) {
            this.$message({
              type: 'warning',
              message: this.$t('errorAuditData')
            })
            return
          }
          this.reviewData.ids.push(this.checked[i].id)
        }
      }
      this.dialogFormVisible = true
    },
    reviewSubmit() {
      const vue = this
      this.$oms.$api.soAudit.orderAuditReview(vue.reviewData).then(data => {
        this.dialogFormVisible = false
        this.updateList()
      })
    },
    handleOk() {
      this.updateList()
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
    handleSearchReset() {
      var status = this.searchForm.status
      this.sysSource = []
      this.searchForm = getDefaultSearchForm()
      if (this.activeState !== '0') {
        this.searchForm.status = status
      }
    },
    async handlePageSizeChange(size) {
      this.handleSearchSubmit()
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    chooseTab() {
      if (this.activeState === '0') {
        this.searchForm.status = undefined
        this.statusReadonly = false
      } else {
        this.searchForm.status = this.activeState
        this.statusReadonly = true // 不可更改状态
      }
      this.checked = []
      this.updateList()
    },
    _initMerchants() {
      const vue = this
      this.$oms.$api.common
        .merchantList({ currentPage: 1, itemsPerPage: 1000 })
        .then(data => {
          vue.merchants = data.data.listObj
        })
    },
    _initCodes() {
      const vue = this
      this.$oms.$api.common
        .listByCategorysForOrder({
          categorys: ['AUDIT_STATUS', 'ORDER_STATUS', 'audit_reason']
        })
        .then(data => {
          if (data.code === '0') {
            vue.orderStatus = data.data.ORDER_STATUS
            vue.reason = data.data.audit_reason
            vue.auditStatus = data.data.AUDIT_STATUS
            vue.auditStatusPassOrNot = []
            // 把审核通过和不通过拿出来
            vue.auditStatus.forEach(element => {
              if (element.code !== '1') {
                vue.auditStatusPassOrNot.push(element)
              }
            })
          }
        })
      vue.$oms.$api.common.getBooleanSwitcher({ key: 'appdflow.switch' }).then(res => {
        vue.enableAppdflow = res.data
      })
    },
    _initSoTypesAndLoad() {
      const vue = this
      this.$oms.$api.soType.soTypeList({}).then(data => {
        if (data.code === '0') {
          vue.orderType = data.data
          vue.orderTypeMap = data.data.reduce((m, i) => {
            m[i['code']] = i['name']
            return m
          }, {})
        }
      })
    },
    _getSource() {
      const vue = this
      if (
        !vue.searchForm.merchantId ||
        typeof vue.searchForm.merchantId === 'undefined'
      ) {
        vue.sysSource = []
        return
      }
      this.$oms.$api.common
        .merchantManageChannel({ merchantId: vue.searchForm.merchantId })
        .then(data => {
          if (data.code === '0') {
            vue.sysSource = data.data
          }
        })
      console.log(vue.orderSysSourceList)
    },
    init() {
      this._initCodes()
      this._initSoTypesAndLoad()
      this._initMerchants()
      this.updateList()
    }
  }
}
function getFilters(vue) {
  const filters = JSON.parse(JSON.stringify(vue.searchForm))
  if (filters.auditCreateTime) {
    filters.startAuditCreateTime = filters.auditCreateTime[0]
    filters.endAuditCreateTime = filters.auditCreateTime[1]
    delete filters.auditCreateTime
  }
  if (filters.orderCreateTime) {
    filters.startOrderCreateTime = filters.orderCreateTime[0]
    filters.endOrderCreateTime = filters.orderCreateTime[1]
    delete filters.orderCreateTime
  }
  if (filters.auditTime) {
    filters.startAuditTime = filters.auditTime[0]
    filters.endAuditTime = filters.auditTime[1]
    delete filters.auditTime
  }
  return filters
}

async function loadList(vue) {
  const param = {
    filters: getFilters(vue),
    limit: vue.page.size,
    page: vue.page.current
  }
  const soAudit = vue.$oms.$api.soAudit

  const res = await soAudit.orderAuditListPage(param)
  if (res) {
    const data = res.data
    vue.list = data
    vue.page.total = res.total
  }
}

function getDefaultSearchForm() {
  return Object.assign({}, {})
}
</script>

<style lang="scss" scoped>
/deep/ .cp-list-search-area{
  height: 330px !important;
}
</style>
