<template>
  <section class="pg-soPackage-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <el-row>
            <el-col :span="5">
              <!-- 物流公司 -->
              <el-form-item :label="$t('物流公司') + ':'">
                <el-select
                  v-model="searchForm.deliveryCompanyId"
                  :popper-append-to-body="false"
                  :placeholder="$t('common_all')"
                  name="searchForm_deliveryCompanyId"
                >
                  <el-option
                    v-for="item in merchantTypeList"
                    :label="item.name"
                    :key="item.code"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <!-- 物流单号 -->
              <el-form-item :label="$t('物流单号') + ':'">
                <el-input
                  v-model="searchForm.deliveryExpressNbr"
                  name="searchForm_deliveryExpressNbr"
                  maxlength="25"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <!-- 店铺 -->
              <el-form-item :label="$t('店铺') + ':'">
                <el-select
                  v-model="searchForm.storeId"
                  :popper-append-to-body="false"
                  :placeholder="$t('common_all')"
                  name="searchForm_storeId"
                >
                  <el-option
                    v-for="item in storeList"
                    :label="item.storeName"
                    :key="item.storeId"
                    :value="item.storeId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <!-- 手机号 -->
              <el-form-item :label="$t('手机号') + ':'">
                <el-input
                  v-model="searchForm.goodReceiverMobile"
                  name="searchForm_goodReceiverMobile"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="5">
              <!-- 综合搜索下拉框 -->
              <el-form-item label>
                <el-select
                  v-model="searchName"
                  :clearable="false"
                  name="searchName"
                  @change="searchForm.searchValue = null"
                >
                  <el-option :label="$t('订单号')" value="orderCode">{{ $t('订单号') }}</el-option>
                  <el-option :label="$t('外部订单号')" value="outOrderCode">{{ $t('外部订单号') }}</el-option>
                  <el-option :label="$t('收货人姓名')" value="goodReceiverName">{{ $t('收货人姓名') }}</el-option>
                  <el-option :label="$t('发货任务单号')" value="doCode">{{ $t('发货任务单号') }}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-input v-model="searchForm.searchValue" name="searchForm_searchValue" />
            </el-col>
            <el-col :span="6">
              <!-- 发货时间 -->
              <ody-search-item :label="$t('deliverytime') + ':'" :space="2" style="width: 220%" prop="deliverytime">
                <ody-date-range-picker
                  v-model="searchForm.deliverytime"
                  :start-placeholder="$t('startDate')"
                  :end-placeholder="$t('endDate')"
                  name="searchForm_deliverytime"
                  type="datetimer"
                />
              </ody-search-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button
          name="OmsParcelList_Reset_handleSearchReset"
          code="OmsParcelList_Reset"
          size="small"
          @click="handleSearchReset"
        >{{ $t('common_reset') }}</ody-button>
        <ody-button
          name="OmsParcelList_Query_handleSearchSubmit"
          code="OmsParcelList_Query"
          size="small"
          type="primary"
          @click="handleSearchSubmit"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <!--<ody-button
          name="OmsParcelList_Export_handleExport"
          code="OmsParcelList_Export"
          size="small"
          @click="handleExport"
        >{{ $t('导出') }}</ody-button>
        <ody-button
          name="OmsParcelList_Task_handleSeeTask"
          code="OmsParcelList_Task"
          size="small"
          @click="handleSeeTask"
        >{{ $t('查看任务') }}</ody-button>-->
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          name="OmsParcelList_Export_handleExport"
          code="OmsParcelList_Export"
          size="small"
          class="btn-right"
        >{{ $t('导出') }}</ody-batch-export-button>
        <ody-export-task-button
          pool="oms"
          task-type="soPackageExport"
          name="OmsParcelList_Task_handleSeeTask"
          code="OmsParcelList_Task"
          size="small"
          class="btn-right"
        >{{ $t('查看任务') }}</ody-export-task-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="false"
          :operates="operates"
          name="list202"
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
    <soExportTask
      :visible.sync="visibleOfTask"
      :code="exportCode"
      task-type="9"
      @close="closeExportTask"
    />
  </section>
</template>

<script>
import soUtils from '@/utils/soUtils'
import soExportTask from '@/components/soExportTask'

var vue = null
const packageStatus_completed = 3040 // 已送达

