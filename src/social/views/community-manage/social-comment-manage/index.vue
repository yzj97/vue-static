<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('帖子标题:')">
            <el-input v-model="searchForm.filters.postTitle" name="searchForm_filters_postTitle"/>
          </ody-search-item>
          <ody-search-item :label="$t('帖子类型:')">
            <ody-dict-select ref="type" v-model="searchForm.filters.type" :is-number="false" pool="social" category="POST_TYPE" name="searchForm_filters_type" />
          </ody-search-item>
          <ody-search-item :label="$t('评论人手机号:')">
            <el-input v-model="searchForm.filters.mobile" name="searchForm_filters_mobile" maxlength="11"/>
          </ody-search-item>
          <ody-search-item :label="$t('审核状态:')">
            <el-select v-model="searchForm.filters.status" :placeholder="$t('全部')" name="searchForm_filters_status">
              <el-option
                v-for="item in postCommentStatusList"
                :key="item.code"
                :label="item.name"
                :value="item.code" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('评论内容:')">
            <el-input v-model="searchForm.filters.content" name="searchForm_filters_content"/>
          </ody-search-item>
          <ody-search-item :label="$t('评论时间:')" :space="2">
            <ody-date-range-picker
              ref="dateRangePicker"
              v-model="createTime"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              :default="7"
              name="searchForm_filters_createTime"
              type="datetimer"
              range-separator="-" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button name="postCommentListPage_handleQuery" code="postCommentListPage" size="small" type="primary" @click="handleQuery">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button :disabled="batchCancelAuditButtonDisabled" name="postCommentBatchCancelAudit" code="postCommentCancelAudit" size="small" type="primary" @click="handleCancelAudit(null)">{{ $t('批量撤销审核') }}</ody-button>
        <ody-button :disabled="batchAuditButtonDisabled" name="postCommentBatchAudit_handleBatchConfirm" code="postCommentBatchAuditSuccess" size="small" type="primary" @click="handleBatchConfirm">{{ $t('批量审核') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :data="data"
          :columns="columns"
          :loading="loading"
          :operates="operates"
          :checked.sync="checkedList"
          :multiple="true"
          :can-filter="true"
          name="data582"
          @selection-change="handleSelectionChange">
          <template slot="status" slot-scope="scope">
            <div>
              {{ statusMap[scope.row.status] }}
              <el-tooltip v-if="scope.row.status === 2" :content="scope.row.remarks" class="item" effect="dark" placement="top">
                <i class="el-icon-info" />
              </el-tooltip>
            </div>
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />

      </div>
    </ody-list-table-area>
    <post-comment-audit-dialog :visible.sync="auditDialogVisible" @ok="handleBatchConfirmOk"/>
  </div>
</template>

<script>
import PostCommentAuditDialog from '@/components/post-comment-audit-dialog'
export default {
  name: 'SocialProductCommentManage',
  components: {
    PostCommentAuditDialog
  },
  data() {
    const self = this
    return {
      auditDialogVisible: false,
      batchAuditButtonDisabled: true,
      batchCancelAuditButtonDisabled: true,
      singleAudit: false,
      selected: {},
      postCommentStatusList: [],
      statusMap: {},
      searchForm: getDefaultSearchForm(),
      loading: false,
      data: [],
      createTime: [],
      columns: [
        {
          show: true,
          prop: 'postTitle',
          label: this.$t('帖子标题'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'typeStr',
          label: this.$t('帖子类型'),
          align: 'center'
        },
        {
          show: true,
          prop: 'mobile',
          label: this.$t('评论人手机号'),
          align: 'center'
        },
        {
          show: true,
          slot: 'status',
          label: this.$t('审核状态'),
          align: 'center'
        },
        {
          show: true,
          prop: 'content',
          label: this.$t('评论内容'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'createTimeStr',
          label: this.$t('评论时间'),
          align: 'center',
          minWidth: 200
        }
      ],
      operates: {
        width: 200,
        align: 'center',
        fixed: 'right',
        list: [
          {
            label: this.$t('撤销审核'),
            code: 'postCommentCancelAudit',
            hidden(index, row) {
              return row.status !== 1
            },
            method(index, row) {
              self.handleCancelAudit(row)
            }
          },
          {
            label: this.$t('审核'),
            code: 'postCommentAuditSuccess',
            hidden(index, row) {
              return row.status !== 0
            },
            method(index, row) {
              self.handleSingleAudit(row)
            }
          }
        ]
      },
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      checkedList: []
    }
  },
  computed: {

  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.initCode()
      this.handleQuery()
      this.initTime()
    },
    initCode() {
      this.$social.$api.common.listMultiCode({
        categories: ['POST_COMMENT_STATUS']
      }).then(res => {
        this.postCommentStatusList = res.data.POST_COMMENT_STATUS

        this.statusMap = this.postCommentStatusList.reduce((rtv, item) => {
          rtv[item.code] = this.$t(item.name)
          return rtv
        }, {})
      })
    },
    initTime() {
      const vue = this
      vue.$refs.dateRangePicker.setDefault(7)
      // vue.createTime = []
    },
    async handleQuery() {
      const vue = this
      if (vue.loading) {
        return
      }
      vue.searchForm.page = vue.page.current
      vue.searchForm.limit = vue.page.size
      if (vue.createTime) {
        vue.searchForm.filters.startCreateTime = vue.createTime[0]
        vue.searchForm.filters.endCreateTime = vue.createTime[1]
        delete vue.searchForm.createTime
      } else {
        vue.searchForm.filters.startCreateTime = null
        vue.searchForm.filters.endCreateTime = null
      }

      vue.loading = true

      try {
        const res = await vue.$social.$api.socialApi.postCommentListPage(vue.searchForm)
        if (res.data) {
          vue.data = res.data
        } else {
          vue.data = []
        }
        vue.checkedList = []
        vue.page.total = res.total
      } finally {
        vue.loading = false
      }
    },
    handleReset() {
      this.searchForm = getDefaultSearchForm()
      this.initTime()
      // this.handleQuery()
    },
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
        await this.handleQuery()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.handleQuery()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleCancelAudit(val) {
      const vue = this
      const ids = []
      if (val) {
        ids.push(val.id)
      } else {
        vue.checkedList.forEach(item => {
          ids.push(item.id)
        })
      }
      vue.$confirm(vue.$t('确定撤销审核吗') + '?', vue.$t('确认提示'), {
        confirmButtonText: vue.$t('确定'),
        cancelButtonText: vue.$t('取消'),
        type: 'warning'
      }).then(() => {
        vue.$social.$api.socialApi.newPostCommentBatchCancelAudit({ ids: ids }).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.handleQuery()
        })
      })
    },
    handleSelectionChange() {
      this.batchCancelAuditButtonDisabled = false
      this.batchAuditButtonDisabled = false

      if (this.checkedList.length > 0) {
        for (let i = 0; i < this.checkedList.length; i++) {
          const item = this.checkedList[i]
          if (item.status !== 0) {
            this.batchAuditButtonDisabled = true
          }
          if (item.status !== 1) {
            this.batchCancelAuditButtonDisabled = true
          }
        }
      } else {
        this.batchCancelAuditButtonDisabled = true
        this.batchAuditButtonDisabled = true
      }
    },
    handleSingleAudit(val) {
      this.singleAudit = true
      this.selected = val
      this.auditDialogVisible = true
    },
    handleBatchConfirm(status) {
      this.singleAudit = false
      this.auditDialogVisible = true
    },
    handleBatchConfirmOk(result) {
      const vue = this
      const ids = []
      if (this.singleAudit) {
        ids.push(this.selected.id)
      } else {
        for (let i = 0; i < this.checkedList.length; i++) {
          ids.push(this.checkedList[i].id)
        }
      }
      if (result.status === 1) {
        vue.$social.$api.socialApi.postCommentBatchAuditSuccess({ ids: ids }).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.handleQuery()
        })
      } else {
        vue.$social.$api.socialApi.postCommentBatchAuditFailure({ ids: ids, remarks: result.remark }).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.handleQuery()
        })
      }
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign(
    {
      page: 1,
      limit: 10,
      filters: {
      }
    }
  )
}
</script>

<style lang='scss' scoped>
.table-img {
  display: flex;
  flex-wrap: wrap;
  img {
    margin-left: 10px;
    width: 80px;
    height: 40px;
  }
  img:hover {
    width: 200px;
    height: 200px;
  }
}
</style>
