<template>
  <section class="myorder-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <!-- 更正单号 -->
          <ody-search-item :label="$t('changeOrder_changeCode') + ':'" prop="changeCode">
            <el-input v-model="searchForm.changeCode" name="searchForm_changeCode" maxlength="100"/>
          </ody-search-item>
          <!-- 单据状态 -->
          <ody-search-item :label="$t('distributionOrder_status') + ':'" maxlength="100" prop="orderStatus">
            <el-select v-model="searchForm.orderStatus" :placeholder="$t('请选择')" name="searchForm_orderStatus">
              <el-option key="0" :label="$t('purchaseReturnOrder_status_all')" value="0" />
              <!-- 1待提交 2待审核 3已审核 4审核拒绝 5处理中 6已完成 7已过期 8已取消 -->
              <el-option key="1" :label="$t('distributionOrder_status_toSubmit')" value="1" />
              <el-option key="2" :label="$t('distributionOrder_status_toAudit')" value="2" />
              <el-option key="3" :label="$t('purchaseDiscountOrder_status_passed')" value="3" />
              <el-option key="4" :label="$t('purchaseDiscountOrder_status_rejected')" value="4" />
              <el-option key="5" :label="$t('purchaseReturnOrder_status_processing')" value="5" />
              <el-option key="6" :label="$t('purchaseReturnOrder_status_finished')" value="6" />
              <el-option key="7" :label="$t('purchaseReturnOrder_status_expired')" value="7" />
              <el-option key="8" :label="$t('purchaseReturnOrder_status_cancelled')" value="8" />
              <!-- <el-option v-for="item in orderStatusList" :key="item.orderStatus" :label="item.orderStatusText" :value="item.orderStatus" /> -->
            </el-select>
          </ody-search-item>
          <!-- 创建时间 -->
          <ody-search-item :label="$t('plMpResult_createTime') + ':'" class="register" prop="createTime">
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
          <!-- 采购单号 -->
          <ody-search-item :label="$t('purchaseReturnOrder_product_purchaseCode') + ':'" maxlength="120" prop="purchaseCode">
            <el-input v-model="searchForm.purchaseCode" name="searchForm_purchaseCode"/>
          </ody-search-item>
          <!-- 商家名称 -->
          <ody-search-item :label="$t('purchaseDiscountOrder_field_merchantName') + ':'" maxlength="120" prop="merchantName">
            <el-input v-model="searchForm.merchantName" name="searchForm_merchantName"/>
          </ody-search-item>
          <!-- 店铺名称 -->
          <ody-search-item :label="$t('plMpResult_storeName') + ':'" maxlength="120" prop="storeName">
            <el-input v-model="searchForm.storeName" name="searchForm_storeName"/>
          </ody-search-item>
          <!-- 商品编码 -->
          <ody-search-item :label="$t('supplier_product_mpCode') + ':'" maxlength="120" prop="mpCode">
            <el-input v-model="searchForm.mpCode" name="searchForm_mpCode"/>
          </ody-search-item>
          <!-- 供应商编码 -->
          <ody-search-item :label="$t('purchaseDiscountOrder_field_supplierCode') + ':'" maxlength="120" prop="supplierCode">
            <el-input v-model="searchForm.supplierCode" name="searchForm_supplierCode"/>
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
        <el-button name="handleDialog3" size="small" type="primary" @click="handleDialog(1)">{{ dialog.but2 }}</el-button>
      </span>
    </ody-dialog>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="searchForm.orderStatus" name="searchForm_orderStatus4" @tab-click="handleActiveStatusChange">
          <!-- 全部 -->
          <el-tab-pane :label="$t('common_status_all')" name="0"/>
          <!-- 待提交 -->
          <el-tab-pane :label="$t('contractProductPriceAdjust_status0')" name="1"/>
          <!-- 待审核 -->
          <el-tab-pane :label="$t('contractProductPriceAdjust_status1')" name="2"/>
          <!-- 审核通过 -->
          <el-tab-pane :label="$t('common_audit_pass')" name="3"/>
          <!-- 审核不通过 -->
          <el-tab-pane :label="$t('common_audit_not_pass')" name="4"/>
          <!-- 已更正 -->
          <el-tab-pane :label="$t('distributionOrder_status_update')" name="6"/>
        </el-tabs>
        <div slot="btn">
          <ody-button name="createChangeOrder" size="small" style="margin-bottom: 10px;" @click="createChangeOrder(2)">{{ $t('changeOrder_changeType_stockChange') }}</ody-button>
          <ody-button name="createChangeOrder9" size="small" style="margin-bottom: 10px;" @click="createChangeOrder(3)">{{ $t('changeOrder_changeType_returnChange') }}</ody-button>
        </div>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :checked.sync="checked"
          :can-filter="false"
          name="list115"
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
import dateUtil from '@/utils/dateUtil'
var vue = null
export default {
  name: 'OpmsPurchaseChangeOrderList',
  data() {
    return {
      searchForm: getDefaultSearchForm(),
      loading: false,
      list: [],
      checked: [],
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
        changeCode: '',
        arg1: 0,
        type: 0 // 1 changeOrderStatus, 2 doDelete
      },
      columns: [
        {
          show: true,
          prop: 'changeCode', // 更正单号
          label: this.$t('changeOrder_changeCode'),
          align: 'center'
        },
        {
          show: true,
          prop: 'orderStatusText', // 单据类型
          label: this.$t('receiveOrder_orderType'),
          align: 'center'
        },
        {
          show: true,
          prop: 'changeTypeText', // 更正类型
          label: this.$t('changeOrder_changeType'),
          align: 'center'
        },
        {
          show: true,
          prop: 'merchantName', // 商家名称
          label: this.$t('plMpResult_merchantName'),
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
          prop: 'orderStatusText', // 单据状态
          label: this.$t('purchase_request_order_status'),
          align: 'center'
        },
        {
          show: true,
          prop: 'createTime', // 创建时间
          label: this.$t('plMpResult_createTime'),
          align: 'center',
          formatter: (row, column, cellValue) => {
            return dateFormat(row.createTime)
          }
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        minWidth: 150,
        list: [
          {
            label: this.$t('common_submit'),
            disabled: false,
            method(index, row) {
              // 提交
              showDialog(1, vue.$t('common_submit_tip'), vue.$t('contractProductPriceAdjust_cancel'), vue.$t('common_submit'), row.id, row.changeCode, 2)
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
              showDialog(1, vue.$t('common_adudit_please_pass'), vue.$t('notpass'), vue.$t('pass'), row.id, row.changeCode, 3)
            },
            hidden(index, row) {
              return (row.orderStatus !== 2)
            }
          },
          {
            label: this.$t('changeOrder_order_change'),
            disabled: false,
            method: (index, row) => {
              // 更正
              showDialog(1, '确认更正？', vue.$t('contractProductPriceAdjust_cancel'), vue.$t('changeOrder_order_change'), row.id, row.changeCode, 6)
            },
            hidden(index, row) {
              return (row.orderStatus !== 3)
            }
          },
          {
            label: this.$t('common_edit'),
            disabled: false,
            method: (index, row) => {
              // 编辑
              goEdit(row.id, row.changeCode)
            },
            hidden(index, row) {
              return (row.orderStatus !== 1 && row.orderStatus !== 4)
            }
          },
          // {
          //   label: this.$t('common_cancel'),
          //   disabled: false,
          //   method: (index, row) => {
          //     // 取消
          //     showDialog(1, vue.$t('common_cancel_tip'), vue.$t('common_no'), vue.$t('common_yes'), row.id, row.changeCode, 8)
          //   },
          //   hidden(index, row) {
          //     return (row.orderStatus !== 2)
          //   }
          // },
          {
            label: this.$t('common_delete'),
            disabled: false,
            method: (index, row) => {
              // 删除
              showDialog(2, vue.$t('common_msg_confirm_delete'), vue.$t('common_no'), vue.$t('common_delete'), row.id, row.changeCode)
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
    createChangeOrder(changeType) {
      // 创建更正单
      goCreate(changeType)
    },
    handleDialogClose() {
      this.dialog.show = false
      this.dialog = {
        show: false,
        title: '',
        but1: '',
        but2: '',
        id: 0,
        changeCode: '',
        arg1: 0,
        type: 0 // 1 changeOrderStatus, 2 doDelete
      }
    },
    handleDialog(status) {
      if (status === 0) {
        if (this.dialog.type === 1 && this.dialog.arg1 === 3) {
          const param = {
            id: this.dialog.id,
            changeCode: this.dialog.changeCode,
            orderStatus: 4
          }
          updateReturnOrderStatus(param)
          this.dialog.show = false
        } else {
          this.handleDialogClose()
        }
      } else if (this.dialog.type === 4) {
        goEdit(this.dialog.id, this.dialog.changeCode)
        this.dialog.show = false
      } else if (this.dialog.type !== 0) {
        const param = {
          id: this.dialog.id,
          changeCode: this.dialog.changeCode
        }
        if (this.dialog.type === 1) {
          param.orderStatus = this.dialog.arg1
        } else if (this.dialog.type === 2) {
          param.isDeleted = 1
        }
        updateReturnOrderStatus(param)
        this.dialog.show = false
      }
    },
    showDialog(type, title, but1, but2, id, arg1) {
      showDialog(type, title, but1, but2, id, arg1)
    }
  }
}

async function loadList(vue, isExport = false) {
  const param = {
    currentPage: vue.page.current,
    itemsPerPage: vue.page.size,
    obj: {
      orderStatus: vue.searchForm.orderStatus !== '0' ? vue.searchForm.orderStatus : null,
      changeCode: vue.searchForm.changeCode,
      purchaseCode: vue.searchForm.purchaseCode,
      merchantName: vue.searchForm.merchantName,
      storeName: vue.searchForm.storeName,
      mpCode: vue.searchForm.mpCode,
      supplierCode: vue.searchForm.supplierCode,
      createTimeStart: null,
      createTimeEnd: null
    }
  }
  if (vue.searchForm.createTime != null) {
    if (vue.searchForm.createTime.length > 0) {
      param.obj.createTimeStart = vue.searchForm.createTime[0]
    }
    if (vue.searchForm.createTime.length > 1) {
      param.obj.createTimeEnd = vue.searchForm.createTime[1]
    }
  }
  const api = vue.$opms.$api.purchaseChangeOrder
  if (!isExport) {
    const res = await api.queryPurchaseChangeOrderList(param)
    if (res) {
      vue.list = res.data.listObj
      vue.page.total = res.data.total
    }
  }
}

async function exportData(vue) {
  await loadList(vue, true)
}

function getDefaultSearchForm() {
  return {
    changeCode: '',
    orderStatus: '0',
    createTime: [],
    purchaseCode: '',
    merchantName: '',
    storeName: '',
    mpCode: '',
    supplierCode: ''
  }
}

function dateFormat(time, reHHmmss = false) {
  if (!time) {
    return ''
  }
  return dateUtil.dateFormatForTime(time, reHHmmss)
}

function showDialog(type, title, but1, but2, id, changeCode, arg1) {
  vue.dialog.type = type
  vue.dialog.title = title
  vue.dialog.but1 = but1
  vue.dialog.but2 = but2
  vue.dialog.id = id
  vue.dialog.changeCode = changeCode
  vue.dialog.arg1 = arg1
  vue.dialog.show = true
}

function updateReturnOrderStatus(param) {
  const api = vue.$opms.$api.purchaseChangeOrder
  api.updateChangeOrderStatus(param).then((data) => {
    vue.handleSearchSubmit()
  })
}

function goEdit(id, changeCode) {
  // 去编辑
  location.href = '/#/opms-web/purchaseChangeOrder/detailInfo?changeCode=' + changeCode
}

function goCreate(changeType) {
  // 去新增
  location.href = '/#/opms-web/purchaseChangeOrder/detailInfo?changeType=' + changeType
}
</script>

<style lang="scss" scoped>

</style>
