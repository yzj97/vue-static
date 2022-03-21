<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('咨询人账号:')" prop="userTelephone">
            <el-input v-model="searchForm.userTelephone" :placeholder="$t('请输入')" name="searchForm_userTelephone" />
          </ody-search-item>
          <ody-search-item :label="$t('咨询内容:')" prop="consultContent">
            <el-input v-model="searchForm.consultContent" :placeholder="$t('请输入')" name="searchForm_consultContent" />
          </ody-search-item>
          <ody-search-item :label="$t('咨询类型:')" prop="consultType">
            <el-select v-model="searchForm.consultType" :placeholder="$t('全部')" name="searchForm_consultType">
              <el-option
                v-for="item in consultTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('显示状态:')" prop="showStatus">
            <el-select v-model="searchForm.showStatus" :placeholder="$t('全部')" name="searchForm_showStatus">
              <el-option
                v-for="item in showStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('回复状态:')" prop="answerStatus">
            <el-select v-model="searchForm.answerStatus" :placeholder="$t('全部')" name="searchForm_answerStatus">
              <el-option
                v-for="item in answerStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('咨询时间:')" :space="2" prop="consultTime">
            <!-- <el-col :span="12">
              <el-date-picker
                v-model="searchForm.consultTimeStart"
                :placeholder="$t('开始日期')"
                name="searchForm_consultTimeStart"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              />
            </el-col>
            <el-col :span="12">
              <el-date-picker
                v-model="searchForm.consultTimeEnd"
                :placeholder="$t('结束日期')"
                name="searchForm_consultTimeEnd"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              />
            </el-col> -->
            <ody-date-range-picker
              v-model="searchForm.consultTime"
              name="consultTime"
              value-format="yyyy-MM-dd"
              type="datetimer"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </ody-search-item>
          <ody-search-item :label="$t('商品类目:')" prop="categoryIds">
            <ody-category-tree-select
              v-model="searchForm.categoryIds"
              :default-expand-level="1"
              :placeholder="$t('全部')"
              name="searchForm_categoryIds"
              value-consists-of="LEAF_PRIORITY"
            />
          </ody-search-item>
          <ody-search-item :label="$t('商品名称:')" prop="chineseName">
            <el-input v-model="searchForm.chineseName" :placeholder="$t('请输入')" name="searchForm_chineseName" />
          </ody-search-item>
          <ody-search-item :label="$t('商品编码:')" prop="code">
            <el-input v-model="searchForm.code" :placeholder="$t('请输入')" name="searchForm_code" />
          </ody-search-item>
          <ody-search-item :label="$t('回复人账号:')" prop="answerUsername">
            <el-input v-model="searchForm.answerUsername" :placeholder="$t('请输入')" name="searchForm_answerUsername" />
          </ody-search-item>
          <ody-search-item :label="$t('回答时间:')" :space="2" prop="answerTime">
            <!-- <el-col :span="12">
              <el-date-picker
                v-model="searchForm.answerTimeStart"
                :placeholder="$t('开始日期')"
                name="searchForm_answerTimeStart"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              />
            </el-col>
            <el-col :span="12">
              <el-date-picker
                v-model="searchForm.answerTimeEnd"
                :placeholder="$t('结束日期')"
                name="searchForm_answerTimeEnd"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              />
            </el-col> -->
            <ody-date-range-picker
              v-model="searchForm.answerTime"
              name="answerTime"
              value-format="yyyy-MM-dd"
              type="datetimer"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </ody-search-item>
          <ody-search-item :label="$t('来源渠道:')" prop="channelCode">
            <el-select v-model="searchForm.channelCode" :popper-append-to-body="false" :placeholder="$t('全部')" name="searchForm_channelCode">
              <el-option
                v-for="item in channelMap"
                :key="item.channelCode"
                :label="item.channelName"
                :value="item.channelCode"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="SocialConsultManageList_handleSearchQuery"
          code="SocialConsultManageList"
          size="small"
          type="primary"
          @click="handleSearchQuery"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          name="SocialConsultManageExport_handleExport"
          code="SocialConsultManageExport"
          size="small"
          @click="handleExport"
        >{{ $t('导出') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :data="data"
          :columns="columns"
          :loading="loading"
          :operates="operates"
          :can-filter="false"
          name="data062"
        />
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
    <social-consult-manage-reply-dialog
      :visible.sync="replyDialogVisible"
      :comment.sync="replyInfo"
    />
    <social-consult-manage-detail-dialog
      :visible.sync="detailDialogVisible"
      :comment.sync="detailInfo"
    />
  </div>
</template>
<script>
const searchForm = {
  headerType: 0,
  userTelephone: '',
  consultContent: '',
  consultType: '',
  showStatus: '',
  answerStatus: '',
  consultTime: [],
  answerUsername: '',
  answerTime: [],
  channelCode: '',
  categoryIds: [],
  chineseName: '',
  code: ''
}
import constants from '@/utils/constants'
import SocialConsultManageReplyDialog from '@/components/consult-manage-reply-dialog'
import SocialConsultManageDetailDialog from '@/components/consult-manage-detail-dialog'
export default {
  name: 'SocialConsultManage',
  components: {
    SocialConsultManageReplyDialog,
    SocialConsultManageDetailDialog
  },
  data() {
    const self = this
    return {
      replyInfo: {},
      detailInfo: {},
      consultAnswerList: [],
      replyDialogVisible: false,
      detailDialogVisible: false,
      channelList: [],
      channelMap: {},
      consultTypeList: {},
      answerStatusList: constants.ANSWER_STATUS_LIST,
      showStatusList: constants.SHOW_STATUS_LIST,
      answerStatusMap: constants.ANSWER_STATUS_MAP,
      auditStatusMap: constants.AUDIT_STATUS_MAP,
      searchForm: {
        ...searchForm
      },
      loading: false,
      data: [],
      columns: [
        {
          show: true,
          prop: 'index',
          label: this.$t('序号'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'consultTimeStr',
          label: this.$t('咨询时间'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'userTelephone',
          label: this.$t('咨询人账号'),
          align: 'center'
        },
        {
          show: true,
          prop: 'code',
          label: this.$t('商品编码'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'categoryName',
          label: this.$t('商品类目'),
          align: 'center'
        },
        {
          show: true,
          prop: 'chineseName',
          label: this.$t('商品名称'),
          align: 'center'
        },
        {
          show: true,
          prop: 'consultTypeName',
          label: this.$t('咨询类型'),
          align: 'center'
        },
        {
          show: true,
          prop: 'content',
          label: this.$t('内容'),
          align: 'center'
        },
        {
          show: true,
          prop: 'answerStatusStr',
          label: this.$t('回复状态'),
          align: 'center'
        },
        {
          show: true,
          prop: 'showStatus',
          label: this.$t('显示状态'),
          align: 'center',
          render: (h, params) => {
            const show =
              params.row.showStatus === 1 ? this.$t('显示') : this.$t('已屏蔽')
            return <span>{show}</span>
          }
        },
        {
          show: true,
          prop: 'channelName',
          label: this.$t('来源渠道'),
          align: 'center'
        },
        {
          show: true,
          prop: 'statusStr',
          label: this.$t('审核状态'),
          align: 'center'
        }
      ],
      operates: {
        width: 240,
        align: 'center',
        fixed: 'right',
        list: [
          {
            label: this.$t('查看'),
            disabled: false,
            method(index, row) {
              self.handleShowDetail(row)
            },
            code: 'SocialConsultManageView'
          },
          {
            label: this.$t('显示'),
            disabled: false,
            hidden(index, row) {
              return row.showStatus === 1
            },
            method(index, row) {
              self.handleChangeShowStatus(row, 1)
            },
            code: 'SocialConsultManageShow'
          },
          {
            label: this.$t('屏蔽'),
            disabled: false,
            hidden(index, row) {
              return row.showStatus === 0
            },
            method(index, row) {
              self.handleChangeShowStatus(row, 0)
            },
            code: 'SocialConsultManageHidden'
          },
          {
            label: this.$t('回复'),
            disabled: false,
            method(index, row) {
              self.handleReply(row)
            },
            code: 'SocialConsultManageReply'
          },
          {
            label: this.$t('审核'),
            disabled: false,
            hidden(index, row) {
              return row.status !== 2
            },
            method(index, row) {
              self.handlePass(row)
            },
            code: 'SocialConsultManageAudit'
          }
        ]
      },
      page: {
        size: 10,
        current: 1,
        total: 0
      }
    }
  },
  mounted() {
    try {
      this.socialApi = this.$social.$api.socialApi
      this.init()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async init() {
      await this.initChannel()
      this.getConsultTypeList()
      this.handleQuery()
    },
    handleReset() {
      this.searchForm = { ...searchForm }
    },
    handleReply(value) {
      this.replyDialogVisible = true
      this.replyInfo.consultItemId = value.consultItemId
      this.replyInfo.headId = value.consultHeaderId
    },
    handleShowDetail(value) {
      const vue = this
      vue.detailInfo = value
      vue.detailDialogVisible = true
      const param = {
        consultItemId: value.consultItemId,
        currentPage: 1,
        itemsPerPage: 10
      }
      const showStatusStr =
        value.showStatus === 1 ? vue.$t('显示') : vue.$t('已屏蔽')
      vue.detailInfo.showStatusStr = showStatusStr
      vue.socialApi.getConsultAnswerList(param).then(res => {
        if (res.code === '0' && res.data) {
          vue.consultAnswerList = res.data.listObj
          const lastData =
            vue.consultAnswerList[this.consultAnswerList.length - 1]
          if (lastData) {
            vue.detailInfo.answerTime = lastData.answerTime
              ? vue.$portal.parseTime(
                lastData.answerTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
              : ''
            vue.detailInfo.answerUsername = lastData.answerUsername
          }
        }
      })
    },
    handlePass(row) {
      const vue = this
      const param = {
        consultItemId: row.consultItemId,
        channelCode: row.channelCode
      }
      vue
        .$confirm(vue.$t('确定审核通过？'), vue.$t('确认提示'), {
          confirmButtonText: vue.$t('确定'),
          cancelButtonText: vue.$t('取消'),
          type: 'warning'
        })
        .then(() => {
          vue.socialApi.auditStatus(param).then(res => {
            vue.$message.success(vue.$t('操作成功'))
            vue.handleQuery()
          })
        })
    },
    handleChangeShowStatus(value, showStatus) {
      const message =
        showStatus === 1 ? this.$t('您确定要显示吗') : this.$t('您确定要屏蔽吗')
      this.$confirm(message, this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        const param = {
          consultHeaderId: value.consultHeaderId,
          consultItemId: value.consultItemId,
          showStatus: showStatus
        }
        this.socialApi.updateConsultStatus(param).then(res => {
          this.handleQuery()
        })
      })
    },
    async getConsultTypeList() {
      const param = {
        currentPage: 1,
        id: '',
        itemsPerPage: 10
      }
      this.socialApi.getConsultTypeList(param).then(res => {
        this.consultTypeList = res.data.listObj
      })
    },
    handleExport() {
      const param = this.$portal.deepClone(this.searchForm)
      this.setTime(param)
      param.headerType = 0
      param.pageNo = this.page.current
      param.pageSize = this.page.size
      this.$portal.downloadFileByPost(
        '/api/social-back-web/consult/exportConsultData.do',
        param
      )
    },
    setTime(param) {
      if (param.consultTimeStart) {
        param.consultTimeStart = param.consultTimeStart + ' 00:00:01'
      }
      if (param.consultTimeEnd) {
        param.consultTimeEnd = param.consultTimeEnd + ' 23:59:59'
      }
      if (param.answerTimeStart) {
        param.answerTimeStart = param.answerTimeStart + ' 00:00:01'
      }
      if (param.answerTimeEnd) {
        param.answerTimeEnd = param.answerTimeEnd + ' 23:59:59'
      }
    },
    async handleSearchQuery() {
      this.handleQuery()
    },
    async handleQuery() {
      // 日期选择查询处理
      const {
        consultTime: [consultTimeStart, consultTimeEnd],
        answerTime: [answerTimeStart, answerTimeEnd],
        ...param
      } = this.searchForm
      // const param = this.$portal.deepClone(this.searchForm)
      this.setTime(param)
      param.consultTimeStart = consultTimeStart
      param.consultTimeEnd = consultTimeEnd
      param.answerTimeStart = answerTimeStart
      param.answerTimeEnd = answerTimeEnd
      param.headerType = 0
      param.currentPage = this.page.current
      param.itemsPerPage = this.page.size
      this.loading = true
      try {
        const res = await this.socialApi.getConsultList(param)
        let index = 1
        this.page.total = res.data.total
        if (res.data) {
          this.data = res.data.listObj
          this.data.forEach(item => {
            const channel = this.channelMap[item.channelCode]
            item.channelName = channel ? channel.channelName : ''
            item.index = index
            index++
            item.answerStatusStr = this.answerStatusMap[item.answerStatus]
            item.statusStr = this.auditStatusMap[item.status]
            item.consultTimeStr = item.consultTime
          })
        }
      } finally {
        this.loading = false
      }
    },
    initCode() {
      const vue = this
      vue.$social.$api.common
        .listMultiCode({
          categories: [
            'PRODUCT_COMMENT_PLATFORM_ID',
            'PRODUCT_COMMENT_CHECK_FLAG',
            'PRODUCT_COMMENT_TOP_FLAG',
            'PRODUCT_COMMENT_HAS_REPLY',
            'PRODUCT_COMMENT_HAS_PIC'
          ]
        })
        .then(res => {
          vue.platformIdList = res.data.PRODUCT_COMMENT_PLATFORM_ID
          vue.checkFlagList = res.data.PRODUCT_COMMENT_CHECK_FLAG
          vue.topflagList = res.data.PRODUCT_COMMENT_TOP_FLAG
          vue.hasReplyList = res.data.PRODUCT_COMMENT_HAS_REPLY
          vue.hasPicList = res.data.PRODUCT_COMMENT_HAS_PIC
        })
    },
    async initChannel() {
      const vue = this
      const res = await vue.$social.$api.common.listAllChannels({})
      if (res && res.code === '0') {
        vue.channelMap = res.data
      }
    },
    handlePageSizeChange(size) {
      this.page.size = size
      this.handleQuery()
    },
    handlePageCurrentChange() {
      this.handleQuery()
    }
  }
}
</script>

<style scoped>
</style>
