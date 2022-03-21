<template>
  <ody-dialog
    :title="$t('View_the_task')"
    :visible.sync="visible"
    size="small"
    width="820px"
    @close="close">
    <div slot="content">
      <el-table :data="taskList" name="taskList459" style="width: 100%">
        <el-table-column :label="$t('taskId')" :prop="isDataTask ? 'id' : 'asyncId'" width="80" />
        <el-table-column :label="$t('taskStatus')" width="80">
          <template
            slot-scope="scope"
          >{{ isDataTask ? convertDataTaskStatus(scope.row.status) : convertAsyncTaskStatus(scope.row.asyncStatus) }}</template>
        </el-table-column>
        <el-table-column
          v-if="modelType!='import'"
          :label="$t('Totalnumberofrecords')"
          :prop="isDataTask ? 'totalCount' : 'records'"
          width="80"
          align="right"
        />
        <el-table-column
          :label="$t(modelType=='import'?'导入创建时间':'exportCreateTime')"
          :prop="isDataTask ? 'startTime' : 'createTime'"
          width="160"
          align="center"
        />
        <el-table-column
          :label="$t(modelType=='import'?'导入完成时间':'exportTime')"
          :prop="isDataTask ? 'endTime' : 'createFileTime'"
          width="160"
          align="center"
        />
        <el-table-column :label="$t('Clickdownloads')" width="80" align="center">
          <template slot-scope="scope">
            <a
              v-if="isDataTask ? (scope.row.filePath ? scope.row.filePath : scope.row.failedFilePath ) : scope.row.downPath"
              name="download"
              @click="download(isDataTask ? (scope.row.filePath ? scope.row.filePath : scope.row.failedFilePath ) : scope.row.downPath, scope.row.fileName ? scope.row.fileName : fileName)"
            >{{ $t('Clickdownloads') }}</a>
          </template>
        </el-table-column>
      </el-table>
      <ody-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        style="text-align:right"
        @current-change="changePage"/>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button name="close" size="small" type="primary" @click="close">{{ $t('Close') }}</el-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  name: 'DownloadTask',
  props: {
    isDataTask: { type: Boolean, required: false, default: false },
    filterDataAuth: { type: Boolean, required: false, default: false },
    taskType: { type: String, required: true },
    fileName: { type: String, required: false, default: null },
    visible: { type: Boolean, required: true, default: false },
    modelType: { type: String, required: false, default: 'export' }, // export、import
    search: { type: Function, required: false, default: null } // 接受入参{taskType:"",limitStart:0,limitCount:10},返回Promise
  },
  data() {
    return {
      dialogVisible: false,
      taskList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.init()
      }
    }
  },
  methods: {
    async init() {
      let req = this.isDataTask
        ? (this.filterDataAuth ? this.$product.$api.common.dataTask_listPageWithDataAuth : this.$product.$api.common.dataTask_listPage)
        : this.$product.$api.common.downloadTask
      if (this.search) {
        req = this.search
      }

      this.isDataTask ? this._loadDataTask(req) : this._loadAsyncTask(req)
    },
    async _loadDataTask(req) {
      const data = {
        filters: { taskType: this.taskType, type: 2 },
        sorts: [{ field: 'startTime', asc: false }],
        limit: this.pageSize,
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
        taskType: this.taskType,
        limitStart: (this.currentPage - 1) * this.pageSize,
        limitCount: this.pageSize
      }
      const result = await req(data)
      result.result.list.forEach(row => {
        row.createTime =
          row.createTime != null
            ? this.$portal.parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
            : ''
        row.createFileTime =
          row.createFileTime != null
            ? this.$portal.parseTime(
              row.createFileTime,
              '{y}-{m}-{d} {h}:{i}:{s}'
            )
            : ''
      })
      this.taskList = result.result.list
      this.total = result.result.pages
    },
    download(url, name) {
      this.$portal.downloadFileByGet(url, {}, name)
    },
    close() {
      this.$emit('update:visible', false)
      this.$forceUpdate()
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
    },
    convertAsyncTaskStatus(status) {
      switch (status) {
        case '0':
          return this.$t('wait')
        case '1':
          return this.$t('success')
        case '-1':
          return this.$t('fail')
        default:
          return this.$t(status)
      }
    },
    changePage(val) {
      this.currentPage = val
      this.init()
    }
  }
}
</script>

<style scoped>

</style>
