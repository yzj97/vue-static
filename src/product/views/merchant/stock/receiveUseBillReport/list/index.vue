<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form">
          <ody-search-item :label="$t('商家') + ':'" prop="merchantId">
            <el-select v-model="queryParam.merchantId" :placeholder="$t('请选择')" name="queryParam_merchantId" clearable>
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
          <ody-search-item :label="$t('商品编码') + ':'" prop="code">
            <el-input v-model="queryParam.code" name="queryParam_code" />
          </ody-search-item>
          <ody-search-item :label="$t('商品条码') + ':'" prop="barCode">
            <el-input v-model="queryParam.barCode" name="queryParam_barCode" />
          </ody-search-item>
          <ody-search-item :label="$t('商品类目') + ':'" prop="categoryNameList">
            <ody-tree-select
              v-model="categoryNameList"
              :multiple="true"
              :append-to-body="true"
              :options="categoryTreeData"
              :placeholder="$t('请选择类目')"
              name="categoryNameList"
              value-consists-of="LEAF_PRIORITY"
            />
          </ody-search-item>
          <ody-search-item :label="$t('商品品牌')+ ':'" prop="brandName">
            <el-input
              v-model="queryParam.brandName"
              :placeholder="$t('请选择品牌')"
              name="queryParam_brandName"
              @focus="openBrandModal"
            />
          </ody-search-item>
          <ody-search-item :label="$t('单据编号')+ ':'" prop="billCode">
            <el-input v-model="queryParam.billCode" name="queryParam_billCode" />
          </ody-search-item>
          <ody-search-item :label="$t('单据类型')+ ':'" prop="billType">
            <el-select v-model="queryParam.billType" :placeholder="$t('全部')" name="queryParam_billType">
              <el-option
                v-for="(value, key) in billTypeMap"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('完成日期')+ ':'" prop="createTimeRange">
            <ody-date-range-picker
              v-model="queryParam.createTimeRange"
              :placeholder="$t('选择日期')"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="queryParam_createTime"
              value-format="yyyy-MM-dd"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="Stock2002QueryPage_handleQuery"
          size="small"
          type="primary"
          code="Stock2002QueryPage"
          @click="handleQuery"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" @tab-click="tabChange">
          <el-tab-pane :label="$t('期间汇总表')" name="-1" />
          <el-tab-pane :label="$t('日汇总报表')" name="1" />
        </el-tabs>
      </div>
      <div v-show="hideTable" slot="btn-bottom">
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          name="Stock2002PeriodSummary"
          code="Stock2002PeriodSummary"
          size="small"
          class="btn-right"
        >{{ $t('导出') }}</ody-batch-export-button>
        <ody-export-task-button
          pool="product"
          task-type="imReceiveUseBillCycleReportExport"
          name="Stock2002PeriodSummary_viewTask"
          code="Stock2002PeriodSummary"
          size="small"
          class="btn-right"
        >{{ $t('查看任务') }}</ody-export-task-button>
      </div>
      <div v-show="hideTable" slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :show-summary="showPeriodtotal"
          :summary-method="getPeriodtotal"
          :operates="operates"
          name="list676"
        />
      </div>
      <div v-show="hideDailyTable" slot="btn-bottom">
        <ody-batch-export-button
          :get-export-data="exportModelByDaily.getExportData"
          :export-api="exportModelByDaily.exportApi"
          :async="exportModelByDaily.async"
          :pool="exportModelByDaily.pool"
          :task-type="exportModelByDaily.taskType"
          name="Stock2002DaySummary"
          code="Stock2002DaySummary"
          size="small"
          class="btn-right"
        >{{ $t('导出') }}</ody-batch-export-button>
        <ody-export-task-button
          pool="product"
          task-type="imReceiveUseBillDailyExport"
          name="Stock2002PeriodSummary_viewTask"
          code="Stock2002PeriodSummary"
          size="small"
          class="btn-right"
        >{{ $t('查看任务') }}</ody-export-task-button>
      </div>
      <div v-show="hideDailyTable" slot="table">
        <ody-table
          :loading="loading"
          :data="dailyList"
          :show-summary="showDailyTotal"
          :summary-method="getDailyTotal"
          :columns="dailyColumns"
          :operates="operates"
          name="dailyList476"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="dailyList"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="pageChange"
          @current-change="change"
        />
      </div>
    </ody-list-table-area>
    <!-- 品牌模态框组件 --->
    <brand-modal-component :visible.sync="brandVisible" @ok="closeBrandModal" />
  </section>
</template>

<script>
import stockConstant from '@/constant/stockConstant.js'
import AsyncExportList from '@/components/asyncExportList'

