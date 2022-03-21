<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('common_merchant_name') + ':'" prop="merchantName">
            <el-input v-model="queryContent.merchantName" name="queryContent_merchantName"/>
          </ody-search-item>
          <ody-search-item :label="$t('invoice_type') + ':'" prop="invoiceType">
            <el-select v-model="queryContent.invoiceType" :placeholder="$t('common_all')" name="queryContent_invoiceType">
              <el-option :label="$t('invoice_type_ordinary')" value="1"/>
              <el-option :label="$t('invoice_type_special')" value="2"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('invoice_no') + ':'" prop="invoiceNo">
            <el-input v-model="queryContent.invoiceNo" name="queryContent_invoiceNo"/>
          </ody-search-item>
          <ody-search-item :label="$t('invoice_code') + ':'" prop="invoiceCode">
            <el-input v-model="queryContent.invoiceCode" name="queryContent_invoiceCode"/>
          </ody-search-item>
          <ody-search-item :label="$t('invoice_ref_code') + ':'" prop="refOrderCode">
            <el-input v-model="queryContent.refOrderCode" name="queryContent_refOrderCode"/>
          </ody-search-item>
          <ody-search-item :label="$t('invoice_date') + ':'" class="register" prop="invoiceTime">
            <ody-date-range-picker
              v-model="queryContent.invoiceTime"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="queryContent_invoiceTime"
              value-format="yyyy-MM-dd"
              type="date"
              range-separator="-"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button name="FinanceApSupplierInvoiceList_handleSearchSubmit" code="FinanceApSupplierInvoiceList" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="FinanceApSupplierInvoiceExport_exportItem" code="FinanceApSupplierInvoiceExport" size="small" @click="exportItem">{{ $t('common_export') }}</ody-button>
      </div>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" @tab-click="handleTabsClick" >
          <el-tab-pane v-for="tab in tabs" :label="tab.heading" :key="tab.index" />
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          name="list684"
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
  </section>
</template>

<script>
export default {
  name: 'FinanceApSupplierInvoice',
  data() {
    return {
      activeState: '0',
      loading: false,
      list: [],
      queryContent: {},
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columnDefs: [
        { 'show': true, 'prop': 'supplierName', 'label': this.$t('common_supplier_name'), 'align': 'center', 'minWidth': 124 },
        { 'show': true, 'prop': 'merchantName', 'label': this.$t('common_merchant_name'), 'align': 'center', 'minWidth': 124 },
        { 'show': true, 'prop': 'storeName', 'label': this.$t('common_store_name'), 'align': 'center', 'minWidth': 124 },
        { 'show': true, 'prop': 'invoiceTypeText', 'label': this.$t('invoice_type'), 'align': 'center', 'minWidth': 124 },
        { 'show': true, 'prop': 'invoiceStyleText', 'label': this.$t('invoice_style'), 'align': 'center', 'minWidth': 124 },
        { 'show': true, 'prop': 'openStatusText', 'label': this.$t('invoice_open_status'), 'align': 'center', 'minWidth': 88 },
        { 'show': true, 'prop': 'statusText', 'label': this.$t('invoice_status'), 'align': 'center', 'minWidth': 88 },
        { 'show': true, 'prop': 'invoiceNo', 'label': this.$t('invoice_no'), 'align': 'center', 'minWidth': 124,
          render: function(h, params) {
            const to = {
              name: 'FinanceApSupplierInvoiceDetail',
              query: params.row
            }
            return (
              <router-link to={to} class='link-type'>
                <span>{ params.row.invoiceNo}</span>
              </router-link>
            )
          }
        },
        { 'show': true, 'prop': 'invoiceCode', 'label': this.$t('invoice_code'), 'align': 'center', 'minWidth': 124 },
        { 'show': true, 'prop': 'invoiceTime', 'label': this.$t('invoice_date'), 'align': 'center', 'minWidth': 200,
          formatter: (row, column) => {
            if (row.invoiceTime) {
              return this.$portal.parseTime(row.invoiceTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
            return ''
          } },
        { 'show': true, 'prop': 'invoiceTaxedAmt', 'label': this.$t('invoice_taxed_amt'), 'align': 'center', 'minWidth': 124 },
        { 'show': true, 'prop': 'invoiceUnTaxedAmt', 'label': this.$t('invoice_un_taxed_amt'), 'align': 'center', 'minWidth': 124 },
        { 'show': true, 'prop': 'invoiceTaxAmt', 'label': this.$t('invoice_tax_amt'), 'align': 'center', 'minWidth': 88 },
        { 'show': true, 'prop': 'redFlushText', 'label': this.$t('is_red'), 'align': 'center', 'minWidth': 88 }
      ],
      columnsRed: [
        { 'show': true, 'prop': 'redReason', 'label': this.$t('invoice_red_reason'), 'align': 'center', 'minWidth': 124 },
        { 'show': true, 'prop': 'invoiceCode', 'label': this.$t('invoice_pro_invoice_code'), 'align': 'center', 'minWidth': 124 },
        { 'show': true, 'prop': 'invoiceNo', 'label': this.$t('invoice_pro_invoice_no'), 'align': 'center', 'minWidth': 124 }
      ]
    }
  },
  async mounted() {
    await this.init()
  },
  methods: {
    async init() {
      this.tabs = [
        {
          heading: this.$t('invoice_billing_type_blue'),
          index: 0
        }, {
          heading: this.$t('invoice_billing_type_red'),
          index: 1
        }
      ]
      await this.handleTabsClick()
    },
    async handleTabsClick() {
      try {
        this.queryContent.invoiceBillingType = this.activeState
        this.page.current = 1
        if (this.activeState === '1') {
          this.columns = this.columnDefs.concat(this.columnsRed)
        } else {
          this.columns = this.columnDefs
        }
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },

    async updateList() {
      try {
        this.loading = true
        this.queryContent.status = '2'
        if (this.queryContent.invoiceTime != null) {
          this.queryContent.startInvoiceTime = this.queryContent.invoiceTime[0]
          this.queryContent.endInvoiceTime = this.queryContent.invoiceTime[1]
        }
        const param = {
          filters: Object.assign({}, this.queryContent),
          limit: this.page.size,
          page: this.page.current,
          joinFields: ['attachments']
        }
        delete param.filters.invoiceTime
        const apSupplierInvoice = this.$finance.$api.apSupplierInvoice
        const res = await apSupplierInvoice.listPage(param)
        this.list = res.data.list
        this.page.total = res.data.total
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    async handleSearchSubmit() {
      this.page.current = 1
      await this.updateList()
    },
    async handleSearchReset() {
      this.queryContent = {
        invoiceBillingType: this.activeState
      }
      await this.updateList()
    },
    exportItem() {
      const filters = JSON.parse(JSON.stringify(this.queryContent))
      console.log(filters)
      if (filters.invoiceTime) {
        filters.startInvoiceTime = filters.invoiceTime[0]
        filters.endInvoiceTime = filters.invoiceTime[1]
        delete filters.invoiceTime
      }

      this.$portal.downloadFileByPost('/api/back-finance-web/apSupplierInvoice/export.do', filters)
    },
    async handlePageSizeChange(size) {
      this.handleSearchSubmit()
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
