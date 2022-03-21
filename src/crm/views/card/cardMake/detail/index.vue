<template>
  <section>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="false"
          name="list292">
          <template slot="failedFile" slot-scope="scope">
            <el-link v-show="scope.row.status === 2 && failedFile" :href="failedFile">{{ $t('下载') }}</el-link>
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
          @current-change="search"/>
      </div>
    </ody-list-table-area>
    <el-row type="flex" justify="center" style="margin-top: 5px">
      <ody-button name="portal_delActiveView" size="small" @click="$portal.delActiveView('CrmGiftCardMakeList')">{{ $t('返回') }}</ody-button>
    </el-row>
  </section>
</template>
<script>
export default {
  name: 'CrmGiftCardMakeDetail',
  data() {
    return {
      loading: false,
      list: [],
      columns: [
        { label: this.$t('卡号'), prop: 'cardCode', show: true, minWidth: 170 },
        { label: this.$t('商品编码'), prop: 'cardMpCode', show: true, minWidth: 150 },
        { label: this.$t('商品名称'), prop: 'cardMpName', show: true, minWidth: 200 },
        { label: this.$t('商品类型'), prop: 'typeStr', show: true, minWidth: 120 },
        { label: this.$t('面值') + '(' + this.$t('元') + ')', prop: 'faceValue', show: true, minWidth: 80,
          formatter: (row, column) => row.type === 33 || row.type === 34 ? this.$options.filters.currency(row.faceValue) : ''
        },
        { label: this.$t('兑换商品编码'), prop: 'giftMpCode', show: true, minWidth: 150 },
        { label: this.$t('兑换商品名称'), prop: 'giftMpName', show: true, minWidth: 200 }
      ],
      page: {
        page: 1,
        limit: 10
      },
      makeId: null,
      total: 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      if (this.$route.query.id !== null) {
        this.makeId = this.$route.query.id
        this.search()
      }
    },
    search() {
      if (!this.makeId) {
        return
      }
      this.loading = true
      const args = { filters: { makeId: this.makeId }, ...this.page }
      this.$crm.$api.giftCard.giftCardList(args).then(res => {
        this.loading = false
        this.list = res.data
        this.total = res.total
      }, () => { this.loading = false })
    }
  }
}
</script>
