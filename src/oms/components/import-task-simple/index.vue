<template>
  <div>
    <ody-dialog-full-right
      :visible.sync="visible"
      :title="$t('上传历史')"
      size="small"
      @open="open"
      @close="close" >
      <section class="pg-expressConfigSet-list">
        <ody-table
          :loading="loading"
          :data.sync="taskList"
          :columns="columns"
          :multiple="false"
          :can-filter="false" />
      </section>
    </ody-dialog-full-right>
  </div>
</template>

<script>

export default {
  props: {
    filterDataAuth: { type: Boolean, required: false, default: true },
    pool: { type: String, default: 'oms-web', reqrequireduired: false },
    visible: {
      type: Boolean,
      default: false
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
          prop: 'id',
          label: this.$t('taskCode'),
          align: 'left',
          minWidth: 90
        }, {
          show: true,
          label: this.$t('taskCount'),
          align: 'right',
          minWidth: 120,
          render: (h, params) => {
            let message = this.convertDataTaskStatus(params.row.status)
            const showMsg = params.row.status >= 2
            if (showMsg) {
              const successCount = params.row.successCount || 0
              const failedCount = params.row.failedCount || 0
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
      this.currPage = 1
      this._loadDataTask()
    },
    async _loadDataTask() {
      const data = {
        filters: { type: 1, taskType: this.taskType },
        sorts: [{ field: 'startTime', asc: false }],
        limit: this.pageSize,
        page: this.currentPage
      }
      const result = this.search ? await this.search(data)
        : await this.$portal.post('/' + this.pool + '/public/data/task/listPage' + (this.filterDataAuth ? '?filterDataAuth=true' : ''), data)
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
    close() {
      this.$emit('update:visible', !this.visible)
      this.$emit('close')
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
