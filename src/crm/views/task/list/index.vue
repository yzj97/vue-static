<template>
  <div class="pg-task-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" class="form">
          <ody-search-item :label="$t('任务名称:')" prop="taskName">
            <el-input v-model="search.taskName" name="search_taskName" maxlength="50"/>
          </ody-search-item>
          <ody-search-item :label="$t('任务创建人:')" prop="createUsername">
            <el-input v-model="search.createUsername" name="search_createUsername" maxlength="50"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="mktTask_listPage"
          size="small"
          type="primary"
          code="mktTask_listPage"
          @click.prevent="handleSubmit"
        >
          {{ $t('查询') }}
        </ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="status" :before-leave="handleTabsBeforeLeave" name="status" @tab-click="handleTabsClick">
          <el-tab-pane
            v-for="statusItem in statusList"
            :name="statusItem.name"
            :label="statusItem.label"
            :key="statusItem.name"
          />
        </el-tabs>
      </div>
      <div slot="btn-bottom">
        <ody-button id="mkt-task-add" name="mktTask_add_handleAddTask" code="mktTask_add" size="small" type="primary" @click="handleAddTask">
          {{ $t('新增任务') }}
        </ody-button>
      </div>
      <div slot="table">
        <ody-table
          id="task-list"
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          request-url="/crm-web/mktTask/listPage"
          request-page-type="page"
          @getTableList="handleGetTableList"
        >
          <template slot="id" slot-scope="scope">
            <el-button name="handleViewTask" type="text" size="small" @click="handleViewTask(scope.row)">
              {{ scope.row.id }}
            </el-button>
          </template>
          <template slot="createTime" slot-scope="scope">
            {{ scope.row.createTime | parseTime }}
          </template>
          <template slot="status" slot-scope="scope">
            {{ scope.row.status | keyVal(getStatusMap) }}
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>

    <crm-task-create-modal
      v-if="modal.taskCreate.visible"
      :visible.sync="modal.taskCreate.visible"
      :status-type="modal.taskCreate.statusType"
      :form="modal.taskCreate.form"
      @ok="query"/>

    <crm-task-report-modal
      v-if="modal.taskReport.visible"
      :visible.sync="modal.taskReport.visible"
      :task="modal.taskReport.task"
    />

    <crm-task-audit-modal
      v-if="modal.audit.visible"
      :visible.sync="modal.audit.visible"
      :id="modal.audit.id"
      @ok="query"
    />
    <ody-guide
      ref="taskListNoChild"
      :steps="stepsNoTask"
      guide-key="taskListNoChild"
      type="cssDriver"
    />
    <ody-guide
      ref="taskListHasChild"
      :steps="stepsHasTask"
      guide-key="taskListHasChild"
      type="cssDriver"/>
  </div>
</template>
<script>
import CrmTaskCreateModal from '@/components/task-create-modal'
import CrmTaskReportModal from '@/components/task-report-modal'
import CrmTaskAuditModal from '@/components/task-audit-modal'

