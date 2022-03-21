<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('话题名称:')">
            <el-input v-model="searchForm.topicName" name="searchForm_title"/>
          </ody-search-item>
          <ody-search-item :label="$t('是否显示:')">
            <el-select v-model="searchForm.isAvailable" :placeholder="$t('全部')" name="searchForm_status">
              <el-option
                v-for="item in statusList"
                :key="item.code"
                :label="item.name"
                :value="item.code" />
            </el-select>
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
          <ody-search-item :label="$t('创建时间:')" :space="2">
            <ody-date-range-picker
              v-model="createTime"
              :range-separator="$t('至')"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="createTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimer"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button name="SocialPostTopicQuery_handleQuery" code="PostTopic_listPage" size="small" type="primary" @click="handleQuery">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="SocialPostTopicAdd_handleAddPost" code="PostTopic_add" size="small" type="primary" @click="handleAddPostTopic">{{ $t('新建话题') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :data="data"
          :columns="columns"
          :loading="loading"
          :operates="operates"
          :checked.sync="checkedList"
          :can-filter="true"
          name="data770">
          <template slot="status" slot-scope="scope">
            {{ statusMap[scope.row.status] }}
          </template>
          <template slot="postCoupon" slot-scope="scope">
            <ody-button class="button-new-tag" name="editPostCoupon" code="post_postCount" size="mini" @click="relationPostCoupon(scope.row)">
              <ody-svg-icon code="ui" icon-class="edit" />
              {{ $t('编辑') }}
            </ody-button>
            <span v-for="(item, index) in scope.row.postCouponList" :key="index">
              <el-tag v-if="[5,6].includes(getTrueStatus(item.status,item.startTime,item.endTime))===true" type="info" style="margin-left:5px;">{{ item.postCouponName }}</el-tag>
              <el-tag v-else style="margin-left:5px;">{{ item.postCouponName }}</el-tag>
            </span>
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

    <!--选择奖励券-->
    <ody-dialog :visible.sync="postCouponDialogVisible" :title="$t('选择奖励券')" width="600px">
      <ody-list-search-area>
        <div slot="content">
          <el-row>
            <el-col :span="16">
              <el-form ref="info" :model="info" label-width="130px" @submit.native.prevent>
                <el-form-item :label="$t('奖励券名称')">
                  <el-input
                    v-model="postCouponSearch.postCouponName"
                    :placeholder="$t('请输入内容')"
                    name="searchForm_filters_postCouponName"
                    show-word-limit
                    maxlength="16"
                  />
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <div slot="btn">
          <el-button name="handleSearchPostCouponReset" size="small" @click="resetQueryPostCoupon">{{ $t('common_reset') }}</el-button>
          <el-button name="selectPostCoupon" size="small" type="primary" @click="queryPostCoupon">{{ $t('common_select') }}</el-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :loading="postCouponLoading"
            :data="postCouponListData"
            :columns="postCouponPageColumns"
            :can-filter="false"
            :checked.sync="postCouponChecked"
            name="groupList309"
            multiple="true"
          />
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="postCouponPage.current"
            :list="postCouponListData"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="postCouponPage.size"
            :total.sync="postCouponPage.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="queryPostCoupon"
            @current-change="queryPostCoupon"
          />
        </div>
      </ody-list-table-area>
      <div slot="footer" class="dialog-footer">
        <el-button name="cancelChoosePostCoupon" @click="cancelRelationPostCoupon">{{ $t('取消') }}</el-button>
        <el-button :loading="postCouponConfirmLoading" name="choosePostCoupon" type="primary" @click="confirmRelationPostCoupon">{{ $t('确定') }}</el-button>
      </div>
    </ody-dialog>
  </div>
</template>

<script>
const searchForm = {
  topicName: '',
  createStartTime: '',
  createEndTime: '',
  isTop: '',
  isAvailable: ''
}
export default {
  name: 'SocialPostTopicManage',
  data() {
    const self = this
    return {
      activeName: '0',
      postCouponDialogVisible: false,
      postCouponConfirmLoading: false,
      postCouponLoading: false,
      postCouponListData: [],
      postCouponChecked: [],
      postCouponData: [],
      postCouponSearch: {
        postCouponName: ''
      },
      postCouponPage: {
        size: 10,
        current: 1,
        total: 0
      },
      relationTopicId: null,
      postCouponPageColumns: [
        {
          show: true,
          prop: 'postCouponName',
          label: this.$t('奖励券名称'),
          align: 'center',
          minWidth: 200
        }
      ],
      statusList: [],
      createTime: [],
      topFlagList: [],
      searchForm: {
        ...searchForm
      },
      loading: false,
      data: [],
      columns: [
        {
          show: true,
          prop: 'topicName',
          label: this.$t('话题名称'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'imageUrl',
          label: this.$t('话题图片'),
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            if (params.row.imageUrl) {
              var imgArr = [params.row.imageUrl]
              return (
                <el-image fit='contain' style='height:50px' src={params.row.imageUrl} preview-src-list={imgArr}></el-image>
              )
            } else {
              return (
                null
              )
            }
          }
        },
        {
          show: true,
          slot: 'postCoupon',
          label: this.$t('关联奖励券'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'createUsername',
          label: this.$t('创建人'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'createTimeStr',
          label: this.$t('创建时间'),
          align: 'center'
        },
        {
          show: true,
          prop: 'updateTimeStr',
          label: this.$t('更新时间'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'status',
          label: this.$t('是否显示'),
          code: 'isAvailable',
          align: 'center',
          render: function(h, params) {
            const changeStatus = self.changeStatus
            return (
              <div on-click={(e) => changeStatus(e, params.row)}><el-switch value={params.row.isAvailable === 1 } active-text={ params.row.isAvailable === 1 ? self.$t('已启用') : self.$t('已关闭') }></el-switch></div>
            )
          }
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
        }
      ],
      operates: {
        minWidth: 180,
        align: 'left',
        fixed: 'right',
        list: [
          {
            label: this.$t('置顶'),
            code: 'PostTopic_addRelationTopic',
            disabled: false,
            hidden(index, row) {
              return row.isTop === 1
            },
            method(index, row) {
              self.handleTop(row)
            }
          },
          {
            label: this.$t('取消置顶'),
            code: 'PostTopic_addRelationTopic',
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
            code: 'PostTopic_update',
            disabled: false,
            method(index, row) {
              self.handleEditPostTopic(row)
            }
          },
          {
            label: this.$t('删除'),
            code: 'PostTopic_delete',
            disabled: false,
            method(index, row) {
              self.handleDelPostTopic(row)
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
    async init() {
      this.initCode()
      this.handleQuery()
      this.initPostCoupon()
    },
    initPostCoupon() {
      const vue = this
      const param = {}
      param.page = 1
      param.limit = 99999
      vue.$social.$api.postClassifyApi.listTopicCouponPage(param).then(res => {
        if (res.data) {
          vue.postCouponData = res.data
        } else {
          vue.postCouponData = []
        }
      })
    },
    relationPostCoupon(row) {
      const vue = this

      vue.postCouponChecked = []
      vue.relationTopicId = row.id
      if (row.postCouponList) {
        vue.postCouponChecked = vue.$portal.deepClone(row.postCouponList)
      }
      vue.queryPostCoupon(row)
      vue.postCouponDialogVisible = true
    },
    resetQueryPostCoupon() {
      const vue = this
      vue.postCouponSearch.postCouponName = ''
    },
    async queryPostCoupon(row) {
      const vue = this
      const param = {}
      param.page = vue.postCouponPage.current
      param.limit = vue.postCouponPage.size
      param.filters = {
        'postCouponName': vue.postCouponSearch.postCouponName,
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

      vue.postCouponLoading = true

      try {
        const res = await vue.$social.$api.postClassifyApi.listTopicCouponPage(param)
        if (res.data) {
          const arr = []
          vue.postCouponListData = res.data;
          (row.postCouponList || []).forEach(val => {
            (vue.postCouponListData || []).forEach(r => {
              if (val.status === 4) {
                if (val.couponId === r.couponId) {
                  arr.push(r)
                }
              }
            })
          })
          vue.postCouponChecked = arr
        } else {
          vue.postCouponListData = []
        }
        vue.postCouponPage.total = res.total
      } finally {
        vue.postCouponLoading = false
      }
    },
    confirmRelationPostCoupon() {
      const vue = this
      var ids = []
      for (var i = 0; i < vue.postCouponChecked.length; i++) {
        const item = vue.postCouponChecked[i]
        const realStatus = vue.getTrueStatus(item.status, item.startTime, item.endTime)
        if (realStatus !== 5 && realStatus !== 6) {
          ids.push(item.couponId)
        }
      }

      var param = {
        topicId: vue.relationTopicId,
        couponIds: ids
      }

      vue.postCouponChecked = []

      vue.postCouponConfirmLoading = true

      try {
        vue.$social.$api.postClassifyApi.postTopicCouponRelation(param).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.postCouponDialogVisible = false
          this.handleQuery()
        })
      } finally {
        vue.postCouponConfirmLoading = false
      }
    },
    cancelRelationPostCoupon() {
      const vue = this
      vue.postCouponDialogVisible = false
      vue.postCouponChecked = []
      vue.relationTopicId = null
      vue.postCouponSearch.postCouponName = ''
    },
    initCode() {
      const vue = this
      vue.$social.$api.common.listMultiCode({
        categories: [
          'PRODUCT_COMMENT_TOP_FLAG',
          'SOCIAL_POST_STATUS'
        ]
      }).then(res => {
        vue.topFlagList = res.data.PRODUCT_COMMENT_TOP_FLAG
        vue.statusList = res.data.SOCIAL_POST_STATUS
      })
    },
    async handleQuery() {
      // debugger
      const vue = this
      const param = {}
      const filters = vue.$portal.deepClone(vue.searchForm)
      param.page = vue.page.current
      param.limit = vue.page.size
      if (vue.createTime && vue.createTime.length > 0) {
        filters.startCreateTime = vue.createTime[0]
        filters.endcreateTime = vue.createTime[1]
      } else {
        filters.startCreateTime = null
        filters.endcreateTime = null
      }
      removeEmpty(filters, isEmpty)
      param.filters = filters

      param.sorts = [
        {
          'field': 'isTop',
          'asc': false
        },
        {
          'field': 'updateTime',
          'asc': false
        }
      ]

      vue.loading = true

      try {
        const res = await vue.$social.$api.postTopicApi.listPageRedev(param)
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
      this.searchForm = { ...searchForm }
      this.createTime = []
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
    changeStatus(e, row) {
      const params = {}
      params.id = row.id
      if (row.isAvailable === 1) {
        this.handleNotShow(params)
      } else {
        this.handleShow(params)
      }
    },
    handleShow(val) {
      const vue = this
      vue.$confirm(vue.$t('确定显示开启？'), vue.$t('确认提示'), {
        confirmButtonText: vue.$t('确定'),
        cancelButtonText: vue.$t('取消'),
        type: 'warning'
      }).then(() => {
        vue.$social.$api.postTopicApi.changeTopicStatus({ id: val.id, isAvailable: 1 }).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.handleQuery()
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
        vue.$social.$api.postTopicApi.changeTopicStatus({ id: val.id, isAvailable: 0 }).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.handleQuery()
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
        vue.$social.$api.postTopicApi.changeTopicTop({ id: val.id, isTop: 1 }).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.handleQuery()
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
        vue.$social.$api.postTopicApi.changeTopicTop({ id: val.id, isTop: 0 }).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.handleQuery()
        })
      })
    },
    handleAddPostTopic() {
      this.$router.push({
        path: '/social-back-web/community-manage/social-post-topic-manage-detail',
        query: {
          id: null
        }
      })
    },
    handleEditPostTopic(row) {
      this.$router.push({
        path: '/social-back-web/community-manage/social-post-topic-manage-detail',
        query: {
          id: row.id
        }
      })
    },
    handleDelPostTopic(row) {
      const vue = this
      vue.$confirm(vue.$t('确定删除？'), vue.$t('确认提示'), {
        confirmButtonText: vue.$t('确定'),
        cancelButtonText: vue.$t('取消'),
        type: 'warning'
      }).then(() => {
        vue.$social.$api.postTopicApi.delete({ ids: [row.id] }).then(res => {
          vue.$message.success(vue.$t('操作成功'))
          vue.handleQuery()
        })
      })
    },
    getTrueStatus(status, startTime, endTime) {
      return getTrueStatusByStatusAndTimeRange(
        status,
        startTime,
        endTime,
        2,
        4,
        5
      )
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
/**
 * 根据时间和状态获得真实状态
 * @param status 当前状态
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @param status_notStart 未开始状态的值
 * @param status_ongoing 进行中状态的值
 * @param status_expired 已过期状态的值
 * @returns 真实状态
 */
function getTrueStatusByStatusAndTimeRange(status, startTime, endTime,
  status_notStart, status_ongoing, status_expired) {
  let trueStatus
  if (status === status_ongoing || status === status_expired || status === status_notStart) {
    const now = new Date()

    let sDate = null
    if (typeof startTime === 'string') { // 兼容IE的日期函数
      sDate = new Date(startTime.replace(/-/g, '/'))
    } else {
      sDate = new Date(startTime)
    }

    let eDate = null
    if (typeof endTime === 'string') { // 兼容IE的日期函数
      eDate = new Date(endTime.replace(/-/g, '/'))
    } else {
      eDate = new Date(endTime)
    }

    // 状态为进行中时，需要根据时间判断是未开始、进行中还是已过期
    if (now < sDate) { // 活动未开始
      trueStatus = status_notStart
    } else if (now > eDate) { // 活动已过期
      trueStatus = status_expired
    } else { // 活动进行中
      trueStatus = status_ongoing
    }
  } else {
    trueStatus = status
  }
  return trueStatus
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
