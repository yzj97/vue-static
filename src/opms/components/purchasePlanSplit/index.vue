<template>
  <section class="pg-purchasePlanCollect-list">
    <el-form ref="purchasePlanSplit" :model="purchasePlanSplit" :rules="rules">
      <div>
        <ody-dialog
          :visible="visible"
          :before-close="handleClose"
          :title="$t('purchase_plan_batch_handle')"
          width="80%"
          @open="init"
        >
          <el-card>
            <div slot="title">{{ $t('purchase_plan_batch_handle') }}</div>
            <el-form-item :label="$t('split_ratio')" size="small">
              <el-col :span="1">
                <el-input v-model="splitStartNum" name="splitStartNum" type="text" el-row="30px"/>
              </el-col>
              <el-col :span="1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</el-col>
              <el-col :span="1">
                <el-input v-model="splitEndNum" name="splitEndNum" type="text"/>
              </el-col>&nbsp;
              <ody-button name="splitHandle" size="small" type="primary" @click="splitHandle">{{ $t('split') }}</ody-button>
              <el-select v-model="batchSetType" name="batchSetType">
                <el-option :label="$t('purchase_request_order_costTaxRate')" :value="1" />
                <el-option :label="$t('contract_modeTransport')" :value="2" />
                <el-option :label="$t('purchase_wi_tax_price')" :value="3" />
                <el-option :label="$t('price_wi_tax')" :value="4" />
                <el-option :label="$t('service_fee_type')" :value="5" />
                <el-option :label="$t('service_fee_value')" :value="6" />
                <el-option :label="$t('purchaseOrder_product_minCount')" :value="7" />
              </el-select>
              <el-select v-model="batchSetValue" name="batchSetValue">
                <el-option :label="$t('common_choose_please')" :value="1" />
              </el-select>
              <ody-button name="splitHandle4" size="small" type="primary" @click="splitHandle">{{ $t('purchase_plan_batch_option') }}</ody-button>
            </el-form-item>
          </el-card>
          <ody-list-table-area>
            <div slot="tabs">
              <el-tabs v-model="activeState" name="activeState" @tab-click="handleTabsClick" >
                <el-tab-pane v-for="tab in tabs" :label="tab.heading" :key="tab.index" />
              </el-tabs>
            </div>
            <div slot="table">
              <ody-table
                :loading="loading"
                :data="list"
                :columns="columns"
                :operates="operates"
                name="list525"
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
          <span slot="footer" class="dialog-footer">
            <ody-button
              :disabled="subBut === 1"
              name="saveSplit"
              type="primary"
              @click="saveSplit"
            >{{ $t('common_save') }}</ody-button>
            <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
          </span>
        </ody-dialog>
      </div>
    </el-form>
  </section>
</template>

<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    planList: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedItem: null,
      merchants: [],
      searchForm: getDefaultSearchForm(),
      loading: false,
      batchSetType: '',
      batchSetValue: '',
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },

      columns: [
        {
          show: true,
          prop: 'code',
          label: this.$t('common_product_code'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'productCName',
          label: this.$t('common_product_name'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'productModel',
          label: this.$t('common_product_model'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'calculationUnitCode',
          label: this.$t('common_mp_unit'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'planTypeStr',
          label: this.$t('purchase_plan_type'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'planStartDate',
          label: this.$t('plan_start_date'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'planEndDate',
          label: this.$t('plan_end_date'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'collectPurchaseNum',
          label: this.$t('collect_purchase_num'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'settlementTargetStr',
          label: this.$t('settlement_target'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('common_merchant_name'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'approvalPurchaseNum', // todo
          label: this.$t('approval_purchase_num'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'expectReceiveDate',
          label: this.$t('expect_receive_date'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'defaultSupplierName',
          label: this.$t('assign_supplier_name'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'approvedPurchaseNum',
          label: this.$t('mp_count'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'minOrderQuantity',
          label: this.$t('purchaseOrder_product_minCount'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'taxRate',
          label: this.$t('purchase_request_order_costTaxRate'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'priceWiTax', // todo 含税协议价
          label: this.$t('price_wi_tax'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'priceWOTax', // todo 未税协议价
          label: this.$t('price_wo_tax'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'serviceFeeType', // todo 加价方式
          label: this.$t('service_fee_type'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'serviceFeeValue', // todo 加价数值
          label: this.$t('service_fee_value'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'purchaseWiTaxPrice',
          label: this.$t('purchase_wi_tax_price'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'purchaseWoTaxPrice',
          label: this.$t('purchase_wo_tax_price'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'includingShippingFee',
          label: this.$t('including_shipping_fee'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'shippingMethodStr',
          label: this.$t('contract_modeTransport'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'paymentPeriodDay',
          label: this.$t('payment_period'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'planCode',
          label: this.$t('purchase_plan_code'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'executionStatusStr',
          label: this.$t('contract_implementation'),
          align: 'center',
          minWidth: 80
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
    handleOk(item) {
      console.info('选择的拣货员' + JSON.stringify(item))
      this.updateList()
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.visible = false
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
    async handlePageSizeChange(size) {
      try {
        this.$nextTick(function() {
          this.updateList()
        })
      } catch (ex) {
        console.log(ex)
      }
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
      this.$oms.$api.common.getAreaListNoPaging({ filters: filtersForAera }).then((data) => {
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
      this.$oms.$api.common.listAllChannels({ }).then((data) => {
        vue.allChannels = data.data
      })
    },
    _initMerchants() {
      const vue = this
      this.$oms.$api.common.merchantList({ 'currentPage': 1, 'itemsPerPage': 1000 }).then((data) => {
        vue.merchants = data.data.listObj
      })
    },
    _initDistributionModeItem() {
      const vue = this
      this.$oms.$api.distributionModeItem.distributionModeItemListForSelect({}).then((data) => {
        vue.distributionModeItems = data.data
      })
    },
    loadWarehouseByMerchant() {
      const vue = this
      if (!vue.searchForm.merchantId) {
        vue.warehouseList = []
      } else {
        this.$oms.$api.common.listStoreWarehouse({ 'isVirtualWarehouse': 0, 'merchantId': vue.searchForm.merchantId }).then((data) => {
          vue.warehouseList = data.data
        })
      }
    },
    _initCodes() {
      const vue = this
      this.$oms.$api.common.listByCategorysForOrder({ 'categorys': ['PICK_STATUS'] }).then((data) => {
        if (data.data.PICK_STATUS) {
          data.data.PICK_STATUS.forEach((code, index) => {
            vue.tabs.push({
              heading: code.name,
              index: index + 2,
              pickStatus: code.code
            })
          })

          vue.pickStatusMap = data.data.PICK_STATUS.reduce((m, i) => { m[i['code']] = i['name']; return m }, {})
        }
      })
    },
    init() {
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
    filters.createTimeMinStr = filters.createTime[0]
    filters.createTimeMaxStr = filters.createTime[1]
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

function getDefaultSearchForm() {
  const currentDate = new Date()
  const lastWeek = new Date()
  lastWeek.setDate(lastWeek.getDate() - 7)

  return Object.assign({}, {
    goodReceiverProvinceCode: null,
    goodReceiverCityCode: null,
    goodReceiverAreaCode: null,
    pickStatus: null,
    createTime: [
      lastWeek,
      currentDate
    ]
  })
}
</script>

<style lang="scss" scoped>

</style>