export default {
  components: {
    AsyncExportList
  },
  data() {
    return {
      exportModel: {
        exportApi: ['back-product-web', 'back/asyncExcel/imReceiveUseBillCycleReportExportHandler', 'exportData.do'],
        pool: 'product',
        taskType: 'imReceiveUseBillCycleReportExport',
        async: true,
        getExportData: () => {
          return { filters: this.queryParam }
        }
      },
      exportModelByDaily: {
        exportApi: ['back-product-web', 'back/asyncExcel/imReceiveUseBillDailyExportHandler', 'exportData.do'],
        pool: 'product',
        taskType: 'imReceiveUseBillDailyExport',
        async: true,
        getExportData: () => {
          return { filters: this.queryParam }
        }
      },
      activeState: '-1',
      loading: false,
      hideTable: true,
      hideDailyTable: false,
      brandVisible: false,
      queryParam: getDefaultQueryParam(this.activeState),
      merchantList: [],
      warehouseList: [],
      categoryTreeData: [],
      billTypeMap: stockConstant.IM_RECEIVE_USE_BILL_BILL_TYPE,
      list: [],
      dailyList: [],
      taskType: 'imWarehouseRealStockExport',
      dialogCycleTableVisible: false,
      dialogDailyTableVisible: false,
      dailyTotal: 0,
      periodtotal: 0,
      // iframeCycleSrc: `${iframeHost}/ouser-web/saas.html#/asyncTaskManage?taskType=imReceiveUseBillCycleReportExport`, // 弹窗访问地址
      // iframeDailySrc: `${iframeHost}/ouser-web/saas.html#/asyncTaskManage?taskType=imReceiveUseBillDailyExport`, // 弹窗访问地址
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('商家名称'),
          align: 'center'
        },
        {
          show: true,
          prop: 'warehouseName',
          label: this.$t('仓库名称'),
          align: 'center'
        },
        {
          show: true,
          prop: 'code',
          label: this.$t('商品编码'),
          minWidth: 200
        },
        {
          show: true,
          prop: 'barCode',
          label: this.$t('商品条码'),
          minWidth: 200
        },
        {
          show: true,
          prop: 'chineseName',
          label: this.$t('商品名称'),
          align: 'center'
        },
        {
          show: true,
          prop: 'categoryFullNamePath',
          label: this.$t('商品类目'),
          minWidth: 200
        },
        {
          show: true,
          prop: 'brandName',
          label: this.$t('商品品牌'),
          align: 'center'
        },
        {
          show: true,
          prop: 'mainUnitName',
          label: this.$t('主计量单位'),
          align: 'center'
        },
        {
          show: true,
          prop: 'billCode',
          label: this.$t('单据编号'),
          minWidth: 200
        },
        {
          show: true,
          prop: 'billType',
          label: this.$t('单据类型'),
          align: 'center',
          formatter: row => {
            // 入参是本行的对象
            return this.billTypeMap[row.billType]
          }
        },
        {
          show: true,
          prop: 'sumReceiveUseNum',
          label: this.$t('领用数量'),
          align: 'center'
        }
      ],
      dailyColumns: [
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('商家名称'),
          align: 'center'
        },
        {
          show: true,
          prop: 'warehouseName',
          label: this.$t('仓库名称'),
          align: 'center'
        },
        {
          show: true,
          prop: 'code',
          label: this.$t('商品编码'),
          minWidth: 200
        },
        {
          show: true,
          prop: 'barCode',
          label: this.$t('商品条码'),
          minWidth: 200
        },
        {
          show: true,
          prop: 'chineseName',
          label: this.$t('商品名称'),
          align: 'center'
        },
        {
          show: true,
          prop: 'mainUnitName',
          label: this.$t('主计量单位'),
          align: 'center'
        },
        {
          show: true,
          prop: 'categoryFullNamePath',
          label: this.$t('商品类目'),
          minWidth: 200
        },
        {
          show: true,
          prop: 'brandName',
          label: this.$t('商品品牌'),
          align: 'center'
        },
        {
          show: true,
          prop: 'completeTime',
          label: this.$t('完成日期'),
          minWidth: 200,
          formatter: row => {
            // 入参是本行的对象
            return this.dateFormat(row.completeTime)
          }
        },
        {
          show: true,
          prop: 'billCode',
          label: this.$t('单据编号'),
          minWidth: 200
        },
        {
          show: true,
          prop: 'billType',
          label: this.$t('单据类型'),
          align: 'center',
          formatter: row => {
            // 入参是本行的对象
            return this.billTypeMap[row.billType]
          }
        },
        {
          show: true,
          prop: 'sumReceiveUseNum',
          label: this.$t('领用数量'),
          align: 'center'
        },
        {
          show: true,
          prop: 'createUsername',
          label: this.$t('创建人'),
          align: 'center'
        }
      ]
    }
  },
  watch: {
    'queryParam.merchantId': function(newVal, oldVal) {
      if (newVal) {
        this.getWarehouseByMerchantId(newVal)
      } else {
        this.warehouseList = []
        this.queryParam.warehouseId = null
      }
    }
  },
  async mounted() {
    try {
      this.mpApi = this.$product.$api.mpApi
      this.merchantApi = this.$product.$api.merchantApi
      this.stockApi = this.$product.$api.stockApi
      this.authApi = this.$product.$api.authApi
      this.loading = true
      await this.queryList()
      await this.queryMerchantList()
      await this.queryBackedRootCategory()
    } catch (e) {
      console.log(e)
    } finally {
      this.loading = false
    }
    setTimeout(() => {
      // 不能async修改，通过showSummary再控制
      this.getDailyTotal = ({ columns, data }) => [
        this.$t('合计'),
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        this.dailyTotal
      ]
      this.showDailyTotal = true
      this.getPeriodtotal = ({ columns, data }) => [
        this.$t('合计'),
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        this.periodtotal
      ]
      this.showPeriodtotal = true
    }, 1000)
  },
  methods: {
    async handleQuery() {
      this.page.currentPage = 1
      await this.queryList()
    },
    // 商家商品列表查询
    async queryList(obj) {
      if (this.queryParam.createTimeRange && this.queryParam.createTimeRange.length > 1) {
        this.queryParam.createBeginDate = this.$portal.parseTime(this.queryParam.createTimeRange[0], '{y}-{m}-{d}')
        this.queryParam.createEndDate = this.$portal.parseTime(this.queryParam.createTimeRange[1], '{y}-{m}-{d}')
      }
      // 验证输入的日期是否符合要求
      if (
        !this.validateDate(
          this.queryParam.createBeginDate,
          this.queryParam.createEndDate
        )
      ) {
        return
      }
      this.loading = true
      this.queryParam.categoryIds = this.categoryNameList
      if (this.activeState === '-1') {
        obj = {}
        this.hideDailyTable = false
        this.hideTable = true
        await this.listImReceiveUseBillCycleReportByPage(obj)
      } else if (this.activeState === '1') {
        this.hideDailyTable = true
        this.hideTable = false
        await this.listImReceiveUseBillDailyByPage(obj)
      } else {
        this.hideDailyTable = false
        this.hideTable = true
        await this.listImReceiveUseBillCycleReportByPage(obj)
      }
      this.loading = false
    },
    // tab切换 查询
    async tabChange(tab, event) {
      this.page.current = 1
      this.page.total = 0
      this.page.size = 10
      if (this.activeState === '-1') {
        this.hideDailyTable = false
        this.hideTable = true
      } else if (this.activeState === '1') {
        this.hideDailyTable = true
        this.hideTable = false
      } else {
        this.hideDailyTable = false
        this.hideTable = true
      }
      this.handleSearchReset()
    },
    // 商品领用查询-日报
    async listImReceiveUseBillDailyByPage(obj) {
      this.list = []
      const param = Object.assign({}, this.queryParam, this.page, obj)
      return this.stockApi.listImReceiveUseBillDailyByPage(param).then(res => {
        this.dailyList = res.data.listObj
        this.page.total = res.data.total
        let sum = 0
        for (var data of this.dailyList) {
          sum += data.sumReceiveUseNum
        }
        this.dailyTotal = sum
      })
    },
    // 商品领用查询-周期报表
    async listImReceiveUseBillCycleReportByPage(obj) {
      this.dailyList = []
      const param = Object.assign({}, this.queryParam, this.page, obj)
      return this.stockApi
        .listImReceiveUseBillCycleReportByPage(param)
        .then(res => {
          this.list = res.data.listObj
          this.page.total = res.data.total
          let sum = 0
          for (var data of this.list) {
            sum += data.sumReceiveUseNum
          }
          this.periodtotal = sum
        })
    },
    getWarehouseByMerchantId(merchantId) {
      if (!merchantId) {
        this.warehouseList = []
        this.queryParam.warehouseId = null
        return
      }
      this.merchantApi
        .queryPlatformAuthWarehousePage({ currentPage: 1, itemsPerPage: 500 })
        .then(res => {
          this.warehouseList = res.data.listObj.filter(item => {
            return item.merchantId === merchantId
          })
        })
    },
    // 查询后台类目树根节点
    async queryBackedRootCategory() {
      return this.mpApi.listBackCategory().then(res => {
        var arr = res.data
        this.categoryTreeData = toTree(arr)
      })
    },
    // 类目节点点击事件
    handleCategoryTreeSelect(treeNode) {
      this.mpApi
        .queryCategoryListByParent({ parentId: treeNode.id })
        .then(res => {
          if (res.data.length === 0) {
            return
          }
          this.$set(treeNode, 'children', [])
          for (var i = 0; i < res.data.length; i++) {
            treeNode.children.push({
              id: res.data[i].id,
              label: res.data[i].name
            })
          }
        })
    },
    queryMerchantList: queryMerchantList,
    handleTableEdit(index, row) {
      this.$router.push({
        name: 'OuserWebYyEdit',
        params: {
          id: row.id
        }
      })
    },
    openBrandModal: openBrandModal,
    closeBrandModal: closeBrandModal,
    async handleTabsClick() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.queryParam = getDefaultQueryParam(this.activeState)
      this.queryParam.categoryIds = null
      this.categoryNameList = null
      this.warehouseList = []
    },
    async handlePageSizeChange() {
      try {
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
    validateDate(createBeginDate, createEndDate) {
      // if (!createBeginDate || !createEndDate) {
      //   this.$message({
      //     showClose: true,
      //     message: this.$t('完成时间不能为空！'),
      //     type: 'error'
      //   })
      //   return false
      // }

      if (
        Math.floor((createEndDate - createBeginDate) / 1000 / 60 / 60 / 24) >
        180
      ) {
        this.$message({
          showClose: true,
          message: this.$t('最多查询180天的数据！'),
          type: 'error'
        })
        return false
      }
      if (createBeginDate > createEndDate) {
        this.$message({
          showClose: true,
          message: this.$t('起始时间不能大于终止时间！'),
          type: 'error'
        })
        return false
      }
      return true
    },
    pageChange(val) {
      this.page.itemsPerPage = val
      this.queryList()
    },
    change(val) {
      this.page.current = val
      this.page.currentPage = val
      this.queryList()
    },
    // 时间格式化函数
    dateFormat: time => {
      if (!(time == null || time === '')) {
        const date = new Date(time)
        const year = date.getFullYear()
        const month =
          date.getMonth() + 1 < 10
            ? `0${date.getMonth() + 1}`
            : date.getMonth() + 1
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        return `${year}-${month}-${day}`
      } else {
        return time
      }
    }
  }
}

