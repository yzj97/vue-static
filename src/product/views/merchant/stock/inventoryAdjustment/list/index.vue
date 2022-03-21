<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form">
          <ody-search-item :label="$t('商家') + ':'" prop="merchantId">
            <el-select
              v-model="queryParam.merchantId"
              :placeholder="$t('请选择')"
              :popper-append-to-body="false"
              name="queryParam_merchantId"
              clearable
              @change="getWarehouseByMerchantId(queryParam.merchantId)"
            >
              <el-option
                v-for="item in merchantList"
                :key="item.merchantId"
                :label="item.merchantName"
                :value="item.merchantId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('仓库') + ':'" prop="warehouseId">
            <el-select v-model="queryParam.warehouseId" :placeholder="$t('请选择')" name="queryParam_warehouseId" clearable>
              <el-option
                v-for="item in warehouseList"
                :key="item.warehouseId"
                :label="item.warehouseName"
                :value="item.warehouseId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('单据编号') + ':'" prop="billCode">
            <el-input v-model="queryParam.billCode" name="queryParam_billCode" />
          </ody-search-item>
          <ody-search-item :label="$t('单据类型') + ':'" prop="billType">
            <el-select v-model="queryParam.billType" :placeholder="$t('请选择')" name="queryParam_billType" clearable>
              <el-option
                v-for="item in billType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('单据状态') + ':'" prop="billStatus">
            <el-select v-model="queryParam.billStatus" :placeholder="$t('请选择')" name="queryParam_billStatus" clearable>
              <el-option
                v-for="item in billStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品名称') + ':'" prop="productName">
            <el-input v-model="queryParam.productName" name="queryParam_productName" />
          </ody-search-item>
          <ody-search-item :label="$t('商品编码') + ':'" prop="productCode">
            <el-input v-model="queryParam.productCode" name="queryParam_productCode" />
          </ody-search-item>
          <ody-search-item :label="$t('申请数量') + ':'" prop="billStockNumArray">
            <ody-number-range
              v-model="billStockNumArray"
              :link-string="$t('to')"
              name="billStockNumArray"
              range="[0,1000000)"
              input-width="100"
              style="width:102.3%"
            />
          </ody-search-item>
          <ody-search-item :label="$t('实际处理数量') + ':'" prop="stockNumArray">
            <ody-number-range
              v-model="stockNumArray"
              :link-string="$t('to')"
              name="stockNumArray"
              range="[0,1000000)"
              input-width="100"
              style="width:102.3%"
            />
          </ody-search-item>
          <ody-search-item :label="$t('创建日期') + ':'" :space="2" prop="createTime">
            <!-- <el-col :span="10">
              <el-date-picker
                v-model="queryParam.createTimeStart"
                :placeholder="$t('选择日期')"
                name="queryParam_createTimeStart"
                value-format="yyyy-MM-dd"
                type="date"
              />
            </el-col>
            <el-col :span="1">&nbsp;&nbsp;{{ $t('至') }}</el-col>
            <el-col :span="10">
              <el-date-picker
                v-model="queryParam.createTimeEnd"
                :placeholder="$t('选择日期')"
                name="queryParam_createTimeEnd"
                value-format="yyyy-MM-dd"
                type="date"
              />
            </el-col> -->
            <ody-date-range-picker
              v-model="queryParam.createTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="queryParam_createTime"
              value-format="yyyy-MM-dd"
            />
          </ody-search-item>
          <ody-search-item :label="$t('创建人') + ':'" prop="createUsername">
            <el-input v-model="queryParam.createUsername" name="queryParam_createUsername" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('重置') }}</el-button>
        <ody-button
          name="InventoryAdjustmentBillListQuery_handleQuery"
          size="small"
          type="primary"
          code="InventoryAdjustmentBillListQuery"
          @click="handleQuery"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="InventoryAdjustmentBillListAdd_go"
          size="small"
          type="primary"
          code="InventoryAdjustmentBillListAdd"
          @click="go({ viewStatus: 1 })"
        >{{ $t('杂项出入新增') }}</ody-button>
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          name="InventoryAdjustmentBillListExport_transExportExcel"
          code="InventoryAdjustmentBillListExport"
          size="small"
          class="btn-left"
        >{{ $t('export') }}</ody-batch-export-button>
        <ody-export-task-button
          pool="product"
          task-type="imInventoryAdjustmentBillExport"
          name="InventoryAdjustmentBillListViewTask_asyncList"
          code="InventoryAdjustmentBillListViewTask"
          size="small"
          class="btn-left"
        >{{ $t('查看任务') }}</ody-export-task-button>
      </div>
      <div slot="table">
        <ody-table :loading="loading" :data="list" :columns="columns" :operates="operates" name="list197" />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.currentPage"
          :list="list"
          :page-sizes="[10, 20, 30, 50,100,300,500]"
          :page-size.sync="page.itemsPerPage"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="change"
          @current-change="queryList"
        />
      </div>
    </ody-list-table-area>
    <downloadTask :visible.sync="downloadTask" task-type="imInventoryAdjustmentBillExport" file-name="库内事务单据.xlsx" />
  </section>
