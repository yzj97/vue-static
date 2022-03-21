<template>
  <section class="pg-apSupplierInvoice-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item v-show="showMerchant" :label="$t('结算商家') + ':'" prop="merchantName">
            <el-input
              v-model="searchForm.merchantName"
              name="searchForm_merchantName"
              maxlength="25"
              readonly="readonly"
              @focus="showMerchantModal"
            />
          </ody-search-item>
          <ody-search-item :label="$t('结算店铺') + ':'" prop="storeCode">
            <ody-store-select
              v-model="searchForm.storeCode"
              :placeholder="$t('全部')"
              name="searchForm_storeCode"
              value-key="storeCode"
            />
          </ody-search-item>
          <ody-search-item :label="$t('invoice_customer_type') + ':'" prop="customerType">
            <el-select v-model="searchForm.customerType" :placeholder="$t('common_all')" name="searchForm_customerType">
              <el-option v-for="(v, k) in customerTypeMap" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('invoice_customer_name') + ':'" prop="customerName">
            <el-input v-model="searchForm.customerName" name="searchForm_customerName" maxlength="25" />
          </ody-search-item>
          <ody-search-item :label="$t('invoice_type') + ':'" prop="invoiceType">
            <el-select v-model="searchForm.invoiceType" :placeholder="$t('common_all')" name="searchForm_invoiceType">
              <el-option
                v-for="item in invoiceTypeList"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('invoice_style') + ':'" prop="invoiceStyle">
            <el-select v-model="searchForm.invoiceStyle" :placeholder="$t('common_all')" name="searchForm_invoiceStyle">
              <el-option v-for="(v, k) in invoiceStyleMap" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('invoice_no') + ':'" prop="invoiceNo">
            <el-input v-model="searchForm.invoiceNo" name="searchForm_invoiceNo" maxlength="25" />
          </ody-search-item>
          <ody-search-item :label="$t('invoice_code') + ':'" prop="invoiceCode">
            <el-input v-model="searchForm.invoiceCode" name="searchForm_invoiceCode" maxlength="25" />
          </ody-search-item>
          <ody-search-item :label="$t('invoice_status') + ':'" prop="status">
            <el-select v-model="searchForm.status" :placeholder="$t('common_all')" name="searchForm_status">
              <el-option
                v-for="item in statusList"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('invoice_open_status') + ':'" prop="openStatus">
            <el-select v-model="searchForm.openStatus" :placeholder="$t('common_all')" name="searchForm_openStatus">
              <el-option
                v-for="item in openStatusList"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('invoice_date') + ':'" class="register" prop="invoiceTime">
            <ody-date-range-picker
              v-model="searchForm.invoiceTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="searchForm_invoiceTime"
              value-format="yyyy-MM-dd"
              type="date"
              range-separator="-"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="SaleInvoiceQuery_handleSearchSubmit"
          code="SaleInvoiceQuery"
          size="small"
          type="primary"
          @click="handleSearchSubmit"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="SaleInvoiceAdd_showChkCustomerModal" code="SaleInvoiceAdd" size="small" type="primary" @click="showChkCustomerModal">{{ $t('common_add') }}</ody-button>
        <ody-button name="SaleInvoiceExport_exportItem" code="SaleInvoiceExport" size="small" @click="exportItem">{{ $t('common_export') }}</ody-button>
      </div>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" @tab-click="handleTabsClick">
          <el-tab-pane v-for="tab in tabs" :label="$t(tab.heading)" :key="tab.index" />
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table :loading="loading" :data="list" :columns="columns" :operates="operates" name="list534" />
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
    <MerchantSelectModal :visible.sync="merchantModalVisible" @ok="selectMerchant" />
    <StoreSelectModal
      :visible.sync="storeModalVisible"
      :merchant-id.sync="searchForm.merchantId"
      :merchant-code.sync="searchForm.merchantCode"
      need-merchant="false"
      multi-select="false"
      @ok="selectStore"
    />
    <AuditModal :visible.sync="auditModalVisible" :id="selectedItem.id" @ok="updateList" />
    <ChkCustomerSoModal
      :visible.sync="chkCustomerSoModalVisible"
      chk-order-type="1"
      chk-status="2"
      @ok="selectChkCustomerModal"
    />
  </section>
