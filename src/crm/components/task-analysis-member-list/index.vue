<template>
  <div class="cp-task-analysis-member-list">
    <el-form :inline="true">
      <ody-left-right class="toolbar">
        <div slot="left">
          <el-form-item :label="$t('会员列表:')">
            <el-select
              v-model="search.status"
              :placeholder="$t('全部')"
              name="search_status"
              class="form-select"
              @change="handleIndicatorTypeChange"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div slot="right">
          <crm-task-save-group-button
            :task-status="taskStatus"
            :task-id="taskId"
            :search-params="{refValue: search.status || null}"
            :save-params="{status: search.status || null}"
            :page-node-id="pageNodeId"
          />
          <ody-button
            name="mktTask_export_handleExport"
            code="mktTask_export"
            size="small"
            type="default"
            @click="handleExport"
          >
            {{ $t('导出报表') }}
          </ody-button>
          <ody-button
            name="mktTask_export_handleViewTask"
            code="mktTask_export"
            size="small"
            @click="handleViewTask"
          >
            {{ $t('查看任务') }}
          </ody-button>
        </div>
      </ody-left-right>
    </el-form>
    <ody-table
      ref="table"
      :can-filter="false"
      :columns="table.columns"
      pagination-style="noborder"
      request-url="/crm-web/mktTask/listNodeRecordsByPage"
      request-page-type="pageNo"
    >
      <template slot="status" slot-scope="scope">
        {{ scope.row.status | keyVal(getStatusMap) }}
      </template>
    </ody-table>
    <downloadTask
      :task-type="'nodeRecordsExport'"
      :model-type="'export'"
      :visible.sync="downloadTaskVisible"
    />
  </div>
</template>

<script>

import downloadTask from '@/components/downloadTask'
import CrmTaskSaveGroupButton from '@/components/task-save-group-button'

export default {
  components: {
    downloadTask,
    CrmTaskSaveGroupButton
  },
  props: {
    taskId: {
      type: String,
      default: null
    },
    taskStatus: {
      type: String,
      default: null
    },
    pageNodeId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      downloadTaskVisible: false,
      options: [
        {
          value: '1',
          label: this.$t('发送成功')
        },
        {
          value: '2',
          label: this.$t('发送失败')
        }
      ],
      search: {
        pageNodeId: this.pageNodeId,
        taskId: this.taskId
      },
      table: {
        columns: [
          {
            label: this.$t('会员昵称'),
            prop: 'nickname',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('会员手机号'),
            prop: 'mobile',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('是否成功'),
            slot: 'status',
            minWidth: 80,
            show: true
          }
        ]
      }
    }
  },
  computed: {
    getStatusMap() {
      return this.options.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  async mounted() {
    await this.query()
  },
  methods: {
    handleViewTask() {
      this.downloadTaskVisible = true
    },
    async handleIndicatorTypeChange() {
      await this.query()
    },
    async handleExport() {
      const { taskId, pageNodeId } = this
      const res = await this.$crm.$api.report.export({
        taskId,
        pageNodeId
      })

      if (res) {
        this.$message({
          message: this.$t('导出成功，请查看任务列表'),
          type: 'success'
        })
      }
    },
    query() {
      const { ...params } = this.search

      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    }
  }
}
</script>

<style lang="scss" scoped>
  .cp-task-analysis-member-list {
    .toolbar {
      .form-select {
        display: inline-block;
        width: 100px;
      }
      margin-bottom: 10px;
    }
  }
</style>