export default {
  components: {
    CrmTaskCreateModal,
    CrmTaskReportModal,
    CrmTaskAuditModal
  },
  data() {
    return {
      tableData: [],
      stepsNoTask: [
        {
          element: '#mkt-task-add .el-table__fixed-body-wrapper',
          popover: {
            title: '新建任务',
            description: '点击【新增任务】，配置任务基础信息',
            position: 'bottom'
          }
        }
      ],
      stepsHasTask: [
        {
          element: '#task-list .el-table__fixed .el-table__fixed-body-wrapper tr:first-child td:first-child',
          popover: {
            title: '查看任务',
            description: '点击任务查看/编辑任务内容',
            position: 'bottom'
          }
        }
      ],
      search: {
        taskName: '',
        taskCreateUser: ''
      },
      status: '-1',
      table: {
        columns: [
          {
            label: this.$t('任务ID'),
            slot: 'id',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('任务名称'),
            prop: 'taskName',
            show: true,
            minWidth: 150
          },
          {
            label: this.$t('创建时间'),
            slot: 'createTime',
            minWidth: 150,
            show: true
          },
          {
            label: this.$t('创建人'),
            prop: 'createUsername',
            minWidth: 100,
            show: true
          },
          {
            label: this.$t('备注'),
            prop: 'taskNote',
            minWidth: 250,
            show: true
          },
          {
            label: this.$t('状态'),
            slot: 'status',
            minWidth: 74,
            show: true
          }
        ],
        operates: {
          width: 200,
          fixed: 'right',
          list: [
            {
              label: this.$t('查看'),
              code: 'mktTask_get',
              hidden: (index, row) => {
                const isDoing = row.status === 3
                const isEnded = row.status === 4
                const isClosed = row.status === 5
                // const isWaitSumbit = row.status === 0
                const isWaitAudit = row.status === 1
                // const isAuditFail = row.status === 2

                if (isDoing || isEnded || isClosed || isWaitAudit) {
                  return false
                }
                return true
              },
              method: (index, row) => {
                this.modal.taskCreate.statusType = 'view'
                this.modal.taskCreate.form = row
                this.modal.taskCreate.visible = true
              }
            },
            {
              label: this.$t('编辑'),
              code: 'mktTask_update',
              hidden: (index, row) => {
                // const isDoing = row.status === 3
                // const isEnded = row.status === 4
                // const isClosed = row.status === 5
                const isWaitSumbit = row.status === 0
                // const isWaitAudit = row.status === 1
                const isAuditFail = row.status === 2

                if (isWaitSumbit || isAuditFail) {
                  return false
                }
                return true
              },
              method: (index, row) => {
                // this.$router.push({ path: '/ouser-web/roleEdit/' + row.id })
                this.modal.taskCreate.statusType = 'edit'
                this.modal.taskCreate.form = row
                this.modal.taskCreate.visible = true
              }
            },
            {
              label: this.$t('任务统计'),
              code: 'mktTaskReport',
              hidden: (index, row) => {
                const isDoing = row.status === 3
                const isEnded = row.status === 4

                if (isEnded || isDoing) {
                  return false
                }
                return true
              },
              method: (index, row) => {
                this.modal.taskReport.visible = true
                this.modal.taskReport.task = row
              }
            },
            {
              label: this.$t('审核'),
              prop: 'audit',
              code: 'mktTask_audit',
              hidden: (index, row) => {
                // const isDoing = row.status === 3
                // const isEnded = row.status === 4
                // const isClosed = row.status === 5
                // const isWaitSumbit = row.status === 0
                const isWaitAudit = row.status === 1
                // const isAuditFail = row.status === 2

                if (isWaitAudit) {
                  return false
                }
                return true
              },
              method: (index, row) => {
                this.modal.audit.id = row.id
                this.modal.audit.visible = true
              }
            },
            {
              label: this.$t('提交审核'),
              code: 'mktTask_submitAudit',
              hidden: (index, row) => {
                // const isDoing = row.status === 3
                // const isEnded = row.status === 4
                // const isClosed = row.status === 5
                const isWaitSumbit = row.status === 0
                // const isWaitAudit = row.status === 1
                const isAuditFail = row.status === 2

                if (isWaitSumbit || isAuditFail) {
                  return false
                }
                return true
              },
              method: async(index, row) => {
                const res = await this.$confirm('确定提交审核吗?', this.$t('提示'), {
                  confirmButtonText: this.$t('确定'),
                  cancelButtonText: this.$t('取消'),
                  type: 'warning'
                })

                if (!res) {
                  return false
                }

                try {
                  await this.$crm.$api.mktTask.submitAudit({
                    id: row.id
                  })
                  this.$message({
                    message: this.$t('提交审核成功'),
                    type: 'success'
                  })
                  await this.query()
                } catch (ex) {
                  console.error(ex)
                }
              }
            },
            {
              label: this.$t('复制'),
              code: 'mktTask_copy',
              method: async(index, row) => {
                const res = await this.$confirm('确定复制吗?', this.$t('提示'), {
                  confirmButtonText: this.$t('确定'),
                  cancelButtonText: this.$t('取消'),
                  type: 'warning'
                })

                if (!res) {
                  return false
                }

                try {
                  await this.$crm.$api.mktTask.copy({
                    id: row.id
                  })

                  this.$message({
                    message: this.$t('复制成功'),
                    type: 'success'
                  })
                  await this.query()
                } catch (ex) {
                  console.error(ex)
                }
              }
            },
            {
              label: this.$t('关闭'),
              code: 'mktTask_close',
              hidden: (index, row) => {
                const isDoing = row.status === 3

                if (isDoing) {
                  return false
                }
                return true
              },
              method: async(index, row) => {
                const res = await this.$confirm('确定关闭吗?', this.$t('提示'), {
                  confirmButtonText: this.$t('确定'),
                  cancelButtonText: this.$t('取消'),
                  type: 'warning'
                })

                if (!res) {
                  return false
                }

                try {
                  await this.$crm.$api.mktTask.close({
                    id: row.id
                  })
                  this.$message({
                    message: this.$t('关闭成功'),
                    type: 'success'
                  })
                  await this.query()
                } catch (ex) {
                  console.error(ex)
                }
              }
            }
          ]
        }
      },
      statusList: [
        {
          name: '-1',
          label: this.$t('全部')
        },
        {
          name: '3',
          label: this.$t('进行中')
        },
        {
          name: '4',
          label: this.$t('已结束')
        },
        {
          name: '5',
          label: this.$t('已关闭')
        },
        {
          name: '0',
          label: this.$t('待提交')
        },
        {
          name: '1',
          label: this.$t('待审核')
        },
        {
          name: '2',
          label: this.$t('审核未通过')
        }
      ],
      loading: false,
      modal: {
        taskCreate: {
          visible: false,
          statusType: 'add',
          form: {}
        },
        taskReport: {
          visible: false,
          taskId: null
        },
        audit: {
          visible: false,
          id: null
        }
      }
    }
  },
  computed: {
    getStatusMap() {
      return this.statusList.reduce((rtv, item) => {
        rtv[item.name] = item.label
        return rtv
      }, {})
    }
  },
  watch: {
    tableData: {
      handler(newVal) {
        const noData = newVal.length === 0
        const hasData = newVal.length > 0

        // 页面加载完毕
        setTimeout(() => {
          // dom加载完毕
          this.$nextTick(() => {
            if (!this.$refs.taskListNoChild.isViewed() && noData) {
              this.$refs.taskListNoChild.start()
            } else if (!this.$refs.taskListHasChild.isViewed() && hasData) {
              this.$refs.taskListHasChild.start()
            }
          })
        }, 600)
      },
      immediate: true
    }
  },
  async mounted() {
    await this.query()
  },
  methods: {
    handleGetTableList(tableData) {
      this.tableData = tableData
    },
    async handleAuditCancel(row) {
      row.visible = false
    },
    handleViewTask(row) {
      this.$router.push({
        name: 'CrmTaskEditFlow',
        params: {
          id: row.id
        }
      })
    },
    handleAddTask() {
      this.modal.taskCreate.statusType = 'add'
      this.modal.taskCreate.id = -1
      this.modal.taskCreate.visible = true
    },
    handleTabsBeforeLeave() {
      return !this.loading
    },
    async handleTabsClick() {
      await this.query()
    },
    handleReset() {
      this.formReset('search')
    },
    async handleSubmit() {
      const [err] = await this.formValidate('search')

      if (err) {
        return
      }
      await this.query()
    },
    async query() {
      this.loading = true
      const { status } = this

      const res = await this.$refs.table.getList({
        'selectFields': ['id', 'taskName', 'status', 'taskType', 'taskNote', 'xml', 'nodeValues', 'createUsername', 'createTime', 'taskRules'],
        'filters': this.formHasValue({
          ...this.search,
          status
        })
      })

      this.loading = false
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
.pg-task-list {
  .dranger {
    color: red !important;
  }
  .success {
    color: green !important;
  }
}
</style>
