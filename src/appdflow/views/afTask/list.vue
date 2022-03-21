<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('审批任务编号:')" :space="1">
            <el-input v-model="filters.auditTaskId" :placeholder="$t('请输入') + $t('审批任务编号')" name="searchForm_filters_auditTaskId"/>
          </ody-search-item>
          <ody-search-item>
            <span slot="label">
              <el-select v-model="filters.typeCode" name="searchForm_filters_typeCode" class="search-select">
                <el-option
                  v-for="item in typeCodeList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"/>
              </el-select>
            </span>
            <el-input v-model="filters.bizCode" :placeholder="$t('请输入') + $t('业务单据编码')" name="searchForm_filters_bizCode"/>
          </ody-search-item>
          <ody-search-item :label="$t('商家:')" :space="1">
            <ody-merchant-select ref="merchantId" :placeholder="$t('全部')" v-model="filters.merchantId" value-key="merchantId" name="merchantId"/>
          </ody-search-item>
          <ody-search-item :label="$t('审核状态:')" :space="1">
            <el-select v-model="filters.auditStatus" :placeholder="$t('全部')" :disabled="auditStatusReadonly" name="searchForm_filters_auditStatus">
              <el-option
                v-for="item in auditStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('申请人:')" :space="1">
            <el-input v-model="filters.applyUsername" :placeholder="$t('请输入') + $t('申请人')" name="searchForm_filters_applyUsername"/>
          </ody-search-item>
          <ody-search-item :label="$t('申请时间:')">
            <ody-date-range-picker ref="applyTimeRange" v-model="applyTimeRange" :default="30" name="searchForm_filters_applyTime" type="datetimer" />
          </ody-search-item>
          <ody-search-item :label="$t('审批时间:')">
            <ody-date-range-picker ref="auditTimeRange" v-model="auditTimeRange" name="searchForm_filters_auditTime" type="datetimer" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="AfTask_listPage_search"
          code="AfTask_listPage"
          size="small"
          type="primary"
          @click="search"
        >{{ $t('common_select') }}
        </ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeAuditStatus" name="activeAuditStatus" @tab-click="clickAuditStatusTab">
          <el-tab-pane v-for="tab in tabs" :label="$t(tab.heading) + (tab.total ? ('(' + tab.total + ')') : '')" :key="tab.index"/>
        </el-tabs>
      </div>
      <div slot="btn-bottom">
        <ody-button
          name="AfTask_batchAudit"
          code="AfTask_batchAudit"
          size="small"
          @click="batchAudit"
        >{{ $t('批量审核通过') }}
        </ody-button>
        <ody-button
          name="AfTask_batchReject"
          code="AfTask_batchReject"
          size="small"
          @click="batchReject"
        >{{ $t('批量审核不通过') }}
        </ody-button>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :checked.sync="checked"
          :multiple="true"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="true"
          :selectable="getSelectable"
          name="afTaskTable"
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
    <audit-dialog :visible.sync="auditDialogVisible" :audit-id-list="auditDialogTaskIdList" :audit-status="auditDialogStatus" @ok="auditDialogTaskOk"/>
  </section>
</template>
<script>
import AuditDialog from '@/components/EditorAuditDialog/AuditDialog'

