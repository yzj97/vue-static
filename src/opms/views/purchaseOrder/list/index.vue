<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('收货商家') + ':'" prop="receiveMerchantName">
            <el-input
              v-model="searchForm.receiveMerchantName"
              :placeholder="$t('common_choose_please')"
              name="searchForm_receiveMerchantName"
              readonly="true"
              @click.native="showMerchant"
            />
          </ody-search-item>
          <ody-search-item :label="$t('收货店铺') + ':'" prop="receiveStoreName">
            <el-input
              v-model="searchForm.receiveStoreName"
              :placeholder="$t('common_choose_please')"
              name="searchForm_receiveStoreName"
              readonly="true"
              @click.native="showStore"
            />
          </ody-search-item>
          <ody-search-item :label="$t('供应商') + ':'" prop="supplierName">
            <el-input
              v-model="searchForm.supplierName"
              :placeholder="$t('common_choose_please')"
              name="searchForm_supplierName"
              readonly="true"
              @click.native="showSupplier"
            />
          </ody-search-item>
          <ody-search-item :label="$t('采购单号') + ':'" prop="purchaseCode">
            <el-input v-model="searchForm.purchaseCode" name="searchForm_purchaseCode" />
          </ody-search-item>
          <ody-search-item :label="$t('来源类型') + ':'" prop="sourceCodeType">
            <el-select v-model="searchForm.sourceCodeType" :placeholder="$t('全部')" name="searchForm_sourceCodeType">
              <el-option
                v-for="(value, key) in constants.poSourceTypes"
                :key="key"
                :value="key"
                :label="value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('要货单号') + ':'" prop="sourceCode">
            <el-input v-model="searchForm.sourceCode" name="searchForm_sourceCode" />
          </ody-search-item>
          <ody-search-item :label="$t('采购履行状态') + ':'" prop="purchaseStatus">
            <el-select v-model="searchForm.purchaseStatus" name="searchForm_purchaseStatus">
              <el-option :label="$t('common_status_all')" />
              <el-option
                v-for="(value, key) in constants.poPerformStatuses"
                :key="key"
                :value="key"
                :label="value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('创建日期') + ':'" class="register" prop="createTime">
            <ody-date-range-picker
              v-model="searchForm.createTime"
              type="date"
              name="searchForm_createTime"
              value-format="yyyy-MM-dd">range-separator="-"/></ody-date-range-picker>
              <!-- <el-date-picker
              v-model="searchForm.createTime"
              name="searchForm_createTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
            /> -->
          </ody-search-item>
          <ody-search-item :space="2" :label="$t('审核日期')" class="register" prop="auditTime">
            <el-date-picker
              v-model="searchForm.auditTime"
              name="searchForm_auditTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :label="$t('商品编码/条码')" prop="productCodeBarcode">
            <el-input v-model="searchForm.productCodeBarcode" name="searchForm_productCodeBarcode" />
          </ody-search-item>
          <ody-search-item :label="$t('商品名称')" prop="productName">
            <el-input v-model="searchForm.productName" name="searchForm_productName" />
          </ody-search-item>
          <!-- 交易币别 -->
          <ody-search-item :label="$t('common_currency')" prop="currencyCode">
            <el-select v-model="searchForm.currencyCode" :placeholder="$t('全部')" name="searchForm_currencyCode">
              <el-option
                v-for="item in currencys"
                :label="item.currencyCode"
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
          name="OpmsPurchaseOrderList01_handleSearchSubmit"
          size="small"
          type="primary"
          code="OpmsPurchaseOrderList01"
          @click="handleSearchSubmit"
        >{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          name="OpmsPurchaseOrderList02_goAdd"
          size="small"
          type="primary"
          code="OpmsPurchaseOrderList02"
          @click="goAdd"
        >{{ $t('创建采购单') }}</ody-button>
        <ody-button name="OpmsPurchaseOrderList25_download" size="small" code="OpmsPurchaseOrderList25" @click="download">{{ $t('下载导入模板') }}</ody-button>
        <ody-button
          :disabled="!canUpload"
          name="OpmsPurchaseOrderList03_importPurchaseOrder"
          size="small"
          code="OpmsPurchaseOrderList03"
          @click="importPurchaseOrder"
        >{{ $t('导入采购单') }}</ody-button>
        <ody-button
          name="OpmsPurchaseOrderList04_handleExport"
          size="small"
          code="OpmsPurchaseOrderList04"
          @click="handleExport"
        >{{ $t('common_export') }}</ody-button>
      </div>
      <div slot="tabs">
        <el-tabs v-model="searchForm.orderStatus" name="searchForm_orderStatus" @tab-click="handleClick">
          <el-tab-pane :label="$t('common_status_all')" :name="0" />
          <el-tab-pane
            v-for="i in ['1','2','3','4','5','6','7']"
            :key="i"
            :label="constants.poStatuses[i]"
            :name="i"
          />
          <!--<el-tab-pane v-for="(value, key) in constants.poStatuses" :key="key" :name="key" :label="value" />-->
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="false"
          name="list395"
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

    <ody-dialog
      :visible.sync="showPurchaseStatus"
      :before-close="handleClose"
      :title="$t('设置履行状态')"
      width="200"
    >
      <el-card align="center" shadow="never">
        <span>{{ $t('履行状态') }}：</span>
        <el-select v-model="setPurchaseObject.purchaseStatus" name="setPurchaseObject_purchaseStatus" style="margin-left: 20px;">
          <el-option
            v-for="(value, key) in constants.poPerformStatuses"
            :key="key"
            :value="key"
            :label="value"
          />
        </el-select>
        <ody-button
          name="OpmsPurchaseOrderList05_doSetPurchaseStatus"
          size="mini"
          type="primary"
          style="margin-left: 30px;"
          code="OpmsPurchaseOrderList05"
          @click="doSetPurchaseStatus"
        >{{ $t('确定') }}</ody-button>
      </el-card>
    </ody-dialog>

    <MerchantSelectModal :visible.sync="showMerchantModal" @ok="selectMerchant" />
    <StoreModal
      :visible.sync="showStoreModal"
      :merchant-readonly="true"
      :merchant-code.sync="searchForm.receiveMerchantCode"
      @ok="selectStore"
    />
    <SupplierModal :visible.sync="showSupplierModal" @ok="selectSupplier" />
  </section>
</template>

<script>
import MerchantSelectModal from '@/components/merchantModal'
import StoreModal from '@/components/storeModal'
import SupplierModal from '@/components/supplierModal'
import dateUtil from '@/utils/dateUtil'
var vue
export default {
  name: 'OpmsPurchaseOrderList',
  components: {
    MerchantSelectModal,
    StoreModal,
    SupplierModal
  },
  data() {
    return {
      canUpload: true,
      showMerchantModal: false,
      showStoreModal: false,
      showSupplierModal: false,
      showPurchaseStatus: false,
      setPurchaseObject: {
        purchaseCode: null,
        purchaseStatus: null
      },
      searchForm: {},
      constants: {
        poSourceTypes: {
          1: this.$t('手动录入'),
          2: this.$t('直通转入'),
          3: this.$t('直送转入'),
          4: this.$t('自动补货'),
          5: this.$t('无采购单收货'),
          6: this.$t('内部销售订单'),
          7: this.$t('要货补货'),
          8: this.$t('采购计划')
        },
        poPerformStatuses: {
          1: this.$t('未履行'),
          2: this.$t('部分履行'),
          3: this.$t('完全履行')
        },
        poStatuses: {
          1: this.$t('待提交'),
          2: this.$t('待审核'),
          3: this.$t('已审核'),
          4: this.$t('审核拒绝'),
          5: this.$t('已结案'),
          6: this.$t('已过期'),
          7: this.$t('已作废'),
          toBeSubmitted: 1,
          toBeAudited: 2,
          passed: 3,
          rejected: 4,
          finished: 5,
          expired: 6,
          cancelled: 7
        }
      },
      loading: false,
      currencys: [],
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'receiveMerchantName',
          label: this.$t('商家名称'),
          align: 'center'
        },
        {
          show: true,
          prop: 'receiveStoreCode',
          label: this.$t('店铺编码'),
          align: 'center'
        },
        {
          show: true,
          prop: 'receiveStoreName',
          label: this.$t('店铺名称'),
          align: 'center'
        },
        {
          show: true,
          prop: 'purchaseCode',
          label: this.$t('采购单号'),
          align: 'center',
          minWidth: 200,
          // render: (h, params) => {
          //   const to = {
          //     name: 'OpmsPurchaseOrderEdit',
          //     query: { purchaseCode: params.row.purchaseCode }
          //   }
          //   return (
          //     <router-link to={to} class="link-type">
          //       <span>{params.row.purchaseCode}</span>
          //     </router-link>
          //   )
          // },
          render: (h, params) => {
            return (
              <a
                on-click={() => {
                  if (this.$portal.hasPermission('OpmsPurchaseOrderList06')) {
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
          prop: 'supplierCode',
          label: this.$t('供应商编码'),
          align: 'center'
        },
        {
          show: true,
          prop: 'supplierName',
          label: this.$t('供应商名称'),
          align: 'center'
        },
        {
          show: true,
          prop: 'receiveWarehouseName',
          label: this.$t('收货仓库'),
          align: 'center'
        },
        {
          show: true,
          prop: 'currencyCode',
          label: this.$t('交易币别'),
          align: 'center'
        },
        {
          show: true,
          prop: 'exchangeRate',
          label: this.$t('汇率'),
          align: 'center'
        },
        {
          show: true,
          prop: 'costWithTaxAmt',
          label: this.$t('含税金额'),
          align: 'center'
        },
        {
          show: true,
          prop: 'purchaserName',
          label: this.$t('采购员'),
          align: 'center'
        },
        {
          show: true,
          prop: 'purchaseStatusText',
          label: this.$t('采购履行状态'),
          align: 'center'
        },
        {
          show: true,
          prop: 'sourceCodeTypeText',
          label: this.$t('来源类型'),
          align: 'center'
        },
        {
          show: true,
          prop: 'sourceCode',
          label: this.$t('要货单号'),
          align: 'center'
        },
        {
          show: true,
          prop: 'createTime',
          label: this.$t('创建日期'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            return dateUtil.dateFormatForTime(row.createTime, true)
          }
        },
        {
          show: true,
          prop: 'createUsername',
          label: this.$t('制单员'),
          align: 'center'
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        minWidth: 220,
        list: [
          {
            // 提交
            label: this.$t('提交'),
            method: (index, row) => {
              submit(row)
            },
            hidden: (index, item) => {
              return !(
                item.orderStatus === vue.constants.poStatuses.toBeSubmitted ||
                item.orderStatus === vue.constants.poStatuses.rejected
              )
            },
            code: 'OpmsPurchaseOrderList07'
          },
          {
            // 取消
            label: this.$t('取消'),
            method: (index, row) => {
              cancel(row)
            },
            hidden: (index, item) => {
              return !(
                item.orderStatus === vue.constants.poStatuses.toBeSubmitted ||
                item.orderStatus === vue.constants.poStatuses.rejected
              )
            },
            code: 'OpmsPurchaseOrderList08'
          },
          {
            // 审核通过
            label: this.$t('审核通过'),
            method: (index, row) => {
              approve(row)
            },
            hidden: (index, item) => {
              return item.orderStatus !== vue.constants.poStatuses.toBeAudited || this.$portal.enableAppdflow('purchase_order', item.receiveMerchantId)
            },
            code: 'OpmsPurchaseOrderList09'
          },
          {
            // 审核驳回
            label: this.$t('审核驳回'),
            method: (index, row) => {
              reject(row)
            },
            hidden: (index, item) => {
              return item.orderStatus !== vue.constants.poStatuses.toBeAudited || this.$portal.enableAppdflow('purchase_order', item.receiveMerchantId)
            },
            code: 'OpmsPurchaseOrderList10'
          },
          {
            // 资质证书
            label: this.$t('supplier_attach_type_qualification'),
            method: (index, row) => {
              goCertificate(row.id)
            },
            hidden: (index, item) => {
              return !(
                item.orderStatus !== vue.constants.poStatuses.cancelled &&
                item.orderStatus !== vue.constants.poStatuses.toBeSubmitted
              )
            },
            code: 'OpmsPurchaseOrderList11'
          },
          {
            // 设置履行状态
            label: this.$t('设置履行状态'),
            method: (index, row) => {
              setPerformStatus(row)
            },
            hidden: (index, item) => {
              return !(item.orderStatus === vue.constants.poStatuses.passed)
            },
            code: 'OpmsPurchaseOrderList12'
          }
        ]
      }
    }
  },
  computed: {},
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
    handleClick(tab, event) {
      this.updateList()
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
      this.searchForm = getDefaultSearchForm()
    },
    handleExport() {
      const filters = this.getFilters()
      var queryContent = encodeURIComponent(JSON.stringify(filters))
      this.$portal.downloadFileByGet(
        '/api/opms-web/purchaseOrder/exportPurchaseOrderList.do',
        { queryContent: queryContent },
        '采购单.xlsx'
      )
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
    handleClose() {
      this.showPurchaseStatus = false
    },
    goAdd() {
      this.$router.push({
        name: 'OpmsPurchaseOrderEdit',
        query: { purchaseCode: null }
      })
    },
    forwardToDetail(row) {
      this.$router.push({
        name: 'OpmsPurchaseOrderEdit',
        query: { purchaseCode: row.purchaseCode }
      })
    },
    download() {
      // 下载模板
      window.open(
        '/opms-web/template/excel/import/purchaseOrder/purchaseOrderImport.xlsx'
      )
    },
    importPurchaseOrder() {
      // 导入模板
      var input = document.createElement('input')
      input.type = 'file'
      input.click()
      input.onchange = function() {
        var file = input.files[0]
        var form = new FormData()
        form.append('file', file)
        if (file == null) {
          vue.$message('文件不能为空')
          return
        }
        vue.canUpload = false
        vue.$portal
          .post('/opms-web/purchaseOrder/importPO.do', form)
          .then(res => {
            vue.canUpload = true
            var errors = res.data.errors
            if (errors.length > 0) {
              vue.$message(errors.join('<br>'))
              return
            } else {
              vue.$message(res.data.successMessage)
              vue.updateList()
            }
          })
          .catch(res => {
            vue.canUpload = true
            vue.$message(res.message)
          })
      }
    },
    doSetPurchaseStatus() {
      if (!this.setPurchaseObject.purchaseCode) {
        this.$message('采购单号不能为空')
        return
      }
      if (!this.setPurchaseObject.purchaseStatus) {
        this.$message('请选择履行状态')
        return
      }
      this.$opms.$api.purchaseOrder
        .setPerformStatus(this.setPurchaseObject)
        .then(resp => {
          this.showPurchaseStatus = false
          this.updateList()
        })
    },
    showMerchant() {
      this.showMerchantModal = true
    },
    showStore() {
      this.showStoreModal = true
    },
    showSupplier() {
      this.showSupplierModal = true
    },
    selectMerchant(result) {
      if (result) {
        this.searchForm.receiveMerchantId = result.merchantId
        this.searchForm.receiveMerchantCode = result.merchantCode
        this.searchForm.receiveMerchantName = result.merchantName
        this.searchForm.receiveStoreCode = null
        this.searchForm.receiveStoreName = null
      }
    },
    selectStore(result) {
      if (result) {
        this.searchForm.receiveStoreCode = result.storeCode
        this.searchForm.receiveStoreName = result.storeName
      }
    },
    selectSupplier(result) {
      if (result) {
        this.searchForm.supplierCode = result.orgCode
        this.searchForm.supplierName = result.orgName
      }
    },
    getFilters() {
      const vue = this
      const filters = JSON.parse(JSON.stringify(vue.searchForm))
      if (filters.createTime) {
        filters.startCreateTime = filters.createTime[0]
        filters.endCreateTime = filters.createTime[1]
        delete filters.createTime
      }
      if (filters.auditTime) {
        filters.startAuditTime = filters.auditTime[0]
        filters.endAuditTime = filters.auditTime[1]
        delete filters.auditTime
      }
      if (filters.orderStatus <= 0) {
        delete filters.orderStatus
      }
      return filters
    }
  }
}

async function loadList(vue) {
  const param = {
    obj: vue.getFilters(),
    currentPage: vue.page.current,
    itemsPerPage: vue.page.size
  }
  const purchaseOrder = vue.$opms.$api.purchaseOrder

  const res = await purchaseOrder.selectPOList(param)
  if (res) {
    const data = res.data
    vue.list = data.listObj
    vue.page.total = data.total
  }
}

function getDefaultSearchForm() {
  return { orderStatus: '0' }
}

function goCertificate(purchaseOrderId) {
  // 采购计划资质证书
  location.href =
    '/#/opms-web/purchaseOrder/certificate?purchaseOrderId=' + purchaseOrderId
}

async function submit(row) {
  // 提交
  const confirm = await vue.$confirm('确认提交该采购订单？', '请确认')
  if (confirm) {
    const result = await vue.$opms.$api.purchaseOrder.submitPO(
      JSON.stringify(row.purchaseCode)
    )
    if (result && result.code === '0') {
      vue.$message({
        type: 'success',
        message: vue.$t('submission_of_success')
      })
      vue.updateList()
    }
  }
}

async function cancel(row) {
  // 取消
  const confirm = await vue.$confirm('确认取消该采购订单？', '请确认')
  if (confirm) {
    const result = await vue.$opms.$api.purchaseOrder.cancelPO(
      JSON.stringify(row.purchaseCode)
    )
    if (result && result.code === '0') {
      vue.$message({
        type: 'success',
        message: vue.$t('common_cancel_success')
      })
      vue.updateList()
    }
  }
}

async function approve(row) {
  // 审核通过
  const confirm = await vue.$confirm('确认审批通过？', '请确认')
  if (confirm) {
    const result = await vue.$opms.$api.purchaseOrder.approvePO(
      JSON.stringify(row.purchaseCode)
    )
    if (result && result.code === '0') {
      vue.$message({
        type: 'success',
        message: vue.$t('audit_through_success')
      })
      vue.updateList()
    }
  }
}

async function reject(row) {
  // 驳回
  const confirm = await vue.$confirm('确认驳回？', '请确认')
  if (confirm) {
    const result = await vue.$opms.$api.purchaseOrder.rejectPO(
      JSON.stringify(row.purchaseCode)
    )
    if (result && result.code === '0') {
      vue.$message({
        type: 'success',
        message: vue.$t('invoice_inqurity_reject_success')
      })
      vue.updateList()
    }
  }
}

function setPerformStatus(row) {
  // 设置履行状态
  vue.setPurchaseObject.purchaseCode = row.purchaseCode
  vue.setPurchaseObject.purchaseStatus =
    row.purchaseStatus != null ? row.purchaseStatus + '' : null
  vue.showPurchaseStatus = true
}
</script>

<style scoped>
</style>
