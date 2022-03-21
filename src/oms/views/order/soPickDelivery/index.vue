<template>
  <section class="pg-soPickDelivery-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('do_order_code')" prop="orderCode">
            <el-input v-model="searchForm.orderCode" name="searchForm_orderCode" maxlength="25" />
          </ody-search-item>
          <ody-search-item :label="$t('do_merchant_name')" prop="merchantId">
            <el-select
              v-model="searchForm.merchantId"
              :placeholder="$t('common_all')"
              name="searchForm_merchantId"
              @change="loadWarehouseByMerchant"
            >
              <el-option
                v-for="item in merchants"
                :label="item.merchantName"
                :key="item.merchantId"
                :value="item.merchantId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('do_warehouse')" prop="warehouseId">
            <el-select v-model="searchForm.warehouseId" :placeholder="$t('common_all')" name="searchForm_warehouseId">
              <el-option
                v-for="item in warehouseList"
                :label="item.warehouseName"
                :key="item.id"
                :value="item.id"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('do_store_name')" prop="storeName">
            <el-input v-model="searchForm.storeName" name="searchForm_storeName" maxlength="25" />
          </ody-search-item>
          <ody-search-item :label="$t('manual_order_order_syssource')" prop="sysSource">
            <el-select v-model="searchForm.sysSource" :placeholder="$t('common_all')" name="searchForm_sysSource">
              <el-option
                v-for="(value, key) in allChannels"
                :label="value.channelName"
                :key="key"
                :value="key"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('manual_order_delivery_type')" prop="orderDeliveryMethodId">
            <el-select v-model="searchForm.orderDeliveryMethodId" :placeholder="$t('common_all')" name="searchForm_orderDeliveryMethodId">
              <el-option
                v-for="item in distributionModeItems"
                :label="item.distributionMode"
                :key="item.shippingCode"
                :value="item.shippingCode"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('order_create_time')" prop="createTime">
            <ody-date-range-picker
              v-model="searchForm.createTime"
              name="searchForm_createTime"
              value-format="yyyy-MM-dd"
              type="datetimer"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :label="$t('so_error_create_username')" prop="userName">
            <el-input v-model="searchForm.userName" name="searchForm_userName" />
          </ody-search-item>
          <ody-search-item :label="$t('do_good_receiver_name')" prop="goodReceiverName">
            <el-input v-model="searchForm.goodReceiverName" name="searchForm_goodReceiverName" />
          </ody-search-item>
          <ody-search-item :space="1" :label="$t('do_good_receiver_address')" prop="goodReceiverProvinceCode">
            <el-col :span="8">
              <el-select
                id="s_province"
                v-model="searchForm.goodReceiverProvinceCode"
                name="s_province"
                @change="queryAera(searchForm.goodReceiverProvinceCode, 2)"
              >
                <el-option :label="$t('please_choose')" />
                <el-option
                  v-for="item in province_list"
                  :label="item.name"
                  :key="item.code"
                  :value="item.code"
                />
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select
                id="s_city"
                v-model="searchForm.goodReceiverCityCode"
                :disabled="!searchForm.goodReceiverProvinceCode"
                name="s_city"
                @change="queryAera(searchForm.goodReceiverCityCode, 3)"
              >
                <el-option :label="$t('please_choose')" />
                <el-option
                  v-for="item in city_list"
                  :label="item.name"
                  :key="item.code"
                  :value="item.code"
                />
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select
                id="s_area"
                v-model="searchForm.goodReceiverAreaCode"
                :disabled="!searchForm.goodReceiverCityCode"
                name="s_area"
              >
                <el-option :label="$t('please_choose')" />
                <el-option
                  v-for="item in area_list"
                  :label="item.name"
                  :key="item.code"
                  :value="item.code"
                />
              </el-select>
            </el-col>
          </ody-search-item>
          <ody-search-item :label="$t('do_good_receiver_mobile')" prop="goodReceiverMobile">
            <el-input v-model="searchForm.goodReceiverMobile" name="searchForm_goodReceiverMobile" />
          </ody-search-item>
          <ody-search-item :label="$t('so_pick_delivery_merchant')" prop="deliveryCompanyName">
            <el-input v-model="searchForm.deliveryCompanyName" name="searchForm_deliveryCompanyName" />
          </ody-search-item>
          <ody-search-item :label="$t('so_pick_arrival_time')" prop="estimatedTimeOfArrival">
            <ody-date-range-picker
              v-model="searchForm.estimatedTimeOfArrival"
              name="searchForm_estimatedTimeOfArrival"
              value-format="yyyy-MM-dd"
              type="datetimer"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :label="$t('outOrderCode')" prop="outOrderCode">
            <el-input v-model="searchForm.outOrderCode" name="searchForm_outOrderCode" />
          </ody-search-item>
          <ody-search-item :label="$t('供应商名称')" prop="supplierName">
            <el-input v-model="searchForm.supplierName" name="searchForm_supplierName"/>
          </ody-search-item>

        </el-form>
      </div>
      <div slot="btn">
        <ody-button name="OmsSoPickDelivery_Reset_handleSearchReset" code="OmsSoPickDelivery_Reset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</ody-button>
        <ody-button
          name="OmsSoPickDelivery_Query_handleSearchSubmit"
          code="OmsSoPickDelivery_Query"
          size="small"
          type="primary"
          @click="handleSearchSubmit"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" @tab-click="handleTabsClick">
          <el-tab-pane v-for="tab in tabs" :label="tab.heading" :key="tab.index" />
        </el-tabs>
        <div slot="btn mgB12">
          <ody-button name="importSoDelievery" size="small" code="OmsSoPickDelivery_Import" type="primary" @click="importDelivery">{{ $t('导入物流单') }}</ody-button>
          <ody-button name="OmsSoPickDelivery_Task_openSoPickTaskList" code="OmsSoPickDelivery_Task" size="small" @click="openOrderTaskList()">{{ $t('seeTask') }}</ody-button>
        </div>
      </div>
      <div slot="table">
        <ody-table :loading="loading" :data="list" :columns="columns" :operates="operates" name="list348" />
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
    <SoExportTask :visible.sync="exportModal.show" :code.sync="exportModal.taskCode" :task-type="exportModal.taskType" :design-columns.sync="exportModal.columns" :design-operates.sync="exportModal.operates"/>
    <SoDeliveryImportModal v-if="visibleOfSoDeliveryImportModal" :visible.sync="visibleOfSoDeliveryImportModal" @success="handleImportSuccess" />
  </section>
