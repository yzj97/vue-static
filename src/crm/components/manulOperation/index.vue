<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form
            ref="form"
            :model="searchForm"
            label-width="100px"
            class="form"
          >
            <ody-search-item
              :label="$t('手机号:')"
              :rules="[
                {
                  pattern: /^1[23456789]\d{9}$/,
                  message: this.$t('手机号码有误，请重填'),
                  trigger: 'change'
                }
              ]"
              type="text"
              prop="mobile"
            >
              <el-input
                v-model="searchForm.mobile"
                name="searchForm_entityId"
              />
            </ody-search-item>
            <ody-search-item
              :label="$t('运营人员:')"
              class="register"
              prop="createUsername"
            >
              <el-input
                v-model="searchForm.createUsername"
                name="searchForm_createUsername"
                type="text"
              />
            </ody-search-item>
            <ody-search-item
              :label="$t('作业类型:')"
              type="text"
              prop="processType"
            >
              <el-select
                v-model="searchForm.processType"
                name="searchForm_processType"
              >
                <el-option
                  v-for="item in growthType"
                  :label="item.name"
                  :key="item.code"
                  :value="item.code"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item
              :label="$t('operation_time') + ':'"
              :space="2"
              type="text"
              prop="data"
            >
              <ody-date-range-picker
                :start-placeholder="$t('startDate')"
                :end-placeholder="$t('endDate')"
                v-model="searchForm.data"
                name="searchForm_data"
                type="date"
              />
            </ody-search-item>
            <ody-search-item
              :label="$t('作业状态:')"
              type="text"
              prop="auditStatus"
            >
              <el-select
                v-model="searchForm.auditStatus"
                name="searchForm_auditStatus"
              >
                <el-option
                  v-for="item in auditStatusList"
                  :label="item.name"
                  :key="item.code"
                  :value="item.code"
                />
              </el-select>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button
            name="handleSearchReset"
            size="small"
            @click="handleSearchReset"
          >{{ $t("reset") }}</el-button
          >
          <ody-button
            :code="
              type === 2 ? 'GrowthManualOperationQuery' : 'ManualOperationQuery'
            "
            name="handleSearchSubmit"
            size="small"
            type="primary"
            @click="handleSearchSubmit"
          >{{ $t("query") }}</ody-button
          >
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="tabs" style="display:flex">
          <div>
            <add-modal
              :type="type"
              :code="
                type === 2
                  ? 'GrowthManualOperationAdd'
                  : 'ManualOperationAddPoint'
              "
              :title="$t('新增人工作业')"
              :ok="updateList"
            />
          </div>
          <div slot="btn-bottom">
            <ody-button
              :disabled="table.checked.length == 0"
              :code="
                type === 2
                  ? 'GrowthManualOperationBatchAudit'
                  : 'ManualOperationBatchAudit'
              "
              name="batchAudit"
              size="small"
              type="primary"
              class="batch-audit"
              @click="batchAudit()"
            >{{ $t("批量审核") }}</ody-button
            >
            <ody-batch-import-button
              v-if="type === 1"
              :import-api="importModel.importApi"
              :import-label="importModel.importLabel"
              :download-local-file="importModel.downloadLocalFile"
              :async="importModel.async"
              :pool="importModel.pool"
              :task-type="importModel.taskType"
              name="accountManualWorkImportCode"
              code="accountManualWorkImportCode"
              size="small"
              class="batch-import"
            >{{ $t("batch_import") }}</ody-batch-import-button
            >
            <el-popover
              v-if="type === 1"
              placement="bottom"
              with="160"
              trigger="hover"
            >
              <div class="btn-popover">
                <ody-import-task-button
                  pool="crm"
                  task-type="accountManualWorkImport"
                  name="accounting_unit_info_seeImportTask"
                  code="accountManualWorkImportTaskCode"
                  size="small"
                >{{ $t("seeImportTask") }}</ody-import-task-button
                >
              </div>
              <el-button slot="reference" size="small">
                {{ $t("seeTask") }}
                <i class="el-icon-arrow-down" />
              </el-button>
            </el-popover>
          </div>
        </div>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="manualOperationList"
            :checked.sync="table.checked"
            :multiple="true"
            :columns="table.columns"
            :index="true"
            :operates="table.operates"
            name="manualOperationList193"
          />
        </div>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page.sync="page.current"
              :list="manualOperationList"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="page.size"
              :total.sync="page.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handlePageSizeChange"
              @current-change="handlePageCurrentChange"
            />
          </div>
        </div>
      </ody-list-table-area>
      <AuditDialog
        :visible.sync="batchVisible"
        :ids.sync="ids"
        :type="type"
        @ok="handleSearchSubmit"
      />
    </section>
  </div>
