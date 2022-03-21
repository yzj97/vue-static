<template>
  <section class="myorder-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <!-- 商家名称 -->
          <ody-search-item :label="$t('plMpConfig_merchantName') + ':'" prop="returnMerchantName">
            <el-input v-model="searchForm.returnMerchantName" :placeholder="$t('common_choose_please')" name="searchForm_returnMerchantName" readonly="true" @click.native="showMerchantSelectModal"/>
          </ody-search-item>
          <!-- 店铺组织 -->
          <ody-search-item :label="$t('common_store') + ':'" maxlength="100" prop="returnStoreName">
            <el-input v-model="searchForm.returnStoreName" name="searchForm_returnStoreName"/>
          </ody-search-item>
          <!-- 供应商 -->
          <ody-search-item :label="$t('purchaseDiscountOrder_field_supplierName') + ':'" maxlength="120" prop="supplierName">
            <el-input v-model="searchForm.supplierName" name="searchForm_supplierName"/>
          </ody-search-item>
          <!-- 退货单号 -->
          <ody-search-item :label="$t('purchaseReturnOrder_field_returnCode') + ':'" maxlength="120" prop="returnCode">
            <el-input v-model="searchForm.returnCode" name="searchForm_returnCode"/>
          </ody-search-item>
          <!-- 创建日期 -->
          <ody-search-item :label="$t('purchaseDiscountOrder_field_createTime') + ':'" class="register" prop="createTime">
            <ody-date-range-picker
              v-model="searchForm.createTime"
              type="date"
              name="searchForm_createTime"
              value-format="yyyy-MM-dd">range-separator=" ~ "/></ody-date-range-picker>

              <!-- <el-date-picker
              v-model="searchForm.createTime"
              name="searchForm_createTime"
              type="daterange"
              range-separator=" ~ "/> -->
          </ody-search-item>
          <!-- 审核日期 -->
          <ody-search-item :label="$t('purchaseOrder_field_auditTime') + ':'" class="register" prop="auditTime">
            <ody-date-range-picker
              v-model="searchForm.auditTime"
              type="date"
              name="searchForm_auditTime"
              value-format="yyyy-MM-dd">range-separator=" ~ "/></ody-date-range-picker>

              <!-- <el-date-picker
              v-model="searchForm.auditTime"
              name="searchForm_auditTime"
              type="daterange"
              range-separator=" ~ "/> -->
          </ody-search-item>
          <!-- 收货单号 -->
          <ody-search-item :label="$t('purchaseReturnOrder_product_sourceReceiveCode') + ':'" maxlength="120" prop="receiveCode">
            <el-input v-model="searchForm.receiveCode" name="searchForm_receiveCode"/>
          </ody-search-item>
          <!-- 商品编码/条码 -->
          <ody-search-item :label="$t('common_product_codeOrBarcode') + ':'" maxlength="120" prop="productCodeBarcode">
            <el-input v-model="searchForm.productCodeBarcode" name="searchForm_productCodeBarcode"/>
          </ody-search-item>
          <!-- 商品名称 -->
          <ody-search-item :label="$t('plMpConfig_mpName') + ':'" maxlength="120" prop="productName">
            <el-input v-model="searchForm.productName" name="searchForm_productName"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-dialog
      :visible.sync="dialog.show"
      :before-close="handleDialogClose"
      :title="$t('plRule_detail_confirm_title')"
      width="600px">
      <span>{{ dialog.title }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleDialog" size="small" @click="handleDialog(0)">{{ dialog.but1 }}</el-button>
        <el-button name="handleDialog0" size="small" type="primary" @click="handleDialog(1)">{{ dialog.but2 }}</el-button>
      </span>
    </ody-dialog>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="searchForm.orderStatus" name="searchForm_orderStatus" @tab-click="handleActiveStatusChange">
          <!-- 全部 -->
          <el-tab-pane :label="$t('common_status_all')" name="0"/>
          <!-- 待提交 -->
          <el-tab-pane :label="$t('contractProductPriceAdjust_status0')" name="1"/>
          <!-- 待审核 -->
          <el-tab-pane :label="$t('contractProductPriceAdjust_status1')" name="2"/>
          <!-- 已审核 -->
          <el-tab-pane :label="$t('purchaseOrder_status_passed')" name="3"/>
          <!-- 已完成 -->
          <el-tab-pane :label="$t('purchaseReturnOrder_status_finished')" name="6"/>
        </el-tabs>
      </div>
      <div slot="btn">
        <ody-button name="createReturnOrder" type="primary" size="small" style="margin-bottom: 10px;" @click="createReturnOrder">{{ $t('purchaseReturnOrder_action_createOrder') }}</ody-button>
        <ody-button name="exportData" size="small" @click="exportData">{{ $t('common_export') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="false"
          name="list246"
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
    <MerchantSelectModal :visible.sync="showMerchantModal" @ok="selectMerchant" />
  </section>
</template>

<script>
import MerchantSelectModal from '@/components/merchantModal'
import dateUtil from '@/utils/dateUtil'
var vue = null
export default {
  name: 'OpmsReturnOrderList',
  components: {
    MerchantSelectModal
  },
  data() {
    return {
      searchForm: getDefaultSearchForm(),
      showMerchantModal: false,
      loading: false,
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      dialog: {
        show: false,
        title: '',
        but1: '',
        but2: '',
        id: 0,
        returnCode: '',
        arg1: 0,
        type: 0 // 1 changeOrderStatus, 2 doDelete, 3 changeReturnStatus
      },
      columns: [
        {
          show: true,
          prop: 'returnMerchantCode', // 商家编码
          label: this.$t('plMpConfig_merchantCode'),
          align: 'center'
        },
        {
          show: true,
          prop: 'returnMerchantName', // 商家名称
          label: this.$t('plMpConfig_merchantName'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'returnStoreCode', // 店铺编码
          label: this.$t('plMpResult_storeCode'),
          align: 'center'
        },
        {
          show: true,
          prop: 'returnStoreName', // 店铺名称
          label: this.$t('plMpResult_storeName'),
          align: 'center'
        },
        {
          show: true,
          prop: 'returnCode', // 退货单号
          label: this.$t('purchaseReturnOrder_field_returnCode'),
          align: 'center'
        },
        {
          show: true,
          prop: 'supplierCode', // 供应商编码
          label: this.$t('purchaseDiscountOrder_field_supplierCode'),
          align: 'center'
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
          prop: 'costWithoutTaxAmt', // 未税金额
          label: this.$t('purchase_query_order_costWithoutTaxAmt'),
          align: 'center'
        },
        {
          show: true,
          prop: 'costTaxAmt', // 税额
          label: this.$t('purchase_query_order_costTaxAmt'),
          align: 'center'
        },
        {
          show: true,
          prop: 'costWithTaxBcAmt', // 含税金额
          label: this.$t('purchaseOrder_field_costWithTaxAmt'),
          align: 'center'
        },
        {
          show: true,
          prop: 'orderStatusText', // 单据状态
          label: this.$t('purchase_request_order_status'),
          align: 'center'
        },
        {
          show: true,
          prop: 'returnStatusText', // 退货状态
          label: this.$t('purchaseReturnOrder_returnStatus'),
          align: 'center'
        },
        {
          show: true,
          prop: 'invoiceStatusText', // 开票状态
          label: this.$t('invoice_status'),
          align: 'center'
        },
        {
          show: true,
          prop: 'wmsSendStatusText', // 下发WMS
          label: this.$t('receiveOrder_wmsSendStatus'),
          align: 'center'
        },
        {
          show: true,
          prop: 'wmsNotifyStatusText', // WMS回调状态
          label: this.$t('receiveOrder_wmsNotifyStatus'),
          align: 'center'
        },
        {
          show: true,
          prop: 'receiveCode', // 收货单号
          label: this.$t('purchaseOrder_field_receiveCode'),
          align: 'center'
        },
        {
          show: true,
          prop: 'operatorName', // 操作人
          label: this.$t('common_operationUser'),
          align: 'center'
        },
        {
          show: true,
          prop: 'createTime', // 制单日期
          label: this.$t('contract_createTime'),
          align: 'center',
          formatter: (row, column, cellValue) => {
            return dateFormat(row.createTime)
          }
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        minWidth: 200,
        list: [
          {
            label: this.$t('common_submit'),
            disabled: false,
            method(index, row) {
              // 提交
              showDialog(1, vue.$t('common_submit_tip'), vue.$t('contractProductPriceAdjust_cancel'), vue.$t('common_submit'), row.id, row.returnCode, 2)
            },
            hidden(index, row) {
              return (row.orderStatus !== 1)
            }
          },
          {
            label: this.$t('common_audit'),
            disabled: false,
            method: (index, row) => {
              // 审核
              showDialog(1, vue.$t('common_adudit_please_pass'), vue.$t('notpass'), vue.$t('pass'), row.id, row.returnCode, 3)
            },
            hidden(index, row) {
              return (row.orderStatus !== 2)
            }
          },
          {
            label: this.$t('distributionOrder_outStockOp'),
            disabled: false,
            method: (index, row) => {
              // 出库
              showDialog(3, vue.$t('distributionOrder_outStockConfrim'), vue.$t('contractProductPriceAdjust_cancel'), vue.$t('distributionOrder_outStockOp'), row.id, row.returnCode, 3)
            },
            hidden(index, row) {
              return !(row.orderStatus === 3 && row.returnStatus !== 3)
            }
          },
          {
            label: this.$t('common_edit'),
            disabled: false,
            method: (index, row) => {
              // 编辑
              goEdit(row.id, row.returnCode)
            },
            hidden(index, row) {
              return (row.orderStatus !== 4)
            }
          },
          {
            label: this.$t('common_cancel'),
            disabled: false,
            method: (index, row) => {
              // 取消
              showDialog(1, vue.$t('common_cancel_tip'), vue.$t('common_no'), vue.$t('common_yes'), row.id, row.returnCode, 8)
            },
            hidden(index, row) {
              return (row.orderStatus !== 2 && !(row.orderStatus === 3 && row.returnStatus !== 3))
            }
          },
          {
            label: this.$t('common_delete'),
            disabled: false,
            method: (index, row) => {
              // 删除
              showDialog(2, vue.$t('common_msg_confirm_delete'), vue.$t('common_no'), vue.$t('common_delete'), row.id, row.returnCode)
            },
            hidden(index, row) {
              return (row.orderStatus !== 1 && row.orderStatus !== 4)
            }
          }
        ]
      }
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
      this.handleSearchSubmit()
    },
    createReturnOrder() {
      // 创建退货单
      goCreate()
    },
    handleDialogClose() {
      this.dialog.show = false
      this.dialog = {
        show: false,
        title: '',
        but1: '',
        but2: '',
        id: 0,
        returnCode: '',
        arg1: 0,
        type: 0 // 1 changeOrderStatus, 2 doDelete, 3 changeReturnStatus
      }
    },
    handleDialog(status) {
      if (status === 0) {
        if (this.dialog.type === 1 && this.dialog.arg1 === 3) {
          const param = {
            id: this.dialog.id,
            returnCode: this.dialog.returnCode,
            orderStatus: 4
          }
          updateReturnOrderStatus(param)
          this.dialog.show = false
        } else {
          this.handleDialogClose()
        }
      } else if (this.dialog.type === 4) {
        goEdit(this.dialog.id, this.dialog.returnCode)
        this.dialog.show = false
      } else if (this.dialog.type !== 0) {
        const param = {
          id: this.dialog.id,
          returnCode: this.dialog.returnCode
        }
        if (this.dialog.type === 1) {
          param.orderStatus = this.dialog.arg1
        } else if (this.dialog.type === 2) {
          param.isDeleted = 1
        } else if (this.dialog.type === 3) {
          param.returnStatus = this.dialog.arg1
        }
        updateReturnOrderStatus(param)
        this.dialog.show = false
      }
    },
    showDialog(type, title, but1, but2, id, arg1) {
      showDialog(type, title, but1, but2, id, arg1)
    },
    showMerchantSelectModal() {
      this.showMerchantModal = true
    },
    selectMerchant(result) {
      if (result) {
        this.searchForm.returnMerchantCode = result.merchantCode
        this.searchForm.merchantId = result.merchantId
        this.searchForm.returnMerchantName = result.merchantName
      }
    }
  }
}

async function loadList(vue, isExport = false) {
  const param = {
    currentPage: vue.page.current,
    itemsPerPage: vue.page.size,
    obj: {
      orderStatus: vue.searchForm.orderStatus !== '0' ? vue.searchForm.orderStatus : null,
      returnMerchantCode: vue.searchForm.returnMerchantCode,
      returnStoreName: vue.searchForm.returnStoreName,
      supplierName: vue.searchForm.supplierName,
      productName: vue.searchForm.productName,
      returnCode: vue.searchForm.returnCode,
      receiveCode: vue.searchForm.receiveCode,
      productCodeBarcode: vue.searchForm.productCodeBarcode,
      startCreateTime: null,
      endCreateTime: null,
      startAuditTime: null,
      endAuditTime: null
    }
  }
  if (vue.searchForm.createTime != null) {
    if (vue.searchForm.createTime.length > 0) {
      param.obj.startCreateTime = vue.searchForm.createTime[0]
    }
    if (vue.searchForm.createTime.length > 1) {
      param.obj.endCreateTime = vue.searchForm.createTime[1]
    }
  }
  if (vue.searchForm.auditTime != null) {
    if (vue.searchForm.auditTime.length > 0) {
      param.obj.startAuditTime = vue.searchForm.auditTime[0]
    }
    if (vue.searchForm.auditTime.length > 1) {
      param.obj.endAuditTime = vue.searchForm.auditTime[1]
    }
  }
  const api = vue.$opms.$api.returnorder
  if (!isExport) {
    const res = await api.purchaseReturnOrderListPage(param)
    if (res) {
      vue.list = res.data.listObj
      vue.page.total = res.data.total
    }
  } else {
    // 导出exel
    vue.$portal.downloadFileByGet('api/opms-web/purchaseReturnOrder/exportPurchaseReturnOrderList.do', { queryParams: JSON.stringify({ obj: param.obj }) }, '退货单.xlsx')
  }
}

async function exportData(vue) {
  await loadList(vue, true)
}

function getDefaultSearchForm() {
  return {
    orderStatus: '0',
    returnMerchantName: '',
    returnMerchantCode: '',
    returnStoreName: '',
    supplierName: '',
    returnCode: '',
    createTime: [],
    auditTime: [],
    receiveCode: '',
    productCodeBarcode: '',
    productName: ''
  }
}

function dateFormat(time) {
  if (!time) {
    return ''
  }
  return dateUtil.dateFormatForTime(time, false)
}

function showDialog(type, title, but1, but2, id, returnCode, arg1) {
  vue.dialog.type = type
  vue.dialog.title = title
  vue.dialog.but1 = but1
  vue.dialog.but2 = but2
  vue.dialog.id = id
  vue.dialog.returnCode = returnCode
  vue.dialog.arg1 = arg1
  vue.dialog.show = true
}

function updateReturnOrderStatus(param) {
  const api = vue.$opms.$api.returnorder
  api.updateReturnOrderStatus(param).then((data) => {
    vue.handleSearchSubmit()
  })
}

function goEdit(id, returnCode) {
  // 去编辑
  location.href = '/#/opms-web/returnorder/detailInfo?returnCode=' + returnCode
}

function goCreate() {
  // 去新增
  location.href = '/#/opms-web/returnorder/detailInfo'
}
</script>

<style lang="scss" scoped>

</style>
