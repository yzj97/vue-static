<template>
  <section>
    <el-card>
      <div slot="header" class="clearfix">
        <h2>{{ $t('integral') }}</h2>
      </div>
      <div>
        <span class="marginl">{{ userPointNum }} {{ $t('minute') }}</span>

        <ody-button
          name="OuserCenterMemberListMemberAdjustPoint_userPointAdjust"
          class="marginl"
          size="mini"
          type="primary"
          code="OuserCenterMemberListMemberAdjustPoint"
          @click="userPointAdjust"
        >{{ $t('积分调整') }}</ody-button>
      </div>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('integral') }}</span>
      </div>
      <div>
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" class="form">
              <ody-search-item :space="2" :label="$t('time_frame')" class="register" prop="createTime">
                <ody-date-range-picker ref="dateRangePicker" v-model="searchForm.createTime" name="searchForm_createTime" />
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
            <ody-button
              name="OuserCenterMemberListMemberQueryMemberPointList_handleSearchSubmit"
              size="small"
              type="primary"
              code="OuserCenterMemberListMemberQueryMemberPointList"
              @click="handleSearchSubmit"
            >{{ $t('common_search') }}</ody-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="table">
            <ody-table :data="accountInfoList" :columns="columns" :can-filter="false" name="accountInfoList217" />
          </div>
          <div slot="page">
            <div class="block">
              <ody-pagination
                :current-page.sync="page.current"
                :list="accountInfoList"
                :page-sizes="[10, 20, 30, 50]"
                :page-size.sync="page.size"
                :total.sync="page.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handlePageSizeChange"
                @current-change="handlePageCurrentChange"
              />
            </div>
          </div>
        </ody-list-table-area>
      </div>
    </el-card>
    <AdjustMemberPoint :visible.sync="showAdjustModel" :user-id.sync="userId" />
  </section>
</template>
<script>
import AdjustMemberPoint from '@/components/adjustMemberPoint'
export default {
  components: {
    AdjustMemberPoint
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      showAdjustModel: false,
      userPointNum: null,
      accountInfoList: [],
      channels: [],
      page: {
        size: 10,
        itemsPerPage: 10,
        current: 1,
        total: 0
      },
      searchForm: {
        createTime: [],
        entityId: null,
        createTimeStart: null,
        createTimeEnd: null
      },
      columns: [
        {
          show: true,
          prop: 'processTypeStr',
          label: this.$t('details_of_integral_change'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'channelCode',
          label: this.$t('channel'),
          align: 'center',
          minWidth: 100,
          formatter: (row, column, cellValue) => {
            if (!row.channelCode) {
              return ''
            }
            if (row.channelCode !== '000000') {
              return this.channels[row.channelCode].channelName
            }
            if (row.channelCode === '000000') {
              return this.$t('all_channel')
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'changeAmountStr',
          label: this.$t('change_of_izu'),
          align: 'center',
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            if (row.changeAmount === 0) {
              return 0
            } else if (
              row.processType === 1 ||
              row.processType === 2 ||
              row.processType === 3 ||
              row.processType === 4 ||
              row.processType === 7 ||
              row.processType === 8 ||
              row.processType === 15 ||
              row.processType === 14 ||
              row.processType === 25 ||
              row.processType === 26 ||
              row.processType === 27
            ) {
              return '+' + row.changeAmount
            } else if (
              row.processType === 5 ||
              row.processType === 6 ||
              row.processType === 9 ||
              row.processType === 13 ||
              row.processType === 16 ||
              row.processType === 99 ||
              row.processType === 46
            ) {
              return '-' + row.changeAmount
            }
          }
        },
        {
          show: true,
          prop: 'createTime',
          label: this.$t('integral_change_time'),
          align: 'center',
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            if (row.createTime) {
              return this.$portal.parseTime(row.createTime, '{y}-{m}-{d}')
            }
            return ''
          }
        }
      ]
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    handleClose() {
      this.userPointNum = null
      this.accountInfoList = []
      this.searchForm = {
        createTime: null,
        entityId: null,
        createTimeStart: null,
        createTimeEnd: null
      }
    },
    userPointAdjust() {
      this.showAdjustModel = true
    },
    async updateList() {
      try {
        this.loading = true
        await loadList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.searchForm = {
        createTime: null,
        entityId: null,
        createTimeStart: null,
        createTimeEnd: null
      }
    },
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async init() {
      try {
        if (this.userId) {
          const queryParam = {}
          queryParam.entityId = this.userId
          this.$ouserCenter.$api.points.getAccount(queryParam).then(resp => {
            if (resp.data) {
              this.userPointNum = resp.data.totalAmount
            }
          })
          // 获取渠道
          this.$ouserCenter.$api.points.queryChannelMap({}).then(resp => {
            this.channels = resp.data
          })
          this.updateList()
        }
      } catch (ex) {
        console.log(ex)
      }
    }
  }
}
async function loadList(vue) {
  vue.searchForm.entityId = vue.userId
  vue.searchForm.page = vue.page.current
  vue.searchForm.limit = vue.page.size
  if (
    vue.searchForm.createTime != null &&
    vue.searchForm.createTime.length > 0
  ) {
    vue.searchForm.createTimeStart =
      vue.$portal.parseTime(vue.searchForm.createTime[0], '{y}-{m}-{d}') +
      ' 00:00:00'
    vue.searchForm.createTimeEnd =
      vue.$portal.parseTime(vue.searchForm.createTime[1], '{y}-{m}-{d}') +
      ' 23:59:59'
  } else {
    vue.searchForm.createTimeStart = null
    vue.searchForm.createTimeEnd = null
  }
  const op = vue.$ouserCenter.$api.crmService.listUserPointLogPage(
    vue.searchForm
  )
  op.then(res => {
    vue.page.total = res.total
    vue.accountInfoList = res.data
    vue.accountInfoList.forEach(i => {
      if (i.changeDetail) {
        const { channelCode: channelCode } = JSON.parse(i.changeDetail)
        i.channelCode = channelCode
      }
    })
  })
}
</script>

<style scoped>
.marginl {
  margin-left: 20px;
}
</style>
