<template>
  <ody-dialog
    :visible="visible"
    :title="$t('export_task_list')"
    width="960px"
    @open="open"
    @close="close"
  >
    <section class="pg-expressConfigSet-list">
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" :inline="true" class="demo-form-inline">
            <el-form-item :label="$t('operation_time')">
              <el-date-picker
                v-model="operateTime"
                :start-placeholder="$t('startDate')"
                :end-placeholder="$t('endDate')"
                name="operateTime"
                type="daterange"
                range-separator="~"
              />
            </el-form-item>
            <el-form-item :label="$t('taskCode')">
              <el-input v-model="id" name="id" maxlength="25" />
            </el-form-item>
            <el-form-item :label="$t('operation_people')">
              <el-input v-model="userName" name="userName" maxlength="25" />
            </el-form-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button
            name="handleSearchSubmit"
            size="small"
            type="primary"
            @click="handleSearchSubmit"
          >{{ $t('common_select') }}</el-button>
          <el-button
            name="handleSearchReset"
            size="small"
            @click="handleSearchReset"
          >{{ $t('common_reset') }}</el-button>
        </div>
      </ody-list-search-area>

      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="taskList"
            :columns="columns"
            :operates="operates"
            :multiple="false"
            :checked.sync="checked"
            :can-filter="false"
            name="taskList151"
            @custom-sort-change="hanleCustomSortChange"
            @selection-change="handleSelectionChange"
          />
        </div>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page.sync="currPage"
              :list="taskList"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="limit"
              :total.sync="total"
              layout="total, prev, pager, next, jumper"
              @size-change="handlePageSizeChange"
              @current-change="handlePageCurrentChange"
            />
          </div>
        </div>
      </ody-list-table-area>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button name="close" size="small" @click="close">{{ $t('common_cancel') }}</el-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      default: null
    },
    taskType: {
      type: String,
      required: true
    },
    taskActionType: {
      type: String,
      required: true
    },
    designColumns: {
      type: Array,
      default: null
    },
    designOperates: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      operateTime: null,
      id: null,
      userName: null,

      loading: false,
      taskTypeList: [],
      taskList: [],
      limit: 10,
      currPage: 1,
      total: 0,
      columns: [
        {
          show: true,
          prop: 'id',
          label: this.$t('taskCode'),
          align: 'left',
          minWidth: 90
        },
        {
          show: true,
          prop: 'taskTypeStr',
          label: this.$t('taskType'),
          align: 'left',
          minWidth: 70
        },
        {
          show: true,
          prop: 'createUsername',
          label: this.$t('operation_people'),
          align: 'left',
          minWidth: 70
        },
        {
          show: true,
          prop: 'taskActionTypeStr', // taskActionType,taskType
          label: this.$t('operation_type'),
          align: 'left',
          minWidth: 50
        },
        {
          show: true,
          prop: 'taskStatusStr', // taskStatus,...isDeleted: 0
          label: this.$t('taskStatus'),
          align: 'left',
          minWidth: 50
        },
        {
          show: true,
          prop: 'startTime', // taskStatus,...isDeleted: 0
          label: this.$t('taskStartTime'),
          align: 'left',
          minWidth: 90
        },
        {
          show: true,
          prop: 'finishTime', // taskStatus,...isDeleted: 0
          label: this.$t('taskFinishTime'),
          align: 'left',
          minWidth: 90
        }
      ],
      operates: {
        width: 60,
        align: 'right',
        list: [
          {
            label: this.$t('common_export'),
            hidden: (index, row) => {
              // 如果是导入任务状态 失败或者部分，导出任务状态成功，显示导出按钮
              return !(
                (row.taskActionType === 1 &&
                  (row.taskStatus === 3 || row.taskStatus === 6)) ||
                (row.taskActionType === 2 && row.taskStatus === 4)
              )
            },
            method(index, row) {
              window.open(row.filePath, '_blank')
            },
            code: 'ui'
          }
        ]
      }
    }
  },
  created() {
    // this.init()
  },
  methods: {
    open() {
      if (this.code) {
        this.id = this.code
      }
      if (this.designColumns) {
        this.columns = this.designColumns
      }
      if (this.designOperates) {
        this.operates = this.designOperates
      }
      this.currPage = 1
      this.refreshTable()
    },
    close() {
      this.$emit('update:visible', false)
      this.$emit('close')
      this.handleSearchReset()
    },
    handleSearchSubmit() {
      this.currPage = 1
      this.refreshTable()
    },
    handleSearchReset() {
      this.operateTime = null
      this.id = null
      this.userName = null
      this.code = null
    },

    handlePageSizeChange(value) {
      this.limit = value
      this.refreshTable()
    },
    handlePageCurrentChange(value) {
      this.currPage = value
      this.refreshTable()
    },
    refreshTable() {
      const reqData = {
        taskType: this.taskType,
        taskActionType: this.taskActionType
      }
      if (this.operateTime) {
        reqData.startTime = this.$portal.parseTime(
          this.operateTime[0],
          '{y}-{m}-{d}'
        )
        reqData.finishTime = this.$portal.parseTime(
          this.operateTime[1],
          '{y}-{m}-{d}'
        )
      }
      if (this.id) {
        reqData.id = this.id
      }
      if (this.userName) {
        reqData.userName = this.userName
      }

      this.loading = true
      this.$oms.$api.soExportTaskSchedule
        .soExportTaskScheduleListPage({
          filters: reqData,
          limit: this.limit,
          page: this.currPage
        })
        .then(resp => {
          this.taskList = resp.data
          this.total = resp.total
        })
        .finally(resp => {
          this.loading = false
        })
    },
    async init() {
      const reslut = await this.$oms.$api.common.listByCategorysForOrder({
        categorys: ['TASK_TYPE']
      })
      this.taskTypeList = reslut.data.TASK_TYPE
      this.refreshTable()
    }
  }
}
</script>

<style lang="less" scoped>
.soExportTask-html {
  .cp-box {
    box-shadow: none;
  }

  .operate-time {
    overflow: visible;
    box-shadow: none;
  }
}
</style>