// 查询当前登录用户有权限的商家
async function queryMerchantList() {
  return this.merchantApi
    .queryPlatformAuthMerchantPage({ currentPage: 1, itemsPerPage: 500 })
    .then(res => {
      this.merchantList = []
      const merchantIds = []
      for (const warehouse of res.data.listObj) {
        if (merchantIds.indexOf(warehouse.merchantId) === -1) {
          merchantIds.push(warehouse.merchantId)
          this.merchantList.push({
            merchantId: warehouse.merchantId,
            merchantCode: warehouse.merchantCode,
            merchantName: warehouse.merchantName
          })
        }
      }
    })
}

// 打开品牌模态框
function openBrandModal() {
  this.brandVisible = !this.brandVisible
}

// 关闭品牌模态框
function closeBrandModal(selectVal) {
  // 返回模态框返回的对象
  console.log(selectVal)
  this.queryParam = Object.assign(
    {},
    this.queryParam,
    selectVal ? { brandId: selectVal.id, brandName: selectVal.name } : {}
  )
}

function getDefaultQueryParam(activeState) {
  var datetime = activeState === '1' ? 24 : 24 * 7
  const startTime = formate(new Date(new Date().setHours(new Date().getHours() - datetime)), 'yyyy-MM-dd hh:mm:ss')
  const endTime = formate(new Date(new Date()), 'yyyy-MM-dd hh:mm:ss')
  return Object.assign(
    {},
    {
      createBeginDate: startTime,
      createEndDate: endTime,
      createTimeRange: [startTime, endTime],
      currentPage: 1,
      itemsPerPage: 10
    }
  )
}

function toTree(data) {
  data.forEach(function(item) {
    delete item.children
  })
  var map = {}
  data.forEach(function(item) {
    map[item.id] = item
  })
  var val = []
  data.forEach(function(item) {
    var parent = map[item.parentId]
    item.label = item.name
    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      val.push(item)
    }
  })
  return val
}

function formate(date, fmt) { // author: meizz
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  }
  return fmt
}
</script>

<style lang="scss" scoped>
 .btn-right{
   margin-right: 16px;
 }
</style>
