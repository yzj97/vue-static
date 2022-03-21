<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('直播预告标题') + ':'" :space="1" prop="title">
            <el-input ref="title" v-model="filters.title" name="title" />
          </ody-search-item>
          <ody-search-item :label="$t('主播姓名')+ ':'" :space="1" prop="nickname">
            <el-input ref="nickname" v-model="filters.nickname" name="nickname" />
          </ody-search-item>
          <ody-search-item :label="$t('实际开始时间')+ ':'" prop="actualStartTimeRange">
            <ody-date-range-picker ref="actualStartTimeRange" v-model="actualStartTimeRange" name="actualStartTimeRange" />
          </ody-search-item>
          <ody-search-item :label="$t('结束时间')+ ':'" prop="endTimeRange">
            <ody-date-range-picker ref="endTimeRange" v-model="endTimeRange" name="endTimeRange" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="LiveData_listPage_search"
          code="LiveData_listPage"
          size="small"
          type="primary"
          @click="handleSearch"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          code="LiveData_exportData"
          name="LiveData_exportData"
          size="small"
        >{{ $t('导出') }}</ody-batch-export-button>
        <ody-export-task-button
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          name="LiveData_viewTask"
          code="LiveData_viewTask"
          size="small"
          style="margin-left: 16px"
        >{{ $t('查看任务') }}</ody-export-task-button>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="true"
          :multiple="false"
          name="liveDataTable">
          <template slot="coverImg" slot-scope="scope">
            <div>
              <el-image :src="scope.row.coverImg" :preview-src-list="[scope.row.coverImg]" style="width: 120px; height: 120px"/>
            </div>
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
          @size-change="handleSearch"
          @current-change="handleSearch"
        />
      </div>
    </ody-list-table-area>
  </section>
</template>
<script>
export default {
  name: 'LiveData',
  data() {
    return {
      loading: false,
      list: [],
      actualStartTimeRange: [],
      endTimeRange: [],
      columns: [
        {
          show: true,
          prop: 'index',
          label: this.$t('序号'),
          align: 'center',
          minWidth: 60
        },
        {
          label: this.$t('直播类型'),
          prop: 'typeStr',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('封面'),
          slot: 'coverImg',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('直播预告标题'),
          prop: 'title',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('主播姓名'),
          prop: 'nickname',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('主播手机号'),
          prop: 'mobile',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('订阅人数'),
          prop: 'subscribeNum',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('观看人数'),
          prop: 'watchNum',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('观看次数'),
          prop: 'watchCount',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('点赞数'),
          prop: 'giveLikeNum',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('新增粉丝数'),
          prop: 'newFansNum',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('成交单数'),
          prop: 'tradeNum',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('成交金额'),
          prop: 'tradeAmount',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('预计开始时间'),
          prop: 'expectStartTime',
          show: true,
          align: 'center',
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            if (row.expectStartTime) {
              return this.$portal.parseTime(row.expectStartTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
          }
        },
        {
          label: this.$t('实际开始时间'),
          prop: 'actualStartTime',
          show: true,
          align: 'center',
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            if (row.actualStartTime) {
              return this.$portal.parseTime(row.actualStartTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
          }
        },
        {
          label: this.$t('结束时间'),
          prop: 'endTime',
          show: true,
          align: 'center',
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            if (row.endTime) {
              return this.$portal.parseTime(row.endTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
          }
        },
        {
          label: this.$t('时长'),
          prop: 'durationHour',
          show: true,
          align: 'center',
          minWidth: 100
        }
      ],
      filters: {},
      page: {
        page: 1,
        limit: 10
      },
      total: 0,
      exportModel: {
        exportApi: ['live-web', 'liveData', 'exportData'],
        pool: 'live',
        taskType: 'liveDataExport',
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
      this.handleSearch()
    },
    handleSearch() {
      this.loading = true

      this.handleFilters()
      const args = { filters: this.filters, ...this.page }
      this.$live.$api.liveData.listPage(args).then(
        res => {
          this.loading = false
          let index = 0
          res.data.forEach(item => {
            item.index = index + 1
            index = index + 1
          })
          this.list = res.data
          this.total = res.total
        },
        () => {
          this.loading = false
        }
      )
    },
    handleFilters() {
      if (this.actualStartTimeRange && this.actualStartTimeRange.length > 1) {
        this.filters.startActualStartTime = this.actualStartTimeRange[0] + ' 00:00:01'
        this.filters.endActualStartTime = this.actualStartTimeRange[1] + ' 23:59:59'
      } else {
        delete this.filters.startActualStartTime
        delete this.filters.endActualStartTime
      }
      if (this.endTimeRange && this.endTimeRange.length > 1) {
        this.filters.startEndTime = this.endTimeRange[0] + ' 00:00:01'
        this.filters.endEndTime = this.endTimeRange[1] + ' 23:59:59'
      } else {
        delete this.filters.startEndTime
        delete this.filters.endEndTime
      }
    },
    handleReset() {
      this.filters = {}
      this.actualStartTimeRange = []
      this.endTimeRange = []
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
