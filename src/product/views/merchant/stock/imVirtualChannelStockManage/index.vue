<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('merchant_name')+':'" prop="merchantId">
            <ody-merchant-choose v-model="search.merchantId" name="search_merchantId" placeholder="请选择" value-key="merchantId" @ok="changeMerchant"/>
          </ody-search-item>
          <ody-search-item :label="$t('virtual_merge_warehouse')+':'" prop="warehouseId">
            <el-select v-model="search.warehouseId" name="search_warehouseId">
              <el-option
                v-for="(item,index) in warehouseList"
                :key="index"
                :label="item.warehouseName"
                :value="item.id"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('shop')+':'" prop="storeId">
            <el-select v-model="search.storeId" name="search_storeId">
              <el-option
                v-for="(item,index) in storeList"
                :key="index"
                :label="item.storeName"
                :value="item.storeId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('product_code')+':'" prop="code">
            <el-input v-model="search.code" name="search_code" />
          </ody-search-item>
          <ody-search-item :label="$t('product_name')+':'" prop="chineseName">
            <el-input v-model="search.chineseName" name="search_chineseName" />
          </ody-search-item>
          <ody-search-item :label="$t('in_warehouse_type')+':'" prop="warehouseType">
            <el-select v-model="search.warehouseType" name="search_warehouseType">
              <el-option :value="null" :label="$t('全部')" />
              <el-option :value="'0'" :label="$t('入仓')" />
              <el-option :value="'1'" :label="$t('不入仓')" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('Totalstock')+':'" prop="virtualStockNumArray">
            <ody-number-range
              v-model="virtualStockNumArray"
              :link-string="$t('to')"
              name="virtualStockNumArray"
              range="[0,1000000)"
              input-width="100"
              style="width:102.3%"
            />
          </ody-search-item>
          <ody-search-item :label="$t('Availablestock')+':'" prop="virtualAvailableStockNumArray">
            <ody-number-range
              v-model="virtualAvailableStockNumArray"
              :link-string="$t('to')"
              name="virtualAvailableStockNumArray"
              range="[0,1000000)"
              input-width="100"
              style="width:102.3%"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('reset') }}</el-button>
        <ody-button
          name="ImVirtualChannelStockManageQuery_handleSelect"
          size="small"
          type="primary"
          code="ImVirtualChannelStockManageQuery"
          @click="handleSelect"
        >{{ $t('query') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          name="ImVirtualChannelStockManageExport_download"
          code="ImVirtualChannelStockManageExport"
          size="small"
          class="btn-right"
        >{{ $t('export') }}</ody-batch-export-button>
        <ody-export-task-button
          pool="product"
          task-type="imVirtualChannelStockExport"
          name="ImVirtualChannelStockManageViewTask_downloadTaskVisible"
          code="ImVirtualChannelStockManageViewTask"
          size="small"
          class="btn-right"
        >{{ $t('查看任务') }}</ody-export-task-button>
      </div>
      <div slot="table">
        <el-table v-loading="loading" :data="tableList" name="tableList314" style="width: 100%">
          <el-table-column :label="$t('Merchant')" prop="merchantName" min-width="200" />
          <el-table-column :label="$t('shop')" prop="storeName" min-width="200" />
          <el-table-column
            :label="$t('virtual_merge_warehouse')"
            prop="warehouseName"
            min-width="200"
          />
          <el-table-column :label="$t('product_code')" prop="code" width="200" />
          <el-table-column :label="$t('product_name')" prop="chineseName" min-width="124" />
          <el-table-column
            :label="$t('in_warehouse_type')"
            prop="chineseWarehouseType"
            min-width="124"
          />
          <el-table-column
            :label="$t('measurement_unit')"
            prop="mainUnit"
            min-width="124"
          />
          <el-table-column
            :label="$t('Totalstock')"
            prop="virtualStockNum"
          />
          <el-table-column
            :label="$t('Frozenstock')"
            prop="freezeStockNum"
            min-width="124"
          />
          <el-table-column
            :label="$t('锁定库存')"
            prop="lockingStockNum"
            min-width="124"
          />
          <el-table-column
            :label="$t('Availablestock')"
            prop="virtualAvailableStockNum"
            min-width="124"
          />
        </el-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page="page.current"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="page.size"
          :total="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="page.handleSizeChange"
          @current-change="page.handleCurrentChange"
        />
      </div>
    </ody-list-table-area>

    <download-task :task-type="'imVirtualChannelStockExport'" :visible.sync="downloadTaskVisible" />
  </section>
</template>

<script>
import DownloadTask from '@/components/downloadTask/index'
const search = {
  merchantId: null,
  warehouseId: null,
  storeId: null,
  warehouseType: null,
  chineseName: null,
  code: null,
  virtualAvailableStockNumEnd: null,
  virtualAvailableStockNumStart: null,
  virtualStockNumEnd: null,
  virtualStockNumStart: null
}
export default {
  name: 'ImVirtualChannelStockManage',
  components: { DownloadTask },
  data() {
    const vue = this
    return {
      exportModel: {
        exportApi: ['back-product-web', 'back/asyncExcel/imVirtualChannelStockExportHandler', 'exportData.do'],
        pool: 'product',
        taskType: 'imVirtualChannelStockExport',
        async: true,
        getExportData: () => {
          return { filters: this.search }
        }
      },
      virtualStockNumArray: [],
      virtualAvailableStockNumArray: [],
      loading: false,
      warehouseList: [],
      storeList: [],
      downloadTaskVisible: false,
      search: { ...search },
      visible: false,
      tableList: [],
      page: {
        current: 1,
        size: 10,
        total: 0,
        handleSizeChange(val) {
          vue.page.size = val
          vue.updateList()
        },
        handleCurrentChange(val) {
          vue.page.current = val
          vue.updateList()
        }
      },
      merchantList: []
    }
  },
  async created() {
    try {
      this.loading = true
      await this.loadMerchantList()
      await this.updateList()
    } finally {
      this.loading = false
    }
  },
  methods: {
    changeMerchant() {
      this.search.warehouseId = null
      this.search.storeId = null
      if (this.search.merchantId) {
        this.loadStoreList()
        this.loadWarehouseList()
      } else {
        this.storeList = []
        this.warehouseList = []
      }
    },
    async handleSelect() {
      this.page.current = 1
      await this.updateList()
    },
    handleReset() {
      this.virtualStockNumArray = []
      this.virtualAvailableStockNumArray = []
      this.search = { ...search }
    },
    async download() {
      const res = await this.$product.$api.mpApi.asyncEvent({
        jsonTxt: JSON.stringify({
          currentPage: this.page.current,
          itemsPerPage: this.page.size,
          ...this.search
        }),
        templateCode: 'imVirtualChannelStockExport'
      })
      if (res.code === '0') {
        this.$message.success('创建导出任务成功')
      } else {
        this.$message.error('创建导出任务失败')
      }
    },
    async updateList() {
      this.loading = true
      if (this.virtualStockNumArray == null) {
        this.search.virtualStockNumStart = null
        this.search.virtualStockNumEnd = null
      } else {
        this.search.virtualStockNumStart = this.virtualStockNumArray[0]
        this.search.virtualStockNumEnd = this.virtualStockNumArray[1]
      }
      if (this.virtualAvailableStockNumArray == null) {
        this.search.virtualAvailableStockNumStart = null
        this.search.virtualAvailableStockNumEnd = null
      } else {
        this.search.virtualAvailableStockNumStart = this.virtualAvailableStockNumArray[0]
        this.search.virtualAvailableStockNumEnd = this.virtualAvailableStockNumArray[1]
      }
      try {
        const res = await this.$product.$api.stockApi.listImVirtualChannelStockByPage(
          {
            currentPage: this.page.current,
            itemsPerPage: this.page.size,
            ...this.search
          }
        )
        res.data.listObj.forEach(row => {
          for (let i = 0; i < this.merchantList.length; i++) {
            if (this.merchantList[i].merchantId === row.merchantId) {
              row.merchantName = this.merchantList[i].merchantName
              break
            }
          }
        })
        this.tableList = res.data.listObj
        this.page.total = res.data.total
      } finally {
        this.loading = false
      }
    },
    async loadMerchantList() {
      const merchant = await this.$product.$api.merchantApi.queryPlatformAuthMerchantPage(
        {
          currentPage: 1,
          itemsPerPage: 500
        }
      )
      this.merchantList = merchant.data.listObj
    },
    async loadWarehouseList() {
      const warehouse = await this.$product.$api.stockApi.listStoreWarehouseWithPage(
        {
          isVirtualWarehouse: 1,
          currentPage: 1,
          itemsPerPage: 500,
          merchantId: this.search.merchantId
        }
      )
      this.warehouseList = warehouse.data.listObj
    },
    async loadStoreList() {
      const store = await this.$product.$api.merchantApi.queryPlatformAuthStorePage(
        {
          currentPage: 1,
          itemsPerPage: 500,
          merchantId: this.search.merchantId
        }
      )
      this.storeList = store.data.listObj
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn-right{
    margin-right: 16px;
  }
</style>
