<template>
  <ody-dialog
    :title="$t('View_the_task')"
    :visible.sync="visible"
    size="small"
    width="960px"
    @close="close">
    <div slot="content">
      <el-table :data="taskList" name="taskList493" size="small" style="width: 100%">
        <el-table-column :label="$t('文件名')" min-width="150">
          <template slot-scope="scope">
            <a v-if="scope.row.filePath" name="download" @click="download(scope.row.filePath, scope.row.fileName)">{{ scope.row.fileName }}</a>
            <span v-else>{{ scope.row.fileName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('taskStatus')" >
          <template slot-scope="scope">
            {{ isDataTask ? convertDataTaskStatus(scope.row.status) : convertAsyncTaskStatus(scope.row.asyncStatus) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('总条数')" :prop="isDataTask ? 'totalCount' : 'totalNum'" />
        <el-table-column :label="$t('成功条数')" :title="$t('成功条数')" :prop="isDataTask ? 'successCount' : 'successNum'"/>
        <el-table-column :label="$t('失败条数')" :title="$t('失败条数')" :prop="isDataTask ? 'failedCount' : 'failNum'"/>
        <el-table-column :label="$t('startDate')" :prop="isDataTask ? 'startTime' : 'timeStart'" width="160" align="center"/>
        <el-table-column :label="$t('endDate')" :prop="isDataTask ? 'endTime' : 'timeEnd'" width="160" align="center"/>
        <el-table-column :label="$t('Clickdownloads')" width="80" align="center">
          <template slot-scope="scope">
            <a
              v-if="scope.row.failedFilePath"
              name="download"
              style="color:#0066ff"
              @click="download(scope.row.failedFilePath, scope.row.fileName)">{{ $t('Clickdownloads') }}</a>
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
  props: {
    isDataTask: { type: Boolean, required: false, default: false },
    filterDataAuth: { type: Boolean, required: false, default: true },
    taskType: { type: String, default: null, required: false },
    importType: { type: Number, required: true },
    visible: { type: Boolean, required: true, default: false },
    search: { type: Function, required: false, default: null }, // 接受入参{taskType:"",limitStart:0,limitCount:10},返回Promise
    platformType: { type: Number, required: false, default: null } // 1运营商品 2商家商品
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
        : this.$product.$api.common.importTask
      if (this.search) {
        req = this.search
      }

      this.isDataTask ? this._loadDataTask(req) : this._loadAsyncTask(req)
    },
    async _loadDataTask(req) {
      const data = {
        filters: { type: 1, taskType: this.taskType },
        sorts: [{ field: 'startTime', asc: false }],
        limit: this.pageSize,
        page: this.currentPage
      }
      if (this.platformType) {
        data.filters.platformType = this.platformType
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
        itemsPerPage: this.pageSize
      }
      const result = await req(data)
      result.result.list.forEach(row => {
        row.timeStart = row.timeStart != null ? this.$portal.parseTime(row.timeStart, '{y}-{m}-{d} {h}:{i}:{s}') : '-'
        row.timeEnd = row.timeEnd != null ? this.$portal.parseTime(row.timeEnd, '{y}-{m}-{d} {h}:{i}:{s}') : '-'
      })
      this.taskList = result.data.listObj
      this.total = result.data.total || 0
    },
    download(url, name) {
      this.$portal.downloadFileByGet(url, {}, name)
    },
    close() {
      this.$emit('update:visible', false)
      this.$forceUpdate()
    },
    changePage(val) {
      this.currentPage = val
      this.init()
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
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/{
  th{
      .cell{
        white-space: nowrap;
      }
    }
  }

</style>
