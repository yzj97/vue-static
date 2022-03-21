<template>
  <ody-dialog
    :title="$t('View_the_task')"
    :visible.sync="visible"
    :append-to-body="true"
    size="small"
    width="880px"
    @close="close"
  >
    <div slot="content">
      <el-table :data="taskList" name="taskList233" size="small" style="width: 100%">
        <el-table-column :label="$t('taskId')" prop="asyncId" width="80" align="center"/>
        <el-table-column :label="$t('taskCode')" prop="taskType" align="center"/>
        <el-table-column :label="$t('任务类型')" prop="taskTypeName" width="80" align="center"/>
        <el-table-column :label="$t('taskStatus')" width="80" align="center">
          <template slot-scope="scope">{{ convertStatus(scope.row.asyncStatus) }}</template>
        </el-table-column>
        <!--<el-table-column
          v-if="modelType!='import'"
          :label="$t('Totalnumberofrecords')"
          prop="records"
          width="80"
          align="right"
        />-->
        <el-table-column
          :label="$t('创建时间')"
          prop="createTime"
          width="160"
          align="center"
        />
        <el-table-column
          :label="$t('完成时间')"
          prop="createFileTime"
          width="160"
          align="center"
        />
        <el-table-column :label="$t('Clickdownloads')" width="80" align="center">
          <template slot-scope="scope">
            <a v-if="scope.row.downPath" :href="scope.row.downPath">{{ $t('Clickdownloads') }}</a>
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
    taskType: { type: String, required: false, default: null },
    taskTypeListStr: { type: String, required: false, default: null },
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
        taskTypeListStr: this.taskTypeListStr,
        limitStart: (this.currentPage - 1) * this.pageSize,
        limitCount: this.pageSize
      }
      const result = await (this.search
        ? this.search(data)
        : this.$ouserCenter.$api.memberService.downloadTask(data))
      var importReg = RegExp(/Import/)
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
        row.taskTypeName = row.taskType == null ? '' : importReg.test(row.taskType) ? this.$t('导入') : this.$t('导出')
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
