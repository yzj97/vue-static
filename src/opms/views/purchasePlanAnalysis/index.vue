<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <!-- 商家名称 -->
          <ody-search-item :label="$t('common_merchant_name') + ':'" prop="merchantName">
            <el-input
              v-model="searchForm.merchantName"
              name="searchForm_merchantName"
              readonly="readonly"
              @click.native="showMerchantSelectModal"
            />
          </ody-search-item>
          <!-- 计划单号 -->
          <ody-search-item :label="$t('project_umber') + ':'" prop="projectNumber">
            <el-input v-model="searchForm.projectNumber" name="searchForm_projectNumber" />
          </ody-search-item>
          <!-- 商品编码 -->
          <ody-search-item :label="$t('common_product_code') + ':'" prop="productCode">
            <el-input v-model="searchForm.productCode" name="searchForm_productCode" size="medium" />
          </ody-search-item>
          <!-- 商品名称 -->
          <ody-search-item :label="$t('common_product_name') + ':'" prop="productName">
            <el-input v-model="searchForm.productName" name="searchForm_productName" size="medium" />
          </ody-search-item>
          <!-- 开始日期 -->
          <ody-search-item :label="$t('plan_start_date') + ':'" class="register" prop="planStartDate">
            <ody-date-range-picker
              v-model="searchForm.planStartDate"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              type="date"
              name="searchForm_planStartDate"
              value-format="yyyy-MM-dd">range-separator="-"/></ody-date-range-picker>
              <!-- <el-date-picker
              v-model="searchForm.planStartDate"
              name="searchForm_planStartDate"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
            /> -->
          </ody-search-item>
          <ody-search-item :label="$t('execution_status') + ':'" prop="executionStatus">
            <el-select v-model="searchForm.executionStatus" name="searchForm_executionStatus">
              <el-option :label="$t('common_status_all')" />
              <el-option
                v-for="item in statusList"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <!-- 结束日期 -->
          <ody-search-item :label="$t('plan_end_date') + ':'" class="register" prop="planExpiryDate">
            <ody-date-range-picker
              v-model="searchForm.planExpiryDate"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              type="date"
              name="searchForm_planExpiryDate"
              value-format="yyyy-MM-dd">range-separator="-"/></ody-date-range-picker>
              <!-- <el-date-picker
              v-model="searchForm.planExpiryDate"
              name="searchForm_planExpiryDate"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
            /> -->
          </ody-search-item>
          <!-- 商品类目 -->
          <ody-search-item :label="$t('supplier_product_categoryName') + ':'" prop="categoryId">
            <ody-tree-select
              v-model="categoryIds"
              :multiple="true"
              :disable-branch-nodes="true"
              :options="commodityCategoriesData"
              :append-to-body="true"
              :z-index="3000"
              name="categoryIds"
            />
            <!-- 执行状态 -->
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="CP10810001_handleSearchSubmit"
          size="small"
          type="primary"
          code="CP10810001"
          @click="handleSearchSubmit"
        >{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button name="CP10810002_exportData" size="small" code="CP10810002" @click="exportData">{{ $t('common_export') }}</ody-button>
        <ody-button
          name="CP10810002_exportDataAll"
          size="small"
          code="CP10810002"
          @click="exportDataAll"
        >{{ $t('common_export_all') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table :loading="loading" :data="list" :columns="columns" :operates="operates" name="list410" />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
    </ody-list-table-area>
    <MerchantSelectModal :visible.sync="showMerchantModal" @ok="selectMerchant" />
  </section>
</template>
<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
import MerchantSelectModal from '@/components/merchantModal'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'OpmsPurchasePlanAnalysis',
  components: {
    MerchantSelectModal,
    Treeselect
  },
  data() {
    return {
      fuckinput: '??',
      categorNode: {
        children: 'children',
        label: 'label'
      },
      planStartDate: '',
      planExpiryDate: '',
      showMerchantModal: false, // 模态框显示隐藏
      searchForm: getDefaultSearchForm(),
      loading: false,
      list: [], // 商品数据
      statusList: [], // 执行状态
      categoryIds: null, // 类目名称
      isAll: 0, // 记录导出是否为全部
      page: {
        // 分页
        size: 10,
        current: 1, // 当前页
        total: 0 // 总个数
      },
      planStartDateStart: null,
      planStartDateEnd: null,
      planExpiryDateStart: null,
      planExpiryDateEnd: null,

      columns: [
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('商家名称'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'planCode',
          label: this.$t('计划单号'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'executionStatusText',
          label: this.$t('执行状态'),
          align: 'center'
        },
        {
          show: true,
          prop: 'planTypeText',
          label: this.$t('计划类型'),
          align: 'center'
        },
        {
          show: true,
          prop: 'planStartDateText',
          label: this.$t('计划开始期'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'planExpiryDateText',
          label: this.$t('计划截止日'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'mpCode',
          label: this.$t('商品编码'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'mpName',
          label: this.$t('商品名称'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'categoryName',
          label: this.$t('商品类目'),
          align: 'center',
          minWidth: 200
        },
        // {
        //   show: true,
        //   prop: 'receiveMerchantName',
        //   label: this.$t('商品品牌'),
        //   align: 'center',
        //   minWidth: 150
        // },
        {
          show: true,
          prop: 'mpMeasureUnitName',
          label: this.$t('主计量单位'),
          align: 'center'
        },
        {
          show: true,
          prop: 'approvedPurchaseNum',
          label: this.$t('采购计划数量'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'purchaseWiTaxPrice',
          label: this.$t('含税采购价'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'purchaseTaxRateText',
          label: this.$t('税率(%)'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'purchaseWoTaxPrice',
          label: this.$t('未税采购价'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'actualPurchaseNum',
          label: this.$t('已下单数量'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'noConfirmOrderNum',
          label: this.$t('未下单数量'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'storageCount',
          label: this.$t('已到货数量'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'noStorageCount',
          label: this.$t('未到货数量'),
          align: 'center',
          minWidth: 200
        }
      ],
      commodityCategoriesData: []
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    changeInput(e) {
      alert(e)
    },
    showMerchantSelectModal() {
      this.showMerchantModal = true
    },
    // 选中的商家名称
    selectMerchant(result) {
      if (result) {
        this.searchForm.merchantCode = result.merchantCode
        this.searchForm.merchantId = result.merchantId
        this.searchForm.merchantName = result.merchantName
      }
    },
    async handleTabsClick() {
      try {
        this.currentTab = this.tabs[this.activeState]
        this.searchForm.pickStatus = this.currentTab.pickStatus
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async updateList() {
      try {
        this.loading = true
        await loadList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    // 查询
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    // 导出
    async exportData() {
      try {
        await exportData(this)
      } catch (ex) {
        console.log(ex)
      }
    },
    // 导出全部
    async exportDataAll() {
      try {
        this.isAll = 1
        await exportData(this)
      } catch (ex) {
        console.log(ex)
      }
    },
    // 重置
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
      this.planStartDateStart = null
      this.planStartDateEnd = null
      this.planExpiryDateStart = null
      this.planExpiryDateEnd = null
      this.categoryIds = null
      var dateNow = new Date()
      var dateAdd = new Date(dateNow)
      var dateSub = new Date(dateNow)
      dateAdd.setDate(dateNow.getDate() + 30)
      dateSub.setDate(dateNow.getDate() - 30)
      this.searchForm.planStartDate = [this.$portal.parseTime(dateSub, '{y}-{m}-{d}'), this.$portal.parseTime(dateNow, '{y}-{m}-{d}')]
      this.searchForm.planExpiryDate = [this.$portal.parseTime(dateNow, '{y}-{m}-{d}'), this.$portal.parseTime(dateAdd, '{y}-{m}-{d}')]
    },
    // 一页显示个数
    handlePageSizeChange() {
      this.handleSearchSubmit()
    },
    // 页码
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    _initCodes() {
      const vue = this
      vue.$opms.$api.code
        .listMulti({ categories: ['EXECUTION_STATUS'] })
        .then(data => {
          if (data.data.EXECUTION_STATUS) {
            vue.statusList = data.data.EXECUTION_STATUS
          }
        })
    },
    init() {
      var dateNow = new Date()
      var dateAdd = new Date(dateNow)
      var dateSub = new Date(dateNow)
      dateAdd.setDate(dateNow.getDate() + 30)
      dateSub.setDate(dateNow.getDate() - 30)
      this.searchForm.planStartDate = [this.$portal.parseTime(dateSub, '{y}-{m}-{d}'), this.$portal.parseTime(dateNow, '{y}-{m}-{d}')]
      this.searchForm.planExpiryDate = [this.$portal.parseTime(dateNow, '{y}-{m}-{d}'), this.$portal.parseTime(dateAdd, '{y}-{m}-{d}')]
      this._initCodes()
      this.updateList()
      commodityCategories(this)
    }
  }
}

async function exportData(vue) {
  await loadList(vue, true)
}
// 获取数据
async function loadList(vue, isExport = false) {
  if (vue.searchForm.planStartDate) {
    vue.planStartDateStart = vue.searchForm.planStartDate[0]
    vue.planStartDateEnd = vue.searchForm.planStartDate[1]
  } else {
    vue.planStartDateStart = null
    vue.planStartDateEnd = null
  }
  if (vue.searchForm.planExpiryDate) {
    vue.planExpiryDateStart = vue.searchForm.planExpiryDate[0]
    vue.planExpiryDateEnd = vue.searchForm.planExpiryDate[1]
  } else {
    vue.planExpiryDateStart = null
    vue.planExpiryDateEnd = null
  }
  const param = {
    currentPage: vue.page.current,
    itemsPerPage: vue.page.size,
    obj: {
      categoryIds: vue.categoryIds, // 类目名称
      merchantId: vue.searchForm.merchantId, // 商家id

      planStartDateStart: vue.planStartDateStart, // 开始时间 查询条件开始
      planStartDateEnd: vue.planStartDateEnd, // 开始时间 查询条件结束
      planExpiryDateStart: vue.planExpiryDateStart, // 计划失效日期 - 查询条件开始
      planExpiryDateEnd: vue.planExpiryDateEnd, // 计划失效日期 - 查询条件结束

      // planStartDateStart: vue.searchForm.planStartDate[0] || null, // 开始时间 查询条件开始
      // planStartDateEnd: vue.searchForm.planStartDate[1] || null, // 开始时间 查询条件结束
      // planExpiryDateStart: vue.searchForm.planExpiryDate[0] || null, // 计划失效日期 - 查询条件开始
      // planExpiryDateEnd: vue.searchForm.planExpiryDate[1] || null, // 计划失效日期 - 查询条件结束
      executionStatus: vue.searchForm.executionStatus, // 执行状态
      mpCode: vue.searchForm.productCode, // 商品编号
      mpName: vue.searchForm.productName, // 商品名称
      planCode: vue.searchForm.projectNumber // 计划单号
    }
  }
  const purchasePlanAnalysis = vue.$opms.$api.purchasePlanAnalysis
  if (!isExport) {
    const res = await purchasePlanAnalysis.planItemStatistical(param)
    // console.log(res)
    if (res.code) {
      vue.list = res.data
      vue.page.total = res.total
    }
  } else {
    // 导出exel
    if (vue.isAll === 0) {
      vue.$portal.downloadFileByGet(
        'api/opms-web/purchasePlanItems/exportPlanItemStatistical.do',
        { obj: JSON.stringify(param) }
      )
    } else {
      param.currentPage = 1
      param.itemsPerPage = 30000
      vue.$portal.downloadFileByGet(
        'api/opms-web/purchasePlanItems/exportPlanItemStatistical.do',
        { obj: JSON.stringify(param) }
      )
      vue.isAll = 0
    }
  }
}

function getDefaultSearchForm() {
  return Object.assign(
    {},
    {
      planStartDate: [],
      planExpiryDate: []
    }
  )
}

// 商品类目
async function commodityCategories(vue) {
  const purchasePlanAnalysis = vue.$opms.$api.purchasePlanAnalysis
  const res = await purchasePlanAnalysis.listNodes()
  getSelectedNode(res.data, res.data)
  vue.commodityCategoriesData = res.data
}

// 删除空的children
function getSelectedNode(nodeData, parent) {
  nodeData.forEach(item => {
    if ('children' in item && item.children.length === 0) {
      delete item.children
    } else if ('children' in item && item.children.length) {
      getSelectedNode(item.children, item)
    }
  })
}
</script>

<style lang="scss" scoped>
.cp-list-search-area .box {
  overflow: visible !important;
}
</style>