</template>

<script>
import UserModal from '@/components/userModal'
import AddModal from '@/components/manulOperation/add'
import AuditDialog from '@/components/auditDialog'

console.log('111', require('@/excelFile/accountManualWorkImportTemplate.xlsx'))

export default {
  name: 'OuserCenterBalenceManualOperatio',
  components: {
    UserModal,
    AddModal,
    AuditDialog
  },
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      loading: false,
      isRemarkShow: false,
      showUserModal: false,
      channels: [],
      ids: [],
      opeReasonList: [],
      checked: [],
      batchVisible: false,
      growthType: [],
      auditStatusList: [],
      addManualOperation: {
        showDialog: false,
        form: {
          opeObj: null,
          changeAmount: null,
          channelCode: null,
          opeReason: null,
          opeObjs: [],
          growthType: this.type === 2 ? '10' : '8',
          remark: null
        }
      },
      manualOperationList: [],
      importModel: {
        importApi: [
          'crm-web',
          'userAccountManualWork',
          'accountManualWorkImport.do',
          {}
        ],
        importLabel: '导入积分人工作业',
        downloadLocalFile: [
          require('@/excelFile/accountManualWorkImportTemplate.xlsx')
        ],
        pool: 'crm',
        taskType: 'accountManualWorkImport',
        async: true
      },
      balance: [],
      searchForm: getDefaultSearchForm(),
      page: {
        size: 10,
        itemsPerPage: 10,
        current: 1,
        total: 0
      },
      table: {
        columns: [
          {
            show: true,
            prop: 'createUsername',
            label: this.$t('运营人员'),
            align: 'center',
            minWidth: 124
          },
          {
            show: true,
            prop: 'mobile',
            label: this.$t('手机号'),
            align: 'center',
            minWidth: 124
          },
          {
            show: true,
            prop: 'entityId',
            label: this.$t('操作用户ID'),
            align: 'center',
            minWidth: 200
          },
          {
            show: true,
            prop: 'processType',
            label: this.$t('作业类型'),
            align: 'center',
            minWidth: 124,
            formatter: (row, column, cellValue) => {
              if (row.processType === 10 || row.processType === 8) {
                return this.$t('发放')
              } else if (row.processType === 11 || row.processType === 9) {
                return this.$t('扣减')
              } else if (row.processType === 100) {
                return this.$t('会员改变等级增加成长值')
              } else if (row.processType === 101) {
                return this.$t('会员改变等级减少成长值')
              }
              return ''
            }
          },
          {
            show: true,
            prop: 'changeAmount',
            label:
              this.type === 2 ? this.$t('成长变动值') : this.$t('积分变动值'),
            align: 'center',
            minWidth: 124,
            formatter: (row, column, cellValue) => {
              if (
                row.processType === 10 ||
                row.processType === 8 ||
                row.processType === 100
              ) {
                return '+' + row.changeAmount
              } else if (
                row.processType === 11 ||
                row.processType === 9 ||
                row.processType === 101
              ) {
                return '-' + row.changeAmount
              }
              return ''
            }
          },
          {
            show: true,
            prop: 'channelCode',
            label: this.$t('channel'),
            align: 'center',
            minWidth: 124,
            formatter: (row, column, cellValue) => {
              if (row.channelCode) {
                if (row.channelCode !== '000000') {
                  return this.channels[row.channelCode].channelName
                } else if (row.channelCode === '000000') {
                  return this.$t('全渠道')
                }
              }
              return ''
            }
          },
          {
            show: true,
            prop: 'opeReason',
            label: this.$t('理由'),
            align: 'center',
            minWidth: 200
          },
          {
            show: true,
            prop: 'createTime',
            label: this.$t('operation_time'),
            align: 'center',
            minWidth: 200,
            formatter: (row, column, cellValue) => {
              if (row.createTime) {
                return this.$portal.parseTime(
                  row.createTime,
                  '{y}-{m}-{d} {h}:{i}:{s}'
                )
              }
              return ''
            }
          },
          {
            show: true,
            prop: 'auditStatusStr',
            label: this.$t('作业状态'),
            align: 'center',
            minWidth: 124
          }
        ],
        operates: {
          width: 88,
          align: 'left',
          list: [
            {
              label: this.$t('审核'),
              disabled: false,
              hidden: (index, row) => {
                return row.auditStatus !== 1
              },
              method: (index, row) => {
                this.audit(row)
              },
              code:
                this.type === 2
                  ? 'GrowthManualOperationAudit'
                  : 'ManualOperationAudit'
            }
          ]
        },
        checked: []
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
      this.ids = []
      this.table.checked = []
      try {
        const [err] = await this.formValidate('form')

        if (err) {
          return
        }
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.balance = []
      this.searchForm = getDefaultSearchForm()
    },
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    viewRule(row) {
      sessionStorage.setItem('user_point', JSON.stringify(row))
      sessionStorage.setItem('status', '')
      this.$router.push({
        name: 'OuserCenterPointsFlowDetail'
      })
    },
    queryChannelMap() {
      // 获取渠道
      this.$crm.$api.points.queryChannelMap({}).then(resp => {
        this.channels = resp.data
      })
    },
    queryCode() {
      this.auditStatusList = [
        { name: this.$t('待审核'), code: '1' },
        { name: this.$t('审核通过'), code: '2' },
        { name: this.$t('审核未通过'), code: '3' }
      ]
      const reasonKey =
        this.type === 2 ? 'GROWTH_JOB_REASON' : 'POINT_JOB_REASON'
      this.growthType =
        this.type === 2
          ? [
            { name: this.$t('发放'), code: '10' },
            { name: this.$t('扣减'), code: '11' },
            { name: this.$t('会员改变等级增加成长值'), code: '100' },
            { name: this.$t('会员改变等级减少成长值'), code: '101' }
          ]
          : [
            { name: this.$t('发放'), code: '8' },
            { name: this.$t('扣减'), code: '9' }
          ]
      const categorys = {
        categories: [reasonKey]
      }
      this.$crm.$api.userService.listMulti(categorys).then(resp => {
        this.opeReasonList = resp.data[reasonKey]
      })
    },
    audit(row) {
      if (row.auditStatus !== 1) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择待审核的记录')
        })
        return
      }
      const accountIdList = []
      accountIdList.push(row.id)
      this.ids = accountIdList
      this.batchVisible = true
    },
    // 批量审核
    batchAudit() {
      if (this.table.checked.length === 0) {
        return this.$message('请至少选择一条记录')
      }
      const ids = []
      if (this.table.checked && this.table.checked.length > 0) {
        for (let i = 0; i < this.table.checked.length; i++) {
          const item = this.table.checked[i]
          if (item.auditStatus === 1) {
            ids.push(item.id)
          } else {
            this.$message({
              type: 'warning',
              message: this.$t('请选择待审核的记录')
            })
            return
          }
        }
      }
      this.ids = ids
      this.batchVisible = true
    },
    init() {
      this.ids = []
      this.queryCode()
      this.queryChannelMap()
      this.updateList()
    }
  }
}

