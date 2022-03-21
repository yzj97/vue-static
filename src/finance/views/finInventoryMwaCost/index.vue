<template>
  <section class="pg-apSupplierInvoice-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item v-show="showMerchant" :label="$t('common_merchant_name') + ':'" prop="merchantName">
            <el-input v-model="searchForm.merchantName" name="searchForm_merchantName" maxlength="25" readonly="readonly" @focus="showMerchantModal"/>
          </ody-search-item>
          <ody-search-item :label="$t('common_warehouse_name') + ':'" prop="warehouseName">
            <el-input v-model="searchForm.warehouseName" name="searchForm_warehouseName" maxlength="25" readonly="readonly" @focus="showWarehouseModal"/>
          </ody-search-item>
          <ody-search-item :label="$t('date_and_time') + ':'" class="register" prop="tradeTime">
            <ody-date-range-picker
              v-model="searchForm.tradeTime"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="searchForm_tradeTime"
              value-format="yyyy-MM-dd"
              type="date"
              range-separator="-" />
          </ody-search-item>
          <ody-search-item :label="$t('common_product_codeOrBarcode') + ':'" prop="mpCodeOrmpBarcode">
            <el-input v-model="searchForm.mpCodeOrmpBarcode" name="searchForm_mpCodeOrmpBarcode" maxlength="50" />
          </ody-search-item>
          <ody-search-item prop="endNumZeroFlag">
            <el-checkbox v-model="endNumZeroFlag" name="endNumZeroFlag">{{ $t('end_num_is_zero_not_show') }}</el-checkbox>
          </ody-search-item>
          <ody-search-item prop="changeZeroFlag">
            <el-checkbox v-model="changeZeroFlag" name="changeZeroFlag">{{ $t('no_amount_in_this_period_not_show') }}</el-checkbox>
          </ody-search-item>
          <ody-search-item :label="$t('common_product_name') + ':'" prop="mpName">
            <el-input v-model="searchForm.mpName" name="searchForm_mpName" maxlength="50" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button name="InventoryMwaCostList_handleSearchSubmit" code="InventoryMwaCostList" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="InventoryMwaCostExport_exportFinInventoryMwaCost" code="InventoryMwaCostExport" size="small" @click="exportFinInventoryMwaCost">{{ $t('common_export') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :show-summary="showSummary7"
          :summary-method="getSummaries"
          :can-filter="false"
          name="list916"
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
          @current-change="handlePageCurrentChange"/>

      </div>
    </ody-list-table-area>
    <MerchantSelectModal :visible.sync="merchantModalVisible" @ok="selectMerchant" />
    <WarehouseModal :visible.sync="warehouseModalVisible" :merchant-id.sync="searchForm.merchantId" multi-select="false" @ok="selectWarehouse" />
  </section>
</template>
<script>
import dateUtil from '@/utils/dateUtil'
import MerchantSelectModal from '@/components/merchantModal'
import WarehouseModal from '@/components/warehouseModal'

export default {
  name: 'FinInventoryMwaCost',
  components: {
    MerchantSelectModal,
    WarehouseModal
  },
  data() {
    const self = this
    return {
      merchantModalVisible: false,
      warehouseModalVisible: false,
      searchForm: getDefaultSearchForm(),
      merchantInfo: {},
      showMerchant: true,
      endNumZeroFlag: true,
      changeZeroFlag: true,
      showSummary7: true,
      loading: false,
      list: [],
      totalInfo: {
        totalInAmt: null,
        totalOutAmt: null
      },
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: () => {
            return self.showMerchant
          },
          prop: 'merchantName',
          label: this.$t('common_merchant_name'),
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'mpCode',
          label: this.$t('common_mp_code'),
          align: 'center',
          minWidth: 150
        },
        // {
        //   show: true,
        //   prop: 'mpBarcode',
        //   label: this.$t('common_mp_barcode'),
        //   align: 'center',
        //   minWidth: 150
        // },
        {
          show: true,
          prop: 'mpName',
          label: this.$t('common_mp_name'),
          align: 'center',
          minWidth: 200
        },
        // {
        //   show: true,
        //   prop: 'mpSpec',
        //   label: this.$t('common_mp_spec'),
        //   align: 'center',
        //   minWidth: 80
        // },
        // {
        //   show: true,
        //   prop: 'mpMeasureUnit',
        //   label: this.$t('stock_keeping_unit'),
        //   align: 'center',
        //   minWidth: 80
        // },
        {
          show: true,
          prop: 'tradeTimeStr',
          label: this.$t('common_dateTime'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'billTypeStr',
          label: this.$t('bill_name'),
          align: 'center',
          minWidth: 180
        },
        {
          show: true,
          prop: 'billCode',
          label: this.$t('invoice_ref_code'),
          align: 'center',
          minWidth: 200
        },
        // {
        //   show: true,
        //   prop: 'currencyCode',
        //   label: this.$t('common_currency'),
        //   align: 'center',
        //   minWidth: 80
        // },

        // {
        //   show: true,
        //   prop: 'exchangeRate',
        //   label: this.$t('trading_currency'),
        //   align: 'center',
        //   minWidth: 80
        // },
        // {
        //   show: true,
        //   prop: 'fcCostWithOutTax',
        //   label: this.$t('foreign_currency_unit_price'),
        //   align: 'center',
        //   minWidth: 80
        // },
        // {
        //   show: true,
        //   prop: 'fcWithOutTaxFcAmt',
        //   label: this.$t('foreign_currency_amt'),
        //   align: 'center',
        //   minWidth: 80
        // },
        {
          show: true,
          label: this.$t('open_balance'),
          columns: [
            {
              show: true,
              prop: 'openNum',
              label: this.$t('common_num'),
              align: 'center',
              minWidth: 100
            },
            {
              show: true,
              prop: 'openCostWithoutTaxUnitBcAmt',
              label: this.$t('common_unit_price'),
              align: 'center',
              minWidth: 100
            },
            {
              show: true,
              prop: 'openWithoutTaxBcAmt',
              label: this.$t('common_amt'),
              align: 'center',
              minWidth: 100
            }
          ],
          align: 'center'
        },
        {
          show: true,
          label: this.$t('current_inventory'),
          columns: [
            {
              show: true,
              prop: 'inNum',
              label: this.$t('common_num'),
              align: 'center',
              minWidth: 100
            },
            {
              show: true,
              prop: 'inCostWithoutTaxUnitBcAmt',
              label: this.$t('common_unit_price'),
              align: 'center',
              minWidth: 100
            },
            {
              show: true,
              prop: 'inWithoutTaxBcAmt',
              label: this.$t('common_amt'),
              align: 'center',
              minWidth: 200
            }
          ],
          align: 'center'
        },
        {
          show: true,
          label: this.$t('current_out_inventory'),
          columns: [
            {
              show: true,
              prop: 'outNum',
              label: this.$t('common_num'),
              align: 'center',
              minWidth: 100
            },
            {
              show: true,
              prop: 'outCostWithoutTaxUnitBcAmt',
              label: this.$t('common_unit_price'),
              align: 'center',
              minWidth: 100
            },
            {
              show: true,
              prop: 'outWithoutTaxBcAmt',
              label: this.$t('common_amt'),
              align: 'center',
              minWidth: 200
            }
          ],
          align: 'center'
        },
        {
          show: true,
          label: this.$t('end_balance'),
          columns: [
            {
              show: true,
              prop: 'endNum',
              label: this.$t('common_num'),
              align: 'center',
              minWidth: 100
            },
            {
              show: true,
              prop: 'endCostWithoutTaxUnitBcAmt',
              label: this.$t('common_unit_price'),
              align: 'center',
              minWidth: 100
            },
            {
              show: true,
              prop: 'endWithoutTaxBcAmt',
              label: this.$t('common_amt'),
              align: 'center',
              minWidth: 100
            }
          ],
          align: 'center'
        }
      ]
    }
  },
  // async mounted() {
  //   try {
  //     this.init()
  //   } catch (ex) {
  //     console.log(ex)
  //   }
  // },
  mounted() {
    setTimeout(() => {
      // 不能async修改，通过showSummary再控制
      if (this.showMerchant) {
        this.getSummaries = ({ columns, data }) => [this.$t('common_total'), '', '', '', '', '', '', '', '', '', '', this.totalInfo.totalInAmt, '', '', this.totalInfo.totalOutAmt, '', '']
      } else {
        this.getSummaries = ({ columns, data }) => [this.$t('common_total'), '', '', '', '', '', '', '', '', '', this.totalInfo.totalInAmt, '', '', this.totalInfo.totalOutAmt, '', '']
      }
      this.showSummary7 = true
    }, 1000)
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    // async initMerchantInfo() {
    //   const result = await this.$finance.$api.common.queryUserMerchant()
    //   this.merchantInfo = result.data
    // },
    selectMerchant(merchant) {
      if (merchant) {
        this.searchForm.merchantId = merchant.merchantId
        this.searchForm.merchantCode = merchant.merchantCode
        this.searchForm.merchantName = merchant.merchantName
        this.clearWarehouseInfo()
      }
    },
    showMerchantModal() {
      this.merchantModalVisible = true
    },
    clearWarehouseInfo() {
      this.searchForm.warehouseId = null
      this.searchForm.warehouseCode = null
      this.searchForm.warehouseName = null
    },
    // async checkHiddenMerchant() {
    //   // 如果只有一个商家权限，隐藏商家
    //   const param = {
    //     itemsPerPage: 10,
    //     currentPage: 1,
    //     obj: {}
    //   }
    //   const common = this.$finance.$api.common
    //   const result = await common.merchantList(param)
    //   if (result && result.data) {
    //     const data = result.data
    //     if (data.total === 1) {
    //       this.showMerchant = false
    //       this.selectMerchant(data.listObj[0])
    //     }
    //   }
    // },
    showWarehouseModal() {
      this.warehouseModalVisible = true
    },
    selectWarehouse(warehouse) {
      if (warehouse) {
        this.searchForm.warehouseId = warehouse.id
        this.searchForm.warehouseCode = warehouse.warehouseCode
        this.searchForm.warehouseName = warehouse.warehouseName
      }
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
      this.changeZeroFlag = true
      this.endNumZeroFlag = true
      this.searchForm = getDefaultSearchForm()
      // this.checkHiddenMerchant()
      // this.initMerchantInfo()
      var dateNow = this.$portal.parseTime(new Date(), '{y}-{m}-{d}')
      var dateNow1 = this.$portal.parseTime(new Date(), '{y}-{m}-{d}')
      this.searchForm.tradeTime = [dateNow, dateNow1]
    },
    handlePageSizeChange(size) {
      this.handleSearchSubmit()
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async init() {
      var dateNow = this.$portal.parseTime(new Date(), '{y}-{m}-{d}')
      var dateNow1 = this.$portal.parseTime(new Date(), '{y}-{m}-{d}')
      this.searchForm.tradeTime = [dateNow, dateNow1]
      // await this.checkHiddenMerchant()
      // await this.initMerchantInfo()
    },
    exportFinInventoryMwaCost() {
      const filters = JSON.parse(JSON.stringify(this.searchForm))
      if (filters.tradeTime == null) {
        this.$alert(this.$t('common_choose_date'), this.$t('prompt'))
        return
      }
      if (filters.tradeTime.length > 0) {
        filters.tradeTimeStart = filters.tradeTime[0]
        filters.tradeTimeEnd = filters.tradeTime[1]
        if (!dateUtil.lessThanRangeDate(filters.tradeTimeStart, filters.tradeTimeEnd, 90 * 24 * 60 * 60 * 1000)) {
          this.$alert(this.$t('common_date_tip'), this.$t('prompt'))
          return
        }
      } else {
        this.$alert(this.$t('common_choose_date'), this.$t('prompt'))
        return
      }
      changeChecbox(this, filters)
      this.$portal.downloadFileByPost('/api/back-finance-web/finInventoryMwaCostController/exportFinInventoryMwaCostList.do', filters)
    }
  }
}
async function loadList(vue) {
  const filters = JSON.parse(JSON.stringify(vue.searchForm))
  if (filters.tradeTime == null) {
    vue.$alert(vue.$t('common_choose_date'), vue.$t('prompt'))
    return
  }
  if (filters.tradeTime.length > 0) {
    filters.tradeTimeStart = filters.tradeTime[0]
    filters.tradeTimeEnd = filters.tradeTime[1]
    if (!dateUtil.lessThanRangeDate(filters.tradeTimeStart, filters.tradeTimeEnd, 90 * 24 * 60 * 60 * 1000)) {
      vue.$alert(vue.$t('common_date_tip'), vue.$t('prompt'))
      return
    }
  } else {
    vue.$alert(vue.$t('common_choose_date'), vue.$t('prompt'))
    return
  }
  changeChecbox(vue, filters)
  const param = {
    filters: filters,
    limit: vue.page.size,
    page: vue.page.current
  }
  const finInventoryMwaCost = vue.$finance.$api.finInventoryMwaCost

  const res = await finInventoryMwaCost.listFinInventoryMwaCostPage(param)
  if (res) {
    const data = res
    vue.list = data.data
    vue.page.total = data.total
    const totalRes = await finInventoryMwaCost.querySummary(param)
    if (totalRes) {
      vue.totalInfo = totalRes.data
    }
  }
}
function changeChecbox(vue, filters) {
  if (vue.endNumZeroFlag === true) {
    filters.endNumZeroFlag = 1
  } else {
    filters.endNumZeroFlag = 0
  }

  if (vue.changeZeroFlag === true) {
    filters.changeZeroFlag = 1
  } else {
    filters.changeZeroFlag = 0
  }
  return filters
}
function getDefaultSearchForm() {
  return Object.assign({ tradeTime: [] })
}
</script>

<style lang="scss" scoped>
</style>
