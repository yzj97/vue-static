<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('评论人手机号:')" prop="userUsername">
            <el-input v-model="searchForm.userUsername" name="searchForm_userUsername" />
          </ody-search-item>
          <ody-search-item :label="$t('评论内容:')" prop="content">
            <el-input v-model="searchForm.content" name="searchForm_content" />
          </ody-search-item>
          <ody-search-item :label="$t('评论来源:')" prop="platformId">
            <el-select v-model="searchForm.platformId" :placeholder="$t('全部')" name="searchForm_platformId">
              <el-option
                v-for="item in platformIdList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('审核状态:')" prop="checkFlag">
            <el-select v-model="searchForm.checkFlag" :placeholder="$t('全部')" name="searchForm_checkFlag">
              <el-option
                v-for="item in checkFlagList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('评论时间:')" :space="2" prop="createTime">
            <ody-date-range-picker
              v-model="searchForm.createTime"
              name="searchForm_createTime"
              value-format="yyyy-MM-dd"
              type="datetimer"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </ody-search-item>
          <ody-search-item :label="$t('评论字数:')" prop="contentLengthMin">
            <el-col :span="11">
              <el-input v-model="searchForm.contentLengthMin" name="searchForm_contentLengthMin" type="number" />
            </el-col>
            <el-col :span="2" class="text-center">
              <span>{{ $t('至') }}</span>
            </el-col>
            <el-col :span="11">
              <el-input v-model="searchForm.contentLengthMax" name="searchForm_contentLengthMax" type="number" />
            </el-col>
          </ody-search-item>
          <ody-search-item :label="$t('商品类目:')" prop="categoryIds">
            <ody-tree-select
              v-model="searchForm.categoryIds"
              :default-expand-level="1"
              :multiple="true"
              :append-to-body="true"
              :options="categoryTreeData"
              :placeholder="$t('全部')"
              name="searchForm_categoryIds"
              value-consists-of="LEAF_PRIORITY"
            />
          </ody-search-item>
          <ody-search-item :label="$t('商品名称:')" prop="mpName">
            <el-input v-model="searchForm.mpName" name="searchForm_mpName" />
          </ody-search-item>
          <ody-search-item :label="$t('商品编码:')" prop="mpCode">
            <el-input v-model="searchForm.mpCode" name="searchForm_mpCode" />
          </ody-search-item>
          <ody-search-item :label="$t('商品评分:')" prop="startRate">
            <el-col :span="11">
              <el-input v-model="searchForm.startRate" name="searchForm_startRate" type="number" />
            </el-col>
            <el-col :span="2" class="text-center">
              <span>{{ $t('至') }}</span>
            </el-col>
            <el-col :span="11">
              <el-input v-model="searchForm.endRate" name="searchForm_endRate" type="number" />
            </el-col>
          </ody-search-item>
          <ody-search-item :label="$t('审核人账号:')" prop="auditorName">
            <el-input v-model="searchForm.auditorName" name="searchForm_auditorName" />
          </ody-search-item>
          <ody-search-item :label="$t('审核时间:')" :space="2" prop="auditTime">
            <!-- <el-col :span="12">
              <el-date-picker
                v-model="searchForm.auditStartTime"
                :placeholder="$t('开始日期')"
                name="searchForm_auditStartTime"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              />
            </el-col>
            <el-col :span="12">
              <el-date-picker
                v-model="searchForm.auditEndTime"
                :placeholder="$t('结束日期')"
                name="searchForm_auditEndTime"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              />
            </el-col> -->
            <ody-date-range-picker
              v-model="searchForm.auditTime"
              name="searchForm_auditTime"
              value-format="yyyy-MM-dd"
              type="datetimer"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </ody-search-item>
          <ody-search-item :label="$t('订单编号:')" prop="orderCode">
            <el-input v-model="searchForm.orderCode" name="searchForm_orderCode" />
          </ody-search-item>
          <ody-search-item :label="$t('置顶:')" prop="topflag">
            <el-select v-model="searchForm.topflag" :placeholder="$t('全部')" name="searchForm_topflag">
              <el-option
                v-for="item in topflagList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('是否回复:')" prop="hasReply">
            <el-select v-model="searchForm.hasReply" :placeholder="$t('全部')" name="searchForm_hasReply">
              <el-option
                v-for="item in hasReplyList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('评论图片:')" prop="hasPic">
            <el-select v-model="searchForm.hasPic" :placeholder="$t('全部')" name="searchForm_hasPic">
              <el-option
                v-for="item in hasPicList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
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
          name="SocialProductCommentManageList_handleQuery"
          code="SocialProductCommentManageList"
          size="small"
          type="primary"
          @click="handleQuery"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="SocialProductCommentManageBatchPass_handleBatchConfirmPass"
          code="SocialProductCommentManageBatchPass"
          size="small"
          type="primary"
          @click="handleBatchConfirmPass"
        >{{ $t('批量审核通过') }}</ody-button>
        <ody-button
          name="SocialProductCommentManageBatchNotPass_handleBatchConfirmNotPass"
          code="SocialProductCommentManageBatchNotPass"
          size="small"
          type="primary"
          @click="handleBatchConfirmNotPass"
        >{{ $t('批量审核不通过') }}</ody-button>
        <!--<ody-button
          name="SocialProductCommentManageChoosePass_handleQueryConfirmPass"
          code="SocialProductCommentManageChoosePass"
          size="small"
          type="primary"
          @click="handleQueryConfirmPass"
        >{{ $t('筛选条件下全部审核通过') }}</ody-button>-->
        <ody-button
          :disabled="searchForm.selecteState == 2"
          name="ProductCommentManageBatchCommentatorSee_handleBatchCommentatorSee"
          code="ProductCommentManageBatchCommentatorSee"
          size="small"
          type="primary"
          @click="handleBatchCommentatorSee"
        >{{ $t('批量设置仅评论人可见') }}</ody-button>
        <ody-button
          :disabled="searchForm.selecteState == 2"
          name="ProductCommentManageBatchCommentatorSee_handleBatchAllSee"
          code="ProductCommentManageBatchAllSee"
          size="small"
          type="primary"
          @click="handleBatchAllSee"
        >{{ $t('批量设置全部可见') }}</ody-button>
        <ody-button
          name="SocialProductCommentManageExport_handleExport"
          code="SocialProductCommentManageExport"
          size="small"
          @click="handleExport"
        >{{ $t('导出') }}</ody-button>
      </div>
      <div slot="tabs">
        <el-tabs v-model="searchForm.selecteState" name="searchForm_selecteState" @tab-click="handleTabsClick">
          <el-tab-pane :label="$t('全部评论')" name="0" />
          <el-tab-pane :label="$t('初次评论')" name="1" />
          <el-tab-pane :label="$t('追加评论')" name="2" />
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          :data="data"
          :columns="columns"
          :loading="loading"
          :checked.sync="checked"
          :selectable="handleSelectable"
          :multiple="true"
          :operates="operates"
          :is-tree="true"
          :can-filter="false"
          value-consists-of="ALL"
          name="data637"
          row-key="id"
        >
          <template slot="picList" slot-scope="scope">
            <div class="table-img">
              <img v-for="url in scope.row.picList" :src="url" :key="url" >
            </div>
          </template>
          <template slot="orderCode" slot-scope="scope">
            <span style="white-space: pre-line">{{ scope.row.orderCode }}</span>
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
    <product-comment-detail-dialog
      :visible.sync="detailDialogVisible"
      :channel-map.sync="channelMap"
      :id.sync="id"
    />
    <product-comment-reply-dialog :visible.sync="replyDialogVisible" :comment.sync="detailInfo" />
  </div>
