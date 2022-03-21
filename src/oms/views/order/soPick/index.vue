<template>
  <section class="pg-soPick-list">
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
          <ody-search-item :label="$t('order_create_time')" class="register" prop="createTime">
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
          <ody-search-item :label="$t('so_pick_arrival_time')" class="register" prop="estimatedTimeOfArrival">
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
        <ody-button name="OmsSoPick_Reset_handleSearchReset" code="OmsSoPick_Reset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</ody-button>
        <ody-button
          name="OmsSoPick_Query_handleSearchSubmit"
          code="OmsSoPick_Query"
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
      </div>
      <div slot="table">
        <ody-table :loading="loading" :data="list" :columns="columns" :operates="operates" name="list664" />
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
    <SoPick :visible.sync="visible" :selected-item.sync="selectedItem" @ok="handleOk" />
  </section>
</template>

<script>
import SoPick from '@/components/soPick'
import ToOrderDetail from '@/components/so/toDetail'

export default {
  name: 'OmsSoPick',
  components: {
    SoPick,
    ToOrderDetail
  },
  data() {
    const self = this
    return {
      visible: false,
      selectedItem: null,
      merchants: [],
      warehouseList: [],
      allChannels: {},
      distributionModeItems: [],
      province_list: [],
      city_list: [],
      area_list: [],
      activeState: '0',
      searchForm: getDefaultSearchForm(self),
      loading: false,
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      operates: {
        width: 150,
        fixed: 'right',
        list: [
          {
            label: this.$t('pickUser'),
            hidden: (index, row) => {
              return row.pickStatus !== '5000'
            },
            method: (index, row) => {
              this.showPickerUser(row)
            },
            code: 'OmsSoPick_PickUser'
          }
        ]
      },
      columns: [
        {
          show: true,
          prop: 'orderCode',
          label: this.$t('orderCode'),
          align: 'center',
          minWidth: 160,
          render: (h, params) => {
            return (
              <ToOrderDetail order-code={params.row.orderCode}>
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
          prop: 'pickDate',
          label: this.$t('so_pick_pick_date'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'pickCompleteDate',
          label: this.$t('so_pick_complete_date'),
          align: 'center',
          minWidth: 120
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
            return (
              <div>
                <div>
                  {this.$t('do_good_receiver_name') + ': '}{' '}
                  {item.goodReceiverName} {this.$t('common_mobile') + ': '}{' '}
                  {item.goodReceiverMobile}
                </div>
                <div>
                  {this.$t('common_addAddress') + ': '}{' '}
                  {item.goodReceiverProvince +
                    item.goodReceiverCity +
                    item.goodReceiverArea +
                    item.goodReceiverAddress}
                </div>
              </div>
            )
          }
        },
        {
          show: true,
          prop: 'userName',
          label: this.$t('so_error_create_username'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'deliveryName',
          label: this.$t('manual_order_delivery_type'),
          align: 'center',
          minWidth: 80
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
    showPickerUser(row) {
      this.visible = true
      this.selectedItem = row
    },
    handleOk(item) {
      console.info('选择的拣货员' + JSON.stringify(item))
      this.updateList()
    },
    async handleTabsClick() {
      try {
        this.currentTab = this.tabs[this.activeState]
        this.searchForm.pickStatus = this.currentTab.pickStatus
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
      const pickStatus = this.searchForm.pickStatus
      this.searchForm = getDefaultSearchForm(this)
      this.searchForm.pickStatus = pickStatus
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
        .listByCategorysForOrder({ categorys: ['PICK_STATUS'] })
        .then(data => {
          if (data.data.PICK_STATUS) {
            data.data.PICK_STATUS.forEach((code, index) => {
              vue.tabs.push({
                heading: code.name,
                index: index + 2,
                pickStatus: code.code
              })
            })

            vue.pickStatusMap = data.data.PICK_STATUS.reduce((m, i) => {
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
          pickStatus: ''
        }
      ]
      this._initCodes()
      this._initAllChannels()
      this._initMerchants()
      this._initDistributionModeItem()
      this.loadWarehouseByMerchant()
      this.queryAera('100000', 1)
      this.updateList()
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
      pickStatus: null,
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
