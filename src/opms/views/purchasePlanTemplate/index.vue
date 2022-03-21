<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('merchant_name')+':'" prop="merchantName">
            <el-input
              v-model="search.merchantName"
              :placeholder="$t('common_choose_please')"
              name="search_merchantName"
              readonly="true"
              @click.native="visible=true"
            />
          </ody-search-item>
          <ody-search-item :label="$t('purchase_plan_type')+':'" prop="planType">
            <el-select
              v-model="search.planType"
              :placeholder="$t('common_choose_please')"
              name="search_planType"
            >
              <el-option
                v-for="(item,index) in planTypeList"
                :key="index"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('purchase_plan_filed_code')+':'" prop="templateCode">
            <el-input v-model="search.templateCode" name="search_templateCode" />
          </ody-search-item>
          <ody-search-item :label="$t('common_createTime')+':'" prop="createTimeRange">
            <ody-date-range-picker
              v-model="createTimeRange"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              type="date"
              name="search_endCreateTime"
              value-format="yyyy-MM-dd"
              @change="changeCreateTime">range-separator="-"/></ody-date-range-picker>
              <!-- <el-date-picker
              v-model="createTimeRange"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="search_endCreateTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              style="width: 100%"
              @change="changeCreateTime"/> -->
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('reset') }}</el-button>
        <ody-button
          name="center_11030101_handleSelect"
          size="small"
          type="primary"
          code="center_11030101"
          @click="handleSelect"
        >{{ $t('query') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          name="center_11030103_add"
          size="small"
          type="primary"
          code="center_11030103"
          @click="add"
        >{{ $t('newly_added') }}</ody-button>
        <ody-button
          :disabled="selectedRows.length<=0"
          name="center_11030105_patchDelete"
          size="small"
          code="center_11030105"
          @click="patchDelete"
        >{{ $t('batch_deleting') }}</ody-button>
        <ody-button
          name="center_11030102_download"
          size="small"
          code="center_11030102"
          @click="download"
        >{{ $t('export') }}</ody-button>
      </div>
      <div slot="table">
        <el-table
          v-loading="loading"
          :data="tableList"
          name="tableList553"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column :label="$t('merchant_name')" prop="merchantName" />
          <el-table-column :label="$t('purchase_plan_filed_code')">
            <template slot-scope="scope">
              <a name="show" class="link-type" @click="show(scope.row)">{{ scope.row.templateCode }}</a>
            </template>
          </el-table-column>
          <el-table-column :label="$t('purchase_plan_type')" prop="planTypeStr" align="center" />
          <el-table-column :label="$t('common_createTime')" prop="createTimeStr" align="center" />
          <el-table-column :label="$t('common_time_createUser')" prop="createUsername" />
          <el-table-column :label="$t('common_operation')" fixed="right" width="200">
            <template slot-scope="scope">
              <ody-button
                name="center_11030104_edit"
                size="mini"
                class="link-type"
                code="center_11030104"
                @click="edit(scope.row)"
              >{{ $t('edit') }}</ody-button>
              <ody-button
                name="center_11030105_deleteRow"
                size="mini"
                class="link-type"
                code="center_11030105"
                @click="deleteRow(scope.row)"
              >{{ $t('delete') }}</ody-button>
            </template>
          </el-table-column>
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
    <MerchantSelectModal :visible.sync="visible" @ok="selectMerchant" />
    <purchase-plan-template-details
      :dialog-visible.sync="dialogVisible2"
      :plan-type-list="planTypeList"
      :id="id"
      :merchant="merchantOfNew"
      :page-type="pageType"
      @ok="detailsOk"
    />
    <MerchantSelectModal :visible.sync="dialogVisible" @ok="selectMerchant2" />
  </section>
</template>

<script>
import MerchantSelectModal from '@/components/merchantModal'
import PurchasePlanTemplateDetails from './details/index'

const search = {
  merchantId: null,
  merchantCode: null,
  merchantName: null,
  planType: null,
  templateCode: null,
  startCreateTime: null,
  endCreateTime: null
}
export default {
  name: 'OpmsPurchasePlanTemplate',
  components: { PurchasePlanTemplateDetails, MerchantSelectModal },
  data() {
    const vue = this
    return {
      dialogVisible2: false,
      dialogVisible: false,
      id: null,
      pageType: null,
      loading: false,
      createTimeRange: [],
      search: { ...search },
      visible: false,
      tableList: [],
      selectedRows: [],
      planTypeList: [],
      page: {
        current: 1,
        size: 10,
        total: 0,
        handleSizeChange() {
          vue.handleSelect()
        },
        handleCurrentChange(val) {
          vue.page.current = val
          vue.updateList()
        }
      },
      merchantOfNew: null
    }
  },
  async created() {
    this.loadPlanTypeList()
    this.updateList()
  },
  methods: {
    changeCreateTime(val) {
      if (val && val.length > 1) {
        this.search.startCreateTime = val[0]
        this.search.endCreateTime = val[1]
      } else {
        this.search.startCreateTime = null
        this.search.endCreateTime = null
      }
    },
    add() {
      this.pageType = 'isNew'
      this.id = null
      this.dialogVisible = true
    },
    patchDelete() {
      const data = this.selectedRows.map(item => item.id)
      this.delete(data)
    },
    edit(row) {
      this.id = row.id
      this.pageType = 'isEdit'
      this.dialogVisible2 = true
    },
    show(row) {
      if (this.$portal.hasPermission('OpmsPurchasePlanTemplate11')) {
        this.id = row.id
        this.pageType = 'isShow'
        this.dialogVisible2 = true
      }
    },
    deleteRow(row) {
      this.delete([row.id])
    },
    handleSelectionChange(selected) {
      this.selectedRows = selected
    },
    selectMerchant(merchant) {
      this.search.merchantId = merchant.merchantId
      this.search.merchantName = merchant.merchantName
      this.search.merchantCode = merchant.merchantCode
    },
    async handleSelect() {
      this.page.current = 1
      await this.updateList()
    },
    handleReset() {
      this.search = { ...search }
    },
    download() {
      const data = {
        page: this.page.current,
        limit: this.page.size,
        filters: this.search
      }
      this.$portal.downloadFileByGet(
        'api/opms-web/purchasePlanTemplate/export.do',
        { queryContent: JSON.stringify(data) },
        '采购计划模板.xlsx'
      )
    },
    async loadPlanTypeList() {
      const res = await this.$opms.$api.code.list({ category: 'PLAN_TYPE' })
      this.planTypeList = res.data
    },
    async updateList() {
      this.loading = true
      try {
        const res = await this.$opms.$api.purchasePlanTemplate.listPage({
          page: this.page.current,
          limit: this.page.size,
          filters: this.search
        })
        this.tableList = res.data
        this.page.total = res.total
      } finally {
        this.loading = false
      }
    },
    delete(rowIds) {
      this.$confirm(this.$t('确认删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$portal
          .post('/opms-web/purchasePlanTemplate/delete.do', rowIds)
          .then(res => {
            this.handleSelect()
          })
      })
    },
    selectMerchant2(merchant) {
      this.merchantOfNew = merchant
      this.dialogVisible2 = true
    },
    detailsOk() {
      if (this.pageType === 'isNew') {
        this.handleSelect()
      }
    }
  }
}
</script>

<style scoped>
</style>
