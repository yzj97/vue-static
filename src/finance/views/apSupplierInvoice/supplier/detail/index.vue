<template>
  <section>
    <el-form ref="form" label-width="100px" class="form">
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="this.$t('invoice_billing_type')+':'">
              {{ formData.invoiceBillingTypeText }}
            </ody-search-item>
            <ody-search-item :label="this.$t('invoice_status')+':'">
              {{ formData.statusText }}
            </ody-search-item>
            <ody-search-item :label="this.$t('invoice_date')+':'">
              {{ $portal.parseTime(formData.invoiceTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
            </ody-search-item>
            <ody-search-item :label="this.$t('invoice_merchant')+':'">
              {{ formData.merchantName }}
            </ody-search-item>
            <ody-search-item :label="this.$t('invoice_store')+':'">
              {{ formData.storeName }}
            </ody-search-item>
            <ody-search-item :label="this.$t('common_supplier_name')+':'">
              {{ formData.supplierName }}
            </ody-search-item>
            <ody-search-item :label="this.$t('invoice_type')+':'">
              {{ formData.invoiceTypeText }}
            </ody-search-item>
            <ody-search-item :label="this.$t('invoice_style')+':'">
              {{ formData.invoiceStyleText }}
            </ody-search-item>
            <ody-search-item :label="this.$t('tax_treatment')+':'">
              {{ formData.taxTreatmentText }}
            </ody-search-item>
            <ody-search-item :label="this.$t('invoice_code')+':'">
              {{ formData.invoiceCode }}
            </ody-search-item>
            <ody-search-item :label="this.$t('invoice_no')+':'">
              {{ formData.invoiceNo }}
            </ody-search-item>
            <ody-search-item :label="this.$t('validate_no')+':'">
              {{ formData.validateNo }}
            </ody-search-item>
            <div v-show="formData.invoiceBillingType == 1">
              <ody-search-item :label="this.$t('invoice_pro_invoice_code')+':'">
                {{ formData.proInvoiceCode }}
              </ody-search-item>
              <ody-search-item :label="this.$t('invoice_pro_invoice_no')+':'">
                {{ formData.proInvoiceNo }}
              </ody-search-item>
              <ody-search-item :label="this.$t('invoice_red_reason')+':'">
                {{ formData.redReason }}
              </ody-search-item>
            </div>
          </el-form>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="list"
            :columns="columns"
            :operates="operates"
            name="list193"
          />
        </div>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page.sync="page.current"
              :list="list"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="page.size"
              :total.sync="page.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handlePageSizeChange"
              @current-change="handlePageCurrentChange"/>
          </div>
        </div>
      </ody-list-table-area>
      <attachment :attachments.sync="attachments"/>
    </el-form>
  </section>
</template>

<script>

import attachment from '@/components/apSupplierInvoice/attachment'

export default {
  name: 'FinanceApSupplierInvoiceDetail',
  components: {
    attachment
  },
  data() {
    return {
      formData: this.$route.query,
      activeState: '-1',
      loading: false,
      list: [],
      attachments: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        { 'show': true, 'prop': 'itemMpCode', 'label': this.$t('common_product_code'), 'align': 'center' },
        { 'show': true, 'prop': 'itemMpName', 'label': this.$t('common_mp_name'), 'align': 'center', 'minWidth': 150 },
        { 'show': true, 'prop': 'itemMpSpec', 'label': this.$t('common_mp_spec'), 'align': 'center' },
        { 'show': true, 'prop': 'itemMpMeasureUnit', 'label': this.$t('common_mp_purchaseUnit'), 'align': 'center' },
        { 'show': true, 'prop': 'itemCategoryCode', 'label': this.$t('invoice_item_category_code'), 'align': 'center' },
        { 'show': true, 'prop': 'itemName', 'label': this.$t('invoice_item_name'), 'align': 'center' },
        { 'show': true, 'prop': 'itemSpec', 'label': this.$t('item_spec'), 'align': 'center' },
        { 'show': true, 'prop': 'itemUnit', 'label': this.$t('item_unit'), 'align': 'center' },
        { 'show': true, 'prop': 'itemNum', 'label': this.$t('item_num'), 'align': 'center' },
        { 'show': true, 'prop': 'itemUnTaxedUnitAmt', 'label': this.$t('item_un_taxed_unit_amt'), 'align': 'center' },
        { 'show': true, 'prop': 'itemTaxedUnitAmt', 'label': this.$t('item_taxed_unit_amt'), 'align': 'center' },
        { 'show': true, 'prop': 'itemUnTaxedAmt', 'label': this.$t('item_un_taxed_amt'), 'align': 'center' },
        { 'show': true, 'prop': 'itemTaxRate', 'label': this.$t('item_tax_rate'), 'align': 'center',
          formatter: (row, column) => {
            if (row.itemTaxRate) {
              return row.itemTaxRate * 100 + '%'
            }
            return ''
          } },
        { 'show': true, 'prop': 'itemTaxAmt', 'label': this.$t('item_tax_amt'), 'align': 'center' },
        { 'show': true, 'prop': 'itemTaxedAmt', 'label': this.$t('item_taxed_amt'), 'align': 'center' },
        { 'show': true, 'prop': 'refOrderCode', 'label': this.$t('receipt_order_code'), 'align': 'center', 'minWidth': 200 },
        { 'show': true, 'prop': 'chkOrderCode', 'label': this.$t('chk_order_code'), 'align': 'center', 'minWidth': 150 }
      ]
    }
  },
  async mounted() {
    await this.updateList()
    await this.loadAttachments()
  },
  methods: {
    async updateList() {
      const vue = this
      try {
        this.loading = true
        const params = {
          filters: {
            invoiceId: this.formData.id
          },
          limit: this.page.size,
          page: this.page.current
        }
        const invoiceApi = this.$finance.$api.apSupplierInvoice
        invoiceApi.getApSupplierInvoiceDetailListPage(params).then((res) => {
          vue.list = res.data
          vue.page.total = res.total
        })
        this.loading = false
      } catch (ex) {
        console.log(ex)
      }
    },
    async loadAttachments() {
      const vue = this
      try {
        this.loading = true
        const invoiceApi = this.$finance.$api.apSupplierInvoice
        const res = await invoiceApi.queryInvoice({ id: this.formData.id })
        if (res.data && res.data.attachments && res.data.attachments.length > 0) {
          vue.attachments = []
          res.data.attachments.forEach(function(item) {
            vue.attachments.push({
              name: item.fileName,
              url: item.fileUrl
            })
          })
        }
        console.info(res.data)
        vue.loading = false
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageSizeChange() {
      await this.updateList()
    },
    async handlePageCurrentChange() {
      await this.updateList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
