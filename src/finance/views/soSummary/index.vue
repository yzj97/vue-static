<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('汇总单号：')" prop="summarySheetNo">
              <el-input v-model="searchForm.summarySheetNo" :placeholder="$t('请输入汇总单号')" name="searchForm_summarySheetNo"/>
            </ody-search-item>
            <ody-search-item :label="$t('汇总类型：')" prop="summaryType">
              <el-select v-model="searchForm.summaryType" :placeholder="$t('全部')" name="searchForm_summaryType">
                <el-option
                  v-for="item in summaryTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('汇总日期：')" :space="2" prop="summaryDate">
              <ody-date-range-picker
                v-model="searchForm.summaryDate"
                :start-placeholder="$t('startDate')"
                :end-placeholder="$t('endDate')"
                name="searchForm_summaryDate"
                value-format="yyyy-MM-dd"
                type="date"
                range-separator="-"
              />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
          <ody-button id="soSummaryQuery" name="soSummaryQuery" code="soSummaryQuery" size="small" type="primary" @click="search">{{ $t('查询') }}</ody-button>
        </div>
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
  name: 'SoSummary',
  data() {
    return {
      loading: false,
      // 搜索框对象
      searchForm: {},
      summaryTypeList: [
        {
          value: '1',
          label: this.$t('销售订单汇总')
        },
        {
          value: '2',
          label: this.$t('仅退款售后单汇总')
        },
        {
          value: '3',
          label: this.$t('退货退款售后单汇总')
        }
      ],
      // 列表框对象
      listTable: {
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            'show': true,
            'prop': 'summaryType',
            'label': this.$t('汇总类型'),
            'align': 'center',
            formatter: (row, column) => {
              return row.summaryType === 1 ? '销售订单汇总' : row.summaryType === 2 ? '仅退款售后单汇总' : '退货退款售后单汇总'
            }

          },
          {
            'show': true,
            'prop': 'summarySheetNo',
            'label': this.$t('汇总单号'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'orderNumber',
            'label': this.$t('订单数'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'summaryAmount',
            'label': this.$t('汇总金额'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'summaryDate',
            'label': this.$t('汇总日期'),
            'align': 'center'
          }
        ],
        operates: {
          'width': 100,
          'fixed': 'right',
          'list': [
            {
              label: this.$t('查看明细'),
              method: (index, row) => {
                this.$router.push({
                  name: 'SoSummaryFlow',
                  query: {
                    summarySheetNo: row.summarySheetNo
                  }
                })
              },
              code: 'SoSummaryFlowDetail'
            }
          ]
        }}

    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.initForm()
      // 常量赋值
      // this.isAvailable = constants.isAvailable
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
          summaryType: this.searchForm.summaryType,
          page: this.searchForm.currentPage,
          limit: this.searchForm.itemsPerPage
        }
        if (this.searchForm.summaryDate && this.searchForm.summaryDate.length > 0) {
          params.startTime = this.searchForm.summaryDate[0]
          params.endTime = this.searchForm.summaryDate[1]
        }
        this.loading = true
        const res = await chkSupplierPurchase.selectSoSummaryBill(params)
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