</template>

<script>
import ProductCommentDetailDialog from '@/components/product-comment-detail-dialog'
import ProductCommentReplyDialog from '@/components/product-comment-reply-dialog'
const searchForm = {
  userUsername: '',
  content: '',
  platformId: '',
  checkFlag: '',
  createStartTime: '',
  createEndTime: '',
  contentLengthMin: null,
  contentLengthMax: null,
  categoryIds: [],
  mpName: '',
  mpCode: '',
  startRate: null,
  endRate: null,
  auditorName: '',
  auditStartTime: '',
  auditEndTime: '',
  orderCode: '',
  topflag: '',
  hasReply: '',
  hasPic: '',
  channelCode: '',
  selecteState: '0'
}
export default {
  name: 'SocialProductCommentManage',
  components: {
    ProductCommentDetailDialog,
    ProductCommentReplyDialog
  },
  data() {
    const self = this
    return {
      activeName: '0',
      id: '',
      platformIdList: [],
      checkFlagList: [],
      categoryNameList: [],
      categoryTreeData: [],
      channelList: [],
      channelMap: {},
      topflagList: [],
      hasReplyList: [],
      hasPicList: [],
      detailInfo: {},
      detailDialogVisible: false,
      replyDialogVisible: false,
      searchForm: {
        ...searchForm
      },
      loading: false,
      data: [],
      columns: [
        {
          show: true,
          prop: 'createTimeStr',
          label: this.$t('评论时间'),
          align: 'left',
          minWidth: 200
        },
        {
          show: true,
          prop: 'userUsername',
          label: this.$t('评论人账号'),
          align: 'left'
        },
        {
          show: true,
          slot: 'orderCode',
          label: this.$t('订单编号'),
          align: 'left',
          minWidth: 200
        },
        {
          show: true,
          prop: 'mpName',
          label: this.$t('商品名称'),
          align: 'left'
        },
        {
          show: true,
          prop: 'rateStr',
          label: this.$t('商品评分'),
          align: 'left',
          minWidth: 88
        },
        {
          show: true,
          prop: 'upNum',
          label: this.$t('点赞数'),
          align: 'left',
          minWidth: 88
        },
        {
          show: true,
          prop: 'content',
          label: this.$t('评论内容'),
          align: 'left',
          tooltip: true,
          minWidth: 200
        },
        {
          show: true,
          slot: 'picList',
          label: this.$t('评论图片'),
          align: 'left',
          minWidth: 200
        },
        {
          show: true,
          prop: 'channelName',
          label: this.$t('评论渠道'),
          align: 'left'
        },
        {
          show: true,
          prop: 'topflagstr',
          label: this.$t('置顶状态'),
          align: 'left'
        },
        {
          show: true,
          prop: 'checkFlagstr',
          label: this.$t('审核状态'),
          align: 'left'
        }
      ],
      operates: {
        width: 300,
        align: 'left',
        list: [
          {
            label: this.$t('查看'),
            disabled: false,
            method(index, row) {
              self.handleView(row)
            },
            code: 'SocialProductCommentManageView'
          },
          {
            label: this.$t('审核通过'),
            disabled: false,
            hidden(index, row) {
              return row.checkFlag === 2 || row.checkFlag === 0
            },
            method(index, row) {
              self.handlePass(row)
            },
            code: 'SocialProductCommentManageBatchPass'
          },
          {
            label: this.$t('审核不通过'),
            disabled: false,
            hidden(index, row) {
              return row.checkFlag === 3
            },
            method(index, row) {
              self.handleNotPass(row)
            },
            code: 'SocialProductCommentManageBatchNotPass'
          },
          {
            label: this.$t('置顶'),
            disabled: false,
            hidden(index, row) {
              return row.topflag === 1 || row.isAdd === 1
            },
            method(index, row) {
              self.handleTop(row)
            },
            code: 'SocialProductCommentManageTop'
          },
          {
            label: this.$t('取消置顶'),
            disabled: false,
            hidden(index, row) {
              return row.topflag === 0 || row.isAdd === 1
            },
            method(index, row) {
              self.handleNotTop(row)
            },
            code: 'SocialProductCommentManageCancelTop'
          },
          {
            label: this.$t('回复'),
            disabled: false,
            method(index, row) {
              self.handleReply(row)
            },
            code: 'SocialProductCommentManageReply'
          }
        ]
      },
      checked: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.initCode()
      await this.initChannel()
      this.queryBackedRootCategory()
      this.handleQuery()
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
    // 查询后台类目树根节点
    async queryBackedRootCategory() {
      return this.$social.$api.mpApi.listBackCategory().then(res => {
        var arr = res.data
        this.categoryTreeData = toTree(arr)
      })
    },
    async handleQuery() {
      const vue = this
      // 评论时间和审核时间选择查询处理
      if (this.searchForm.createTime && this.searchForm.createTime.length > 1) {
        this.searchForm.createStartTime = this.$portal.parseTime(this.searchForm.createTime[0], '{y}-{m}-{d}')
        this.searchForm.createEndTime = this.$portal.parseTime(this.searchForm.createTime[1], '{y}-{m}-{d}')
      }
      if (this.searchForm.auditTime && this.searchForm.auditTime.length > 1) {
        this.searchForm.auditStartTime = this.$portal.parseTime(this.searchForm.auditTime[0], '{y}-{m}-{d}')
        this.searchForm.auditEndTime = this.$portal.parseTime(this.searchForm.auditTime[1], '{y}-{m}-{d}')
      }

      const param = vue.$portal.deepClone(vue.searchForm)
      delete param.createTime
      delete param.auditTime
      param.pageNo = vue.page.current
      param.pageSize = vue.page.size
      param.selecteState = Number(param.selecteState)
      removeEmpty(param, isEmpty)
      if (param.createStartTime) {
        param.createStartTime = param.createStartTime + ' 00:00:01'
      }
      if (param.createEndTime) {
        param.createEndTime = param.createEndTime + ' 23:59:59'
      }
      if (param.auditStartTime) {
        param.auditStartTime = param.auditStartTime + ' 00:00:01'
      }
      if (param.auditEndTime) {
        param.auditEndTime = param.auditEndTime + ' 23:59:59'
      }
      vue.loading = true

      try {
        const res = await vue.$social.$api.socialApi.listProductCommentPage(
          param
        )
        if (res.data && res.data.listObj) {
          res.data.listObj.map(item => {
            vue.setStr(item)
            if (item.children && item.children.length > 0) {
              item.children.map(x => {
                vue.setStr(x)
              })
            }
          })
          vue.data = res.data.listObj
        } else {
          vue.data = []
        }
        vue.checked = []
        vue.page.total = res.data.total
      } finally {
        vue.loading = false
      }
    },
    setStr(value) {
      value.rateStr =
        value.isAddComment !== 1 && value.selecteState !== 2 ? value.rate : '-'
      const channel = this.channelMap[value.channelCode]
      value.channelName = channel ? channel.channelName : ''
    },
    handleReset() {
      this.searchForm = { ...searchForm }
    },
    handleSelectable(row, index) {
      if (this.searchForm.selecteState === '2') {
        return false
      }
      return true
    },
    handleExport() {
      const param = this.$portal.deepClone(this.searchForm)
      removeEmpty(param, isEmpty)
      if (param.createStartTime) {
        param.createStartTime = param.createStartTime + ' 00:00:01'
      }
      if (param.createEndTime) {
        param.createEndTime = param.createEndTime + ' 23:59:59'
      }
      if (param.auditStartTime) {
        param.auditStartTime = param.auditStartTime + ' 00:00:01'
      }
      if (param.auditEndTime) {
        param.auditEndTime = param.auditEndTime + ' 23:59:59'
      }
      this.$portal.downloadFileByPost(
        '/api/social-back-web/review/comment/export',
        { queryContent: JSON.stringify(param) }
      )
    },
    handleTabsClick(val) {
      this.handleQuery()
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
    handleView(val) {
      this.id = val.id
      this.detailDialogVisible = true
    },
    handlePass(val) {
      const vue = this
      vue
        .$confirm(vue.$t('确定审核通过？'), vue.$t('确认提示'), {
          confirmButtonText: vue.$t('确定'),
          cancelButtonText: vue.$t('取消'),
          type: 'warning'
        })
        .then(() => {
          vue.$social.$api.socialApi
            .passProductComment({ ids: [val.id], checkFlag: 2 })
            .then(res => {
              vue.$message.success(vue.$t('操作成功'))
              vue.handleQuery()
            })
        })
    },
    handleNotPass(val) {
      const vue = this
      vue
        .$confirm(vue.$t('确定审核不通过？'), vue.$t('确认提示'), {
          confirmButtonText: vue.$t('确定'),
          cancelButtonText: vue.$t('取消'),
          type: 'warning'
        })
        .then(() => {
          vue.$social.$api.socialApi
            .passProductComment({ ids: [val.id], mpIds: [val.mpId], checkFlag: 3 })
            .then(res => {
              vue.$message.success(vue.$t('操作成功'))
              vue.handleQuery()
            })
        })
    },
    handleTop(val) {
      const vue = this
      vue
        .$confirm(vue.$t('确定置顶？'), vue.$t('确认提示'), {
          confirmButtonText: vue.$t('确定'),
          cancelButtonText: vue.$t('取消'),
          type: 'warning'
        })
        .then(() => {
          vue.$social.$api.socialApi
            .topProductComment({ id: val.id, topFlag: 1 })
            .then(res => {
              vue.$message.success(vue.$t('操作成功'))
              vue.handleQuery()
            })
        })
    },
    handleNotTop(val) {
      const vue = this
      vue
        .$confirm(vue.$t('确定取消置顶？'), vue.$t('确认提示'), {
          confirmButtonText: vue.$t('确定'),
          cancelButtonText: vue.$t('取消'),
          type: 'warning'
        })
        .then(() => {
          vue.$social.$api.socialApi
            .topProductComment({ id: val.id, topFlag: 0 })
            .then(res => {
              vue.$message.success(vue.$t('操作成功'))
              vue.handleQuery()
            })
        })
    },
    handleReply(val) {
      this.detailInfo = val
      this.replyDialogVisible = true
    },
    handleBatchConfirmPass() {
      const vue = this
      if (vue.checked && vue.checked.length > 0) {
        vue
          .$confirm(vue.$t('确定审核通过？'), vue.$t('确认提示'), {
            confirmButtonText: vue.$t('确定'),
            cancelButtonText: vue.$t('取消'),
            type: 'warning'
          })
          .then(() => {
            const ids = vue.checked.map(item => {
              return item.id
            })
            vue.$social.$api.socialApi
              .passProductComment({ ids: ids, checkFlag: 2 })
              .then(res => {
                vue.$message.success(vue.$t('操作成功'))
                vue.handleQuery()
              })
          })
      } else {
        vue.$message.info(vue.$t('请选择'))
      }
    },
    handleBatchConfirmNotPass() {
      const vue = this
      if (vue.checked && vue.checked.length > 0) {
        vue
          .$confirm(vue.$t('确定审核不通过？'), vue.$t('确认提示'), {
            confirmButtonText: vue.$t('确定'),
            cancelButtonText: vue.$t('取消'),
            type: 'warning'
          })
          .then(() => {
            const ids = vue.checked.map(item => {
              return item.id
            })
            const mpIds = vue.checked.filter(x => x.isAdd === 0).map(x => x.mpId)
            vue.$social.$api.socialApi
              .passProductComment({ ids: ids, mpIds: mpIds, checkFlag: 3 })
              .then(res => {
                vue.$message.success(vue.$t('操作成功'))
                vue.handleQuery()
              })
          })
      } else {
        vue.$message.info(vue.$t('请选择'))
      }
    },
    handleBatchCommentatorSee() {
      debugger
      const vue = this
      if (vue.checked && vue.checked.length > 0) {
        vue
          .$confirm(vue.$t('确定设置仅评论人可见？'), vue.$t('确认提示'), {
            confirmButtonText: vue.$t('确定'),
            cancelButtonText: vue.$t('取消'),
            type: 'warning'
          })
          .then(() => {
            const ids = vue.checked.map(item => {
              return item.id
            })
            const mpIds = vue.checked.filter(x => x.isAdd === 0).map(x => x.mpId)
            vue.$social.$api.socialApi
              .setIsCommentatorSee({ ids: ids, mpIds: mpIds, isCommentatorSee: 1 })
              .then(res => {
                vue.$message.success(vue.$t('操作成功'))
                vue.handleQuery()
              })
          })
      } else {
        vue.$message.info(vue.$t('请选择要设置的记录'))
      }
    },
    handleBatchAllSee() {
      const vue = this
      if (vue.checked && vue.checked.length > 0) {
        vue
          .$confirm(vue.$t('确定设置所有人可见？'), vue.$t('确认提示'), {
            confirmButtonText: vue.$t('确定'),
            cancelButtonText: vue.$t('取消'),
            type: 'warning'
          })
          .then(() => {
            const ids = vue.checked.map(item => {
              return item.id
            })
            vue.$social.$api.socialApi
              .setIsCommentatorSee({ ids: ids, isCommentatorSee: 0 })
              .then(res => {
                vue.$message.success(vue.$t('操作成功'))
                vue.handleQuery()
              })
          })
      } else {
        vue.$message.info(vue.$t('请选择要设置的记录'))
      }
    }
    /* handleQueryConfirmPass() {
      const vue = this
      vue
        .$confirm(vue.$t('确定筛选条件下全部审核通过？'), vue.$t('确认提示'), {
          confirmButtonText: vue.$t('确定'),
          cancelButtonText: vue.$t('取消'),
          type: 'warning'
        })
        .then(() => {
          const params = Object.assign({}, vue.searchForm)
          params.checkFlag = 2
          vue.$social.$api.socialApi
            .passProductCommentByFilter(params)
            .then(res => {
              vue.$message.success(vue.$t('操作成功'))
              vue.handleQuery()
            })
        })
    }*/
  }
}

function toTree(data) {
  data.forEach(function(item) {
    delete item.children
  })
  var map = {}
  data.forEach(function(item) {
    map[item.id] = item
  })
  var val = []
  data.forEach(function(item) {
    var parent = map[item.parentId]
    item.label = item.name
    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      val.push(item)
    }
  })
  return val
}

function removeEmpty(obj, fn) {
  for (var i in obj) {
    if (typeof obj[i] === 'object') {
      removeEmpty(obj[i], fn)
    }
    if (fn(obj[i])) {
      delete obj[i]
    }
  }
}

function isEmpty(foo) {
  if (typeof foo === 'object') {
    for (var i in foo) {
      return false
    }
    return true
  } else {
    return foo === '' || foo === null || foo === undefined
  }
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
