<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('举报类型') + ':'" :space="1" prop="reportType">
            <ody-dict-select ref="reportType" v-model="filters.reportType" pool="live" category="REPORT_TYPE" name="reportType" />
          </ody-search-item>
          <ody-search-item :label="$t('主播') + ':'" :space="1" prop="liveNickname">
            <el-input ref="liveNickname" v-model="filters.liveNickname" name="liveNickname" />
          </ody-search-item>
          <ody-search-item :label="$t('举报时间') + ':'" prop="createTimeRange">
            <ody-date-range-picker ref="createTimeRange" v-model="createTimeRange" :default="7" name="createTime" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="LiveReport_listPage_search"
          code="LiveReport_listPage"
          size="small"
          type="primary"
          @click="search"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-export-task-button
          pool="live"
          task-type="liveReportExport"
          name="LiveReport_seeExportTask"
          code="LiveReport_exportData"
          size="small"
        >{{ $t('seeTask') }}</ody-export-task-button>
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          name="LiveReport_exportData"
          code="LiveReport_exportData"
          size="small"
          style="margin-left: 16px"
        >{{ $t('common_export') }}</ody-batch-export-button>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="false"
          name="liveReportTable"
        >
          <template slot="reportVoucher" slot-scope="scope">
            <el-image :src="scope.row.attachment0" :ref="'attachments' + scope.row.id" :preview-src-list="scope.row.attachments"/>
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.page"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.limit"
          :total.sync="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="search"
          @current-change="search"
        />
      </div>
    </ody-list-table-area>
  </section>
</template>
<script>
export default {
  name: 'LiveReportList',
  data() {
    return {
      loading: false,
      list: [],
      columns: [
        {
          label: this.$t('序号'),
          prop: 'id',
          show: true,
          align: 'center',
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            return row.rowNo
          }
        },
        {
          label: this.$t('举报人'),
          prop: 'reportNickname',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('举报类型'),
          prop: 'reportTypeStr',
          show: true,
          align: 'right',
          minWidth: 120
        },
        {
          label: this.$t('直播名称'),
          prop: 'liveName',
          show: true,
          align: 'right',
          minWidth: 120
        },
        {
          label: this.$t('主播'),
          prop: 'liveNickname',
          show: true,
          align: 'right',
          minWidth: 120
        },
        {
          label: this.$t('举报凭证'),
          slot: 'reportVoucher',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('补充说明'),
          prop: 'remark',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('举报时间'),
          prop: 'createTime',
          show: true,
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            if (row.createTime) {
              return this.$portal.parseTime(
                row.createTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        }
      ],
      createTimeRange: [],
      filters: {},
      page: {
        page: 1,
        limit: 10
      },
      total: 0,
      exportModel: {
        exportApi: ['live-web', 'liveReport', 'exportData'],
        pool: 'live',
        taskType: 'liveReportExport',
        async: true,
        getExportData: () => {
          this.handleFilters()
          return { filters: this.filters }
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    async init() {
      this.search()
    },
    search() {
      this.loading = true

      this.handleFilters()
      const args = { filters: this.filters, ...this.page }
      this.$live.$api.liveReport.listPage(args).then(
        res => {
          this.loading = false
          this.list = res.data
          this.list.forEach((item, index) => {
            if (item.reportVoucher) {
              if (item.attachments.length > 0) {
                item.attachment0 = item.attachments[0]
              }
            }
            item.rowNo = index + 1
          })
          this.total = res.total
        },
        () => {
          this.loading = false
        }
      )
    },
    handleFilters() {
      if (this.createTimeRange && this.createTimeRange.length > 1) {
        this.filters.startCreateTime = this.createTimeRange[0] + ' 00:00:00'
        this.filters.endCreateTime = this.createTimeRange[1] + ' 23:59:59'
      } else {
        delete this.filters.startCreateTime
        delete this.filters.endCreateTime
      }
    },
    reset() {
      this.filters = {}
      this.createTimeRange = []
      this.$refs.createTimeRange.setDefault(7)
    }
  }
}
</script>
<style lang="scss" scoped>
.popover-container {
  .popover-input {
    margin-bottom: 10px;
  }
}
.btn-popover {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .el-button {
    margin-bottom: 4px;
  }
}
</style>
