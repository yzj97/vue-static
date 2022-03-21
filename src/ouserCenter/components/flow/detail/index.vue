<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content" :title="type === 2 ? $t('成长值详情查询'):$t('积分日志详情查询')">
          <el-form ref="form" label-width="150px" class="form">
            <ody-search-item
              :label="type === 2 ? $t('成长值变动时间'):$t('integral_change_time')"
              type="text"
              prop="createTime">
              <el-date-picker
                v-model="createTime"
                name="createTime"
                type="daterange"
                range-separator="~"
                style="width: 250px;padding-right: 0px"
              />
            </ody-search-item>
            <ody-search-item :label="$t('change_type')" prop="processType">
              <el-select v-model="searchForm.processType" :placeholder="$t('whole')" name="searchForm_processType">
                <el-option v-for="(v,k) in ruleTypeList" :key="k" :label="v" :value="k" />
              </el-select>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('reset') }}</el-button>
          <ody-button :code="type === 2 ? 'OuserCenterBalanceFlowListDetailQuery' : 'OuserCenterPointsFlowDetailQuery'" name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('query') }}</ody-button>
        </div>
      </ody-list-search-area>
      <div class="row">
        <div
          class="col-sm-4"
          style="margin-left: 30px;margin-bottom: 15px;"
        >{{ $t('member_cell_phone_number') }}：{{ userObj.mobile }}</div>
      </div>
      <ody-list-table-area>
        <div slot="table">
          <ody-table :data="accountInfoList" :columns="columns" name="accountInfoList063" />
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
      <br >
      <div style="text-align: center">
        <el-button name="back" type="primary" @click="back">{{ $t('return') }}</el-button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      accountInfoList: [],
      userObj: {
        userName: ''
      },
      page: {
        size: 10,
        itemsPerPage: 10,
        current: 1,
        total: 0
      },
      createTime: null,
      channels: [],
      searchForm: getDefaultSearchForm(),
      status: null,
      ruleTypeList: {}, // 全规则
      columns: [
        {
          show: true,
          prop: 'processTypeStr',
          label:
            this.type === 2
              ? this.$t('成长值变动详情')
              : this.$t('details_of_integral_change'),
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
          prop: 'changeAmount',
          label: this.$t('总额变动'),
          align: 'center',
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            if (row.changeAmount === 0) {
              return 0
            } else if (this.type === 2) {
              if (
                row.processType === 10 ||
                row.processType === 12 ||
                row.processType === 17 ||
                row.processType === 100
              ) {
                return '+' + row.changeAmount
              } else if (
                row.processType === 11 ||
                row.processType === 48 ||
                row.processType === 47 ||
                row.processType === 101
              ) {
                return '-' + row.changeAmount
              }
            } else if (this.type === 1) {
              if (
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
          }
        },
        // {
        //   show: true,
        //   prop: 'amountTrans',
        //   label: this.$t('冻结变动'),
        //   align: 'center',
        //   minWidth: 120,
        //   formatter: (row, column, cellValue) => {
        //     if (row.freezenChangeAmount === 0) {
        //       return 0
        //     } else if (row.changeType === 1) {
        //       return '+' + row.freezenChangeAmount
        //     } else if (row.changeType === 2) {
        //       return '-' + row.freezenChangeAmount
        //     }
        //   }
        // },
        {
          show: true,
          prop: 'createTime',
          label: this.$t('operation_time'),
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
      this.createTime = null
      this.searchForm = getDefaultSearchForm()
      this.handleSearchSubmit()
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
    back() {
      if (this.status === 1) {
        window.open('about:blank', '_self').close()
      } else {
        if (this.type === 2) {
          this.$router.push({
            name: 'OuserCenterBalanceFlowList'
          })
        } else {
          this.$router.push({
            name: 'OuserCenterPointsFlow'
          })
        }
      }
    },
    init() {
      this.status = sessionStorage.getItem('status')
      let opKey
      if (this.type === 2) {
        opKey = 'GROWTH_PROCESS_TYPE'
      } else {
        opKey = 'POINT_PROCESS_TYPE'
      }
      // 获取各字典项的值
      this.$ouserCenter.$api.points
        .listByCategorys({
          categorys: [opKey],
          pool: 'crm'
        })
        .then(resp => {
          this.enumTypes = resp.data
          this.ruleTypeList = this.enumTypes[opKey]
        })
      // 获取渠道
      this.$ouserCenter.$api.points.queryChannelMap({}).then(resp => {
        this.channels = resp.data
      })
      this.updateList()
    }
  }
}

async function loadList(vue) {
  let user = sessionStorage.getItem('user_point')
  user = JSON.parse(user)
  vue.userObj = user
  vue.searchForm.entityId = user.userId
  vue.searchForm.page = vue.page.current
  vue.searchForm.limit = vue.page.size
  if (vue.createTime == null) {
    vue.searchForm.createTimeStart = null
    vue.searchForm.createTimeEnd = null
  } else {
    vue.searchForm.createTimeStart =
      vue.$portal.parseTime(vue.createTime[0], '{y}-{m}-{d}') + ' 00:00:00'
    vue.searchForm.createTimeEnd =
      vue.$portal.parseTime(vue.createTime[1], '{y}-{m}-{d}') + ' 23:59:59'
  }
  let op
  if (vue.type === 2) {
    op = vue.$ouserCenter.$api.crmService.listGrowthLogPage(vue.searchForm)
  } else {
    op = vue.$ouserCenter.$api.crmService.listUserPointLogPage(vue.searchForm)
  }
  op.then(res => {
    vue.page.total = res.total
    vue.accountInfoList = res.data
    vue.accountInfoList.forEach(i => {
      if (i.changeDetail != null) {
        const { channelCode: channelCode } = JSON.parse(i.changeDetail)
        i.channelCode = channelCode
      }

      // for (const j in vue.ruleTypeList) {
      //   if (i.processType.toString() === j) {
      //     i.processTypeStr = vue.ruleTypeList[j]
      //   }
      // }
    })
  })
}
function getDefaultSearchForm() {
  return Object.assign(
    {},
    {
      createTime: null,
      ruleType: null
    }
  )
}
</script>
