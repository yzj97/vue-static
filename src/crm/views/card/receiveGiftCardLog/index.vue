<template>
  <section>
    <ody-list-table-area>
      <div slot="tabs">
        <span>{{ $t('卡号') }}：</span><span>{{ cardCode }} </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span><el-button :disabled="list.length == 0" name="exportData" size="small" type="primary" @click="exportData">{{ $t('export') }}</el-button></span>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="false"
          name="list491"/>
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
          @size-change="query"
          @current-change="query"/>
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>
export default {
  name: 'GiftCardReceivLog',
  data() {
    return {
      cardCode: '',
      searchForm: getDefaultSearchForm(),
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      loading: false,
      list: [],
      columns: [
        {
          show: true,
          prop: 'receiveTime',
          label: this.$t('获赠时间'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column, cellValue) => {
            if (row.receiveTime) {
              return this.$portal.parseTime(row.receiveTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
          }
        },
        {
          show: true,
          prop: 'receivePhone',
          label: this.$t('获赠对象'),
          align: 'center',
          minWidth: 80
        }
      ]
    }
  },
  mounted() {
    this.cardCode = this.$route.query.cardCode
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async init() {
      this.query()
    },
    query() {
      if (this.cardCode) {
        this.loading = true
        try {
          this.searchForm.cardCode = this.cardCode
          const filters = JSON.parse(JSON.stringify(this.searchForm))
          const param = {
            page: this.page.current,
            limit: this.page.size,
            filters: filters
          }
          this.$crm.$api.giftCard.listReceiveCardLog(param).then(res => {
            if (res.code === '0') {
              this.list = res.data
              this.page.total = res.total
            }
          })
        } finally {
          this.loading = false
        }
      }
    },
    exportData() {
      // 导出excel
      this.$portal.downloadFileByGet(
        'api/crm-web/giftCard/exportReceiveLogList.do',
        { cardCode: this.cardCode }
      )
    }
  }
}

function getDefaultSearchForm() {
  return Object.assign(
    {},
    {
      cardCode: null
    }
  )
}
</script>

<style scoped>

</style>