export default {
  name: 'OmsParcelList',
  components: {
    soExportTask
  },
  data() {
    return {
      exportModel: {
        exportApi: ['oms-web', 'soPackage', 'exportData'],
        pool: 'oms',
        taskType: 'soPackageExport',
        async: true,
        getExportData: () => {
          const filters = JSON.parse(JSON.stringify(this.searchForm))
          if (filters.deliverytime) {
            filters.startOrderLogisticsTime = filters.deliverytime[0]
            filters.endOrderLogisticsTime = filters.deliverytime[1]
            delete filters.deliverytime
          }
          if (filters.searchValue) {
            filters[vue.searchName] = filters.searchValue
            delete filters.searchValue
          }
          const param = {
            filters: filters
          }
          return param
        }
      },
      merchants: [],
      warehouseList: [],
      allChannels: {},
      storeList: [],
      merchantTypeList: [],
      distributionModeItems: [],
      province_list: [],
      packageStatus: [],
      visibleOfTask: false,
      exportCode: '',
      city_list: [],
      dateRangePicker: '',
      area_list: [],
      activeState: '0',
      searchForm: getDefaultSearchForm(),
      loading: false,
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      searchName: 'orderCode',
      goodReceiverAddressAll: '',
      timeButtons: [
        {
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
      ],
      columns: [
        {
          show: true,
          prop: 'packageCode',
          label: this.$t('packageCode'),
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            return (
              <a
                on-click={() => {
                  this.forwardToDelivery(params.row)
                }}
              >
                <span style='color:#1890FF '>{params.row.packageCode}</span>
              </a>
            )
          }
        },
        {
          show: true,
          prop: 'packageStatusStr',
          label: this.$t('packageStatus'),
          align: 'center'
        },
        {
          show: true,
          // prop: 'deliveryCompanyName',
          label: this.$t('so_pick_delivery_merchant'),
          align: 'center',
          formatter: (row, column, cellValue) => {
            return row.deliveryMode === 2 ? row.deliverName : row.deliveryCompanyName
          }
        },
        {
          show: true,
          prop: 'deliveryExpressNbr',
          label: '物流单号',
          align: 'center'
        },
        {
          show: true,
          prop: 'orderCode',
          label: '订单号',
          align: 'center',
          // render: (h, item) => {
          //   return h('a', {
          //     attrs: {
          //       'data-rowId': item.row.id,
          //       'data-order-code': item.row.orderCode
          //     },
          //     on: {
          //       click: () => {
          //         this.seeOrder(h, item)
          //       }
          //     },
          //     domProps: {
          //       innerHTML: item.row.orderCode
          //     }
          //   })
          // }
          render: (h, params) => {
            return (
              <a
                on-click={() => {
                  this.seeOrder(h, params)
                }}
              >
                <span style='color:#1890FF '>{params.row.orderCode}</span>
              </a>
            )
          }
        },
        {
          show: true,
          prop: 'doCode',
          label: this.$t('do_do_code'),
          align: 'center'
        },
        // {
        //   show: true,
        //   prop: 'doStatusStr',
        //   label: this.$t('do_do_status'),
        //   align: 'center',
        //   minWidth: 120
        // },
        {
          show: true,
          prop: 'warehouseName',
          label: this.$t('do_warehouse'),
          align: 'center'
        },
        {
          show: true,
          prop: 'merchantName',
          label: '商家',
          align: 'center'
        },
        {
          show: true,
          prop: 'storeName',
          label: '店铺'
        },
        {
          show: true,
          prop: 'goodReceiverName',
          label: '收货人信息',
          align: 'center',
          tooltip: false,
          render: (h, params) => {
            if (params.row.goodReceiverName) {
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
                        <span>{params.row.goodReceiverAddressAll}</span>
                      </div>
                    </div>
                    <i class='el-icon-user'></i>
                  </el-tooltip>
                  <sapn>{params.row.goodReceiverName}</sapn>
                </span>
              )
            } else {
              return ''
            }
          }
        }
        // ,{
        //   show: true,
        //   prop: 'goodReceiverMobile',
        //   label: this.$t('deliveryMobile'),
        //   align: 'center',
        //   minWidth: 100
        // }, {
        //   show: true,
        //   prop: 'goodReceiverAddressAll',
        //   label: this.$t('goodReceiverAddress'),
        //   align: 'center',
        //   minWidth: 200
        // }
      ],
      operates: {
        fixed: 'right',
        minWidth: 200,
        list: [
          {
            label: '编辑',
            disabled: false,
            method(index, row) {
              vue.forwardToDelivery(row)
            },
            hidden(index, row) {
              return (
                row.hasDeliveryInfo ||
                !(row.packageStatus < packageStatus_completed)
              )
            },
            code: 'OmsParcelList_Edit'
          },
          {
            label: '确认签收',
            disabled: false,
            method(index, row) {
              // 确认签收
              updateStatusForSign(vue, row)
            },
            hidden(index, row) {
              // 包裹状态不等于已送达，并且出库方式为物流，则展示签收按钮
              return !(
                row.packageStatus < packageStatus_completed &&
                row.deliveryMode === 1
              )
            },
            code: 'OmsParcelList_Confirm_Sign'
          },
          {
            label: '打印',
            disabled: false,
            method(index, row) {
              vue.printToDelivery(row)
            },
            code: 'OmsParcelList_Print'
          }
        ]
      }
    }
  },
  async mounted() {
    try {
      vue = this
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    forwardToDelivery(row) {
      /** 跳转到发货确认页面 */
      this.$router.push({
        name: 'OmsParcelListDetail',
        params: { id: row.id, packageCode: row.packageCode }
      })
    },
    printToDelivery(row) {
      /** 跳转到发货确认页面 */
      this.$router.push({
        name: 'OmsParcelListPrint',
        params: { id: row.id, packageCode: row.packageCode }
      })
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
      this.searchForm = getDefaultSearchForm()
      this.searchName = 'orderCode'
      this.resetTime()
      // this.handleSearchSubmit()
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
    queryAera(code, level) {
      const filtersForAera = {
        parentCode: code,
        level: level
      }
      const vue = this
      this.$oms.$api.common
        .getAreaListNoPaging({ filters: filtersForAera })
        .then(data => {
          if (level === 1) {
            if (code) {
              vue.province_list = data.data
            } else {
              vue.province_list = []
              vue.city_list = []
              vue.area_list = []
            }
          }
          if (level === 2) {
            vue.searchForm.goodReceiverCityCode = null
            vue.searchForm.goodReceiverAreaCode = null
            if (code) {
              vue.city_list = data.data
            } else {
              vue.city_list = []
              vue.area_list = []
            }
          }
          if (level === 3) {
            vue.searchForm.goodReceiverAreaCode = null
            if (code) {
              vue.area_list = data.data
            } else {
              vue.area_list = []
            }
          }
        })
    },
    _listStoreList() {
      const vue = this
      // this.$oms.$api.common.storeList({}).then((result) => {
      //   vue.storeList = result.data.listObj
      // })
      this.$oms.$api.merchantApi
        .queryPlatformAuthStorePage({ currentPage: 1, itemsPerPage: 500 })
        .then(result => {
          vue.storeList = result.data.listObj
        })
    },
    _initAllChannels() {
      const vue = this
      this.$oms.$api.common.listAllChannels({}).then(data => {
        vue.allChannels = data.data
      })
    },
    _initMerchants() {
      const vue = this
      this.$oms.$api.common
        .merchantList({ currentPage: 1, itemsPerPage: 1000 })
        .then(data => {
          vue.merchants = data.data.listObj
        })
    },
    _initDistributionModeItem() {
      this.$oms.$api.common
        .listByCategorysForOrder({
          categorys: ['EXPRESS_CONFIG', 'PACKAGE_STATUS']
        })
        .then(data => {
          this.merchantTypeList = data.data.EXPRESS_CONFIG
          this.merchantTypeMap = data.data.EXPRESS_CONFIG.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
          this.packageStatus = data.data.PACKAGE_STATUS
          this.packageStatusMap = data.data.PACKAGE_STATUS.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
        })
      this.$oms.$api.distributionModeItem
        .distributionModeItemListForSelect({})
        .then(data => {
          this.distributionModeItems = data.data
        })
    },
    loadWarehouseByMerchant() {
      const vue = this
      if (!vue.searchForm.merchantId) {
        vue.warehouseList = []
      } else {
        this.$oms.$api.common
          .listStoreWarehouse({
            isVirtualWarehouse: 0,
            merchantId: vue.searchForm.merchantId
          })
          .then(data => {
            vue.warehouseList = data.data
          })
      }
    },
    init() {
      this.resetTime()
      this._listStoreList()
      this._initAllChannels()
      this._initMerchants()
      this._initDistributionModeItem()
      this.loadWarehouseByMerchant()
      this.queryAera('100000', 1)
      this.updateList()
    },
    seeOrder(h, params) {
      soUtils.toOrderDetail(
        this,
        params.row.orderCode,
        params.row.orderSource,
        params.row.sysCode
      )
    },
    resetTimeButtons() {
      this.timeButtons.forEach(item => {
        item.type = ''
      })
    },
    resetTime() {
      this.setDateBetween(this.timeButtons, 'deliverytime', '近7天')
    },
    setDateBetween(buttons, key, label) {
      var vm = this
      buttons.forEach(function(item) {
        if (item.label === label) {
          item.type = 'primary'
          const startTime = new Date()
          startTime.setDate(startTime.getDate() + item.start + 1)
          const endTime = new Date()
          endTime.setDate(endTime.getDate() + item.end)
          vm.searchForm[key] = [
            vm.$portal.parseTime(startTime, '{y}-{m}-{d} 00:00:00'),
            vm.$portal.parseTime(endTime, '{y}-{m}-{d} 23:59:59')
          ]
        } else {
          item.type = ''
        }
      })
    },
    handleExport() {
      const vue = this
      const filters = JSON.parse(JSON.stringify(vue.searchForm))
      if (filters.deliverytime) {
        filters.startOrderLogisticsTime = filters.deliverytime[0]
        filters.endOrderLogisticsTime = filters.deliverytime[1]
        delete filters.deliverytime
      }
      if (filters.searchValue) {
        filters[vue.searchName] = filters.searchValue
        delete filters.searchValue
      }
      const param = {
        filters: filters
      }

      vue.$oms.$api.soPackage.export(param).then(res => {
        vue
          .$confirm(
            vue.$t('exportPromptInfoSuccess') +
              res.data +
              vue.$t('exportPromptInfoConfirm'),
            vue.$t('exportPrompt'),
            {
              confirmButtonText: vue.$t('common_confirm'),
              type: 'info',
              showCancelButton: false
            }
          )
          .then(() => {
            vue.exportCode = res.data
            this.handleSeeTask()
          })
      })
    },
    handleSeeTask() {
      this.visibleOfTask = true
    },
    closeExportTask() {
      this.exportCode = ''
    }
  }
}

async function loadList(vue) {
  const filters = JSON.parse(JSON.stringify(vue.searchForm))
  if (filters.deliverytime) {
    filters.startOrderLogisticsTime = filters.deliverytime[0]
    filters.endOrderLogisticsTime = filters.deliverytime[1]
    delete filters.deliverytime
  }
  if (filters.searchValue) {
    filters[vue.searchName] = filters.searchValue
    delete filters.searchValue
  }
  const param = {
    filters: filters,
    limit: vue.page.size,
    page: vue.page.current,
    joinFields: ['hasDeliveryInfo']
  }
  const soPackage = vue.$oms.$api.soPackage

  const res = await soPackage.parcelListListPage(param)
  if (res) {
    const data = res.data || []
    data.forEach(item => {
      // 防止显示null信息
      if (!item.goodReceiverProvince) {
        item.goodReceiverProvince = ''
      }
      if (!item.goodReceiverCity) {
        item.goodReceiverCity = ''
      }
      if (!item.goodReceiverArea) {
        item.goodReceiverArea = ''
      }
      if (!item.goodReceiverAddress) {
        item.goodReceiverAddress = ''
      }

      /* 收货信息 */
      item.goodReceiverAddressAll =
        item.goodReceiverProvince +
        item.goodReceiverCity +
        item.goodReceiverArea +
        item.goodReceiverAddress
    })
    vue.list = data
    vue.page.total = res.total
  }
}

async function updateStatusForSign(vue, row) {
  const soPackage = vue.$oms.$api.soPackage
  const res = await soPackage.parcelListUpdateStatusForSign({
    id: row.id,
    packageStatus: packageStatus_completed
  })
  vue.$message(vue.$t('common_operate_success'))
  if (res) {
    loadList(vue)
  }
}

function getDefaultSearchForm() {
  return Object.assign(
    {},
    {
      goodReceiverProvinceCode: null,
      goodReceiverCityCode: null,
      goodReceiverAreaCode: null,
      searchValue: null,
      deliverytime: []
    }
  )
}
</script>

<style lang="less" scoped>
.info_class {
  font-size: 14px;
  height: 20px;
  width: 20px;
  line-height: 20px;
  text-align: center;
  display: inline-block;
  color: #109fff;
  border: 1px solid #19a3ff;
  border-radius: 12px;
  margin-left: 10px;
  cursor: default;
}
.cp-date-range-picker .data-time-name .el-button {
  line-height: 32px;
  height: 32px;
}
.btn-right{
  margin-right: 16px;
}
</style>
