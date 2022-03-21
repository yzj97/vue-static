<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('直播预告标题') + ':'" :space="1" prop="title">
            <el-input ref="title" v-model="filters.title" name="title" />
          </ody-search-item>
          <ody-search-item :label="$t('主播') + ':'" :space="1" prop="nickname">
            <el-input ref="nickname" v-model="filters.nickname" name="nickname" />
          </ody-search-item>
          <ody-search-item :label="$t('审核状态') + ':'" :space="1" prop="auditStatus">
            <el-select ref="status" :placeholder="$t('全部')" v-model="filters.auditStatus" name="status">
              <el-option v-for="(v, k) in auditStatusList" :key="k" :label="v" :value="k"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('面向渠道') + ':'" :space="1" prop="channelCode">
            <el-select ref="channelCode" :placeholder="$t('全部')" v-model="filters.channelCode" name="channelCode">
              <el-option v-for="item in channelList" :key="item.channelCode" :label="item.channelName" :value="item.channelCode"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('店铺') + ':'" :space="1" prop="storeId">
            <ody-store-choose
              ref="storeId"
              :placeholder="$t('全部')"
              :selected.sync="selectedStore"
              v-model="filters.storeId"
              value-key="storeId"
              name="storeId"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          code="LiveList_search"
          name="LiveList_search"
          size="small"
          type="primary"
          @click="handleSearch"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          code="LiveList_add"
          name="LiveList_add"
          size="small"
          type="primary"
          @click="handleAdd"
        >{{ $t('新增') }}</ody-button>
        <ody-button
          :disabled="submitDisabled"
          code="LiveList_batchSubmit"
          name="LiveList_batchSubmit"
          size="small"
          @click="handleBatchSubmit"
        >{{ $t('批量提交') }}</ody-button>
        <ody-button
          :disabled="auditDisabled"
          code="LiveList_audit"
          name="LiveList_audit"
          size="small"
          @click="handleBatchAudit"
        >{{ $t('批量审核') }}</ody-button>
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          code="LiveList_exportData"
          name="LiveList_exportData"
          size="small"
          style="margin-left: 16px"
        >{{ $t('导出') }}</ody-batch-export-button>
        <ody-export-task-button
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          name="LiveList_viewTask"
          code="LiveList_viewTask"
          size="small"
          style="margin-left: 16px"
        >{{ $t('查看任务') }}</ody-export-task-button>
      </div>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" @tab-click="handleTabsClick">
          <el-tab-pane v-for="tab in tabs" :label="$t(tab.heading)" :key="tab.index" />
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :checked.sync="checked"
          :can-filter="true"
          :multiple="true"
          :selectable="checkedSelectable"
          name="liveTable"
          @selection-change="handleSelectionChange">
          <template slot="auditStatusStr" slot-scope="scope">
            <div>
              {{ scope.row.auditStatusStr }}
              <el-tooltip v-if="scope.row.auditStatus === 3" :content="scope.row.auditRemark" class="item" effect="dark" placement="top">
                <i class="el-icon-info" />
              </el-tooltip>
            </div>
          </template>
          <template slot="title" slot-scope="scope">
            <div>
              <a name="handleView" style="color:#1890FF" @click="handleView(scope.row)">{{ scope.row.title }}</a>
            </div>
          </template>
          <template slot="coverImg" slot-scope="scope">
            <div>
              <el-image :src="scope.row.coverImg" :preview-src-list="[scope.row.coverImg]" style="width: 120px; height: 120px"/>
            </div>
          </template>
          <template slot="pasterImg" slot-scope="scope">
            <div>
              <el-image :src="scope.row.pasterImg" :preview-src-list="[scope.row.pasterImg]" style="width: 120px; height: 120px"/>
            </div>
          </template>
          <template slot="liveProduct" slot-scope="scope">
            <div>
              <ody-button v-if="scope.row.auditStatus !== 2" code="LiveList_viewProduct" type="text" name="LiveList_linkProduct" size="small" @click="handleLinkProduct(scope.row)">{{ $t('关联') }}</ody-button>
              <ody-button v-if="scope.row.auditStatus === 2" code="LiveList_viewProduct" type="text" name="LiveList_viewProduct" size="small" @click="handleViewProduct(scope.row)">{{ $t('查看') }}</ody-button>
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
    <live-audit-dialog :visible.sync="auditDialogVisible" :batch-audit.sync="batchAudit" :selected.sync="selected" @ok="handleAuditSubmit"/>
    <live-product-dialog ref="productDialogVisible" :live.sync="selected"/>
  </section>
