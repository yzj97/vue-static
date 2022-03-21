<template>
  <ody-dialog
    :title="$t('View_the_task')"
    :visible.sync="visible"
    :append-to-body="true"
    size="small"
    width="960px"
    @close="close"
  >
    <div slot="content">
      <el-table :data="taskList" name="taskList010" size="small" style="width: 100%">
        <el-table-column :label="$t('taskId')" prop="asyncId" width="80" />
        <el-table-column :label="$t('taskCode')" prop="taskType" />
        <el-table-column :label="$t('taskStatus')" width="80">
          <template slot-scope="scope">{{ convertStatus(scope.row.asyncStatus) }}</template>
        </el-table-column>
        <el-table-column
          :label="$t(modelType=='import'?'失败条目':'Totalnumberofrecords')"
          prop="records"
          width="80"
          align="right"
        />
        <el-table-column
          :label="$t(modelType=='import'?'导入创建时间':'exportCreateTime')"
          prop="createTime"
          width="160"
          align="center"
        />
        <el-table-column
          :label="$t(modelType=='import'?'导入完成时间':'exportTime')"
          prop="createFileTime"
          width="160"
          align="center"
        />
        <el-table-column :label="$t('Clickdownloads')" width="80" align="center">
          <template slot-scope="scope">
            <a v-if="scope.row.downPath && scope.row.records > 0" :href="scope.row.downPath">{{ $t('Clickdownloads') }}</a>
          </template>
        </el-table-column>
      </el-table>
      <ody-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        style="text-align:right"
        @current-change="changePage"
      />
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
    taskType: { type: String, required: true },
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
      const data = {
        taskType: this.taskType,
        limitStart: (this.currentPage - 1) * this.pageSize,
        limitCount: this.pageSize
      }
      const result = await (this.search
        ? this.search(data)
        : this.$ouser.$api.common.downloadTask(data))
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
    close() {
      this.$emit('update:visible', false)
      this.$forceUpdate()
    },
    convertStatus(status) {
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