</template>
<script>
import MerchantSelectModal from '@/components/merchantModal'
import StoreSelectModal from '@/components/storeModal'
import AuditModal from '@/components/apSupplierInvoice/auditModal'
import ChkCustomerSoModal from '@/components/apSupplierInvoice/chkCustomerSoModal'

export default {
  name: 'FinanceInvoiceSaleList',
  components: {
    MerchantSelectModal,
    StoreSelectModal,
    AuditModal,
    ChkCustomerSoModal
  },
  data() {
    const self = this
    return {
      merchantModalVisible: false,
      storeModalVisible: false,
      auditModalVisible: false,
      chkCustomerSoModalVisible: false,
      searchForm: getDefaultSearchForm(),
      merchantInfo: {},
      platform: null,
      showMerchant: true,
      invoiceTypeList: [],
      invoiceStyleMap: {},
      customerTypeMap: {},
      statusList: [],
      openStatusList: [],
      selectedItem: {},
      activeState: '0',
      loading: false,
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [],
      baseColumns: [
        {
          show: true,
          label: this.$t('common_operations'),
          minWidth: 250,
          render: (h, params) => {
            const openStatus = params.row.openStatus
            const status = params.row.status
            const invoiceBillingType = params.row.invoiceBillingType
            const invoiceStyle = params.row.invoiceStyle
            let showEdit = true
            if (self.platform === 1) {
              if (!self.merchantInfo.merchantCode) {
                showEdit = false
              } else {
                showEdit =
                  self.merchantInfo.merchantCode === params.row.merchantCode
              }
            }
            let editComponent
            let deleteComponent
            let auditComponent
            let redComponent
            let downComponent
            if (status === 1 && invoiceStyle === 0 && showEdit) {
              editComponent = (
                <ody-button
                  size='mini'
                  code='SaleInvoiceEdit'
                  on-click={() => {
                    this.forwardToDetailPage(params.row, false, false)
                  }}
                >
                  {this.$t('common_edit')}
                </ody-button>
              )
              deleteComponent = (
                <ody-button
                  code='SaleInvoiceDelete'
                  size='mini'
                  on-click={() => {
                    this.confirmDeleteInvoice(params.row)
                  }}
                >
                  {this.$t('common_delete')}
                </ody-button>
              )
              auditComponent = (
                <ody-button
                  code='SaleInvoiceAudit'
                  size='mini'
                  on-click={() => {
                    this.showAuditModal(params.row)
                  }}
                >
                  {this.$t('common_audit')}
                </ody-button>
              )
            }
            if (
              invoiceBillingType === 0 &&
              status === 2 &&
              invoiceStyle === 0 &&
              showEdit
            ) {
              redComponent = (
                <ody-button
                  code='SaleInvoiceCheck'
                  size='mini'
                  on-click={() => {
                    this.checkAndOpenRed(params.row)
                  }}
                >
                  {self.$t('invoice_at_red')}
                </ody-button>
              )
            }
            if (
              openStatus === 2 &&
              invoiceStyle === 1 &&
              params.row.invoiceImgPath
            ) {
              downComponent = (
                <ody-button
                  size='mini'
                  code='SaleInvoiceDownload'
                  on-click={() => {
                    this.downloadInvoice(params.row)
                  }}
                >
                  {self.$t('common_download')}
                </ody-button>
              )
            }
            const component = (
              <div>
                {editComponent}
                {deleteComponent}
                {auditComponent}
                {redComponent}
                {downComponent}
              </div>
            )
            return <div>{component}</div>
          }
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('invoice_merchant'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'storeName',
          label: this.$t('invoice_store'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'customerTypeText',
          label: this.$t('invoice_customer_type'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'customerCode',
          label: this.$t('invoice_customer_code'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'customerName',
          label: this.$t('invoice_customer_name'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'invoiceTypeText',
          label: this.$t('invoice_type'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'invoiceStyleText',
          label: this.$t('invoice_style'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'openStatusText',
          label: this.$t('invoice_open_status'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'statusText',
          label: this.$t('invoice_status'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'validateNo',
          label: this.$t('invoice_validate_no'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'invoiceNo',
          label: this.$t('invoice_no'),
          align: 'center',
          minWidth: 124,
          render: (h, params) => {
            const status = params.row.status
            const invoiceStyle = params.row.invoiceStyle
            let showEdit = true
            if (self.platform === 1) {
              if (!self.merchantInfo.merchantCode) {
                showEdit = false
              } else {
                showEdit =
                  self.merchantInfo.merchantCode === params.row.merchantCode
              }
            }
            let p = {
              name: 'FinanceInvoiceSaleDetail',
              query: {
                invoiceId: params.row.id,
                invoiceCode: params.row.invoiceCode,
                isOpen: false,
                isView: true
              }
            }

            if (status === 1 && invoiceStyle === 0 && showEdit) {
              p = {
                name: 'FinanceInvoiceSaleDetail',
                query: {
                  invoiceId: params.row.id,
                  invoiceCode: params.row.invoiceCode,
                  isOpen: false,
                  isView: false
                }
              }
            }
            return (
              <router-link to={p} class='link-type'>
                <span>{params.row.invoiceNo}</span>
              </router-link>
            )
          }
        },
        {
          show: true,
          prop: 'invoiceCode',
          label: this.$t('invoice_code'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'invoiceTime',
          label: this.$t('invoice_date'),
          align: 'center',
          minWidth: 124,
          formatter(row, column) {
            if (row.invoiceTime) {
              return self.$portal.parseTime(
                row.invoiceTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'salerName',
          label: this.$t('invoice_saler_name'),
          align: 'center',
          minWidth: 124,
          render: (h, params) => {
            return (
              <el-popover
                placement='top-start'
                width='200'
                trigger='hover'
                content={params.row.salerName}
              >
                <span
                  slot='reference'
                  style='width:120px;display:block;overflow:hidden;'
                >
                  {params.row.salerName}
                </span>
              </el-popover>
            )
          }
        },
        {
          show: true,
          prop: 'salerAccountNo',
          label: this.$t('invoice_saler_account_no'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'salerTaxCode',
          label: this.$t('invoice_saler_tax_code'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'purchaserName',
          label: this.$t('invoice_purchaser_name'),
          align: 'center',
          minWidth: 124,
          render: (h, params) => {
            return (
              <el-popover
                placement='top-start'
                width='200'
                trigger='hover'
                content={params.row.purchaserName}
              >
                <span
                  slot='reference'
                  style='width:120px;display:block;overflow:hidden;'
                >
                  {params.row.purchaserName}
                </span>
              </el-popover>
            )
          }
        },
        {
          show: true,
          prop: 'purchaserReceiverTel',
          label: this.$t('invoice_purchaser_receiverTel'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'purchaserAccountNo',
          label: this.$t('invoice_purchaser_account_no'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'purchaserTaxCode',
          label: this.$t('invoice_purchaser_tax_code'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'invoiceTaxedAmt',
          label: this.$t('invoice_taxed_amt'),
          align: 'right',
          minWidth: 124
        },
        {
          show: true,
          prop: 'invoiceUnTaxedAmt',
          label: this.$t('invoice_un_taxed_amt'),
          align: 'right',
          minWidth: 124
        },
        {
          show: true,
          prop: 'invoiceTaxAmt',
          label: this.$t('invoice_tax_amt'),
          align: 'right',
          minWidth: 88
        }
      ],
      blueColumns: [
        {
          show: true,
          prop: 'redFlushText',
          label: this.$t('is_red'),
          align: 'center',
          minWidth: 88
        }
      ],
      redColumns: [
        {
          show: true,
          prop: 'redReason',
          label: this.$t('invoice_red_reason'),
          align: 'center',
          minWidth: 124,
          render: (h, params) => {
            return (
              <el-popover
                placement='top-start'
                width='200'
                trigger='hover'
                content={params.row.redReason}
              >
                <span
                  slot='reference'
                  style='width:80px;display:block;overflow:hidden;'
                >
                  {params.row.redReason}
                </span>
              </el-popover>
            )
          }
        },
        {
          show: true,
          prop: 'proInvoiceCode',
          label: this.$t('invoice_pro_invoice_code'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'proInvoiceNo',
          label: this.$t('invoice_pro_invoice_no'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'redFlagText',
          label: this.$t('inovice_red_flag'),
          align: 'center',
          minWidth: 124
        }
      ]
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async initMerchantInfo() {
      const vue = this
      const result = await this.$finance.$api.common.queryPlatformAndDefaultMerchant()
      if (result.code === '0') {
        vue.platform = result.data.platformId
        if (vue.platform === 1) {
          if (result.data.defaultMerchant) {
            vue.merchantInfo.merchantId = result.data.defaultMerchant.merchantId
            vue.merchantInfo.merchantCode =
              result.data.defaultMerchant.merchantCode
          } else {
            this.$alert(
              this.$t('default_merchant_has_no_auth'),
              this.$t('prompt')
            )
            return
          }
        }
      }
    },
    selectMerchant(merchant) {
      if (merchant) {
        this.searchForm.merchantId = merchant.merchantId
        this.searchForm.merchantCode = merchant.merchantCode
        this.searchForm.merchantName = merchant.merchantName
        this.clearStoreInfo()
      }
    },
    showMerchantModal() {
      this.merchantModalVisible = true
    },
    clearStoreInfo() {
      this.searchForm.storeId = null
      this.searchForm.storeCode = null
      this.searchForm.storeName = null
    },
    showStoreModal() {
      if (!this.searchForm.merchantId) {
        this.$message({
          type: 'warn',
          message: this.$t('common_please_choose_merchant')
        })
        return
      }
      this.storeModalVisible = true
    },
    selectStore(stores) {
      let store
      if (Array.isArray(stores)) {
        store = stores[0]
      } else {
        store = stores
      }
      if (store) {
        this.searchForm.storeId = store.storeId
        this.searchForm.storeCode = store.storeCode
        this.searchForm.storeName = store.storeName
      }
    },
    showChkCustomerModal() {
      // 显示对账单
      this.chkCustomerSoModalVisible = true
    },
    selectChkCustomerModal(chkCustomerSoes) {
      if (chkCustomerSoes && chkCustomerSoes.length > 0) {
        this.checkAndOpenBlue(chkCustomerSoes)
      }
    },
    forwardToDetailPage(selectedItem, isOpen, isView, chkCustomerSoes) {
      this.$router.push({
        name: 'FinanceInvoiceSaleDetail',
        query: {
          invoiceId: selectedItem.id,
          invoiceCode: selectedItem.invoiceCode,
          isOpen: isOpen,
          isView: isView,
          chkCustomerSoes: chkCustomerSoes
        }
      })
    },
    confirmDeleteInvoice(row) {
      const vue = this
      this.$confirm(
        this.$t('common_msg_confirm_delete'),
        this.$t('common_msg_delete'),
        {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel')
        }
      ).then(
        () => {
          const apSupplierInvoice = this.$finance.$api.apSupplierInvoice
          apSupplierInvoice
            .deleteInvoice({ id: row.id, invoiceCode: row.invoiceCode })
            .then(result => {
              if (result.code === '0') {
                vue.$message({
                  type: 'success',
                  message: vue.$t('common_delete_success')
                })
                vue.updateList()
              } else {
                vue.$message({
                  type: 'error',
                  message: result.message
                })
              }
            })
            .catch(() => {
              vue.updateList()
            })
        },
        () => {}
      )
    },
    showAuditModal(row) {
      this.selectedItem = row
      this.auditModalVisible = true
    },
    downloadInvoice(row) {
      const fileName = row.invoiceImgPath.substring(
        row.invoiceImgPath.lastIndexOf('/') + 1
      )
      this.$portal.downloadFileByGet(row.invoiceImgPath, {}, fileName)
    },
    async handleTabsClick() {
      try {
        this.currentTab = this.tabs[this.activeState]
        this.searchForm.invoiceBillingType = this.currentTab.invoiceBillingType

        if (this.searchForm.invoiceBillingType === 1) {
          this.columns = [...this.baseColumns, ...this.redColumns]
        } else {
          this.columns = [...this.baseColumns, ...this.blueColumns]
        }
        this.page.current = 1
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
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
      this.searchForm.invoiceBillingType = this.currentTab.invoiceBillingType
      this.initMerchantInfo()
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
    },
    _initCodes() {
      const vue = this
      this.$finance.$api.common
        .codeSelectMulti({ categories: ['INVOICE_STYLE', 'CUSTOMER_TYPE'] })
        .then(data => {
          if (data.code === '0') {
            var map = data.data
            if (map.INVOICE_STYLE) {
              vue.invoiceStyleMap = map.INVOICE_STYLE
            }
            if (map.CUSTOMER_TYPE) {
              vue.customerTypeMap = map.CUSTOMER_TYPE
            }
          }
        })

      this.$finance.$api.common
        .codeSelectDicMulti(
          JSON.stringify([
            'ap.invoice.supplier.supInvoiceList.openStatus',
            'ap.invoice.supplier.supInvoiceList.invoiceType',
            'ap.invoice.supplier.supInvoiceList.status'
          ])
        )
        .then(result => {
          if (result.code === '0') {
            if (result.data['ap.invoice.supplier.supInvoiceList.openStatus']) {
              vue.openStatusList = result.data[
                'ap.invoice.supplier.supInvoiceList.openStatus'
              ].reduce((l, i) => {
                l.push({ code: i.id, name: i.text })
                return l
              }, [])
            }
            if (result.data['ap.invoice.supplier.supInvoiceList.invoiceType']) {
              vue.invoiceTypeList = result.data[
                'ap.invoice.supplier.supInvoiceList.invoiceType'
              ].reduce((l, i) => {
                l.push({ code: i.id, name: i.text })
                return l
              }, [])
            }
            if (result.data['ap.invoice.supplier.supInvoiceList.status']) {
              vue.statusList = result.data[
                'ap.invoice.supplier.supInvoiceList.status'
              ].reduce((l, i) => {
                l.push({ code: i.id, name: i.text })
                return l
              }, [])
            }
          }
        })
    },
    async init() {
      this.tabs = [
        {
          heading: 'invoice_billing_type_blue',
          index: 1,
          invoiceBillingType: 0
        },
        {
          heading: 'invoice_billing_type_red',
          index: 2,
          invoiceBillingType: 1
        }
      ]
      this._initCodes()
      await this.initMerchantInfo()
      this.handleTabsClick()
    },
    async checkAndOpenBlue(chkCustomerSoes) {
      const form = getDefaultSearchForm()
      form.supplierInvoiceDetail = []
      const promise = await this.$finance.$api.chkCustomerSo
        .queryChkCustomerSoItemListWithoutPage
      for (let i = 0; i < chkCustomerSoes.length; i++) {
        const result = await promise({
          chkCustomerSoId: chkCustomerSoes[i].id
        })
        if (result.code === '0') {
          const data = result.data
          if (data && data.length > 0) {
            for (let index = 0; index < data.length; index++) {
              const chkItem = Object.assign({}, data[index])
              const row = {
                chkOrderCode: chkCustomerSoes[i].chkOrderCode,
                refOrderCode: chkCustomerSoes[i].refOrderCode,
                itemMpId: chkItem.mpId,
                itemMpCode: chkItem.mpCode,
                itemMpName: chkItem.mpName
              }
              form.supplierInvoiceDetail.push(row)
            }
          }
        }
      }
      const maxItemResult = await this.$finance.$api.apSupplierInvoice.loadMaxItemNum(
        form
      )
      this.loadMaxItemNumForOpen(
        {},
        form.supplierInvoiceDetail,
        maxItemResult,
        true,
        chkCustomerSoes
      )
    },
    async checkAndOpenRed(invoice) {
      const form = {
        proInvoiceId: invoice.id,
        proInvoiceCode: invoice.invoiceCode,
        createSrcType: invoice.createSrcType,
        invoiceBillingType: 1
      }
      const data = await this.$finance.$api.apSupplierInvoice.queryInvoiceWithItem(
        { id: invoice.id }
      )
      if (data.code === '0') {
        form.supplierInvoiceDetail = data.data.supplierInvoiceDetail
      }
      const result = await this.$finance.$api.apSupplierInvoice.loadMaxItemNum(
        form
      )
      this.loadMaxItemNumForOpen(
        invoice,
        form.supplierInvoiceDetail,
        result,
        true
      )
    },
    async loadMaxItemNumForOpen(
      invoice,
      supplierInvoiceDetail,
      result,
      isOpen,
      chkCustomerSoes
    ) {
      // 蓝票需要查询 采购对账单
      if (result.code === '0' && result.data && result.data.length > 0) {
        for (let i = 0; i < result.data.length; i++) {
          const search = result.data[i]
          const row = getDetailFromList(supplierInvoiceDetail, search)
          if (row && search.maxItemNum !== 0) {
            this.forwardToDetailPage(invoice, isOpen, false, chkCustomerSoes)
            return
          }
        }
      }
      if (chkCustomerSoes) {
        this.$alert(this.$t('invalid_detail_empty'), this.$t('prompt'))
      } else {
        this.$alert(this.$t('invalid_detail_empty_red'), this.$t('prompt')) // 全部红冲
      }
    },
    exportItem() {
      const filters = JSON.parse(JSON.stringify(this.searchForm))
      if (filters.invoiceTime) {
        filters.startInvoiceTime = filters.invoiceTime[0]
        filters.endInvoiceTime = filters.invoiceTime[1]
        delete filters.invoiceTime
      }
      delete filters.merchantId // 使用merchantId过滤只能查询storeId不为空的，应该使用默认的权限过滤
      delete filters.merchantName
      this.$portal.downloadFileByPost(
        '/api/back-finance-web/apSupplierInvoice/export.do',
        filters
      )
    }
  }
}
function getDetailFromList(list, search) {
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (
      item.itemMpCode === search.itemMpCode &&
      item.chkOrderCode === search.chkOrderCode
    ) {
      // 如果商品编号和对账单号相同，返回该行
      return item
    }
  }
  return null
}
async function loadList(vue) {
  const filters = JSON.parse(JSON.stringify(vue.searchForm))
  if (filters.invoiceTime) {
    filters.startInvoiceTime = filters.invoiceTime[0]
    filters.endInvoiceTime = filters.invoiceTime[1]
    delete filters.invoiceTime
  }
  delete filters.merchantId // 使用merchantId过滤只能查询storeId不为空的，应该使用默认的权限过滤
  delete filters.merchantName
  const param = {
    filters: filters,
    limit: vue.page.size,
    page: vue.page.current
  }
  const apSupplierInvoice = vue.$finance.$api.apSupplierInvoice

  const res = await apSupplierInvoice.listPage(param)
  if (res) {
    const data = res.data
    vue.list = data.list
    vue.page.total = data.total
  }
}

function getDefaultSearchForm() {
  return Object.assign(
    {},
    {
      invoiceBillingType: 0,
      createSrcType: 1
    }
  )
}
</script>

<style lang="scss" scoped>
</style>
