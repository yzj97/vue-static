<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('制卡时间') + ':'" prop="timeRange">
            <ody-date-range-picker ref="timeRange" v-model="timeRange" :default="7" name="timeRange" type="datetimer" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="CrmGiftCardMakeList_listPage_search"
          code="CrmGiftCardMakeList_listPage"
          size="small"
          type="primary"
          @click="search"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="false"
          name="list289"
        />
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
  name: 'CrmGiftCardMakeList',
  data() {
    return {
      loading: false,
      list: [],
      columns: [
        {
          label: this.$t('制卡时间'),
          prop: 'createTime',
          show: true,
          minWidth: 200,
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
          label: this.$t('制卡张数'),
          prop: 'number',
          show: true,
          minWidth: 88
        },
        {
          label: this.$t('制卡状态'),
          prop: 'statusStr',
          show: true,
          minWidth: 88
        },
        {
          label: this.$t('失败信息'),
          prop: 'failedMsg',
          show: true,
          minWidth: 200
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        list: [
          {
            label: this.$t('查看'),
            code: 'CrmGiftCardMakeList_listDetail',
            hidden: (index, row) => {
              return row.status !== 1
            },
            method: (index, row) => {
              this.$router.push({
                path: '/crm/card/cardMakeDetail',
                query: {
                  id: row.id
                }
              })
            }
          },
          {
            label: this.$t('导出'),
            code: 'CrmGiftCardMakeList_exportData',
            hidden: (index, row) => {
              return row.status !== 1
            },
            method: (index, row) => {
              this.export(row.id)
            }
          },
          {
            label: this.$t('下载'),
            hidden: (index, row) => {
              return row.status !== 2 || !row.failedFile
            },
            method: (index, row) => {
              this.$portal.downloadFileByGet(
                row.failedFile,
                {},
                this.$t('卡制作导入') + '.xlsx'
              )
            },
            code: 'CrmGiftCardMakeList_Download'
          }
        ]
      },
      timeRange: [],
      filters: {},
      page: {
        page: 1,
        limit: 10
      },
      total: 0,
      statusDict: {
        0: this.$t('制作中'),
        1: this.$t('完成'),
        2: this.$t('失败')
      }
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
      this.search()
    },
    search() {
      this.loading = true
      if (this.timeRange && this.timeRange.length > 1) {
        this.filters.startCreateTime = this.timeRange[0]
        this.filters.endCreateTime = this.timeRange[1]
      } else {
        delete this.filters.startCreateTime
        delete this.filters.endCreateTime
      }

      const args = { filters: this.filters, ...this.page }
      this.$crm.$api.giftCard.make_listPage(args).then(
        res => {
          this.loading = false
          this.list = res.data
          this.total = res.total
          this.list.forEach(item => {
            item.statusStr = this.statusDict[item.status]
          })
        },
        () => {
          this.loading = false
        }
      )
    },
    reset() {
      this.filters = {}
      this.timeRange = []
      this.$refs.timeRange.setDefault(7)
    },
    async export(id) {
      await this.$portal.downloadFileByPost(
        '/api/crm-web/giftCardMake/exportData',
        {
          id: id
        }
      )
    }
  }
}
</script>
