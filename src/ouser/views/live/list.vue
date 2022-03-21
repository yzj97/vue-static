<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="120px" class="form">
          <ody-search-item :label="$t('直播:')" :space="1" prop="liveName">
            <el-input v-model="filters.liveName" :placeholder="$t('请输入') + $t('直播名称')" name="searchForm_filters_liveName" />
          </ody-search-item>
          <ody-search-item :label="$t('直播封面图片URL:')" :space="1" prop="liveCoverUrl">
            <el-input v-model="filters.liveCoverUrl" :placeholder="$t('请输入') + $t('直播封面图片URL')" name="searchForm_filters_liveCoverUrl" />
          </ody-search-item>
          <ody-search-item :label="$t('分享封面图片URL:')" :space="1" prop="shareCoverUrl">
            <el-input v-model="filters.shareCoverUrl" :placeholder="$t('请输入') + $t('分享封面图片URL')" name="searchForm_filters_shareCoverUrl" />
          </ody-search-item>
          <ody-search-item :label="$t('直播开始时间:')" prop="startTimeRange">
            <ody-date-range-picker ref="startTimeRange" v-model="startTimeRange" :default="7" name="startTime" type="datetimer" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="Live_listPage_search"
          code="Live_listPage"
          size="small"
          type="primary"
          @click="search"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="Live_exportData"
          code="Live_add"
          size="small"
          @click="add"
        >{{ $t('newly_added') }}</ody-button>
        <ody-button
          name="Live_batchDelete"
          code="Live_delete"
          size="small"
          @click="batchDelete"
        >{{ $t('common_batch_remove') }}</ody-button>
        <ody-batch-import-button
          :import-api="importModel.importApi"
          :import-label="importModel.importlabel"
          :download-local-file="importModel.downloadLocalFile"
          :async="importModel.async"
          :pool="importModel.pool"
          :task-type="importModel.taskType"
          name="Live_importData"
          code="Live_importData"
          size="small"
        >{{ $t('batch_import') }}</ody-batch-import-button>
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          name="Live_exportData"
          code="Live_exportData"
          size="small"
        >{{ $t('batch_export') }}</ody-batch-export-button>
        <el-popover placement="bottom" with="160" trigger="hover">
          <div class="btn-popover">
            <ody-import-task-button
              pool="social"
              task-type="liveImport"
              name="Live_seeImportTask"
              code="Live_importData"
              size="small"
            >{{ $t('seeImportTask') }}</ody-import-task-button>
            <ody-export-task-button
              pool="social"
              task-type="liveExport"
              name="Live_seeExportTask"
              code="Live_exportData"
              size="small"
            >{{ $t('seeExportTask') }}</ody-export-task-button>
          </div>
          <el-button slot="reference" size="small">
            {{ $t('seeTask') }}
            <i class="el-icon-arrow-down" />
          </el-button>
        </el-popover>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :checked.sync="checked"
          :multiple="true"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="true"
          name="liveTable"
        />
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
  name: 'LiveList',
  data() {
    return {
      checked: [],
      importModel: {
        importApi: ['social-back-web', 'live', 'importData', {}],
        importLabel: this.$t('导入直播测试'),
        downloadLocalFile: [require('@/excelfile/live-template.xlsx')],
        pool: 'social',
        taskType: 'liveImport',
        async: true
      },
      exportModel: {
        exportApi: ['social-back-web', 'live', 'exportData'],
        pool: 'social',
        taskType: 'liveExport',
        async: true,
        getExportData: () => {
          this.handleFilters()
          return this.filters
        }
      },
      loading: false,
      list: [],
      columns: [
        {
          label: this.$t('直播名称'),
          prop: 'liveName',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('直播封面图片URL'),
          prop: 'liveCoverUrl',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('分享封面图片URL'),
          prop: 'shareCoverUrl',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('直播主页地址'),
          prop: 'liveUrl',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('直播描述'),
          prop: 'liveDesc',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('直播状态'),
          prop: 'statusStr',
          show: true,
          align: 'right'
        },
        {
          label: this.$t('订阅数'),
          prop: 'subscribeCount',
          show: true,
          align: 'right',
          minWidth: 88
        },
        {
          label: this.$t('分享数'),
          prop: 'shareCount',
          show: true,
          align: 'right',
          minWidth: 88
        },
        {
          label: this.$t('置顶设置'),
          prop: 'isTop',
          show: true,
          align: 'right',
          minWidth: 88
        },
        {
          label: this.$t('直播开始时间'),
          prop: 'startTime',
          show: true,
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.startTime) {
              return this.$portal.parseTime(
                row.startTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        list: [
          {
            label: this.$t('查看'),
            code: 'Live_getById',
            method: (index, row) => {
              this.$router.push({
                name: 'LiveDetail',
                query: {
                  id: row.id,
                  readonly: true
                }
              })
            }
          },
          {
            label: this.$t('编辑'),
            code: 'Live_update',
            method: (index, row) => {
              this.$router.push({
                name: 'LiveEdit',
                query: {
                  id: row.id,
                  readonly: false
                }
              })
            }
          },
          {
            label: this.$t('删除'),
            code: 'Live_delete',
            method: (index, row) => {
              this.delete(row)
            }
          }
        ]
      },
      startTimeRange: [],
      filters: this.initFilters(),
      page: {
        page: 1,
        limit: 10
      },
      total: 0
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    this.search()
  },
  methods: {
    async init() {
      this.search()
    },
    search() {
      this.loading = true

      this.handleFilters()
      const args = { filters: this.filters, ...this.page }
      this.$ouser.$api.live.listPage(args).then(
        res => {
          this.loading = false
          this.list = res.data
          this.total = res.total
        },
        () => {
          this.loading = false
        }
      )
    },
    handleFilters() {
      if (this.startTimeRange && this.startTimeRange.length > 1) {
        this.filters.startStartTime = this.startTimeRange[0]
        this.filters.endStartTime = this.startTimeRange[1]
      } else {
        delete this.filters.startStartTime
        delete this.filters.endStartTime
      }
    },
    reset() {
      this.checked = []
      this.filters = this.initFilters()
      this.startTimeRange = []
      this.$refs.startTimeRange.setDefault(7)
    },
    add() {
      this.$router.push({
        name: 'LiveAdd',
        query: {
          readonly: false
        }
      })
    },
    async batchDelete() {
      if (this.checked.length === 0) {
        return this.$message(this.$t('至少选择一条数据'))
      }
      const confirm = await this.$confirm(
        this.$t('是否删除选中的') + this.$t('直播测试'),
        this.$t('common_prompt')
      )
      if (confirm) {
        if (this.checked && this.checked.length > 0) {
          const ids = this.checked.map(x => x['id'])
          const result = await this.$ouser.$api.live.delete(ids)
          if (result && result.code === '0') {
            this.checked = []
            this.search()
            this.$message({
              type: 'success',
              message: this.$t('common_delete_success')
            })
          }
        }
      }
    },
    async delete(row) {
      const confirm = await this.$confirm(
        this.$t('是否删除当前') + this.$t('直播测试'),
        this.$t('common_prompt')
      )
      if (confirm) {
        const ids = []
        ids.push(row.id)
        const result = await this.$ouser.$api.live.delete(
          ids
        )
        if (result && result.code === '0') {
          this.search()
          this.$message({
            type: 'success',
            message: this.$t('common_delete_success')
          })
        }
      }
    },
    initFilters() {
      return {
        liveName: null,
        liveCoverUrl: null,
        shareCoverUrl: null,
        startTime: null
      }
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
::v-deep .custom-label{
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
</style>
