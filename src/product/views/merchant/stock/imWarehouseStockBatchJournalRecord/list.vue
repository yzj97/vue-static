<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('Merchant')+':'">
            <ody-merchant-choose v-model="search.merchantId" name="search_merchantId" value-key="merchantId" @ok="changeMerchant"/>
          </ody-search-item>
          <ody-search-item :label="$t('warehouse')+':'">
            <el-select v-model="search.warehouseId" name="search_warehouseId">
              <el-option
                v-for="(item,index) in warehouseList"
                :key="index"
                :label="item.warehouseName"
                :value="item.warehouseId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('stock_change_type')+':'">
            <el-select v-model="search.processType" :placeholder="$t('common_all')" name="search_processType">
              <el-option
                v-for="(item,index) in processTypeList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item>
            <span slot="label">
              <el-select v-model="search.billType" :placeholder="$t('common_all')" name="search_billType">
                <el-option
                  v-for="(item,index) in billTypeList"
                  :key="index"
                  :label="$t(item.name)"
                  :value="item.value"
                />
              </el-select>
            </span>
            <el-input v-model="search.billCode" name="search_billCode" />
          </ody-search-item>
          <ody-search-item :label="$t('Commoditycoding')+':'">
            <el-input v-model="search.mpCode" name="search_productCode" />
          </ody-search-item>
          <ody-search-item :label="$t('批次号')+':'">
            <el-input v-model="search.batchNo" name="batch_no" />
          </ody-search-item>
          <ody-search-item :label="$t('批次属性')+':'">
            <el-input v-model="search.batchAttrs" name="batch_attr" />
          </ody-search-item>
          <ody-search-item :label="$t('product_spu_code')+':'">
            <el-input v-model="search.spuCode" name="search_spu_code" />
          </ody-search-item>
          <ody-search-item :label="$t('product_art_no')+':'">
            <el-input v-model="search.artNo" name="search_art_no" />
          </ody-search-item>
          <ody-search-item :label="$t('distributionOrder_barcode')+':'">
            <el-input v-model="search.barCode" name="search_bar_code" />
          </ody-search-item>
          <ody-search-item :label="$t('Commodityname')+':'">
            <el-input v-model="search.mpName" name="search_productName" />
          </ody-search-item>
          <ody-search-item :label="$t('Actualprocessingquantity')+':'">
            <el-col :span="11">
              <el-input v-model="search.startStockNum" name="search_startStockNum" type="number" />
            </el-col>
            <el-col :span="2" style="text-align:center">-</el-col>
            <el-col :span="11">
              <el-input v-model="search.endStockNum" name="search_endStockNum" type="number" />
            </el-col>
          </ody-search-item>
          <ody-search-item :label="$t('stockChangeTime')+':'" prop="createTime">
            <!-- <el-col :span="11">
              <el-date-picker
                v-model="search.startCreateTime"
                :clearable="false"
                name="search_createTimeStart"
                type="date"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="2" style="text-align:center">-</el-col>
            <el-col :span="11">
              <el-date-picker
                v-model="search.endCreateTime"
                :clearable="false"
                name="search_createTimeEnd"
                type="date"
                style="width: 100%"
              />
            </el-col> -->
            <ody-date-range-picker
              v-model="search.createTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="search_createTime"
              value-format="yyyy-MM-dd"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('reset') }}</el-button>
        <ody-button
          name="ImWarehouseStockBatchJournalRecord_listPage"
          size="small"
          type="primary"
          code="ImWarehouseStockBatchJournalRecord_listPage"
          @click.native="handleSelect"
        >{{ $t('Query') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="ImWarehouseStockBatchJournalRecord_exportData"
          size="small"
          code="ImWarehouseStockBatchJournalRecord_exportData"
          @click="download"
        >{{ $t('export') }}</ody-button>
        <ody-button
          name="ImWarehouseStockBatchJournalRecord_viewTask"
          size="small"
          code="ImWarehouseStockBatchJournalRecord_viewTask"
          @click="downloadTaskVisible=true"
        >{{ $t('View_the_task') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table :loading="loading" :data="tableList" :columns="columns" name="tableList651" />
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
      :is-data-task="true"
      :task-type="'imWarehouseStockBatchJournalRecordExport'"
      :visible.sync="downloadTaskVisible"
    />
  </section>
</template>

<script>
import DownloadTask from '@/components/downloadTask/index'

const billTypeList = [
  // { value: 'MOI', name: '杂项出入' },
  { value: 'SIO', name: '订单下单' },
  // { value: 'SDO', name: '交货单' },
  // { value: 'RI', name: '销售退货单' },
  // { value: 'TO', name: '调拨出库' },
  // { value: 'TI', name: '调拨入库' },
  // { value: 'TORO', name: '调拨出库退货' },
  // { value: 'TIRO', name: '调拨入库退货' },
  { value: 'POI', name: '采购入库' },
  // { value: 'PORO', name: '采购退货出库' },
  // { value: 'POCI', name: '采购更正入库' },
  // { value: 'POCO', name: '采购更正出库' },
  // { value: 'POROCI', name: '采购退货更正入库' },
  // { value: 'POROCO', name: '采购退货更正出库' },
  // { value: 'CAOI', name: 'WMS盘点' },
  // { value: 'SKOI', name: 'WMS库存调整' },
  { value: 'PDOI', name: '盘点' }
  // { value: 'JHLYO', name: '计划领用' },
  // { value: 'LXLYO', name: '零星领用' },
  // { value: 'QCI', name: '期初入库' }
]
const processTypeList = [
  { value: '4', name: '加库' },
  { value: '5', name: '减库' }
]
const search = {
  merchantId: null,
  warehouseId: null,
  billType: null,
  billCode: null,
  mpName: null,
  mpCode: null,
  processType: null,
  startStockNum: null,
  endStockNum: null,
  startCreateTime: new Date(new Date().getTime() - 7 * 24 * 3600 * 1000),
  endCreateTime: new Date(),
  spuCode: null,
  artNo: null,
  barCode: null
}

export default {
  name: 'ImWarehouseStockBatchJournalRecordList',
  components: { DownloadTask },
  data() {
    const vue = this
    return {
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
          prop: 'mpCode',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('Commodityname'),
          prop: 'mpName',
          show: true
        },
        {
          label: this.$t('批次号'),
          prop: 'batchNo',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('批次属性'),
          prop: 'batchAttrsStr',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('Warehousecoding'),
          prop: 'warehouseCode',
          show: true
        },
        {
          label: this.$t('Warehousename'),
          prop: 'warehouseName',
          show: true
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
          show: true
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
          show: true
        },
        {
          label: this.$t('Measurementunit'),
          prop: 'calculationUnitName',
          show: true
        },
        {
          label: this.$t('Sourcedocumenttype'),
          prop: 'billType',
          show: true
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
          minWidth: 88,
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
          minWidth: 200,
          formatter: this.formatterUpdateTime
        }
      ]
    }
  },
  async created() {
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
      this.warehouseList = []
      this.search = { ...search }
    },
    checkNum(labelName, start, end) {
      start = parseInt(start)
      end = parseInt(end)
      if (start && end && start > end && start !== end) {
        this.$message({
          type: 'error',
          message: this.$t(labelName) + this.$t('起始值不得大于结束值')
        })
        return true
      }
    },
    async download() {
      const searchInfo = Object.assign({}, this.search)
      if (searchInfo.id) {
        // 如果id不是数字，设置id-1，查询列表为空
        const id = Number(this.search.id)
        if (isNaN(id)) {
          searchInfo.id = -1
        }
      }
      const res = await this.$product.$api.stockApi.imWarehouseStockBatchJournalRecordExport({
        filters: searchInfo
      })
      if (res.code === '0') {
        this.$message.success('创建导出任务成功')
      } else {
        this.$message.error('创建导出任务失败')
      }
    },
    async updateList() {
      this.loading = true
      try {
        if (this.search.createTime && this.search.createTime.length > 1) {
          this.search.startCreateTime = this.$portal.parseTime(this.search.createTime[0], '{y}-{m}-{d}')
          this.search.endCreateTime = this.$portal.parseTime(this.search.createTime[1], '{y}-{m}-{d}')
        }

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
            'Actualprocessingquantity',
            this.search.startStockNum,
            this.search.endStockNum
          )
        ) {
          return
        }
        if (
          this.checkNum(
            '创建日期',
            this.search.startCreateTime,
            this.search.endCreateTime
          )
        ) {
          return
        }
        const res = await this.$product.$api.stockApi.imWarehouseStockBatchJournalRecord(
          {
            page: this.page.current,
            limit: this.page.size,
            filters: this.search
          }
        )
        res.data.forEach(row => {
          row.createTime = this.$portal.parseTime(
            row.createTime,
            '{y}-{m}-{d} {h}:{i}:{s}'
          )
          for (let i = 0; i < this.billTypeList.length; i++) {
            if (this.billTypeList[i].value === row.billType) {
              row.billType = this.$t(this.billTypeList[i].name)
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
        this.tableList = res.data
        this.page.total = res.total
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
    formatterStockNum(row) {
      if (row.processType === 4) {
        return '<span style="color:green">+' + row.stockNum + '</span>'
      }
      return '<span style="color:red">-' + row.stockNum + '</span>'
    },
    formatterUpdateTime(row) {
      return this.dateFormat(row.createTime)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-input--suffix .el-input__inner {
    padding-right: 10px;
  }
</style>
