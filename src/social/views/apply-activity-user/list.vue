<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('会员账号')" :space="1">
            <el-input v-model="filters.userAccount" :placeholder="$t('请输入') + $t('会员手机号')" name="searchForm_filters_userAccount" />
          </ody-search-item>
          <ody-search-item :label="$t('会员昵称')" :space="1">
            <el-input v-model="filters.userNickname" :placeholder="$t('请输入') + $t('会员昵称')" name="searchForm_filters_userNickname" />
          </ody-search-item>
          <ody-search-item :label="$t('会员手机号')" :space="1">
            <el-input v-model="filters.userMobile" :placeholder="$t('请输入') + $t('会员手机号')" name="searchForm_filters_userMobile" />
          </ody-search-item>
          <ody-search-item :label="$t('sign_up')" :space="1">
            <el-input v-model="filters.applyUser" :placeholder="$t('请输入') + $t('sign_up')" name="searchForm_filters_applyUser" />
          </ody-search-item>
          <ody-search-item :label="$t('phone_of_applicant')" :space="1">
            <el-input v-model="filters.applyUserMobile" :placeholder="$t('请输入') + $t('phone_of_applicant')" name="searchForm_filters_applyUserMobile" />
          </ody-search-item>
          <ody-search-item :label="$t('报名状态')" :space="1">
            <ody-dict-select ref="status" v-model="filters.status" :is-number="false" pool="social" category="APPLIY_ACTIVITY_USER_STATUS" name="status" />
          </ody-search-item>
          <ody-search-item :label="$t('报名时间')">
            <ody-date-range-picker ref="applyTimeRange" v-model="applyTimeRange" :default="7" :range-separator="$t('至')" type="datetimer" name="applyTime" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="ApplyActivityUser_listPage_search"
          code="ApplyActivityUser_listPage"
          size="small"
          type="primary"
          @click="search"
        >{{ $t('common_select') }}</ody-button>
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
          name="ApplyActivityUser_exportData"
          code="ApplyActivityUser_exportData"
          size="small"
        >{{ $t('batch_export') }}</ody-batch-export-button>
        <el-popover placement="bottom" with="160" trigger="hover">
          <div class="btn-popover">
            <ody-export-task-button
              pool="social"
              task-type="applyActivityUserExport"
              name="ApplyActivityUser_seeExportTask"
              code="ApplyActivityUser_exportData"
              type="primary"
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
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="true"
          name="applyActivityUserTable"
        >
          <template slot="statusStr" slot-scope="scope">
            <div>
              {{ scope.row.statusStr }}
              <el-tooltip v-if="scope.row.status === 2" :content="scope.row.cancelReason" class="item" effect="dark" placement="top">
                <i class="el-icon-info" />
              </el-tooltip>
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
          @size-change="search"
          @current-change="search"
        />
      </div>
    </ody-list-table-area>
    <!-- 取消报名弹框 -->
    <ody-dialog :visible.sync="showCancelDialogModel" :title="$t('cancel_sign_up')" width="20%">
      <div>
        <el-form ref="form" :model="cancelParams" label-width="80px" class="form">
          <el-form-item :label="$t('cancel_reason')" :rules="rules.cancelReason" prop="cancelReason"> <!-- 输入备注 -->
            <el-col :span="15">
              <el-input v-model="cancelParams.cancelReason" :placeholder="$t('请输入') + $t('cancel_reason')" name="dataForm_remark" type="textarea" max-length="100"/>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="center">
          <el-button size="small" @click="cancelParams = {};showCancelDialogModel = false">{{ $t('取消') }}</el-button>
          <el-button size="small" type="primary" @click="cancelApply">{{ $t('确认') }}</el-button>
        </el-row>
      </span>
    </ody-dialog>
  </section>
</template>
<script>
export default {
  name: 'ApplyActivityUserList',
  data() {
    return {
      exportModel: {
        exportApi: ['social-back-web', 'applyActivityUser', 'exportData'],
        pool: 'social',
        taskType: 'applyActivityUserExport',
        async: true,
        getExportData: () => {
          this.handleFilters()
          return { filters: this.filters }
        }
      },
      loading: false,
      list: [],
      showCancelDialogModel: false,
      cancelParams: {
        id: null,
        allpyId: null,
        cancelReason: null
      },
      cancelId: null,
      rules: {
        cancelReason: [
          { required: true, message: this.$t('请输入') + this.$t('cancel_reason'), trigger: 'change' },
          { min: 1, max: 100, message: this.$t('长度在') + ' 1 ' + this.$t('到') + ' 100 ' + this.$t('个字符'), trigger: 'change' }
        ]
      },
      columns: [
        {
          label: this.$t('会员账号'),
          prop: 'userAccount',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('会员昵称'),
          prop: 'userNickname',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('会员手机号'),
          prop: 'userMobile',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('name_of_applicant'),
          prop: 'applyUser',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('phone_of_applicant'),
          prop: 'applyUserMobile',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('报名时间'),
          prop: 'applyTimeStr',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('remark_of_applicant'),
          prop: 'remark',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('报名状态'),
          slot: 'statusStr',
          show: true,
          align: 'right',
          minWidth: 120
        }
      ],
      operates: {
        fixed: 'right',
        width: 120,
        align: 'center',
        list: [
          {
            label: this.$t('cancel_sign_up'),
            code: 'ApplyActivityUser_cancel',
            method: (index, row) => {
              this.showCancelApply(row)
            },
            hidden(index, row) {
              if (row.status === 2) {
                return true
              }
            }
          }
        ]
      },
      statusDict: {},
      applyTimeRange: [],
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
      const categories = []
      categories.push('APPLIY_ACTIVITY_USER_STATUS')
      const res = await this.$social.$api.common.listMultiCode({ 'categories': categories })
      this.statusDict = res.data['APPLIY_ACTIVITY_USER_STATUS']
      this.search()
    },
    search() {
      this.loading = true
      this.handleFilters()
      const args = { filters: this.filters, ...this.page }
      this.$social.$api.applyActivityUser.listPage(args).then(
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
      if (this.applyTimeRange && this.applyTimeRange.length > 1) {
        this.filters.startApplyTime = this.applyTimeRange[0]
        this.filters.endApplyTime = this.applyTimeRange[1]
      } else {
        delete this.filters.startApplyTime
        delete this.filters.endApplyTime
      }
    },
    reset() {
      this.filters = this.initFilters()
      this.applyTimeRange = []
      this.$refs.applyTimeRange.setDefault(7)
    },
    showCancelApply(row) {
      this.cancelParams = {}
      this.cancelParams.id = row.id
      this.cancelParams.applyId = row.applyId
      this.showCancelDialogModel = true
    },
    async cancelApply() {
      if (!this.cancelParams.cancelReason || this.cancelParams.cancelReason === '') {
        this.$message({
          type: 'error',
          message: this.$t('取消原因不能为空')
        })
        return
      }
      const result = await this.$social.$api.applyActivityUser.cancelApply(
        this.cancelParams
      )
      if (result && result.code === '0') {
        this.showCancelDialogModel = false
        this.search()
        this.$message({
          type: 'success',
          message: this.$t('取消成功')
        })
      }
    },
    initFilters() {
      return {
        userNickname: null,
        userMobile: null,
        applyUser: null,
        applyUserMobile: null,
        status: this.$route.query.status,
        applyId: this.$route.query.applyId
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
</style>
