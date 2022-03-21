<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item
            :label="$t('common_operationUserId') + ':'"
            prop="param.userId"
          >
            <el-input
              v-model="search.param.userId"
              name="search_param_userId"
              type="number"
            />
          </ody-search-item>
          <ody-search-item
            :label="$t('common_operationUserName') + ':'"
            prop="param.userName"
          >
            <el-input
              v-model="search.param.userName"
              name="search_param_userName"
            />
          </ody-search-item>
          <ody-search-item
            :label="$t('common_operationTime') + ':'"
            :space="2"
            prop="data.createTime"
          >
            <ody-date-range-picker
              ref="createTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              v-model="search.data.createTime"
              :default="7"
              name="search_data_createTime"
              type="datetimer"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="initLogData" size="small" @click="initLogData">{{
          $t("common_reset")
        }}</el-button>
        <ody-button
          name="OuserCenterRuleConfigQueryOperateLog_queryLogList"
          size="small"
          type="primary"
          code="OuserCenterRuleConfigQueryOperateLog"
          @click="queryLogList"
        >{{ $t("common_select") }}
        </ody-button>
        <ody-button
          name="ruleLogExport_download"
          size="small"
          style="float:right;margin-left: 10px"
          code="ruleLogExport"
          @click="download"
        >{{ $t("common_export") }}
        </ody-button>
        <ody-button
          name="ruleLogExportEventList_downloadTaskVisible"
          size="small"
          style="float:right"
          code="ruleLogExportEventList"
          @click="downloadTaskVisible = true"
        >{{ $t("common_see_task") }}
        </ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :fixed="false"
          name="list091"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="onPageChange"
          @current-change="onPageChange"
        />
      </div>
    </ody-list-table-area>
    <downloadTask
      :task-type="'ruleLogExport'"
      :is-data-task="false"
      :visible.sync="downloadTaskVisible"
    />
  </div>
</template>

<script>
import downloadTask from '@/components/downloadTask'
export default {
  components: {
    downloadTask
  },
  data() {
    return {
      search: {
        data: {
          createTime: []
        },
        param: {
          userId: null,
          userName: null
        }
      },
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'userName',
          label: this.$t('common_operationUserName'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'userId',
          label: this.$t('common_operationUserId'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'name',
          label: this.$t('operation_menu'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'content',
          label: this.$t('operation_content'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'createTime',
          label: this.$t('operation_time'),
          align: 'center',
          minWidth: 200,
          formatter: (row, columns) => {
            if (row.createTime) {
              return this.$portal.parseTime(
                row.createTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
            return ''
          }
        }
      ],
      loading: false,
      list: [],
      downloadTaskVisible: false
    }
  },
  async mounted() {
    try {
      await this.queryLogList()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async queryLogList() {
      this.page.current = 1
      await this.listLogData()
    },
    async initLogData() {
      this.search.param = {
        userId: null,
        userName: null
      }
      this.search.data = {
        createTime: []
      }
      this.$refs.createTime.setDefault(7)
    },
    async download() {
      const vue = this
      const param = {
        filters: {},
        currentPage: 1,
        itemsPerPage: 1000,
        startCreateTime: this.search.data.createTime[0],
        endCreateTime: this.search.data.createTime[1]
      }

      if (vue.search.param.userId !== null && vue.search.param.userId !== '') {
        param.filters.createUserid = parseInt(vue.search.param.userId)
      }

      if (vue.search.param.userName !== null) {
        param.filters.createUsername =
          vue.search.param.userName !== ''
            ? vue.search.param.userName.trim()
            : null
      }

      const res = await this.$crm.$api.crmService.exportRuleLog(param)
      if (res.code === '0') {
        this.$message.success(this.$t('创建导出任务成功'))
      } else {
        this.$message.error(this.$t('创建导出任务失败'))
      }
    },
    onPageChange() {
      this.listLogData()
    },
    async listLogData() {
      const vue = this
      vue.list = []

      if (vue.search.data.createTime) {
        vue.search.param.startCreateTime = this.search.data.createTime[0]
        vue.search.param.endCreateTime = this.search.data.createTime[1]
      } else {
        delete vue.search.param.startCreateTime
        delete vue.search.param.endCreateTime
      }

      const param = {
        filters: {},
        startCreateTime: vue.search.param.startCreateTime,
        endCreateTime: vue.search.param.endCreateTime,
        needContext: true,
        limit: vue.page.size,
        page: vue.page.current
      }

      if (vue.search.param.userId !== null && vue.search.param.userId !== '') {
        param.filters.createUserid = parseInt(vue.search.param.userId)
      }

      if (vue.search.param.userName !== null) {
        param.filters.createUsername =
          vue.search.param.userName !== ''
            ? vue.search.param.userName.trim()
            : null
      }

      const crmService = vue.$crm.$api.crmService
      crmService.listBasicRuleOperActionPage(param).then(result => {
        result.data.forEach(item => {
          var logData = {
            name: item.context.name,
            content: item.note,
            userId: item.userId,
            userName: item.userName,
            createTime: item.timeStr
          }
          vue.list.push(logData)
        })
        console.log(this.list)

        vue.page.total = result.total
        vue.total = result.total
      })
    }
  }
}
</script>

<style scoped></style>
