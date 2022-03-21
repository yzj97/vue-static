<template>
  <section class="myorder-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <!-- 收货商家 -->
          <ody-search-item :label="$t('purchaseOrder_field_purchaseOrg') + ':'" prop="receiveMerchantName">
            <el-input v-model="searchForm.receiveMerchantName" name="searchForm_receiveMerchantName" maxlength="100" />
          </ody-search-item>
          <!-- 收货店铺 -->
          <ody-search-item :label="$t('purchaseOrder_field_purchaseOrgStore') + ':'" maxlength="100" prop="receiveStoreName">
            <el-input v-model="searchForm.receiveStoreName" name="searchForm_receiveStoreName" />
          </ody-search-item>
          <!-- 采购单号 -->
          <ody-search-item :label="$t('common_purchase_order_code') + ':'" maxlength="120" prop="purchaseCode">
            <el-input v-model="searchForm.purchaseCode" name="searchForm_purchaseCode" />
          </ody-search-item>
          <!-- 采购履行状态 -->
          <ody-search-item :label="$t('purchaseOrder_field_purchaseStatus') + ':'" prop="purchaseStatus">
            <el-select v-model="searchForm.purchaseStatus" name="searchForm_purchaseStatus">
              <el-option :label="'--' + $t('common_choose') + '--'" :key="0" :value="0" />
              <!-- 1未履行 2部分履行 3完全履行 -->
              <!--<el-option v-for="item in [{id: 1, name: '未结案'}, {id: 2, name: '部分结案'}]" :label="item.name" :key="item.id" :value="item.id" />-->
              <el-option :label="$t('purchase_performStatus_not')" :key="1" :value="1" />
              <el-option :label="$t('purchase_performStatus_partly')" :key="2" :value="2" />
              <el-option :label="$t('purchase_performStatus_fully')" :key="3" :value="3" />
            </el-select>
          </ody-search-item>
          <!-- 采购日期 -->
          <ody-search-item
            :label="$t('purchaseOrder_field_purchaseDate') + ':'"
            class="register"
            prop="purchaseDate">
            <ody-date-range-picker
              v-model="searchForm.purchaseDate"
              :show-button="false"
              type="date"
              name="searchForm_purchaseDate"
              value-format="yyyy-MM-dd">range-separator=" ~ "/></ody-date-range-picker>

              <!-- <el-date-picker
              v-model="searchForm.purchaseDate"
              name="searchForm_purchaseDate"
              type="daterange"
              range-separator=" ~ "
            /> -->
          </ody-search-item>
          <!-- 交易币别 -->
          <ody-search-item :label="$t('common_currency') + ':'" prop="currencyCode">
            <el-select v-model="searchForm.currencyCode" name="searchForm_currencyCode">
              <el-option :label="$t('common_status_all')" :key="''" :value="''" />
              <el-option
                v-for="item in currencys"
                :label="item.currencyName"
                :key="item.currencyCode"
                :value="item.currencyCode"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="OpmsMyOrder01_handleSearchSubmit"
          size="small"
          type="primary"
          code="OpmsMyOrder01"
          @click="handleSearchSubmit"
        >{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button name="OpmsMyOrder02_exportData" size="small" code="OpmsMyOrder02" @click="exportData">{{ $t('common_export') }}</ody-button>
      </div>
      <div slot="tabs">
        <el-tabs v-model="searchForm.orderStatus" name="searchForm_orderStatus" @tab-click="handleActiveStatusChange">
          <el-tab-pane :label="$t('common_status_all')" name="0" />
          <el-tab-pane :label="$t('common_audit_status_success')" name="3" />
          <el-tab-pane :label="$t('purchaseOrder_status_finished')" name="5" />
          <el-tab-pane :label="$t('purchaseOrder_status_expired')" name="6" />
          <el-tab-pane :label="$t('purchaseOrder_status_cancelled')" name="7" />
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table :loading="loading" :data="list" :columns="columns" :can-filter="false" name="list321" />
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
import dateUtil from '@/utils/dateUtil'
var vue = null

export default {
  name: 'OpmsMyOrder',
  data() {
    return {
      searchForm: getDefaultSearchForm(),
      loading: false,
      list: [],
      currencys: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          label: this.$t('common_operation'),
          align: 'center',
          // formatter: (row, column, cellValue) => {
          //   return `<a style="white-space: nowrap;color: dodgerblue;" href="/#/opms-web/purchasePlan/certificate/order?purchaseOrderId=${
          //     row.id
          //   }">${vue.$t('supplier_attach_type_qualification')}</a>`
          // },
          render: (h, params) => {
            return (
              <a
                on-click={() => {
                  if (this.$portal.hasPermission('OpmsMyOrder04')) {
                    this.forwardToDetail1(params.row)
                  }
                }}
              >
                <span style={'color:#1890FF'}>
                  {vue.$t('supplier_attach_type_qualification')}
                </span>
              </a>
            )
          }
        },
        {
          show: true,
          prop: 'receiveMerchantName', // 收货商家
          label: this.$t('purchaseOrder_field_purchaseOrg'),
          align: 'center'
        },
        {
          show: true,
          prop: 'receiveStoreName', // 收货店铺
          label: this.$t('purchaseOrder_field_purchaseOrgStore'),
          align: 'center'
        },
        {
          show: true,
          prop: 'purchaseCode', // 采购单号
          label: this.$t('common_purchase_order_code'),
          align: 'center',
          minWidth: 200,
          // formatter: (row, column, cellValue) => {
          //   // 详情页面
          //   return `<a style="white-space: nowrap;color: dodgerblue;" href="/#/opms-web/myorder/detailInfo?purchaseCode=${row.purchaseCode}">${row.purchaseCode}</a>`
          // },
          render: (h, params) => {
            return (
              <a
                on-click={() => {
                  if (this.$portal.hasPermission('OpmsMyOrder03')) {
                    this.forwardToDetail(params.row)
                  }
                }}
              >
                <span style={'color:#1890FF'}>{params.row.purchaseCode}</span>
              </a>
            )
          }
        },
        {
          show: true,
          prop: 'purchaseDate', // 采购日期
          label: this.$t('purchaseOrder_field_purchaseDate'),
          align: 'center',
          formatter: (row, column, cellValue) => {
            return dateFormat(row.purchaseDate)
          }
        },
        {
          show: true,
          prop: 'supplierCode', // 供应商编码
          label: this.$t('common_supplier_code'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'supplierName', // 供应商名称
          label: this.$t('common_supplier_name'),
          align: 'center'
        },
        {
          show: true,
          prop: 'currencyCode', // 交易币别
          label: this.$t('common_currency'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'exchangeRate', // 汇率
          label: this.$t('common_exchangeRate'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          // prop: 'costWithTaxAmt', // 含税金额
          label: this.$t('purchaseOrder_field_costWithTaxAmt'),
          align: 'center',
          formatter: (row, column, cellValue) => {
            // 含税协议价 != null ? 含税协议价 : 含税采购价
            return row.saleWithTaxAmt != null && row.saleWithTaxAmt > 0
              ? row.saleWithTaxAmt
              : row.costWithTaxAmt
          }
        },
        {
          show: true,
          prop: 'purchaserName', // 采购员
          label: this.$t('purchaser_title'),
          align: 'center'
        },
        {
          show: true,
          prop: 'purchaseStatus', // 采购履行状态
          label: this.$t('purchaseOrder_field_purchaseStatus'),
          align: 'center',
          minWidth: 88,
          formatter: (row, column, cellValue) => {
            if (row.purchaseStatus === 1) {
              return `<span>${vue.$t('purchase_performStatus_not')}</span>`
            } else if (row.purchaseStatus === 2) {
              return `<span>${vue.$t('purchase_performStatus_partly')}</span>`
            } else if (row.purchaseStatus === 3) {
              return `<span>${vue.$t('purchase_performStatus_fully')}</span>`
            } else {
              return ''
            }
          }
        },
        {
          show: true,
          prop: 'auditTime', // 审核日期
          label: this.$t('contractProductPriceAdjust_auditTime'),
          align: 'center',
          minWidth: 88,
          formatter: (row, column, cellValue) => {
            return dateFormat(row.auditTime)
          }
        }
      ]
    }
  },
  async mounted() {
    try {
      vue = this
      this.updateList()
      const res = await this.$opms.$api.common.queryCurrencyList()
      if (res) {
        this.currencys = res.data
      }
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
    forwardToDetail(row) {
      this.$router.push({
        name: 'OpmsMyOrderDetailInfo',
        query: { purchaseCode: row.purchaseCode }
      })
    },
    forwardToDetail1(row) {
      this.$router.push({
        name: 'OpmsPurchaseOrderProductCertificate',
        query: { purchaseOrderId: row.id }
      })
    },
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async exportData() {
      try {
        await exportData(this)
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
    },
    handlePageSizeChange() {
      this.handleSearchSubmit()
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleActiveStatusChange() {
      this.updateList()
    }
  }
}

async function loadList(vue, isExport = false) {
  const param = {
    currentPage: vue.page.current,
    itemsPerPage: vue.page.size,
    obj: {
      orderStatus:
        vue.searchForm.orderStatus !== '0' ? vue.searchForm.orderStatus : null,
      receiveMerchantName: vue.searchForm.receiveMerchantName,
      receiveStoreName: vue.searchForm.receiveStoreName,
      purchaseCode: vue.searchForm.purchaseCode,
      purchaseStatus:
        vue.searchForm.purchaseStatus !== 0
          ? vue.searchForm.purchaseStatus
          : null,
      currencyCode: vue.searchForm.currencyCode,
      startPurchaseDate: null,
      endPurchaseDate: null,
      myOrderExport: true
    }
  }
  if (vue.searchForm.purchaseDate != null) {
    if (vue.searchForm.purchaseDate.length > 0) {
      param.obj.startPurchaseDate = vue.searchForm.purchaseDate[0]
    }
    if (vue.searchForm.purchaseDate.length > 1) {
      param.obj.endPurchaseDate = vue.searchForm.purchaseDate[1]
    }
  }
  const myorder = vue.$opms.$api.myorder
  if (!isExport) {
    const res = await myorder.purchaseOrderListPage(param)
    if (res) {
      vue.list = res.data.listObj
      vue.page.total = res.data.total
    }
  } else {
    // 导出exel
    vue.$portal.downloadFileByGet(
      'api/opms-web/purchaseOrder/exportPurchaseOrderList.do',
      { queryContent: JSON.stringify(param.obj) },
      '采购单.xlsx'
    )
  }
}

async function exportData(vue) {
  await loadList(vue, true)
}

function getDefaultSearchForm() {
  return {
    orderStatus: '0',
    receiveMerchantName: '',
    receiveStoreName: '',
    purchaseCode: '',
    purchaseStatus: 0,
    purchaseDate: [],
    currencyCode: ''
  }
}

function dateFormat(time) {
  if (!time) {
    return ''
  }
  return dateUtil.dateFormatForTime(time, false)
}
</script>

<style lang="scss" scoped>
</style>
