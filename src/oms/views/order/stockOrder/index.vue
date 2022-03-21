<template>
  <section class="pg-so-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item prop="data.searchKey">
            <span slot="label">
              <el-select :clearable="false" v-model="search.data.searchKey" name="search_data_searchKey" @change="onSearchKeyChange">
                <el-option :label="$t('订单号')" value="orderCode">{{ $t('订单号') }}</el-option>
                <el-option :label="$t('外部订单号')" value="outOrderCode">{{ $t('外部订单号') }}</el-option>
                <el-option :label="$t('收货人姓名')" value="goodReceiverName">{{ $t('收货人姓名') }}</el-option>
                <el-option :label="$t('商品编码')" value="code">{{ $t('商品编码') }}</el-option>
              </el-select>
            </span>
            <el-input v-model="search.data.searchValue" name="search_data_searchValue"/>
          </ody-search-item>
          <ody-search-item :label="$t('收货人手机')+':'" prop="param.goodReceiverMobile">
            <el-input v-model="search.param.goodReceiverMobile" name="search_param_goodReceiverMobile" />
          </ody-search-item>
          <ody-search-item :label="$t('店铺')+':'" prop="param.storeId">
            <el-select v-model="search.param.storeId" :popper-append-to-body="false" name="search_param_storeId">
              <el-option :value="null" :label="$t('全部')"/>
              <el-option v-for="item in search.data.storeList" :label="item.storeName" :key="item.storeId" :value="item.storeId" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品名称')+':'" prop="param.productCname">
            <el-input v-model="search.param.productCname" name="search_param_productCname"/>
          </ody-search-item>
          <ody-search-item :label="$t('下单时间')+':'" :space="2" prop="data.orderCreateTime">
            <ody-date-range-picker
              v-model="search.data.orderCreateTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="search_data_orderCreateTime"
              type="datetimer"/>
          </ody-search-item>
          <ody-search-item :label="$t('订单类型')+':'" prop="param.orderType">
            <el-select v-model="search.param.orderType" name="search_param_orderType">
              <el-option :value="null" :label="$t('全部')"/>
              <el-option v-for="item in search.data.orderTypeList" :label="item.name" :key="item.code" :value="item.code" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('支付时间')+':'" :space="2" prop="data.orderPaymentConfirmDate">
            <ody-date-range-picker
              v-model="search.data.orderPaymentConfirmDate"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="search_data_orderPaymentConfirmDate"
              type="datetimer"/>
          </ody-search-item>
          <ody-search-item :label="$t('客户')+':'" prop="data.customerName">
            <el-input v-model="search.data.customerName" :placeholder="'请选择'" name="search_data_customerName" readonly="true" @click.native="showCustomerModal"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button name="OmsStockOrderList_Reset_initData" code="OmsStockOrderList_Reset" size="small" @click="initData">{{ $t('重置') }}</ody-button>
        <ody-button name="OmsStockOrderList_Query_searchList" code="OmsStockOrderList_Query" size="small" type="primary" @click="searchList">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <!-- <ody-button name="OmsStockOrderList_Export" code="OmsStockOrderList_Export" size="small" @click.prevent="exportData">{{ $t('导出缺货明细') }}</ody-button>-->
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          name="OmsStockOrderList_Export"
          code="OmsStockOrderList_Export"
          size="small"
          class="btn-right"
        >{{ $t('导出缺货明细') }}</ody-batch-export-button>
        <ody-export-task-button
          pool="oms"
          task-type="soStockOutExport"
          name="OmsStockOrderList_Task"
          code="OmsStockOrderList_Export"
          size="small"
          class="btn-right"
        >{{ $t('seeExportTask') }}</ody-export-task-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :data-key="'orderCode'"
          :columns="columns"
          :operates="operates"
          :multiple="multiple"
          name="list065"/>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="search.data.page"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="search.data.limit"
          :total.sync="search.data.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="searchList"
          @current-change="onPageChange"/>
        <font color="white"/>

      </div>
    </ody-list-table-area>
    <div>
      <ody-dialog-full-right
        :visible.sync="dialogVisible"
        :title="$t('缺货明细')"
        size="medium">
        <ody-table
          :loading="loading"
          :data="listTwo"
          :columns="columnsTwo"
          name="listTwo924"
        />
        <div slot="footer">
          <el-button name="handleCloseDialog" type="primary" @click="handleCloseDialog">{{ $t('关闭') }}</el-button>
        </div>
      </ody-dialog-full-right>
    </div>
    <OrderCustomerModal :visible.sync="showCustomer" @ok="selectCustomer" />
  </section>
