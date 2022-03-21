<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('卡号') + ':'" prop="filters.cardCode">
            <el-input
              v-model="searchForm.filters.cardCode"
              :placeholder="$t('请输入卡号')"
              name="searchForm_filters_cardCode"
            />
          </ody-search-item>
          <ody-search-item :label="$t('type') + ':'" prop="filters.type">
            <el-select
              v-model="searchForm.filters.type"
              :placeholder="$t('all')"
              name="searchForm_filters_type"
            >
              <el-option
                v-for="(v, k, i) in productTypes"
                v-if="k>=33 && k<=36"
                :key="i"
                :label="v"
                :value="k"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('创建时间') + ':'" prop="timeRange">
            <ody-date-range-picker
              v-model="timeRange"
              :default="7"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="timeRange"
              type="datetimer"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button
          name="GiftCardQuery_handleSearchReset"
          code="GiftCardQuery"
          size="small"
          @click="handleSearchReset"
        >{{ $t('common_reset') }}</ody-button>
        <ody-button
          name="GiftCardQuery_handleSearch"
          code="GiftCardQuery"
          size="small"
          type="primary"
          @click="handleSearch"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs
          v-model="searchForm.filters.status"
          name="searchForm_filters_status"
          @tab-click="handleTabClick"
        >
          <el-tab-pane :key="-1" :name="'-1'" :label="$t('all')" />
          <el-tab-pane v-for="(v, k, i) in statusList" :label="v" :name="k" :key="i" />
        </el-tabs>
        <div slot="btn-bottom">
          <ody-button
            name="GiftCardExport_exportData"
            code="GiftCardExport"
            size="small"
            type="primary"
            @click="exportData"
          >{{ $t('export') }}</ody-button>
          <ody-button
            name="GiftCardExportTask_seeTask"
            code="GiftCardExportTask"
            size="small"
            type="primary"
            @click="seeTask('cardExport')"
          >{{ $t('查看导出任务') }}</ody-button>
          <ody-button
            name="GiftCardSendCard_bindCard"
            code="GiftCardSendCard"
            size="small"
            type="primary"
            @click="bindCard"
          >{{ $t('人工发卡') }}</ody-button>
          <ody-button
            name="GiftCardMakeCard_makeCard"
            code="GiftCardMakeCard"
            size="small"
            type="primary"
            @click="makeCard"
          >{{ $t('makeCard') }}</ody-button>
          <ody-button
            name="GiftCardSendCardTask_seeTask"
            code="GiftCardSendCardTask"
            size="small"
            type="primary"
            @click="seeTask('sendCard')"
          >{{ $t('查看发卡任务') }}</ody-button>
        </div>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="false"
          :operates="operates"
          name="list398"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="searchForm.page"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="searchForm.limit"
          :total.sync="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSearchSubmit"
          @current-change="handleSearchSubmit"
        />
      </div>
    </ody-list-table-area>
    <download-task :task-type="taskType" :is-data-task="true" :visible.sync="showTask" />
    <import-task-dialog :visible.sync="showImportTaskDialog" />
  </section>
</template>

<script>
import DownloadTask from '@/components/downloadTask/index'
import ImportTaskDialog from '@/components/import-task-dialog'