</template>

<script>
import downloadTask from '@/components/downloadTask'
import stockConstant from '@/constant/stockConstant.js'
export default {
  name: 'InventoryAdjustmentBillList',
  components: { downloadTask },
  data() {
    return {
      exportModel: {
        exportApi: ['back-product-web', 'back/asyncExcel/imInventoryAdjustmentBillExportHandler', 'exportData.do'],
        pool: 'product',
        taskType: 'imInventoryAdjustmentBillExport',
        async: true,
        getExportData: () => {
          return { filters: this.queryParam }
        }
      },
      billStockNumArray: [],
      stockNumArray: [],
      downloadTask: false,
      billType: [
        {
          label: this.$t('杂项出入'),
          value: 'MOI'
        },
        {
          label: this.$t('WMS盘点'),
          value: 'CAOI'
        },
        {
          label: this.$t('WMS库存调整'),
          value: 'SKOI'
        },
        {
          label: this.$t('盘点'),
          value: 'PDOI'
        }
      ],
      billStatus: [
        {
          label: this.$t('待确认'),
          value: 0
        },
        {
          label: this.$t('待处理'),
          value: 1
        },
        {
          label: this.$t('已完成'),
          value: 2
        },
        {
          label: this.$t('已取消'),
          value: 3
        }
      ],
      queryParam: getDefaultSearchForm(),
      warehouseList: [],
      list: [],
      merchantList: [],
      merchantNameMap: {},
      bill: {},
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      columns: [
        {
          label: '商家',
          prop: 'merchantName',
          show: true,
          minWidth: 200
        },
        {
          label: '单据类型',
          prop: 'billType',
          show: true,
          formatter: this.formatterBillType
        },
        {
          label: '动作',
          prop: 'stockProcessType',
          show: true,
          minWidth: 88,
          formatter: this.formatterStockProcessType
        },
        {
          label: '单据编号',
          prop: 'billCode',
          show: true,
          minWidth: 200
        },
        {
          label: '单据状态',
          prop: 'billStatus',
          show: true,
          formatter: this.formatterBillStatus
        },
        {
          label: '申请数量',
          prop: 'billStockNum',
          show: true
        },
        {
          label: '实际处理数量',
          prop: 'stockNum',
          show: true
        },
        {
          label: '创建日期',
          prop: 'createTime',
          show: true,
          minWidth: 200,
          formatter: this.formatterCreateTime
        },
        {
          label: '创建人',
          prop: 'createUsername',
          show: true
        },
        {
          label: '最后更新日期',
          prop: 'updateTime',
          show: true,
          minWidth: 200,
          formatter: this.formatterUpdateTime
        },
        {
          label: '最后更新人',
          prop: 'updateUsername',
          show: true
        }
      ],
      operates: {
        fixed: 'right',
        list: [
          {
            label: '查看',
            method: (index, row) => {
              this.go({ id: row.id, viewStatus: 3 })
            },
            code: 'InventoryAdjustmentBillListView'
          },
          {
            label: '编辑',
            hidden: (index, row) => {
              const show = row.billStatus < 2

              return !show
            },
            method: (index, row) => {
              this.go({ id: row.id, viewStatus: 2 })
            },
            code: 'InventoryAdjustmentBillListEdit'
          }
        ]
      }
    }
  },
  watch: {
    // downloadTask(newValue, oldValue) {
    // }
  },
  async mounted() {
    try {
      this.stockApi = this.$product.$api.stockApi
      this.merchantApi = this.$product.$api.merchantApi
      this.authApi = this.$product.$api.authApi
      this.mpApi = this.$product.$api.mpApi
      this.loading = true
      await this.queryList()
      await this.queryMerchantList()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async handleQuery() {
      this.page.currentPage = 1
      await this.queryList()
    },
    // 分页查询
    async queryList(obj) {
      if (this.queryParam.createTime && this.queryParam.createTime.length > 1) {
        this.queryParam.createTimeStart = this.$portal.parseTime(this.queryParam.createTime[0], '{y}-{m}-{d}')
        this.queryParam.createTimeEnd = this.$portal.parseTime(this.queryParam.createTime[1], '{y}-{m}-{d}')
      }
      if (
        !this.checkNum(
          '创建日期',
          this.queryParam.createTimeStart,
          this.queryParam.createTimeEnd
        )
      ) {
        return
      }
      if (this.billStockNumArray == null) {
        this.queryParam.billStockNumStart = null
        this.queryParam.billStockNumEnd = null
      } else {
        this.queryParam.billStockNumStart = this.billStockNumArray[0]
        this.queryParam.billStockNumEnd = this.billStockNumArray[1]
      }
      if (this.stockNumArray == null) {
        this.queryParam.stockNumStart = null
        this.queryParam.stockNumEnd = null
      } else {
        this.queryParam.stockNumStart = this.stockNumArray[0]
        this.queryParam.stockNumEnd = this.stockNumArray[1]
      }
      var names = [
        'billCode',
        'billType',
        'productCode',
        'productName',
        'createUsername'
      ]
      names.forEach(name => {
        if (!this.queryParam[name]) {
          delete this.queryParam[name]
        }
      })
      var param = Object.assign({}, this.queryParam, this.page, obj)
      delete param.createTime
      this.loading = true

      try {
        const res = await this.stockApi.listImInventoryAdjustmentBillByPage(
          param
        )

        this.list = res.data.listObj
        this.page.total = res.data.total
        for (var p of this.list) {
          if (this.merchantNameMap[p.merchantId]) {
            p.merchantName = this.merchantNameMap[p.merchantId]
          }
        }
      } finally {
        this.loading = false
      }
    },
    // 查询当前登录用户有权限的商家
    async queryMerchantList() {
      return this.merchantApi
        .queryPlatformAuthMerchantPage({ currentPage: 1, itemsPerPage: 500 })
        .then(res => {
          this.merchantList = res.data.listObj || []
          this.merchantNameMap = {}
          for (const item of this.merchantList) {
            this.merchantNameMap[item.merchantId] = item.merchantName
          }
          for (var obj of this.list) {
            if (this.merchantNameMap[obj.merchantId]) {
              obj.merchantName = this.merchantNameMap[obj.merchantId]
            }
          }
        })
    },
    getWarehouseByMerchantId(merchantId) {
      if (!merchantId) {
        return
      }
      this.warehouseList = []
      this.queryParam.warehouseId = null

      this.merchantApi
        .queryPlatformAuthWarehousePage({ currentPage: 1, itemsPerPage: 500 })
        .then(res => {
          this.warehouseList = res.data.listObj.filter(item => {
            return item.merchantId === merchantId
          })
        })
    },
    formatterBillType(row, column) {
      if (row.parentBillTypeValue) {
        return row.parentBillTypeValue
      }
      return stockConstant.INVENTORY_ADJUSTMENT_BILL_TYPE[row.billType]
    },
    formatterBillStatus(row, column) {
      if (row.billStatusValue) {
        return row.billStatusValue
      }
      return stockConstant.INVENTORY_ADJUSTMENT_BILL_STATUS[row.billStatus]
    },
    formatterStockProcessType(row, column) {
      if (row.stockProcessTypeValue) {
        return row.stockProcessTypeValue
      }
      return stockConstant.INVENTORY_ADJUSTMENT_STOCK_PROCESS_TYPE[
        row.stockProcessType
      ]
    },
    formatterCreateTime(row) {
      return this.dateFormat(row.createTime)
    },
    formatterUpdateTime(row) {
      return this.dateFormat(row.updateTime)
    },
    getNumber(name) {
      if (isNaN(this.queryParam[name])) {
        this.queryParam[name] = null
      } else {
        this.queryParam[name] = Number(this.queryParam[name])
      }
    },
    checkNum(labelName, start, end) {
      start = parseInt(start)
      end = parseInt(end)
      if (start && end && start > end && start !== end) {
        this.$message(labelName + '起始值不得大于结束值')
        return false
      }
      return true
    },
    asyncList() {
      // 查看任务
      this.downloadTask = true
    },
    go(param) {
      if (param.viewStatus === 1) {
        param.id = parseInt(100 * Math.random())
      }
      this.$router.push({
        name: 'InventoryAdjustmentBillEdit',
        params: param
      })
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
    // 重置
    reset() {
      this.billStockNumArray = []
      this.stockNumArray = []
      this.queryParam = getDefaultSearchForm()
      this.warehouseList = []
    },
    change(val) {
      this.page.itemsPerPage = val
      this.queryList()
    }
  }
}

function getDefaultSearchForm() {
  return Object.assign(
    {},
    {
      warehouseId: null
    }
  )
}
</script>

<style lang="scss" scoped>
.btn-popover {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .el-button {
    margin-bottom: 4px;
  }
}
.btn-left{
  margin-left: 16px;
}
</style>