</template>

<script>

import SoExportTask from '@/components/soExportTask'
import OrderCustomerModal from '@/components/orderCustomerModal'
import ToOrderDetail from '@/components/so/toDetail'

const timeBtns = [{
  label: '今天',
  type: '',
  start: 0,
  end: 0
},
{
  label: '昨天',
  type: '',
  start: -1,
  end: -1
},
{
  label: '近7天',
  type: '',
  start: -7,
  end: 0
},
{
  label: '近30天',
  type: '',
  start: -30,
  end: 0
}
]

const orderCreateTimeBtns = JSON.parse(JSON.stringify(timeBtns))
const orderPaymentConfirmDateBtns = JSON.parse(JSON.stringify(timeBtns))

import soUtils from '@/utils/soUtils'

export default {
  name: 'OmsStockOrderList',
  components: {
    SoExportTask,
    OrderCustomerModal,
    ToOrderDetail
  },
  data() {
    return {
      exportModel: {
        exportApi: ['oms-web', 'soStockOut', 'exportData'],
        pool: 'oms',
        taskType: 'soStockOutExport',
        async: true,
        getExportData: () => {
          return { filters: generateSearchParams(this) }
        }
      },
      dialogVisible: false,
      visibleOfTask: false,
      soItemStockItemList: [],
      listTwo: [],
      search: {
        data: {
          searchKey: 'orderCode',
          searchValue: '',
          orderCreateTimeBtns: orderCreateTimeBtns,
          orderCreateTime: [],
          orderPaymentConfirmDateBtns: orderPaymentConfirmDateBtns,
          orderPaymentConfirmDate: [],
          storeList: [],
          orderTypeList: [],
          limit: 10,
          page: 1,
          total: 0
        },
        param: {}
      },
      tabs: [{
        heading: this.$t('订单号'),
        index: 0,
        orderStatus: null
      }],
      showCustomer: false,
      activeState: 0,
      loading: false,
      multiple: true,
      checked: [],
      list: [],
      columns: [
        {
          show: true,
          prop: 'orderCode',
          label: this.$t('订单号'),
          minWidth: 200,
          render: (h, params) => {
            return (
              <ToOrderDetail orderCode={params.row.orderCode} orderSource={params.row.orderSource} sysSource={params.row.sysSource}>
                <span>{ params.row.orderCode }</span>
              </ToOrderDetail>
            )
          }
        },
        {
          show: true,
          prop: 'outOrderCode',
          label: this.$t('外部订单号'),
          minWidth: 200
        },
        {
          show: true,
          prop: 'orderTypeStr',
          label: this.$t('订单类型'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('商家'),
          align: 'center'
        },
        {
          show: true,
          prop: 'storeName',
          label: this.$t('店铺'),
          align: 'center'
        },
        {
          show: true,
          label: this.$t('收货信息'),
          align: 'center',
          tooltip: false,
          render: (h, params) => {
            let userName = params.row.userName
            if (userName == null || userName === '') {
              userName = params.row.customerName
            }
            if (userName == null || userName === '') {
              userName = params.row.goodReceiverName
            }

            let goodReceiverAddressAll = ''
            if (params.row.goodReceiverCountry) goodReceiverAddressAll = goodReceiverAddressAll + params.row.goodReceiverCountry
            if (params.row.goodReceiverProvince) goodReceiverAddressAll = goodReceiverAddressAll + params.row.goodReceiverProvince
            if (params.row.goodReceiverCity) goodReceiverAddressAll = goodReceiverAddressAll + params.row.goodReceiverCity
            if (params.row.goodReceiverCounty) goodReceiverAddressAll = goodReceiverAddressAll + params.row.goodReceiverCounty
            if (params.row.goodReceiverArea) goodReceiverAddressAll = goodReceiverAddressAll + params.row.goodReceiverArea
            if (params.row.goodReceiverAddress) goodReceiverAddressAll = goodReceiverAddressAll + params.row.goodReceiverAddress
            params.row.goodReceiverMobile = params.row.goodReceiverMobile ? params.row.goodReceiverMobile : ''

            if (userName) {
              return (
                <span>
                  <el-tooltip effect='dark' placement='top'>
                    <div slot='content'>
                      <div>
                        <span>收货人：</span>
                        <span>{params.row.goodReceiverName}</span>
                        <br />
                        <span>手机号：</span>
                        <span>{params.row.goodReceiverMobile}</span>
                        <br />
                        <span>地址：</span>
                        <span>{goodReceiverAddressAll}</span>
                      </div>
                    </div>
                    <i class='el-icon-user'></i>
                  </el-tooltip>
                  <sapn>{userName}</sapn>
                </span>
              )
            } else {
              return ''
            }
          }

        },
        {
          show: true,
          prop: 'orderRemarkUser',
          label: this.$t('manual_order_customer_remark'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'orderRemarkMerchant2user',
          label: this.$t('manual_order_merchant_remark'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          label: this.$t('订单金额'),
          align: 'center',
          minWidth: 88,
          formatter: (row, column) => {
            const orderTotalAmount = (row.orderAmount || 0) + (row.taxAmount || 0) + (row.orderDeliveryFee || 0)
            return this.$options.filters['currency'](orderTotalAmount, '￥', 2)
          }
        },
        {
          show: true,
          prop: 'orderStatusStr',
          label: this.$t('order_status'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          label: this.$t('下单时间'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column) => {
            if (row.orderCreateTime) {
              return this.$portal.parseTime(row.orderCreateTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
            return ''
          }
        }
      ],
      operates: {
        align: 'center',
        fixed: 'right',
        list: [
          {
            label: this.$t('stock_out_details'),
            method: (index, row) => {
              this.openStockOutDetails(index, row)
            },
            code: 'OmsStockOrderList_Detail'
          },
          // 无仓的发货
          {
            label: this.$t('soPickDeliver'),
            method: (index, row) => {
              this.$router.push({
                name: 'OmsSoPickDeliveryDetail', params: {
                  id: row.pickId
                }
              })
            },
            hidden(index, row) {
              return row.pickId == null
            },
            code: 'OmsStockOrderList_Dispatch'
          },
          // 有仓的发货
          {
            label: this.$t('soPickDeliver'),
            method: (index, row) => {
              if (row.orderType === 102) {
                this.$router.push({
                  name: 'OmsSoPickDeliveryDetail', query: {
                    orderCode: row.orderCode
                  }
                })
              } else {
                soUtils.toOrderDetail(this, row.orderCode, row.orderSource, row.sysSource)
              }
            },
            hidden(index, row) {
              return row.pickId != null
            },
            code: 'OmsStockOrderList_Dispatch'
          }
        ]
      },
      columnsTwo: [

        {
          show: true,
          prop: 'productCname',
          label: this.$t('do_product_name'),
          align: 'center'
        },
        {
          show: true,
          prop: 'code',
          label: this.$t('order_ports_product_code'),
          align: 'center'
        },
        {
          show: true,
          prop: 'barCode',
          label: this.$t('bar_code'),
          align: 'center'
        },
        {
          show: true,
          prop: 'standard',
          label: this.$t('manual_order_product_attr'),
          align: 'center'
        },
        {
          show: true,
          prop: 'productItemNum',
          label: this.$t('do_product_item_num'),
          align: 'center'
        },
        {
          show: true,
          prop: 'productItemNum',
          label: this.$t('do_delivered_num'),
          align: 'center',
          formatter: (row, column) => {
            return (
              `<span>${row.productItemNum - row.unDeliveryNum}</span>`
            )
          }
        },
        {
          show: true,
          prop: 'stockOutAmount',
          label: this.$t('stock_out_num'),
          align: 'center'
        }

      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    handleOpenDialog() {
      this.dialogVisible = true
    },
    handleCloseDialog() {
      this.dialogVisible = false
    },
    init() {
      this.initData()
      this._listStoreList(this)
      this._listOrderTypeList(this)
      this.listData()
    },
    getOrderCodes(vue) {
      for (let i = 0; i < vue.checked.length; i++) {
        vue.batchOperateParams.orderCodes.push(vue.checked[i].orderCode)
      }
    },
    onPageChange() {
      this.listData()
    },
    onSearchKeyChange() {
      delete this.search.param[this.search.data.lastSearchKey]
      this.search.data.searchValue = ''
    },
    exportData() {
      const queryArgs = generateSearchParams(this)
      // this.$oms.$api.soStockOut.soStockOutExport(queryArgs)
      this.$portal.downloadFileByPost('/api/oms-web/soStockOut/exportData', { queryArgs: JSON.stringify(queryArgs) })
    },
    async searchList() {
      this.search.data.page = 1
      await this.listData()
    },
    async listData() {
      const queryArgs = generateSearchParams(this)
      try {
        this.loading = true
        const result = await this.$oms.$api.soStockOut.soStockOutList(queryArgs)
        this.list = result.data
        this.search.data.total = result.total
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    initData() {
      this.setDateBetween(this.search.data.orderCreateTimeBtns, 'orderCreateTime', '近7天')
      this.search.data.orderPaymentConfirmDate = []
      this.setDateBetween(this.search.data.orderPaymentConfirmDateBtns, 'orderPaymentConfirmDate', '近7天')
      this.search.param = {
        orderType: null,
        goodReceiverMobile: null,
        productCname: null,
        storeId: null,
        orderCode: null,
        outOrderCode: null,
        goodReceiverName: null,
        code: null
      }
      this.search.data.customerName = null
      this.search.data.searchKey = 'orderCode'
      this.search.data.searchValue = null
    },
    _listStoreList(vm) {
      vm.$oms.$api.merchantApi.queryPlatformAuthStorePage({ currentPage: 1, itemsPerPage: 99999 }).then((result) => {
        vm.search.data.storeList = result.data.listObj
      })
    },
    _listOrderTypeList(vm) {
      vm.$oms.$api.soType.soTypeList({}).then((result) => {
        vm.search.data.orderTypeList = result.data
      })
    },
    setDateBetween(btns, key, label) {
      var vm = this
      btns.forEach(function(item) {
        if (item.label === label) {
          item.type = 'primary'
          const startTime = new Date()
          startTime.setDate(startTime.getDate() + item.start + 1)
          const endTime = new Date()
          endTime.setDate(endTime.getDate() + item.end)
          vm.search.data[key] = [vm.$portal.parseTime(startTime, '{y}-{m}-{d} 00:00:00'), vm.$portal.parseTime(endTime, '{y}-{m}-{d} 23:59:59')]
        } else {
          item.type = ''
        }
      })
    },
    openStockOutDetails(index, row) {
      const vue = this
      vue.$oms.$api.soItemStockOut.soItemStockOutList({ orderCode: row.orderCode }).then((result) => {
        vue.listTwo = result.data
        vue.dialogVisible = true
      })
    },
    showCustomerModal() {
      this.showCustomer = true
    },
    selectCustomer(data) {
      if (data) {
        this.search.param.customerId = data.customerId
        this.search.data.customerName = data.customerName
      }
    }
  }
}

function generateSearchParams(vue) {
  const param = Object.assign({}, vue.search.param)
  if (vue.search.data.orderCreateTime) {
    param.orderCreateTimeStart = vue.search.data.orderCreateTime[0]
    param.orderCreateTimeEnd = vue.search.data.orderCreateTime[1]
  }
  if (vue.search.data.orderPaymentConfirmDate) {
    param.orderPaymentConfirmDateStart = vue.search.data.orderPaymentConfirmDate[0]
    param.orderPaymentConfirmDateEnd = vue.search.data.orderPaymentConfirmDate[1]
  }
  param[vue.search.data.searchKey] = vue.search.data.searchValue
  param.limit = vue.search.data.limit
  param.page = vue.search.data.page
  param.total = vue.search.data.total
  return param
}
</script>

<style lang="scss" scoped>
.orderLabelWidth .el-form-item .el-form-item__label{
  width:100px!important;
}
.orderLabelWidth .el-form-item .el-form-item__content{
  margin-left: 0px!important;
}
  .hzf-table td{
    border:none;
  }
.hzf-table {
  border: none;
}
  .hzf-big-table .el-table__expanded-cell{
    border:none;
  }
  .btn-right {
    margin-right: 16px;
  }
</style>
