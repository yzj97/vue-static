<template>
  <div>
    <ody-dialog-full-right
      :visible.sync="visible"
      :title="$t('上传历史')"
      size="medium"
      @open="open"
      @close="close" >
      <section class="pg-expressConfigSet-list">
        <ody-table
          :loading="loading"
          :data.sync="taskList"
          :columns="columns"
          :multiple="false"
          :can-filter="false" />
        <el-row style="text-align: center">
          <el-link name="showMore" type="primary" @click="showMore">{{ $t('更多记录') }}</el-link>
        </el-row>
      </section>
    </ody-dialog-full-right>
    <!-- <SoExportTask ref="importTask" :visible.sync="visibleOfTask" :task-type.sync="taskType" :task-action-type.sync="taskActionType" :design-columns.sync="taskModalDefine.columns" :design-operates.sync="taskModalDefine.operates"/>
    <DataImportModal :visible.sync="visibleOfImport" :filters="taskFilters" /> -->
  </div>
</template>

<script>

export default {
  props: {
    isDataTask: { type: Boolean, required: false, default: false },
    filterDataAuth: { type: Boolean, required: false, default: true },
    visible: {
      type: Boolean,
      default: false
    },
    importType: {
      type: Number,
      required: true
    },
    platformType: {
      type: Number,
      default: 1 // 运营平台，商家平台
    },
    taskType: {
      type: String,
      default: null,
      required: false
    }
  },
  data() {
    const self = this
    return {
      visibleOfTask: false,
      visibleOfImport: false,
      taskFilters: {},
      loading: false,
      taskTypeList: [],
      taskList: [],
      limit: 10,
      currPage: 1,
      total: 0,
      columns: [
        {
          show: true,
          prop: 'fileName',
          label: this.$t('文件名'),
          align: 'left',
          minWidth: 300
        }, {
          show: true,
          label: this.$t('taskCount'),
          align: 'right',
          minWidth: 120,
          render: (h, params) => {
            let message = this.isDataTask ? this.convertDataTaskStatus(params.row.status) : params.row.statusStr
            const showMsg = this.isDataTask ? params.row.status >= 2 : params.row.status >= 3
            if (showMsg) {
              const successCount = this.isDataTask ? params.row.successCount : params.row.successNum || 0
              const failedCount = this.isDataTask ? params.row.failedCount : params.row.failNum || 0
              message = <span class={ !successCount ? 'error' : ''}>{ self.$t('上传结果信息', { successCount: successCount, failedCount: failedCount }) }</span>
            }
            return (
              <div>{ message }</div>
            )
          }
        }
      ]
    }
  },
  methods: {
    open() {
      let req = this.isDataTask
        ? (this.filterDataAuth ? this.$product.$api.common.dataTask_listPageWithDataAuth : this.$product.$api.common.dataTask_listPage)
        : this.$product.$api.common.importTask
      if (this.search) {
        req = this.search
      }

      this.currPage = 1
      this.isDataTask ? this._loadDataTask(req) : this._loadAsyncTask(req)
    },
    async _loadDataTask(req) {
      const data = {
        filters: { type: 1, taskType: this.taskType, platformType: this.platformType },
        sorts: [{ field: 'startTime', asc: false }],
        limit: this.limit,
        page: this.currentPage
      }
      const result = await req(data)
      result.data.forEach(row => {
        row.startTime =
          row.startTime != null
            ? this.$portal.parseTime(row.startTime, '{y}-{m}-{d} {h}:{i}:{s}')
            : ''
        row.endTime =
          row.endTime != null
            ? this.$portal.parseTime(row.endTime, '{y}-{m}-{d} {h}:{i}:{s}')
            : ''
      })
      this.taskList = result.data
      this.total = result.total
    },
    async _loadAsyncTask(req) {
      const data = {
        importType: this.importType,
        currentPage: this.currentPage,
        itemsPerPage: this.limit
      }
      const result = await req(data)
      result.result.list.forEach(row => {
        row.timeStart = row.timeStart != null ? this.$portal.parseTime(row.timeStart, '{y}-{m}-{d} {h}:{i}:{s}') : '-'
        row.timeEnd = row.timeEnd != null ? this.$portal.parseTime(row.timeEnd, '{y}-{m}-{d} {h}:{i}:{s}') : '-'
      })
      this.taskList = result.data.listObj
      this.total = result.data.total || 0
    },
    close() {
      this.$emit('update:visible', this.visible)
      this.$emit('close')
    },
    showMore() {
      this.$router.push({
        name: 'ImportCenter'
      })
    },
    convertDataTaskStatus(status) {
      switch (status) {
        case 0:
          return this.$t('wait')
        case 2:
          return this.$t('success')
        case 3:
          return this.$t('fail')
        default:
          return this.$t('进行中')
      }
    }
  }
}
</script>

<style scoped>

</style>
