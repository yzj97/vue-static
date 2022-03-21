<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('Merchant') + ':'" prop="merchantId">
            <ody-merchant-choose
              v-model="search.merchantId"
              name="search_merchantId"
              value-key="merchantId"
              @ok="changeMerchant"
            />
          </ody-search-item>
          <ody-search-item :label="$t('仓库') + ':'" prop="warehouseId">
            <el-select
              v-model="search.warehouseId"
              :popper-append-to-body="false"
              name="search_warehouseId"
            >
              <el-option
                v-for="(item, index) in warehouseList"
                :key="index"
                :label="item.warehouseName"
                :value="item.warehouseId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item
            :label="$t('stock_change_type') + ':'"
            prop="processType"
          >
            <el-select
              v-model="search.processType"
              :placeholder="$t('common_all')"
              :popper-append-to-body="false"
              name="search_processType"
            >
              <el-option
                v-for="(item, index) in processTypeList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item prop="billType">
            <span slot="label">
              <el-select v-model="search.billType" :popper-append-to-body="false" :placeholder="$t('common_all')" name="search_billType">
                <el-option
                  v-for="(item, index) in billTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </span>
            <el-input v-model="search.billCode" name="search_billCode" />
          </ody-search-item>
          <ody-search-item
            :label="$t('Commoditycoding') + ':'"
            prop="productCode"
          >
            <el-input v-model="search.productCode" name="search_productCode" />
          </ody-search-item>
          <ody-search-item :label="$t('product_spu_code') + ':'" prop="spuCode">
            <el-input v-model="search.spuCode" name="search_spu_code" />
          </ody-search-item>
          <ody-search-item :label="$t('product_art_no') + ':'" prop="artNo">
            <el-input v-model="search.artNo" name="search_art_no" />
          </ody-search-item>
          <ody-search-item
            :label="$t('distributionOrder_barcode') + ':'"
            prop="barCode"
          >
            <el-input v-model="search.barCode" name="search_bar_code" />
          </ody-search-item>
          <ody-search-item
            :label="$t('Commodityname') + ':'"
            prop="productName"
          >
            <el-input v-model="search.productName" name="search_productName" />
          </ody-search-item>
          <ody-search-item
            :label="$t('Actualprocessingquantity') + ':'"
            prop="startStockNum"
          >
            <el-col :span="11">
              <el-input
                v-model="search.startStockNum"
                name="search_startStockNum"
                type="number"
              />
            </el-col>
            <el-col :span="2" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-input
                v-model="search.endStockNum"
                name="search_endStockNum"
                type="number"
              />
            </el-col>
          </ody-search-item>
          <ody-search-item
            :label="$t('stockChangeTime') + ':'"
            :space="2"
            prop="createTime"
          >
            <!-- <el-col :span="11">
              <el-date-picker
                v-model="search.createTimeStart"
                :clearable="false"
                name="search_createTimeStart"
                type="date"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="2" style="text-align:center">-</el-col>
            <el-col :span="11">
              <el-date-picker
                v-model="search.createTimeEnd"
                :clearable="false"
                name="search_createTimeEnd"
                type="date"
                style="width: 100%"
              />
            </el-col> -->
            <ody-date-range-picker
              v-model="createTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="search_createTime"
              value-format="yyyy-MM-dd"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{
          $t("reset")
        }}</el-button>
        <ody-button
          name="StockTurnoverManageQuery"
          size="small"
          type="primary"
          code="StockTurnoverManageQuery"
          @click.native="handleSelect"
        >{{ $t("Query") }}</ody-button
        >
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
          name="StockTurnoverManageExport_download"
          code="StockTurnoverManageExport"
          size="small"
          class="button-right"
        >{{ $t("export") }}</ody-batch-export-button
        >
        <ody-export-task-button
          pool="product"
          task-type="imWarehouseStockJournalRecordExport"
          name="StockTurnoverManageViewTask_downloadTaskVisible"
          code="StockTurnoverManageViewTask"
          size="small"
          class="btn-left"
        >{{ $t("查看任务") }}</ody-export-task-button
        >
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :data="tableList"
          :columns="columns"
          name="tableList651"
          style="width: 100%"
        />
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
    <download-task
      :task-type="'imWarehouseStockJournalRecordExport'"
      :is-data-task="true"
      :visible.sync="downloadTaskVisible"
      file-name="实体库存流水.xlsx"
    />
  </section>
</template>

<script>
import DownloadTask from '@/components/downloadTask/index'

const billTypeList = [
  { value: 'MOI', name: '杂项出入' },
  { value: 'SIO', name: '订单下单' },
  { value: 'SDO', name: '交货单' },
  { value: 'RI', name: '销售退货单' },
  { value: 'TO', name: '调拨出库' },
  { value: 'TI', name: '调拨入库' },
  { value: 'TORO', name: '调拨出库退货' },
  { value: 'TIRO', name: '调拨入库退货' },
  { value: 'POI', name: '采购入库' },
  { value: 'PORO', name: '采购退货出库' },
  { value: 'POCI', name: '采购更正入库' },
  { value: 'POCO', name: '采购更正出库' },
  { value: 'POROCI', name: '采购退货更正入库' },
  { value: 'POROCO', name: '采购退货更正出库' },
  { value: 'CAOI', name: 'WMS盘点' },
  { value: 'SKOI', name: 'WMS库存调整' },
  { value: 'PDOI', name: '盘点' },
  { value: 'JHLYO', name: '计划领用' },
  { value: 'LXLYO', name: '零星领用' },
  { value: 'QCI', name: '期初入库' }
]
const processTypeList = [
  { value: '4', name: '加库' },
  { value: '5', name: '减库' }
]

