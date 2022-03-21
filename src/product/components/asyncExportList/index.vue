<template>
  <div style="display: inline-block">
    <el-button :size="size" :type="type" name="openDialog" @click="openDialog">{{ $t('查看任务') }}</el-button>
    <ody-dialog
      :visible.sync="dialog.show"
      :before-close="closeDialog"
      :title="$t('查看导出任务')"
      width="960px"
      @close="closeDialog()">
      <el-table
        :data="dialog.list"
        name="dialog_list326"
        style="width: 100%">
        <el-table-column
          :label="$t('事件ID')"
          prop="asyncId"
          align="center"/>
        <!--<el-table-column
          :label="$t('任务编码')"
          prop="taskType"
          align="center"/>-->
        <el-table-column
          :label="$t('任务状态')"
          prop="asyncStatusStr"
          align="center"/>
        <el-table-column
          :label="$t('记录数')"
          prop="records"
          align="center"/>
        <el-table-column
          :label="$t('创建时间')"
          prop="createTime"
          align="center"/>
        <el-table-column
          :label="$t('完成时间')"
          prop="createFileTime"
          align="center"/>
        <el-table-column
          :label="$t('下载链接')"
          align="center">
          <template slot-scope="scope">
            <a v-if="scope.row.downPath" :href="scope.row.downPath" style="color:#1890FF">{{ $t('点击下载') }}</a>
          </template>
          <!--<template slot-scope="scope">
            <el-button name="downloadFile" size="mini" @click="downloadFile(scope.row.downPath)">{{ $t('下载') }}</el-button>
          </template>-->
        </el-table-column>
      </el-table>
      <ody-pagination
        :current-page.sync="searchForm.limitStart"
        :page-size="searchForm.limitCount"
        :total="dialog.total"
        layout="total, prev, pager, next"
        @size-change="query"
        @current-change="query"/>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'mini'
    },
    type: {
      type: String,
      default: null
    },
    taskType: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      searchForm: {
        limitStart: 1,
        limitCount: 5
      },
      dialog: {
        show: false,
        total: 0,
        list: []
      }
    }
  },
  methods: {
    query(currentSize) {
      this.searchForm.limitStart = currentSize
      this.queryList()
    },
    queryList() {
      const self = this
      this.$portal.get('/ouser-web/asyncexport/getAsyncEventList.do?taskType=' + this.taskType + '&limitStart=' + ((this.searchForm.limitStart - 1) * this.searchForm.limitCount) + '&limitCount=' + this.searchForm.limitCount).then(res => {
        self.dialog.total = res.result.pages
        self.dialog.list = res.result.list
        self.dialog.list.forEach(i => {
          if (i.asyncStatus === '0') {
            i.asyncStatusStr = self.$t('进行中')
          } else if (i.asyncStatus === '1') {
            i.asyncStatusStr = self.$t('成功')
          } else {
            i.asyncStatusStr = self.$t('失败')
          }
          i.createTime = i.createTime.replace('.0', '')
          i.createFileTime = i.createFileTime.replace('.0', '')
        })
      })
    },
    openDialog() {
      this.dialog = {
        show: true,
        total: 0,
        list: []
      }
      this.queryList()
    },
    closeDialog() {
      this.dialog = {
        show: false,
        total: 0,
        list: []
      }
    },
    downloadFile(filePath) {
      this.$portal.downloadFileByGet(filePath)
    }
  }
}
</script>

<style scoped>

</style>