</template>
<script>
import LiveAuditDialog from '@/components/live-audit-dialog'
import LiveProductDialog from '@/components/live-product-dialog'
export default {
  name: 'LiveList',
  components: { LiveAuditDialog, LiveProductDialog },
  data() {
    return {
      loading: false,
      auditDialogVisible: false,
      batchAudit: false,
      selectedStore: {},
      channelList: [],
      auditStatusList: [],
      // productDialogVisible: false,
      submitDisabled: true,
      auditDisabled: true,
      activeState: '0',
      tabs: [
        {
          heading: '全部',
          index: 0,
          statusList: [0, 4, 5, 6, 7]
        },
        {
          heading: '未开始',
          index: 1,
          statusList: [0]
        },
        {
          heading: '直播中',
          index: 2,
          statusList: [4, 5]
        },
        {
          heading: '已结束',
          index: 3,
          statusList: [6]
        },
        {
          heading: '已取消',
          index: 4,
          statusList: [7]
        }
      ],
      list: [],
      checked: [],
      selected: {},
      columns: [
        {
          label: this.$t('封面图'),
          slot: 'coverImg',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('直播预告标题'),
          slot: 'title',
          show: true,
          align: 'center',
          minWidth: 160
        },
        {
          label: this.$t('审核状态'),
          slot: 'auditStatusStr',
          show: (row, index) => {
            return this.activeState === '0' || this.activeState === '1'
          },
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('直播状态'),
          prop: 'statusStr',
          show: (row, index) => {
            return this.activeState === '0'
          },
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('直播类型'),
          prop: 'typeStr',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('面向渠道'),
          prop: 'channelName',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('店铺'),
          prop: 'storeName',
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
          show: (index, row) => {
            return this.activeState === '2' || this.activeState === '3'
          },
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('推流地址'),
          prop: 'pushFlowAddress',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('播放地址'),
          prop: 'playAddress',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('预计开始时间'),
          prop: 'expectStartTime',
          show: true,
          align: 'center',
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            if (row.expectStartTime) {
              return this.$portal.parseTime(row.expectStartTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
          }
        },
        {
          label: this.$t('实际开始时间'),
          prop: 'actualStartTime',
          show: (row, index) => {
            return this.activeState === '2' || this.activeState === '3'
          },
          align: 'center',
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            if (row.actualStartTime) {
              return this.$portal.parseTime(row.actualStartTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
          }
        },
        {
          label: this.$t('结束时间'),
          prop: 'endTime',
          show: (row, index) => {
            return this.activeState === '3'
          },
          align: 'center',
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            if (row.endTime) {
              return this.$portal.parseTime(row.endTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
          }
        },
        {
          label: this.$t('时长'),
          prop: 'durationHour',
          show: (row, index) => {
            return this.activeState === '3'
          },
          align: 'center',
          minWidth: 100
        },
        {
          label: this.$t('取消时间'),
          prop: 'cancelTime',
          show: (row, index) => {
            return this.activeState === '4'
          },
          align: 'center',
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            if (row.cancelTime) {
              return this.$portal.parseTime(row.cancelTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
          }
        },
        {
          label: this.$t('货架商品'),
          slot: 'liveProduct',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('创建人'),
          prop: 'createUsername',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('更新时间'),
          prop: 'updateTime',
          show: (row, index) => {
            return this.activeState === '2' || this.activeState === '3' || this.activeState === '4'
          },
          align: 'center',
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            if (row.updateTime) {
              return this.$portal.parseTime(row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
          }
        }
      ],
      operates: {
        fixed: 'right',
        width: 120,
        align: 'center',
        list: [
          {
            label: this.$t('编辑'),
            code: 'LiveList_edit',
            hidden: (index, row) => {
              return !(row.auditStatus === 0 || row.auditStatus === 3)
            },
            method: (index, row) => {
              this.$router.push({
                name: 'LiveListEdit',
                query: {
                  id: row.id
                }
              })
            }
          },
          {
            label: this.$t('提交'),
            code: 'LiveList_submit',
            hidden: (index, row) => {
              return !(row.auditStatus === 0 || row.auditStatus === 3)
            },
            method: (index, row) => {
              this.handleSubmit(row)
            }
          },
          {
            label: this.$t('审核'),
            code: 'LiveList_audit',
            hidden: (index, row) => {
              return !(row.auditStatus === 1)
            },
            method: (index, row) => {
              this.handleAudit(row)
            }
          },
          {
            label: this.$t('取消'),
            code: 'LiveList_cancel',
            hidden: (index, row) => {
              return row.status !== 0
            },
            method: (index, row) => {
              this.handleCancel(row)
            }
          },
          {
            label: this.$t('暂停直播'),
            code: 'LiveList_pause',
            hidden: (index, row) => {
              return !(row.status === 4)
            },
            method: (index, row) => {
              this.handlePause(row)
            }
          },
          {
            label: this.$t('结束直播'),
            code: 'LiveList_end',
            hidden: (index, row) => {
              return !(row.status === 4 || row.status === 5)
            },
            method: (index, row) => {
              this.handleEnd(row)
            }
          },
          {
            label: this.$t('删除'),
            code: 'LiveList_delete',
            hidden: (index, row) => {
              return !(row.status === 6 || row.status === 7)
            },
            method: (index, row) => {
              this.handleDelete(row)
            }
          }
        ]
      },
      filters: {},
      page: {
        page: 1,
        limit: 10
      },
      total: 0,
      exportModel: {
        exportApi: ['live-web', 'live', 'exportData'],
        pool: 'live',
        taskType: 'liveExport',
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
      this.initCode()
      this.initChannel()
      this.handleSearch()
    },
    async initCode() {
      const vue = this
      const res = await vue.$live.$api.commonApi.code_listMulti({ categorys: ['LIVE_AUDIT_STATUS'] })

      vue.auditStatusList = res.data.LIVE_AUDIT_STATUS
    },
    async initChannel() {
      const vue = this
      const res = await vue.$live.$api.commonApi.listChannel({
        filters: {
          onOrOffLine: '1',
          channelType: '1',
          channelMode: [
            'O+O',
            'BBC'
          ]
        }
      })

      vue.channelList = res.data
    },
    handleTabsClick() {
      this.handleSearch()
    },
    handleSearch() {
      this.loading = true

      this.handleFilters()
      const args = { filters: this.formHasValue(this.filters), ...this.page }
      this.$live.$api.live.listPage(args).then(
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
      const tab = this.tabs[this.activeState]
      if (tab) {
        this.filters.statusList = tab.statusList
      }
    },
    handleReset() {
      this.filters = {}
    },
    handleAdd() {
      this.$router.push({ name: 'LiveListAdd' })
    },
    async handleDelete(row) {
      const confirm = await this.$confirm(
        this.$t('是否删除当前') + this.$t('直播'),
        this.$t('common_prompt')
      )
      if (confirm) {
        const ids = []
        ids.push(row.id)
        const result = await this.$live.$api.live.delete(ids)
        if (result && result.code === '0') {
          this.handleSearch()
          this.$message({
            type: 'success',
            message: this.$t('操作成功')
          })
        }
      }
    },
    async handleCancel(row) {
      const confirm = await this.$confirm(
        this.$t('是否取消当前') + this.$t('直播'),
        this.$t('common_prompt')
      )
      if (confirm) {
        const params = {
          id: row.id,
          cancelTime: new Date()
        }
        const result = await this.$live.$api.live.cancel(params)
        if (result && result.code === '0') {
          this.handleSearch()
          this.$message({
            type: 'success',
            message: this.$t('操作成功')
          })
        }
      }
    },
    async handleSubmit(row) {
      const confirm = await this.$confirm(
        this.$t('是否提交当前') + this.$t('直播'),
        this.$t('common_prompt')
      )
      if (confirm) {
        const ids = []
        ids.push(row.id)
        const result = await this.$live.$api.live.submit({ ids: ids })
        if (result && result.code === '0') {
          this.handleSearch()
          this.$message({
            type: 'success',
            message: this.$t('操作成功')
          })
        }
      }
    },
    async handlePause(row) {
      const confirm = await this.$confirm(
        this.$t('暂停直播可能会导致观众流失，确定要暂停直播吗？'),
        this.$t('common_prompt')
      )
      if (confirm) {
        const result = await this.$live.$api.live.firePause({ id: row.id })
        if (result && result.code === '0') {
          this.handleSearch()
          this.$message({
            type: 'success',
            message: this.$t('操作成功')
          })
        }
      }
    },
    async handleEnd(row) {
      const confirm = await this.$confirm(
        this.$t('是否结束当前') + this.$t('直播'),
        this.$t('common_prompt')
      )
      if (confirm) {
        const result = await this.$live.$api.live.fireEnd({ id: row.id })
        if (result && result.code === '0') {
          this.handleSearch()
          this.$message({
            type: 'success',
            message: this.$t('操作成功')
          })
        }
      }
    },
    async handleBatchSubmit() {
      const confirm = await this.$confirm(
        this.$t('是否批量提交选中的') + this.$t('直播'),
        this.$t('common_prompt')
      )
      if (confirm) {
        const ids = []
        this.checked.forEach(item => {
          ids.push(item.id)
        })
        const result = await this.$live.$api.live.submit({ ids: ids })
        if (result && result.code === '0') {
          this.handleSearch()
          this.$message({
            type: 'success',
            message: this.$t('操作成功')
          })
        }
      }
    },
    async handleBatchAudit() {
      this.batchAudit = true
      this.auditDialogVisible = true
    },
    async handleAudit(row) {
      this.selected = row
      this.batchAudit = false
      this.auditDialogVisible = true
    },
    async handleAuditSubmit(value) {
      const ids = []
      if (this.batchAudit) {
        this.checked.forEach(item => {
          ids.push(item.id)
        })
      } else {
        ids.push(this.selected.id)
      }
      const params = { ids: ids }
      if (value.status === 1) {
        params.auditStatus = 2
      } else {
        params.auditStatus = 3
        params.auditRemark = value.remark
      }
      const result = await this.$live.$api.live.audit(params)
      if (result && result.code === '0') {
        this.handleSearch()
        this.$message({
          type: 'success',
          message: this.$t('操作成功')
        })
      }
    },
    checkedSelectable(row, index) {
      return (row.auditStatus === 0 || row.auditStatus === 1 || row.auditStatus === 3)
    },
    handleSelectionChange(value) {
      this.submitDisabled = true
      this.auditDisabled = true
      if (value && value.length > 0) {
        let hasNoSubmit = false
        let hasNoAudit = false
        value.forEach(item => {
          if (item.auditStatus !== 0 && item.auditStatus !== 3) {
            hasNoSubmit = true
          }
          if (item.auditStatus !== 1 && item.auditStatus !== 3) {
            hasNoAudit = true
          }
        })
        this.submitDisabled = hasNoSubmit
        this.auditDisabled = hasNoAudit
      }
    },
    handleLinkProduct(row) {
      this.selected = row
      // this.productDialogVisible = true
      this.$refs.productDialogVisible.visible = true
    },
    handleViewProduct(row) {
      this.selected = row
      // this.productDialogVisible = true
      this.$refs.productDialogVisible.visible = true
    },
    handleView(row) {
      this.$router.push({
        name: 'LiveListDetail',
        query: {
          id: row.id
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