export default {
  name: 'CrmGiftCard',
  components: { DownloadTask, ImportTaskDialog },
  data() {
    return {
      timeRange: [],
      taskType: 'giftCardExport',
      showTask: false,
      showImportTaskDialog: false,
      searchForm: getDefaultSearchForm(),
      total: 0,
      productTypes: {},
      statusList: {},
      loading: false,
      list: [],
      columns: [
        { label: this.$t('卡号'), prop: 'cardCode', show: true, width: 165 },
        {
          label: this.$t('type'),
          prop: 'type',
          align: 'center',
          show: true,
          formatter: (row, column) => this.productTypes[row.type]
        },
        {
          label: this.$t('faceValue'),
          prop: 'faceValue',
          align: 'right',
          show: true,
          formatter: (row, column) =>
            row.type === 33 || row.type === 34
              ? this.$options.filters.currency(row.faceValue)
              : ''
        },
        {
          label: this.$t('兑换商品编码'),
          prop: 'giftMpCode',
          show: true
        },
        {
          label: this.$t('兑换商品名称'),
          prop: 'giftMpName',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('expiryDate'),
          prop: 'expiredTime',
          align: 'center',
          show: true,
          formatter: (row, column) => {
            if (row.status === 0) {
              return ''
            }
            return row.expiredTime == null
              ? this.$t('永久有效')
              : this.$options.filters.parseTime(row.expiredTime, '{y}-{m}-{d}')
          }
        },
        {
          label: this.$t('status'),
          prop: 'status',
          align: 'center',
          show: true,
          minWidth: 88,
          formatter: (row, column) => this.statusList[row.status]
        },
        {
          label: this.$t('创建时间'),
          prop: 'createTime',
          align: 'center',
          show: true,
          minWidth: 200,
          formatter: (row, column) =>
            this.$options.filters.parseTime(
              row.createTime,
              '{y}-{m}-{d} {h}:{i}:{s}'
            )
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        list: [
          {
            label: this.$t('giveRecord'),
            code: 'GiftCardReceiveCardLog',
            hidden(index, row) {
              return row.bindType !== 3
            },
            method: (index, row) => {
              this.$router.push({
                path: '/crm/card/listReceiveCardLog',
                query: {
                  cardCode: row.cardCode
                }
              })
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.loadStatusList()
    this.loadProductType()
    this.handleSearchSubmit()
  },
  methods: {
    handleTabClick() {
      this.searchForm.page = 1
      this.handleSearchSubmit()
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
      const now = new Date()
      const date2 = new Date(now)
      date2.setDate(now.getDate() - 6)
      this.timeRange = [
        this.$portal.parseTime(date2, '{y}-{m}-{d} 00:00:00'),
        this.$portal.parseTime(now, '{y}-{m}-{d} 23:59:59')
      ]
      this.searchForm.page = 1
    },
    handleSearch() {
      this.searchForm.page = 1
      this.handleSearchSubmit()
    },
    async handleSearchSubmit() {
      const param = Object.assign({}, this.searchForm)
      if (param.filters.status === '-1') {
        param.filters = Object.assign({}, param.filters)
        delete param.filters.status
      }
      if (this.timeRange && this.timeRange.length > 0) {
        param.filters.startCreateTime = this.timeRange[0]
        param.filters.endCreateTime = this.timeRange[1]
      }
      this.loading = true
      try {
        const { data, total } = await this.$crm.$api.giftCard.giftCardList(
          param
        )
        data.forEach(row => {
          if (
            (row.status === 1 || row.status === 2) &&
            row.expiredTime < new Date()
          ) {
            row.status = 3
          }
        })
        this.list = data
        this.total = total
      } finally {
        this.loading = false
      }
    },
    exportData() {
      const param = {
        cardCode: this.searchForm.filters.cardCode,
        type: this.searchForm.filters.type
      }
      if (this.timeRange && this.timeRange.length > 0) {
        param.createTimeStart = this.timeRange[0]
        param.createTimeEnd = this.timeRange[1]
      }
      this.$crm.$api.giftCard.exportData(param).then(res => {
        if (res.code === '0') {
          this.$message.success(this.$t('创建导出任务成功！'))
        } else {
          this.$message.error(this.$t('创建导出任务失败！'))
        }
      })
    },
    seeTask(type) {
      if (type === 'cardExport') {
        this.showTask = true
      } else {
        this.showImportTaskDialog = true
      }
    },
    bindCard() {
      this.$router.push({ path: '/crm/card/artificial-send-card' })
    },
    makeCard() {
      this.$router.push({ path: '/crm/card/cardMake' })
    },
    async loadProductType() {
      const { data } = await this.$crm.$api.common.codeListMulti({
        categorys: ['PRODUCT_TYPE'],
        pool: 'product'
      })
      this.productTypes = data['PRODUCT_TYPE']
    },

    async loadStatusList() {
      const { data } = await this.$crm.$api.common.codeListMulti({
        categorys: ['GIFT_CARD_STATUS'],
        pool: 'crm'
      })
      this.statusList = data['GIFT_CARD_STATUS']
    }
  }
}

function getDefaultSearchForm() {
  return {
    page: 1,
    limit: 10,
    filters: { cardCode: null, type: null, status: '-1' }
  }
}
</script>

<style scoped>
</style>
