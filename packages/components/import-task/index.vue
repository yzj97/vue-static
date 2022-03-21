<template>
  <ody-dialog
    :title="title"
    :visible.sync="visible"
    :append-to-body="appendToBody"
    width="960px"
    @open="handleSearchReset(true)"
    @opened="init"
    @close="close">

    <section class="pg-import-task-list">
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form">
            <ody-search-item :space="4" :label="$t('operation_time')" class="operate-time" prop="startTimeRange">
              <ody-date-range-picker ref="startTimeRange" v-model="startTimeRange" :default="7" name="startTimeRange" />
            </ody-search-item>
            <ody-search-item :label="$t('taskCode')" prop="taskId">
              <el-input v-model="taskId" name="taskId" maxlength="25" />
            </ody-search-item>
            <ody-search-item :label="$t('operation_people')" prop="createUsername">
              <el-input v-model="createUsername" name="createUsername" maxlength="25" />
            </ody-search-item>
            <slot name="search-items"/>
          </el-form>
        </div>
        <div slot="btn">
          <el-button
            name="handleSearchSubmit"
            size="small"
            type="primary"
            @click="handleSearchSubmit"
          >{{ $t('common_select') }}</el-button>
          <el-button name="handleSearchReset" size="small" @click="handleSearchReset(false)">{{ $t('common_reset') }}</el-button>
        </div>
      </ody-list-search-area>

      <ody-list-table-area>
        <div slot="table">
          <el-table :data="taskList" name="taskList493" size="small" style="width: 100%">
            <el-table-column :label="$t('taskCode')" prop="id" width="80" />
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
            <el-table-column :label="$t('操作人')" :title="$t('操作人')" prop="createUsername" width="120"/>
            <el-table-column :label="$t('startDate')" :prop="isDataTask ? 'startTime' : 'timeStart'" width="140" align="center"/>
            <el-table-column :label="$t('endDate')" :prop="isDataTask ? 'endTime' : 'timeEnd'" width="140" align="center"/>
            <el-table-column :label="$t('Clickdownloads')" width="80" align="center">
              <template slot-scope="scope">
                <a
                  v-if="scope.row.failedFilePath"
                  name="download"
                  style="color:#0066ff;cursor:pointer;"
                  @click="download(scope.row.failedFilePath, scope.row.fileName)">{{ $t('Clickdownloads') }}</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page="currentPage"
              :page-size="pageSize"
              :total="total"
              layout="total, prev, pager, next"
              style="text-align:right"
              @current-change="changePage"/>
          </div>
        </div>
      </ody-list-table-area>
    </section>

    <span slot="footer" class="dialog-footer">
      <el-button name="close" size="small" type="primary" @click="close">{{ $t('Close') }}</el-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  props: {
    appendToBody: { type: Boolean, default: false, required: false },
    pool: { type: String, default: null, required: true },
    isDataTask: { type: Boolean, required: false, default: true },
    filterDataAuth: { type: Boolean, required: false, default: false },
    title: { type: String, default: null, required: false },
    taskType: { type: String, default: null, required: false },
    taskId: { type: Number, required: false, default: null },
    visible: { type: Boolean, required: true, default: false },
    search: { type: Function, required: false, default: null }, // 接受入参{taskType:"",limitStart:0,limitCount:10},返回Promise
    handleFilterData: { type: Function, required: false, default: null }
  },
  data() {
    return {
      startTimeRange: [],
      createUsername: null,
      taskList: [],
      total: 0,
      currentPage: 1,
      pageSize: 5
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        // this.init()
      }
    }
  },
  mounted() {
    // this.init()
  },
  methods: {
    async init() {
      if (!this.title) {
        this.title = this.$t('View_the_task')
      }
      this.handleSearchSubmit()
    },
    async handleSearchSubmit() {
      let req = this.isDataTask
        ? (this.filterDataAuth ? this.$api.dataTask.dataTask_listPageWithDataAuth : this.$api.dataTask.dataTask_listPage)
        : this.$api.dataTask.asyncImportTask
      if (this.search) {
        req = this.search
      }

      this.isDataTask ? this._loadDataTask(req) : this._loadAsyncTask(req)
    },
    async handleSearchReset(taskIdRetained) {
      this.startTimeRange = []
      this.createUsername = null
      if (!taskIdRetained) {
        this.taskId = null
      }
      if (this.$refs.startTimeRange) {
        this.$refs.startTimeRange.setDefault(7)
      }
      if (!taskIdRetained) {
        this.handleSearchSubmit()
      }
    },
    async _loadDataTask(req) {
      let filterData = {
        pool: this.pool, type: 1, taskType: this.taskType
      }
      if (this.taskId) {
        filterData.id = this.taskId
      }
      if (this.createUsername) {
        filterData.createUsername = this.createUsername
      }
      if (this.startTimeRange && this.startTimeRange.length > 1) {
        filterData.startStartTime = this.startTimeRange[0]
        filterData.endStartTime = this.startTimeRange[1]
      }
      if (this.handleFilterData) {
        filterData = this.handleFilterData(filterData)
      }
      const data = {
        filters: filterData,
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
      let data = {
        importType: this.taskType,
        currentPage: this.currentPage,
        itemsPerPage: this.pageSize
      }
      if (this.taskId) {
        data.id = this.taskId
      }
      if (this.createUsername) {
        data.createUsername = this.createUsername
      }
      if (this.startTimeRange && this.startTimeRange.length > 1) {
        data.startCreateTime = this.startTimeRange[0]
        data.endCreateTime = this.startTimeRange[1]
      }
      if (this.handleFilterData) {
        data = this.handleFilterData(data)
      }
      const result = await req(data)
      result.data.listObj.forEach(row => {
        row.timeStart = row.timeStart != null ? this.$portal.parseTime(row.timeStart, '{y}-{m}-{d} {h}:{i}:{s}') : '-'
        row.timeEnd = row.timeEnd != null ? this.$portal.parseTime(row.timeEnd, '{y}-{m}-{d} {h}:{i}:{s}') : '-'
        row.failedFilePath = row.failFilePath
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
      this.handleSearchSubmit()
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
