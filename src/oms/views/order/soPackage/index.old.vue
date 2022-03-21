<template>
  <section class="pg-soPackage-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('do_do_code')" prop="doCode">
            <el-input v-model="searchForm.doCode" name="searchForm_doCode" maxlength="25" />
          </ody-search-item>
          <ody-search-item :label="$t('do_order_code')" prop="orderCode">
            <el-input v-model="searchForm.orderCode" name="searchForm_orderCode" maxlength="25" />
          </ody-search-item>
          <ody-search-item :label="$t('packageCode')" prop="packageCode">
            <el-input v-model="searchForm.packageCode" name="searchForm_packageCode" maxlength="25" />
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
          <ody-search-item :label="$t('so_pick_delivery_merchant')" prop="deliveryCompanyId">
            <el-select v-model="searchForm.deliveryCompanyId" :placeholder="$t('common_all')" name="searchForm_deliveryCompanyId">
              <el-option
                v-for="item in merchantTypeList"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('deliveryExpressNo')" prop="deliveryExpressNbr">
            <el-input v-model="searchForm.deliveryExpressNbr" name="searchForm_deliveryExpressNbr" maxlength="25" />
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
          <ody-search-item :space="3" :label="$t('do_good_receiver_address')" prop="goodReceiverProvinceCode">
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
          </ody-search-item>
          <ody-search-item :label="$t('do_good_receiver_mobile')" prop="goodReceiverMobile">
            <el-input v-model="searchForm.goodReceiverMobile" name="searchForm_goodReceiverMobile" />
          </ody-search-item>
          <ody-search-item :space="2" :label="$t('deliverytime')" class="register" prop="deliverytime">
            <el-date-picker
              v-model="searchForm.deliverytime"
              name="searchForm_deliverytime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="daterange"
              range-separator="-"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_select') }}</el-button>
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="false"
          :operates="operates"
          name="list330"
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
            @current-change="handlePageCurrentChange"
          />
        </div>
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>
export default {
  name: 'OmsParcelOldList',
  data() {
    return {
      merchants: [],
      warehouseList: [],
      allChannels: {},
      merchantTypeList: [],
      distributionModeItems: [],
      province_list: [],
      packageStatus: [],
      city_list: [],
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
      goodReceiverAddressAll: '',

      columns: [
        {
          show: true,
          prop: 'packageCode',
          label: this.$t('packageCode'),
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            // return (
            //   <router-link to={() => {
            //     this.forwardToDelivery(params.row)
            //   }}>
            //     <span>{ params.row.orderCode}</span>
            //   </router-link>
            // )
            return (
              <a
                on-click={() => {
                  this.forwardToDelivery(params.row)
                }}
              >
                <span style='color:blue'>{params.row.orderCode}</span>
              </a>
            )
          }
        },
        {
          show: true,
          prop: 'packageStatusStr',
          label: this.$t('packageStatus'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'orderDeliveryMethodIdStr',
          label: this.$t('do_delivery_method'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'deliveryCompanyName',
          label: this.$t('so_pick_delivery_merchant'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'deliveryExpressNbr',
          label: this.$t('deliveryExpressNo'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'doCode',
          label: this.$t('do_do_code'),
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'doStatusStr',
          label: this.$t('do_do_status'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'orderCode',
          label: this.$t('orderCode'),
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('do_merchant_name'),
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'storeName',
          label: this.$t('do_store_name'),
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'warehouseName',
          label: this.$t('do_warehouse'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'goodReceiverName',
          label: this.$t('manual_order_receiver_name'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'goodReceiverMobile',
          label: this.$t('deliveryMobile'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'goodReceiverAddressAll',
          label: this.$t('goodReceiverAddress'),
          align: 'center',
          minWidth: 200
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
    forwardToDelivery(row) {
      /** 跳转到发货确认页面 */
      this.$router.push({
        name: 'OmsParcelListDetail',
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
    },
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
        await this.updateList()
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
  if (filters.deliverytime) {
    filters.startDeliverytime = filters.deliverytime[0]
    filters.endDeliverytime = filters.deliverytime[1]
    delete filters.deliverytime
  }
  const param = {
    filters: filters,
    limit: vue.page.size,
    page: vue.page.current
  }
  const soPackage = vue.$oms.$api.soPackage

  const res = await soPackage.parcelListListPage(param)
  if (res) {
    const data = res.data
    data.forEach(item => {
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

function getDefaultSearchForm() {
  return Object.assign(
    {},
    {
      goodReceiverProvinceCode: null,
      goodReceiverCityCode: null,
      goodReceiverAreaCode: null
    }
  )
}
</script>

<style lang="scss" scoped>
</style>
