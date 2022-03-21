<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('活动名称:')" :space="1">
            <el-input v-model="filters.name" :placeholder="$t('请输入') + $t('活动名称')" name="searchForm_filters_name" />
          </ody-search-item>
          <ody-search-item :label="$t('活动类型:')" :space="1">
            <ody-dict-select ref="type" v-model="filters.type" :is-number="false" pool="social" category="apply_activity_type" name="type" />
          </ody-search-item>
          <ody-search-item :label="$t('付费类型:')" :space="1">
            <ody-dict-select ref="payType" v-model="filters.payType" :is-number="false" pool="social" category="apply_activity_pay_type" name="payType" />
          </ody-search-item>
          <ody-search-item :label="$t('发布渠道:')" :space="1">
            <ody-channel-select ref="channelCodes" v-model="filters.channelCode" name="channelCode" />
          </ody-search-item>
          <ody-search-item :label="$t('报名状态:')" :space="1">
            <ody-dict-select ref="applyStatus" v-model="filters.applyStatus" :is-number="false" pool="social" category="apply_activity_apply_status" name="applyStatus" />
          </ody-search-item>
          <ody-search-item :label="$t('活动状态:')" :space="1">
            <ody-dict-select ref="activityStatus" v-model="filters.activityStatus" :is-number="false" pool="social" category="apply_activity_activity_status" name="activityStatus" />
          </ody-search-item>
          <ody-search-item :label="$t('报名时间:')">
            <ody-date-range-picker
              ref="applyTimeRange"
              v-model="applyTimeRange"
              :range-separator="$t('~')"
              type="datetimer"
              name="applyTimeRange"
            />
          </ody-search-item>
          <ody-search-item :label="$t('活动时间:')">
            <ody-date-range-picker
              ref="activityTimeRange"
              v-model="activityTimeRange"
              :range-separator="$t('~')"
              type="datetimer"
              name="activityTimeRange"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="ApplyActivity_listPage_search"
          code="ApplyActivity_listPage"
          size="small"
          type="primary"
          @click="search"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="ApplyActivity_exportData"
          code="ApplyActivity_add"
          size="small"
          type="primary"
          @click="add"
        >{{ $t('新建报名活动') }}</ody-button>
      </div>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" @tab-click="onTabClick" >
          <el-tab-pane v-for="tab in tabs" :label="tab.heading" :key="tab.index" />
        </el-tabs>
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
          name="applyActivityTable">
          <template slot="name" slot-scope="scope">
            <el-button type="text" @click="view(scope.row)">{{ scope.row.name }}</el-button>
          </template>
          <template slot="userNum" slot-scope="scope">
            <el-button v-if="scope.row.userNum > 0" type="text" @click="viewApply(scope.row,null)">{{ scope.row.userNum }}</el-button>
            <span v-if="scope.row.userNum <= 0">{{ scope.row.userNum }}</span>
          </template>
          <template slot="passUserNum" slot-scope="scope">
            <el-button v-if="scope.row.passUserNum > 0" type="text" @click="viewApply(scope.row,'1')">{{ scope.row.passUserNum }}</el-button>
            <span v-if="scope.row.passUserNum <= 0">{{ scope.row.passUserNum }}</span>
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
  </section>