async function loadList(vue) {
  if (vue.searchForm.data) {
    vue.searchForm.param.startCreateTime = vue.searchForm.data[0]
    vue.searchForm.param.endCreateTime = vue.searchForm.data[1]
  }
  vue.searchForm.param.userId = vue.searchForm.userId
  vue.searchForm.param.mobile = vue.searchForm.mobile
  vue.searchForm.param.processType = vue.searchForm.processType
  vue.searchForm.param.createUsername = vue.searchForm.createUsername
  vue.searchForm.param.growthType = vue.searchForm.growthType
  vue.searchForm.param.auditStatus = vue.searchForm.auditStatus
  vue.searchForm.param.processTypeList =
    vue.type === 2 ? [10, 11, 100, 101] : [8, 9]
  const filters = JSON.parse(JSON.stringify(vue.searchForm.param))
  const param = {
    filters: filters,
    limit: vue.page.size,
    page: vue.page.current
  }
  const op = vue.$crm.$api.crmService.listPointLogPage(param)
  return op.then(res => {
    if (res.code === '0') {
      vue.page.total = res.total
      vue.manualOperationList = res.data
      vue.manualOperationList.forEach(i => {
        const { channelCode: channelCode, opeReason: opeReason } = JSON.parse(
          i.changeDetail
        )
        i.channelCode = channelCode
        i.opeReason = opeReason
      })
    }
  })
}
function getDefaultSearchForm() {
  return Object.assign(
    {},
    {
      userId: null,
      createUsername: null,
      growthType: null,
      auditStatus: null,
      data: [],
      param: {}
    }
  )
}
</script>
<style scoped>
.batch-audit{
  margin-left:16px;
  margin-right:16px;
}
.batch-import{
  margin-right:16px;
}
</style>
