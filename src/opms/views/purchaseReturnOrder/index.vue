<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('purchaseOrder_field_purchaseOrg') + ':'" prop="returnMerchantName">
            <el-input v-model="searchForm.returnMerchantName" name="searchForm_returnMerchantName" />
          </ody-search-item>
          <ody-search-item :label="$t('purchaseOrder_field_purchaseOrgStore') + ':'" prop="returnStoreName">
            <el-input v-model="searchForm.returnStoreName" name="searchForm_returnStoreName" />
          </ody-search-item>
          <ody-search-item :label="$t('purchaseReturnOrder_field_returnCode') + ':'" prop="returnCode">
            <el-input v-model="searchForm.returnCode" name="searchForm_returnCode" />
          </ody-search-item>
          <ody-search-item :label="$t('purchaseOrder_field_receiveCode') + ':'" prop="receiveCode">
            <el-input v-model="searchForm.receiveCode" name="searchForm_receiveCode" />
          </ody-search-item>
          <ody-search-item
            :label="$t('purchaseReturnOrder_field_returnDate') + ':'"
            class="register"
            prop="returnDate">
            <ody-date-range-picker
              v-model="searchForm.returnDate"
              type="date"
              name="searchForm_returnDate"
              value-format="yyyy-MM-dd">range-separator="-"/></ody-date-range-picker>
              <!-- <el-date-picker
              v-model="searchForm.returnDate"
              name="searchForm_returnDate"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
            /> -->
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="CP11040201_handleSearchSubmit"
          size="small"
          type="primary"
          code="CP11040201"
          @click="handleSearchSubmit"
        >{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn">
        <ody-button name="CP11040203_exportData" size="small" code="CP11040203" @click="exportData">{{ $t('common_export') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :multiple="true"
          :checked.sync="checked"
          name="list958"
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
          @current-change="handlePageCurrentChange"
        />
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>
export default {
  name: 'OpmsPurchaseReturnOrderList',
  components: {},
  data() {
    return {
      showMerchantModal: false,
      searchForm: {},
      loading: false,
      // userType: getUserType(),
      list: [],
      checked: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'returnMerchantName',
          label: this.$t('purchaseOrder_field_purchaseOrg'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'returnStoreName',
          label: this.$t('purchaseOrder_field_purchaseOrgStore'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'returnCode',
          label: this.$t('purchaseReturnOrder_field_returnCode'),
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            return (
              <a
                on-click={() => {
                  if (this.$portal.hasPermission('CP11040202')) {
                    this.forwardToDetail(params.row)
                  }
                }}
              >
                <span style={'color:#1890FF'}>{params.row.returnCode}</span>
              </a>
            )
          }
        },
        {
          show: true,
          prop: 'returnDateText',
          label: this.$t('purchaseReturnOrder_field_returnDate'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'supplierCode',
          label: this.$t('common_supplier_code'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'supplierName',
          label: this.$t('common_supplier_name'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'currencyCode',
          label: this.$t('common_currency'),
          align: 'center'
        },
        {
          show: true,
          prop: 'exchangeRate',
          label: this.$t('purchaseReturnOrder_product_exchangeRate'),
          align: 'center'
        },
        {
          show: true,
          prop: 'saleWithoutTaxAmt',
          label: this.$t('purchaseReturnOrder_product_costWithoutTaxAmt'),
          align: 'center'
        },
        {
          show: true,
          prop: 'costTaxAmt',
          label: this.$t('purchaseReturnOrder_product_costTaxAmt'),
          align: 'center'
        },
        {
          show: true,
          prop: 'saleWithTaxAmt',
          label: this.$t('purchaseOrder_field_costWithTaxAmt'),
          align: 'center'
        },
        {
          show: true,
          prop: 'returnStatusText',
          label: this.$t('purchaseReturnOrder_returnStatus'),
          align: 'center'
        },
        {
          show: true,
          prop: 'invoiceStatusText',
          label: this.$t('purchaseReturnOrder_field_invoiceStatus'),
          align: 'center'
        },
        {
          show: true,
          prop: 'receiveCode',
          label: this.$t('purchaseOrder_field_receiveCode'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'auditTimeText',
          label: this.$t('common_audit_time'),
          align: 'center',
          minWidth: 200
        }
      ]
    }
  },
  async mounted() {
    try {
      await this.updateList()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
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
        name: 'OpmsPurchaseReturnOrderDetail',
        params: {
          returnCode: row.returnCode
        }
      })
    },
    async exportData() {
      const filters = JSON.parse(JSON.stringify(this.searchForm))
      if (filters.returnDate) {
        filters.startReturnDate = filters.returnDate[0]
        filters.endReturnDate = filters.returnDate[1]
        delete filters.returnDate
      }
      const param = {
        obj: filters,
        itemsPerPage: this.page.size,
        currentPage: this.page.current
      }
      try {
        this.$portal.downloadFileByGet(
          'api/opms-web/purchaseReturnOrder/export.do',
          { queryParams: JSON.stringify(param) },
          '退货单.xlsx'
        )
      } catch (ex) {
        console.log(ex)
      }
    }
  }
}

async function loadList(vue) {
  const filters = JSON.parse(JSON.stringify(vue.searchForm))
  if (filters.returnDate) {
    filters.startReturnDate = filters.returnDate[0]
    filters.endReturnDate = filters.returnDate[1]
    delete filters.returnDate
  }
  const param = {
    obj: filters,
    itemsPerPage: vue.page.size,
    currentPage: vue.page.current
  }
  const purchaseReturnOrder = vue.$opms.$api.purchaseReturnOrder

  const res = await purchaseReturnOrder.purchaseReturnOrderListPage(param)
  if (res) {
    const data = res.data
    vue.list = data.listObj
    vue.page.total = data.total
  }
}
function getDefaultSearchForm() {
  return {}
}
</script>

<style scoped>
</style>