export default {
  name: 'AppdflowTaskList',
  components: {
    AuditDialog
  },
  data() {
    const self = this
    return {
      form: {
        code: '',
        typeCode: '',
        bizCode: '',
        merchantId: null,
        auditStatus: null,
        applyUsername: ''
      },
      auditDialogVisible: false,
      auditDialogTaskIdList: null,
      auditDialogStatus: null,
      auditStatusReadonly: false,
      auditStatusList: [
        {
          value: 1,
          label: this.$t('待审批')
        },
        {
          value: 2,
          label: this.$t('审批通过')
        },
        {
          value: 3,
          label: this.$t('审批不通过')
        }
      ],
      typeCodeList: [],
      applyTimeRange: [],
      auditTimeRange: [],
      activeAuditStatus: '0',
      tabs: [
        {
          heading: '全部',
          index: '0',
          total: '',
          auditStatus: null
        },
        {
          heading: '待审批',
          index: '1',
          total: '',
          auditStatus: 1
        },
        {
          heading: '审批通过',
          index: '2',
          total: '',
          auditStatus: 2
        },
        {
          heading: '审批不通过',
          index: '3',
          total: '',
          auditStatus: 3
        }
      ],
      checked: [],
      loading: false,
      list: [],
      columns: [
        {
          label: this.$t('审批任务编号'),
          prop: 'auditTaskId',
          show: true,
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            const toDetail = self.goDetail
            return (
              <el-link underline='true' type='primary' title={params.row.auditTaskId} on-click={(e) => toDetail(params.row.code, params.row.auditTaskId)}>{params.row.auditTaskId}</el-link>
            )
          }
        },
        {
          label: this.$t('申请人'),
          prop: 'applyUsername',
          show: true,
          align: 'center',
          minWidth: 88
        },
        {
          label: this.$t('商家'),
          prop: 'merchantName',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('approval_type_code'),
          prop: 'typeName',
          show: true,
          align: 'center',
          minWidth: 88
        },
        {
          label: this.$t('业务单据编码'),
          prop: 'bizCode',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('审核状态'),
          prop: 'auditStatus',
          show: true,
          align: 'center',
          minWidth: 88,
          formatter: (row, column, cellValue) => {
            if (row.auditStatus) {
              for (let i = 0; i < this.auditStatusList.length; i++) {
                if (this.auditStatusList[i].value === row.auditStatus) {
                  return this.auditStatusList[i].label
                }
              }
            }
            return this.$t('未知')
          }
        },
        {
          label: this.$t('申请时间'),
          prop: 'applyTime',
          show: true,
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.applyTime) {
              return this.$portal.parseTime(
                row.applyTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        },
        {
          label: this.$t('当前账号审批时间'),
          prop: 'auditTime',
          show: true,
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.auditTime) {
              return this.$portal.parseTime(
                row.auditTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        },
        {
          label: this.$t('单据审批完成时间'),
          prop: 'updateTime',
          show: true,
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if ((row.status === 2 || row.status === 3) && row.updateTime) {
              return this.$portal.parseTime(
                row.updateTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        list: [
          {
            label: this.$t('审批'),
            code: 'AfTask_audit',
            hidden: (index, row) => {
              return !(row.status === 1 && row.auditStatus === 1)
            },
            method: (index, row) => {
              this.audit(row)
            }
          }
        ]
      },
      filters: this.initFilters(),
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
    this.search()
  },
  methods: {
    async init() {
      await this.initTypeCode()
      await this.search()
    },
    async search() {
      this.loading = true
      this.handleFilters()
      try {
        const args = { filters: this.formHasValue(this.filters), ...this.page }
        const res = await this.$appdflow.$api.afTask.listPage(args)
        this.list = res.data
        this.total = res.total
        const countArgs = { filters: this.formHasValue(this.filters) }
        countArgs.filters.auditStatus = null
        this.activeAuditStatus = (this.filters.auditStatus === '' || this.filters.auditStatus === null) ? '0' : (this.filters.auditStatus + '')
        this.$appdflow.$api.afTask.countByAuditStatus(countArgs).then(
          res => {
            let total = 0
            const countMap = res.data.reduce((m, i) => {
              m[i.auditStatus] = i.count
              total += i.count
              return m
            }, {})
            for (let i = 0; i < this.tabs.length; i++) {
              const tab = this.tabs[i]
              if (tab.index === '0') {
                tab.total = total
              } else {
                tab.total = countMap[tab.auditStatus]
              }
            }
          })
      } finally {
        this.loading = false
      }
    },
    handleFilters() {
      if (this.applyTimeRange && this.applyTimeRange.length > 1) {
        this.filters.startApplyTime = this.applyTimeRange[0]
        this.filters.endApplyTime = this.applyTimeRange[1]
      } else {
        delete this.filters.startApplyTime
        delete this.filters.endApplyTime
      }
      if (this.auditTimeRange && this.auditTimeRange.length > 1) {
        this.filters.startAuditTime = this.auditTimeRange[0]
        this.filters.endAuditTime = this.auditTimeRange[1]
      } else {
        delete this.filters.startAuditTime
        delete this.filters.endAuditTime
      }
    },
    reset() {
      this.checked = []
      this.filters = this.initFilters()
      this.applyTimeRange = []
      this.$refs.applyTimeRange.setDefault(30)
      this.auditTimeRange = []
    },
    async initTypeCode() {
      const res = await this.$appdflow.$api.afTypeConfig.list({})
      this.typeCodeList = res.data
      this.typeCodeMap = this.typeCodeList.reduce((m, i) => {
        m[i.code] = i.name
        return m
      }, {})
      this.setTypeCode()
    },
    setTypeCode() {
      let typeCode = ''
      if (this.typeCodeList) {
        typeCode = this.typeCodeList[0].code
      }
      if (this.filters) {
        this.filters.typeCode = typeCode
      }
      return typeCode
    },
    async audit(row) {
      this.auditDialogVisible = true
      this.auditDialogTaskIdList = [row.auditTaskId]
      this.auditDialogStatus = 2
    },
    async batchAudit() {
      if (this.checked.length === 0) {
        return this.$message(this.$t('至少选择一条数据'))
      }
      this.auditDialogVisible = true
      this.auditDialogTaskIdList = this.checked.map(x => x['auditTaskId'])
      this.auditDialogStatus = 2
    },
    async batchReject() {
      if (this.checked.length === 0) {
        return this.$message(this.$t('至少选择一条数据'))
      }
      this.auditDialogVisible = true
      this.auditDialogTaskIdList = this.checked.map(x => x['auditTaskId'])
      this.auditDialogStatus = 3
    },
    clickAuditStatusTab() {
      if (this.activeAuditStatus === '0') {
        this.filters.auditStatus = null
        this.auditStatusReadonly = false
      } else {
        const tab = this.tabs[this.activeAuditStatus]
        if (tab) {
          this.filters.auditStatus = tab.auditStatus
          this.auditStatusReadonly = true
        }
      }
      this.search()
    },
    auditDialogTaskOk() {
      if (this.auditDialogTaskIdList) {
        this.auditDialogTaskIdList = []
        this.auditDialogStatus = null
        this.checked = []
      }
      this.search()
    },
    getSelectable(row) {
      return row.status === 1 && row.auditStatus === 1
    },
    goDetail(code, auditTaskId) {
      this.$router.push({
        name: 'AppdflowTaskDetail',
        params: { taskCode: code, auditTaskId: auditTaskId }
      })
    },
    initFilters() {
      return {
        auditTaskId: '',
        typeCode: this.setTypeCode(),
        bizCode: '',
        merchantId: null,
        auditStatus: null,
        applyUsername: ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.search-select{
  position: absolute;
  width: 84px;
  left: 18px;
}
</style>
