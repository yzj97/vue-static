<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('帖子标题:')">
            <el-input v-model="searchForm.title" name="searchForm_title"/>
          </ody-search-item>
          <ody-search-item :label="$t('是否置顶:')">
            <el-select v-model="searchForm.isTop" :placeholder="$t('全部')" name="searchForm_isTop">
              <el-option
                v-for="item in topFlagList"
                :key="item.code"
                :label="item.name"
                :value="item.code" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('帖子类型:')">
            <el-select v-model="searchForm.type" :placeholder="$t('全部')" name="searchForm_type">
              <el-option
                v-for="item in postTypeList"
                :key="item.code"
                :label="item.name"
                :value="item.code" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('发布渠道:')">
            <el-select v-model="searchForm.channelCode" :popper-append-to-body="false" :placeholder="$t('全部')" name="searchForm_channel">
              <el-option
                v-for="item in channelMap"
                :key="item.channelCode"
                :label="item.channelName"
                :value="item.channelCode" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('审核状态:')">
            <el-select :disabled="disaStatus" v-model="searchForm.auditStatus" :placeholder="$t('全部')" name="searchForm_auditStatus">
              <el-option
                v-for="item in postAuditStatusList"
                :key="item.code"
                :label="item.name"
                :value="item.code" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('关联话题:')">
            <el-select
              v-model="searchForm.topicIds"
              :placeholder="$t('请选择')"
              :popper-append-to-body="false"
              multiple
              collapse-tags>
              <el-option
                v-for="item in topicData"
                :key="item.id"
                :label="item.topicName"
                :value="item.id" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('是否显示:')">
            <el-select v-model="searchForm.status" :placeholder="$t('全部')" name="searchForm_status">
              <el-option
                v-for="item in statusList"
                :key="item.code"
                :label="item.name"
                :value="item.code" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('创建时间:')" :space="2">
            <ody-date-range-picker
              ref="dateRangePicker"
              v-model="createTime"
              :range-separator="$t('至')"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="createTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimer"
            />
          </ody-search-item>
          <ody-search-item :label="$t('创建人:')">
            <el-input v-model="searchForm.userNickname" name="searchForm_createUsername"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button name="SocialPostQuery_handleQuery" code="SocialPostQuery" size="small" type="primary" @click="query">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="SocialPostAdd_handleAddPost" code="SocialPostAdd" size="small" type="primary" @click="handleAddPost">{{ $t('新建帖子') }}</ody-button>
        <ody-button name="SocialPostAdd_handleAuditPost" code="post_auditPost" size="small" @click="batchAuditPost">{{ $t('批量审核') }}</ody-button>
      </div>
      <div slot="tabs">
        <el-tabs v-model="activeName" @tab-click="changeAuditStatusQuery">
          <el-tab-pane :label="$t('全部') + '(' + postCount.all + ')'" name="all" />
          <el-tab-pane :label="$t('待审核') + '(' + postCount.wait + ')'" name="wait" />
          <el-tab-pane :label="$t('审核通过') + '(' + postCount.pass + ')'" name="pass" />
          <el-tab-pane :label="$t('审核不通过') + '(' + postCount.noPass + ')'" name="nopass" />
          <el-tab-pane :label="$t('已关闭') + '(' + postCount.close + ')'" name="close" />
        </el-tabs>
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
          name="data770">
          <template slot="status" slot-scope="scope">
            <el-switch :value="scope.row.status === 1" :active-text="scope.row.status === 1 ? $t('已启用') : $t('已关闭')" @change="changeStatus($event, scope.row)"/>
          </template>
          <template slot="topic" slot-scope="scope">
            <ody-button class="button-new-tag" name="editTopic" code="post_postCount" size="mini" @click="relationTopic(scope.row)">
              <ody-svg-icon code="ui" icon-class="edit" />
              {{ $t('编辑') }}
            </ody-button>
            <span v-for="(item, index) in scope.row.postTopicList" :key="index">
              <el-tag style="margin-left:5px;">#{{ item.topicName }}</el-tag>
            </span>
          </template>
          <template slot="classify" slot-scope="scope">
            <ody-button class="button-new-tag" name="editClassify" code="post_postCount" size="mini" @click="relationClassify(scope.row)">
              <ody-svg-icon code="ui" icon-class="edit" />
              {{ $t('编辑') }}
            </ody-button>
            <span v-for="(item, index) in scope.row.postClassifyList" :key="index">
              <el-tag style="margin-left:5px;">{{ item.classifyName }}</el-tag>
            </span>
          </template>
          <template slot="audit" slot-scope="scope">
            {{ scope.row.auditStatusStr }}
            <el-tooltip v-if="scope.row.remarks" :content="scope.row.remarks" class="item" effect="dark" placement="left">
              <ody-svg-icon code="ui" icon-class="more" />
            </el-tooltip>
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

    <ody-dialog
      :title="$t('审核')"
      :visible.sync="dialogVisible"
      width="600px">
      <el-form ref="form" label-width="100px" class="form">
        <el-form-item :label="$t('状态')" required>
          <el-radio-group v-model="submitAudit.auditStatus">
            <el-radio label="2">{{ $t('审核通过') }}</el-radio>
            <el-radio label="3">{{ $t('审核不通过') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="submitAudit.auditStatus === '3'" :label="$t('备注')" required>
          <el-input v-model="submitAudit.remarks" type="textarea" maxlength="100" show-word-limit/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <div class="line-top"/>
        <ody-button code="post_auditPost" size="small" @click="closeAdudit">{{ $t('取消') }}</ody-button>
        <ody-button code="post_auditPost" size="small" type="primary" @click="confirmAdudit">{{ $t('确定') }}</ody-button>
      </span>
    </ody-dialog>

    <!--选择话题-->
    <ody-dialog :visible.sync="topicDialogVisible" :title="$t('选择话题')" width="600px">
      <ody-list-search-area>
        <div slot="content">
          <el-row>
            <el-col :span="16">
              <el-form ref="info" :model="info" label-width="130px" @submit.native.prevent>
                <el-form-item :label="$t('话题名称')">
                  <el-input
                    v-model="topicSearch.topicName"
                    :placeholder="$t('请输入内容')"
                    name="searchForm_filters_topicName"
                    show-word-limit
                    maxlength="16"
                  />
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <div slot="btn">
          <el-button name="handleSearchTopicReset" size="small" @click="resetQueryTopic">{{ $t('common_reset') }}</el-button>
          <el-button name="selectTopic" size="small" type="primary" @click="queryTopic">{{ $t('common_select') }}</el-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :loading="topicLoading"
            :data="topicListData"
            :columns="topicPageColumns"
            :can-filter="false"
            :checked.sync="topicChecked"
            name="groupList309"
            multiple="true"
          />
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="topicPage.current"
            :list="topicListData"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="topicPage.size"
            :total.sync="topicPage.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="queryTopic"
            @current-change="queryTopic"
          />
        </div>
      </ody-list-table-area>
      <div slot="footer" class="dialog-footer">
        <el-button name="cancelChooseTopic" @click="cancelRelationTopic">{{ $t('取消') }}</el-button>
        <el-button :loading="topicConfirmLoading" name="chooseTopic" type="primary" @click="confirmRelationTopic">{{ $t('确定') }}</el-button>
      </div>
    </ody-dialog>

    <!--选择分类-->
    <ody-dialog :visible.sync="classifyDialogVisible" :title="$t('选择分类')" width="600px">
      <ody-list-search-area>
        <div slot="content">
          <el-row>
            <el-col :span="16">
              <el-form ref="info" :model="info" label-width="130px" @submit.native.prevent>
                <el-form-item :label="$t('分类名称')">
                  <el-input
                    v-model="classifySearch.classifyName"
                    :placeholder="$t('请输入内容')"
                    name="searchForm_filters_classifyName"
                    show-word-limit
                    maxlength="16"
                  />
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <div slot="btn">
          <el-button name="handleSearchClassifyReset" size="small" @click="resetQueryClassify">{{ $t('common_reset') }}</el-button>
          <el-button name="selectClassify" size="small" type="primary" @click="queryClassify">{{ $t('common_select') }}</el-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :loading="classifyLoading"
            :data="classifyListData"
            :columns="classifyPageColumns"
            :can-filter="false"
            :checked.sync="classifyChecked"
            name="groupList309"
            multiple="true"
          />
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="classifyPage.current"
            :list="classifyListData"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="classifyPage.size"
            :total.sync="classifyPage.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="queryClassify"
            @current-change="queryClassify"
          />
        </div>
      </ody-list-table-area>
      <div slot="footer" class="dialog-footer">
        <el-button name="cancelChooseClassify" @click="cancelRelationClassify">{{ $t('取消') }}</el-button>
        <el-button :loading="classifyConfirmLoading" name="chooseClassify" type="primary" @click="confirmRelationClassify">{{ $t('确定') }}</el-button>
      </div>
    </ody-dialog>

  </div>
</template>

<script>
const searchForm = {
  userUsername: '',
  title: '',
  createStartTime: '',
  createEndTime: '',
  topflag: '',
  status: '',
  auditStatus: '',
  type: '',
  createUsername: '',
  userNickname: ''
}
export default {
  name: 'SocialPostManage',
  data() {
    const self = this
    return {
      disaStatus: false,
      dialogVisible: false,
      topicDialogVisible: false,
      classifyDialogVisible: false,
      submitAudit: {
        auditStatus: '2',
        remarks: null,
        ids: []
      },
      topicConfirmLoading: false,
      topicLoading: false,
      topicListData: [],
      topicChecked: [],
      classifyConfirmLoading: false,
      classifyLoading: false,
      classifyListData: [],
      classifyChecked: [],
      checkedList: [],
      activeName: 'all',
      statusList: [],
      createTime: [],
      topFlagList: [],
      topicData: [],
      classifyData: [],
      channelMap: {},
      postTypeList: [],
      postAuditStatusList: [],
      postCount: {
        all: 0,
        wait: 0,
        pass: 0,
        noPass: 0,
        close: 0
      },
      searchForm: {
        ...searchForm
      },
      loading: false,
      data: [],
      topicSearch: {
        topicName: ''
      },
      classifySearch: {
        classifyName: ''
      },
      relationPostId: null,
      topicPage: {
        size: 10,
        current: 1,
        total: 0
      },
      topicPageColumns: [
        {
          show: true,
          prop: 'topicName',
          label: this.$t('话题名称'),
          align: 'center',
          minWidth: 200
        }
      ],
      classifyPage: {
        size: 10,
        current: 1,
        total: 0
      },
      classifyPageColumns: [
        {
          show: true,
          prop: 'classifyName',
          label: this.$t('分类名称'),
          align: 'center',
          minWidth: 200
        }
      ],

      columns: [
        {
          show: true,
          prop: 'title',
          label: this.$t('帖子标题'),
          align: 'center',
          minWidth: 200,
          render: function(h, params) {
            const toSee = self.toSee
            return (
              <a style='color: #0066ff;' on-click={(e) => toSee(e, params.row)}>{params.row.title}</a>
            )
          }
        },
        {
          show: true,
          prop: 'typeStr',
          label: this.$t('帖子类型'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'channelCode',
          label: this.$t('发布渠道'),
          align: 'center',
          minWidth: 200,
          formatter: function(row) {
            const { channelCodeList } = row || {}
            let channelStr = ''
            channelCodeList.forEach(item => {
              console.log(item)
              channelStr += (self.channelMap[item] || {}).channelName + ' '
            })
            return channelStr
          }
        },
        {
          show: true,
          slot: 'topic',
          label: this.$t('关联话题'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          slot: 'classify',
          label: this.$t('关联分类'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'userNickname',
          label: this.$t('创建人'),
          align: 'center'
        },
        {
          show: true,
          prop: 'createTimeStr',
          label: this.$t('创建时间'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'updateTimeStr',
          label: this.$t('更新时间'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'isTop',
          label: this.$t('是否置顶'),
          align: 'center',
          formatter: function(row) {
            if (row.isTop === 1) {
              return self.$t('是')
            }
            return self.$t('否')
          }
        },
        {
          show: true,
          prop: 'likeCount',
          label: this.$t('点赞数'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'commentCount',
          label: this.$t('评论数'),
          align: 'center',
          minWidth: 88
        },
        // {
        //   show: true,
        //   prop: 'shareCount',
        //   label: this.$t('分享数'),
        //   align: 'center',
        //   minWidth: 88
        // },
        {
          show: true,
          prop: 'collectionCount',
          label: this.$t('收藏数'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          slot: 'status',
          label: this.$t('是否显示'),
          code: 'SocialPostShwoOpr',
          align: 'center',
          minWidth: 140
        },
        {
          show: true,
          slot: 'audit',
          label: this.$t('审核状态'),
          align: 'center',
          minWidth: 200
        }
      ],
      operates: {
        fixed: 'right',
        width: 180,
        align: 'center',
        list: [
          {
            label: this.$t('置顶'),
            code: 'SocialPostTop',
            disabled: false,
            hidden(index, row) {
              return row.isTop === 1 || row.auditStatus !== 2
            },
            method(index, row) {
              self.handleTop(row)
            }
          },
          {
            label: this.$t('取消置顶'),
            code: 'SocialPostTopCancel',
            disabled: false,
            hidden(index, row) {
              return row.isTop === 0
            },
            method(index, row) {
              self.handleNotTop(row)
            }
          },
          {
            label: this.$t('编辑'),
            code: 'SocialPostEdit',
            disabled: false,
            hidden(index, row) {
              return row.type !== 1 || row.auditStatus !== 1
            },
            method(index, row) {
              self.handleEditPost(row)
            }
          },
          {
            label: this.$t('审核'),
            code: 'post_auditPost',
            disabled: false,
            hidden(index, row) {
              return row.auditStatus !== 1
            },
            method(index, row) {
              self.auditPost(row)
            }
          },
          {
            label: this.$t('关闭'),
            code: 'post_auditPost',
            disabled: false,
            hidden(index, row) {
              return row.auditStatus !== 1 && row.auditStatus !== 2
            },
            method(index, row) {
              self.closePost(row)
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
    this.init()
  },
  methods: {
    handleStop() {
      debugger
      return false
    },
    async init() {
      await this.initTime()
      await this.initCode()
      await this.initChannel()
      await this.initTopic()
      await this.initClassify()
      await this.handleQuery()
      await this.postCountNum()
    },
    initCode() {
      const vue = this
      vue.$social.$api.common.listMultiCode({
        categories: [
          'PRODUCT_COMMENT_TOP_FLAG',
          'SOCIAL_POST_STATUS',
          'POST_TYPE',
          'POST_AUDIT_STATUS'
        ]
      }).then(res => {
        vue.topFlagList = res.data.PRODUCT_COMMENT_TOP_FLAG
        vue.statusList = res.data.SOCIAL_POST_STATUS
        vue.postTypeList = res.data.POST_TYPE
        vue.postAuditStatusList = res.data.POST_AUDIT_STATUS
      })
    },
    async initChannel() {
      const res = await this.$social.$api.common.listAllChannels({})
      if (res.code === '0') {
        this.channelMap = res.data
      }
    },
    initTopic() {
      const vue = this
      const param = {}
      param.page = 1
      param.limit = 99999
      vue.$social.$api.postTopicApi.listPage(param).then(res => {
        if (res.data) {
          vue.topicData = res.data
        } else {
          vue.topicData = []
        }
      })
    },
    initClassify() {
      const vue = this
      const param = {}
      param.page = 1
      param.limit = 99999
      vue.$social.$api.postClassifyApi.listPage(param).then(res => {
        if (res.data) {
          vue.classifyData = res.data
        } else {
          vue.classifyData = []
        }
      })
    },
    postCountNum() {
      const vue = this
      const param = vue.$portal.deepClone(vue.searchForm)
      if (vue.createTime && vue.createTime.length > 0) {
        param.createStartTime = vue.createTime[0]
        param.createEndTime = vue.createTime[1]
      } else {
        param.createStartTime = null
        param.createEndTime = null
      }
      removeEmpty(param, isEmpty)
      vue.$social.$api.socialApi.newPostCount(param).then(res => {
        if (res.data) {
          vue.postCount = res.data
        } else {
          vue.postCount = []
        }
      })
    },
    batchAuditPost() {
      const vue = this

      if (vue.checkedList.length === 0) {
        vue.$message({
          message: vue.$t('请选择数据'),
          type: 'warning'
        })
        return
      }

      var ids = []
      for (var i = 0; i < vue.checkedList.length; i++) {
        if (vue.checkedList[i].auditStatus !== 1 && vue.checkedList[i].auditStatus !== '1') {
          vue.$message({
            message: vue.$t('请选择待审核的数据'),
            type: 'warning'
          })
          return
        }

        ids.push(vue.checkedList[i].id)
      }

      vue.submitAudit.ids = ids
      vue.dialogVisible = true
    },
    auditPost(row) {
      const vue = this
      vue.submitAudit.ids = [row.id]
      vue.submitAudit.remarks = row.remarks
      vue.dialogVisible = true
    },
    closeAdudit() {
      const vue = this
      vue.dialogVisible = false
      vue.submitAudit.auditStatus = '2'
      vue.submitAudit.ids = []
      vue.submitAudit.remarks = null
    },
    confirmAdudit() {
      const vue = this
      if (vue.submitAudit.auditStatus === '3' && (!vue.submitAudit.remarks || vue.submitAudit.remarks === '')) {
        vue.$message({
          message: vue.$t('请填写备注'),
          type: 'warning'
        })
        return
      }

      var param = {
        'ids': vue.submitAudit.ids,
        'auditStatus': vue.submitAudit.auditStatus
      }

      if (vue.submitAudit.auditStatus === '3') {
        param.remarks = vue.submitAudit.remarks
      }

      // 审核
      vue.$social.$api.socialApi.auditPostRedev(param).then(res => {
        vue.$message.success(vue.$t('操作成功'))
        vue.closeAdudit()
        vue.postCountNum()
        vue.handleQuery()
      })
    },
    initTime() {
      const vue = this
      vue.$refs.dateRangePicker.setDefault(7)
      // vue.createTime = []
    },
    closePost(row) {
      const vue = this

      var message = vue.$t('确认关闭吗')
      if (row.type === 2 || row.type === '2') {
        message = vue.$t('此贴是用户在前端创建的帖子，请谨慎关闭')
      }

      vue.$confirm(message, vue.$t('确认提示'), {
        confirmButtonText: vue.$t('确定'),
        cancelButtonText: vue.$t('取消'),
        type: 'warning'
      }).then(() => {
        var param = {
          'ids': [row.id],
          'auditStatus': 4
        }
        // close
        vue.$social.$api.socialApi.auditPost(param).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.handleQuery()
        })
      })
    },
    async query() {
      this.postCountNum()
      await this.handleQuery()
    },
    async handleQuery() {
      // debugger
      const vue = this
      const param = vue.$portal.deepClone(vue.searchForm)
      param.page = vue.page.current
      param.limit = vue.page.size
      if (vue.createTime && vue.createTime.length > 0) {
        param.createStartTime = vue.createTime[0]
        param.createEndTime = vue.createTime[1]
      } else {
        param.createStartTime = null
        param.createEndTime = null
      }
      removeEmpty(param, isEmpty)
      vue.loading = true

      try {
        const res = await vue.$social.$api.socialApi.listPost(param)
        if (res.data) {
          vue.data = res.data
        } else {
          vue.data = []
        }
        vue.page.total = res.total
      } finally {
        vue.loading = false
      }
    },
    handleReset() {
      var auditStatus = this.searchForm.auditStatus
      this.searchForm = { ...searchForm }
      this.createTime = []
      if (this.disaStatus) {
        this.searchForm.auditStatus = auditStatus
      }
      this.initTime()
    },
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
        await this.query()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.query()
      } catch (ex) {
        console.log(ex)
      }
    },
    changeStatus(e, row) {
      const params = {}
      params.id = row.id
      if (row.status === 1) {
        this.handleNotShow(params)
      } else {
        this.handleShow(params)
      }
    },
    toSee(e, row) {
      this.handleSeePost(row)
    },
    handleShow(val) {
      const vue = this
      vue.$confirm(vue.$t('确定显示开启？'), vue.$t('确认提示'), {
        confirmButtonText: vue.$t('确定'),
        cancelButtonText: vue.$t('取消'),
        type: 'warning'
      }).then(() => {
        vue.$social.$api.socialApi.changePostStatus({ id: val.id, status: 1 }).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.query()
        })
      })
    },
    handleNotShow(val) {
      const vue = this
      vue.$confirm(vue.$t('确定显示关闭？'), vue.$t('确认提示'), {
        confirmButtonText: vue.$t('确定'),
        cancelButtonText: vue.$t('取消'),
        type: 'warning'
      }).then(() => {
        vue.$social.$api.socialApi.changePostStatus({ id: val.id, status: 0 }).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.query()
        })
      })
    },
    handleTop(val) {
      const vue = this
      vue.$confirm(vue.$t('确定置顶？'), vue.$t('确认提示'), {
        confirmButtonText: vue.$t('确定'),
        cancelButtonText: vue.$t('取消'),
        type: 'warning'
      }).then(() => {
        vue.$social.$api.socialApi.changePostTop({ id: val.id, isTop: 1 }).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.query()
        })
      })
    },
    handleNotTop(val) {
      const vue = this
      vue.$confirm(vue.$t('确定取消置顶？'), vue.$t('确认提示'), {
        confirmButtonText: vue.$t('确定'),
        cancelButtonText: vue.$t('取消'),
        type: 'warning'
      }).then(() => {
        vue.$social.$api.socialApi.changePostTop({ id: val.id, isTop: 0 }).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.query()
        })
      })
    },
    handleAddPost() {
      this.$router.push({
        path: '/social-back-web/community-manage/social-post-config',
        query: {
          id: null
        }
      })
    },
    handleEditPost(row) {
      this.$router.push({
        path: '/social-back-web/community-manage/social-post-config',
        query: {
          id: row.id
        }
      })
    },
    handleSeePost(row) {
      this.$router.push({
        path: '/social-back-web/community-manage/social-post-config',
        query: {
          id: row.id,
          isEdit: 0
        }
      })
    },
    relationTopic(row) {
      const vue = this

      vue.topicChecked = []
      vue.relationPostId = row.id
      if (row.postTopicList) {
        vue.topicChecked = vue.$portal.deepClone(row.postTopicList)
      }
      vue.queryTopic()
      vue.topicDialogVisible = true
    },
    relationClassify(row) {
      const vue = this

      vue.classifyChecked = []
      vue.relationPostId = row.id
      if (row.postClassifyList) {
        vue.classifyChecked = vue.$portal.deepClone(row.postClassifyList)
      }
      vue.queryClassify()
      vue.classifyDialogVisible = true
    },
    resetQueryTopic() {
      const vue = this
      vue.topicSearch.topicName = ''
    },
    resetQueryClassify() {
      const vue = this
      vue.classifySearch.classifyName = ''
    },
    async queryTopic() {
      const vue = this
      const param = {}
      param.page = vue.topicPage.current
      param.limit = vue.topicPage.size
      param.filters = {
        'topicName': vue.topicSearch.topicName,
        'isAvailable': 1
      }

      param.sorts = [
        {
          'field': 'isTop',
          'asc': false
        },
        {
          'field': 'updateTime',
          'createTime': false
        }
      ]

      vue.topicLoading = true

      try {
        const res = await vue.$social.$api.postTopicApi.listPage(param)
        if (res.data) {
          vue.topicListData = res.data
        } else {
          vue.topicListData = []
        }
        vue.topicPage.total = res.total
      } finally {
        vue.topicLoading = false
      }
    },
    async queryClassify() {
      const vue = this
      const param = {}
      param.page = vue.classifyPage.current
      param.limit = vue.classifyPage.size
      param.filters = {
        'classifyName': vue.classifySearch.classifyName,
        'isAvailable': 1
      }

      param.sorts = [
        {
          'field': 'isTop',
          'asc': false
        },
        {
          'field': 'updateTime',
          'createTime': false
        }
      ]

      vue.classifyLoading = true

      try {
        const res = await vue.$social.$api.postClassifyApi.listPage(param)
        if (res.data) {
          vue.classifyListData = res.data
        } else {
          vue.classifyListData = []
        }
        vue.classifyPage.total = res.total
      } finally {
        vue.classifyLoading = false
      }
    },
    confirmRelationTopic() {
      const vue = this
      var ids = []
      for (var i = 0; i < vue.topicChecked.length; i++) {
        ids.push(vue.topicChecked[i].id)
      }

      var param = {
        postId: vue.relationPostId,
        topicIds: ids
      }

      vue.topicChecked = []

      vue.topicConfirmLoading = true

      try {
        vue.$social.$api.postTopicApi.addRelationTopic(param).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.topicDialogVisible = false
          vue.query()
        })
      } finally {
        vue.topicConfirmLoading = false
      }
    },
    confirmRelationClassify() {
      const vue = this
      var ids = []
      for (var i = 0; i < vue.classifyChecked.length; i++) {
        ids.push(vue.classifyChecked[i].id)
      }

      var param = {
        postId: vue.relationPostId,
        classifyIds: ids
      }

      vue.classifyChecked = []

      vue.classifyConfirmLoading = true

      try {
        vue.$social.$api.postClassifyApi.postClassifyRelation(param).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.classifyDialogVisible = false
          vue.query()
        })
      } finally {
        vue.classifyConfirmLoading = false
      }
    },
    cancelRelationTopic() {
      const vue = this
      vue.topicDialogVisible = false
      vue.topicChecked = []
      vue.relationPostId = null
      vue.topicSearch.topicName = ''
    },
    cancelRelationClassify() {
      const vue = this
      vue.classifyDialogVisible = false
      vue.classifyChecked = []
      vue.relationPostId = null
      vue.classifySearch.classifyName = ''
    },
    changeAuditStatusQuery() {
      this.checkedList = []
      if (this.activeName === 'all') {
        this.searchForm.auditStatus = null
        this.disaStatus = false
      } else if (this.activeName === 'wait') {
        this.searchForm.auditStatus = '1'
        this.disaStatus = true
      } else if (this.activeName === 'pass') {
        this.searchForm.auditStatus = '2'
        this.disaStatus = true
      } else if (this.activeName === 'nopass') {
        this.searchForm.auditStatus = '3'
        this.disaStatus = true
      } else {
        this.searchForm.auditStatus = '4'
        this.disaStatus = true
      }
      this.postCountNum()
      this.handleQuery(true)
    }
  }
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
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .linkBlue {
    color: #0066ff;
  }
}
</style>
