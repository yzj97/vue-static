<template>
  <section class="fitting-manage-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="searchForm">
          <ody-search-item :label="$t('拟合编码') + ':'" prop="warehouseCode">
            <el-input v-model="searchForm.warehouseCode" name="searchForm_warehouseCode" />
          </ody-search-item>
          <ody-search-item :label="$t('拟合仓名称') + ':'" prop="warehouseName">
            <el-input v-model="searchForm.warehouseName" name="searchForm_warehouseName" />
          </ody-search-item>
          <ody-search-item :label="$t('商家') + ':'" prop="merchantId">
            <el-select v-model="searchForm.merchantId" :placeholder="$t('请选择商家')" :popper-append-to-body="false" name="searchForm_merchantId">
              <el-option
                v-for="item in merchantList"
                :key="item.merchantId"
                :label="item.merchantName"
                :value="item.merchantId"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="StockFittingHouseManagePageQuery_handleSearchSubmit"
          size="small"
          type="primary"
          code="StockFittingHouseManagePageQuery"
          @click="handleSearchSubmit"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <el-button
          name="StockFittingHouseManageAdd_addFittingHouse"
          size="small"
          type="primary"
          code="StockFittingHouseManageAdd"
          @click="addFittingHouse"
        >{{ $t('新增拟合仓') }}</el-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :multiple="true"
          :columns="columns"
          :can-filter="false"
          :request-url="'back-product-web/back/stock/storeWarehouse/listStoreWarehouseWithPage.do'"
        >
          <template slot="warehouseCode" slot-scope="scope">
            <el-button
              name="handleGoTo"
              type="text"
              class="fitting-code"
              @click="handleGoTo(scope.row)"
            >{{ scope.row.warehouseCode }}</el-button>
          </template>
          <template
            slot="updateTime"
            slot-scope="scope"
          >{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <fitting-house-modal :visible.sync="visible" :fitting-id.sync="fittingId" @ok="handleOk" />
  </section>
</template>

<script>
import fittingHouseModal from '@/components/fittingHouseModal'

export default {
  name: 'StockFittingHouseManage',
  components: {
    fittingHouseModal
  },
  props: {},
  data() {
    const self = this
    return {
      merchantList: [],
      merchantMap: {},
      fittingId: '',
      visible: false,
      searchForm: this.getDefaultSearchForm(),
      columns: [
        {
          show: true,
          slot: 'warehouseCode',
          label: this.$t('拟合编码')
        },
        {
          show: true,
          prop: 'warehouseName',
          label: this.$t('拟合仓名称'),
          minWidth: 200
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('商家'),
          formatter: (row, column) => {
            if (row.merchantId) {
              const merchant = self.merchantMap[row.merchantId]
              if (merchant) {
                return merchant.merchantName
              }
            }
            return ''
          }
        },
        {
          show: true,
          slot: 'updateTime',
          label: this.$t('最后修改时间'),
          minWidth: 200
        }
      ]
    }
  },
  async mounted() {
    try {
      this.loading = true
      await this.queryPlatformAuthMerchantPage()
      await this.handleSearchSubmit()
    } finally {
      this.loading = false
    }
  },
  methods: {
    handleGoTo(row) {
      if (this.$portal.hasPermission('StockFittingHouseManageEdit')) {
        this.visible = true
        this.fittingId = row.id
      }
    },
    handleOk() {
      this.handleSearchSubmit()
    },
    addFittingHouse() {
      this.visible = true
    },
    async queryPlatformAuthMerchantPage() {
      const res = await this.$product.$api.merchantApi.queryPlatformAuthMerchantPage(
        {
          currentPage: 1,
          itemsPerPage: 1000
        }
      )

      if (res.code === '0') {
        this.merchantList = (res.data && res.data.listObj) || []

        this.merchantMap = this.merchantList.reduce((r, i) => {
          r[i.merchantId] = i
          return r
        }, {})
      }
    },
    async handleSearchSubmit() {
      await this.$refs.table.getList(this.searchForm)
    },
    handleSearchReset() {
      this.$refs.search.resetFields()
      this.handleSearchSubmit()
    },
    getDefaultSearchForm() {
      return Object.assign(
        {},
        {
          warehouseCode: '',
          warehouseName: '',
          merchantId: '',
          isVirtualWarehouse: 1
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.fitting-manage-list {
  .fitting-code {
    color: #409eff !important;
  }
}
</style>
