<template>
  <div class="">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search">
          <ody-search-item :label="$t('仓库编码') + ':'" prop="warehouseCode">
            <el-input v-model="search.warehouseCode" name="search_warehouseCode" />
          </ody-search-item>
          <ody-search-item :label="$t('仓库名称') + ':'" prop="warehouseName">
            <el-input v-model="search.warehouseName" name="search_warehouseName" />
          </ody-search-item>
          <ody-search-item :label="$t('商家') + ':'" prop="merchantId">
            <ody-merchant-select ref="selectMerchant" v-model="search.merchantId" name="search_merchantId" value-key="merchantId"/>
          </ody-search-item>
          <ody-search-item :label="$t('仓库地址') + ':'" prop="area">
            <ody-province-city-region-select v-model="search.area" name="search_area" />
          </ody-search-item>
          <ody-search-item :label="$t('仓库类型') + ':'" prop="warehouseType">
            <ody-select2
              v-model="search.warehouseType"
              name="search_warehouseType"
              list-key="warehouseTypes"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('重置') }}</el-button>
        <ody-button name="StoreWarehouseManageListQuery" code="StoreWarehouseManageListQuery" size="small" type="primary" @click.prevent="handleSearchSubmit">
          {{ $t('查询') }}
        </ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="StoreWarehouseManageAdd_handleAddWarehouse" code="StoreWarehouseManageAdd" size="small" type="primary" @click="handleAddWarehouse">
          {{ $t('新增') }}
        </ody-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          request-url="/back-product-web/back/stock/storeWarehouse/listStoreWarehouseWithPage.do"
        >
          <template slot="merchantName" slot-scope="scope">
            {{ scope.row.merchantId | keyVal(getMerchantName) }}
          </template>
          <template slot="address" slot-scope="scope">
            {{ getAddress(scope.row.provinceCode, scope.row.cityCode, scope.row.districtCode) }}
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
  </div>
</template>

<script>

export default {
  name: 'StoreWarehouseManageList',
  components: {
  },
  data() {
    return {
      search: {
        warehouseCode: '',
        warehouseName: '',
        merchantId: '',
        area: [],
        warehouseType: ''
      },
      table: {
        columns: [
          {
            label: '仓库编码',
            prop: 'warehouseCode',
            show: true
          },
          {
            label: '仓库名称',
            prop: 'warehouseName',
            show: true,
            minWidth: 200
          },
          {
            label: '仓库类型',
            prop: 'showWarehouseType',
            show: true
          },
          {
            label: '商家',
            slot: 'merchantName',
            show: true
          },
          {
            label: '仓库地址',
            slot: 'address',
            minWidth: 200,
            show: true
          },
          {
            label: '仓库负责人',
            prop: 'warehouseContacter',
            show: true
          },
          {
            label: '负责人电话',
            prop: 'warehouseContacterMobile',
            show: true
          }
        ],
        operates: {
          width: 200,
          fixed: 'right',
          list: [
            {
              label: '编辑',
              method: (index, row) => {
                this.$router.push({
                  name: 'StoreWarehouseManageEdit',
                  params: {
                    id: row.id,
                    merchantId: row.merchantId,
                    warehouseType: row.warehouseType,
                    status: 1
                  }
                })
              },
              code: 'StoreWarehouseManageEdit'
            },
            {
              label: '库存同步规则',
              hidden: (index, row) => {
                return !(row.syncRule === '1' || row.warehouseType === 1)
              },
              method: (index, row) => {
                this.$router.push({
                  name: 'StoreWarehouseManageMapping', // warehouseId/:merchantId/:warehouseType
                  params: {
                    warehouseId: row.id,
                    merchantId: row.merchantId,
                    warehouseType: row.warehouseType,
                    warehouseName: row.warehouseName,
                    warehouseCode: row.warehouseCode
                  }
                })
              },
              code: 'StoreWarehouseManageListMapping'
            }
          ]
        }
      },
      areaList: []
    }
  },
  computed: {
    getMerchantName() {
      return this.$refs.selectMerchant.$refs.select2.options.reduce((rtv, item) => {
        rtv[item.merchantId] = item.merchantName
        return rtv
      }, {})
    }
  },
  async mounted() {
    this.areaList = await this.getAreaList()
    await this.query()
  },
  methods: {
    handleAddWarehouse() {
      this.$router.push({
        name: 'StoreWarehouseManageAdd',
        params: {
          status: 0
        }
      })
    },
    async getAreaList() {
      const { data = [] } = await this.$product.$api.common.areaList({
        parentCode: 100000
      })
      return data
    },
    getAddress(provinceCode, cityCode, districtCode) {
      if (!(provinceCode && cityCode && districtCode)) {
        return ''
      }

      const provinceList = this.areaList
      const rtv = []

      const province = provinceList.find(x => {
        return x.code === provinceCode
      })
      rtv.push(province.name)

      const cityList = province.children
      const city = cityList.find(x => {
        return x.code === cityCode
      })
      if (city && city.name) {
        rtv.push(city.name)
      }
      let district = null
      if (city && city.children) {
        const districtList = city.children
        district = districtList.find(x => {
          return x.code === districtCode
        })
      }
      if (district && district.name) {
        rtv.push(district.name)
      }

      return rtv.join('')
    },
    query() {
      // console.log(this.query)
      const { area: [provinceCode, cityCode, districtCode], ...params } = this.search

      params.provinceCode = provinceCode
      params.cityCode = cityCode
      params.districtCode = districtCode
      params.isVirtualWarehouse = 0

      return this.$refs.table.getList(this.formHasValue(params))
    },
    handleSearchReset() {
      this.formReset('search')
    },
    async handleSearchSubmit() {
      const [err] = await this.formValidate('search')

      if (err) {
        return
      }

      await this.query()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
