<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('商家') + ':'" prop="merchantId">
            <el-select
              v-model="search.merchantId"
              :placeholder="$t('请选择')"
              :popper-append-to-body="false"
              name="search_merchantId"
              clearable
              @change="queryVirtualWarehouse()"
            >
              <el-option
                v-for="item in merchantList"
                :key="item.merchantId"
                :label="item.merchantName"
                :value="item.merchantId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('拟合仓') + ':'" prop="warehouseId">
            <el-select v-model="search.warehouseId" :placeholder="$t('请选择')" name="search_warehouseId" clearable>
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.warehouseName"
                :value="item.id"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品编码') + ':'" prop="code">
            <el-input v-model="search.code" name="search_code" size="small" />
          </ody-search-item>
          <ody-search-item :label="$t('商品名称') + ':'" prop="chineseName">
            <el-input v-model="search.chineseName" name="search_chineseName" size="small" />
          </ody-search-item>
          <ody-search-item :space="1" :label="$t('虚拟总库存') + ':'" prop="virtualStockNumStart">
            <div style="display: flex;">
              <el-input
                v-model="search.virtualStockNumStart"
                name="search_virtualStockNumStart"
                style="width: 47%"
                @input="getNumber('virtualStockNumStart')"
              /><span style="margin:0 3px 0 5px">-</span>
              <el-input
                v-model="search.virtualStockNumEnd"
                name="search_virtualStockNumEnd"
                style="width: 47%"
                @input="getNumber('virtualStockNumEnd')"
              />
            </div>
          </ody-search-item>
          <ody-search-item :label="$t('虚拟可售库存') + ':'" prop="virtualAvailableStockNumStart">
            <div style="display: flex;">
              <el-input
                v-model="search.virtualAvailableStockNumStart"
                name="search_virtualAvailableStockNumStart"
                style="width: 47%"
                @input="getNumber('virtualAvailableStockNumStart')"
              /><span style="margin:0 3px 0 5px">-</span>
              <el-input
                v-model="search.virtualAvailableStockNumEnd"
                name="search_virtualAvailableStockNumEnd"
                style="width: 47%"
                @input="getNumber('virtualAvailableStockNumEnd')"
              />
            </div>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="VirtualWarehouseStockListQuery_handleSelect"
          size="small"
          type="primary"
          code="VirtualWarehouseStockListQuery"
          @click="handleSelect"
        >{{ $t('查询') }}</ody-button>
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
          name="VirtualWarehouseStockListExport_download"
          code="VirtualWarehouseStockListExport"
          size="small"
          class="btn-right"
        >{{ $t('导出') }}</ody-batch-export-button>
        <ody-export-task-button
          pool="product"
          task-type="imVirtualWarehouseStockExport"
          name="VirtualWarehouseStockListViewTask_downloadTaskVisible"
          code="VirtualWarehouseStockListViewTask"
          size="small"
          class="btn-left"
        >{{ $t('查看任务') }}</ody-export-task-button>
      </div>
      <div slot="table">
        <el-table v-loading="loading" :data="tableList" name="tableList516" style="width: 100%">
          <el-table-column :label="$t('商家')" prop="merchantName" min-width="200" />
          <el-table-column :label="$t('拟合仓')" prop="warehouseName" min-width="200" />
          <el-table-column :label="$t('商品编码')" prop="code" min-width="200" />
          <el-table-column :label="$t('商品名称')" prop="chineseName" min-width="200" />
          <el-table-column :label="$t('计量单位')" prop="mainUnit" min-width="200" />
          <el-table-column
            :label="$t('虚拟总库存')"
            prop="virtualStockNum"
            min-width="124"
          />
          <el-table-column
            :label="$t('虚拟冻结库存')"
            prop="freezeStockNum"
            min-width="124"
          />
          <el-table-column
            :label="$t('虚拟可售库存')"
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
    <downloadTask :task-type="'imVirtualWarehouseStockExport'" :visible.sync="downloadTaskVisible" file-name="拟合库存管理.xlsx" />
  </section>
</template>

<script>
import downloadTask from '@/components/downloadTask'
const search = {
  merchantId: null,
  warehouseId: null,
  chineseName: null,
  code: null,
  virtualAvailableStockNumEnd: null,
  virtualAvailableStockNumStart: null,
  virtualStockNumEnd: null,
  virtualStockNumStart: null
}
export default {
  name: 'VirtualWarehouseStockList',
  components: { downloadTask },
  data() {
    const vue = this
    return {
      exportModel: {
        exportApi: ['back-product-web', 'back/asyncExcel/imVirtualWarehouseStockExportHandler', 'exportData.do'],
        pool: 'product',
        taskType: 'imVirtualWarehouseStockExport',
        async: true,
        getExportData: () => {
          return { filters: this.search }
        }
      },
      merchantList: [],
      warehouseList: [],
      downloadTaskVisible: false,
      search: { ...search },
      visible: false,
      tableList: [],
      loading: false,
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
      }
    }
  },
  async created() {
    this.loading = true
    await this.loadMerchantList()
    this.updateList()
  },
  methods: {
    async handleSelect() {
      this.page.current = 1
      await this.updateList()
    },
    handleReset() {
      this.search = { ...search }
      this.warehouseList = []
    },
    async updateList() {
      if (
        !this.checkNum(
          '虚拟总库存',
          this.search.virtualStockNumStart,
          this.search.virtualStockNumEnd
        )
      ) {
        return
      }
      if (
        !this.checkNum(
          '虚拟可售库存',
          this.search.virtualAvailableStockNumStart,
          this.search.virtualAvailableStockNumEnd
        )
      ) {
        return
      }
      ['code', 'chineseName'].forEach(name => {
        if (!this.search[name]) {
          delete this.search[name]
        }
      })
      this.loading = true
      const res = await this.$product.$api.stockApi.listImVirtualWarehouseStockByPage(
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
      this.loading = false
    },
    async loadMerchantList() {
      const merchant = await this.$product.$api.merchantApi.queryPlatformAuthMerchantPage(
        {
          currentPage: 1,
          itemsPerPage: 500
        }
      )
      this.merchantList = merchant.data.listObj
      // this.search.merchantId = merchant.data.listObj.length > 0 ? merchant.data.listObj[0].merchantId : null
    },
    async queryVirtualWarehouse() {
      if (this.search.merchantId) {
        const merchant = await this.$product.$api.stockApi.listStoreWarehouseWithPage(
          {
            merchantId: this.search.merchantId,
            isVirtualWarehouse: 1,
            currentPage: 1,
            itemsPerPage: 500
          }
        )
        this.warehouseList = merchant.data.listObj
      } else {
        this.warehouseList = []
        this.search.warehouseId = null
      }
    },
    getNumber(name) {
      if (isNaN(this.search[name])) {
        this.search[name] = null
      } else if (this.search[name]) {
        this.search[name] = Number(this.search[name])
      }
    },
    checkNum(labelName, start, end) {
      start = parseInt(start)
      end = parseInt(end)
      if (!isEmpty(start) && !isEmpty(end) && start > end && start !== end) {
        this.$message(labelName + '起始值不得大于结束值')
        return false
      }
      return true
    }
  }
}
function isEmpty(value) {
  if (value === undefined || value === '' || value === null) {
    return true
  }
  return false
}
</script>

<style lang="scss" scoped>
 .btn-right {
   margin-right: 16px;
 }
</style>
