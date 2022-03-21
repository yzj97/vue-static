<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('Merchant')+':'" prop="merchantId">
            <ody-merchant-choose v-model="search.merchantId" placeholder="请选择" name="search_merchantId" value-key="merchantId" @ok="changeMerchant"/>
          </ody-search-item>
          <ody-search-item :label="$t('仓库')+':'" prop="warehouseId">
            <el-select v-model="search.warehouseId" name="search_warehouseId">
              <el-option
                v-for="(item,index) in warehouseList"
                :key="index"
                :label="item.warehouseName"
                :value="item.warehouseId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('product_code')+':'" prop="code">
            <el-input v-model="search.code" name="search_code" />
          </ody-search-item>
          <ody-search-item :label="$t('product_spu_code')+':'">
            <el-input v-model="search.spuCode" name="search_spu_code" />
          </ody-search-item>
          <ody-search-item :label="$t('product_art_no')+':'">
            <el-input v-model="search.artNo" name="search_art_no" />
          </ody-search-item>
          <ody-search-item :label="$t('product_bar_code')+':'">
            <el-input v-model="search.barCode" name="search_bar_code" />
          </ody-search-item>
          <ody-search-item :label="$t('distributionOrder_barcode')+':'">
            <el-input v-model="search.barCode" name="search_bar_code" />
          </ody-search-item>
          <ody-search-item :label="$t('product_name')+':'">
            <el-input v-model="search.chineseName" name="search_chineseName" />
          </ody-search-item>
          <ody-search-item :label="$t('Totalstock')+':'" prop="realStockNumStart">
            <el-col :span="11">
              <el-input v-model="search.realStockNumStart" name="search_realStockNumStart" type="number" />
            </el-col>
            <el-col :span="2" style="text-align:center">-</el-col>
            <el-col :span="11">
              <el-input v-model="search.realStockNumEnd" name="search_realStockNumEnd" type="number" />
            </el-col>
          </ody-search-item>
          <ody-search-item :label="$t('Availablestock')+':'" prop="availableStockNumStart">
            <el-col :span="11">
              <el-input v-model="search.availableStockNumStart" name="search_availableStockNumStart" type="number" />
            </el-col>
            <el-col :span="2" style="text-align:center">-</el-col>
            <el-col :span="11">
              <el-input v-model="search.availableStockNumEnd" name="search_availableStockNumEnd" type="number" />
            </el-col>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('reset') }}</el-button>
        <ody-button
          name="ImWarehouseRealStockManageQuery_handleSelect"
          size="small"
          type="primary"
          code="ImWarehouseRealStockManageQuery"
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
          name="ImWarehouseRealStockManageExport_download"
          code="ImWarehouseRealStockManageExport"
          size="small"
          class="btn-right"
        >{{ $t('export') }}</ody-batch-export-button>
        <ody-export-task-button
          pool="product"
          task-type="imWarehouseRealStockExport"
          name="ImWarehouseRealStockManageViewTask_downloadTaskVisible"
          code="ImWarehouseRealStockManageViewTask"
          size="small"
          class="btn-left"
        >{{ $t('查看任务') }}</ody-export-task-button>
      </div>
      <div slot="table">
        <ody-table :loading="loading" :data="tableList" :columns="columns" name="tableList876" />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page="page.current"
          :list="tableList"
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
    <download-task :task-type="'imWarehouseRealStockExport'" :visible.sync="downloadTaskVisible" file-name="实体库存管理.xlsx" />
  </section>
</template>

<script>
import DownloadTask from '@/components/downloadTask/index'

const search = {
  merchantId: null,
  warehouseId: null,
  chineseName: null,
  code: null,
  spuCode: null,
  artNo: null,
  realStockNumStart: null,
  realStockNumEnd: null,
  availableStockNumStart: null,
  availableStockNumEnd: null
}
export default {
  name: 'ImWarehouseRealStockManage',
  components: { DownloadTask },
  data() {
    const vue = this
    return {
      exportModel: {
        exportApi: ['back-product-web', 'back/asyncExcel/imWarehouseRealStockExportHandler', 'exportData.do'],
        pool: 'product',
        taskType: 'imWarehouseRealStockExport',
        async: true,
        getExportData: () => {
          return { filters: this.search }
        }
      },
      loading: false,
      warehouseList: [],
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
      merchantList: [],
      columns: [
        {
          label: this.$t('Commoditycoding'),
          prop: 'code',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('Commodityname'),
          prop: 'chineseName',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('Warehousecoding'),
          prop: 'warehouseCode',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('Warehousename'),
          prop: 'warehouseName',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('Merchant'),
          prop: 'merchantName',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('distributionOrder_barcode'),
          prop: 'barCode',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('product_spu_code'),
          prop: 'spuCode',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('product_art_no'),
          prop: 'artNo',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('Measurementunit'),
          prop: 'mainUnit',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('Totalstock'),
          prop: 'realStockNum',
          show: true
        },
        {
          label: this.$t('Frozenstock'),
          prop: 'freezeStockNum',
          show: true
        },
        {
          label: this.$t('Availablestock'),
          prop: 'availableStockNum',
          show: true
        },
        {
          label: this.$t('last_update_time'),
          prop: 'updateTime',
          show: true,
          minWidth: 200,
          formatter: this.formatterUpdateTime
        }
      ]
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
      if (this.search.merchantId) {
        this.loadWarehouseList()
      } else {
        this.warehouseList = []
      }
    },
    async handleSelect() {
      this.page.current = 1
      await this.updateList()
    },
    handleReset() {
      this.search = { ...search }
    },
    checkNum(labelName, start, end) {
      start = parseInt(start)
      end = parseInt(end)
      if (start && end && start > end && start !== end) {
        this.$message({
          type: 'error',
          message: this.$t(labelName + '起始值不得大于结束值')
        })
        return true
      }
    },
    async updateList() {
      if (
        this.checkNum(
          '总库存',
          this.search.realStockNumStart,
          this.search.realStockNumEnd
        )
      ) {
        return
      }
      if (
        this.checkNum(
          '可售库存',
          this.search.availableStockNumStart,
          this.search.availableStockNumEnd
        )
      ) {
        return
      }
      this.loading = true
      try {
        const res = await this.$product.$api.stockApi.listImWarehouseRealStockByPage(
          {
            currentPage: this.page.current,
            itemsPerPage: this.page.size,
            ...this.search
          }
        )
        res.data.listObj.forEach(row => {
          row.updateTime = this.$portal.parseTime(
            row.updateTime,
            '{y}-{m}-{d} {h}:{i}:{s}'
          )
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
      const warehouse = await this.$product.$api.merchantApi.queryPlatformAuthWarehousePage(
        {
          currentPage: 1,
          itemsPerPage: 500,
          merchantId: this.search.merchantId
        }
      )
      this.warehouseList = warehouse.data.listObj
    },
    dateFormat(time) {
      if (time === null) {
        return null
      }
      var date = new Date(time)
      var year = date.getFullYear()
      var month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      var minutes =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      var seconds =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      // 拼接
      return (
        year +
        '-' +
        month +
        '-' +
        day +
        ' ' +
        hours +
        ':' +
        minutes +
        ':' +
        seconds
      )
    },
    formatterUpdateTime(row) {
      return this.dateFormat(row.updateTime)
    }
  }
}
</script>

<style scoped>
.btn-left{
  margin-left: 16px;
}
</style>