</template>

<script>
import SoExportTask from '@/components/soExportTask'
import ToOrderDetail from '@/components/so/toDetail'
import SoDeliveryImportModal from '@/components/soPick/importModal'

export default {
  name: 'OmsSoPickDelivery',
  components: {
    ToOrderDetail,
    SoDeliveryImportModal,
    SoExportTask
  },
  data() {
    const vue = this
    return {
      merchants: [],
      warehouseList: [],
      allChannels: {},
      distributionModeItems: [],
      province_list: [],
      city_list: [],
      area_list: [],
      activeState: '0',
      visibleOfSoDeliveryImportModal: false,
      searchForm: getDefaultSearchForm(vue),
      loading: false,
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      operates: {
        fixed: 'right',
        list: [
          {
            label: this.$t('soPickDeliver'),
            method(index, row) {
              vue.forwardToDelivery(row)
            },
            hidden(index, row) {
              return row.deliverStatus > '5020'
            },
            code: 'OmsSoPickDelivery_Confirm'
          },
          {
            label: this.$t('syncOrderStatus'),
            method(index, row) {
              vue.syncOuterOrderStatus(row)
            },
            hidden(index, row) {
              return row.sysSource !== '210001' || row.orderStatus < '1060'
            },
            code: 'OmsSoPickDelivery_Confirm'
          }
        ]
      },
      columns: [
        {
          show: true,
          prop: 'orderCode',
          label: this.$t('do_order_code'),
          align: 'center',
          minWidth: 140,
          render: (h, params) => {
            return (
              <ToOrderDetail
                orderCode={params.row.orderCode}
                orderSource={params.row.orderSource}
                sysSource={params.row.sysSource}
              >
                <span>{params.row.orderCode}</span>
              </ToOrderDetail>
            )
          }
        },
        {
          show: true,
          prop: 'orderStatusStr',
          label: this.$t('orderStatus'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'orderCreateTime',
          label: this.$t('so_error_order_create_time'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'deliverStatusStr',
          label: this.$t('so_pick_deliver_status'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'outOrderCode',
          label: this.$t('outOrderCode'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'pickUserName',
          label: this.$t('so_pick_picker'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'storeName',
          label: this.$t('do_store_name'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('do_merchant_name'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'sysSourceStr',
          label: this.$t('manual_order_order_syssource'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'goodReceiverInfo',
          label: this.$t('good_receiver_info'),
          align: 'center',
          minWidth: 300,
          render: (h, params) => {
            const item = params.row
            if (
              item.goodReceiverName == null &&
              item.goodReceiverMobile == null
            ) {
              return (
                <div>
                  <div>
                    {this.$t('common_addAddress') + ': '}{' '}
                    {item.goodReceiverProvince}
                    {item.goodReceiverCity}
                    {item.goodReceiverArea}
                    {item.goodReceiverAddress}
                  </div>
                </div>
              )
            } else {
              return (
                <div>
                  <div>
                    {this.$t('do_good_receiver_name') + ': '}{' '}
                    {item.goodReceiverName} {this.$t('common_mobile') + ': '}{' '}
                    {item.goodReceiverMobile}
                  </div>
                  <div>
                    {this.$t('common_addAddress') + ': '}{' '}
                    {item.goodReceiverProvince}
                    {item.goodReceiverCity}
                    {item.goodReceiverArea}
                    {item.goodReceiverAddress}
                  </div>
                </div>
              )
            }
          }
        },
        {
          show: true,
          prop: 'userName',
          label: this.$t('so_error_create_username'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'deliveryName',
          label: this.$t('manual_order_delivery_type'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'deliveryCompanyName',
          label: this.$t('so_pick_delivery_merchant'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'estimatedTimeOfArrival',
          label: this.$t('so_pick_arrival_time'),
          align: 'center',
          minWidth: 120
        }
      ],
      exportModal: {
        show: false,
        taskCode: null,
        taskType: '10',
        filters: {},
        columns: [
          {
            show: true,
            prop: 'id',
            label: this.$t('task_number'),
            align: 'left',
            minWidth: 120
          }, {
            show: true,
            prop: 'taskTypeStr',
            label: this.$t('task_type'),
            align: 'left',
            minWidth: 80
          }, {
            show: true,
            prop: 'createUsername',
            label: this.$t('operation_people'),
            align: 'left',
            minWidth: 100
          }, {
            show: true,
            prop: 'taskActionTypeStr',
            label: this.$t('operation_type'),
            align: 'left',
            minWidth: 80
          }, {
            show: true,
            prop: 'taskStatusStr',
            label: this.$t('task_state'),
            align: 'left',
            minWidth: 80
          }, {
            show: true,
            prop: 'startTime',
            label: this.$t('task_start_time'),
            align: 'left',
            minWidth: 140
          }, {
            show: true,
            prop: 'finishTime',
            label: this.$t('task_end_time'),
            align: 'left',
            minWidth: 140
          }, {
            show: true,
            prop: 'count',
            label: this.$t('taskCount'),
            align: 'left',
            minWidth: 170,
            formatter: (row, column) => {
              const totalCount = (typeof row.totalCount !== 'undefined' && row.totalCount !== null) ? row.totalCount : '-'
              const failedCount = (typeof row.failedCount !== 'undefined' && row.failedCount !== null) ? row.failedCount : '-'
              const successCount = (typeof row.successCount !== 'undefined' && row.successCount !== null) ? row.successCount : '-'
              return totalCount + ' / ' + successCount + ' / ' + failedCount
            }
          }, {
            show: true,
            prop: 'failedReason',
            label: this.$t('data_import_failed_reason'),
            align: 'left',
            minWidth: 200
          }
        ],
        operates: {
          width: 80,
          align: 'right',
          fixed: 'right',
          list: [
            {
              label: this.$t('common_export'),
              hidden(index, row) {
                return !(row.taskActionType === 2 && row.taskStatus === 4)
              },
              method(index, row) {
                vue.$portal.downloadFileByGet(row.filePath, {}, row.fileName)
              },
              code: 'ui'
            },
            {
              label: this.$t('common_export'),
              hidden(index, row) {
                return !(row.taskActionType === 1 && row.failedCount && row.failedCount > 0) || !row.filePath
              },
              method(index, row) {
                vue.$portal.downloadFileByGet(row.filePath, {}, row.fileName)
              },
              code: 'ui'
            }
          ]
        }
      }
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
    forwardToDelivery(row) {
      /** 跳转到发货确认页面 */
      this.$router.push({
        name: 'OmsSoPickDeliveryDetail',
        query: { id: row.id }
      })
    },
    handleOk(item) {
      this.updateList()
    },
    async handleTabsClick() {
      try {
        this.currentTab = this.tabs[Number(this.activeState)]
        this.searchForm.deliverStatus = this.currentTab.deliverStatus
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
    handleSearchReset() {
      const vue = this
      const deliverStatus = this.searchForm.deliverStatus
      this.searchForm = getDefaultSearchForm(vue)
      this.searchForm.deliverStatus = deliverStatus
    },
    handlePageSizeChange(size) {
      this.handleSearchSubmit()
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    importDelivery() {
      // 导入物流单模态框
      this.visibleOfSoDeliveryImportModal = true
    },
    handleImportSuccess(taskCode) {
      this.$alert(
        this.$t('importPromptInfoSuccess') +
        taskCode +
        this.$t('importPromptInfoConfirm'),
        this.$t('common_import'),
        {
          confirmButtonText: this.$t('common_confirm_search'),
          callback: action => {
            this.openOrderTaskList(taskCode)
          }
        }
      )
    },
    openOrderTaskList(taskCode) { // 显示task
      this.exportModal.taskCode = taskCode
      this.exportModal.show = true
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
      const vue = this
      this.$oms.$api.distributionModeItem
        .distributionModeItemListForSelect({})
        .then(data => {
          vue.distributionModeItems = data.data
        })
    },
    loadWarehouseByMerchant() {
      const vue = this
      vue.searchForm.warehouseId = null
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
    _initCodes() {
      const vue = this
      this.$oms.$api.common
        .listByCategorysForOrder({ categorys: ['DELIVER_STATUS'] })
        .then(data => {
          if (data.data.DELIVER_STATUS) {
            data.data.DELIVER_STATUS.forEach((code, index) => {
              vue.tabs.push({
                heading: code.name,
                index: index + 2,
                deliverStatus: code.code
              })
            })

            vue.deliverStatusMap = data.data.DELIVER_STATUS.reduce((m, i) => {
              m[i['code']] = i['name']
              return m
            }, {})
          }
        })
    },
    init() {
      this.tabs = [
        {
          heading: this.$t('common_all'),
          index: 1,
          deliverStatus: ''
        }
      ]
      this._initCodes()
      this._initAllChannels()
      this._initMerchants()
      this._initDistributionModeItem()
      this.loadWarehouseByMerchant()
      this.queryAera('100000', 1)
      this.updateList()
    },
    syncOuterOrderStatus(row) {
      const vue = this
      vue.$oms.$api.so
        .soSyncPackageDelivery({ orderCode: row.orderCode })
        .then(res => {
          if (res && res.code === '0') {
            vue.$message.success(vue.$t('promptOperateSuccess'))
          }
        })
    }
  }
}
async function loadList(vue) {
  const filters = JSON.parse(JSON.stringify(vue.searchForm))
  if (filters.estimatedTimeOfArrival) {
    filters.estimatedTimeOfArrivalStart = filters.estimatedTimeOfArrival[0]
    filters.estimatedTimeOfArrivalEnd = filters.estimatedTimeOfArrival[1]
    delete filters.estimatedTimeOfArrival
  }
  if (filters.createTime) {
    filters.createTimeMinStr = filters.createTime[0] + ' 00:00:00'
    filters.createTimeMaxStr = filters.createTime[1] + ' 23:59:59'
    delete filters.createTime
  }
  const param = {
    filters: filters,
    limit: vue.page.size,
    page: vue.page.current
  }
  const soPick = vue.$oms.$api.soPick

  const res = await soPick.soPickListPage(param)
  if (res) {
    const data = res.data
    vue.list = data
    vue.page.total = res.total
  }
}

function getDefaultSearchForm(vue) {
  const currentDate = new Date()
  const lastWeek = new Date()
  lastWeek.setDate(lastWeek.getDate() - 7)
  return Object.assign(
    {},
    {
      goodReceiverProvinceCode: null,
      goodReceiverCityCode: null,
      goodReceiverAreaCode: null,
      deliverStatus: null,
      warehouseId: null,
      supplierName: null,
      createTime: [
        vue.$portal.parseTime(lastWeek, '{y}-{m}-{d}'),
        vue.$portal.parseTime(currentDate, '{y}-{m}-{d}')
      ]
    }
  )
}
</script>

<style lang="scss" scoped>
</style>
