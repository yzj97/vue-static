<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('汇总单号：')" prop="summarySheetNo">
              <el-input v-model="searchForm.summarySheetNo" :placeholder="$t('请输入汇总单号')" name="searchForm_summarySheetNo"/>
            </ody-search-item>
          </el-form>
        </div>
        <!--        <div slot="btn">
          <el-button name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
          <ody-button id="soSummaryFlowQuery" name="soSummaryFlowQuery" code="soSummaryFlowQuery" size="small" type="primary" @click="search">{{ $t('查询') }}</ody-button>
        </div>-->
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            name="listTable"/>
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="searchForm.currentPage"
            :list="listTable.list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="searchForm.itemsPerPage"
            :total.sync="listTable.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="search"
            @current-change="query"/>

        </div>
      </ody-list-table-area>
    </section>
  </div>
</template>
<script>
export default {
  name: 'SoSummaryFlow',
  data() {
    return {
      loading: false,
      // 搜索框对象
      searchForm: {},
      // 列表框对象
      listTable: {
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            'show': true,
            'prop': 'summarySheetNo',
            'label': this.$t('汇总单号'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'orderCode',
            'label': this.$t('订单编号'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'merchantId',
            'label': this.$t('商家ID'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'merchantName',
            'label': this.$t('商家名称'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'orderAmount',
            'label': this.$t('订单金额'),
            'align': 'center'
          }
        ]
      }
    }
  },
  mounted() {
    this.initForm()
    this.searchForm.summarySheetNo = this.$route.query.summarySheetNo || this.$route.params.summarySheetNo || null
    this.init()
  },
  methods: {
    async init() {
      try {
        await this.query()
      } catch (e) {
        console.log(e)
      }
    },
    async search() {
      this.searchForm.currentPage = 1
      await this.query()
    },
    async query() {
      const self = this
      const chkSupplierPurchase = this.$finance.$api.chkSupplierPurchase
      try {
        const params = {
          summarySheetNo: this.searchForm.summarySheetNo,
          page: this.searchForm.currentPage,
          limit: this.searchForm.itemsPerPage
        }
        this.loading = true
        const res = await chkSupplierPurchase.selectSoReturnSummaryDetail(params)
        self.listTable.list = res.data.listObj
        self.listTable.total = res.data.total
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    // 初始化搜索对象
    initForm() {
      this.searchForm = {
        currentPage: 1,
        itemsPerPage: 10
      }
    }
  }
}
</script>
