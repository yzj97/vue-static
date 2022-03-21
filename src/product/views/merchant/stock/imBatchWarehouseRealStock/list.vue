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
          <ody-search-item :label="$t('product_code')+':'">
            <el-input v-model="search.mpCode" name="search_code" />
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
          <ody-search-item :label="$t('product_name')+':'">
            <el-input v-model="search.mpName" name="search_chineseName" />
          </ody-search-item>
          <ody-search-item :label="$t('库存数量')+':'">
            <ody-number-range
              v-model="search.realStockNum"
              name="seach_realStockNum"
            />

            <!-- <el-col :span="11">
              <el-input-number v-model="search.startRealStockNum" :controls="false" :size="small" name="search_realStockNumStart" />
            </el-col>
            <el-col :span="2" style="text-align:center">-</el-col>
            <el-col :span="11">
              <el-input-number v-model="search.endRealStockNum" :controls="false" :size="small" name="search_realStockNumEnd" />
            </el-col> -->
          </ody-search-item>
          <ody-search-item :label="$t('创建时间')+':'" prop="createTime">
            <!-- <el-col :span="11">
              <el-date-picker
                v-model="search.startCreateTime"
                :clearable="false"
                name="search_createTimeStart"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="2" style="text-align:center">-</el-col>
            <el-col :span="11">
              <el-date-picker
                v-model="search.endCreateTime"
                :clearable="false"
                name="search_createTimeEnd"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
              />
            </el-col> -->
            <ody-date-range-picker
              v-model="search.createTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="search_createTime"
              value-format="yyyy-MM-dd"
              type="datetimer"
            />
          </ody-search-item>
          <ody-search-item :label="$t('更新时间')+':'" prop="updateTime">
            <!-- <el-col :span="11">
              <el-date-picker
                v-model="search.startUpdateTime"
                :clearable="false"
                name="search_updateTimeStart"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="2" style="text-align:center">-</el-col>
            <el-col :span="11">
              <el-date-picker
                v-model="search.endUpdateTime"
                :clearable="false"
                name="search_updateTimeEnd"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
              />
            </el-col> -->
            <ody-date-range-picker
              v-model="search.updateTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="search_updateTime"
              value-format="yyyy-MM-dd"
              type="datetimer"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('reset') }}</el-button>
        <ody-button
          name="ImBatchWarehouseRealStock_listPage"
          size="small"
          type="primary"
          code="ImBatchWarehouseRealStock_listPage"
          @click="handleSelect"
        >{{ $t('query') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="ImBatchWarehouseRealStock_exportData"
          size="small"
          code="ImBatchWarehouseRealStock_exportData"
          @click="download"
        >{{ $t('export') }}</ody-button>
        <ody-button
          name="ImBatchWarehouseRealStock_viewTask"
          size="small"
          code="ImBatchWarehouseRealStock_viewTask"
          @click="downloadTaskVisible=true"
        >{{ $t('View_the_task') }}</ody-button>
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
    <download-task :task-type="'imBatchWarehouseRealStockExport'" :is-data-task="true" :visible.sync="downloadTaskVisible" />
  </section>
</template>

<script>
import DownloadTask from '@/components/downloadTask/index'

const search = {
  merchantId: null,
  warehouseId: null,
  mpName: null,
  code: null,
  batchNo: null,
  batchAttrs: null,
  spuCode: null,
  artNo: null,
  realStockNum: [],
  startRealStockNum: null,
  endRealStockNum: null,
  startCreateTime: new Date(new Date().getTime() - 7 * 24 * 3600 * 1000),
  endCreateTime: new Date(),
  startUpdateTime: null,
  endUpdateTime: null
}
export default {
  name: 'ImBatchWarehouseRealStockList',
  components: { DownloadTask },
  data() {
    const vue = this
    return {
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
          prop: 'mpCode',
          show: true,
          minWidth: 200
        },
        {
          label: this.$t('Commodityname'),
          prop: 'mpName',
          show: true,
          minWidth: 200
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
          show: true
        },
        {
          label: this.$t('Measurementunit'),
          prop: 'calculationUnitName',
          show: true
        },
        {
          label: this.$t('库存数量'),
          prop: 'realStockNum',
          show: true
        },
        {
          label: this.$t('创建时间'),
          prop: 'createTime',
          show: true,
          minWidth: 200,
          formatter: this.formatterCreateTime
        },
        {
          label: this.$t('最近更新时间'),
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
      const { realStockNum: [startRealStockNum, endRealStockNum], ...restSearch } = this.search

      const res = await this.$product.$api.stockApi.imBatchWarehouseRealStockExport({
        filters: {
          ...restSearch,
          startRealStockNum,
          endRealStockNum
        }
      })
      if (res.code === '0') {
        this.$message.success('创建导出任务成功')
      } else {
        this.$message.error('创建导出任务失败')
      }
    },
    async updateList() {
      const { realStockNum: [startRealStockNum, endRealStockNum], ...restSearch } = this.search

      if (
        this.checkNum(
          '库存数量',
          startRealStockNum,
          endRealStockNum
        )
      ) {
        return
      }
      this.loading = true
      try {
        if (restSearch.createTime && restSearch.createTime.length > 1) {
          restSearch.startCreateTime = this.$portal.parseTime(restSearch.createTime[0], '{y}-{m}-{d} {h}:{i}:{s}')
          restSearch.endCreateTime = this.$portal.parseTime(restSearch.createTime[1], '{y}-{m}-{d} {h}:{i}:{s}')
        }
        if (restSearch.updateTime && restSearch.updateTime.length > 1) {
          restSearch.startUpdateTime = this.$portal.parseTime(restSearch.updateTime[0], '{y}-{m}-{d} {h}:{i}:{s}')
          restSearch.endUpdateTime = this.$portal.parseTime(restSearch.updateTime[1], '{y}-{m}-{d} {h}:{i}:{s}')
        }
        // restSearch.startCreateTime = this.$portal.parseTime(restSearch.startCreateTime, '{y}-{m}-{d} {h}:{i}:{s} ')
        // restSearch.endCreateTime = this.$portal.parseTime(restSearch.endCreateTime, '{y}-{m}-{d} {h}:{i}:{s}')
        // restSearch.startUpdateTime = this.$portal.parseTime(restSearch.startUpdateTime, '{y}-{m}-{d} {h}:{i}:{s}')
        // restSearch.endUpdateTime = this.$portal.parseTime(restSearch.endUpdateTime, '{y}-{m}-{d} {h}:{i}:{s}')
        const res = await this.$product.$api.stockApi.imBatchWarehouseRealStock(
          {
            page: this.page.current,
            limit: this.page.size,
            filters: {
              ...restSearch,
              startRealStockNum,
              endRealStockNum
            }
          }
        )
        res.data.forEach(row => {
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
    formatterUpdateTime(row) {
      if (row.updateTime) {
        return this.dateFormat(row.updateTime)
      } else {
        return ''
      }
    },
    formatterCreateTime(row) {
      return this.dateFormat(row.createTime)
    }
  }
}
</script>

<style scoped>
</style>