</template>
<script>
export default {
  name: 'ApplyActivityManage',
  data() {
    return {
      activeState: '0',
      tabs: [
        {
          index: '0',
          heading: this.$t('全部'),
          applyStatusList: [1, 2, 3, 4],
          activityStatusList: [1, 2, 3]
        },
        {
          index: '1',
          heading: this.$t('报名未开始'),
          applyStatusList: [1],
          activityStatusList: [1, 2, 3]
        },
        {
          index: '2',
          heading: this.$t('报名进行中'),
          applyStatusList: [2],
          activityStatusList: [1, 2, 3]
        },
        {
          index: '3',
          heading: this.$t('报名已结束'),
          applyStatusList: [3],
          activityStatusList: [1, 2, 3]
        },
        {
          index: '4',
          heading: this.$t('报名已关闭'),
          applyStatusList: [4],
          activityStatusList: [1, 2, 3]
        },
        {
          index: '5',
          heading: this.$t('活动未开始'),
          applyStatusList: [1, 2, 3, 4],
          activityStatusList: [1]
        },
        {
          index: '6',
          heading: this.$t('活动进行中'),
          applyStatusList: [1, 2, 3, 4],
          activityStatusList: [2]
        },
        {
          index: '7',
          heading: this.$t('活动已结束'),
          applyStatusList: [1, 2, 3, 4],
          activityStatusList: [3]
        }
      ],
      checked: [],
      loading: false,
      list: [],
      columns: [
        {
          label: this.$t('活动名称'),
          slot: 'name',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('活动类型'),
          prop: 'typeStr',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('报名时间'),
          prop: 'startApplyTime',
          show: true,
          align: 'center',
          formatter: (row, column, cellValue) => {
            let result = ''
            if (row.startApplyTimeStr) {
              result += row.startApplyTimeStr
            }
            if (row.endApplyTimeStr) {
              result += ' - ' + row.endApplyTimeStr
            }
            return result
          }
        },
        {
          label: this.$t('活动时间'),
          prop: 'startActivityTime',
          show: true,
          align: 'center',
          formatter: (row, column, cellValue) => {
            let result = ''
            if (row.startActivityTimeStr) {
              result += row.startActivityTimeStr
            }
            if (row.endActivityTimeStr) {
              result += ' - ' + row.endActivityTimeStr
            }
            return result
          }
        },
        {
          label: this.$t('活动说明'),
          prop: 'description',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('付费类型'),
          prop: 'payTypeStr',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('发布渠道'),
          prop: 'channelNames',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('创建人'),
          prop: 'createUsername',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('创建时间'),
          prop: 'createTime',
          show: true,
          align: 'center',
          formatter: (row, column, cellValue) => {
            if (row.createTime) {
              return this.$portal.parseTime(
                row.createTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        },
        {
          label: this.$t('上限人数'),
          prop: 'limitNum',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('已报名人数'),
          slot: 'userNum',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('报名通过人数'),
          slot: 'passUserNum',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('报名状态'),
          prop: 'applyStatusStr',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('活动状态'),
          prop: 'activityStatusStr',
          show: true,
          align: 'center'
        }
      ],
      operates: {
        fixed: 'right',
        width: 120,
        align: 'center',
        list: [
          {
            label: this.$t('编辑'),
            code: 'ApplyActivity_update',
            hidden: (index, row) => {
              if (row.applyStatus === 3 || row.applyStatus === 4) {
                return true
              }
              return false
            },
            method: (index, row) => {
              this.$router.push({
                name: 'ApplyActivityEdit',
                query: {
                  id: row.id,
                  readonly: false
                }
              })
            }
          },
          {
            label: this.$t('关闭'),
            code: 'ApplyActivity_close',
            hidden: (index, row) => {
              if (row.applyStatus === 1) {
                return false
              }
              return true
            },
            method: (index, row) => {
              this.close(row)
            }
          }
        ]
      },
      typeDict: {},
      payTypeDict: {},
      applyStatusDict: {},
      activityStatusDict: {},
      applyTimeRange: [],
      activityTimeRange: [],
      filters: {},
      page: {
        page: 1,
        limit: 10
      },
      total: 0
    }
  },
  computed: {
    getChannelCodeMap() {
      return this.$refs.channelCodes.$refs.select2.options.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
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
      const categories = []
      categories.push('apply_activity_type')
      categories.push('apply_activity_pay_type')
      categories.push('apply_activity_apply_status')
      categories.push('apply_activity_activity_status')
      const res = await this.$social.$api.common.listMultiCode({ 'categories': categories })
      this.typeDict = res.data['apply_activity_type']
      this.payTypeDict = res.data['apply_activity_pay_type']
      this.applyStatusDict = res.data['apply_activity_apply_status']
      this.activityStatusDict = res.data['apply_activity_activity_status']
      this.search()
    },
    search() {
      this.loading = true

      this.handleFilters()
      const args = { filters: this.filters, ...this.page }
      this.$social.$api.applyActivity.listPage(args).then(
        res => {
          this.loading = false
          this.list = res.data
          if (res.data) {
            const channelMap = this.getChannelCodeMap
            res.data.forEach(item => {
              if (item.limitType === 1) {
                item.limitNum = this.$t('无限制')
              }
              if (item.channelCodes) {
                item.channelNames = ''
                item.channelCodes.forEach(key => {
                  item.channelNames += ',' + channelMap[key]
                })
                item.channelNames = item.channelNames.substring(1)
              }
            })
          }
          this.total = res.total
        },
        () => {
          this.loading = false
        }
      )
    },
    handleFilters() {
      if (this.applyTimeRange && this.applyTimeRange.length > 1) {
        this.filters.startStartApplyTime = this.applyTimeRange[0]
        this.filters.endStartApplyTime = this.applyTimeRange[1]
      } else {
        delete this.filters.startStartApplyTime
        delete this.filters.endStartApplyTime
      }
      if (this.activityTimeRange && this.activityTimeRange.length > 1) {
        this.filters.startStartActivityTime = this.activityTimeRange[0]
        this.filters.endStartActivityTime = this.activityTimeRange[1]
      } else {
        delete this.filters.startStartActivityTime
        delete this.filters.endStartActivityTime
      }
      this.tabs.forEach(item => {
        if (item.index === this.activeState) {
          this.filters.applyStatusList = item.applyStatusList
          this.filters.activityStatusList = item.activityStatusList
        }
      })
    },
    onTabClick() {
      this.search()
    },
    reset() {
      this.checked = []
      this.filters = {}
      this.applyTimeRange = []
      this.activityTimeRange = []
    },
    view(row) {
      this.$router.push({
        name: 'ApplyActivityDetail',
        query: {
          id: row.id,
          readonly: true
        }
      })
    },
    viewApply(row, status) {
      this.$router.push({
        name: 'ApplyActivityUserList',
        query: {
          applyId: row.id,
          status: status
        }
      })
    },
    add() {
      this.$router.push({
        name: 'ApplyActivityAdd',
        query: {
          readonly: false
        }
      })
    },
    async close(row) {
      const result = await this.$social.$api.applyActivity.close({ id: row.id })
      if (result && result.code === '0') {
        this.search()
        this.$message({
          type: 'success',
          message: this.$t('common_operate_success')
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
