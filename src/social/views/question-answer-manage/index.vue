<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('提问人账号:')" prop="userTelephone">
            <el-input v-model="searchForm.userTelephone" name="searchForm_userTelephone"/>
          </ody-search-item>
          <ody-search-item :label="$t('提问内容:')" prop="consultContent">
            <el-input v-model="searchForm.consultContent" name="searchForm_consultContent"/>
          </ody-search-item>
          <ody-search-item :label="$t('提问时间:')" :space="2" prop="consultTime">
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
          <ody-search-item :label="$t('回答人账号:')" prop="answerUsername">
            <el-input v-model="searchForm.answerUsername" name="searchForm_answerUsername"/>
          </ody-search-item>
          <ody-search-item :label="$t('回答内容:')" prop="answerContent">
            <el-input v-model="searchForm.answerContent" name="searchForm_answerContent"/>
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
          <ody-search-item :label="$t('回复状态:')" prop="answerStatus">
            <el-select v-model="searchForm.answerStatus" :placeholder="$t('全部')" name="searchForm_answerStatus">
              <el-option
                v-for="item in answerStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('显示状态:')" prop="showStatus">
            <el-select v-model="searchForm.showStatus" :placeholder="$t('全部')" name="searchForm_showStatus">
              <el-option
                v-for="item in showStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('来源渠道:')" prop="channelCode">
            <el-select v-model="searchForm.channelCode" :popper-append-to-body="false" :placeholder="$t('全部')" name="searchForm_channelCode">
              <el-option
                v-for="item in channelMap"
                :key="item.channelCode"
                :label="item.channelName"
                :value="item.channelCode" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品名称:')" prop="chineseName">
            <el-input v-model="searchForm.chineseName" name="searchForm_chineseName"/>
          </ody-search-item>
          <ody-search-item :label="$t('商品编码:')" prop="code">
            <el-input v-model="searchForm.code" name="searchForm_code"/>
          </ody-search-item>
          <ody-search-item :label="$t('商品类目:')" prop="categoryIds">
            <ody-category-tree-select v-model="searchForm.categoryIds" :default-expand-level="1" :placeholder="$t('全部')" name="searchForm_categoryIds" value-consists-of="LEAF_PRIORITY"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button name="SocialQuestionAnswerManageList_handleSearchQuery" code="SocialQuestionAnswerManageList" size="small" type="primary" @click="handleSearchQuery">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button name="SocialQuestionAnswerManageExport_handleExport" code="SocialQuestionAnswerManageExport" size="small" @click="handleExport">{{ $t('导出') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :data="data"
          :columns="columns"
          :loading="loading"
          :operates="operates"
          :can-filter="false"
          name="data904"/>
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
    <social-question-answer-detail-dialog :visible.sync="detailDialogVisible" :comment.sync="detailInfo"/>
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
  answerContent: '',
  answerTime: [],
  channelCode: '',
  categoryIds: [],
  chineseName: '',
  code: ''
}
import constants from '@/utils/constants'
import SocialQuestionAnswerDetailDialog from '@/components/question-answer-detail-dialog'
export default {
  name: 'SocialQuestionAnswerManage',
  components: {
    SocialQuestionAnswerDetailDialog
  },
  data() {
    const self = this
    return {
      detailInfo: {},
      consultAnswerList: [],
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
          align: 'center'
        },
        {
          show: true,
          prop: 'consultTime',
          label: this.$t('提问时间'),
          align: 'center'
        },
        {
          show: true,
          prop: 'userTelephone',
          label: this.$t('提问人账号'),
          align: 'center'
        },
        {
          show: true,
          prop: 'content',
          label: this.$t('提问内容'),
          align: 'center'
        },
        {
          show: true,
          prop: 'categoryName',
          label: this.$t('商品类目'),
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
          prop: 'chineseName',
          label: this.$t('商品名称'),
          align: 'center'
        },
        {
          show: true,
          prop: 'answerStatusStr',
          label: this.$t('回答状态'),
          align: 'center'
        },
        {
          show: true,
          prop: 'showStatus',
          label: this.$t('显示状态'),
          align: 'center',
          render: (h, params) => {
            const show = params.row.showStatus === 1 ? this.$t('显示') : this.$t('已屏蔽')
            return (<span>{show}</span>)
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
        width: 300,
        align: 'center',
        list: [
          {
            label: this.$t('查看'),
            code: 'SocialQuestionAnswerManageDetail',
            disabled: false,
            method(index, row) {
              self.handleShowDetail(row)
            }
          },
          {
            label: this.$t('显示'),
            code: 'SocialQuestionAnswerManageShow',
            disabled: false,
            hidden(index, row) {
              return row.showStatus === 1
            },
            method(index, row) {
              self.handleChangeShowStatus(row, 1)
            }
          },
          {
            label: this.$t('屏蔽'),
            code: 'SocialQuestionAnswerManageForbid',
            disabled: false,
            hidden(index, row) {
              return row.showStatus === 0
            },
            method(index, row) {
              self.handleChangeShowStatus(row, 0)
            }
          },
          {
            label: this.$t('审核'),
            code: 'SocialQuestionAnswerManageAudit',
            disabled: false,
            hidden(index, row) {
              return row.status !== 2
            },
            method(index, row) {
              self.handlePass(row)
            }
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
    handleShowDetail(value) {
      this.detailDialogVisible = true
      this.detailInfo = value
      this.detailInfo.parentConsultItemId = value.consultItemId
      this.detailInfo.parentConsultHeadId = value.consultHeaderId
      const showStatusStr = value.showStatus === 1 ? this.$t('显示') : this.$t('已屏蔽')
      this.detailInfo.showStatusStr = showStatusStr
    },
    handlePass(row) {
      const param = {
        consultItemId: row.consultItemId,
        channelCode: row.channelCode
      }
      this.socialApi.auditStatus(param).then(res => {
        this.handleQuery()
      })
    },
    handleChangeShowStatus(value, showStatus) {
      const message = showStatus === 1 ? this.$t('您确定要显示吗') : this.$t('您确定要屏蔽吗')
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
      this.socialApi.getConsultTypeList(param).then(
        res => {
          this.consultTypeList = res.data.listObj
        }
      )
    },
    handleExport() {
      const param = Object.assign({}, this.searchForm)
      param.headerType = 1
      param.pageNo = this.page.current
      param.pageSize = this.page.size
      this.$portal.downloadFileByPost('/api/social-back-web/consult/exportConsultData.do', param)
    },
    async handleSearchQuery() {
      this.searchForm.currentPage = 1
      this.handleQuery()
    },
    async handleQuery() {
      // 日期选择查询处理
      const {
        consultTime: [consultTimeStart, consultTimeEnd],
        answerTime: [answerTimeStart, answerTimeEnd],
        ...param
      } = this.searchForm
      // const param = Object.assign({}, this.searchForm)
      param.consultTimeStart = consultTimeStart
      param.consultTimeEnd = consultTimeEnd
      param.answerTimeStart = answerTimeStart
      param.answerTimeEnd = answerTimeEnd
      param.headerType = 1
      param.pageNo = this.page.current
      param.pageSize = this.page.size
      this.loading = true
      try {
        this.socialApi.getConsultList(param).then(
          res => {
            var index = 1
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
                item.cosultTime = item.consultTime ? this.$portal.parseTime(item.consultTime, '{y}-{m}-{d} {h}:{i}:{s}') : ''
              })
            }
          }
        )
      } finally {
        this.loading = false
      }
    },
    initCode() {
      const vue = this
      vue.$social.$api.common.listMultiCode({
        categories: [
          'PRODUCT_COMMENT_PLATFORM_ID',
          'PRODUCT_COMMENT_CHECK_FLAG',
          'PRODUCT_COMMENT_TOP_FLAG',
          'PRODUCT_COMMENT_HAS_REPLY',
          'PRODUCT_COMMENT_HAS_PIC'
        ]
      }).then(res => {
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
