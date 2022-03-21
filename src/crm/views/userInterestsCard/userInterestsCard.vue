<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('卡编号:')" prop="filters.cardId">
            <el-input v-model="searchForm.filters.cardId" :placeholder="$t('请输入卡编号')" name="searchForm_filters_cardId"/>
          </ody-search-item>
          <ody-search-item :label="$t('卡号:')" prop="filters.no">
            <el-input v-model="searchForm.filters.no" :placeholder="$t('请输入卡号')" name="searchForm_filters_no"/>
          </ody-search-item>
          <ody-search-item :label="$t('手机号:')" prop="filters.mobile">
            <el-input v-model="searchForm.filters.mobile" :placeholder="$t('请输入手机号')" name="searchForm_filters_mobile"/>
          </ody-search-item>
          <ody-search-item :label="$t('达成条件:')" prop="filters.receiveType">
            <el-select v-model="searchForm.filters.receiveType" :placeholder="$t('全部')" name="searchForm_filters_receiveType">
              <el-option
                v-for="item in receiveTypes"
                :key="item.code"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('渠道:')" prop="filters.bindChannel">
            <el-select v-model="searchForm.filters.bindChannel" :placeholder="$t('全部')" name="searchForm_filters_bindChannel">
              <el-option
                v-for="item in channels"
                :key="item.code"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('绑卡(支付)时间:')" prop="searchDate">
            <ody-date-range-picker
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              v-model="searchDate"
              :show-button="false"
              name="searchDate"
              type="datetimer" />
              <!--bindTimeStart\bindTimeEnd-->
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button name="CrmUserInterestsCardList_handlePageCurrentChange" code="CrmUserInterestsCardList" size="small" type="primary" @click="handlePageCurrentChange">{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <!--下载-->
        <ody-export-task-button
          pool="crm"
          task-type="userInterestsCardLogExport"
          name="CrmUserInterestsCard_seeExportTask"
          code="CrmUserInterestsCardList"
          size="small"
          class="export-task"
        >{{ $t('seeTask') }}</ody-export-task-button>
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          name="CrmUserInterestsCard_exportData"
          code="CrmUserInterestsCardList"
          size="small"
        >{{ $t('common_export') }}</ody-batch-export-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="false"
          name="list489"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="list"
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
  </section>
</template>

<script>

export default {
  name: 'CrmUserInterestsCard',
  list: [],
  relList: [],
  components: {
  },
  data() {
    // const vue = this
    return {
      exportModel: {
        exportApi: ['crm-web', 'userInterestsCard', 'export'],
        pool: 'crm',
        taskType: 'userInterestsCardLogExport',
        async: true,
        getExportData: () => {
          var vue = this
          vue.searchForm.filters.bindTimeStart = vue.searchDate[0]
          vue.searchForm.filters.bindTimeEnd = vue.searchDate[1]
          return { filters: vue.searchForm.filters }
        }
      },
      dialogTableVisible: false,
      relationGroupId: null,
      searchDate: [],
      receiveTypes: [{ code: 1, name: this.$t('直接领取') }, { code: 2, name: this.$t('付费购买') }, { code: 3, name: this.$t('累计消费金额') }, { code: 4, name: this.$t('累计总积分') }],
      // { code: '110001', name: this.$t('欧电云自建BBC') }, { code: '110002', name: this.$t('欧电云自建B2B') }, { code: '110003', name: this.$t('欧电云自建O2O') }, { code: '120001', name: this.$t('欧电云自建POS') }
      channels: [],
      searchForm: getDefaultSearchForm(this),
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'cardId',
          label: this.$t('卡编号'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'cardName',
          label: this.$t('卡名称'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          // prop: 'receiveTypeStr',
          label: this.$t('达成条件'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            if (row.receiveType === 1) {
              return this.$t('直接领取')
            } else if (row.receiveType === 2) {
              return this.$t('付费购买')
            } else if (row.receiveType === 3) {
              return this.$t('累计消费金额')
            } else if (row.receiveType === 4) {
              return this.$t('累计总积分')
            } else {
              return row.receiveTypeStr
            }
          }
        },
        {
          show: true,
          prop: 'bindTime',
          label: this.$t('绑卡(支付)时间'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (!row.bindTime) {
              return this.$t('no_exist')
            } else {
              var endDate = row.bindTime // 得到毫秒数
              return this.$portal.parseTime(new Date(endDate))
            }
          }
        },
        {
          show: true,
          prop: 'bindChannelStr',
          label: this.$t('绑卡渠道'),
          align: 'center',
          minWidth: 88,
          formatter: (row, column, cellValue) => {
            if (row.bindChannelStr) {
              var chanarr = row.bindChannelStr.split(',')
              var returnStr = ''
              for (var i = 0; i < chanarr.length; i++) {
                returnStr = returnStr + this.$t(chanarr[i])
                if (i + 1 !== chanarr.length) {
                  returnStr += ','
                }
              }
              return returnStr
            } else {
              return this.$t('no_exist')
            }
          }
        },
        {
          show: true,
          prop: 'price',
          label: this.$t('支付金额(元)'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'mobile',
          label: this.$t('手机号'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'no',
          label: this.$t('卡号'),
          align: 'center',
          minWidth: 200
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
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm(this)
      this.handleSearchSubmit()
    },
    handlePageSizeChange() {
      this.handleSearchSubmit()
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
        this.$forceUpdate()
      } catch (ex) {
        console.log(ex)
      }
    },
    async updateList() {
      try {
        await loadList(this)
        this.$forceUpdate()
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    init() {
      this.loadCodes()
      this.updateList()
    },
    loadCodes() {
      const common = this.$crm.$api.common
      var cateArr = ['SYS_CHANNEL']
      var param = { 'categorys': cateArr, 'pool': 'crm' }
      var vue = this
      common.codeListMulti(param).then(res => {
        for (const i in res.data['SYS_CHANNEL']) {
          vue.channels.push({ code: +i, name: res.data['SYS_CHANNEL'][i] })
        }
      })
    }
  }
}
function getDefaultSearchForm(vue) {
  vue.searchDate = []
  return Object.assign(
    {
      page: 1,
      limit: 10,
      filters: { receiveType: null, bindChannel: null }
    }
  )
}

async function loadList(vue) {
  const userInterestsCard = vue.$crm.$api.userInterestsCard
  vue.searchForm.page = vue.page.current
  vue.searchForm.limit = vue.page.size
  if (vue.searchDate) {
    if (vue.searchDate[0] && vue.searchDate[0] !== '') {
      vue.searchForm.filters.bindTimeStart = vue.searchDate[0] + ' ' + '00:00:00'
    }
    if (vue.searchDate[1] && vue.searchDate[1] !== '') {
      vue.searchForm.filters.bindTimeEnd = vue.searchDate[1] + ' ' + '23:59:59'
    }
  } else {
    vue.searchForm.filters.bindTimeStart = null
    vue.searchForm.filters.bindTimeEnd = null
  }
  if (vue.searchForm.filters.receiveType === '') {
    vue.searchForm.filters.receiveType = null
  }
  if (vue.searchForm.filters.bindChannel === '') {
    vue.searchForm.filters.bindChannel = null
  }

  const res = await userInterestsCard.getUserInterestsCardList(vue.searchForm)
  if (res) {
    const data = res.data
    vue.list = data
    vue.page.total = res.total
  }
}

</script>

<style lang="less" scoped>
.cp-date-range-picker .data-time-name .el-button {
  line-height: 32px !important;
  height: 32px !important;
}
.info_class {
  font-size: 14px;
  height: 20px;
  width: 20px;
  line-height: 20px;
  text-align: center;
  display: inline-block;
  color: #109fff;
  border: 1px solid #19a3ff;
  border-radius: 12px;
  margin-left: 10px;
  cursor: default;
}
.export-task{
  margin-right: 16px;
}
</style>