const search = {
  id: null,
  merchantId: null,
  warehouseId: null,
  billType: null,
  billCode: null,
  productName: null,
  productCode: null,
  processType: null,
  startStockNum: null,
  endStockNum: null,
  createTimeStart: new Date(new Date().getTime() - 7 * 24 * 3600 * 1000),
  createTimeEnd: new Date(),
  spuCode: null,
  artNo: null,
  barCode: null
}

export default {
  name: 'StockTurnoverManage',
  components: { DownloadTask },
  data() {
    const vue = this
    return {
      createTime: [],
      exportModel: {
        exportApi: [
          'back-product-web',
          'back/asyncExcel/imWarehouseStockJournalRecordExportHandler',
          'exportData.do'
        ],
        pool: 'product',
        taskType: 'imWarehouseStockJournalRecordExport',
        async: true,
        getExportData: () => {
          return { filters: this.search }
        }
      },
      loading: false,
      warehouseList: [],
      downloadTaskVisible: false,
      search: { ...search },
      billTypeList,
      processTypeList,
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
          prop: 'productCode',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('Commodityname'),
          prop: 'productName',
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
          prop: 'mainUnitName',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('Sourcedocumenttype'),
          prop: 'billType',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('Documentnumber'),
          prop: 'billCode',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('StockBeforeNumber'),
          prop: 'beforeNum',
          show: true
        },
        {
          label: this.$t('StockChangeNumber'),
          prop: 'stockNum',
          show: true,
          formatter: this.formatterStockNum
        },
        {
          label: this.$t('StockAfterNumber'),
          prop: 'afterNum',
          show: true
        },
        {
          label: this.$t('common_time_update'),
          prop: 'createTime',
          show: true,
          minWidth: 200
        }
      ]
    }
  },
  async created() {
    this.createTime = [this.search.createTimeStart, this.search.createTimeEnd]
    this.loading = true
    await this.loadMerchantList()
    this.updateList()
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
      this.createTime = [
        this.search.createTimeStart,
        this.search.createTimeEnd
      ]
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
      this.loading = true
      try {
        // 如果实体库存流水ID不是数字，返回空列表
        if (this.search.id) {
          const id = Number(this.search.id)
          if (isNaN(id)) {
            this.tableList = []
            this.page.total = 0
            return
          }
        }
        if (
          this.checkNum(
            '实际处理数量',
            this.search.startStockNum,
            this.search.endStockNum
          )
        ) {
          return
        }
        // if (this.createTime && this.createTime.length) {
        //   this.search.createTimeStart = this.createTime[0]
        //   this.search.createTimeEnd = this.createTime[1]
        // } else {
        //   this.search.createTimeStart = null
        //   this.search.createTimeEnd = null
        // }
        const param = this.$portal.deepClone(this.search)
        if (this.createTime && this.createTime.length > 1) {
          this.search.createTimeStart = this.$portal.parseTime(
            this.createTime[0],
            '{y}-{m}-{d}'
          )
          this.search.createTimeEnd = this.$portal.parseTime(
            this.createTime[1],
            '{y}-{m}-{d}'
          )
        } else {
          this.search.createTimeStart = null
          this.search.createTimeEnd = null
        }
        param.createTimeStart = this.search.createTimeStart
        param.createTimeEnd = this.search.createTimeEnd
        delete param.createTime
        if (
          this.checkNum('创建日期', param.createTimeStart, param.createTimeEnd)
        ) {
          return
        }
        const res =
          await this.$product.$api.stockApi.listImWarehouseStockJournalRecordByPage(
            {
              currentPage: this.page.current,
              itemsPerPage: this.page.size,
              ...param
            }
          )
        res.data.listObj.forEach((row) => {
          row.createTime = this.$portal.parseTime(
            row.createTime,
            '{y}-{m}-{d} {h}:{i}:{s}'
          )
          for (let i = 0; i < this.billTypeList.length; i++) {
            if (this.billTypeList[i].value === row.billType) {
              row.billType = this.billTypeList[i].name
              break
            }
          }
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
      const merchant =
        await this.$product.$api.merchantApi.queryPlatformAuthMerchantPage({
          currentPage: 1,
          itemsPerPage: 500
        })
      this.merchantList = merchant.data.listObj
    },
    async loadWarehouseList() {
      const warehouse =
        await this.$product.$api.merchantApi.queryPlatformAuthWarehousePage({
          currentPage: 1,
          itemsPerPage: 500,
          merchantId: this.search.merchantId
        })
      this.warehouseList = warehouse.data.listObj
    },
    formatterStockNum(row) {
      if (row.processType === 4) {
        return '<span style="color:green">+' + row.stockNum + '</span>'
      }
      return '<span style="color:red">-' + row.stockNum + '</span>'
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input--suffix .el-input__inner {
  padding-right: 10px;
}
.button-right {
  margin-right: 16px;
}
</style>
